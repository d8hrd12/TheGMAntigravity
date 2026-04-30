const NBA = { RIM_PCT:0.640, MID_PCT:0.430, THREE_FG_PCT:0.365, OREB_PCT:0.27, AND_ONE:0.06, FT_PCT_BASE:0.78 };
const POS_BASE_USAGE = { PG:0.235, SG:0.210, SF:0.200, PF:0.185, C:0.170 };
const TARGETS = { SGA:[31.1,4.3,6.6], DONCIC:[33.5,8.5,8.7], JOKIC:[27.7,12.9,10.7] };

function p(id,name,pos,fin,mid,tp,ft,pm,bh,orb,drb,ast_sk,stl,blk,ath,iq) {
  return {id,name,pos,attributes:{finishing:fin,midRange:mid,threePointShot:tp,freeThrow:ft,playmaking:pm,ballHandling:bh,offensiveRebound:orb,defensiveRebound:drb,stealing:stl,blocking:blk,athleticism:ath,basketballIQ:iq,perimeterDefense:72,interiorDefense:68},stamina:100,isRetired:false,minutes:0};
}

const SGA    = p('sga','SGA','PG',       88,92,85,90, 85,92,35,42, 85,88,35,92,90);
const DONCIC = p('luka','Doncic','PG',   82,88,82,78, 95,92,42,55, 95,55,25,75,97);
const JOKIC  = p('jokic','Jokic','C',   88,82,65,82, 95,82,78,95, 95,62,58,68,97);
const role   = (id,nm,pos,s,d,pm) => p(id,nm,pos,s,s-5,s-10,75,pm,pm-5,pos==='C'?65:38,pos==='C'?72:pos==='PF'?62:45,pm,65,pos==='C'?65:38,72,72);

const OKC=[SGA, role('chet','Holmgren','C',76,72,60), role('dort','Dort','SG',72,58,62), role('moon','Wembama','SF',74,60,65), role('isomon','IsoMoon','PF',72,62,58)];
const DEN=[JOKIC, role('murray','Murray','PG',82,58,85), role('gordon','Gordon','SF',70,60,70), role('porter','Porter','SF',80,60,68), role('rivers','Rivers','SG',75,58,65)];
const DAL=[DONCIC, role('kp','KP','C',82,72,60), role('wash','Washington','SF',74,60,65), role('irving','Irving','SG',86,58,80), role('gaff','Gafford','C',68,72,52)];

// Usage: star hierarchy with diminishing power law
function calcUsage(lineup) {
  const W=new Map(); let total=0;
  lineup.forEach(p=>{
    const sk=[p.attributes.finishing,p.attributes.midRange,p.attributes.threePointShot].sort((a,b)=>b-a);
    const shootSk=sk[0]*0.6+sk[1]*0.3+sk[2]*0.1;
    const base=POS_BASE_USAGE[p.pos]||0.20;
    // Power law: stars get much more usage than role players
    const w=base*Math.pow(shootSk/75,2.2); 
    W.set(p.id,w); total+=w;
  });
  W.forEach((v,k)=>W.set(k,v/total)); return W;
}

function pickW(lineup,W){ let r=Math.random(); for(const p of lineup){r-=W.get(p.id)||0;if(r<=0)return p;} return lineup[lineup.length-1]; }

// Rebound: (skill/100)^0.6 * posW — weighted random not max
function rebound(offL,defL){
  const oSk=offL.reduce((s,p)=>s+p.attributes.offensiveRebound,0)/offL.length;
  const dSk=defL.reduce((s,p)=>s+p.attributes.defensiveRebound,0)/defL.length;
  const orebPct=Math.max(0.10,Math.min(0.42,0.27+(oSk-dSk)/100*0.12));
  const isOff=Math.random()<orebPct;
  const cands=isOff?offL:defL;
  const PD={C:1.20,PF:1.05,SF:0.95,SG:0.75,PG:0.65};
  const PO={C:1.10,PF:1.00,SF:0.90,SG:0.70,PG:0.60};
  const scores=cands.map(p=>{
    const sk=isOff?p.attributes.offensiveRebound:p.attributes.defensiveRebound;
    const pw=isOff?(PO[p.pos]||0.80):(PD[p.pos]||0.80);
    return {id:p.id,w:Math.pow(sk/100,0.6)*pw};
  });
  const tot=scores.reduce((s,x)=>s+x.w,0);
  let r=Math.random()*tot; for(const x of scores){r-=x.w;if(r<=0)return{id:x.id,isOff};}
  return{id:scores[scores.length-1].id,isOff};
}

function to(handler,defL){
  const def=defL.find(p=>p.pos===handler.pos)||defL[0];
  const stl=Math.max(0,(def.attributes.stealing-60)*0.0015+(def.attributes.perimeterDefense-60)*0.0008);
  if(Math.random()<stl)return{is:true,sid:def.id};
  const risk=Math.max(0,(75-handler.attributes.playmaking)*0.0012+(70-handler.attributes.ballHandling)*0.0008);
  if(Math.random()<risk+0.045)return{is:true};
  return{is:false};
}

function shot(shooter,defL,zone){
  const def=defL.find(p=>p.pos===shooter.pos)||defL[0];
  const sAttr=zone==='RIM'?shooter.attributes.finishing:zone==='THREE'?shooter.attributes.threePointShot:shooter.attributes.midRange;
  const dAttr=zone==='RIM'?(def.attributes.interiorDefense*0.65+def.attributes.blocking*0.35):def.attributes.perimeterDefense;
  const base=zone==='RIM'?NBA.RIM_PCT:zone==='THREE'?NBA.THREE_FG_PCT:NBA.MID_PCT;
  const prob=Math.max(0.10,Math.min(0.88,base+(sAttr-dAttr)/100*0.28));
  const made=Math.random()<prob;
  const foulC=zone==='RIM'?0.20:zone==='THREE'?0.02:0.05;
  const foul=!made&&Math.random()<foulC;
  const andOne=made&&zone==='RIM'&&Math.random()<NBA.AND_ONE;
  return{made,zone,foul,andOne,pts:made?(zone==='THREE'?3:2):0,fta:foul?2:andOne?1:0};
}

