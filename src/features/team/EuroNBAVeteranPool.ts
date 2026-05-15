/**
 * EuroNBAVeteranPool.ts
 *
 * Pure-data layer that builds the NBA veteran pool for a given game year.
 * Shared by both the EuroTransferMarketView (UI) and EuroOffseasonAI (AI).
 */

import type { Player } from '../../models/Player';
import { REAL_ROSTERS } from '../../data/realRosters';
import { NBA_TEAMS } from '../../data/teams';

const BASE_YEAR = 2025;
const CYCLE_LENGTH = 4;

const RAND_FIRST = [
    'Marcus','DeShawn','Jalen','Tyrese','Isaiah','Darius','Malik','Devon',
    'Kendall','Andre','Jordan','Lamont','Darnell','Xavier','Kareem','Rashid',
    'Elijah','Antoine','Damien','Cortez','Marques','Terrell','Brandon','Ashton',
    'Javon','Corey','Derrick','Jamal','Quentin','Reggie'
];
const RAND_LAST = [
    'Washington','Coleman','Mitchell','Jefferson','Harrison','Brooks','Crawford',
    'Ellis','Tucker','Simmons','Porter','Patterson','Dixon','Banks','Fleming',
    'Horton','Walton','Griffith','Benson','Caldwell','Chambers','Holt','Vance',
    'Barton','Mercer','Payne','Rollins','Stanton','Wilkes','Norwood'
];

function applyAgingDecay(attrs: any, baseOvr: number, currentAge: number) {
    const yearsOverPrime = Math.max(0, currentAge - 30);
    const athleticScale = Math.max(0.70, 1 - yearsOverPrime * 0.020); // softer physical drop
    const skillScale    = Math.max(0.88, 1 - yearsOverPrime * 0.008); // slower skill drop
    const iqBonus       = Math.min(10, Math.floor(yearsOverPrime * 0.6));
    const s = (v: number, scale: number) => Math.max(30, Math.round((v || baseOvr) * scale));
    return {
        finishing: s(attrs.finishing, athleticScale), athleticism: s(attrs.athleticism, athleticScale),
        speed: s(attrs.speed, athleticScale), agility: s(attrs.agility, athleticScale),
        vertical: s(attrs.vertical, athleticScale), ballHandling: s(attrs.ballHandling, athleticScale),
        drivingDunk: s(attrs.drivingDunk, athleticScale), offensiveRebound: s(attrs.offensiveRebound, athleticScale),
        defensiveRebound: s(attrs.defensiveRebound, athleticScale), blocking: s(attrs.blocking, athleticScale),
        midRange: s(attrs.midRange, skillScale), threePointShot: s(attrs.threePointShot, skillScale),
        freeThrow: s(attrs.freeThrow, skillScale), playmaking: s(attrs.playmaking, skillScale),
        interiorDefense: s(attrs.interiorDefense, skillScale), perimeterDefense: s(attrs.perimeterDefense, skillScale),
        stealing: s(attrs.stealing, skillScale), postControl: s(attrs.postControl, skillScale),
        drawFoul: s(attrs.drawFoul, skillScale), standingDunk: s(attrs.standingDunk, skillScale),
        layup: s(attrs.layup, skillScale),
        basketballIQ: Math.min(99, (attrs.basketballIQ || baseOvr) + iqBonus),
        workEthic: Math.min(99, (attrs.workEthic || 80) + Math.floor(iqBonus * 0.5)),
        offensiveConsistency: s(attrs.offensiveConsistency, skillScale),
        defensiveConsistency: s(attrs.defensiveConsistency, skillScale),
        strength: attrs.strength || 70,
        stamina: Math.max(70, (attrs.stamina || 85) - yearsOverPrime * 1.2),
    };
}

function extractFromRosters(
    gameYear: number,
    overrideName?: (i: number) => { firstName: string; lastName: string }
): Player[] {
    const yearsElapsed = Math.max(0, gameYear - BASE_YEAR);
    const pool: Player[] = [];

    for (const [abbr, roster] of Object.entries(REAL_ROSTERS)) {
        const team = NBA_TEAMS.find(t => t.abbreviation === abbr);
        for (const def of roster as any[]) {
            const currentAge = def.age + yearsElapsed;
            const contractYearsLeft = (def.contract?.years || 0) - yearsElapsed;
            if (contractYearsLeft !== 1) continue;
            if (currentAge <= 31) continue;
            
            // Softer age drop: starts at 34 and slower slope
            const ageDrop = Math.max(0, (currentAge - 34) * 0.4);
            const currentOvr = Math.max(70, (def.ovr || 75) - ageDrop);
            if (currentOvr <= 76) continue;

            const attrs = applyAgingDecay(def.attributes || {}, def.ovr || 75, currentAge);
            const nameIdx = pool.length;
            const name = overrideName ? overrideName(nameIdx) : { firstName: def.firstName, lastName: def.lastName };

            pool.push({
                id: `nba_target_${gameYear}_${abbr}_${name.firstName}_${name.lastName}`.replace(/[\s.]+/g, '_'),
                firstName: name.firstName,
                lastName: name.lastName,
                position: (def.pos as any) || 'SF',
                age: currentAge,
                height: 200,
                weight: 100,
                teamId: team?.id || abbr,
                overall: currentOvr,
                potential: currentOvr,
                attributes: attrs,
                tendencies: {
                    shooting: 50,
                    passing: 50,
                    inside: 50,
                    outside: 50,
                    defensiveAggression: 50,
                    foulTendency: 50
                },
                personality: 'Silent Leader',
                archetype: def.archetype || 'Veteran',
                morale: 80, fatigue: 0, stamina: 100,
                yearsOfService: Math.max(1, currentAge - 19),
                isStarter: true, minutes: 28, loveForTheGame: 15,
                seasonStats: {
                    gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                    steals: 0, blocks: 0, turnovers: 0, offensiveRebounds: 0, defensiveRebounds: 0,
                    fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
                    ftMade: 0, ftAttempted: 0, fouls: 0, plusMinus: 0,
                    rimMade: 0, rimAttempted: 0, rimAssisted: 0,
                    midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
                    threePointAssisted: 0
                },
                careerStats: [],
                jerseyNumber: Math.floor(Math.random() * 50),
                acquisition: { type: 'initial', year: gameYear - 1, details: 'NBA Contract Expiring' }
            } as Player);
        }
    }

    return pool.sort((a, b) => b.overall - a.overall);
}

/**
 * Builds the full available NBA veteran pool for a given game year.
 * Used by the UI (transfer market tab) AND the AI GM (offseason signing).
 */
export function buildNBATargetPoolForAI(gameYear: number): Player[] {
    const realPool = extractFromRosters(gameYear);
    if (realPool.length >= 10) return realPool;

    const cycleOffset = (gameYear - BASE_YEAR) % CYCLE_LENGTH;
    const cycleBaseYear = BASE_YEAR + cycleOffset;
    const seed = gameYear * 31;
    const pick = (arr: string[], i: number) => arr[(seed + i * 7) % arr.length];

    const cyclePool = extractFromRosters(cycleBaseYear, i => ({
        firstName: pick(RAND_FIRST, i),
        lastName: pick(RAND_LAST, i + 13)
    }))
        .filter(cp => !realPool.some(rp => rp.lastName === cp.lastName))
        .map((p, i) => ({
            ...p,
            id: `nba_cycled_${gameYear}_${i}`,
            overall: Math.max(77, p.overall - 1)
        }));

    return [...realPool, ...cyclePool]
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 20);
}
