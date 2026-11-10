# Grupy: on-prem i chmura
> Typy grup, gdzie się nimi zarządza, co można zagnieżdżać i co można "przenieść".

## What group types exist in Microsoft 365 and what is each one for?
- **Security group:** grants access to resources - SharePoint, applications, licenses, Conditional Access. No email address.
- **Distribution list:** email only. It cannot grant permissions.
- **Mail-enabled security group:** both - it has an email address and can be used for permissions.
- **Microsoft 365 group:** collaboration - a shared mailbox and calendar, a SharePoint site, Teams. Cloud-only.

There are also dynamic variants, where membership comes from a rule instead of a manual list.

## Where do you manage each group type?
- Security groups and Microsoft 365 groups: Entra admin center or Microsoft 365 admin center.
- Distribution lists and mail-enabled security groups: Exchange admin center (or Microsoft 365 admin center). They cannot be created or edited in the Entra portal.
- Anything synced from on-prem: in on-prem AD, with the on-prem Exchange tools for the mail attributes.
PL: Typowa pułapka: ktoś szuka listy dystrybucyjnej w portalu Entra i nie może jej edytować. Poczta = Exchange admin center.

## A group shows as synced from on-premises. Can you add a member to it in the cloud portals?
No. A synced group is read-only in the cloud - membership, name and email addresses.

You add the member in on-prem AD (ADUC or `Add-ADGroupMember`) and wait for sync. Exchange Online refuses the change with an error saying the object is being synchronized from your on-premises organization.

## Can an on-prem (synced) group be a member of a cloud-only group?
Yes. A cloud security group or a cloud distribution list is managed in the cloud, and its members can be any objects that exist in Entra ID or Exchange Online - including synced users and synced groups.

The exception is a Microsoft 365 group: it cannot contain other groups at all.

## Can a cloud-only user or a cloud-only group be added to an on-prem group?
No. An AD group can only contain objects that exist in AD, and a cloud-only object does not exist there.

The options are: create the object on-prem and let it sync (or add a mail contact, if it is only about receiving email), recreate the group in the cloud, or convert the group so that it is managed in the cloud.
PL: To było pytanie z 2. etapu. Reguła: synchronizacja idzie w jedną stronę, z AD do chmury. Chmura "widzi" obiekty z AD, ale AD nie widzi obiektów chmurowych.

## How would you move a distribution list from on-prem to the cloud?
The classic way is to recreate it:

1. Export the members and settings: owners, who is allowed to send, aliases.
2. Create a new cloud distribution list and add the members.
3. Remove the on-prem group from sync or delete it, then move its email addresses to the new group - including the old `legacyExchangeDN` as an X500 address, so replies to old emails and Outlook autocomplete keep working.

The newer way is Microsoft's Group Source of Authority conversion, which switches a synced group to cloud-managed in place, keeping the same object and members.
PL: Group SOA to nowa funkcja (2025). Powiedz, że o niej wiesz i że przed użyciem sprawdziłbyś aktualne wymagania w dokumentacji i w ich procedurach. Po co przenosić: żeby właściciele mogli sami zarządzać członkami z Outlooka i żeby dało się dodać obiekty cloud-only.

## Why can't the owner of a synced distribution list manage its members from Outlook?
Because the group is mastered on-prem and is read-only in the cloud. Outlook talks to Exchange Online, and Exchange Online cannot write the change back to AD.

Either IT manages the membership on-prem on request, or the group is moved to the cloud.

## What are the group types and scopes in on-prem AD?
Type: **Security** (can be used in permissions) or **Distribution** (email only).

Scope:
- **Domain Local:** used to grant permissions on resources in its own domain.
- **Global:** contains users from its own domain.
- **Universal:** can contain members from any domain in the forest and be used anywhere.

Mail-enabled groups must be Universal. The classic design is AGDLP: accounts go into Global groups, Global groups into Domain Local groups, and permissions are set on the Domain Local groups.

## What can a Microsoft 365 group not do?
- It cannot be synced from on-prem AD - it is cloud-only.
- It cannot be nested: members must be users, not groups.

Every Team is backed by a Microsoft 365 group. A deleted Microsoft 365 group can be restored for 30 days, together with its content.

## Does group-based licensing work with nested groups?
No. Licenses are applied only to direct user members of the group.

It also needs a usage location on each user and Entra ID P1. If something fails, the group's license view shows the error - for example not enough licenses or conflicting service plans.

## A user needs access to an on-prem file share. Can you use a cloud-only security group or a Teams group on the folder permissions?
No. The file server evaluates on-prem AD identities, and a cloud-only group does not exist in AD.

Use an AD security group. Because it syncs to the cloud, the same group can also be used for SharePoint or application access.
PL: W drugą stronę działa: zsynchronizowana grupa security z AD jest w pełni używalna w chmurze (SharePoint, aplikacje, licencje). Dlatego w hybrydzie grupy dostępowe często zakłada się on-prem.

## A user was added to an AD security group but still gets "Access Denied" on the file share. Why?
Group membership is written into the user's Kerberos token at logon. The user has to sign out and sign in again to get a new token.

If that does not help, I check replication between domain controllers and whether the group really has both the share and the NTFS permission on that folder.

## A team asks for "a group email address". Distribution list, shared mailbox or Microsoft 365 group?
I ask what they need to do with it:

- Only receive the same email, each in their own inbox: **distribution list**.
- Work a common inbox and reply from one shared address: **shared mailbox**.
- Collaborate with files, chat and a shared calendar: **Microsoft 365 group / Team**.

## An external client gets a bounce when emailing a distribution list. Why?
By default a distribution list only accepts mail from authenticated, internal senders (`RequireSenderAuthenticationEnabled` is true).

To allow external senders, switch that setting off - on-prem for a synced group, in Exchange admin center for a cloud group. Because it opens the list to spam, I would confirm the business need and consider restricting senders or adding moderation.

## Who can manage the membership of a distribution list?
The owners listed in `ManagedBy` can add and remove members, for cloud groups directly from Outlook.

Join and leave behaviour is controlled by `MemberJoinRestriction` and `MemberDepartRestriction` (Open, Closed, ApprovalRequired). For sensitive groups: Closed, with changes made only through an approved ticket.

## What is the difference between a dynamic distribution group and a dynamic Entra group?
A dynamic distribution group lives in Exchange. Its membership is calculated at the moment an email is sent, from a recipient filter such as "all mailboxes where Office is Warsaw". It is for mail only.

A dynamic Entra group is a security or Microsoft 365 group whose membership is processed by Entra ID from a rule. It can be used for access and for licenses.

## Can you change a group's type after it has been created?
Mostly no. Whether a group is a security group, mail-enabled or a Microsoft 365 group is fixed at creation - you create a new group and copy the members.

What can be switched on an Entra group is the membership type, between assigned and dynamic. Whether a group can be assigned to Entra roles has to be chosen at creation and cannot be changed later.

## A group was deleted by mistake. Can it be restored?
- Microsoft 365 group: yes, for 30 days, with its mailbox, site and Team.
- On-prem AD group: yes, from the AD Recycle Bin if it is enabled - including the membership - and then it syncs back.
- Cloud distribution list: no, it has to be recreated.

So before deleting any group I export its members and settings and attach them to the ticket.
