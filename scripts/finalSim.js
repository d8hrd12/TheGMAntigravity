// NBA 2025-26 Targets per team/game:
// PTS:115 REB:44 AST:26 TO:15 STL:8 BLK:5 PF:20 FGA:89 FG%:47.5 3PA:37 FTA:23
// Star targets: SGA 31.1/4.3/6.6/2.0stl | Jokic 27.7/12.9/10.7/2.9to | Doncic 33.5/8.5/8.7

const BASE={PG:0.235,SG:0.210,SF:0.200,PF:0.185,C:0.170};
const CAP={PG:0.27,SG:0.25,SF:0.22,PF:0.19,C:0.19};
// Bigs who are primary initiators (Jokic) get PG-level touch rate
const REB_D={C:1.05,PF:0.95,SF:0.85,SG:0.68,PG:0.58};
const REB_O={C:1.00,PF:0.90,SF:0.82,SG:0.65,PG:0.55};
const NBA={RIM:0.645,MID:0.440,THREE:0.375,OREB:0.27,AND1:0.055};

function mk(id,nm,pos,a,mins){return{id,nm,pos,a,mins};}
function attr(fin,mid,tp,ft,pm,bh,orb,drb,stl,blk,ath,iq,pd,id){
  return{finishing:fin,midRange:mid,threePointShot:tp,freeThrow:ft,playmaking:pm,ballHandling:bh,offensiveRebound:orb,defensiveRebound:drb,stealing:stl,blocking:blk,athleticism:ath,basketballIQ:iq,perimeterDefense:pd,interiorDefense:id};
}

const SGA    = mk('sga','SGA','PG',   attr(88,92,85,90,85,92,35,42,90,35,92,90,88,52),37);
const DONCIC = mk('luka','Doncic','PG',attr(82,92,85,78,95,92,42,55,55,25,75,97,62,45),37);
const JOKIC  = mk('jokic','Jokic','C', attr(88,82,65,82,97,82,78,95,62,60,68,97,52,78),35);
const rp=(id,nm,pos,fin,mid,tp,ft,pm,bh,orb,drb,stl,blk,ath,iq,pd,id2,mins)=>mk(id,nm,pos,attr(fin,mid,tp,ft,pm,bh,orb,drb,stl,blk,ath,iq,pd,id2),mins);

const OKC=[SGA,
  rp('h','Holmgren','C', 76,65,42,72,62,60,65,72,52,72,70,72,62,75,30),
  rp('d','Dort','SG',    68,65,72,75,62,65,38,44,78,35,75,72,85,52,22),
  rp('w','Wallace','SF', 72,68,74,74,65,68,42,48,65,42,78,72,72,55,26),
  rp('i','IsoBall','PF', 70,66,68,72,58,60,58,62,55,42,72,68,65,62,24)];
const DEN=[JOKIC,
  rp('m','Murray','PG',  80,78,78,82,82,82,35,55,68,28,80,80,72,50,35),
  rp('g','Gordon','SF',  68,65,68,74,68,65,45,55,65,42,75,72,78,62,28),
  rp('p','Porter','SF',  80,78,80,78,65,68,42,52,55,35,72,70,62,50,30),
  rp('rv','Rivers','SG', 72,70,78,76,65,68,38,48,62,30,72,70,72,50,22)];
const DAL=[DONCIC,
  rp('kp','KP','C',      80,78,78,82,62,60,65,72,42,65,68,70,52,72,28),
  rp('wa','Washington','SF',72,68,72,74,65,65,42,50,62,40,75,72,70,58,26),
  rp('ir','Irving','SG', 86,84,80,82,80,82,38,45,68,28,80,82,72,50,32),
  rp('ga','Gafford','C', 72,55,35,68,52,52,65,72,42,78,72,68,52,80,22)];

function shootSk(p){const s=[p.a.finishing,p.a.midRange,p.a.threePointShot].sort((a,b)=>b-a);return s[0]*.60+s[1]*.30+s[2]*.10;}

function calcUsage(lineup){
  const W=new Map();let tot=0;
  lineup.forEach(p=>{
    const sk=shootSk(p),base=BASE[p.pos]||.20,cap=CAP[p.pos]||.21;
    // Playmaker bigs (Jokic) handled like primary ball handlers
    const effBase=(p.a.playmaking>=92&&p.a.basketballIQ>=92)?BASE.PG:base;
    const w=Math.min(effBase*Math.pow(sk/75,1.5),cap);
    W.set(p.id,w);tot+=w;
  });
  W.forEach((v,k)=>W.set(k,v/tot));return W;
}
function pick(l,W){let r=Math.random();for(const p of l){r-=W.get(p.id)||0;if(r<=0)return p;}return l[l.length-1];}

