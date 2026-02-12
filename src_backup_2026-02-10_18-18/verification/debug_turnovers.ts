
import { simulatePossession, type PossessionContext } from '../features/simulation/PossessionEngine';
import type { Player } from '../models/Player';

// --- MOCKS ---
function createPlayer(pos: string, ovr: number): any {
    const isWing = pos.includes('SG') || pos.includes('SF') || pos.includes('PG');
    return {
        id: pos, lastName: `${pos}_Player`, firstName: pos,
        position: pos.replace('b', '').replace('d', ''),
        attributes: {
            finishing: ovr, midRange: ovr, threePointShot: isWing ? 90 : 40,
            playmaking: 70, // Average Playmaking
            basketballIQ: 70, ballHandling: 70,
            athleticism: 80, interiorDefense: 70, perimeterDefense: 70,
            freeThrow: 80, offensiveRebound: 50, defensiveRebound: 50,
            blocking: 50, stealing: 50
        },
        overall: ovr, isStarter: !pos.startsWith('b'),
        personality: 'Professional'
    };
}

const starters = [createPlayer('PG', 85), createPlayer('SG', 90), createPlayer('SF', 80), createPlayer('PF', 80), createPlayer('C', 80)];
const teamOff: any = { id: 'off', name: 'OFF' };
const teamDef: any = { id: 'def', name: 'DEF' };

const statsMap = new Map<string, any>();
function getStats(pid: string) {
    if (!statsMap.has(pid)) {
        statsMap.set(pid, {
            points: 0, fieldGoalsMade: 0, fgAttempted: 0,
            threePointersMade: 0, threePointersAttempted: 0,
            assists: 0, turnovers: 0, consecutiveFieldGoalsMade: 0
        });
    }
    return statsMap.get(pid);
}

console.log('--- RAW POSSESSION LOG (50 Possessions) ---');

const TOTAL_POSSESSIONS = 50;
let possessions = 0;

while (possessions < TOTAL_POSSESSIONS) {
    const ctx: any = {
        offenseTeam: teamOff, defenseTeam: teamDef,
        offenseLineup: starters, defenseLineup: starters,
        offenseStrategy: { pace: 'Normal' },
        defenseStrategy: { pace: 'Normal' },
        timeRemaining: 720, shotClock: 24, quarter: 1,
        scoreMargin: 0,
        getStats
    };

    console.log(`\nPOSS #${possessions + 1}:`);
    const res = simulatePossession(ctx);

    // Log Events
    res.events.forEach((e: any) => {
        if (e.text.includes('Turnover') || e.text.includes('foul')) {
            console.log(`[ALERT] ${e.text} (ID: ${e.id})`);
        } else {
            console.log(`> ${e.text}`);
        }
    });

    possessions++;
}
