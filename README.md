# IAM Prep

Statyczna aplikacja do nauki na telefonie: fiszki z powtórkami, scenariusze, czytanie skryptów i tryb słuchania.
Bez budowania i bez backendu: HTML, CSS i JS, a treść to pliki Markdown wczytywane w przeglądarce.

## Uruchomienie lokalnie

```bash
python3 -m http.server 8642
```

Potem otwórz `http://localhost:8642`.

## Jak dodać lub poprawić kartę

Każda talia to plik w `content/`. Nową talię trzeba dopisać do listy `DECKS` w `assets/app.js`.

```markdown
# Tytuł talii
> Krótki opis talii.

## Pytanie (po angielsku)
Odpowiedź. Może mieć akapity, listy z "- " lub "1. ", `kod w linii` i **pogrubienie**.

PL: Polska notatka. Wszystko od tej linii do końca karty.

## Pytanie z kodem na przodzie karty
` ` `powershell
Get-ADUser -Filter *
` ` `
---
Wszystko nad linią "---" jest widoczne od razu, wszystko pod nią dopiero po odsłonięciu.
```

(W prawdziwym pliku bloki kodu otwierasz i zamykasz trzema grawisami bez spacji.)

Postęp nauki jest powiązany z treścią pytania (i kodu nad linią `---`): zmiana tego tekstu zeruje postęp tej jednej karty.

## Gdzie jest postęp

W `localStorage` przeglądarki, tylko na danym urządzeniu. Nic nie jest wysyłane na serwer.