function rebound(oL,dL){
  if(Math.random()<0.15)return null; // 15% goes to bench player
  const oSk=oL.reduce((s,p)=>s+p.a.offensiveRebound,0)/oL.length;
  const dSk=dL.reduce((s,p)=>s+p.a.defensiveRebound,0)/dL.length;
  const orebPct=Math.max(.10,Math.min(.40,.27+(oSk-dSk)/100*.10));
  const isOff=Math.random()<orebPct,cands=isOff?oL:dL;
  const PD=REB_D,PO=REB_O;
  const sc=cands.map(p=>{const sk=isOff?p.a.offensiveRebound:p.a.defensiveRebound;const pw=isOff?(PO[p.pos]||.8):(PD[p.pos]||.8);return{id:p.id,w:Math.pow(sk/100,.6)*pw};});
  const tot=sc.reduce((s,x)=>s+x.w,0);let r=Math.random()*tot;
  for(const x of sc){r-=x.w;if(r<=0)return{id:x.id,isOff};}
  return{id:sc[sc.length-1].id,isOff};
}

function checkTO(h,dL){
  const def=dL.find(p=>p.pos===h.pos)||dL[0];
  const stealProb=Math.max(0,(def.a.stealing-60)*.0015+(def.a.perimeterDefense-60)*.0008);
  if(Math.random()<stealProb)return{is:true,sid:def.id};
  const risk=Math.max(0,(75-h.a.playmaking)*.0012+(70-h.a.ballHandling)*.0008);
  return{is:Math.random()<risk+.042};
}

function doShot(sh,dL,zone){
  const def=dL.find(p=>p.pos===sh.pos)||dL[0];
  const sA=zone==='RIM'?sh.a.finishing:zone==='THREE'?sh.a.threePointShot:sh.a.midRange;
  const dA=zone==='RIM'?(def.a.interiorDefense*.65+def.a.blocking*.35):def.a.perimeterDefense;
  const base=zone==='RIM'?NBA.RIM:zone==='THREE'?NBA.THREE:NBA.MID;
  const prob=Math.max(.10,Math.min(.90,base+(sA-dA)/100*.28));
  const made=Math.random()<prob;

  // Block check (RIM only)
  const bestBlk=dL.reduce((b,p)=>p.a.blocking>b.a.blocking?p:b);
  const blockProb=zone==='RIM'?Math.max(0,(bestBlk.a.blocking-65)*.002):0;
  if(!made&&zone==='RIM'&&Math.random()<blockProb)return{made:false,zone,foul:false,andOne:false,pts:0,fta:0,blocked:true,blockerId:bestBlk.id};

  // Foul
  const foulC=zone==='RIM'?.18:zone==='THREE'?.025:.055;
  const defFoulProne=Math.max(0,(80-def.a.perimeterDefense)*.001);
  const foul=!made&&Math.random()<foulC+defFoulProne;
  const andOne=made&&zone==='RIM'&&Math.random()<NBA.AND1;
  const pts=made?(zone==='THREE'?3:2):0;
  const fta=foul?2:andOne?1:0;
  return{made,zone,foul,andOne,pts,fta,blocked:false,foulDef:foul?def.id:null};
}
function doFT(sh,n){let m=0;for(let i=0;i<n;i++)if(Math.random()<sh.a.freeThrow/100)m++;return m;}

function selectPlay(handler,offT){
  // Jokic/Doncic type: pass 72% of handler possessions → huge assist numbers
  const isPM=handler.a.playmaking>=92&&handler.a.basketballIQ>=92;
  const passC=isPM?.72:.43;
  let shooter=handler,assister=null,zone;
  if(Math.random()<passC){
    const others=offT.filter(p=>p.id!==handler.id);
    // Power-law weighted: stars receive more passes
    const tot=others.reduce((s,p)=>s+Math.pow(shootSk(p)/100,2)*100,0);
    let r=Math.random()*tot;
    for(const p of others){r-=Math.pow(shootSk(p)/100,2)*100;if(r<=0){shooter=p;break;}}
    if(shooter===handler)shooter=others[Math.floor(Math.random()*others.length)];
    assister=handler;
  }
  const a=shooter.a,tot2=a.finishing+a.midRange+a.threePointShot;
  const rv=Math.random()*tot2;
  zone=rv<a.finishing?'RIM':rv<a.finishing+a.midRange?'MID':'THREE';
  return{shooter,assister,zone};
}

