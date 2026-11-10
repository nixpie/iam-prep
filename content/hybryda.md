# Hybryda: AD on-prem i Entra ID
> Jak AD, Entra ID i Azure są ze sobą połączone, co się synchronizuje i gdzie co się zmienia.

## What is the difference between Active Directory Domain Services and Microsoft Entra ID?
AD DS is the on-premises directory: domain controllers, Kerberos/NTLM and LDAP, OUs and Group Policy, domain-joined machines.

Entra ID is the cloud identity provider: no OUs and no GPOs, modern protocols (OAuth 2.0, OpenID Connect, SAML), Conditional Access and MFA, managed through the portal or Microsoft Graph.

In a hybrid setup the two are connected by a sync engine, and AD is usually the source of authority for users.
PL: Entra ID to nie jest "AD w chmurze". Struktura jest płaska (zamiast OU są Administrative Units), a zamiast GPO jest Intune.

## How do a tenant, Entra ID, Microsoft 365 and an Azure subscription relate to each other?
A tenant is one organization's instance of Entra ID - the directory, for example `firm.onmicrosoft.com`.

Microsoft 365 services (Exchange Online, SharePoint, Teams) and Azure subscriptions all trust that tenant for identity. A subscription is a billing and resource container for Azure resources, attached to exactly one tenant.

So one identity in Entra can be licensed for Microsoft 365 services and can be given roles on Azure resources.

## What does Microsoft Entra Connect do?
It synchronizes users, groups and contacts from on-prem AD to Entra ID, so people have one identity in both worlds. The direction is essentially one-way: AD to cloud.

Entra Connect Sync runs a delta sync every 30 minutes by default. Cloud Sync is the lighter, agent-based version and syncs more often.
PL: Ręczne wymuszenie na serwerze Entra Connect: `Start-ADSyncSyncCycle -PolicyType Delta`. Po każdej zmianie w AD, która "ma być widoczna od razu", mówisz: "I would run a delta sync or wait for the next cycle".

## What does "source of authority" mean for a synced object?
It is the place where the object is mastered.

A synced user or group is mastered in on-prem AD: in the cloud its attributes are read-only, so you change them in AD and wait for sync.

A cloud-only object is mastered in Entra ID and does not exist in AD at all.
PL: To jest klucz do większości case'ów. Pierwsze pytanie, jakie sobie zadajesz: czy ten obiekt jest synced, czy cloud-only? Od tego zależy, GDZIE robisz zmianę.

## How can you tell whether a user or group is synced from on-prem or cloud-only?
- Entra admin center: the property "On-premises sync enabled" is Yes.
- Microsoft 365 admin center: the sync status column / icon.
- Exchange admin center: a synced group is marked as managed on-premises and cannot be edited.
- PowerShell: the `OnPremisesSyncEnabled` property from Microsoft Graph, or `IsDirSynced` on Exchange Online recipients.

```powershell
Get-MgUser -UserId jsmith@firm.com -Property DisplayName,OnPremisesSyncEnabled
Get-DistributionGroup "All-Warsaw" | Format-List Name,IsDirSynced
```

## You need to change the job title and display name of a synced user. Where do you do it?
In on-prem AD (Active Directory Users and Computers or `Set-ADUser`), then wait for the sync cycle or run a delta sync.

Trying it in the cloud portal fails, because the object is mastered on-premises.
PL: Co MOŻNA zmienić w chmurze nawet u zsynchronizowanego użytkownika: licencje, członkostwo w grupach chmurowych, metody MFA, role Entra.

## What are the three sign-in methods in a hybrid setup?
- **Password Hash Sync (PHS):** a hash of the password hash is synced to Entra, and authentication happens in the cloud. Simplest, and it keeps working when on-prem is down.
- **Pass-through Authentication (PTA):** Entra hands the validation to agents on-prem, and the password is checked against AD domain controllers. On-prem state such as a disabled account applies immediately.
- **Federation:** Entra redirects to an external identity provider (AD FS, PingFederate), which does the authentication.
PL: W ofercie jest PingOne Identity, więc część logowania/SSO może iść przez Ping. Nie zgaduj - to dobre pytanie do przyszłego przełożonego: "How is authentication set up - password hash sync, pass-through, or federated through Ping?"

## A user was disabled in AD. When do they actually lose access to Microsoft 365?
The disabled state reaches Entra with the next sync cycle - up to 30 minutes with Connect Sync. With PTA or federation, new sign-ins fail right away because AD is checked live.

Tokens that were already issued keep working for a while: an access token for roughly an hour, refresh tokens until they are revoked.

For an urgent termination: disable in AD, force a delta sync, revoke the user's sessions in Entra, and reset the password.

## What is password writeback?
It lets a password that is changed or reset in the cloud (self-service password reset, or an admin reset in the portal) be written back to on-prem AD in near real time.

Without it, the password of a synced user has to be reset in AD. It needs Entra ID P1 and has to be enabled in Entra Connect.