function ft(shooter,n){let m=0;for(let i=0;i<n;i++)if(Math.random()<shooter.attributes.freeThrow/100)m++;return m;}

function selectShooterAndZone(handler,offT){
  // Handler shoots 55%, passes 45%
  // Jokic/Doncic type playmakers: pass more often
  const isPM=handler.attributes.playmaking>=90;
  const passChance=isPM?0.60:0.45;
  
  let shooter=handler,assister=null,zone;
  
  if(Math.random()<passChance){
    const others=offT.filter(p=>p.id!==handler.id);
    // Power-law weighted — stars receive more passes
    const tot=others.reduce((s,p)=>{
      const sk=[p.attributes.finishing,p.attributes.midRange,p.attributes.threePointShot].sort((a,b)=>b-a);
      return s+Math.pow((sk[0]*0.6+sk[1]*0.3+sk[2]*0.1)/100,1.8)*100;
    },0);
    let r=Math.random()*tot;
    for(const p of others){
      const sk=[p.attributes.finishing,p.attributes.midRange,p.attributes.threePointShot].sort((a,b)=>b-a);
      r-=Math.pow((sk[0]*0.6+sk[1]*0.3+sk[2]*0.1)/100,1.8)*100;
      if(r<=0){shooter=p;break;}
    }
    if(shooter===handler)shooter=others[Math.floor(Math.random()*others.length)];
    assister=handler;
  }
  
  const a=shooter.attributes;
  const rim=a.finishing,mid=a.midRange,tp=a.threePointShot;
  const total=rim+mid+tp;
  const r2=Math.random()*total;
  if(r2<rim)zone='RIM'; else if(r2<rim+mid)zone='MID'; else zone='THREE';
  
  return{shooter,assister,zone};
}

function simGame(homeT,awayT){
  const stats={};
  [...homeT,...awayT].forEach(p=>stats[p.id]={pts:0,reb:0,ast:0,stl:0,blk:0,to:0,fga:0,fgm:0,fta:0,ftm:0});
  const add=(id,f,v)=>{if(stats[id])stats[id][f]+=v;};
  let hS=0,aS=0;
  const hU=calcUsage(homeT),aU=calcUsage(awayT);
  for(let q=0;q<4;q++){
    for(let pos=0;pos<50;pos++){
      const isH=pos%2===0;
      const offT=isH?homeT:awayT,defT=isH?awayT:homeT,U=isH?hU:aU;
      const handler=pickW(offT,U);
      const t=to(handler,defT);
      if(t.is){add(handler.id,'to',1);if(t.sid)add(t.sid,'stl',1);continue;}
      const{shooter,assister,zone}=selectShooterAndZone(handler,offT);
      const sh=shot(shooter,defT,zone);
      add(shooter.id,'fga',1);
      if(sh.made){add(shooter.id,'fgm',1);add(shooter.id,'pts',sh.pts);if(assister)add(assister.id,'ast',1);if(isH)hS+=sh.pts;else aS+=sh.pts;}
      if(sh.fta>0){const m=ft(shooter,sh.fta);add(shooter.id,'fta',sh.fta);add(shooter.id,'ftm',m);add(shooter.id,'pts',m);if(isH)hS+=m;else aS+=m;}
      if(!sh.made){const rb=rebound(offT,defT);add(rb.id,'reb',1);}
    }
  }
  return{stats,hS,aS};
}

function season(name,team,opps){
  const tot={};team.forEach(p=>tot[p.id]={pts:0,reb:0,ast:0,stl:0,to:0,fga:0,fgm:0,fta:0,ftm:0,g:0});
  for(let g=0;g<200;g++){const opp=opps[g%opps.length];const r=simGame(team,opp);team.forEach(p=>{const s=r.stats[p.id];if(!s)return;const t=tot[p.id];Object.keys(t).forEach(k=>{if(k!=='g')t[k]+=s[k]||0;});t.g++;});}
  console.log(`\n=== ${name} ===`);
  team.forEach(p=>{
    const t=tot[p.id],g=t.g||1;
    const fgp=t.fga>0?(t.fgm/t.fga*100).toFixed(1):'--';
    const ftp=t.fta>0?(t.ftm/t.fta*100).toFixed(1):'--';
    console.log(`${p.name.padEnd(12)}${p.pos}|${(t.pts/g).toFixed(1).padStart(6)}pts${(t.reb/g).toFixed(1).padStart(6)}reb${(t.ast/g).toFixed(1).padStart(6)}ast${(t.stl/g).toFixed(1).padStart(5)}stl${(t.to/g).toFixed(1).padStart(5)}to|${(t.fga/g).toFixed(1).padStart(6)}fga ${fgp}%fg ${ftp}%ft`);
  });
  const totalPts=Object.values(tot).reduce((s,t)=>s+t.pts,0);
  console.log(`  >> Team avg: ${(totalPts/200).toFixed(1)} pts/game`);
}

console.log('\nTargets: SGA 31.1/4.3/6.6 | Doncic 33.5/8.5/8.7 | Jokic 27.7/12.9/10.7');
season('OKC Thunder',OKC,[DEN,DAL]);
season('Denver Nuggets',DEN,[OKC,DAL]);
season('Dallas Mavericks',DAL,[OKC,DEN]);
