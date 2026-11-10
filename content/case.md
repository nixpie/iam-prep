# Case'y: "czy możesz" i "jak byś to zrobił"
> Scenariusze w stylu panelu. Najpierw odpowiedz na głos po angielsku, dopiero potem odsłoń odpowiedź.

## A secretary asks to be added to a distribution list. In Exchange admin center the list is greyed out. Can you add her?
Yes, but not there. Greyed out means the list is synced from on-prem, so it is read-only in the cloud.

I add her to the group in on-prem AD and it appears in Exchange Online after the next sync cycle, or right away if I run a delta sync.
PL: Wzorzec odpowiedzi na każdy case: 1) gdzie obiekt jest zarządzany (synced czy cloud-only), 2) czy potrzebna jest zgoda, 3) jak to robię, 4) jak sprawdzam, że działa.

## A contractor has a cloud-only account. The team wants him on their on-prem distribution list. Can you do it?
Not directly. An on-prem group can only hold objects that exist in AD, and his account exists only in the cloud.

Options:
- Create a mail contact for him on-prem and add that to the list - enough if he only needs to receive the emails.
- Create his account on-prem so it syncs.
- Move the list to the cloud, where both synced and cloud-only members can be added.

I would pick based on how the firm normally handles contractors.

## A Teams team wants its members to have access to a folder on the on-prem file server. Can you just add the team's group to the folder?
No. A team is backed by a Microsoft 365 group, which is cloud-only, and the file server only understands on-prem AD groups.

I would create (or reuse) an AD security group, put the same people in it, and grant that group access to the folder. Longer term, the cleaner answer is to keep those files in the team's SharePoint site.

## An assistant says: "I need access to my partner's mailbox so I can send emails for him." What do you do?
First I clarify the need: read his mail, manage the calendar, or send - and if send, should recipients see that it came from the assistant?

Then I check the approval: the partner himself, as mailbox owner, has to approve through the normal process.

Then I grant the minimum: usually Send on Behalf, plus calendar or folder permissions. Full Access and Send As only if the partner explicitly wants that.

## A partner is on sick leave. His colleague asks for full access to his mailbox "to keep a client matter moving". Can you grant it?
Not on the colleague's request alone. A mailbox in a law firm contains privileged client communication, and the owner cannot approve right now.

I would escalate for approval through the defined route - his manager or practice leader, HR, and the Office of Firm Counsel if required. If it is approved, I grant it time-limited, document it in the ticket and remove it when he is back.

A less invasive alternative I would suggest: an automatic reply pointing clients to the colleague.

## HR calls: an employee is being terminated in 30 minutes and must lose all access the moment the meeting starts. What do you do?
I prepare everything and execute at the agreed minute:

1. Disable the AD account and reset the password.
2. Force a delta sync and revoke the sessions in Entra, so existing tokens stop working.
3. Check the account is blocked in systems that do not depend on AD - ADERANT and third-party apps like Box or Dropbox.
4. Remove or wipe mobile access if the firm's process says so.
5. Then the normal leaver steps: mailbox, groups, licenses, documentation.

I confirm back to HR when access is cut.

## A new hire starts tomorrow. Her AD account exists, but there is no mailbox and she cannot sign in to Microsoft 365. What do you check?
1. Does the user exist in Entra at all? If not: is she in a synced OU, did sync run, is there a sync error like a duplicate address?
2. Is the UPN suffix correct, or did she get an `onmicrosoft.com` name?
3. Does she have a license? No license, no mailbox - also check usage location and group-based licensing errors.
4. If she exists and is licensed: sign-in logs for the reason of the failure, for example a Conditional Access policy or MFA not registered.

## A user got married and changed her last name. What do you change, and what can break?
In AD: display name, last name, UPN and the primary email address - keeping the old address as an alias so mail to it still arrives. Then sync.

What to watch: her sign-in name changes, so she must sign in again on her devices; applications that identify her by email or UPN (Box, Zoom, ADERANT) may need the change too; her OneDrive URL can change.

