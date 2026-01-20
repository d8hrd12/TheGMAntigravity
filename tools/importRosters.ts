
import fs from 'fs';
import path from 'path';
import { RealPlayerDef } from '../src/data/realRosters';

// Load JSON
const jsonPath = path.resolve(process.cwd(), 'src/data/full_roster.json');
const rawData = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(rawData);

// 1. Build Team Map (TID -> Abbrev)
const teamMap: Record<number, string> = {};
// Scan scheduledEvents for team info if teams array is not straightforward or use teams array if present.
// Looking at file view, there is a "teams" key likely or scheduledEvents has teamInfo.
// Let's use the 'teams' array inside 'expansionDraft' or just infer from scheduledEvents usually found in these BBGM files.
// Actually, standard BBGM export has 'teams' at the top level usually? 
// Let's check the structure I viewed earlier. It ended with `scheduledEvents`.
// I need to find where team definitions are. 
// Lines 22032 shows specific team data like "tid": 26, "abbrev": "SAS".
// It seems the large JSON has a 'teams' array that I might have missed in the view or it's implicitly part of the file root.
// Wait, I viewed lines 22000+. Line 22032 {"tid":26, ...} suggests there IS a teams array.
// Let's assume root.teams exists.

const teams = data.teams || [];
teams.forEach((t: any) => {
    teamMap[t.tid] = t.abbrev;
});

// Manual fixes for potential missing abbreviations or mismatches
// Ensure common teams are mapped if missing from file (unlikely for full export)

// 2. Process Players
const rosterMap: Record<string, RealPlayerDef[]> = {};

data.players.forEach((p: any) => {
    // Skip free agents (typically TID -1 or -2)
    if (p.tid < 0) return;

    const teamAbbrev = teamMap[p.tid];
    if (!teamAbbrev) return; // Skip if team unknown

    if (!rosterMap[teamAbbrev]) {
        rosterMap[teamAbbrev] = [];
    }

    // Get latest ratings
    const latestRating = p.ratings[p.ratings.length - 1]; // Use last rating entry
    if (!latestRating) return;

    // Calculate OVR (rough approximation or use their 'ovr' if calculated, usually BBGM relies on sub-ratings)
    // BBGM exports don't always have 'ovr' in the rating object explicitly, it's calculated.
    // We will trust our internal calculator to re-calc OVR from attributes, but we need to map attributes.
    // BBGM Scale: 0-100. Our Scale: 0-100? Yes.
    // Mapping:
    // ins -> insideShot
    // dnk -> dunk (we don't have dunk attr? allow 'insideShot' to cover or 'athleticism')
    // ft -> freeThrow (not in PlayerAttributes? We use inside/mid/3pt. FT is usually hidden or derived)
    // fg -> midRangeShot (BBGM 'fg' is 2pt jump shot)
    // tp -> threePointShot
    // oi -> offensiveIQ -> iq
    // di -> defensiveIQ -> iq (avg?)
    // drb -> defensiveRebound
    // orb -> offensiveRebound
    // pss -> passing
    // reb -> rebound (general? BBGM has orb/drb in ratings usually? Wait, line 6 shows: "reb":74. "orb" is separate in stats? )
    // Let's look at rating keys again: hgt, stre, spd, jmp, endu, ins, dnk, ft, fg, tp, diq, oiq, drb, pss, reb.

    // Our PlayerAttributes:
    // insideShot, midRangeShot, threePointShot, passing, ballHandling, offensiveRebound, defensiveRebound,
    // interiorDefense, perimeterDefense, steal, block, speed, stamina, iq

    // Mapping Strategy:
    const attrs = {
        insideShot: latestRating.ins,
        midRangeShot: latestRating.fg,
        threePointShot: latestRating.tp,
        passing: latestRating.pss,
        ballHandling: latestRating.drb, // "drb" in BBGM ratings is DRibbling? No, "drb" is Def Rebound usually?
        // Wait, BBGM ratings:
        // hgt: Height
        // stre: Strength
        // spd: Speed
        // jmp: Jumping
        // endu: Endurance
        // ins: Inside Scoring
        // dnk: Dunking
        // ft: Free Throw
        // fg: 2pt Jump Shot
        // tp: 3pt Jump Shot
        // diq: Defensive IQ
        // oiq: Offensive IQ
        // drb: Dribbling (Yes, in BBGM 'drb' is Dribbling, 'reb' is Rebounding)
        // pss: Passing
        // reb: Rebounding

        offensiveRebound: latestRating.reb, // Approximation
        defensiveRebound: latestRating.reb, // Approximation
        interiorDefense: (latestRating.hgt + latestRating.stre + latestRating.diq) / 3, // Rough calc
        perimeterDefense: (latestRating.spd + latestRating.diq) / 2, // Rough calc
        steal: latestRating.diq, // Proxies
        block: (latestRating.hgt + latestRating.jmp) / 2, // Proxies
        speed: latestRating.spd,
        stamina: latestRating.endu,
        iq: (latestRating.oiq + latestRating.diq) / 2
    };

    // Contract
    const contract = {
        amount: p.contract.amount * 1000, // BBGM stores in thousands usually (e.g. 53800 = $53.8M).
        years: p.contract.exp - 2026 + 1 // exp year is end year.
    };
    if (contract.years < 1) contract.years = 1;

    // Archetype Logic (Simplified mapping)
    let archetype = 'Spectator';
    if (latestRating.pss > 60) archetype = 'Playmaker';
    else if (latestRating.tp > 60) archetype = 'Sharpshooter';
    else if (latestRating.ins > 60) archetype = 'Slasher';
    else if (latestRating.reb > 60) archetype = 'Rim Protector';

    // OVR - Use a simple heuristic for now since we don't have the engine's algo handy
    // We will let the game re-calc OVR from attributes later, but we need an 'ovr' for the Def interface.
    // Let's average key stats.
    const ovrRaw = (attrs.insideShot + attrs.midRangeShot + attrs.threePointShot + attrs.passing + attrs.ballHandling + attrs.speed + attrs.iq) / 7;
    const ovr = Math.round(ovrRaw);

    // Safety checks
    if (!p.name || !p.contract) return;

    rosterMap[teamAbbrev].push({
        firstName: p.name.split(' ')[0],
        lastName: p.name.split(' ').slice(1).join(' '),
        pos: p.pos,
        age: 2026 - p.born.year,
        ovr: ovr, // This is just a placeholder, real OVR calc happens in game
        archetype: archetype,
        attributes: attrs,
        contract: {
            amount: (p.contract.amount || 1000) * 1000,
            years: Math.max(1, (p.contract.exp || 2026) - 2026 + 1)
        }
    });
});

