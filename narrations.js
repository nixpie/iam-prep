const NARRATIONS = {
  "hybryda": {
    "What is the difference between Active Directory Domain Services and Microsoft Entra ID?": {
      "questionPL": "Czym różnią się lokalne Active Directory i Entra ID?",
      "answerPL": "Lokalne AD obsługuje domenę Windows, między innymi Kerberos i zasady grupy. Entra ID zarządza tożsamością w chmurze i logowaniem do aplikacji.",
      "answerEN": "Active Directory runs the Windows domain, including Kerberos and Group Policy. Entra ID manages cloud identities and application sign-in."
    },
    "How do a tenant, Entra ID, Microsoft 365 and an Azure subscription relate to each other?": {
      "questionPL": "Jak łączą się dzierżawa, Entra, Microsoft 365 i subskrypcja Azure?",
      "answerPL": "Dzierżawa to granica katalogu Entra. Microsoft 365 korzysta z tego katalogu do logowania. Subskrypcja Azure grupuje zasoby i rozliczenia oraz ufa jednej dzierżawie.",
      "answerEN": "A tenant is the boundary of an Entra directory. Microsoft 365 uses it for sign-in. An Azure subscription groups resources and billing and trusts one tenant."
    },
    "What does Microsoft Entra Connect do?": {
      "questionPL": "Do czego służy Entra Connect?",
      "answerPL": "Synchronizuje użytkowników, grupy i kontakty z lokalnego AD do Entra ID, żeby każdy miał jedną tożsamość w obu światach. Kierunek jest jeden: z AD do chmury. Domyślnie cykl uruchamia się co trzydzieści minut, a przy pilnej zmianie mogę wymusić synchronizację delta.",
      "answerEN": "It synchronizes users, groups and contacts from on-premises AD to Entra ID, so people have one identity in both. The direction is one way, from AD to the cloud. By default a sync cycle runs every thirty minutes, and I can force a delta sync when a change is urgent."
    },
    "What does \"source of authority\" mean for a synced object?": {
      "questionPL": "Co oznacza źródło zarządzania obiektem?",
      "answerPL": "To miejsce, w którym obiekt jest zarządzany. Zsynchronizowany użytkownik lub grupa są zarządzane w lokalnym AD, więc w chmurze ich atrybuty są tylko do odczytu: zmieniam je w AD i czekam na synchronizację. Obiekt tylko chmurowy jest zarządzany w Entra i w AD w ogóle nie istnieje.",
      "answerEN": "It is the place where the object is mastered. A synced user or group is mastered in on-premises AD, so in the cloud its attributes are read-only: I change them in AD and wait for sync. A cloud-only object is mastered in Entra and does not exist in AD."
    },
    "How can you tell whether a user or group is synced from on-prem or cloud-only?": {
      "questionPL": "Jak rozpoznać synchronizowane konto lub grupę?",
      "answerPL": "W Entra sprawdź właściwość synchronizacji z lokalnego katalogu. Nazwa i domena adresu same tego nie rozstrzygają.",
      "answerEN": "Check the on-premises sync property in Entra. The name and email domain alone don't tell you."
    },
    "You need to change the job title and display name of a synced user. Where do you do it?": {
      "questionPL": "Gdzie zmienić stanowisko i nazwę wyświetlaną synchronizowanej osoby?",
      "answerPL": "W lokalnym AD. Zsynchronizowany użytkownik jest w chmurze tylko do odczytu, więc portal odrzuci zmianę. Zmieniam atrybuty w AD, czekam na cykl synchronizacji albo uruchamiam deltę i sprawdzam nowe wartości w Entra.",
      "answerEN": "In on-premises AD. A synced user is read-only in the cloud, so the portal would refuse the change. I update the attributes in AD, wait for the sync cycle or run a delta sync, and confirm the new values in Entra."
    },
    "What are the three sign-in methods in a hybrid setup?": {
      "questionPL": "Jakie są trzy metody logowania hybrydowego?",
      "answerPL": "Przy synchronizacji skrótów haseł uwierzytelnia chmura. Przy uwierzytelnianiu przekazywanym hasło sprawdza agent lokalny. Federacja odsyła użytkownika do zaufanego dostawcy tożsamości.",
      "answerEN": "With password hash sync, the cloud authenticates the user. With pass-through authentication, an on-premises agent validates the password. Federation delegates sign-in to a trusted identity provider."
    },
    "A user was disabled in AD. When do they actually lose access to Microsoft 365?": {
      "questionPL": "Kiedy wyłączenie konta lokalnego odbiera dostęp do Microsoft 365?",
      "answerPL": "Nie od razu. Wyłączenie trafia do Entra przy najbliższym cyklu synchronizacji, czyli nawet po trzydziestu minutach. Wydane już tokeny działają jeszcze około godziny. Dlatego przy pilnym odejściu wyłączam konto w AD, wymuszam synchronizację delta, unieważniam sesje w Entra i resetuję hasło.",
      "answerEN": "Not instantly. The disabled state reaches Entra with the next sync cycle, which can take up to thirty minutes. Tokens already issued keep working for about an hour. So for an urgent termination I disable the account in AD, force a delta sync, revoke the sessions in Entra and reset the password."
    },
    "What is password writeback?": {
      "questionPL": "Co oznacza zapis zwrotny hasła?",
      "answerPL": "Przy odpowiedniej konfiguracji zmiana lub reset hasła w chmurze trafia do lokalnego AD. To osobna funkcja od synchronizacji skrótów haseł.",
      "answerEN": "When configured, a cloud password change or reset is written back to local AD. This is separate from password hash synchronization."
    },
    "A new hire was created in AD an hour ago but does not show up in Microsoft 365. What do you check?": {
      "questionPL": "Nowego pracownika nie widać w Microsoft 365. Co sprawdzisz?",
      "answerPL": "Najpierw sprawdzam, czy konto leży w jednostce organizacyjnej objętej synchronizacją. Potem czy synchronizacja się wykonała i czy nie ma błędów, na przykład zduplikowanej nazwy logowania albo adresu. Sprawdzam też, czy nazwa logowania ma zweryfikowaną domenę. Dopiero gdy użytkownik istnieje w Entra, mogę przypisać licencję, i dopiero wtedy powstaje skrzynka.",
      "answerEN": "First, is the account in an organizational unit that is inside the sync scope? Then, did sync run, and are there errors such as a duplicate sign-in name or email address? I also check that the sign-in name uses a verified domain. Only when the user exists in Entra can I assign a license, and only then is the mailbox created."
    },
    "What are sAMAccountName, UPN and primary SMTP address each used for?": {
      "questionPL": "Czym różnią się tradycyjny login, UPN i podstawowy adres poczty?",
      "answerPL": "Tradycyjny login działa z nazwą domeny Windows. UPN służy do logowania w formacie podobnym do adresu e-mail. Podstawowy adres SMTP służy do korespondencji i może być inny.",
      "answerEN": "The legacy login works with the Windows domain name. A UPN is an email-shaped sign-in name. The primary SMTP address is used for mail and may be different."
    },
    "How are an AD object and its cloud object linked? What are hard match and soft match?": {
      "questionPL": "Jak powiązane są obiekty lokalne i chmurowe?",
      "answerPL": "Twarde dopasowanie korzysta ze stałego identyfikatora źródłowego. Miękkie może dopasować istniejące konto po odpowiednim UPN lub adresie SMTP. Przed zmianą sprawdzam, czy oba obiekty należą do tej samej osoby.",
      "answerEN": "A hard match uses the source anchor. A soft match may link an existing account through an eligible UPN or SMTP address. Before changing anything, I verify both objects belong to the same person."
    },
    "What happens in the cloud when a synced user is deleted in AD or moved out of the sync scope?": {
      "questionPL": "Co się stanie po usunięciu użytkownika albo przeniesieniu go poza zakres synchronizacji?",
      "answerPL": "Konto w chmurze trafia do kosza. Zostaje w usuniętych użytkownikach przez trzydzieści dni i w tym czasie skrzynkę oraz licencje da się odzyskać. Właściwa droga powrotu to przywrócenie obiektu w AD albo przeniesienie go z powrotem do synchronizowanej jednostki. Pułapka: jeśli jednostka na wyłączone konta jest poza zakresem synchronizacji, przeniesienie tam leavera usuwa konto w chmurze.",
      "answerEN": "The cloud user is soft-deleted. It stays in Deleted users for thirty days, and the mailbox and licenses can be recovered in that time. The right way back is to restore the AD object or move it back into a synced organizational unit. One trap: if the unit for disabled users is outside the sync scope, moving a leaver there deletes the cloud account."
    },
    "What is the difference between Entra roles and Azure RBAC roles?": {
      "questionPL": "Czym różnią się role Entra od ról Azure?",
      "answerPL": "Role Entra dotyczą katalogu, na przykład zarządzania użytkownikami. Role Azure dotyczą zasobów, na przykład maszyny wirtualnej lub grupy zasobów.",
      "answerEN": "Entra roles govern the directory, for example user administration. Azure roles govern resources, such as a virtual machine or resource group."
    },
    "Someone on the helpdesk only needs to reset passwords. Which Entra role do you give them?": {
      "questionPL": "Jaką rolę nadać osobie resetującej hasła?",
      "answerPL": "Helpdesk Administrator albo Password Administrator, czyli najwęższe role, które pozwalają resetować hasła zwykłym użytkownikom. Nie dałbym User Administratora ani nic szerszego, a jeśli ta osoba obsługuje jedno biuro, ograniczyłbym rolę jednostką administracyjną.",
      "answerEN": "Helpdesk Administrator or Password Administrator, the least privileged roles that can reset passwords for ordinary users. I would not give User Administrator or anything broader, and if they only support one office, I'd scope the role with an administrative unit."
    },
    "What is Conditional Access?": {
      "questionPL": "Co to jest dostęp warunkowy?",
      "answerPL": "To reguły oceniające kontekst logowania, na przykład użytkownika, urządzenie i ryzyko. Mogą wymagać kolejnego składnika uwierzytelnienia albo zablokować dostęp.",
      "answerEN": "Conditional Access evaluates sign-in context, such as the user, device and risk. It can require another authentication factor or block access."
    },
    "A user says they cannot sign in to Microsoft 365. Where do you look first?": {
      "questionPL": "Gdzie zacząć diagnozę nieudanego logowania do Microsoft 365?",
      "answerPL": "Proszę o godzinę i komunikat błędu. W dzienniku logowań Entra sprawdzam konkretną próbę, szczegóły uwierzytelnienia i wynik zasad dostępu warunkowego.",
      "answerEN": "I ask for the time and error message. In Entra sign-in logs, I check that attempt, its authentication details and its Conditional Access result."
    },
    "What is a guest (B2B) user?": {
      "questionPL": "Kim jest użytkownik-gość?",
      "answerPL": "To zewnętrzna osoba mająca obiekt gościa w naszej dzierżawie. Zwykle loguje się własną tożsamością. Nadajemy jej dostęp tylko do zatwierdzonych zasobów.",
      "answerEN": "An external person has a guest object in our tenant. They usually sign in with their own identity. We grant access only to approved resources."
    },
    "What is a dynamic group in Entra ID?": {
      "questionPL": "Czym jest grupa dynamiczna?",
      "answerPL": "Jej członkostwo wynika z reguły, na przykład z wartości pola dział. Żeby wyjaśnić brak członka, sprawdzam atrybut i stan przetwarzania reguły.",
      "answerEN": "Membership follows a rule, such as a department value. To investigate a missing member, I check the attribute and rule processing status."
    },
    "What is an Administrative Unit?": {
      "questionPL": "Do czego służy jednostka administracyjna w Entra?",
      "answerPL": "Pozwala ograniczyć zakres obsługiwanych ról administracyjnych do części katalogu. Przykładem jest helpdesk zarządzający użytkownikami jednego regionu.",
      "answerEN": "An administrative unit scopes supported administrative roles to part of the directory. One example is a help desk managing users in a single region."
    },
    "What is a Temporary Access Pass?": {
      "questionPL": "Co to jest tymczasowa przepustka dostępu?",
      "answerPL": "To ograniczony czasowo kod, który może pomóc użytkownikowi zarejestrować silniejszą metodę logowania. Wydaję go po sprawdzeniu tożsamości zgodnie z procedurą.",
      "answerEN": "A Temporary Access Pass is a time-limited code that can help a user register a stronger sign-in method. I issue it after verifying identity according to procedure."
    }
  },
  "grupy": {
    "What group types exist in Microsoft 365 and what is each one for?": {
      "questionPL": "Do czego służą poszczególne typy grup w Microsoft 365?",
      "answerPL": "Lista dystrybucyjna rozsyła pocztę. Grupa zabezpieczeń nadaje dostęp. Grupa zabezpieczeń z obsługą poczty łączy oba zastosowania. Grupa Microsoft 365 udostępnia zasoby zespołowe.",
      "answerEN": "A distribution list delivers mail. A security group grants access. A mail-enabled security group does both. A Microsoft 365 group provides shared collaboration resources."
    },
    "Where do you manage each group type?": {
      "questionPL": "Gdzie zarządzać grupami?",
      "answerPL": "Najpierw ustalam typ i źródło zarządzania. Listy pocztowe obsługuję narzędziami Exchange, chmurowe grupy zabezpieczeń w Entra, a grupy zarządzane lokalnie u źródła.",
      "answerEN": "I identify the type and source of authority. I use Exchange tools for mail groups, Entra for cloud security groups, and the local source for groups managed on premises."
    },
    "A group shows as synced from on-premises. Can you add a member to it in the cloud portals?": {
      "questionPL": "Czy członka grupy synchronizowanej można dodać w chmurze?",
      "answerPL": "Nie. Zsynchronizowana grupa jest w chmurze tylko do odczytu. Dodaję członka w lokalnym AD, a zmiana pojawia się w chmurze po najbliższej synchronizacji.",
      "answerEN": "No. A synced group is read-only in the cloud. I add the member in on-premises AD, and the change appears in the cloud after the next sync cycle."
    },
    "Can an on-prem (synced) group be a member of a cloud-only group?": {
      "questionPL": "Czy grupa lokalna może być członkiem grupy chmurowej?",
      "answerPL": "Tak. Chmurowa grupa zabezpieczeń albo chmurowa lista dystrybucyjna może zawierać dowolny obiekt, który istnieje w chmurze, także zsynchronizowanych użytkowników i grupy. Wyjątkiem jest grupa Microsoft 365, która w ogóle nie może zawierać innych grup.",
      "answerEN": "Yes. A cloud security group or a cloud distribution list can contain any object that exists in the cloud, including synced users and synced groups. The exception is a Microsoft 365 group, which cannot contain other groups at all."
    },
    "Can a cloud-only user or a cloud-only group be added to an on-prem group?": {
      "questionPL": "Czy konto lub grupę istniejącą wyłącznie w chmurze można dodać do grupy lokalnej?",
      "answerPL": "Nie. Grupa lokalna może zawierać tylko obiekty, które istnieją w AD, a obiektu tylko chmurowego tam nie ma, bo synchronizacja działa w jedną stronę. Wyjścia są trzy: utworzyć obiekt lokalnie i go zsynchronizować, użyć kontaktu pocztowego, jeśli chodzi tylko o odbieranie poczty, albo przenieść grupę do chmury.",
      "answerEN": "No. An on-premises group can only contain objects that exist in AD, and a cloud-only object does not exist there, because sync runs one way. The options are to create the object on premises and let it sync, to use a mail contact if it is only about receiving email, or to move the group to the cloud."
    },
    "How would you move a distribution list from on-prem to the cloud?": {
      "questionPL": "Jak przenieść listę dystrybucyjną do chmury?",
      "answerPL": "Klasycznie odtwarzam ją w chmurze. Eksportuję członków, właścicieli i ustawienia, tworzę nową listę chmurową, a potem przenoszę na nią adresy, łącznie ze starym adresem Exchange jako aliasem X pięćset, żeby odpowiedzi na stare maile nadal działały. Nowsza opcja to konwersja źródła zarządzania od Microsoftu, która przełącza zsynchronizowaną grupę na zarządzaną w chmurze bez tworzenia nowej.",
      "answerEN": "The classic way is to recreate it. I export the members, owners and settings, create a new cloud list, and then move the email addresses to it, including the old Exchange address as an X five hundred alias, so replies to old emails still work. The newer option is Microsoft's source of authority conversion, which switches the synced group to cloud-managed in place."
    },
    "Why can't the owner of a synced distribution list manage its members from Outlook?": {
      "questionPL": "Dlaczego właściciel synchronizowanej listy nie może jej zmienić w Outlooku?",
      "answerPL": "Bo lista jest zarządzana lokalnie, a w chmurze jest tylko do odczytu. Outlook rozmawia z Exchange Online, a Exchange Online nie potrafi zapisać zmiany z powrotem do AD. Albo IT zmienia członków lokalnie, albo listę przenosi się do chmury.",
      "answerEN": "Because the list is mastered on premises and is read-only in the cloud. Outlook talks to Exchange Online, and Exchange Online cannot write the change back to AD. Either IT changes the membership on premises, or the list is moved to the cloud."
    },
    "What are the group types and scopes in on-prem AD?": {
      "questionPL": "Jakie typy i zakresy grup ma lokalne AD?",
      "answerPL": "Typ to grupa zabezpieczeń lub dystrybucyjna. Zakres może być globalny, uniwersalny albo lokalny w domenie. Zakres wpływa na dozwolone członkostwo i zastosowanie.",
      "answerEN": "The type is security or distribution. Scope can be global, universal or domain local. Scope affects allowed membership and where the group can be used."
    },
    "What can a Microsoft 365 group not do?": {
      "questionPL": "Jakie ograniczenia ma grupa Microsoft 365?",
      "answerPL": "Istnieje tylko w chmurze, więc nie da się jej zsynchronizować z lokalnego AD. Nie może zawierać innych grup, tylko użytkowników. Nie da się jej też użyć na lokalnym serwerze plików. Każdy zespół Teams ma pod spodem taką grupę, a usuniętą można przywrócić przez trzydzieści dni.",
      "answerEN": "It is cloud-only, so it cannot be synced from on-premises AD. It cannot contain other groups, only users. And it cannot be used on an on-premises file server. Every Team is backed by one, and a deleted one can be restored for thirty days."
    },
    "Does group-based licensing work with nested groups?": {
      "questionPL": "Czy licencje grupowe przechodzą przez grupę zagnieżdżoną?",
      "answerPL": "Licencja przydzielana przez grupę obejmuje jej bezpośrednich użytkowników. Samo członkostwo w grupie zagnieżdżonej nie wystarcza.",
      "answerEN": "Group-based licensing applies to direct user members. Membership in a nested group alone is insufficient."
    },
    "A user needs access to an on-prem file share. Can you use a cloud-only security group or a Teams group on the folder permissions?": {
      "questionPL": "Czy grupa Teams nada dostęp do lokalnego udziału plikowego?",
      "answerPL": "Nie. Serwer plików rozumie tylko grupy z lokalnego AD, a grupa chmurowa albo grupa Teams w AD nie istnieje. Używam grupy zabezpieczeń z AD. Ponieważ synchronizuje się ona do chmury, tę samą grupę można wykorzystać także w SharePoint.",
      "answerEN": "No. The file server only understands on-premises AD groups, and a cloud-only group or a Teams group does not exist in AD. I use an AD security group. Because it syncs to the cloud, the same group can also be used for SharePoint."
    },
    "A user was added to an AD security group but still gets \"Access Denied\" on the file share. Why?": {
      "questionPL": "Dlaczego po dodaniu do grupy użytkownik nadal nie otwiera udziału?",
      "answerPL": "Najczęściej dlatego, że członkostwo w grupach jest odczytywane przy logowaniu. Użytkownik musi się wylogować i zalogować ponownie, żeby dostać nowy token. Jeśli to nie pomaga, sprawdzam replikację między kontrolerami domeny i to, czy grupa naprawdę ma uprawnienia i na udziale, i w systemie plików.",
      "answerEN": "Most often because group membership is read at sign-in. The user has to sign out and sign in again to get a new token. If that does not help, I check replication between domain controllers and whether the group really has both the share and the file-system permission."
    },
    "A team asks for \"a group email address\". Distribution list, shared mailbox or Microsoft 365 group?": {
      "questionPL": "Zespół prosi o wspólny adres. Jak dobrać rozwiązanie?",
      "answerPL": "Do rozesłania kopii użyję listy. Do wspólnej obsługi korespondencji wybiorę skrzynkę współdzieloną. Jeśli potrzebne są też pliki i współpraca zespołowa, rozważę grupę Microsoft 365.",
      "answerEN": "For distributing copies I'd use a list. For handling messages together I'd use a shared mailbox. If the team also needs files and collaboration, I'd consider a Microsoft 365 group."
    },
    "An external client gets a bounce when emailing a distribution list. Why?": {
      "questionPL": "Dlaczego poczta od klienta zewnętrznego nie dociera do listy?",
      "answerPL": "Domyślnie lista dystrybucyjna przyjmuje pocztę tylko od wewnętrznych, uwierzytelnionych nadawców. Żeby przepuścić klienta, wyłączam ustawienie wymagające uwierzytelnienia nadawcy, lokalnie, jeśli lista jest synchronizowana. Ponieważ otwiera to listę na spam, najpierw potwierdzam potrzebę z właścicielem.",
      "answerEN": "By default a distribution list only accepts mail from internal, authenticated senders. To let the client through, I switch off the require sender authentication setting, on premises if the list is synced. Because that opens the list to spam, I confirm the business need with the owner first."
    },
    "Who can manage the membership of a distribution list?": {
      "questionPL": "Kto zarządza członkostwem listy?",
      "answerPL": "Uprawniony administrator albo właściciel zgodnie z konfiguracją. Przy liście synchronizowanej zmianę wykonuje się w systemie źródłowym.",
      "answerEN": "An authorized administrator or owner can manage it, according to configuration. For a synced list, the change is made in the source system."
    },
    "What is the difference between a dynamic distribution group and a dynamic Entra group?": {
      "questionPL": "Czym różni się dynamiczna lista pocztowa od dynamicznej grupy Entra?",
      "answerPL": "Lista Exchange wykorzystuje filtr odbiorców do dostarczania poczty. Grupa Entra utrzymuje członkostwo według reguły i może obsługiwać inne zastosowania.",
      "answerEN": "An Exchange dynamic distribution group uses a recipient filter for mail delivery. An Entra dynamic group maintains rule-based membership for other supported uses."
    },
    "Can you change a group's type after it has been created?": {
      "questionPL": "Czy można zmienić typ grupy?",
      "answerPL": "W większości nie. To, czy grupa jest grupą zabezpieczeń, grupą z adresem pocztowym czy grupą Microsoft 365, ustala się przy tworzeniu, więc tworzę nową grupę i kopiuję członków. W grupie Entra da się przełączyć tylko typ członkostwa, między przypisanym a dynamicznym.",
      "answerEN": "Mostly no. Whether a group is a security group, mail-enabled or a Microsoft 365 group is fixed when it is created, so I create a new group and copy the members. What can be switched on an Entra group is the membership type, between assigned and dynamic."
    },
    "A group was deleted by mistake. Can it be restored?": {
      "questionPL": "Czy można przywrócić usuniętą grupę?",
      "answerPL": "To zależy od typu. Grupę Microsoft 365 można przywrócić przez trzydzieści dni razem z zawartością. Grupa z lokalnego AD wraca z kosza AD razem z członkami i potem synchronizuje się ponownie. Chmurowej listy dystrybucyjnej przywrócić się nie da, trzeba ją odtworzyć, dlatego przed usunięciem jakiejkolwiek grupy eksportuję jej członków.",
      "answerEN": "It depends on the type. A Microsoft 365 group can be restored for thirty days with its content. An on-premises AD group comes back from the AD Recycle Bin, with its members, and then syncs again. A cloud distribution list cannot be restored and has to be recreated, so I export the members before deleting any group."
    }
  },
  "poczta": {
    "What is the difference between Full Access, Send As and Send on Behalf?": {
      "questionPL": "Czym różnią się pełny dostęp, wysyłanie jako i wysyłanie w imieniu?",
      "answerPL": "Pełny dostęp pozwala otworzyć skrzynkę. Przy wysyłaniu jako odbiorca widzi adres skrzynki. Przy wysyłaniu w imieniu widzi też osobę, która wysłała wiadomość.",
      "answerEN": "Full Access lets you open the mailbox. With Send As, the recipient sees the mailbox as the sender. With Send on Behalf, they can also see who sent the message."
    },
    "Which cmdlets grant Full Access, Send As and Send on Behalf in Exchange Online?": {
      "questionPL": "Którymi poleceniami nadasz te trzy uprawnienia w Exchange Online?",
      "answerPL": "Pełny dostęp nadaję przez Add-MailboxPermission. Wysyłanie jako nadaję przez Add-RecipientPermission. Wysyłanie w imieniu ustawiam przez Set-Mailbox i parametr GrantSendOnBehalfTo.",
      "answerEN": "For Full Access I use Add-MailboxPermission. For Send As I use Add-RecipientPermission. For Send on Behalf I use Set-Mailbox with the GrantSendOnBehalfTo parameter."
    },
    "What is the difference between a MailTip and an out-of-office message?": {
      "questionPL": "Czym różni się wskazówka pocztowa od odpowiedzi o nieobecności?",
      "answerPL": "Wskazówkę widzę podczas pisania, zanim wyślę wiadomość. Automatyczna odpowiedź przychodzi po dostarczeniu. Outlook może wcześniej pokazać treść nieobecności jako wskazówkę.",
      "answerEN": "A MailTip appears as I compose the message, before I send it. An automatic reply comes after delivery. Outlook can also show the absence message in advance as a MailTip."
    },
    "For a person who left the firm, would you use a MailTip or an automatic reply?": {
      "questionPL": "Co ustawisz dla osoby, która odeszła z firmy?",
      "answerPL": "Dla klientów zewnętrznych przyda się zatwierdzona automatyczna odpowiedź z nowym kontaktem. Dla współpracowników można dodatkowo ustawić wewnętrzną wskazówkę pocztową.",
      "answerEN": "For external clients, an approved automatic reply can provide a new contact. For colleagues, an internal MailTip can give additional guidance."
    },
    "What should you know about a shared mailbox?": {
      "questionPL": "Co warto wiedzieć o skrzynce współdzielonej?",
      "answerPL": "Delegaci używają własnych kont. Typowa skrzynka do pięćdziesięciu gigabajtów może działać bez osobnej licencji. Większa pojemność, archiwum i funkcje zachowania danych wymagają sprawdzenia licencji.",
      "answerEN": "Delegates use their own accounts. A typical shared mailbox up to fifty gigabytes can work without a separate license. Higher capacity, archiving and preservation features require a licensing check."
    },
    "What is automapping?": {
      "questionPL": "Co to jest automatyczne mapowanie skrzynki?",
      "answerPL": "Po bezpośrednim nadaniu pełnego dostępu Outlook może automatycznie dodać skrzynkę do profilu. Nadanie dostępu przez grupę nie uruchamia automatycznego mapowania.",
      "answerEN": "After Full Access is granted directly, Outlook can add the mailbox to the profile automatically. Access granted through a group doesn't trigger automapping."
    },
    "A team replies from a shared mailbox, but the sent emails are missing from its Sent Items. Why?": {
      "questionPL": "Gdzie trafiają wiadomości wysłane ze skrzynki współdzielonej?",
      "answerPL": "Domyślnie kopia może trafić do elementów wysłanych delegata. W Exchange można włączyć zapisywanie kopii w skrzynce współdzielonej dla obu rodzajów wysyłki.",
      "answerEN": "By default the copy may go to the delegate's Sent Items. Exchange can be configured to keep a copy in the shared mailbox for either sending permission."
    },
    "Can you grant mailbox permissions to a group instead of to individual users?": {
      "questionPL": "Czy uprawnienia do skrzynki można nadać grupie?",
      "answerPL": "Dla obsługiwanych uprawnień można użyć grupy zabezpieczeń z obsługą poczty. Zwykła lista dystrybucyjna nie jest podmiotem zabezpieczeń. Pamiętam o ograniczeniu automatycznego mapowania.",
      "answerEN": "For supported permissions, a mail-enabled security group can be used. An ordinary distribution list isn't a security principal. I account for the automapping limitation."
    },
    "When and how do you convert a user mailbox to a shared mailbox?": {
      "questionPL": "Kiedy przekonwertować skrzynkę użytkownika na współdzieloną?",
      "answerPL": "Na przykład po odejściu pracownika, gdy zespół ma nadal obsługiwać pocztę. Po zatwierdzeniu konwertuję skrzynkę, sprawdzam dostęp i retencję, a dopiero potem decyduję o licencji.",
      "answerEN": "For example, after someone leaves, the team may still need to handle mail. With approval, I convert the mailbox, check access and retention, then decide what to do with the license."
    },
    "What is Litigation Hold?": {
      "questionPL": "Co oznacza Litigation Hold?",
      "answerPL": "To mechanizm zachowania zawartości skrzynki na potrzeby postępowania prawnego. Chroni również usunięte elementy i wersje zmian zgodnie z zasadami zachowania.",
      "answerEN": "Litigation Hold preserves mailbox content for legal proceedings. It also preserves deleted items and versions of changes according to the hold."
    },
    "What happens to the mailbox when you remove the license from a user?": {
      "questionPL": "Co się stanie po odebraniu licencji skrzynce użytkownika?",
      "answerPL": "Skrzynka zostaje odłączona i jest przechowywana około trzydziestu dni, a potem trwale usuwana, chyba że jest objęta blokadą. Dlatego u leavera nigdy nie zdejmuję licencji, zanim zapadnie decyzja, co ze skrzynką: zamiana na współdzieloną, blokada albo eksport.",
      "answerEN": "The mailbox is disconnected and kept for about thirty days, then permanently deleted, unless it is on hold. So for a leaver I never remove the license before the mailbox decision is made: convert it to shared, put it on hold or export it."
    },
    "What mail forwarding options exist, and what is the risk?": {
      "questionPL": "Jak działa przekazywanie poczty i jakie ma ryzyko?",
      "answerPL": "Można je ustawić na skrzynce lub za pomocą reguły. Przekazywanie na zewnątrz może ujawnić dane klienta, dlatego sprawdzam politykę i wymaganą zgodę.",
      "answerEN": "Forwarding can be set on the mailbox or through a rule. External forwarding can expose client data, so I check policy and required approval."
    },
    "How do you add an email alias to a synced user?": {
      "questionPL": "Jak dodać alias synchronizowanemu użytkownikowi?",
      "answerPL": "Jeśli adresy są zarządzane lokalnie, dodaję alias w źródle i sprawdzam synchronizację. W atrybucie adresów małe litery smtp oznaczają alias, a wielkie litery SMTP adres podstawowy.",
      "answerEN": "If addresses are managed on premises, I add the alias at the source and verify synchronization. In the address attribute, lowercase smtp marks an alias and uppercase SMTP marks the primary address."
    },
    "What is a remote mailbox in an Exchange hybrid setup?": {
      "questionPL": "Co oznacza skrzynka zdalna w hybrydowym Exchange?",
      "answerPL": "Skrzynka znajduje się w Exchange Online, a lokalny obiekt odbiorcy przechowuje atrybuty potrzebne między innymi do kierowania poczty.",
      "answerEN": "The mailbox lives in Exchange Online. An on-premises recipient object holds attributes needed for functions such as mail routing."
    },
    "How do you hide a synced user from the Global Address List?": {
      "questionPL": "Jak ukryć synchronizowanego odbiorcę na globalnej liście adresowej?",
      "answerPL": "Jeśli atrybut jest zarządzany lokalnie, ustawiam ukrywanie odbiorcy u źródła. Po synchronizacji sprawdzam listę adresową, uwzględniając opóźnienie jej odświeżania.",
      "answerEN": "If the attribute is managed on premises, I hide the recipient at the source. After synchronization I check the address list, allowing for its refresh delay."
    },
    "A user says they never received an email. What do you do?": {
      "questionPL": "Jak sprawdzić, co się stało z niedostarczoną wiadomością?",
      "answerPL": "Ustalam adresy i czas, potem sprawdzam ślad wiadomości w Exchange. Jeśli została dostarczona, sprawdzam pocztę niechcianą, reguły i przekazywanie.",
      "answerEN": "I get the addresses and time, then check the Exchange message trace. If the message was delivered, I check junk mail, rules and forwarding."
    },
    "An assistant only needs to manage a partner's calendar. What do you grant?": {
      "questionPL": "Co nadać asystentce, która potrzebuje tylko kalendarza partnera?",
      "answerPL": "Nadaję uprawnienie do folderu kalendarza. Do podglądu wystarczy odpowiedni poziom odczytu, a do zarządzania spotkaniami dobieram poziom edycji lub delegowania.",
      "answerEN": "I grant access to the calendar folder. A suitable read permission covers viewing, while managing meetings may require editing or delegation."
    },
    "What is a room or equipment mailbox?": {
      "questionPL": "Co reprezentuje skrzynka sali lub sprzętu?",
      "answerPL": "Reprezentuje zasób, który można zaprosić na spotkanie. Reguły rezerwacji decydują, czy zaproszenie zostanie przyjęte, odrzucone lub przekazane do akceptacji.",
      "answerEN": "It represents a resource that can be invited to a meeting. Booking rules determine whether the invitation is accepted, declined or sent for approval."
    }
  },
  "jml": {
    "Walk me through onboarding a new hire in a hybrid environment.": {
      "questionPL": "Jak wdrożysz nowego pracownika w środowisku hybrydowym?",
      "answerPL": "Sprawdzam zatwierdzone zgłoszenie HR, rolę i datę rozpoczęcia. Tworzę konto w odpowiednim katalogu, nadaję zatwierdzone grupy i licencje, sprawdzam synchronizację i dokumentuję wynik.",
      "answerEN": "I check the approved HR request, role and start date. I create the account in the appropriate directory, assign approved groups and licenses, verify synchronization and document the outcome."
    },
    "What is the risk with a \"mover\" - someone who changes role or department?": {
      "questionPL": "Jakie ryzyko wiąże się ze zmianą stanowiska?",
      "answerPL": "Użytkownik może zachować poprzednie uprawnienia i zgromadzić zbyt duży dostęp. Porównuję obie role, uzgadniam wyjątki i usuwam zbędne uprawnienia w uzgodnionym terminie.",
      "answerEN": "The user may keep old permissions and accumulate excessive access. I compare both roles, confirm exceptions and remove unnecessary permissions at the agreed time."
    },
    "Walk me through offboarding a leaver.": {
      "questionPL": "Jak odbierzesz dostęp odchodzącej osobie?",
      "answerPL": "Potwierdzam tożsamość i godzinę odejścia. Blokuję konta, unieważniam sesje i sprawdzam osobne logowania w aplikacjach. Dane zachowuję według zasad retencji i dokumentuję wynik.",
      "answerEN": "I confirm identity and the departure time. I block accounts, revoke sessions and check separate application logins. I preserve data according to retention policy and document the outcome."
    },
    "A manager asks: \"Give the new person the same access as Anna.\" What do you say?": {
      "questionPL": "Menedżer prosi o taki sam dostęp jak u Anny. Co odpowiesz?",
      "answerPL": "Nie skopiowałbym dostępów Anny jeden do jednego, bo przez lata pewnie nazbierała uprawnień, które nie mają nic wspólnego z nową rolą. Pytam, jakie stanowisko obejmuje nowa osoba, i przypisuję standardowe grupy dla tej roli. Wszystko ponad to jest zgłaszane i zatwierdzane osobno.",
      "answerEN": "I would not copy Anna's access one to one, because over the years she has probably collected permissions that have nothing to do with the new role. I ask what the new person's job is and assign the standard groups for that role. Anything extra is requested and approved separately."
    },
    "Explain least privilege, RBAC and segregation of duties.": {
      "questionPL": "Jak rozumiesz najmniejsze uprawnienia, role i rozdział obowiązków?",
      "answerPL": "Najmniejsze uprawnienia ograniczają dostęp do potrzeb zadania. Role grupują uprawnienia stanowiska. Rozdział obowiązków zapobiega sytuacji, w której jedna osoba wnioskuje o zmianę i sama ją zatwierdza.",
      "answerEN": "Least privilege limits access to what a task requires. Roles group job permissions. Segregation of duties prevents one person from requesting a change and approving it themselves."
    },
    "What is access recertification?": {
      "questionPL": "Na czym polega ponowna certyfikacja dostępu?",
      "answerPL": "Właściciel okresowo potwierdza, komu dostęp jest nadal potrzebny. Rejestruję decyzję, realizuję odebranie zbędnych uprawnień i zachowuję dowód wykonania.",
      "answerEN": "The owner periodically confirms who still needs access. I record the decision, remove unnecessary permissions and retain evidence of completion."
    },
    "Assigning a license to a user fails. What are the usual causes?": {
      "questionPL": "Dlaczego przypisanie licencji może się nie udać?",
      "answerPL": "Sprawdzam dostępne licencje, lokalizację użycia, konflikty planów i błędy przydziału przez grupę. Po naprawie weryfikuję stan użytkownika.",
      "answerEN": "I check available licenses, usage location, conflicting plans and group assignment errors. After the fix, I verify the user's state."
    },
    "Someone calls the helpdesk and asks for a password reset. How do you make sure it is really them?": {
      "questionPL": "Jak potwierdzasz tożsamość przed resetem hasła?",
      "answerPL": "Stosuję zatwierdzoną metodę weryfikacji i korzystam z wcześniej zaufanych danych kontaktowych. Sama znajomość nazwiska lub numeru pracownika nie wystarcza.",
      "answerEN": "I use the approved verification method and previously trusted contact details. Knowing a name or employee number alone isn't enough."
    },
    "What is the difference between unlocking an account and resetting its password?": {
      "questionPL": "Czym różni się odblokowanie konta od resetu hasła?",
      "answerPL": "Odblokowanie pozwala znów próbować logowania dotychczasowym hasłem. Reset ustawia nowe hasło. Przy powtarzającej się blokadzie szukam urządzenia używającego starego hasła.",
      "answerEN": "Unlocking allows another sign-in attempt with the existing password. A reset sets a new password. For repeated lockouts I look for a device using old credentials."
    },
    "What is the difference between an OU and a group?": {
      "questionPL": "Czym różni się jednostka organizacyjna od grupy?",
      "answerPL": "Jednostka organizacyjna porządkuje obiekty w katalogu i pozwala delegować administrację lub stosować zasady. Grupa łączy członków, na przykład w celu nadania dostępu.",
      "answerEN": "An organizational unit organizes directory objects and supports delegation or policy application. A group brings members together, for example to grant access."
    },
    "Why disable a leaver's account first instead of deleting it right away?": {
      "questionPL": "Dlaczego najpierw wyłączasz konto zamiast od razu je usuwać?",
      "answerPL": "Wyłączenie ogranicza dostęp i zostawia czas na zachowanie danych, przekazanie obowiązków oraz sprawdzenie wymogów prawnych. Usunięcie wykonuję później zgodnie z procedurą.",
      "answerEN": "Disabling limits access and gives us time to preserve data, transfer responsibilities and check legal requirements. I delete later according to procedure."
    },
    "You find an enabled account that nobody seems to use. Do you disable it?": {
      "questionPL": "Czy wyłączysz aktywne konto, którego pozornie nikt nie używa?",
      "answerPL": "Najpierw sprawdzam właściciela, typ konta, historię użycia i zależne usługi. Konto bez interaktywnych logowań może nadal obsługiwać proces biznesowy.",
      "answerEN": "First I check the owner, account type, usage history and dependent services. An account with no interactive sign-ins may still support a business process."
    },
    "How should administrator accounts be handled?": {
      "questionPL": "Jak chronić konta administracyjne?",
      "answerPL": "Oddzielam konto codzienne od administracyjnego. Stosuję silne uwierzytelnianie, minimalne role, czasowe podwyższanie uprawnień i monitorowanie działań.",
      "answerEN": "I separate daily and administrative accounts. I use strong authentication, minimal roles, time-limited elevation and activity monitoring."
    },
    "How do share permissions and NTFS permissions combine?": {
      "questionPL": "Jak łączą się uprawnienia udziału i systemu plików?",
      "answerPL": "Sprawdzane są oba poziomy i wygrywa ten bardziej restrykcyjny. Jawna odmowa wygrywa z zezwoleniem. W praktyce uprawnienie na udziale zostawiam proste, a dostępem steruję uprawnieniami systemu plików nadanymi grupom.",
      "answerEN": "Both are checked, and the more restrictive one wins. An explicit deny beats allow. In practice I keep the share permission simple and control access with file-system permissions granted to groups."
    },
    "You need a report of accounts not used for 90 days. Which attribute do you trust?": {
      "questionPL": "Jak znaleźć konta nieużywane od dziewięćdziesięciu dni?",
      "answerPL": "Do wstępnego raportu mogę użyć replikowanego znacznika ostatniego logowania, uwzględniając jego opóźnienie. Dokładniejszy wynik lokalny wymaga porównania danych kontrolerów domeny.",
      "answerEN": "For an initial report I can use the replicated last logon timestamp, allowing for its delay. A more precise on-premises result requires comparing domain controller records."
    },
    "What is an ethical wall, and why does it matter for account administration in a law firm?": {
      "questionPL": "Co oznacza bariera informacyjna w kancelarii?",
      "answerPL": "Ogranicza dostęp między zespołami, na przykład przy konflikcie interesów. Nawet starszy prawnik może potrzebować osobnej zgody na dostęp do konkretnej sprawy.",
      "answerEN": "An ethical wall restricts access between teams, for example during a conflict of interest. Even a senior lawyer may need separate approval for a particular matter."
    },
    "Why must every access change be tied to a ticket and an approval?": {
      "questionPL": "Po co dokumentować zgłoszenie i zgodę na zmianę dostępu?",
      "answerPL": "Dzięki temu można ustalić, kto poprosił, kto zatwierdził, co zmieniono i kiedy. To podstawa audytu, późniejszego przeglądu i bezpiecznego odebrania dostępu.",
      "answerEN": "It shows who requested and approved access, what changed and when. This supports auditing, later review and safe removal of access."
    }
  },
  "case": {
    "A secretary asks to be added to a distribution list. In Exchange admin center the list is greyed out. Can you add her?": {
      "questionPL": "Sekretarka prosi o dodanie do listy, ale lista jest wyszarzona w Exchange. Co robisz?",
      "answerPL": "Tak, ale nie w tym miejscu. Wyszarzona lista oznacza, że jest synchronizowana z lokalnego AD, więc w chmurze jest tylko do odczytu. Dodaję ją do grupy w lokalnym AD i pojawi się w Exchange Online po najbliższej synchronizacji, albo od razu, jeśli uruchomię deltę.",
      "answerEN": "Yes, but not there. Greyed out means the list is synced from on premises, so it is read-only in the cloud. I add her to the group in on-premises AD, and she appears in Exchange Online after the next sync, or right away if I run a delta sync."
    },
    "A contractor has a cloud-only account. The team wants him on their on-prem distribution list. Can you do it?": {
      "questionPL": "Kontraktor ma wyłącznie konto w chmurze. Czy dodasz go do lokalnej listy pocztowej?",
      "answerPL": "Nie bezpośrednio, bo grupa lokalna może zawierać tylko obiekty istniejące w AD. Jeśli ma tylko dostawać maile, tworzę dla niego lokalnie kontakt pocztowy i dodaję ten kontakt. W innym przypadku zakłada się mu konto lokalnie, żeby się zsynchronizowało, albo przenosi listę do chmury.",
      "answerEN": "Not directly, because an on-premises group can only hold objects that exist in AD. If he only needs to receive the emails, I create a mail contact for him on premises and add that. Otherwise his account is created on premises so it syncs, or the list is moved to the cloud."
    },
    "A Teams team wants its members to have access to a folder on the on-prem file server. Can you just add the team's group to the folder?": {
      "questionPL": "Zespół Teams potrzebuje lokalnego folderu. Czy użyjesz grupy zespołu?",
      "answerPL": "Nie. Zespół ma pod spodem grupę Microsoft 365, która istnieje tylko w chmurze, a serwer plików rozumie tylko grupy z lokalnego AD. Tworzę albo wykorzystuję grupę zabezpieczeń w AD z tymi samymi osobami i jej nadaję dostęp. Docelowo te pliki powinny leżeć w witrynie SharePoint zespołu.",
      "answerEN": "No. A team is backed by a Microsoft 365 group, which is cloud-only, and the file server only understands on-premises AD groups. I create or reuse an AD security group with the same people and grant that group access. Longer term, those files belong in the team's SharePoint site."
    },
    "An assistant says: \"I need access to my partner's mailbox so I can send emails for him.\" What do you do?": {
      "questionPL": "Asystentka chce dostęp do skrzynki, aby wysyłać pocztę partnera. Co ustalasz?",
      "answerPL": "Pytam, czy ma też czytać pocztę i co ma widzieć odbiorca. Dobieram wysyłanie jako lub w imieniu. Pełny dostęp nadaję osobno, gdy jest potrzebny i zatwierdzony.",
      "answerEN": "I ask whether she also needs to read mail and what recipients should see. I choose Send As or Send on Behalf. I grant Full Access separately when needed and approved."
    },
    "A partner is on sick leave. His colleague asks for full access to his mailbox \"to keep a client matter moving\". Can you grant it?": {
      "questionPL": "Partner jest na zwolnieniu. Czy kolega może dostać pełny dostęp do jego skrzynki?",
      "answerPL": "Nie na samą prośbę kolegi. Skrzynka zawiera poufną korespondencję z klientami, a właściciel nie może teraz wyrazić zgody. Eskaluję ustaloną ścieżką, a po akceptacji nadaję dostęp na określony czas i zdejmuję go, gdy partner wróci. Mniej inwazyjna opcja to automatyczna odpowiedź kierująca klientów do kolegi.",
      "answerEN": "Not on the colleague's request alone. The mailbox holds privileged client communication, and the owner cannot approve right now. I escalate through the defined route, and if it is approved, I grant it for a limited time and remove it when he is back. A less invasive option is an automatic reply pointing clients to the colleague."
    },
    "HR calls: an employee is being terminated in 30 minutes and must lose all access the moment the meeting starts. What do you do?": {
      "questionPL": "HR zapowiada rozwiązanie umowy za pół godziny. Jak odbierzesz dostęp na czas?",
      "answerPL": "Przygotowuję wszystko i wykonuję o ustalonej minucie. Wyłączam konto w AD i resetuję hasło, wymuszam synchronizację delta i unieważniam sesje w Entra, żeby wydane tokeny przestały działać. Potem blokuję systemy niezależne od AD, takie jak ADERANT, Box czy Dropbox, i potwierdzam do HR, że dostęp został odcięty.",
      "answerEN": "I prepare everything and execute at the agreed minute. I disable the AD account and reset the password, force a delta sync and revoke the sessions in Entra, so existing tokens stop working. Then I block the systems that do not depend on AD, such as ADERANT, Box or Dropbox, and confirm back to HR that access is cut."
    },
    "A new hire starts tomorrow. Her AD account exists, but there is no mailbox and she cannot sign in to Microsoft 365. What do you check?": {
      "questionPL": "Nowa osoba ma konto w AD, ale nie ma skrzynki ani dostępu do Microsoft 365. Co sprawdzisz?",
      "answerPL": "Podążam od źródła do usługi. Sprawdzam synchronizację konta, stan logowania, licencję Exchange i aprowizację skrzynki. Dziennik logowania pomoże wyjaśnić błąd dostępu.",
      "answerEN": "I follow the path from source to service. I check account synchronization, sign-in state, the Exchange license and mailbox provisioning. Sign-in logs help explain the access failure."
    },
    "A user got married and changed her last name. What do you change, and what can break?": {
      "questionPL": "Pracownica zmieniła nazwisko. Co może wymagać zmiany?",
      "answerPL": "Potwierdzam zgłoszenie HR oraz pola nazwy, loginu i poczty. Sprawdzam kolizje, zachowuję poprzedni adres jako alias, jeśli polityka pozwala, i weryfikuję zależne aplikacje.",
      "answerEN": "I verify the HR request and the name, sign-in and mail fields. I check for collisions, retain the old address as an alias if policy allows, and verify dependent applications."
    },
    "A shared mailbox is almost at 50 GB. What are the options?": {
      "questionPL": "Skrzynka współdzielona zbliża się do pięćdziesięciu gigabajtów. Co robisz?",
      "answerPL": "Są trzy opcje. Posprzątać, jeśli zawartość wolno usunąć. Przypisać licencję Exchange Online Plan 2, która podnosi limit do stu gigabajtów. Albo włączyć archiwum online, które też wymaga licencji. W kancelarii przed usunięciem czegokolwiek sprawdzam retencję i blokady.",
      "answerEN": "There are three options. Clean up, if the content is allowed to be deleted. Assign an Exchange Online Plan 2 license, which raises the limit to one hundred gigabytes. Or enable an online archive, which also needs a license. In a law firm I check retention and holds before deleting anything."
    },
    "You granted Send As ten minutes ago, and the user still gets \"You do not have permission to send on behalf of this user\". What now?": {
      "questionPL": "Dziesięć minut po nadaniu wysyłania jako użytkownik nadal dostaje błąd. Co sprawdzisz?",
      "answerPL": "Uprawnienia w Exchange Online mogą się propagować nawet godzinę. Sprawdzam, czy uprawnienie faktycznie jest nadane, proszę użytkownika o restart Outlooka i wybranie adresu z globalnej książki adresowej zamiast z podpowiedzi. Szybki test w Outlooku w przeglądarce pokaże, czy problemem jest uprawnienie, czy sam klient.",
      "answerEN": "Permissions in Exchange Online can take up to an hour to apply. I verify the permission is really there, ask the user to restart Outlook and pick the address from the global address list instead of autocomplete. A quick test in Outlook on the web shows whether it is the permission or just the client."
    },
    "You get a CSV with 300 users to add to a security group. How do you do it?": {
      "questionPL": "Dostajesz listę trzystu osób do dodania do grupy. Jak postąpisz?",
      "answerPL": "Sprawdzam zgodę, identyfikatory, duplikaty i obecnych członków. Przygotowuję podgląd zmian, testuję małą próbkę, zapisuję wyniki i porównuję końcowe członkostwo z wnioskiem.",
      "answerEN": "I verify approval, identifiers, duplicates and existing members. I preview changes, test a small sample, log outcomes and compare final membership with the request."
    },
    "A user keeps getting locked out every few minutes. How do you find the cause?": {
      "questionPL": "Konto blokuje się co kilka minut. Jak znajdziesz przyczynę?",
      "answerPL": "Sprawdzam zdarzenia blokady na kontrolerach domeny, zwłaszcza zdarzenie 4740, i szukam komputera wywołującego blokadę. Potem sprawdzam zapisane hasła, usługi i zadania.",
      "answerEN": "I check domain controller lockout events, especially event forty-seven forty, and look for the calling computer. Then I check stored credentials, services and scheduled tasks."
    },
    "Firm Counsel has placed a leaver's data on legal hold. Six months later someone asks you to delete the mailbox to free the license. Can you?": {
      "questionPL": "Skrzynkę byłej pracownicy objęto obowiązkiem zachowania. Czy usuniesz ją, by odzyskać licencję?",
      "answerPL": "Nie, dopóki Office of Firm Counsel nie zwolni blokady. Koszt licencji to nie jest coś, co mogę przeciwstawić obowiązkowi prawnemu. Potwierdzam z nimi status blokady, a jeśli zawartość musi zostać, można ją zachować jako nieaktywną skrzynkę objętą blokadą.",
      "answerEN": "No, not until the Office of Firm Counsel releases the hold. The cost of a license is not something I can weigh against a legal obligation. I confirm the hold status with them, and if the content must stay, it can be kept as an inactive mailbox on hold."
    },
    "A lawyer wants to give a client access to a Teams channel. What do you check?": {
      "questionPL": "Prawnik chce zaprosić klienta do kanału Teams. Co ustalasz?",
      "answerPL": "Sprawdzam typ kanału, zakres widocznych plików, politykę dostępu zewnętrznego i zgodę właściciela sprawy. Nadaję najmniejszy potrzebny dostęp i ustalam termin przeglądu.",
      "answerEN": "I check the channel type, visible files, external access policy and matter owner approval. I grant the minimum access needed and set a review date."
    },
    "A user has a new phone and can no longer approve MFA prompts. What do you do?": {
      "questionPL": "Nowy telefon uniemożliwia potwierdzenie logowania. Jak pomożesz?",
      "answerPL": "Najpierw weryfikuję tożsamość zgodnie z procedurą firmy, bo to klasyczna prośba przy próbie przejęcia konta. Potem wydaję Temporary Access Pass, żeby użytkownik zarejestrował aplikację Authenticator na nowym telefonie, i usuwam stare urządzenie z jego metod logowania.",
      "answerEN": "First I verify identity through the firm's procedure, because this is a classic account takeover request. Then I issue a Temporary Access Pass, so the user can register the Authenticator app on the new phone, and I remove the old device from their sign-in methods."
    },
    "A request needs approval from the Office of Firm Counsel, but the partner says it is urgent and asks you to do it now and get the approval later. What do you do?": {
      "questionPL": "Partner chce pominąć zgodę działu prawnego z powodu pilnej sprawy. Co robisz?",
      "answerPL": "Potwierdzam pilność, sprawdzam upoważnionego zastępcę i uruchamiam ścieżkę eskalacji. Podaję godzinę kolejnej informacji. Nadaję dostęp po uzyskaniu wymaganej zgody.",
      "answerEN": "I acknowledge the urgency, check for an authorized alternate and escalate. I give a time for the next update. I grant access after the required approval."
    },
    "Two domain admins disagree: one wants a new access group created in AD, the other in Entra. How do you decide?": {
      "questionPL": "Grupę utworzyć w AD czy w Entra?",
      "answerPL": "Decyduje to, gdzie grupa będzie używana. Jeśli jest potrzebna lokalnie, na udziałach plików albo w lokalnych aplikacjach, tworzę ją w AD i synchronizuję, a wtedy działa też w chmurze. Jeśli służy tylko zasobom chmurowym albo ma zawierać użytkowników tylko chmurowych, tworzę ją w Entra. I trzymam się istniejącego standardu firmy.",
      "answerEN": "By where the group will be used. If it is needed on premises, for file shares or on-premises applications, I create it in AD and let it sync, and then it works in the cloud too. If it is only for cloud resources, or must contain cloud-only users, I create it in Entra. And I follow the firm's existing standard."
    },
    "You are asked whether an on-prem group can be \"moved\" to the cloud. What do you answer?": {
      "questionPL": "Czy można przenieść grupę lokalną do chmury?",
      "answerPL": "Tak, na dwa sposoby. Albo odtwarzam ją jako grupę chmurową z tymi samymi członkami i ustawieniami i wycofuję lokalną, albo używam konwersji źródła zarządzania od Microsoftu, która zmienia zsynchronizowaną grupę w zarządzaną w chmurze bez tworzenia nowej. Wcześniej sprawdzam, co zależy od tej grupy lokalnie, bo udziały plików przestałyby ją widzieć.",
      "answerEN": "Yes, in one of two ways. Either recreate it as a cloud group with the same members and settings and retire the on-premises one, or use Microsoft's source of authority conversion, which turns the synced group into a cloud-managed one in place. Before that I check what depends on the group on premises, because file shares would stop seeing it."
    }
  },
  "powershell": {
    "Explain these PowerShell basics: the pipeline, `$_`, and the operators -eq, -like, -match, -contains.": {
      "questionPL": "Jak działają potok, bieżący obiekt i operatory porównania w PowerShellu?",
      "answerPL": "Potok przekazuje obiekty. Dolar i podkreślenie oznaczają bieżący obiekt. Operator eq porównuje wartości, like dopasowuje wzorzec, match używa wyrażenia regularnego, a contains sprawdza obecność elementu w kolekcji.",
      "answerEN": "The pipeline passes objects. Dollar underscore means the current object. The eq operator compares values, like matches a wildcard pattern, match uses a regular expression, and contains checks membership in a collection."
    },
    "What habits make a script safe to run in production?": {
      "questionPL": "Jak bezpiecznie przygotować skrypt do produkcji?",
      "answerPL": "Sprawdzam dane wejściowe i zakres, robię podgląd zmian i test na jednym obiekcie. Używam parametru WhatIf tam, gdzie jest obsługiwany. Zapisuję wyniki i planuję cofnięcie zmiany.",
      "answerEN": "I validate inputs and scope, preview changes and test on one object. I use WhatIf where supported. I log the results and plan how to reverse the change."
    }
  },
  "sql": {
    "What is the difference between INNER JOIN and LEFT JOIN?": {
      "questionPL": "Czym różni się złączenie wewnętrzne od lewostronnego?",
      "answerPL": "Złączenie wewnętrzne zachowuje dopasowania z obu tabel. Lewostronne zachowuje również niedopasowane wiersze z lewej i wstawia po prawej wartości puste. Tak mogę znaleźć konto bez rekordu HR.",
      "answerEN": "An inner join keeps matches from both tables. A left join also keeps unmatched rows from the left, with nulls on the right. That's how I can find an account with no HR record."
    },
    "What is the difference between COUNT(*) and COUNT(column), and what does DISTINCT do?": {
      "questionPL": "Jak działają COUNT z gwiazdką, COUNT z kolumną i DISTINCT?",
      "answerPL": "COUNT z gwiazdką liczy wiersze. COUNT z nazwą kolumny pomija w niej wartości puste. DISTINCT usuwa duplikaty z wybranego zestawu wartości.",
      "answerEN": "Count star counts rows. Count of a column skips null values in that column. Distinct removes duplicates from the selected set of values."
    }
  },
  "rozmowa": {
    "What does the Account Administration team do, in your own words?": {
      "questionPL": "Jak własnymi słowami opiszesz pracę zespołu administracji kont?",
      "answerPL": "Zespół tworzy konta nowych osób, zmienia dostęp przy zmianie roli i odbiera go przy odejściu. Obsługuje również grupy, skrzynki i licencje oraz dokumentuje zgody i realizację wniosków.",
      "answerEN": "The team creates accounts for new hires, changes access when roles change and removes it when people leave. It also manages groups, mailboxes and licenses, and records approvals and fulfillment."
    },
    "What is ADERANT, and how do you answer when you have not worked with it?": {
      "questionPL": "Czym jest ADERANT i jak odpowiedzieć, gdy nie masz z nim doświadczenia?",
      "answerPL": "ADERANT to oprogramowanie do zarządzania kancelarią: rejestracja czasu, rozliczenia i finanse. Samym ADERANT-em nie administrowałem. Zarządzałem kontami i przypisaniami ról w SAP-ie, a zasady są te same: dostęp oparty na rolach, akceptacje i odbieranie dostępu na czas. Szczegółów ADERANT-a nauczyłbym się z Waszych procedur w pierwszych tygodniach.",
      "answerEN": "ADERANT is practice management software for law firms: time recording, billing and financials. I have not administered ADERANT itself. I managed user accounts and role assignments in SAP, and the principles are the same: role-based access, approvals, and removing access on time. I'd learn the ADERANT specifics from your procedures in the first weeks."
    },
    "What is Ivanti, and how does it compare to what you use?": {
      "questionPL": "Do czego służy Ivanti i do czego możesz je porównać?",
      "answerPL": "Ivanti służy tutaj do obsługi zgłoszeń. Moim punktem odniesienia jest ServiceNow. Potrafię opowiedzieć, jak śledziłem wniosek od rejestracji i akceptacji do zamknięcia.",
      "answerEN": "Ivanti is used here for service tickets. My reference point is ServiceNow. I can explain how I tracked a request from logging and approval through closure."
    },
    "What is PingOne Identity?": {
      "questionPL": "Czym jest PingOne Identity?",
      "answerPL": "To platforma tożsamości obsługująca między innymi jednokrotne logowanie i uwierzytelnianie wieloskładnikowe. Zapytałbym, które aplikacje w tej firmie z niej korzystają.",
      "answerEN": "It's an identity platform supporting single sign-on and multifactor authentication. I'd ask which applications use it at this firm."
    },
    "The posting lists Dropbox, Box, Google Workspace, ShareFile, Preparis, eFax and Zoom. What is your role there?": {
      "questionPL": "Jaka jest twoja rola w narzędziach zewnętrznych, takich jak Box lub Zoom?",
      "answerPL": "Tworzę, zmieniam i wyłączam dostęp zgodnie z rolą. Przy odejściu sprawdzam też usługi z osobnym logowaniem, bo samo wyłączenie głównego konta może ich nie objąć.",
      "answerEN": "I create, change and disable access according to role. When someone leaves I also check services with separate sign-ins, because disabling the main account may not cover them."
    },
    "Why does some access need approval from the Office of Firm Counsel?": {
      "questionPL": "Dlaczego niektóre wnioski zatwierdza dział prawny kancelarii?",
      "answerPL": "Dostęp może dotyczyć tajemnicy klienta, konfliktu interesów lub danych objętych obowiązkiem zachowania. Rozpoznaję taki wniosek, uzyskuję właściwą zgodę i zapisuję ją do późniejszego przeglądu.",
      "answerEN": "Access may involve client confidentiality, a conflict of interest or preserved data. I identify the request, obtain the right approval and record it for later review."
    },
    "The posting mentions understanding AI capabilities, limitations and responsible use. What is your view?": {
      "questionPL": "Jak odpowiedzialnie używasz sztucznej inteligencji?",
      "answerPL": "Mogę użyć zatwierdzonego narzędzia do szkicu skryptu. Sprawdzam, co zrobi każde polecenie, i testuję wynik. Chronię dane klientów i dane uwierzytelniające.",
      "answerEN": "I can use an approved tool to draft a script. I check what each command will do and test the result. I protect client data and credentials."
    },
    "Tell me about yourself.": {
      "questionPL": "Jak krótko opowiesz o sobie?",
      "answerPL": "Pracuję w globalnym service desku, gdzie większość mojej pracy to tożsamość i dostępy: konta, grupy, skrzynki i licencje w Entra ID i Active Directory. Wcześniej wspierałem hybrydowe środowisko AD i Microsoft 365 i zarządzałem dostępami w SAP-ie. Co się da, automatyzuję w PowerShellu, Pythonie i Power Automate. To stanowisko to ta część mojej pracy, którą lubię najbardziej, tylko jako specjalizacja.",
      "answerEN": "I work on a global service desk, where most of my work is identity and access: accounts, groups, mailboxes and licenses in Entra ID and Active Directory. Before that I supported a hybrid AD and Microsoft 365 environment and managed access in SAP. I automate what I can with PowerShell, Python and Power Automate. This role is the part of my job I like most, done as a specialty."
    },
    "Why do you want this role, and why this firm?": {
      "questionPL": "Dlaczego chcesz tej roli właśnie w tej firmie?",
      "answerPL": "Najbardziej interesuje mnie część mojej pracy związana z tożsamością i dostępem. Tutaj stanowi sedno stanowiska. Chciałbym rozwijać się w środowisku hybrydowym, w którym liczą się poufność i dokładność.",
      "answerEN": "The identity and access part of my work interests me most. Here it's central to the role. I'd like to grow in a hybrid environment where confidentiality and accuracy matter."
    },
    "Tell me about a script or automation you built.": {
      "questionPL": "Jak opowiesz o własnej automatyzacji?",
      "answerPL": "Polskie znaki w nazwach powodowały problemy w systemach międzynarodowych. Pomagałem przygotować i przetestować skrypt normalizujący nazwy. Za wdrożenie produkcyjne odpowiadał zespół globalny.",
      "answerEN": "Polish characters in names caused problems in international systems. I helped prepare and test a script to normalize the names. The global team handled the production rollout."
    },
    "Tell me about a process you improved.": {
      "questionPL": "Jak opowiesz o usprawnieniu procesu?",
      "answerPL": "Ręczne sprawdzanie nowych pracowników było wolne i zdarzały się kolizje: zduplikowane loginy i osoby, które miały już konto. Zbudowałem automatyzację, która odpytuje Microsoft Graph, porównuje wyniki z naszymi listami w Excelu, oznacza duplikaty i daje znać, kiedy trzeba założyć konto. Efekt to mniej ręcznego sprawdzania i mniej zduplikowanych kont.",
      "answerEN": "Checking new joiners by hand was slow, and we had collisions: duplicate logins and people who already had an account. I built an automation that queries Microsoft Graph, compares the results with our Excel lists, flags duplicates and alerts us when an account needs to be created. The result was less manual checking and fewer duplicate accounts."
    },
    "Tell me about a mistake you made.": {
      "questionPL": "Jak odpowiesz na pytanie o własny błąd?",
      "answerPL": "Opiszę konkretną sytuację, jak wykryłem błąd, kogo poinformowałem i jak go naprawiłem. Zakończę zmianą w procesie, która zmniejsza ryzyko powtórki.",
      "answerEN": "I'd describe a specific situation, how I spotted the error, who I informed and how I corrected it. I'd finish with the process change that reduces the chance of recurrence."
    },
    "How do you handle a senior person who pressures you to skip the procedure?": {
      "questionPL": "Co robisz, gdy osoba na wysokim stanowisku naciska na pominięcie procedury?",
      "answerPL": "Uznaję pilność i wyjaśniam, jak mogę przyspieszyć zatwierdzenie. Szukam uprawnionego zastępcy i podaję termin kolejnej informacji.",
      "answerEN": "I acknowledge the urgency and explain how I can expedite approval. I look for an authorized alternate and give a time for the next update."
    },
    "How do you prioritize when several urgent requests arrive at once?": {
      "questionPL": "Jak ustalasz priorytety kilku pilnych zgłoszeń?",
      "answerPL": "Oceniam ryzyko, wpływ na pracę i terminy. Pilne odebranie dostępu może mieć pierwszeństwo przed zwykłym wnioskiem. Ustalam kolejność i informuję zainteresowanych o postępach.",
      "answerEN": "I assess risk, business impact and deadlines. An urgent access revocation may take priority over a routine request. I set the order and update the people involved."
    },
    "This role includes on-call and working with teams in the US. How do you feel about that?": {
      "questionPL": "Jak rozmawiać o dyżurach i współpracy z zespołem w USA?",
      "answerPL": "Podam swoją rzeczywistą dostępność. Zapytałbym o częstotliwość dyżurów, godziny wspólnej pracy i sposób przekazywania otwartych spraw między strefami czasowymi.",
      "answerEN": "I'd give my actual availability. I'd ask about the on-call rotation, overlapping hours and how open tickets are handed over between time zones."
    },
    "How do you treat confidential information?": {
      "questionPL": "Jak postępujesz z informacjami poufnymi?",
      "answerPL": "Otwieram tylko dane potrzebne do zgłoszenia, używam zatwierdzonych kanałów i udostępniam je wyłącznie uprawnionym osobom. Podejrzenie ujawnienia zgłaszam zgodnie z procedurą.",
      "answerEN": "I access only the data needed for the ticket, use approved channels and share it only with authorized people. I report suspected disclosure according to procedure."
    },
    "What questions will you ask the panel?": {
      "questionPL": "Jakie pytania zadasz panelowi?",
      "answerPL": "Co nowa osoba powinna obsługiwać samodzielnie po pierwszych trzech miesiącach? Które zgłoszenia wymagają najwięcej osądu? Jak Warszawa i zespół w Stanach przekazują sobie otwarte zgłoszenia? I jaka część zarządzania grupami jest nadal lokalna?",
      "answerEN": "What should a new hire handle independently after the first three months? Which requests require the most judgment? How do Warsaw and the US team hand over open tickets? And how much of group management is still on premises?"
    },
    "If a question comes up that you cannot answer, what do you say?": {
      "questionPL": "Co powiesz, jeśli nie znasz odpowiedzi?",
      "answerPL": "Powiem, którą część rozumiem i jak sprawdziłbym resztę. Przed zmianą produkcyjną zweryfikowałbym dokumentację lub procedurę i w razie potrzeby poprosił właściciela systemu o potwierdzenie.",
      "answerEN": "I'd say which part I understand and how I'd verify the rest. Before a production change I'd check the documentation or procedure and ask the system owner to confirm if necessary."
    }
  }
};