I would agree a time with her and tell her in advance what to expect.

## A shared mailbox is almost at 50 GB. What are the options?
- Clean up or apply a retention policy, if the content is allowed to be deleted.
- Assign an Exchange Online Plan 2 license, which raises the quota to 100 GB.
- Enable an online archive - that also needs a license on the shared mailbox.

In a law firm I would first check retention and hold requirements before deleting anything.

## You granted Send As ten minutes ago, and the user still gets "You do not have permission to send on behalf of this user". What now?
Permissions in Exchange Online can take up to an hour to apply. I verify the permission is really there with `Get-RecipientPermission`, ask the user to restart Outlook, and have them pick the address from the Global Address List instead of the autocomplete cache.

A quick test in Outlook on the web shows whether it is a permission issue or just the Outlook client.

## You get a CSV with 300 users to add to a security group. How do you do it?
With a script, not by hand - but safely:

1. Validate the file first: are all users found, any duplicates or typos?
2. Run it with `-WhatIf` or on two or three test users.
3. Run it for real with error handling and a log of who was added and who failed.
4. Verify the member count and attach the log to the ticket.

I would also confirm the request is approved for all 300 - a bulk change is exactly where a mistake gets expensive.

## A user keeps getting locked out every few minutes. How do you find the cause?
Something keeps trying an old password. I find where the bad attempts come from: the lockout events on the domain controller (event 4740 on the PDC emulator) name the source computer.

Usual suspects: a phone with the old password in the mail app, a mapped drive, a saved credential, a scheduled task or service running as that user, another session still logged in.

## Firm Counsel has placed a leaver's data on legal hold. Six months later someone asks you to delete the mailbox to free the license. Can you?
Not without the hold being released by the Office of Firm Counsel. The cost of a license is not my decision to weigh against a legal obligation.

What I can do: confirm the hold status with them, and if the content must stay, keep it in a way that preserves it - an inactive mailbox on hold keeps the content without an active user.

## A lawyer wants to give a client access to a Teams channel. What do you check?
- Is guest access allowed by firm policy for this kind of content, and does it need approval?
- Who is the sponsor responsible for this guest?
- What exactly will the guest see - the whole team or one shared channel?
- When does the access end? I would set an expiry or put it in the next access review.

Then I invite the guest as a B2B user and confirm with the lawyer that the client sees only what was intended.

## A user has a new phone and can no longer approve MFA prompts. What do you do?
First I verify identity through the firm's procedure, because this is a classic account-takeover request.

Then I issue a Temporary Access Pass, or require re-registration of MFA, so the user can set up the Authenticator app on the new phone. I also remove the old device from the user's authentication methods.

## A request needs approval from the Office of Firm Counsel, but the partner says it is urgent and asks you to do it now and get the approval later. What do you do?
I do not bypass the approval. I explain briefly why, and I help speed it up instead: escalate to my manager, contact the Office of Firm Counsel directly and flag it as urgent.

I stay polite and keep the partner updated. The answer I never give is "it's done, we will sort out the paperwork later".
PL: Szef zespołu i lokalny menedżer mogą tym sprawdzać charakter, nie technikę. Dobra odpowiedź to: procedura plus realna pomoc w przyspieszeniu, a nie samo "nie mogę".

## Two domain admins disagree: one wants a new access group created in AD, the other in Entra. How do you decide?
By where it will be used:

- Needed on-prem (file shares, on-prem applications): create it in AD and let it sync - it then works in the cloud too.
- Only for cloud resources, or it must contain cloud-only users or be managed by its owners: create it in Entra.

And I follow the firm's existing standard, so the next administrator finds groups where they expect them.

## You are asked whether an on-prem group can be "moved" to the cloud. What do you answer?
Yes, in one of two ways. Either recreate it as a cloud group with the same members and settings and retire the on-prem one, or use Microsoft's Group Source of Authority conversion, which turns the synced group into a cloud-managed one in place.

Before doing it I check what depends on the group on-prem - file shares or applications that use it will stop seeing it unless it is written back to AD.