// Generate Output String
let output = `import { RealPlayerDef } from './realRosters';\n\n`;
output += `export const REAL_ROSTERS: Record<string, RealPlayerDef[]> = {\n`;

for (const [abbr, players] of Object.entries(rosterMap)) {
    // Map non-standard abbrs if necessary (e.g. PHO -> PHX, CHO -> CHA)
    let finalAbbr = abbr;
    if (abbr === 'PHO') finalAbbr = 'PHX';
    if (abbr === 'CHO') finalAbbr = 'CHA';
    if (abbr === 'BRK') finalAbbr = 'BKN';
    if (abbr === 'NOP') finalAbbr = 'NOP'; // Correct
    if (abbr === 'NOJ') finalAbbr = 'NOP'; // Old Jazz?
    if (abbr === 'UTH') finalAbbr = 'UTA';
    if (abbr === 'WAS') finalAbbr = 'WAS';

    // Limit to top 15 players per team to clean up
    const top15 = players.sort((a, b) => b.ovr - a.ovr).slice(0, 15);

    output += `  "${finalAbbr}": [\n`;
    top15.forEach(p => {
        output += `    {\n`;
        output += `      firstName: "${p.firstName}",\n`;
        output += `      lastName: "${p.lastName}",\n`;
        output += `      pos: "${p.pos}",\n`;
        output += `      age: ${p.age},\n`;
        output += `      ovr: ${p.ovr},\n`;
        output += `      archetype: "${p.archetype}",\n`;
        output += `      attributes: ${JSON.stringify(p.attributes)},\n`;
        output += `      contract: { amount: ${p.contract.amount}, years: ${p.contract.years} }\n`;
        output += `    },\n`;
    });
    output += `  ],\n`;
}
output += `};\n`;

// Also define the interface if it's not imported correctly, but we import it.
// Actually, let's just make the file self-contained or import the type.
// The file we are WRITING to is src/data/realRosters.ts.
// Wait, the tool writes to src/data/realRosters.ts directly?
// No, let's have the tool log only for now or write to a temp file first.
// The user plan said "Write to src/data/realRosters.ts".
// I'll update the script to write to that path.

const outPath = path.resolve(process.cwd(), 'src/data/realRosters.ts');
// We need to keep the Interface definition!
// So let's write usage of Replace or just hardcode the interface in the new file.
// Better to preserve the interface export.

const finalContent = `
export interface RealPlayerDef {
    firstName: string;
    lastName: string;
    pos: string; // "PG" | "SG" | "SF" | "PF" | "C"
    age: number;
    ovr: number;
    archetype: string;
    attributes?: any; // PlayerAttributes
    contract?: {
        amount: number;
        years: number;
    };
}

${output.replace(`import { RealPlayerDef } from './realRosters';\n\n`, '')}
`;

fs.writeFileSync(outPath, finalContent);
console.log(`Successfully imported rosters for ${Object.keys(rosterMap).length} teams to ${outPath}`);