function game(homeT,awayT){
  const S={};[...homeT,...awayT].forEach(p=>S[p.id]={pts:0,reb:0,ast:0,stl:0,blk:0,to:0,fga:0,fgm:0,fta:0,ftm:0,pf:0});
  const add=(id,f,v)=>{if(id&&S[id])S[id][f]+=v;};
  let hS=0,aS=0;const hU=calcUsage(homeT),aU=calcUsage(awayT);
  for(let q=0;q<4;q++){for(let pos=0;pos<50;pos++){
    const isH=pos%2===0,offT=isH?homeT:awayT,defT=isH?awayT:homeT,U=isH?hU:aU;
    const handler=pick(offT,U);
    const t=checkTO(handler,defT);
    if(t.is){add(handler.id,'to',1);if(t.sid)add(t.sid,'stl',1);continue;}
    const{shooter,assister,zone}=selectPlay(handler,offT);
    const sh=doShot(shooter,defT,zone);
    add(shooter.id,'fga',1);
    if(sh.blocked){add(sh.blockerId,'blk',1);const rb=rebound(offT,defT);if(rb)add(rb.id,'reb',1);continue;}
    if(sh.foulDef){add(sh.foulDef,'pf',1);}
    if(sh.made){
      add(shooter.id,'fgm',1);add(shooter.id,'pts',sh.pts);
      if(assister)add(assister.id,'ast',1);
      if(isH)hS+=sh.pts;else aS+=sh.pts;
    }
    if(sh.fta>0){
      const m=doFT(shooter,sh.fta);
      add(shooter.id,'fta',sh.fta);add(shooter.id,'ftm',m);add(shooter.id,'pts',m);
      if(isH)hS+=m;else aS+=m;
      if(sh.foul){const rb=rebound(offT,defT);if(rb)add(rb.id,'reb',1);}
    }
    if(!sh.made&&!sh.foul){const rb=rebound(offT,defT);if(rb)add(rb.id,'reb',1);}
  }}
  return{S,hS,aS};
}

function season(name,team,opps){
  const T={};team.forEach(p=>T[p.id]={pts:0,reb:0,ast:0,stl:0,blk:0,to:0,fga:0,fgm:0,fta:0,ftm:0,pf:0,g:0});
  let teamPts=0,teamAst=0,teamTO=0,teamStl=0,teamBlk=0,teamReb=0,games=0;
  for(let g=0;g<200;g++){
    const opp=opps[g%opps.length];const isHome=g%2===0;
    const res=isHome?game(team,opp):game(opp,team);
    const statsKey=isHome?'hS':'aS';
    const myScore=isHome?res.hS:res.aS;
    team.forEach(p=>{const s=res.S[p.id];if(!s)return;const t=T[p.id];Object.keys(s).forEach(k=>t[k]=(t[k]||0)+s[k]);t.g++;});
    const myStats=Object.fromEntries(team.map(p=>[p.id,res.S[p.id]]));
    teamPts+=myScore;
    team.forEach(p=>{const s=res.S[p.id];if(!s)return;teamAst+=s.ast;teamTO+=s.to;teamStl+=s.stl;teamBlk+=s.blk;teamReb+=s.reb;});
    games++;
  }
  const G=games;
  console.log('\n=== '+name+' ===');
  console.log('           POS  PTS   REB   AST   STL   BLK   TO   FGA   FG%   FT%   PF');
  team.forEach(p=>{
    const t=T[p.id],g=t.g||1;
    const fgp=t.fga>0?(t.fgm/t.fga*100).toFixed(0):'--';
    const ftp=t.fta>0?(t.ftm/t.fta*100).toFixed(0):'--';
    console.log(p.nm.padEnd(12)+p.pos.padEnd(5)+
      [(t.pts/g).toFixed(1),(t.reb/g).toFixed(1),(t.ast/g).toFixed(1),(t.stl/g).toFixed(1),(t.blk/g).toFixed(1),(t.to/g).toFixed(1),(t.fga/g).toFixed(1),fgp+'%',ftp+'%',(t.pf/g).toFixed(1)].map(v=>v.padStart(6)).join('  '));
  });
  console.log(`  TEAM/game: ${(teamPts/G).toFixed(1)}pts ${(teamReb/G).toFixed(1)}reb ${(teamAst/G).toFixed(1)}ast ${(teamTO/G).toFixed(1)}to ${(teamStl/G).toFixed(1)}stl ${(teamBlk/G).toFixed(1)}blk`);
  console.log('  TARGETS:  115pts  44reb  26ast  15to  8stl  5blk');
}

console.log('STAR TARGETS: SGA 31.1/4.3/6.6/2.0stl | Doncic 33.5/8.5/8.7 | Jokic 27.7/12.9/10.7/2.9to');
season('OKC Thunder',OKC,[DEN,DAL]);
season('Denver Nuggets',DEN,[OKC,DAL]);
season('Dallas Mavericks',DAL,[OKC,DEN]);
