'use strict';
const lessons = {
 sql: {
  intro:'SQLite uruchamiany w przeglądarce. W tabeli accounts masz login, name, department, enabled i employee_id. Tabela hr zawiera employee_id i name. Na rozmowie zobaczysz raczej T-SQL z SQL Servera: funkcje dat, takie jak GETDATE() i DATEADD(), tutaj nie zadziałają, ale SELECT, JOIN, GROUP BY i UPDATE pisze się tak samo.',
  steps:[['SELECT … FROM','Wybierz kolumny i tabelę. Gwiazdka oznacza wszystkie kolumny.'],['WHERE · ORDER BY','WHERE ogranicza wiersze, a ORDER BY ustala kolejność. Tekst ujmuj w apostrofy.'],['GROUP BY · COUNT(*)','Zgrupuj konta według działu. COUNT(*) policzy wiersze w każdej grupie.'],['LEFT JOIN · IS NULL','Zachowaj wszystkie konta i dołącz pasujące osoby z HR. Pusty klucz po stronie HR oznacza brak dopasowania.']],
  examples:[
    ['Odczytaj konta','SELECT *\nFROM accounts;'],
    ['Filtruj i sortuj',"SELECT login, name\nFROM accounts\nWHERE enabled = 1\n  AND department = 'Legal'\nORDER BY name;"],
    ['Policz konta w działach','SELECT department, COUNT(*) AS total\nFROM accounts\nGROUP BY department\nORDER BY total DESC;'],
    ['Znajdź brak dopasowania','SELECT a.login, a.department\nFROM accounts AS a\nLEFT JOIN hr AS h\n  ON h.employee_id = a.employee_id\nWHERE h.employee_id IS NULL;']],
  tasks:[{"task":"Wyświetl tylko loginy aktywnych kont z IT, alfabetycznie. Powinny pojawić się jkowal i svc_scan.","hint":"Wybierz login, połącz dwa warunki przez AND i zakończ ORDER BY login.","solution":"SELECT login\nFROM accounts\nWHERE enabled = 1\n  AND department = 'IT'\nORDER BY login;","ask":"Dopytanie: czy brak wpisu w HR wystarczy, żeby od razu wyłączyć svc_scan? Nie. To konto usługowe i może mieć właściciela spoza listy pracowników, więc najpierw ustalasz właściciela i to, co z konta korzysta."},{"task":"Znajdź konta, które nie mają odpowiednika w tabeli hr. Powinno wyjść jedno: svc_scan.","hint":"Zacznij od accounts, dołącz hr przez LEFT JOIN po employee_id i zostaw wiersze, w których strona hr jest pusta (IS NULL).","solution":"SELECT a.login, a.department\nFROM accounts AS a\nLEFT JOIN hr AS h\n  ON h.employee_id = a.employee_id\nWHERE h.employee_id IS NULL;","ask":"Dopytanie: dlaczego LEFT JOIN, a nie INNER JOIN? INNER JOIN zostawia tylko pary z dopasowaniem, więc konto bez wpisu w HR zniknęłoby z wyniku. LEFT JOIN zachowuje wszystkie konta i pokazuje brak jako NULL."},{"task":"Pokaż osoby z listy HR, których konto jest wyłączone: nazwisko z hr i login z accounts. Powinny wyjść dwie osoby.","hint":"Tu wystarczy zwykły JOIN po employee_id i warunek enabled = 0.","solution":"SELECT h.name, a.login\nFROM hr AS h\nJOIN accounts AS a\n  ON a.employee_id = h.employee_id\nWHERE a.enabled = 0;","ask":"Dopytanie: co ta lista znaczy w praktyce? To pracownicy z listy HR bez działającego konta. Powodem może być długa nieobecność albo błąd, więc to lista do sprawdzenia, a nie do automatycznego włączenia kont."},{"task":"Policz aktywne konta w każdym dziale i pokaż tylko działy, które mają więcej niż jedno. Powinny wyjść IT i Legal, po 2.","hint":"WHERE enabled = 1 filtruje wiersze przed grupowaniem, GROUP BY department tworzy grupy, a HAVING COUNT(*) > 1 filtruje gotowe grupy.","solution":"SELECT department, COUNT(*) AS active_accounts\nFROM accounts\nWHERE enabled = 1\nGROUP BY department\nHAVING COUNT(*) > 1;","ask":"Dopytanie: czym różni się WHERE od HAVING? WHERE odrzuca wiersze przed grupowaniem, HAVING odrzuca całe grupy po policzeniu."},{"task":"To zapytanie ma znaleźć konta bez numeru pracownika, ale nic nie zwraca. Popraw je: SELECT login FROM accounts WHERE employee_id = NULL;","hint":"Z NULL niczego nie porównuje się znakiem równości. Jest do tego osobny operator.","solution":"SELECT login\nFROM accounts\nWHERE employee_id IS NULL;","ask":"Dopytanie: dlaczego = NULL nie działa? NULL oznacza wartość nieznaną, a porównanie z nieznaną wartością nigdy nie jest prawdą. Dlatego używa się IS NULL i IS NOT NULL."},{"task":"Wyłącz wszystkie aktywne konta z działu Legal, ale bezpiecznie: najpierw pokaż SELECT-em, które wiersze zmienisz, potem wykonaj UPDATE z tym samym WHERE, na końcu sprawdź wynik. Wszystko w jednym uruchomieniu.","hint":"Trzy polecenia oddzielone średnikami. Warunek w SELECT i w UPDATE ma być identyczny. Każde uruchomienie startuje na świeżych danych, więc niczego nie zepsujesz.","solution":"SELECT login FROM accounts\nWHERE department = 'Legal' AND enabled = 1;\n\nUPDATE accounts SET enabled = 0\nWHERE department = 'Legal' AND enabled = 1;\n\nSELECT login, enabled FROM accounts\nWHERE department = 'Legal';","ask":"Dopytanie: co by się stało bez WHERE w UPDATE? Zmieniłyby się wszystkie wiersze w tabeli. Na produkcji w SQL Serverze dodatkowo opakowujesz zmianę w BEGIN TRANSACTION i robisz COMMIT dopiero po sprawdzeniu liczby zmienionych wierszy."}]

 },
 ps:{
  intro:'Symulator wybranych poleceń PowerShell na fikcyjnym AD. Obiekty mają pola SamAccountName, Name, Department i Enabled. Każdy potok zaczynaj od Get-ADUser -Filter * -Properties *.',
  steps:[['Get-ADUser','Pobierz konta. W ćwiczeniu wszystkie cztery pola są zawsze dostępne.'],['Where-Object','Potok przekazuje obiekty dalej. $_ to aktualne konto. Warunek -eq $false wybiera konta wyłączone.'],['Sort-Object · Select-Object','Po filtrze działu posortuj obiekty po nazwie, a następnie wybierz pola wyniku.'],['-like · Measure-Object','Wzorzec svc_* wybiera loginy z prefiksem svc_. Measure-Object liczy obiekty pozostałe po filtrze.']],
  examples:[
    ['Odczytaj konta','Get-ADUser -Filter * -Properties *'],
    ['Znajdź wyłączone konta','Get-ADUser -Filter * -Properties * |\n  Where-Object { $_.Enabled -eq $false } |\n  Select-Object SamAccountName, Name'],
    ['Sortuj konta IT',"Get-ADUser -Filter * -Properties * |\n  Where-Object { $_.Department -eq 'IT' } |\n  Sort-Object Name |\n  Select-Object Name, Enabled"],
    ['Policz konta usługowe',"Get-ADUser -Filter * -Properties * |\n  Where-Object { $_.SamAccountName -like 'svc_*' } |\n  Measure-Object"]],
  tasks:[{"task":"Pokaż loginy i nazwy aktywnych kont z działu Legal. Następnie zmień potok tak, aby zwrócił liczbę tych kont. Oczekiwany wynik to 2.","hint":"Użyj dwóch etapów Where-Object, osobno dla Department i Enabled. Na końcu spróbuj Select-Object, a potem zamień go na Measure-Object.","solution":"Get-ADUser -Filter * -Properties * |\n  Where-Object { $_.Department -eq 'Legal' } |\n  Where-Object { $_.Enabled -eq $true } |\n  Measure-Object","ask":"Dopytanie: co to jest $_? To bieżący obiekt w potoku, czyli konto, które Where-Object właśnie sprawdza."},{"task":"Pokaż wyłączone konta posortowane po nazwie, tylko login i dział. Powinny wyjść mwojcik i tkrol.","hint":"Where-Object z -eq $false, potem Sort-Object Name, na końcu Select-Object. Sortuj przed Select-Object, bo po nim pole Name już nie istnieje.","solution":"Get-ADUser -Filter * -Properties * |\n  Where-Object { $_.Enabled -eq $false } |\n  Sort-Object Name |\n  Select-Object SamAccountName, Department","ask":"Dopytanie: czy ten potok cokolwiek zmienia w AD? Nie. Get, Where, Sort i Select tylko czytają. Zmieniałby dopiero cmdlet typu Set-ADUser albo Disable-ADAccount na końcu potoku."},{"task":"Pokaż nazwę i dział wszystkich kont spoza IT. Powinny wyjść trzy.","hint":"Operator -ne oznacza „różne od”.","solution":"Get-ADUser -Filter * -Properties * |\n  Where-Object { $_.Department -ne 'IT' } |\n  Select-Object Name, Department","ask":"Dopytanie: jak zrobić to wydajniej w prawdziwym AD? Przenieść warunek do parametru -Filter, żeby filtrował kontroler domeny, a nie Twoja stacja. Symulator obsługuje tylko -Filter *."},{"task":"Policz konta usługowe, czyli takie, których login zaczyna się od svc_. Potem zmień wzorzec i sprawdź, ile kont ma login kończący się na literę k (powinny być 2).","hint":"Operator -like z gwiazdką: svc_* dopasuje początek, a *k dopasuje koniec.","solution":"Get-ADUser -Filter * -Properties * |\n  Where-Object { $_.SamAccountName -like 'svc_*' } |\n  Measure-Object","ask":"Dopytanie: czym różni się -like od -match? -like używa prostych symboli wieloznacznych (* i ?), a -match pełnych wyrażeń regularnych."}]

 }
};
const $=id=>document.getElementById(id);
function element(tag,text){const el=document.createElement(tag);el.textContent=text;return el;}
let mode, activeWorker, timer, taskIndex = 0;
const drafts={};
function stop(){clearTimeout(timer);activeWorker?.terminate();activeWorker=null;$('run').disabled=false;}
function showMode(next){
 if(mode)drafts[mode]={input:$('source').value,index:$('example').selectedIndex,task:taskIndex};
 stop();mode=next;
 $('workshop-picker').hidden=Boolean(mode);
 $('workshop').hidden=!mode;
 document.body.dataset.track=mode||'';
 if(!mode)return;
 const lesson=lessons[mode];
 $('track-name').textContent=mode==='sql'?'Warsztaty SQL':'Warsztaty PowerShell';
 $('track-intro').textContent=lesson.intro;
 $('file-name').textContent=mode==='sql'?'accounts.sql':'directory.ps1';
 $('prompt-status').textContent='';
 $('example').replaceChildren(...lesson.examples.map(([name])=>element('option',name)));
 $('example').selectedIndex=drafts[mode]?.index??0;
 $('source').value=drafts[mode]?.input??lesson.examples[0][1];
 refreshLesson();
 $('editor-title').textContent=mode==='sql'?'Twoje zapytanie':'Twoje polecenie';
 showTask(drafts[mode]?.task??0);
 $('output').textContent='Uruchom polecenie, żeby zobaczyć dane.';
}
function showTask(i){
 const list=lessons[mode].tasks;taskIndex=(i+list.length)%list.length;
 const current=list[taskIndex];
 $('task-count').textContent=(taskIndex+1)+' / '+list.length;
 $('task').textContent=current.task;$('hint').textContent=current.hint;
 $('solution').textContent=current.solution;$('follow-up').textContent=current.ask;
 for(const box of document.querySelectorAll('#task-box details'))box.open=false;
}
function useSolution(){
 stop();$('source').value=lessons[mode].tasks[taskIndex].solution;
 $('output').textContent='Rozwiązanie wstawione. Uruchom je i porównaj wynik.';
 $('source').scrollIntoView({block:'center'});
}
function refreshLesson(){
 const [syntax,description]=lessons[mode].steps[$('example').selectedIndex];
 $('lesson').replaceChildren(element('code',syntax),' — '+description);
}
function example(){stop();refreshLesson();$('source').value=lessons[mode].examples[$('example').selectedIndex][1];$('output').textContent='Przykład gotowy do uruchomienia.';}
function run(){
 stop();const input=$('source').value.trim();if(!input){$('output').textContent='Wpisz polecenie.';return;}
 $('output').textContent='Uruchamianie…';$('run').disabled=true;
 const finish=message=>{stop();$('output').textContent=message;};
 try{activeWorker=new Worker('lab-worker.js');}catch{finish('Nie udało się otworzyć konsoli. Odśwież stronę.');return;}
 activeWorker.onerror=()=>finish('Nie udało się uruchomić silnika. Sprawdź połączenie i spróbuj ponownie.');
 timer=setTimeout(()=>finish('Przekroczono czas wykonania. Uprość zapytanie i spróbuj jeszcze raz.'),10000);
 activeWorker.onmessage=({data})=>{
   if(data.error){finish(data.error);return;}
   stop();const output=$('output');output.replaceChildren();
   if(!data.result.length)output.textContent='Wykonano. Polecenie nie zwróciło tabeli.';
   for(const {columns,rows,limited} of data.result){
     const table=document.createElement('table'),head=table.createTHead().insertRow(),body=table.createTBody();
     for(const col of columns)head.append(element('th',col));
     for(const row of rows){const tr=body.insertRow();row.forEach((value,i)=>{const cell=tr.insertCell();cell.dataset.label=columns[i];cell.textContent=value===null?'NULL':String(value);});}
     output.append(element('small',limited?'Pierwsze 100 wierszy':'Liczba wierszy: '+rows.length),table);
   }
 };
 activeWorker.postMessage({mode,input});
}
function routeWorkshop(){
 const track=location.hash.slice(1);
 showMode(Object.hasOwn(lessons,track)?track:null);
 window.scrollTo(0,0);
}
window.addEventListener('hashchange',routeWorkshop);
$('run').onclick=run;$('next-task').onclick=()=>showTask(taskIndex+1);$('prev-task').onclick=()=>showTask(taskIndex-1);$('use-solution').onclick=useSolution;$('reset').onclick=example;$('example').onchange=example;
$('source').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run();}});
routeWorkshop();

