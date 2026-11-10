# Poczta: skrzynki i uprawnienia
> Exchange Online i hybryda: Full Access, Send As, MailTip, skrzynki współdzielone, hold, aliasy.

## What is the difference between Full Access, Send As and Send on Behalf?
- **Full Access:** open the mailbox and work with everything in it - read, organize, delete. It does not allow sending from it.
- **Send As:** send mail that appears to come directly from the mailbox. The recipient cannot tell someone else sent it.
- **Send on Behalf:** the recipient sees "Assistant on behalf of Partner".

They are independent. To fully work a shared mailbox you normally grant Full Access plus Send As.
PL: Jeśli ktoś ma jednocześnie Send As i Send on Behalf, wygrywa Send As.

## Which cmdlets grant Full Access, Send As and Send on Behalf in Exchange Online?
```powershell
Add-MailboxPermission   -Identity team@firm.com -User jsmith -AccessRights FullAccess
Add-RecipientPermission -Identity team@firm.com -Trustee jsmith -AccessRights SendAs
Set-Mailbox             -Identity team@firm.com -GrantSendOnBehalfTo @{Add="jsmith"}
```
PL: Trzy różne cmdlety - częsta pułapka przy czytaniu skryptów. Sprawdzanie: `Get-MailboxPermission` (Full Access) i `Get-RecipientPermission` (Send As).

## What is the difference between a MailTip and an out-of-office message?
A **MailTip** is a notice shown to the sender inside Outlook while they are still writing the message, before they hit Send. Nothing is emailed. Examples: the recipient is out of office, you are sending to a large group or to external recipients, or a custom text an admin sets, like "This mailbox is not monitored".

An **automatic reply (out of office)** is a real email sent back after the message arrives. The user or an admin sets it, with separate internal and external text and an optional schedule, and each sender gets it once.

```powershell
Set-Mailbox info@firm.com -MailTip "This mailbox is not monitored."
Set-MailboxAutoReplyConfiguration jsmith -AutoReplyState Enabled -InternalMessage "..." -ExternalMessage "..."
```
PL: Jedno zdanie do zapamiętania: MailTip to ostrzeżenie PRZED wysłaniem i widzi je tylko piszący. OOO to mail zwrotny PO wysłaniu. Łącznik: gdy odbiorca ma włączone OOO, Outlook pokazuje jego treść piszącemu jako MailTip.

## For a person who left the firm, would you use a MailTip or an automatic reply?
An automatic reply, because external clients need to get an actual email saying the person is no longer with the firm and who to contact instead. Custom MailTips are an internal Outlook feature and generally do not reach external senders.

A MailTip fits internal steering: "This list goes to 3,000 people" on a big distribution list, or "No longer monitored" on a retired shared mailbox. Often both are used.

## What should you know about a shared mailbox?
- No license is needed up to 50 GB.
- Nobody signs in to it directly: people open it with their own account through permissions, and sign-in for the underlying account should be blocked.
- It needs a license (Exchange Online Plan 2) once it goes over 50 GB, or needs an online archive, or has to be put on litigation hold.

## What is automapping?
When Full Access is granted directly to a user, Outlook adds that mailbox to their profile automatically.

It does not happen when the access comes through a group. It can also be switched off with `-AutoMapping $false`, which is useful when someone has many mailboxes and Outlook becomes slow.

## A team replies from a shared mailbox, but the sent emails are missing from its Sent Items. Why?
By default a message sent as the shared mailbox is saved in the sender's own Sent Items.

To keep a copy in the shared mailbox:

```powershell
Set-Mailbox team@firm.com -MessageCopyForSentAsEnabled $true -MessageCopyForSendOnBehalfEnabled $true
```

## Can you grant mailbox permissions to a group instead of to individual users?
Yes, to a mail-enabled security group. A plain distribution list cannot hold permissions because it is not a security principal.

The benefit is that access is managed through group membership. The trade-off is that automapping does not work for access granted through a group.

## When and how do you convert a user mailbox to a shared mailbox?
Typically for a leaver, so the manager or team can still reach the mail without paying for a license.

```powershell
Set-Mailbox jsmith@firm.com -Type Shared
```

Then, once the conversion has completed, remove the license and make sure sign-in is blocked. It only works license-free if the mailbox is under 50 GB and has no archive or hold.

## What is Litigation Hold?
It preserves all content of a mailbox - including items the user deletes or edits - for a set period or indefinitely, for legal and eDiscovery purposes. The user does not see it. It needs Exchange Online Plan 2.

If the user account is deleted while the mailbox is on hold, it becomes an inactive mailbox and the content is kept.
PL: W kancelarii to codzienność. Zanim cokolwiek usuniesz po leaverze, potwierdzasz, czy nie ma holda lub wymogu retencji - przez Office of Firm Counsel.

## What happens to the mailbox when you remove the license from a user?
The mailbox is disconnected and kept for about 30 days, then permanently deleted - unless it is on hold. Reassigning a license within that window brings it back.

So for a leaver I never remove the license before the decision on the mailbox is made: convert to shared, put on hold, or export.

## What mail forwarding options exist, and what is the risk?
Mailbox-level forwarding is set by an admin: `ForwardingAddress` for an internal recipient or `ForwardingSmtpAddress` for any address, with `DeliverToMailboxAndForward` to keep a copy. Users can also forward with inbox rules.

Automatic forwarding to an external address is a data-leak risk and is commonly blocked by policy. In a law firm I would treat any external forwarding as something that needs approval.

## How do you add an email alias to a synced user?
Add `smtp:alias@firm.com` to `proxyAddresses` on-prem - in the AD attribute editor or with the on-prem Exchange tools - then sync.

Lowercase `smtp:` is a secondary address. Uppercase `SMTP:` marks the primary address, and there must be exactly one.

## What is a remote mailbox in an Exchange hybrid setup?
A user whose mailbox lives in Exchange Online is represented on-prem as a remote mailbox: a mail-enabled user with a remote routing address pointing to the tenant.

New users are typically created on-prem with `New-RemoteMailbox` or `Enable-RemoteMailbox`, so the mail attributes are correct, then synced and licensed. Mail attributes of synced recipients are managed on-prem.
PL: Dobre pytanie do nich: "Do you still keep an Exchange server on-prem for recipient management, or do you edit the attributes directly in AD?"

## How do you hide a synced user from the Global Address List?
On-prem, by setting `msExchHideFromAddressLists` to TRUE and syncing. That attribute exists only when the AD schema has been extended for Exchange.

In the cloud the setting is read-only for synced objects.

## A user says they never received an email. What do you do?
Run a message trace in Exchange admin center for that sender, recipient and time window. It shows whether the message was delivered, quarantined, filtered or failed.

If it was delivered, I look on the mailbox side: Junk, inbox rules, forwarding. If nothing shows up in the trace, the sender probably used a wrong address or it never left their side.

## An assistant only needs to manage a partner's calendar. What do you grant?
A folder-level permission on the calendar, not Full Access to the whole mailbox:

```powershell
Add-MailboxFolderPermission -Identity partner@firm.com:\Calendar -User assistant@firm.com -AccessRights Editor
```

Reviewer is read-only, Editor can create and change items. That is least privilege: the assistant never sees the partner's email.

## What is a room or equipment mailbox?
A resource mailbox that represents a meeting room or a piece of equipment. People book it by inviting it to a meeting, and it accepts or declines automatically based on its calendar and booking rules.

It needs no license and nobody signs in to it.
