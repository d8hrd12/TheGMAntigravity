/**
 * Standalone simulation test — mirrors MatchEngineV3 logic in plain JS
 * Run: node scripts/simTest.js
 */

// --- Calibration ---
const NBA = {
  RIM_PCT: 0.640, MID_PCT: 0.430, THREE_FG_PCT: 0.365,
  OREB_PCT: 0.27,
  AND_ONE_RIM: 0.06,
  FOUL_DRIVE: 0.22, FOUL_POST: 0.18, FOUL_PNR_ROLL: 0.14,
  FOUL_ISO: 0.07, FOUL_SPOT3: 0.02, FOUL_MID: 0.04,
};
const BASE_USAGE = { PG: 0.235, SG: 0.210, SF: 0.200, PF: 0.185, C: 0.170 };
const MINUTES_BY_RANK = [37, 35, 32, 28, 26, 20, 15, 10, 7, 3, 0, 0, 0];
const POSS_PER_QUARTER = 25; // per team

// --- Mock Players ---
function makePlayer(id, name, pos, attrs, overall) {
  return { id, name, position: pos, overall, attributes: attrs,
    stamina: 100, isRetired: false, minutes: 0 };
}

// SGA-like superstar PG
const SGA = makePlayer('sga', 'SGA', 'PG', {
  finishing:88, midRange:92, threePointShot:85, freeThrow:90,
  playmaking:85, ballHandling:92, offensiveRebound:35, interiorDefense:45,
  perimeterDefense:88, stealing:88, blocking:35, defensiveRebound:42,
  athleticism:92, basketballIQ:90
}, 97);

// Doncic-like triple double threat
const DONCIC = makePlayer('luka', 'Doncic', 'PG', {
  finishing:82, midRange:88, threePointShot:82, freeThrow:78,
  playmaking:95, ballHandling:92, offensiveRebound:42, interiorDefense:35,
  perimeterDefense:65, stealing:55, blocking:25, defensiveRebound:55,
  athleticism:75, basketballIQ:97
}, 96);

// Jokic-like center
const JOKIC = makePlayer('jokic', 'Jokic', 'C', {
  finishing:88, midRange:80, threePointShot:65, freeThrow:82,
  playmaking:95, ballHandling:82, offensiveRebound:78, interiorDefense:78,
  perimeterDefense:52, stealing:62, blocking:58, defensiveRebound:95,
  athleticism:68, basketballIQ:97
}, 97);

// Role players
function rolePlayer(id, name, pos, shootSkill, defSkill, ovr) {
  return makePlayer(id, name, pos, {
    finishing: pos==='C'?shootSkill:Math.min(shootSkill,72),
    midRange: shootSkill-5, threePointShot: pos==='C'?shootSkill-20:shootSkill,
    freeThrow:75, playmaking:65, ballHandling:68,
    offensiveRebound: pos==='C'?65:pos==='PF'?55:35,
    interiorDefense: pos==='C'?defSkill:pos==='PF'?defSkill-5:50,
    perimeterDefense: pos==='PG'||pos==='SG'?defSkill:defSkill-10,
    stealing:68, blocking: pos==='C'?defSkill-10:40,
    defensiveRebound: pos==='C'?72:pos==='PF'?62:45,
    athleticism:72, basketballIQ:72
  }, ovr);
}

const OKC_TEAM = [
  SGA,
  rolePlayer('chet','Chet','PF',80,82,85),
  rolePlayer('dort','Dort','SG',72,88,78),
  rolePlayer('wembama','Iso Moon','SF',75,78,80),
  rolePlayer('holmgren','Holmgren','C',72,85,84),
];

const DEN_TEAM = [
  JOKIC,
  rolePlayer('murray','Murray','PG',82,75,86),
  rolePlayer('gordon','Gordon','SF',70,82,79),
  rolePlayer('porter','Porter','SF',80,70,81),
  rolePlayer('rivers','Rivers','SG',75,72,76),
];

const DAL_TEAM = [
  DONCIC,
  rolePlayer('kp','KP','C',82,72,84),
  rolePlayer('washington','Washington','SF',74,76,78),
  rolePlayer('irving','Irving','SG',86,72,85),
  rolePlayer('gafford','Gafford','C',72,86,79),
];

// --- Engine functions ---
function scoringSkill(p) {
  const s = [p.attributes.finishing, p.attributes.midRange, p.attributes.threePointShot].sort((a,b)=>b-a);
  return s[0]*0.60 + s[1]*0.30 + s[2]*0.10;
}

