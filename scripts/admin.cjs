const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const ROSTERS_FILE = path.join(__dirname, '../src/data/euro/realRosters.ts');
const UI_FILE = path.join(__dirname, 'admin-ui/index.html');

const TEAMS = {
  OLY:'Olympiacos', PAN:'Panathinaikos', MAD:'Real Madrid', BAR:'Barcelona',
  IST:'Anadolu Efes', ULK:'Fenerbahce', MCO:'Monaco', RED:'Red Star',
  PAR:'Partizan', MUN:'Bayern Munich', MIL:'Olimpia Milano', TEL:'Maccabi Tel Aviv',
  BAS:'Baskonia', ASV:'ASVEL', ZAL:'Zalgiris', VIR:'Virtus Bologna',
  DUB:'Dubai', HTA:'Hapoel Tel Aviv', PAM:'Panathinaikos B', PRS:'Paris',
  ARI:'AEK', BAH:'Bahcesehir', MAN:'Manchester', BES:'Besiktas', BUD:'Budapest',
  CED:'Cedevita', JLB:'Joventut', TRE:'Trento', JER:'Jerusalem', LON:'London Lions',
  NEP:'Neptunas', CHE:'Cheltenham', PNI:'Peristeri', ULM:'Ulm', SLA:'Slavia',
  ANK:'Ankara', CLU:'Cluj', VEN:'Venezia', HAM:'Hamburg'
};

function extractTeamBlock(content, code) {
  let start = content.indexOf("'" + code + "': [");
  if (start === -1) start = content.indexOf("'" + code + "':[");
  if (start === -1) return null;
  const arrStart = content.indexOf('[', start);
  let depth = 0, i = arrStart;
  while (i < content.length) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') { depth--; if (depth === 0) return { start: arrStart, end: i, inner: content.slice(arrStart + 1, i) }; }
    i++;
  }
  return null;
}

function parsePlayersFromBlock(inner) {
  const players = [];
  let depth = 0, start = -1;
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === '{') { if (depth === 0) start = i; depth++; }
    else if (inner[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const p = parsePlayerObj(inner.slice(start, i + 1));
        if (p && p.firstName) players.push(p);
        start = -1;
      }
    }
  }
  return players;
}

function parsePlayerObj(str) {
  const obj = {};
  const kv = /(\w+):\s*('[^']*'|[-\d.]+)/g;
  let m;
  while ((m = kv.exec(str)) !== null) {
    const k = m[1], v = m[2].replace(/'/g, '').trim();
    obj[k] = isNaN(v) ? v : Number(v);
  }
  // Attributes
  const am = str.match(/attributes:\s*\{([^}]+)\}/);
  if (am) {
    const a = {};
    const ar = /(\w+):\s*([-\d.]+)/g;
    let x;
    while ((x = ar.exec(am[1])) !== null) a[x[1]] = Number(x[2]);
    obj.attributes = a;
  }
  // Tendencies
  const tm = str.match(/tendencies:\s*\{([^}]+)\}/);
  if (tm) {
    const t = {};
    const tr = /(\w+):\s*([-\d.]+)/g;
    let x;
    while ((x = tr.exec(tm[1])) !== null) t[x[1]] = Number(x[2]);
    obj.tendencies = t;
  }
  return obj;
}

function readRosters() {
  const content = fs.readFileSync(ROSTERS_FILE, 'utf8');
  const rosters = {};
  for (const code of Object.keys(TEAMS)) {
    const block = extractTeamBlock(content, code);
    rosters[code] = block ? parsePlayersFromBlock(block.inner) : [];
  }
  return rosters;
}

function playerToStr(p) {
  let line = `        { firstName: '${p.firstName}', lastName: '${p.lastName}', position: '${p.position}', age: ${p.age}, height: ${p.height}, weight: ${p.weight}, stars: ${p.stars}, potential: ${p.potential || 80},\n`;
  
  if (p.attributes) {
    line += `          attributes: {\n`;
    const ak = Object.keys(p.attributes);
    ak.forEach((k, i) => {
      line += `            ${k}: ${p.attributes[k]}${i === ak.length - 1 ? '' : ','}\n`;
    });
    line += `          }`;
  } else {
    // Fallback for old format if someone adds without attributes object (though UI will send it)
    line += `          shooting: ${p.shooting || 70}, slashing: ${p.slashing || 70}, defense: ${p.defense || 70}, rebounding: ${p.rebounding || 70}, playmaking: ${p.playmaking || 70}, athleticism: ${p.athleticism || 70}`;
  }

  if (p.tendencies) {
    line += `,\n          tendencies: { shooting: ${p.tendencies.shooting}, passing: ${p.tendencies.passing}, inside: ${p.tendencies.inside}, outside: ${p.tendencies.outside}, defensiveAggression: ${p.tendencies.defensiveAggression}, foulTendency: ${p.tendencies.foulTendency} }`;
  }
  
  line += ` },\n`;
  return line;
}

function writeTeamRoster(code, players) {
  let content = fs.readFileSync(ROSTERS_FILE, 'utf8');
  const block = extractTeamBlock(content, code);
  if (!block) throw new Error('Team ' + code + ' not found');
  const newInner = '\n' + players.map(playerToStr).join('') + '    ';
  content = content.slice(0, block.start + 1) + newInner + content.slice(block.end);
  fs.writeFileSync(ROSTERS_FILE, content, 'utf8');
}

app.get('/api/teams', (req, res) => {
  try {
    const r = readRosters();
    res.json(Object.entries(TEAMS).map(([code, name]) => ({ code, name, count: (r[code] || []).length })));
  } catch(e) { console.error(e); res.status(500).json({ error: e.message }); }
});

app.get('/api/roster/:code', (req, res) => {
  try { const r = readRosters(); res.json(r[req.params.code] || []); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/player/:code', (req, res) => {
  try {
    const r = readRosters();
    const players = r[req.params.code] || [];
    players.push(req.body);
    writeTeamRoster(req.params.code, players);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/player/:code/:idx', (req, res) => {
  try {
    const r = readRosters();
    const players = r[req.params.code] || [];
    const idx = parseInt(req.params.idx);
    if (idx < 0 || idx >= players.length) throw new Error('Invalid index');
    players[idx] = req.body;
    writeTeamRoster(req.params.code, players);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/player/:code/:idx', (req, res) => {
  try {
    const r = readRosters();
    const players = r[req.params.code] || [];
    const idx = parseInt(req.params.idx);
    if (idx < 0 || idx >= players.length) throw new Error('Invalid index');
    players.splice(idx, 1);
    writeTeamRoster(req.params.code, players);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(fs.readFileSync(UI_FILE, 'utf8'));
});

app.listen(3001, () => console.log('\n🏀 Roster Admin running at http://localhost:3001\n'));
