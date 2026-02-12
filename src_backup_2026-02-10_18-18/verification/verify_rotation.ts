
import { simulateMatchII } from "../features/simulation/MatchEngineII";
import { generatePlayer } from "../features/player/playerGenerator";
import type { Team } from "../models/Team";
import type { Player } from "../models/Player";
import type { TeamRotationData } from "../features/simulation/SimulationTypes";

// --- HELPERS ---
const generateTeam = (id: string, name: string): Team => ({
    id, name, city: 'City', abbreviation: id.substring(0, 3).toUpperCase(), conference: 'West',
    wins: 0, losses: 0, salaryCapSpace: 100, cash: 100, debt: 0,
    financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] },
    colors: { primary: '#000', secondary: '#FFF' }, rosterIds: [], history: [], ownerPatience: 50, marketSize: 'Medium', fanInterest: 50, draftPicks: [],
    rivalIds: [],
    rotationSchedule: []
});

const createRoster = (teamId: string): Player[] => {
    const roster: Player[] = [];
    const positions: any[] = ['PG', 'SG', 'SF', 'PF', 'C', 'PG', 'SG', 'SF', 'PF', 'C'];
    for (let i = 0; i < 10; i++) {
        const p = generatePlayer(positions[i], i < 5 ? 'star' : 'bench');
        p.id = `${teamId}_p${i}`;
        p.teamId = teamId;
        p.isStarter = i < 5;
        roster.push(p);
    }
    return roster;
};

// --- TEST CASE 1: STRICT USER ROTATION ---
const testStrictRotation = () => {
    console.log("\n=== TEST 1: STRICT USER ROTATION ===");
    const team = generateTeam("user_team", "User Team");
    const roster = createRoster(team.id);

    // Create a weird schedule: ONLY p0 plays for the entire game (all quarters)
    // In reality, 5 players must be on court, so let's pick p0, p1, p2, p3, p4.
    const starters = roster.slice(0, 5).map(p => p.id);
    const customSchedule: TeamRotationData[] = [
        { id: 'q1', quarter: 1, startMinute: 12, endMinute: 0, playerIds: starters },
        { id: 'q2', quarter: 2, startMinute: 12, endMinute: 0, playerIds: starters },
        { id: 'q3', quarter: 3, startMinute: 12, endMinute: 0, playerIds: starters },
        { id: 'q4', quarter: 4, startMinute: 12, endMinute: 0, playerIds: starters }
    ];
    team.rotationSchedule = customSchedule;

    const oppTeam = generateTeam("ai_team", "AI Team");
    const oppRoster = createRoster(oppTeam.id);

    // Simulate with userTeamId = team.id
    const result = simulateMatchII({
        homeTeam: team,
        awayTeam: oppTeam,
        homeRoster: roster,
        awayRoster: oppRoster,
        date: new Date(),
        userTeamId: team.id
    });

    console.log("User Team (Strict) Minutes:");
    roster.forEach(p => {
        const stats = result.boxScore.homeStats[p.id];
        console.log(`${p.lastName}: ${stats?.minutes.toFixed(1) || 0} mins`);
    });

    console.log("\nAI Team (Auto) Minutes:");
    oppRoster.forEach(p => {
        const stats = result.boxScore.awayStats[p.id];
        console.log(`${p.lastName}: ${stats?.minutes.toFixed(1) || 0} mins`);
    });

    // Verification
    const starterMins = roster.slice(0, 5).map(p => result.boxScore.homeStats[p.id]?.minutes || 0);
    const benchMins = roster.slice(5, 10).map(p => result.boxScore.homeStats[p.id]?.minutes || 0);

    const allStarters48 = starterMins.every(m => m >= 47.9);
    const allBenchZero = benchMins.every(m => m === 0);

    if (allStarters48 && allBenchZero) {
        console.log("\n✅ SUCCESS: User Team strictly followed 48min starter rotation.");
    } else {
        console.log("\n❌ FAILURE: User Team rotation leaked.");
    }

    const aiBenchMins = oppRoster.slice(5, 10).map(p => result.boxScore.awayStats[p.id]?.minutes || 0);
    const aiBenchPlayed = aiBenchMins.some(m => m > 0);
    if (aiBenchPlayed) {
        console.log("✅ SUCCESS: AI Team auto-generated rotation and used bench.");
    } else {
        console.log("❌ FAILURE: AI Team stuck to starters (not auto-generating well or default is too heavy).");
    }
};

testStrictRotation();