function calcUsage(lineup) {
  const weights = new Map();
  let total = 0;
  lineup.forEach(p => {
    const base = BASE_USAGE[p.position] ?? 0.20;
    const skill = scoringSkill(p);
    let mult = 1.0;
    if (skill >= 90)      mult = 1.25;
    else if (skill >= 85) mult = 1.12;
    else if (skill >= 80) mult = 1.04;
    else if (skill < 65)  mult = 0.78;
    else if (skill < 72)  mult = 0.90;
    if (p.position === 'PG' && p.attributes.playmaking >= 84) mult *= 1.05;
    const w = base * mult;
    weights.set(p.id, w);
    total += w;
  });
  weights.forEach((v,k) => weights.set(k, v/total));
  return weights;
}

function pickByUsage(lineup, weights) {
  let r = Math.random();
  for (const p of lineup) { r -= (weights.get(p.id)||0); if (r<=0) return p; }
  return lineup[lineup.length-1];
}

function reboundScore(p, isOff) {
  const skill = isOff ? p.attributes.offensiveRebound : p.attributes.defensiveRebound;
  const POS_DEF = {C:1.40,PF:1.15,SF:0.95,SG:0.65,PG:0.48};
  const POS_OFF = {C:1.30,PF:1.10,SF:0.90,SG:0.60,PG:0.42};
  const posW = isOff ? (POS_OFF[p.position]||0.90) : (POS_DEF[p.position]||0.90);
  return Math.sqrt(skill * posW) * (0.4 + Math.random()*1.2);
}

function resolveRebound(offLineup, defLineup) {
  const offSkill = offLineup.reduce((s,p)=>s+p.attributes.offensiveRebound,0)/offLineup.length;
  const defSkill = defLineup.reduce((s,p)=>s+p.attributes.defensiveRebound,0)/defLineup.length;
  const orebPct = Math.max(0.10, Math.min(0.45, NBA.OREB_PCT + (offSkill-defSkill)/100*0.15));
  const isOff = Math.random() < orebPct;
  const cands = isOff ? offLineup : defLineup;
  const POS_DEF = {C:1.30,PF:1.10,SF:0.95,SG:0.80,PG:0.70};
  const POS_OFF = {C:1.20,PF:1.05,SF:0.90,SG:0.75,PG:0.65};
  const winner = cands.map(p=>{
    const skill = isOff ? p.attributes.offensiveRebound : p.attributes.defensiveRebound;
    const posW  = isOff ? (POS_OFF[p.position]||0.80) : (POS_DEF[p.position]||0.80);
    // Random (0-100) is the dominant factor; skill adds a modest bonus (0-30)
    // This ensures: Jokic wins more boards, but guards STILL get some
    const score = Math.random()*100 + (skill/99)*posW*30;
    return {id:p.id, s:score};
  }).sort((a,b)=>b.s-a.s)[0];
  return { rebounderId: winner.id, isOffensive: isOff };
}

function getZone(shooter) {
  const a = shooter.attributes;
  const total = a.finishing + a.midRange + a.threePointShot;
  const r = Math.random()*total;
  if (r < a.finishing) return 'RIM';
  if (r < a.finishing + a.midRange) return 'MID';
  return 'THREE';
}

function resolveShot(shooter, defLineup, zone) {
  const def = defLineup.find(p=>p.position===shooter.position)||defLineup[0];
  const shootAttr = zone==='RIM'?shooter.attributes.finishing:zone==='THREE'?shooter.attributes.threePointShot:shooter.attributes.midRange;
  const defAttr = zone==='RIM'?(def.attributes.interiorDefense*0.65+def.attributes.blocking*0.35):def.attributes.perimeterDefense;
  const base = zone==='RIM'?NBA.RIM_PCT:zone==='THREE'?NBA.THREE_FG_PCT:NBA.MID_PCT;
  const prob = Math.max(0.08, Math.min(0.88, base + (shootAttr-defAttr)/100*0.30));
  const made = Math.random()<prob;
  const foulChance = zone==='RIM'?NBA.FOUL_DRIVE:zone==='THREE'?NBA.FOUL_SPOT3:NBA.FOUL_MID;
  const foul = !made && Math.random()<foulChance;
  const andOne = made && zone==='RIM' && Math.random()<NBA.AND_ONE_RIM;
  return { made, zone, foul, andOne, points: made?(zone==='THREE'?3:2):0, ftAttempts: foul?2:andOne?1:0 };
}

function resolveFT(shooter, attempts) {
  let made=0;
  for(let i=0;i<attempts;i++) if(Math.random()<shooter.attributes.freeThrow/100) made++;
  return made;
}

function checkTO(handler, defLineup) {
  const def = defLineup.find(p=>p.position===handler.position)||defLineup[0];
  const stealChance = Math.max(0,(def.attributes.stealing-60)*0.0015+(def.attributes.perimeterDefense-60)*0.0008);
  if (Math.random()<stealChance) return {isTurnover:true, stealerId:def.id};
  const handlerRisk = Math.max(0,(75-handler.attributes.playmaking)*0.0012+(70-handler.attributes.ballHandling)*0.0008);
  if (Math.random()<handlerRisk+0.045) return {isTurnover:true};
  return {isTurnover:false};
}

