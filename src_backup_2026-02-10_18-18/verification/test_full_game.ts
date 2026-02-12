
import { simulateMatchII } from "../features/simulation/MatchEngineII";
import { generatePlayer } from "../features/player/playerGenerator";
import type { Team } from "../models/Team";
import type { Player } from "../models/Player";

console.log("=== FULL GAME INTEGRATION TEST (MATCH ENGINE II) ===");

const defaultFinancials = {
    totalIncome: 0,
    totalExpenses: 0,
    dailyIncome: 0,
    dailyExpenses: 0,
    seasonHistory: []
};

// 1. Teams
const homeTeam: Team = {
    id: "home",
    name: "Lakers",
    conference: "West",
    city: "Los Angeles",
    abbreviation: "LAL",
    wins: 0, losses: 0,
    salaryCapSpace: 100, cash: 100, debt: 0,
    financials: defaultFinancials,
    colors: { primary: "#000", secondary: "#FFF" },
    rosterIds: [],
    history: [],
    ownerPatience: 50,
    marketSize: "Large",
    fanInterest: 80,
    rivalIds: [],
    draftPicks: []
};
const awayTeam: Team = {
    id: "away",
    name: "Celtics",
    conference: "East",
    city: "Boston",
    abbreviation: "BOS",
    wins: 0, losses: 0,
    salaryCapSpace: 100, cash: 100, debt: 0,
    financials: defaultFinancials,
    colors: { primary: "#000", secondary: "#FFF" },
    rosterIds: [],
    history: [],
    ownerPatience: 50,
    marketSize: "Large",
    fanInterest: 80,
    rivalIds: [],
    draftPicks: []
};

// 2. Players (10 each for full rotation)
function createSquad(teamId: string, tier: 'star' | 'starter' | 'bench') {
    const squad: Player[] = [];
    // Starters
    ['PG', 'SG', 'SF', 'PF', 'C'].forEach(pos => {
        const p = generatePlayer(pos as any, tier);
        p.teamId = teamId;
        p.isStarter = true;
        squad.push(p);
    });
    // Bench
    ['PG', 'SG', 'SF', 'PF', 'C'].forEach(pos => {
        const p = generatePlayer(pos as any, 'bench');
        p.teamId = teamId;
        p.isStarter = false;
        squad.push(p);
    });
    return squad;
}

const homePlayers = createSquad("home", "star");
const awayPlayers = createSquad("away", "starter");

// 3. Run
const start = Date.now();
const result = simulateMatchII({
    homeTeam,
    awayTeam,
    homeRoster: homePlayers,
    awayRoster: awayPlayers,
    date: new Date()
});

const duration = Date.now() - start;

console.log(`\n--- GAME RESULT ---`);
console.log(`Score: ${result.homeScore} - ${result.awayScore}`);
console.log(`Winner: ${result.winnerId}`);
console.log(`Events Generated: ${result.events.length}`);
console.log(`Simulation Time: ${duration}ms`);

// 4. Inspect Stats
console.log("\n--- STATS INSPECTION ---");
const homeStar = homePlayers[0];
const stats = result.boxScore.homeStats[homeStar.id];

if (!stats) {
    console.error("❌ Stats NOT FOUND for home star player!");
} else {
    console.log(`Player: ${stats.name}`);
    console.log(`Minutes: ${stats.minutes.toFixed(1)}`);
    console.log(`Points: ${stats.points}`);
    console.log(`Rebounds: ${stats.rebounds}`);
    console.log(`Assists: ${stats.assists}`);

    if (stats.minutes === 0) {
        console.error("❌ Minutes are 0! Accumulator is failing to track time.");
    }
    if (stats.points === 0 && stats.rebounds === 0 && stats.assists === 0) {
        console.warn("⚠️ All Zero Stats (Points/Reb/Ast). Accumulator logic suspicious.");
    } else {
        console.log("✅ Check Passed: Stats are present.");
    }
}

console.log("\n=== TEST COMPLETE ===");