## A new hire was created in AD an hour ago but does not show up in Microsoft 365. What do you check?
1. Is the account in an OU that is inside the sync scope?
2. Did sync run? Check the last sync time and force a delta sync.
3. Sync errors: a duplicate UPN or a duplicate proxy address blocks the object.
4. Is the UPN suffix a verified domain? If not, the user gets an `onmicrosoft.com` sign-in name.

Only after the user exists in Entra can you assign a license, and only then is the mailbox created.

## What are sAMAccountName, UPN and primary SMTP address each used for?
- **sAMAccountName:** the legacy logon name (`FIRM\jsmith`), max 20 characters, used on-prem.
- **UPN:** `jsmith@firm.com`, the sign-in name for Entra ID and Microsoft 365. The suffix must be a verified domain.
- **Primary SMTP address:** the email address people reply to. It is stored in `proxyAddresses` with an uppercase `SMTP:` prefix.

Best practice is UPN equal to the primary SMTP address, so users sign in with their email address.

## How are an AD object and its cloud object linked? What are hard match and soft match?
They are linked by the source anchor, called ImmutableID in the cloud (based on `ms-DS-ConsistencyGuid`).

A hard match is a match on that ImmutableID. A soft match happens when a cloud object without an ImmutableID has the same primary SMTP address (or UPN) as an incoming AD object: sync joins the two instead of creating a duplicate.
PL: Praktyczny przypadek: ktoś założył konto ręcznie w chmurze, a potem takie samo w AD. Soft match po adresie SMTP je sklei. Jeśli nie sklei, masz duplikat i błąd synchronizacji.

## What happens in the cloud when a synced user is deleted in AD or moved out of the sync scope?
The cloud user is soft-deleted: it sits in Deleted users for 30 days, and the mailbox and license assignments are recoverable in that window.

To bring it back properly, restore the AD object (AD Recycle Bin) or move it back into a synced OU and sync - it reconnects to the same cloud object. After 30 days the cloud user is permanently deleted.
PL: Pułapka przy leaverach: jeśli OU "Disabled" jest POZA zakresem synchronizacji, przeniesienie konta tam USUWA konto w chmurze (i odłącza skrzynkę), a nie tylko je wyłącza. Zapytaj, jak to jest u nich ustawione.

## What is the difference between Entra roles and Azure RBAC roles?
Entra roles control identity objects in the directory - users, groups, licenses, applications. Examples: User Administrator, Groups Administrator, Helpdesk Administrator, Exchange Administrator.

Azure RBAC roles control Azure resources at a scope: management group, subscription, resource group or single resource. Examples: Owner, Contributor, Reader.

They are two separate systems. Being an admin in Entra does not by itself give access to resources in a subscription.

## Someone on the helpdesk only needs to reset passwords. Which Entra role do you give them?
The least privileged one that does the job: Helpdesk Administrator or Password Administrator.

Other narrow roles: User Administrator (create and manage users and groups), Authentication Administrator (manage MFA methods), License Administrator, Groups Administrator.

Global Administrator is never used for daily work, and privileged roles should be activated just-in-time through Privileged Identity Management.

## What is Conditional Access?
The if-then policy engine in Entra ID. Signals such as user or group, application, device compliance, location and sign-in risk lead to a decision: block, allow, or allow with a requirement like MFA or a compliant device. It needs Entra ID P1.

For account administration it matters because "I can't sign in" is often a policy block and not an account problem.

## A user says they cannot sign in to Microsoft 365. Where do you look first?
The Entra sign-in logs for that user. Each failed attempt shows an error code and the reason: wrong password, account disabled, locked out, MFA not completed, or blocked by a Conditional Access policy (and which one).

Then I check the basics: is the account enabled in AD, is the password expired, is the account locked out, did the last sync succeed, and does the user have a license for the service.

## What is a guest (B2B) user?
An external person invited into the tenant. The user type is Guest, they authenticate with their own home identity, and the account name contains `#EXT#`.

Guests are used to share Teams or SharePoint content with people outside the firm. In a law firm I would expect a sponsor, an approval, tightly limited access and a periodic review or expiry.

## What is a dynamic group in Entra ID?
A group whose membership is calculated from a rule on attributes, for example `user.department -eq "Litigation"`.

Members cannot be added or removed by hand, it needs Entra ID P1, and changes are not instant - processing can take minutes or longer.

It is very useful for joiner-mover-leaver work: change the attribute in AD, it syncs, and group membership and licenses follow automatically.
PL: Działa tylko przy czystych atrybutach. Literówka w polu Department w AD = użytkownik poza grupą = brak licencji lub dostępu.

## What is an Administrative Unit?
A container in Entra ID used to scope admin roles to a subset of users, groups or devices. For example, a helpdesk team in Warsaw can reset passwords only for users in the Warsaw unit.

It is the closest cloud equivalent of delegating permissions on an OU.

## What is a Temporary Access Pass?
A time-limited passcode that an admin issues so a user can sign in and register their own authentication methods.

Typical uses: onboarding a new hire before they have MFA set up, or recovering a user who lost their phone - after their identity has been verified.
