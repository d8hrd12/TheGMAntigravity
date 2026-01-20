
import { simulateMatchII } from '../features/simulation/MatchEngineII';
import { generatePlayer } from '../features/player/playerGenerator';
import type { Team } from '../models/Team';
import type { Player } from '../models/Player';
import { StatsAccumulator } from '../features/simulation/StatsAccumulator';

// Setup Mock Data
const mockFinancials = { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] };

const teamA: Team = {
    id: 't1', name: 'Lakers', city: 'LA', abbreviation: 'LAL',
    marketSize: 'Large', conference: 'West',
    cash: 100, debt: 0, salaryCapSpace: 0,
    fanInterest: 1, ownerPatience: 50,
    financials: mockFinancials, rosterIds: [],
    wins: 0, losses: 0, draftPicks: [], rivalIds: [], tactics: undefined, rotationSchedule: [], history: []
};

const teamB: Team = {
    id: 't2', name: 'Nuggets', city: 'Denver', abbreviation: 'DEN',
    marketSize: 'Small', conference: 'West',
    cash: 100, debt: 0, salaryCapSpace: 0,
    fanInterest: 1, ownerPatience: 50,
    financials: mockFinancials, rosterIds: [],
    wins: 0, losses: 0, draftPicks: [], rivalIds: [], tactics: undefined, rotationSchedule: [], history: []
};

const rosterA: Player[] = [];
const rosterB: Player[] = [];

// Fill rosters
while (rosterA.length < 13) rosterA.push(generatePlayer());
while (rosterB.length < 13) rosterB.push(generatePlayer());

console.log("=== REPRODUCING UI STATS ===");

// Run Simulation EXACTLY as GameContext does
// 1. Single Match
const result = simulateMatchII({
    homeTeam: teamA,
    awayTeam: teamB,
    homeRoster: rosterA,
    awayRoster: rosterB,
    date: new Date()
});

console.log(`Score: ${result.homeScore} - ${result.awayScore}`);
console.log(`Events: ${result.events.length}`);

// 2. Check Stats
const box = result.boxScore;
const playersA = Object.values(box.homeStats);
const playersB = Object.values(box.awayStats);

// Find top scorers
const topA = playersA.sort((a, b) => b.points - a.points)[0];
const topB = playersB.sort((a, b) => b.points - a.points)[0];

console.log("\n--- KEY PLAYERS ---");
if (topA) console.log(`Top Home: ${topA.name} - ${topA.points} PTS, ${topA.rebounds} REB, ${topA.assists} AST, ${topA.minutes} MIN`);
if (topB) console.log(`Top Away: ${topB.name} - ${topB.points} PTS, ${topB.rebounds} REB, ${topB.assists} AST, ${topB.minutes} MIN`);

// 3. Double Check Accumulator Logic
// If the UI runs this loop multiple times or aggregates differently?
