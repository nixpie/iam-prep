# Rola, ich systemy i rozmowa
> Co ten zespół robi na co dzień, systemy z oferty i odpowiedzi na pytania "miękkie". Szkielety uzupełnij własnymi szczegółami.

## What does the Account Administration team do, in your own words?
It owns the identity lifecycle for the firm: creating accounts for new hires, changing access when people move, and cutting access quickly when they leave - across Active Directory, Entra ID, ADERANT and third-party systems.

The team also maintains the firm's distribution lists, shared mailboxes, cloud storage accounts and Microsoft 365 licenses, handles everything through tickets in Ivanti, and makes sure sensitive requests have the right approval.
PL: To prawie dosłownie "Position Summary" z oferty. Jeśli zapytają "what do you think this job is", powiedz to swoimi słowami i dodaj, co z tego robisz już dziś.

## What is ADERANT, and how do you answer when you have not worked with it?
ADERANT is practice management software for law firms - time recording, billing and financials. For this team it means creating, changing and deactivating user accounts in it.

"I have not administered ADERANT itself. In my previous job I managed user accounts and role assignments in SAP, and the principles are the same: role-based access, approvals, and removing access on time. I would expect to learn the ADERANT specifics from your procedures in the first weeks."
PL: To samo powiedziałeś na 2. etapie i zostało przyjęte. Trzymaj tę samą wersję, krótko i bez tłumaczenia się.

## What is Ivanti, and how does it compare to what you use?
Ivanti is the IT service management tool the firm uses for tickets: every request and incident is logged, tracked and updated there.

"My daily tool is ServiceNow, and the concepts carry over directly: incidents versus service requests, categories and priorities, SLAs, approvals, and a clear record of what was done on every ticket."

## What is PingOne Identity?
A cloud identity platform from Ping Identity that provides single sign-on and multi-factor authentication for applications, using standards like SAML and OpenID Connect.

In the job posting it is listed among the systems where the team manages user accounts, so I would expect some applications to be signed in to through Ping.
PL: Nie udawaj, że znasz ich konfigurację. Dobre pytanie: "Which applications sit behind Ping, and which go directly through Entra ID?"

## The posting lists Dropbox, Box, Google Workspace, ShareFile, Preparis, eFax and Zoom. What is your role there?
Managing user accounts in each of them: creating the account for people whose role needs it, changing it, and above all removing it when someone leaves.

The risk with third-party systems is that they are easy to forget during offboarding, especially when they are not connected to single sign-on. So I would rely on a checklist per system and on regular comparison of their user lists against active employees.

## Why does some access need approval from the Office of Firm Counsel?
Because a law firm has duties that go beyond IT policy: client confidentiality, conflicts of interest and ethical walls, and legal holds.

Some requests - access to another person's mailbox or to restricted matters, for example - can only be granted when the firm's counsel confirms it is allowed. My part is to recognize those requests, get the approval, and record it so it can be shown later during recertification.

## The posting mentions understanding AI capabilities, limitations and responsible use. What is your view?
"I use AI every day as a tool. For scripts, it gives me a first draft quickly - but I read every line, I know what each command changes, and I test on a single object or with WhatIf before anything touches production.

The limits are clear to me: it can be confidently wrong, so I verify. And responsible use in a law firm means only firm-approved tools, and never putting client data, personal data or credentials into a prompt."
PL: To jest dokładnie to, co mówiłeś na 2. etapie, a w ofercie jest to wpisane jako wymaganie. Mów o tym pewnie: to Twój atut, nie coś do ukrywania.

## Tell me about yourself.
A structure that fits two minutes:

1. **Now:** "I work on a global service desk, where most of my work is identity and access - accounts, groups, mailboxes and licenses in Entra ID and Active Directory, for a very large user base."
2. **Before:** "In my previous job I supported a hybrid AD and Microsoft 365 environment and managed access in SAP."
3. **Plus:** "I am finishing a master's degree in computer science, and I automate what I can with PowerShell, Python and Power Automate."
4. **Why here:** "This role is the part of my job I like most, done as a specialty - and in an environment where accuracy and confidentiality really matter."
PL: Powiedz to na głos kilka razy, aż zmieścisz się w 2 minutach bez czytania. Liczby i nazwy mów tylko te, które obronisz.

## Why do you want this role, and why this firm?
A skeleton to fill with your own words:

- The work: account administration is what I do best today, and here it is the core of the job, not a side task.
- The environment: a global firm with a hybrid setup, where I can go deeper into AD, Entra and Exchange.
- The standard: in a law firm, access mistakes have real consequences - I like work where being careful is valued.
- The team: after the second interview I have a clear picture of the team and how it works with the US.
PL: Dodaj jedną konkretną rzecz z rozmowy na 2. etapie, która Ci się spodobała. To brzmi lepiej niż ogólniki o "global company".

## Tell me about a script or automation you built.
The username normalization story, told as problem - action - result:

- **Problem:** "Usernames with Polish characters like ą, ę, ó were breaking international systems."
- **Action:** "I prepared a PowerShell script that normalized the names to plain letters. I wrote it with AI assistance, went through it line by line, and tested it before it went near production."
- **Result:** "It was reviewed for production safety and rolled out successfully by the global team."

Close with what you learned: "Since then I treat every bulk change the same way - test on a few, log everything, be able to roll back."

## Tell me about a process you improved.
The joiner verification story:

- **Problem:** "Checking new joiners by hand was slow, and we had collisions - duplicate logins and people who already had an account."
- **Action:** "I built an automation that queries Microsoft Graph and compares the results with our Excel lists, flags duplicates and login collisions, and alerts us when an account needs to be created."
- **Result:** fewer duplicate accounts and less manual checking - add your own number or example here.
PL: Uzupełnij wynik czymś konkretnym, co pamiętasz: ile czasu oszczędzało, ile kolizji wyłapywało. Bez liczby też jest OK, byle prawdziwie.

## Tell me about a mistake you made.
Pick a real one, small but genuine, and tell it in four steps:

1. What happened - one or two sentences, no excuses.
2. How you noticed and what you did right away.
3. How you fixed it and who you informed.
4. What you changed so it does not happen again.

The panel is listening for the last two: that you speak up early and that you learn from it.
PL: Przygotuj tę historię wcześniej. W zespole od uprawnień najgorszy kandydat to taki, który "nigdy nie popełnił błędu" albo by go ukrył.

## How do you handle a senior person who pressures you to skip the procedure?
"I stay calm and respectful, and I do not skip it. I explain in one sentence why the step exists, and then I put my energy into making it fast: I escalate, I chase the approval, and I keep them informed.

In my experience people accept a no much better when they see you are working to solve their problem."

## How do you prioritize when several urgent requests arrive at once?
"By impact and deadline, not by who is loudest. A termination or a security issue goes first, then anything blocking someone from working, then standard requests in SLA order.

I tell the people who have to wait when they can expect it, and if I cannot meet an SLA I say so early instead of going quiet."

## This role includes on-call and working with teams in the US. How do you feel about that?
"I am used to it - I work in a global team today and I have done on-call rotations. Clear handovers and good ticket notes matter most, so the next person can continue without asking."
PL: Zanim to powiesz, ustal sam ze sobą, na jakie godziny i dyżury realnie się zgadzasz, i zapytaj, jak rotacja wygląda w Warszawie.

## How do you treat confidential information?
"I only access what I need for the ticket in front of me, and I do not discuss what I see - inside or outside the firm. As an administrator I technically can open a lot, which is exactly why I do not.

If I am unsure whether a request is allowed, I stop and ask before acting."

## What questions will you ask the panel?
For the hiring manager:
- "How is the work split between Warsaw and the US teams, and how do handovers work?"
- "What would you want me to own after the first 90 days?"
- "How much of group and mailbox management is still on-prem, and are there plans to move more to the cloud?"

For the hiring manager's boss:
- "Where do you see the Account Administration function going in the next year or two - automation, AI?"
- "How do you see the Warsaw team growing?"

For the local manager:
- "How does this role work with the local IT team day to day?"
- "What does onboarding and training look like here?"
PL: Wybierz 3-4 pytania, nie wszystkie. Pytanie o plany migracji do chmury pokazuje, że rozumiesz ich hybrydę.

## If a question comes up that you cannot answer, what do you say?
"I am not sure about that one. My understanding is ... - but I would verify it in the documentation before acting on it."

Then say what you do know that is close, and where you would look. In an in-person round, how you handle not knowing matters as much as the answer.
PL: Tak samo, jeśli wróci MailTip: "I mixed that up last time, so I went back and checked" i podajesz poprawną odpowiedź. To działa na Twoją korzyść.
