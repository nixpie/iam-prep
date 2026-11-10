'use strict';

/* Decks live in content/<slug>.md. See README.md for the card format. */
const DECKS = ['hybryda', 'grupy', 'poczta', 'jml', 'case', 'powershell', 'sql', 'rozmowa'];
const STORE = 'iamprep.v1';
const INTERVALS = [0, 1, 2, 4, 7]; // days until the next review, per box
const SESSION_SIZE = 20;

const $app = document.getElementById('app');
let decks = [];
let state = loadState();
let session = null;
let player = null;
let talkId = 0;
let wakeLock = null;

/* ---------- state ---------- */

function loadState() {
  const base = {
    cards: {}, days: {}, listen: {},
    settings: { date: '', rate: 0.95, think: 3, plVoice: false, listenMode: 'en', theme: 'auto' }, // the interview is in English
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved) return { ...base, ...saved, settings: { ...base.settings, ...(saved.settings || {}) } };
  } catch (e) { /* storage unavailable: run without saved progress */ }
  return base;
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignore */ }
}
function dayStr(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dayStr(d);
}
const rec = (id) => state.cards[id];
const isNew = (id) => !rec(id);
const isDue = (id) => !!rec(id) && rec(id).due <= dayStr();
const isMastered = (id) => !!rec(id) && rec(id).box >= 3;

function grade(id, g) {
  const r = rec(id) || { box: 0, seen: 0 };
  if (g === 0) { r.box = 0; r.due = dayStr(); }
  else if (g === 1) { r.box = Math.max(1, r.box); r.due = addDays(1); }
  else { r.box = Math.min(4, r.box + 1); r.due = addDays(INTERVALS[r.box]); }
  r.seen += 1;
  state.cards[id] = r;
  state.days[dayStr()] = (state.days[dayStr()] || 0) + 1;
  save();
}
function streak() {
  let n = 0;
  const d = new Date();
  if (!state.days[dayStr(d)]) d.setDate(d.getDate() - 1);
  while (state.days[dayStr(d)]) { n += 1; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- content ---------- */

function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
function parseDeck(slug, text) {
  const deck = { slug, title: slug, desc: '', cards: [] };
  let card = null;
  let inCode = false;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\r$/, '');
    if (line.startsWith('```')) inCode = !inCode;
    else if (!inCode) {
      if (!card && line.startsWith('# ')) { deck.title = line.slice(2).trim(); continue; }
      if (!card && line.startsWith('> ')) { deck.desc = line.slice(2).trim(); continue; }
      if (line.startsWith('## ')) { card = { q: line.slice(3).trim(), lines: [] }; deck.cards.push(card); continue; }
    }
    if (card) card.lines.push(line);
  }
  deck.cards = deck.cards.map((c) => finishCard(deck, c));
  return deck;
}
function finishCard(deck, c) {
  const parts = { front: [], back: [], pl: [] };
  let inCode = false;
  let part = c.lines.some((l) => l.trim() === '---') ? 'front' : 'back';
  for (const l of c.lines) {
    if (l.startsWith('```')) inCode = !inCode;
    else if (!inCode) {
      if (part === 'front' && l.trim() === '---') { part = 'back'; continue; }
      if (l.startsWith('PL:')) { part = 'pl'; parts.pl.push(l.slice(3).trim()); continue; }
    }
    parts[part].push(l);
  }
  const front = parts.front.join('\n').trim();
  return {
    // several script cards share the same question, so the code on the front is part of the identity
    id: `${deck.slug}-${hash(`${c.q}\n${front}`)}`, deck: deck.slug, deckTitle: deck.title, q: c.q,
    front, back: parts.back.join('\n').trim(), pl: parts.pl.join('\n').trim(),
  };
}
const allCards = () => decks.flatMap((d) => d.cards);
const deckBy = (slug) => decks.find((d) => d.slug === slug);
const pool = (scope) => (scope === 'all' ? allCards() : (deckBy(scope) || { cards: [] }).cards);

/* ---------- tiny markdown ---------- */

