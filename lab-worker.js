'use strict';

// Each run starts a fresh worker and an independent, fictional directory.
const accounts = [
  ['anowak','Anna Nowak','Legal',1,10], ['jkowal','Jan Kowal','IT',1,11],
  ['mwojcik','Maja Wójcik','HR',0,12], ['svc_scan','Skaner','IT',1,null],
  ['eziel','Ewa Zielińska','Legal',1,13], ['tkrol','Tomasz Król','IT',0,14]
];
const users = accounts.map(([login, name, dept, active]) => ({
  SamAccountName: login, Name: name, Department: dept, Enabled: Boolean(active)
}));

async function sql(input) {
  importScripts('sql-wasm.js');
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  try {
    db.run('CREATE TABLE accounts(login TEXT, name TEXT, department TEXT, enabled INTEGER, employee_id INTEGER); CREATE TABLE hr(employee_id INTEGER, name TEXT)');
    for (const row of accounts) {
      db.run('INSERT INTO accounts VALUES (?,?,?,?,?)', row);
      if (row[4] !== null) db.run('INSERT INTO hr VALUES (?,?)', [row[4],row[1]]);
    }
    const results = [];
    for (const stmt of db.iterateStatements(input)) {
      const columns = stmt.getColumnNames();
      const rows = [];
      let limited = false;
      while (stmt.step()) {
        if (rows.length === 100) { limited = true; break; }
        rows.push(stmt.get());
      }
      if (columns.length) results.push({columns, rows, limited});
    }
    return results;
  } finally { db.close(); }
}

function field(name, row) {
  const key = Object.keys(row).find(k => k.toLowerCase() === name.toLowerCase());
  if (!key) throw Error('Nieznana właściwość: ' + name + '. Dostępne: ' + Object.keys(row).join(', '));
  return key;
}
function powershell(input) {
  // Split only on pipes outside quoted strings.
  const stages = input.match(/(?:[^|"'\n]|"[^"]*"|'[^']*'|\n)+|\|/g);
  if (!stages || stages.join('') !== input) throw Error('Sprawdź cudzysłowy.');
  const parts = []; let part = '';
  for (const token of stages) {
    if (token === '|') { parts.push(part.trim()); part = ''; } else part += token;
  }
  parts.push(part.trim());
  if (!/^Get-ADUser\s+-Filter\s+\*(?:\s+-Properties\s+(?:\*|[\w,\s]+))?$/i.test(parts.shift()))
    throw Error('Zacznij od Get-ADUser -Filter * -Properties *. Potem dodawaj etapy za znakiem |.');
  let rows = users.slice(), schema = users[0];
  for (const stage of parts) {
    let m;
    if ((m = stage.match(/^Where-Object\s*\{\s*\$_\.(\w+)\s+-(eq|ne|like)\s+('[^']*'|"[^"]*"|\$(?:true|false))\s*\}$/i))) {
      const key = field(m[1],schema), op = m[2].toLowerCase();
      const value = m[3].startsWith('$') ? m[3].slice(1).toLowerCase() : m[3].slice(1,-1).toLowerCase();
      const pattern = value.split('').map(c => c==='*' ? '.*' : c==='?' ? '.' : /[a-z0-9 ]/i.test(c) ? c : '\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')).join('');
      const wildcard = new RegExp('^'+pattern+'$','u');
      rows = rows.filter(r => {const actual=String(r[key]).toLowerCase(); return op==='like' ? wildcard.test(actual) : op==='eq' ? actual===value : actual!==value;});
    } else if ((m = stage.match(/^Select-Object\s+(?:-Property\s+)?(\w+(?:\s*,\s*\w+)*)$/i))) {
      const keys=m[1].split(',').map(k=>field(k.trim(),schema));
      const project=r=>Object.fromEntries(keys.map(k=>[k,r[k]]));
      schema=project(schema); rows=rows.map(project);
    } else if ((m = stage.match(/^Sort-Object\s+(?:-Property\s+)?(\w+)(\s+-Descending)?$/i))) {
      const key=field(m[1],schema);
      rows.sort((a,b)=>String(a[key]).localeCompare(String(b[key]),'pl')*(m[2]?-1:1));
    } else if (/^Measure-Object$/i.test(stage)) {
      schema={Count:rows.length};rows=[schema];
    } else throw Error('Ten etap wykracza poza symulator. Obsługuje Where-Object (-eq, -ne, -like), Select-Object, Sort-Object i Measure-Object.');
  }
  return [{columns:Object.keys(schema),rows:rows.map(Object.values)}];
}
self.onmessage = async ({data}) => {
  try {
    const result = data.mode === 'sql' ? await sql(data.input) : powershell(data.input);
    self.postMessage({result});
  } catch (error) { self.postMessage({error:error.message}); }
};