// --- Simulate one game ---
function simulateGame(homeTeam, awayTeam) {
  const stats = {};
  [...homeTeam,...awayTeam].forEach(p=>{ stats[p.id]={pts:0,reb:0,ast:0,stl:0,blk:0,to:0,fga:0,fgm:0}; });
  const add=(id,f,v)=>{ if(stats[id]) stats[id][f]+=v; };
  let homeScore=0, awayScore=0;

  for (let q=1;q<=4;q++) {
    const homeUsage = calcUsage(homeTeam);
    const awayUsage = calcUsage(awayTeam);

    for (let poss=0; poss<POSS_PER_QUARTER*2; poss++) {
      const isHome = poss%2===0;
      const offTeam = isHome?homeTeam:awayTeam;
      const defTeam = isHome?awayTeam:homeTeam;
      const usage   = isHome?homeUsage:awayUsage;

      const handler = pickByUsage(offTeam, usage);
      const to = checkTO(handler, defTeam);
      if (to.isTurnover) {
        add(handler.id,'to',1);
        if(to.stealerId) add(to.stealerId,'stl',1);
        continue;
      }

      // Determine shooter: usage-weighted for stars, skill-weighted for others
      let shooter = handler;
      let assister = null;
      if (Math.random() < 0.48) {
        // Pass to DIFFERENT player — weighted by scoring skill but not winner-take-all
        const others = offTeam.filter(p => p.id !== handler.id);
        const totalSkill = others.reduce((s,p) => s + Math.pow(scoringSkill(p)/100, 1.5)*100, 0);
        let r = Math.random() * totalSkill;
        for (const p of others) {
          r -= Math.pow(scoringSkill(p)/100, 1.5)*100;
          if (r <= 0) { shooter = p; break; }
        }
        if (shooter === handler) shooter = others[Math.floor(Math.random()*others.length)];
        assister = handler;
      }

      const zone = getZone(shooter);
      const shot = resolveShot(shooter, defTeam, zone);
      add(shooter.id,'fga',1);

      if (shot.made) {
        add(shooter.id,'fgm',1);
        add(shooter.id,'pts',shot.points);
        if(assister) add(assister.id,'ast',1);
        if(isHome) homeScore+=shot.points; else awayScore+=shot.points;
      }
      if (shot.ftAttempts>0) {
        const ftMade = resolveFT(shooter, shot.ftAttempts);
        add(shooter.id,'pts',ftMade);
        if(isHome) homeScore+=ftMade; else awayScore+=ftMade;
      }
      if (!shot.made) {
        const reb = resolveRebound(offTeam, defTeam);
        add(reb.rebounderId,'reb',1);
      }
    }
  }
  return { stats, homeScore, awayScore };
}

// --- Run 82 games for each team and print averages ---
function runSeason(teamName, team, opponents) {
  const totals = {};
  team.forEach(p=>{ totals[p.id]={pts:0,reb:0,ast:0,stl:0,to:0,fga:0,fgm:0,games:0}; });

  for (let g=0; g<82; g++) {
    const opp = opponents[g % opponents.length];
    const result = simulateGame(team, opp);
    team.forEach(p=>{
      const s = result.stats[p.id];
      if(s) {
        const t = totals[p.id];
        t.pts+=s.pts; t.reb+=s.reb; t.ast+=s.ast;
        t.stl+=s.stl; t.to+=s.to; t.fga+=s.fga; t.fgm+=s.fgm; t.games++;
      }
    });
  }

  console.log(`\n=== ${teamName} — 82-game season averages ===`);
  team.forEach(p=>{
    const t = totals[p.id];
    const g = t.games||1;
    const fg = t.fga>0?(t.fgm/t.fga*100).toFixed(1):'0.0';
    console.log(`${p.name.padEnd(12)} ${p.position} | ${(t.pts/g).toFixed(1).padStart(5)}pts ${(t.reb/g).toFixed(1).padStart(5)}reb ${(t.ast/g).toFixed(1).padStart(5)}ast ${(t.stl/g).toFixed(1).padStart(4)}stl ${(t.to/g).toFixed(1).padStart(4)}to | ${(t.fga/g).toFixed(1).padStart(5)}fga ${fg}%`);
  });
  return totals;
}

const opponents = [OKC_TEAM, DEN_TEAM, DAL_TEAM];
runSeason('OKC Thunder', OKC_TEAM, [DEN_TEAM, DAL_TEAM]);
runSeason('Denver Nuggets', DEN_TEAM, [OKC_TEAM, DAL_TEAM]);
runSeason('Dallas Mavericks', DAL_TEAM, [OKC_TEAM, DEN_TEAM]);

console.log('\n✅ Simulation complete');