function esc(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, (m, code) => `<code${code.length <= 28 ? ' class="nw"' : ''}>${code}</code>`) // short code never breaks mid-word
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
function md(text) {
  const out = [];
  const lines = text.split('\n');
  const isUl = (l) => /^\s*- /.test(l);
  const isOl = (l) => /^\d+\.\s/.test(l);
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith('```')) {
      const buf = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) { buf.push(lines[i]); i += 1; }
      i += 1;
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
    } else if (isUl(l) || isOl(l)) {
      const test = isUl(l) ? isUl : isOl;
      const tag = isUl(l) ? 'ul' : 'ol';
      const items = [];
      while (i < lines.length && test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*- |^\d+\.\s/, ''))}</li>`);
        i += 1;
      }
      out.push(`<${tag}>${items.join('')}</${tag}>`);
    } else if (!l.trim()) {
      i += 1;
    } else {
      const buf = [];
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith('```') && !isUl(lines[i]) && !isOl(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      out.push(`<p>${inline(buf.join(' '))}</p>`);
    }
  }
  return `<div class="md">${out.join('')}</div>`;
}
/** Text for the speech engine: no code blocks, no markup. */
function plain(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*- /gm, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/[`*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ---------- speech ---------- */

const canSpeak = 'speechSynthesis' in window;
function languageVoices(lang) {
  if (!canSpeak) return [];
  const short = lang.slice(0, 2);
  function rank(v) {
    const enhanced = /natural|neural|premium|enhanced|wzbogacon|rozszerzon/i.test(v.name);
    const novelty = /whisper|organ|jester|trinoids|zarvox|wobble|bad news|good news|bahh|bells|boing|bubbles|cellos/i.test(v.name);
    return (enhanced ? 20 : 0) + (v.default ? 4 : 0) + (v.lang.replace('_','-') === lang ? 2 : 0) - (novelty ? 50 : 0);
  }
  return speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().split(/[-_]/)[0] === short)
    .sort((a,b) => rank(b) - rank(a));
}
function pickVoice(lang) {
  const voices = languageVoices(lang);
  return voices.find(v => v.voiceURI === state.settings[lang]) || voices[0];
}

let finishUtterance = null;
function utter(text, lang) {
  return new Promise(resolve => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = Number(state.settings.rate) || 1;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    let timer;
    function done(ok) {
      clearTimeout(timer);
      if (finishUtterance === done) finishUtterance = null;
      resolve(ok);
    }
    finishUtterance = done;
    timer = setTimeout(() => { done(false); speechSynthesis.cancel(); }, 7000 + text.length * 170);
    u.onend = () => done(true);
    u.onerror = () => done(false);
    try { speechSynthesis.speak(u); } catch { done(false); }
  });
}
async function say(text, lang, id) {
  if (!canSpeak || !text) return false;
  const pronunciations = lang === 'pl-PL'
    ? { HR:'ha er', AD:'a de', UPN:'u pe en', SMTP:'es em te pe', NTFS:'en te ef es', MFA:'em ef a', SQL:'es ku el', RBAC:'er bak' }
    : { HR:'H R', AD:'A D', UPN:'U P N', SMTP:'S M T P', NTFS:'N T F S', MFA:'M F A', SQL:'sequel', RBAC:'R back' };
  text = text.replace(/\b(HR|AD|UPN|SMTP|NTFS|MFA|SQL|RBAC)\b/g, (word, _, offset) =>
    text[offset-1] === '-' || text[offset+word.length] === '-' ? word : pronunciations[word]);
  // Short sentences stay together so the voice can carry intonation across them.
  const sentences = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter(lang, {granularity:'sentence'}).segment(text)].map(s => s.segment.trim())
    : [text];
  let phrase = '';
  for (const sentence of sentences) {
    if (phrase && phrase.length + sentence.length > 190) {
      if (id !== talkId || !await utter(phrase,lang)) return false;
      phrase = '';
    }
    phrase += (phrase ? ' ' : '') + sentence;
  }
  return id === talkId && (!phrase || await utter(phrase,lang)) && id === talkId;
}
function stopTalk() {
  talkId += 1;
  if (finishUtterance) finishUtterance(false);
  if (canSpeak) speechSynthesis.cancel();
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function holdScreen(on) {
  try {
    if (on && navigator.wakeLock && !wakeLock) wakeLock = await navigator.wakeLock.request('screen');
    if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { wakeLock = null; }
}

/* ---------- views ---------- */

function countdownText() {
  const date = state.settings.date;
  if (!date) return '<a href="#/settings">Ustaw datę rozmowy</a>';
  const today = new Date(`${dayStr()}T00:00`);
  const n = Math.round((new Date(`${date}T00:00`) - today) / 86400000);
  if (n > 1) return `Rozmowa za ${n} dni`;
  if (n === 1) return 'Rozmowa jutro';
  if (n === 0) return 'Rozmowa dziś. Powodzenia!';
  return 'Rozmowa już za Tobą';
}
function todayQueue(scope) {
  const cards = pool(scope);
  const due = cards.filter((c) => isDue(c.id));
  let fresh = cards.filter((c) => isNew(c.id));
  if (scope === 'all') { // take new cards evenly from every deck
    const byDeck = decks.map((d) => d.cards.filter((c) => isNew(c.id)));
    fresh = [];
    for (let i = 0; byDeck.some((list) => i < list.length); i++) {
      byDeck.forEach((list) => { if (i < list.length) fresh.push(list[i]); });
    }
  }
  return [...due, ...fresh].slice(0, SESSION_SIZE);
}

function viewHome() {
  const cards = allCards();
  const due = cards.filter((c) => isDue(c.id)).length;
  const fresh = cards.filter((c) => isNew(c.id)).length;
  const mastered = cards.filter((c) => isMastered(c.id)).length;
  const queue = todayQueue('all');
  const s = streak();
  $app.innerHTML = `
    <header class="top">
      <div><h1>IAM Prep</h1><p class="sub">${countdownText()}</p></div>
      <a class="icon-btn" href="#/settings" aria-label="Ustawienia">&#9881;</a>
    </header>
    <section class="hero">
      <div class="hero-row">
        <div class="hero-num">${queue.length}</div>
        <div class="hero-txt">${queue.length ? 'kart w dzisiejszej sesji' : 'Wszystko powtórzone'}
          <small>${due} do powtórki &middot; ${fresh} nowych</small></div>
      </div>
      ${queue.length
        ? '<a class="btn primary block" href="#/study/all/due">Zacznij sesję</a>'
        : '<a class="btn block" href="#/study/all/all">Przejdź wszystkie karty</a>'}
    </section>
    <div class="tiles">
      <a class="btn" href="#/listen/all">Słuchaj</a>
      <a class="btn" href="#/search">Szukaj</a>
    </div>
    <p class="stat-line">Dziś: ${state.days[dayStr()] || 0} odpowiedzi &middot; opanowane: ${mastered} z ${cards.length}${s > 1 ? ` &middot; seria: ${s} dni` : ''}</p>
    <h3 class="section-h">Talie</h3>
    ${decks.map((d) => {
      const seen = d.cards.filter((c) => !isNew(c.id)).length;
      const done = d.cards.filter((c) => isMastered(c.id)).length;
      const pct = (n) => (d.cards.length ? Math.round((n / d.cards.length) * 100) : 0);
      return `<a class="deck" href="#/deck/${d.slug}">
        <div class="deck-head"><span class="deck-t">${esc(d.title)}</span><span class="deck-n">${done}/${d.cards.length}</span></div>
        <div class="deck-d">${esc(d.desc)}</div>
        <div class="meter"><b style="width:${pct(seen)}%"></b><i style="width:${pct(done)}%"></i></div>
      </a>`;
    }).join('')}`;
}

function cardItem(c, withDeck) {
  const cls = isMastered(c.id) ? 'done' : isNew(c.id) ? '' : 'learn';
  return `<details class="item">
    <summary><span class="dot ${cls}"></span><span>${inline(c.q)}</span></summary>
    <div class="body">
      ${withDeck ? `<span class="chip">${esc(c.deckTitle)}</span>` : ''}
      ${c.front ? md(c.front) : ''}${md(c.back)}
      ${c.pl ? `<div class="pl">${md(c.pl)}</div>` : ''}
    </div>
  </details>`;
}

function viewDeck(slug) {
  const d = deckBy(slug);
  if (!d) { location.hash = '#/'; return; }
  const n = todayQueue(slug).length;
  $app.innerHTML = `
    <header class="bar"><a class="icon-btn" href="#/" aria-label="Wróć">&larr;</a><h2>${esc(d.title)}</h2></header>
    <p class="deck-d">${esc(d.desc)}</p>
    <div class="btn-row">
      <a class="btn primary wide" href="#/study/${slug}/${n ? 'due' : 'all'}">${n ? `Ucz się (${n})` : 'Powtórz całą talię'}</a>
      <a class="btn" href="#/study/${slug}/all">Cała talia</a>
      <a class="btn" href="#/listen/${slug}">Słuchaj</a>
    </div>
    <h3 class="section-h">Ściąga: ${d.cards.length} kart</h3>
    ${d.cards.map((c) => cardItem(c, false)).join('')}`;
}

function startSession(scope, mode) {
  const queue = mode === 'all' ? [...pool(scope)] : todayQueue(scope);
  session = { scope, mode, queue, total: queue.length, done: 0, revealed: false, tally: [0, 0, 0] };
}
function viewStudy() {
  const s = session;
  const back = s.scope === 'all' ? '#/' : `#/deck/${s.scope}`;
  if (!s.queue.length) {
    const more = todayQueue(s.scope).length;
    $app.innerHTML = `
      <header class="bar"><a class="icon-btn" href="${back}" aria-label="Wróć">&larr;</a><h2>Sesja</h2></header>
      <div class="done-box">
        <h2>${s.total ? 'Koniec sesji' : 'Nic do powtórki'}</h2>
        <p>${s.total
          ? `Wiem: ${s.tally[2]} &middot; prawie: ${s.tally[1]} &middot; nie wiem: ${s.tally[0]}`
          : 'Wszystkie karty z tej puli są zaplanowane na kolejne dni.'}</p>
        <div class="stack">
          ${more ? `<a class="btn primary" href="#/study/${s.scope}/due" data-act="again">Następna sesja (${more})</a>` : ''}
          ${!s.total ? `<a class="btn primary" href="#/study/${s.scope}/all">Przejdź wszystkie karty</a>` : ''}
          <a class="btn" href="${back}">Wróć</a>
        </div>
      </div>`;
    return;
  }
  const c = s.queue[0];
  const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
  $app.innerHTML = `
    <header class="bar">
      <a class="icon-btn" href="${back}" aria-label="Zamknij">&times;</a>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <span class="count">${s.done}/${s.total}</span>
    </header>
    <span class="chip">${esc(c.deckTitle)}</span>
    <h2 class="q">${inline(c.q)}</h2>
    ${c.front ? md(c.front) : ''}
    ${s.revealed ? `
      <section class="answer">
        <div class="answer-h"><span class="label">Odpowiedź</span>
          ${canSpeak ? '<button class="btn small" data-act="speak">Przeczytaj</button>' : ''}</div>
        ${md(c.back)}
        ${c.pl ? `<div class="pl">${md(c.pl)}</div>` : ''}
      </section>` : '<p class="hint">Odpowiedz na głos po angielsku, potem odsłoń odpowiedź.</p>'}
    <footer class="actions"><div class="actions-in">
      ${s.revealed
        ? `<button class="btn bad" data-act="grade" data-g="0">Nie wiem</button>
           <button class="btn mid" data-act="grade" data-g="1">Prawie</button>
           <button class="btn good" data-act="grade" data-g="2">Wiem</button>`
        : '<button class="btn primary" data-act="reveal">Pokaż odpowiedź</button>'}
    </div></footer>`;
}
function sessionGrade(g) {
  const s = session;
  const c = s.queue.shift();
  stopTalk();
  grade(c.id, g);
  s.tally[g] += 1;
  if (g === 0) s.queue.push(c); // comes back at the end of this session
  else s.done += 1;
  s.revealed = false;
  viewStudy();
  window.scrollTo(0, 0);
}

function startPlayer(scope) {
  const list = pool(scope).filter((c) => !c.front.includes('```'));
  let i = state.listen[scope] || 0;
  if (i >= list.length) i = 0;
  player = { scope, list, i, playing: false };
}
const audioModes = [['pl','Polski'],['en','English'],['both','PL → EN']];
function voiceMenu(lang) {
  const voices = languageVoices(lang);
  const current = state.settings[lang];
  const options = voices.map(v => `<option value="${esc(v.voiceURI)}" ${current === v.voiceURI ? 'selected' : ''}>${esc(v.name)}</option>`).join('');
  return `<label>${lang === 'pl-PL' ? 'Głos polski' : 'Głos angielski'}<select data-voice="${lang}"><option value="">Automatycznie${voices[0] ? ' · '+esc(voices[0].name) : ''}</option>${options}</select></label>`;
}
function listenText(c, lang) {
  const pair = typeof NARRATIONS !== 'undefined' && NARRATIONS[c.deck]?.[c.q];
  if (lang === 'pl' && pair) return [pair.questionPL, pair.answerPL];
  return [plain(c.q), pair ? pair.answerEN : plain(c.back)];
}
function viewListen() {
  const p = player;
  const back = p.scope === 'all' ? '#/' : `#/deck/${p.scope}`;
  const c = p.list[p.i];
  const selected = state.settings.listenMode;
  const lang = selected === 'both' ? p.phase || 'pl' : selected;
  const [question, answer] = c ? listenText(c, lang) : ['',''];
  $app.innerHTML = `
    <header class="bar"><a class="icon-btn" href="${back}" aria-label="Wróć">&larr;</a><h2>Słuchaj</h2>
      <span class="count">${p.list.length ? p.i + 1 : 0}/${p.list.length}</span></header>
    ${!canSpeak ? '<p class="empty">Ta przeglądarka nie obsługuje czytania na głos.</p>' : ''}
    ${c ? `
      <div class="player">
        <div class="audio-modes" role="group" aria-label="Język słuchania">${audioModes.map(([id,label]) => `<button data-act="language" data-lang="${id}" aria-pressed="${selected===id}">${label}</button>`).join('')}</div>
        <div class="controls">
          <button class="icon-btn" data-act="skip" data-d="-1" aria-label="Poprzednia">&#9198;</button>
          <button class="icon-btn play" data-act="toggle" ${canSpeak ? '' : 'disabled'} aria-label="${p.playing ? 'Pauza' : 'Odtwórz'}">${p.playing ? '&#10074;&#10074;' : '&#9654;'}</button>
          <button class="icon-btn" data-act="skip" data-d="1" aria-label="Następna">&#9197;</button>
        </div>
        <p class="sub">${esc(p.error || (selected === 'both' ? 'Każde pytanie i odpowiedź usłyszysz najpierw po polsku, potem po angielsku.' : 'Zmiana języka podczas słuchania odtwarza tę samą kartę od początku.'))}</p>
        <details class="voice-settings" ${p.voiceOpen ? 'open' : ''}><summary>Głos lektora</summary>${voiceMenu('pl-PL')}${voiceMenu('en-US')}</details>
      </div>
      <div class="now">
        <span class="chip">${esc(c.deckTitle)}</span>
        <h2 class="q" lang="${lang}">${esc(question)}</h2>
        <p lang="${lang}">${esc(answer)}</p>
        <details class="item full-card"><summary>Pełna karta</summary><div class="body">${md(c.back)}</div></details>
        ${c.pl ? `<div class="pl">${md(c.pl)}</div>` : ''}
      </div>` : '<p class="empty">Brak kart do słuchania w tej talii.</p>'}`;
}
async function play() {
  const p = player;
  stopTalk();
  const id = talkId;
  p.playing = true;
  p.error = '';
  function playbackFailed() {
    if (player !== p || id !== talkId) return;
    p.error = 'Nie udało się odtworzyć głosu. Wybierz innego lektora albo dodaj głos tego języka w ustawieniach urządzenia.';
    pause();
  }
  holdScreen(true);
  while (player === p && id === talkId && p.i < p.list.length) {
    const c = p.list[p.i];
    const sequence = state.settings.listenMode === 'both' ? ['pl','en'] : [state.settings.listenMode];
    for (const lang of sequence) {
      p.phase = lang;
      const tag = lang === 'pl' ? 'pl-PL' : 'en-US';
      const [question, answer] = listenText(c,lang);
      viewListen();
      if (!await say(question,tag,id)) { playbackFailed(); return; }
      await sleep(Number(state.settings.think) * 1000);
      if (id !== talkId) return;
      if (!await say(answer,tag,id)) { playbackFailed(); return; }
      if (sequence.length === 2 && lang === 'pl') {
        await sleep(700);
        if (id !== talkId) return;
      }
    }
    if (state.settings.plVoice && c.pl && !await say(plain(c.pl),'pl-PL',id)) { playbackFailed(); return; }
    await sleep(1200);
    if (id !== talkId) return;
    p.i += 1;
    state.listen[p.scope] = p.i;
    save();
  }
  if (player === p && id === talkId) {
    p.playing = false;
    if (p.i >= p.list.length) { p.i = 0; p.phase = 'pl'; state.listen[p.scope] = 0; save(); }
    holdScreen(false);
    viewListen();
  }
}
function pause() {
  stopTalk();
  holdScreen(false);
  if (player) { player.playing = false; viewListen(); }
}

function viewSearch() {
  $app.innerHTML = `
    <header class="bar"><a class="icon-btn" href="#/" aria-label="Wróć">&larr;</a><h2>Szukaj</h2></header>
    <input type="search" id="q" placeholder="np. Send As, MailTip, LEFT JOIN" autocomplete="off">
    <div id="results" style="margin-top:14px"></div>`;
  document.getElementById('q').focus();
}
function runSearch(term) {
  const box = document.getElementById('results');
  const t = term.trim().toLowerCase();
  if (t.length < 2) { box.innerHTML = ''; return; }
  const hits = allCards().filter((c) => `${c.q}\n${c.front}\n${c.back}\n${c.pl}`.toLowerCase().includes(t));
  box.innerHTML = hits.length
    ? hits.slice(0, 40).map((c) => cardItem(c, true)).join('')
    : '<p class="empty">Nic nie znaleziono.</p>';
}

function viewSettings() {
  const s = state.settings;
  $app.innerHTML = `
    <header class="bar"><a class="icon-btn" href="#/" aria-label="Wróć">&larr;</a><h2>Ustawienia</h2></header>
    <div class="field"><label for="date">Data rozmowy</label>
      <input type="date" id="date" data-set="date" value="${esc(s.date)}">
      <small>Na ekranie głównym pokaże się odliczanie.</small></div>
    <div class="field"><label for="rate">Tempo czytania: <span id="rate-v">${s.rate}</span>x</label>
      <input type="range" id="rate" data-set="rate" min="0.7" max="1.3" step="0.05" value="${s.rate}"></div>
    <div class="field"><label for="think">Czas na Twoją odpowiedź w trybie słuchania: <span id="think-v">${s.think}</span> s</label>
      <input type="range" id="think" data-set="think" min="0" max="10" step="1" value="${s.think}"></div>
    <div class="field"><label class="check"><input type="checkbox" data-set="plVoice" ${s.plVoice ? 'checked' : ''}> Czytaj też polskie notatki</label></div>
    <div class="field"><label for="theme">Motyw</label>
      <select id="theme" data-set="theme">
        ${[['auto', 'Jak w systemie'], ['dark', 'Ciemny'], ['light', 'Jasny']].map(([v, t]) => `<option value="${v}" ${s.theme === v ? 'selected' : ''}>${t}</option>`).join('')}
      </select></div>
    <div class="field"><button class="btn block bad" data-act="reset">Wyzeruj postęp</button>
      <small>Postęp jest zapisany tylko w tej przeglądarce, na tym urządzeniu.</small></div>`;
}
function applyTheme() {
  const t = state.settings.theme;
  if (t === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}

/* ---------- routing and events ---------- */

function route() {
  stopTalk();
  holdScreen(false);
  player = null;
  const [, view = '', a = '', b = ''] = location.hash.split('/');
  if (view === 'deck') viewDeck(a);
  else if (view === 'study') { startSession(a || 'all', b || 'due'); viewStudy(); }
  else if (view === 'listen') { startPlayer(a || 'all'); viewListen(); }
  else if (view === 'search') viewSearch();
  else if (view === 'settings') viewSettings();
  else viewHome();
  window.scrollTo(0, 0);
}

$app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (act === 'reveal') { session.revealed = true; viewStudy(); }
  else if (act === 'grade') sessionGrade(Number(el.dataset.g));
  else if (act === 'speak') { stopTalk(); say(plain(session.queue[0].back), 'en-US', talkId); }
  else if (act === 'again') { e.preventDefault(); startSession(session.scope, 'due'); viewStudy(); }
  else if (act === 'language') {
    const wasPlaying = player.playing;
    pause();
    state.settings.listenMode = el.dataset.lang;
    player.phase = 'pl';
    player.error = '';
    save();
    if (wasPlaying) play(); else viewListen();
  }
  else if (act === 'toggle') { if (player.playing) pause(); else play(); }
  else if (act === 'skip') {
    const was = player.playing;
    pause();
    player.i = Math.max(0, Math.min(player.list.length - 1, player.i + Number(el.dataset.d)));
    state.listen[player.scope] = player.i;
    save();
    if (was) play(); else viewListen();
  } else if (act === 'reset') {
    if (el.dataset.sure) { state.cards = {}; state.days = {}; state.listen = {}; save(); location.hash = '#/'; }
    else { el.dataset.sure = '1'; el.textContent = 'Na pewno? Kliknij jeszcze raz'; }
  }
});
$app.addEventListener('change', e => {
  const lang = e.target.dataset.voice;
  if (!lang || !player) return;
  state.settings[lang] = e.target.value;
  save();
  if (player.playing) play();
});
$app.addEventListener('toggle', e => {
  if (player && e.target.matches('.voice-settings') && e.target.isConnected) player.voiceOpen = e.target.open;
}, true);
if (canSpeak) speechSynthesis.addEventListener('voiceschanged', () => {
  if (player) viewListen();
});
$app.addEventListener('input', (e) => {
  const el = e.target;
  if (el.id === 'q') { runSearch(el.value); return; }
  const key = el.dataset.set;
  if (!key) return;
  state.settings[key] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
  save();
  const label = document.getElementById(`${key}-v`);
  if (label) label.textContent = el.value;
  if (key === 'theme') applyTheme();
});
document.addEventListener('keydown', (e) => {
  if (!location.hash.startsWith('#/study') || !session || !session.queue.length) return;
  if (!session.revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); session.revealed = true; viewStudy(); }
  else if (session.revealed && ['1', '2', '3'].includes(e.key)) sessionGrade(Number(e.key) - 1);
});
window.addEventListener('hashchange', route);

async function init() {
  applyTheme();
  if (canSpeak) speechSynthesis.getVoices(); // some browsers load voices only after the first call
  try {
    const texts = await Promise.all(DECKS.map((slug) => fetch(`content/${slug}.md`).then((r) => {
      if (!r.ok) throw new Error(`${slug}: ${r.status}`);
      return r.text();
    })));
    decks = texts.map((t, i) => parseDeck(DECKS[i], t));
    route();
  } catch (err) {
    $app.innerHTML = `<p class="empty">Nie udało się wczytać kart (${esc(String(err.message || err))}).<br>Sprawdź połączenie i odśwież stronę.</p>`;
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}
init();
