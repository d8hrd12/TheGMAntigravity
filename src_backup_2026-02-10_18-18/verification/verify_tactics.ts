
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
    rotationSchedule: [],
    tactics: { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
});

const createRoster = (teamId: string): Player[] => {
    const roster: Player[] = [];
    const positions: any[] = ['PG', 'SG', 'SF', 'PF', 'C', 'PG', 'SG', 'SF', 'PF', 'C'];
    for (let i = 0; i < 10; i++) {
        const p = generatePlayer(positions[i], i < 5 ? 'star' : 'bench');
        p.id = `${teamId}_p${i}`;
        p.teamId = teamId;
        p.isStarter = i < 5;
        p.minutes = i < 5 ? 36 : 12;
        roster.push(p);
    }
    return roster;
};

async function verifyTactics() {
    console.log("\n=== VERIFY TACTICS IMPACT ===");

    // Test 1: Pace Comparison
    console.log("\nChecking Pace (Very Slow vs Seven Seconds)...");
    const slowTeam = generateTeam("slow", "Slow Team");
    slowTeam.tactics!.pace = "Very Slow";
    const slowRoster = createRoster("slow");

    const fastTeam = generateTeam("fast", "Fast Team");
    fastTeam.tactics!.pace = "Seven Seconds";
    const fastRoster = createRoster("fast");

    const resultSlow = simulateMatchII({
        homeTeam: slowTeam, awayTeam: fastTeam,
        homeRoster: slowRoster, awayRoster: fastRoster,
        date: new Date()
    });

    const slowFGA = Object.values(resultSlow.boxScore.homeStats).reduce((sum, s) => sum + s.fgAttempted, 0);
    const fastFGA = Object.values(resultSlow.boxScore.awayStats).reduce((sum, s) => sum + s.fgAttempted, 0);

    console.log(`Very Slow FGA: ${slowFGA}`);
    console.log(`Seven Seconds FGA: ${fastFGA}`);

    // Test 2: Offensive Focus (Perimeter vs Inside)
    console.log("\nChecking Offensive Focus (Perimeter vs Inside)...");
    const perimeterTeam = generateTeam("perimeter", "Perimeter Team");
    perimeterTeam.tactics!.offensiveFocus = "Perimeter";
    const perimeterRoster = createRoster("perimeter");

    const insideTeam = generateTeam("inside", "Inside Team");
    insideTeam.tactics!.offensiveFocus = "Inside";
    const insideRoster = createRoster("inside");

    const resultFocus = simulateMatchII({
        homeTeam: perimeterTeam, awayTeam: insideTeam,
        homeRoster: perimeterRoster, awayRoster: insideRoster,
        date: new Date()
    });

    const perim3PA = Object.values(resultFocus.boxScore.homeStats).reduce((sum, s) => sum + s.threeAttempted, 0);
    const perimFGA = Object.values(resultFocus.boxScore.homeStats).reduce((sum, s) => sum + s.fgAttempted, 0);
    const inside3PA = Object.values(resultFocus.boxScore.awayStats).reduce((sum, s) => sum + s.threeAttempted, 0);
    const insideFGA = Object.values(resultFocus.boxScore.awayStats).reduce((sum, s) => sum + s.fgAttempted, 0);

    console.log(`Perimeter Team 3PAr: ${(perim3PA / perimFGA).toFixed(3)} (${perim3PA}/${perimFGA})`);
    console.log(`Inside Team 3PAr: ${(inside3PA / insideFGA).toFixed(3)} (${inside3PA}/${insideFGA})`);

    if (fastFGA > slowFGA && (perim3PA / perimFGA) > (inside3PA / insideFGA)) {
        console.log("\n✅ SUCCESS: Tactics are physically impacting the game!");
    } else {
        console.log("\n❌ FAILURE: Impact not significant enough.");
    }
}

verifyTactics();