function translatePrompt(raw, language) {
  const normalized=raw.trim().toLocaleLowerCase('pl').replace(/[.?!]+$/,'').replace(/\s+/g,' ');
  const match=normalized.match(/^(pokaż|pokaz|policz)(?: (aktywne|włączone|wyłączone|nieaktywne))? konta(?: z(?: działu)? (it|legal|hr))?$/);
  if(!match)return null;
  const count=match[1]==='policz';
  const active=match[2] ? ['aktywne','włączone'].includes(match[2]) : null;
  const dept={it:'IT',hr:'HR',legal:'Legal'}[match[3]];
  if(language==='sql'){
    const filters=[];
    if(active!==null)filters.push('enabled = '+Number(active));
    if(dept)filters.push("department = '"+dept+"'");
    return 'SELECT '+(count?'COUNT(*) AS total':'login, name, department')+'\nFROM accounts'+(filters.length?'\nWHERE '+filters.join(' AND '):'')+';';
  }
  const stages=['Get-ADUser -Filter * -Properties *'];
  if(active!==null)stages.push('Where-Object { $_.Enabled -eq $'+active+' }');
  if(dept)stages.push("Where-Object { $_.Department -eq '"+dept+"' }");
  stages.push(count?'Measure-Object':'Select-Object SamAccountName, Name, Department');
  return stages.join(' |\n  ');
}
function insertPrompt(){
  const input=translatePrompt($('prompt').value,mode);
  $('prompt-status').textContent=input?'Polecenie gotowe. Możesz je zmienić i uruchomić.':'Spróbuj wzorca „Pokaż konta” lub „Policz aktywne konta z HR”.';
  if(input){stop();$('source').value=input;$('output').textContent='Uruchom wygenerowane polecenie.';$('source').focus();}
}
$('translate').onclick=insertPrompt;
$('prompt').onkeydown=e=>{if(e.key==='Enter')insertPrompt();};
