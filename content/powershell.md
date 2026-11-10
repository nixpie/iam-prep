# PowerShell: co robi ten skrypt?
> Czytanie skryptów na głos. Schemat odpowiedzi: co bierze, co filtruje, co zmienia, na co bym uważał.

## What does this command do?
```powershell
Get-ADUser -Filter 'Enabled -eq $false' -SearchBase "OU=Staff,DC=firm,DC=com" -Properties LastLogonDate |
    Select-Object Name, SamAccountName, LastLogonDate |
    Export-Csv C:\Reports\disabled.csv -NoTypeInformation
```
---
It finds all disabled user accounts in the Staff OU, keeps three columns - name, logon name and last logon date - and writes them to a CSV file.

It is read-only: nothing in AD is changed. `-Properties` is needed because `LastLogonDate` is not returned by default.
PL: Zawsze powiedz na głos, czy skrypt tylko CZYTA (Get, Select, Export), czy ZMIENIA (Set, New, Remove, Add, Disable, Move). To pierwsza rzecz, którą chce usłyszeć ktoś, kto sprawdza, czy rozumiesz kod.

## What does this script do, and what would you improve?
```powershell
$users = Import-Csv .\newhires.csv
foreach ($u in $users) {
    $params = @{
        Name                  = "$($u.FirstName) $($u.LastName)"
        GivenName             = $u.FirstName
        Surname               = $u.LastName
        SamAccountName        = $u.Login
        UserPrincipalName     = "$($u.Login)@firm.com"
        Path                  = "OU=NewHires,DC=firm,DC=com"
        AccountPassword       = (ConvertTo-SecureString $u.TempPassword -AsPlainText -Force)
        Enabled               = $true
        ChangePasswordAtLogon = $true
    }
    New-ADUser @params
}
```
---
It reads a CSV of new hires and creates one enabled AD account per row in the NewHires OU, with a temporary password that must be changed at first logon.

`$params` is a hashtable, and `@params` passes it to `New-ADUser` as named parameters - that is called splatting.

Improvements: check whether the account already exists, wrap the creation in try/catch and log the result, and do not keep passwords in a CSV file.

## What does this do? Is it safe to run?
```powershell
Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly |
    Where-Object { $_.Enabled } |
    Disable-ADAccount -WhatIf
```
---
It finds user accounts with no logon for 90 days, keeps only the ones still enabled, and would disable them.

Because of `-WhatIf` it is safe: it only prints what it would do. Without `-WhatIf` I would not run it as is - the list can include service accounts and brand-new accounts that have never logged on. I would export the list first, review it and exclude those.

## What does this return?
```powershell
Get-ADGroupMember "GRP-Finance-RW" -Recursive |
    Where-Object objectClass -eq 'user' |
    Get-ADUser -Properties Department, Enabled |
    Select-Object Name, Department, Enabled
```
---
Everyone who effectively has the access that the group GRP-Finance-RW gives - with their department and whether the account is enabled.

`-Recursive` expands nested groups, so it also returns users who are members through another group. It is a typical access-review report.

## What does this do, and what is the problem with it?
```powershell
$groups = Get-ADPrincipalGroupMembership -Identity asmith |
    Where-Object Name -ne 'Domain Users'
foreach ($g in $groups) {
    Add-ADGroupMember -Identity $g -Members bjones
}
```
---
It reads all groups that asmith belongs to and adds bjones to every one of them - it clones one user's access to another.

Technically it works. The problem is the practice: bjones inherits everything asmith collected over the years, which breaks least privilege. I would assign role-based groups instead, or at least have the list reviewed and approved before running it.

## Read this leaver script step by step.
```powershell
$user = Get-ADUser jdoe -Properties MemberOf
$user.MemberOf | Out-File "C:\Leavers\jdoe-groups.txt"
Disable-ADAccount $user
Set-ADUser $user -Description "Disabled $(Get-Date -Format yyyy-MM-dd) - SR-104233"
foreach ($g in $user.MemberOf) {
    Remove-ADGroupMember -Identity $g -Members $user -Confirm:$false
}
Move-ADObject $user -TargetPath "OU=Disabled,DC=firm,DC=com"
```
---
1. Loads the user with their group memberships.
2. Saves the list of groups to a file - a record for audit and for a possible restore.
3. Disables the account.
4. Writes the date and the ticket number into the description.
5. Removes the user from every group, without asking for confirmation each time.
6. Moves the account to the Disabled OU.

What I would check: is the Disabled OU inside the sync scope? If not, the move deletes the cloud account and disconnects the mailbox.

## Find the bug in this script.
```powershell
Import-Csv .\members.csv | ForEach-Object {
    try {
        Add-DistributionGroupMember -Identity "All-Warsaw" -Member $_.Email -ErrorAction Stop
        Write-Output "Added $($_.Email)"
    }
    catch {
        Write-Warning "Failed $($_.Email): $($_.Exception.Message)"
    }
}
```
---
The script adds every address from the CSV to the distribution list and reports success or failure per row.

