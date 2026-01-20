import { updatePlayerMorale, applyTeamDynamics } from '../features/simulation/MoraleSystem';
import { generatePlayer, PERSONALITIES } from '../features/player/playerGenerator';
import type { Player } from '../models/Player';
import type { Team } from '../models/Team';

// Mock Data
const mockTeam: Team = {
    id: 'team_1',
    city: 'Test',
    name: 'Team',
    abbreviation: 'TSM',
    conference: 'West',
    wins: 10,
    losses: 40, // Tanking team for "Losing" test
    marketSize: 'Medium',
    rosterIds: [],
    cash: 10000000,
    debt: 0,
    fanInterest: 1.0,
    ownerPatience: 100,
    salaryCapSpace: 20000000,
    financials: {
        totalIncome: 0,
        totalExpenses: 0,
        dailyIncome: 0,
        dailyExpenses: 0,
        seasonHistory: []
    },
    draftPicks: [],
    rivalIds: [],
    history: []
};

const createMockPlayer = (personality: string, overall: number = 80): Player => {
    const p = generatePlayer('SF', 'starter');
    p.personality = personality as any; // Cast for now
    p.overall = overall;
    p.morale = 80;
    p.minutes = 30; // Expects 30
    p.teamId = 'team_1';
    p.isStarter = true;
    return p;
};

console.log("=== VERIFYING PERSONALITY LOGIC ===");

// TEST 1: Losing Streak Sensitivity
console.log("\n[TEST 1] Losing Game Impact (Divas vs Loyalists)");

const diva = createMockPlayer('Diva');
const loyalist = createMockPlayer('Loyalist');
const mercenary = createMockPlayer('Mercenary');
const pro = createMockPlayer('Professional');

const lostGame = updatePlayerMorale({ ...diva }, mockTeam, false, 30); // Lost, played target minutes
const lostLoyalist = updatePlayerMorale({ ...loyalist }, mockTeam, false, 30);
const lostMercenary = updatePlayerMorale({ ...mercenary }, mockTeam, false, 30);
const lostPro = updatePlayerMorale({ ...pro }, mockTeam, false, 30);

console.log(`Diva Drops: ${diva.morale} -> ${lostGame.morale} (Diff: ${diva.morale - lostGame.morale})`);
console.log(`Loyalist Drops: ${loyalist.morale} -> ${lostLoyalist.morale} (Diff: ${loyalist.morale - lostLoyalist.morale})`);
console.log(`Mercenary Drops: ${mercenary.morale} -> ${lostMercenary.morale} (Diff: ${mercenary.morale - lostMercenary.morale})`);
console.log(`Pro Drops: ${pro.morale} -> ${lostPro.morale} (Diff: ${pro.morale - lostPro.morale})`);

if (diva.morale - lostGame.morale > loyalist.morale - lostLoyalist.morale) console.log("PASS: Diva hurt more than Loyalist.");
else console.error("FAIL: Diva not hurt enough.");

// TEST 2: Benching Impact
console.log("\n[TEST 2] Benching Impact (Low Minutes)");
const benchedDiva = updatePlayerMorale({ ...diva }, mockTeam, false, 5); // 5 mins played
const benchedPro = updatePlayerMorale({ ...pro }, mockTeam, false, 5);

console.log(`Benched Diva Drops: ${diva.morale} -> ${benchedDiva.morale} (Diff: ${diva.morale - benchedDiva.morale})`);
console.log(`Benched Pro Drops: ${pro.morale} -> ${benchedPro.morale} (Diff: ${pro.morale - benchedPro.morale})`);

if (diva.morale - benchedDiva.morale > pro.morale - benchedPro.morale) console.log("PASS: Diva hates benching more.");
else console.error("FAIL: Diva tolerant of benching.");

// TEST 3: Team Dynamics (Leader Buff) & Toxic spread
console.log("\n[TEST 3] Team Dynamics (Leadership Buff)");

const toxicPlayer = createMockPlayer('Diva');
toxicPlayer.morale = 10; // Very unhappy

const normalPlayer = createMockPlayer('Professional');
normalPlayer.morale = 80;

const roster = [toxicPlayer, normalPlayer];

// Run without leader
const updatedRosterNoLeader = applyTeamDynamics([...roster.map(p => ({ ...p }))]);
const normalDropNoLeader = 80 - updatedRosterNoLeader[1].morale;
console.log(`Normal Player Drop (No Leader): ${normalDropNoLeader}`);

// Add Leader
const leader = createMockPlayer('Silent Leader');
leader.morale = 95;
const rosterWithLeader = [toxicPlayer, normalPlayer, leader];

const updatedRosterWithLeader = applyTeamDynamics([...rosterWithLeader.map(p => ({ ...p }))]);
const normalDropWithLeader = 80 - updatedRosterWithLeader[1].morale;
console.log(`Normal Player Drop (With Leader): ${normalDropWithLeader}`);

if (normalDropWithLeader < normalDropNoLeader) console.log("PASS: Leader mitigated toxicity.");
else console.error("FAIL: Leader did not help.");

