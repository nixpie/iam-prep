# Cykl życia kont i bezpieczeństwo
> Joiner, mover, leaver, licencje, least privilege, recertyfikacja i podstawy AD, o które lubią pytać.

## Walk me through onboarding a new hire in a hybrid environment.
1. Start from an approved HR request with start date, role, office and manager.
2. Create the AD account: naming standard, correct OU, attributes (title, department, manager).
3. Add role-based groups for that position - not a copy of a colleague.
4. Let it sync to Entra ID, then check the license (ideally group-based) and that the mailbox is created.
5. Prepare sign-in: temporary password or Temporary Access Pass, MFA registration.
6. Create accounts in the other systems the role needs - for this team that means ADERANT and third-party apps like Box or Zoom.
7. Document everything in the ticket and close it.

## What is the risk with a "mover" - someone who changes role or department?
Privilege creep: the person gets the access for the new role, but nobody removes the old one, so access keeps piling up.

For a mover I add the new access with the new manager's approval and remove what the old role had, on an agreed date. Sometimes a short overlap is approved for handover - then it gets an end date.

## Walk me through offboarding a leaver.
1. Confirm the exact time with HR and check for any legal hold or retention requirement.
2. Record the current group memberships in the ticket.
3. Disable the AD account, reset the password, force a sync and revoke cloud sessions.
4. Mailbox: automatic reply, convert to shared or delegate to the manager, hold if required.
5. Remove group memberships and licenses - only after the mailbox decision.
6. Deactivate accounts in ADERANT and the third-party systems.
7. Hide from the address list, move to the disabled OU, and delete only after the retention period.
PL: Kolejność ma znaczenie: najpierw odcinasz dostęp (konto, sesje), dopiero potem sprzątasz. Licencję zdejmujesz na końcu, bo razem z nią znika skrzynka.

## A manager asks: "Give the new person the same access as Anna." What do you say?
I would not copy Anna's access. Over the years she has probably collected permissions that have nothing to do with the new person's role, and copying them breaks least privilege.

I ask what the new person's role is and assign the standard role-based groups for it. Anything extra is requested and approved separately.

## Explain least privilege, RBAC and segregation of duties.
- **Least privilege:** everyone gets only the access they need for their job, and only for as long as they need it.
- **RBAC (role-based access control):** access is attached to roles or groups, and people are put into roles - instead of granting permissions one by one.
- **Segregation of duties:** no single person can complete a sensitive process alone, for example request and approve the same access.

## What is access recertification?
A periodic review in which managers or data owners confirm that each person still needs the access they have. Whatever is not confirmed gets removed.

It catches privilege creep and forgotten accounts, and it produces evidence for audits. In this role, approvals are tracked in a SQL database for recertification, so accurate records on every ticket matter.

## Assigning a license to a user fails. What are the usual causes?
- No usage location set on the user.
- No licenses left in the pool.
- Conflicting service plans between two licenses.
- For group-based licensing: the user is in a nested group, and only direct members get the license.

## Someone calls the helpdesk and asks for a password reset. How do you make sure it is really them?
I follow the firm's verification procedure and never rely on the caller's word or on urgency. Typical methods: call back on the number on file, verify through the manager, a video call, or self-service reset with MFA.

Pressure such as "I am a partner and I need it now" is exactly how social engineering works, so the process is the same for everyone.

## What is the difference between unlocking an account and resetting its password?
Unlocking clears a lockout caused by too many wrong attempts. The password stays the same.

Resetting sets a new password. If an account keeps locking, I do not just unlock it again - I look for the source, usually an old password saved on a phone, a mapped drive or a service.

## What is the difference between an OU and a group?
An OU is a container for organizing objects, applying Group Policy and delegating administration. An object sits in exactly one OU.

A group is for granting permissions (or sending mail). A user can be in many groups. You never grant access to a resource "to an OU".

## Why disable a leaver's account first instead of deleting it right away?
Disabling is reversible. A deleted account takes its unique identifier (SID) with it, and a recreated account with the same name is a new identity that has none of the old access, group memberships or ownership.

So: disable, keep for the retention period, then delete. If something was deleted by mistake, the AD Recycle Bin can restore it with its attributes and memberships.

## You find an enabled account that nobody seems to use. Do you disable it?
Not blindly. It could be a service account that an application depends on.

I check the description and owner, where it last logged on, and what uses it. Then I contact the owner and disable it in a controlled way with a rollback plan - and document it.

## How should administrator accounts be handled?
- A separate admin account, not the daily account with email.
- MFA always.
- Privileged roles activated just-in-time (Privileged Identity Management), not held permanently.
- Membership of privileged groups reviewed regularly.

## How do share permissions and NTFS permissions combine?
Both are evaluated, and the more restrictive result wins. An explicit Deny beats Allow.

Good practice: grant access to groups, not individual users, keep share permissions simple and control access with NTFS, and avoid breaking inheritance unless there is a reason.

## You need a report of accounts not used for 90 days. Which attribute do you trust?
`lastLogon` is not replicated - each domain controller has its own value. `lastLogonTimestamp` is replicated, but it can be up to 14 days behind, which is fine for a 90-day report.

In a hybrid setup I also check the cloud sign-in activity, because someone may only use Microsoft 365 and never touch a domain controller.

## What is an ethical wall, and why does it matter for account administration in a law firm?
An ethical wall (information barrier) blocks specific people from the documents and data of a matter where they have a conflict of interest.

It means access is not only a technical question. A request that looks harmless can be something the firm is not allowed to grant, which is why some requests need approval from the Office of Firm Counsel before I touch anything.

## Why must every access change be tied to a ticket and an approval?
Because access has to be explainable later: who asked, who approved, who made the change and when.

That audit trail is what recertification and audits rely on, and it protects both the firm and the administrator. No ticket, no change - even for small favours.