The bug is in the `catch` block: there, `$_` no longer means the CSV row - it is the error. So `$_.Email` is empty and the warning does not say which address failed.

The fix is to store the address first, for example `$email = $_.Email` at the top of the loop, and use `$email` everywhere.
PL: `-ErrorAction Stop` jest tu potrzebne: bez niego większość błędów cmdletów nie trafia do `catch`, tylko wypisuje się na czerwono, a skrypt leci dalej.

## What does this report show, and what is missing from it?
```powershell
Get-Mailbox -RecipientTypeDetails SharedMailbox -ResultSize Unlimited |
    Get-MailboxPermission |
    Where-Object { $_.User -notlike "NT AUTHORITY\SELF" -and -not $_.IsInherited } |
    Select-Object Identity, User, AccessRights |
    Export-Csv .\shared-permissions.csv -NoTypeInformation
```
---
For every shared mailbox it lists who has been explicitly given mailbox permissions - mainly Full Access - and exports that to CSV. It filters out the mailbox's own entry and inherited system permissions.

What is missing: Send As. That is a recipient permission and comes from `Get-RecipientPermission`, so a complete access report needs both.

## What does this do, and when would it be the wrong tool?
```powershell
Connect-MgGraph -Scopes "User.ReadWrite.All"
$u = Get-MgUser -UserId jdoe@firm.com
Update-MgUser -UserId $u.Id -AccountEnabled:$false
Revoke-MgUserSignInSession -UserId $u.Id
```
---
It connects to Microsoft Graph, blocks sign-in for that user in Entra ID and revokes their sessions, so existing tokens stop working.

For a cloud-only user that is the right way. For a synced user the account state is mastered in on-prem AD, so I would disable the account in AD and sync - and still revoke the sessions in the cloud.

## What does this function do? Why is the first line needed?
```powershell
function Remove-Diacritics {
    param([string]$Text)
    $Text = $Text -creplace 'ł', 'l' -creplace 'Ł', 'L'
    $normalized = $Text.Normalize([Text.NormalizationForm]::FormD)
    $normalized -replace '\p{Mn}', ''
}
Remove-Diacritics "Żółć Łukasz"   # Zolc Lukasz
```
---
It converts text with Polish characters to plain ASCII letters. `Normalize(FormD)` splits a letter like `ó` into the base letter and a separate accent mark, and the regex `\p{Mn}` removes all those marks.

The first line handles `ł`: it has no decomposed form, so normalization leaves it untouched and it must be replaced explicitly. `-creplace` is the case-sensitive version of `-replace`, so capital and small letters are handled separately.
PL: To jest Twoja prawdziwa historia z obecnej pracy (normalizacja nazw użytkowników). Jeśli poproszą o przykład skryptu, opowiedz ten: problem, podejście, test, wdrożenie.

## Both commands return the same users. Which one is better and why?
```powershell
# A
Get-ADUser -Filter * -Properties Department | Where-Object { $_.Department -eq 'Tax' }

# B
Get-ADUser -Filter "Department -eq 'Tax'"
```
---
B. It sends the filter to the domain controller, which returns only the matching users.

A downloads every user in the domain and filters on my machine - slow and heavy in a large directory. The rule is "filter left": filter as early in the pipeline as possible.

## What does this comparison find?
```powershell
$hr = Import-Csv .\hr-active.csv
$ad = Get-ADUser -Filter 'Enabled -eq $true' -Properties EmployeeID
$ad | Where-Object { $_.EmployeeID -notin $hr.EmployeeID } |
    Select-Object Name, SamAccountName, EmployeeID
```
---
Enabled AD accounts whose employee ID is not in HR's list of active employees - potential orphaned accounts that should have been disabled.

The caveat: accounts with an empty EmployeeID, such as service or shared accounts, will also show up, so the result is a list to review, not a list to disable.

## Explain these PowerShell basics: the pipeline, `$_`, and the operators -eq, -like, -match, -contains.
The pipeline `|` passes objects - not text - from one command to the next. `$_` is the current object in the pipeline.

- `-eq` exact equality, `-ne` not equal.
- `-like` wildcard match with `*`, for example `-like "adm*"`.
- `-match` regular expression match.
- `-contains` and `-in` check whether a collection includes a value.

All of them are case-insensitive by default; the versions starting with `c`, like `-ceq`, are case-sensitive.

## What habits make a script safe to run in production?
- Run it with `-WhatIf` or on one test object first.
- Read every line and know which lines change something.
- Error handling with try/catch, and a log of what was done.
- Validate the input file before the loop starts.
- No passwords or secrets in the script.
- Run it with the least privileged account that works, and tie it to a ticket.
