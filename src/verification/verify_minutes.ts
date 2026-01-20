
import { simulateMatchII } from "../features/simulation/MatchEngineII";
import { generatePlayer } from "../features/player/playerGenerator";
import type { Team } from "../models/Team";
import type { Player } from "../models/Player";

// --- HELPERS ---
const generateTeam = (id: string, name: string): Team => ({
    id, name, city: 'City', abbreviation: id.substring(0, 3).toUpperCase(), conference: 'West',
    wins: 0, losses: 0, salaryCapSpace: 100, cash: 100, debt: 0,
    financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] },
    colors: { primary: '#000', secondary: '#FFF' }, rosterIds: [], history: [], ownerPatience: 50, marketSize: 'Medium', fanInterest: 50, draftPicks: [],
    rivalIds: [],
    rotationSchedule: []
});

const createRoster = (teamId: string, minuteDistribution: number[]): Player[] => {
    const roster: Player[] = [];
    const positions: any[] = ['PG', 'SG', 'SF', 'PF', 'C', 'PG', 'SG', 'SF', 'PF', 'C', 'PG', 'SG'];
    for (let i = 0; i < minuteDistribution.length; i++) {
        const p = generatePlayer(positions[i], i < 5 ? 'star' : 'bench');
        p.id = `${teamId}_p${i}`;
        p.teamId = teamId;
        p.isStarter = i < 5;
        p.minutes = minuteDistribution[i];
        roster.push(p);
    }
    return roster;
};

const testMinutesAdherence = () => {
    console.log("\n=== TEST: STRICT MINUTES ADHERENCE ===");

    // Total must be 240 for consistency, but the engine should normalize.
    // Let's test a very specific 11-man rotation.
    const minuteDist = [38, 36, 34, 32, 28, 20, 18, 14, 10, 6, 4];
    const totalDist = minuteDist.reduce((a, b) => a + b, 0);
    console.log(`Target Total Minutes: ${totalDist}`);

    const team = generateTeam("user_team", "User Team");
    const roster = createRoster(team.id, minuteDist);

    const oppTeam = generateTeam("ai_team", "AI Team");
    const oppRoster = createRoster(oppTeam.id, [36, 36, 36, 36, 36, 12, 12, 12, 12, 12]);

    const result = simulateMatchII({
        homeTeam: team,
        awayTeam: oppTeam,
        homeRoster: roster,
        awayRoster: oppRoster,
        date: new Date(),
        userTeamId: team.id
    });

    console.log("\nResults (User Team):");
    console.log("------------------------------------------");
    console.log("Player | Target | Actual | Diff");
    console.log("------------------------------------------");

    let totalActual = 0;
    roster.forEach((p, i) => {
        const actual = result.boxScore.homeStats[p.id]?.minutes || 0;
        const target = p.minutes || 0;
        const diff = actual - target;
        totalActual += actual;
        console.log(`${p.lastName.padEnd(10)} | ${target.toString().padStart(6)} | ${actual.toFixed(1).padStart(6)} | ${diff.toFixed(1).padStart(5)}`);
    });
    console.log("------------------------------------------");
    console.log(`TOTAL  | ${totalDist.toString().padStart(6)} | ${totalActual.toFixed(1).padStart(6)}`);

    // Verification: Each player should be within 1.5 minutes of target
    const failures = roster.filter(p => {
        const actual = result.boxScore.homeStats[p.id]?.minutes || 0;
        const target = p.minutes || 0;
        return Math.abs(actual - target) > 1.5;
    });

    if (failures.length === 0) {
        console.log("\n✅ SUCCESS: All players within 1.5 minutes of target.");
    } else {
        console.log(`\n❌ FAILURE: ${failures.length} players exceeded target variance.`);
    }
};

testMinutesAdherence();
