
import { simulateMatchII } from "../features/simulation/MatchEngineII";
import { generatePlayer } from "../features/player/playerGenerator";
import type { Team } from "../models/Team";
import type { Player, SeasonStats } from "../models/Player";
import type { MatchResult } from "../features/simulation/SimulationTypes";

// --- HELPERS ---
const generateTeam = (id: string, name: string): Team => ({
    id, name, city: 'City', abbreviation: id.substring(0, 3).toUpperCase(), conference: 'West',
    wins: 0, losses: 0, salaryCapSpace: 100, cash: 100, debt: 0,
    financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] },
    colors: { primary: '#000', secondary: '#FFF' }, rosterIds: [], history: [], ownerPatience: 50, marketSize: 'Medium', fanInterest: 50, draftPicks: [],
    rivalIds: []
});

const createRoster = (teamId: string): Player[] => {
    const roster: Player[] = [];
    // 1 Super Star
    const star = generatePlayer('SF', 'star');
    star.isStarter = true; star.teamId = teamId; roster.push(star);
    // 4 Starters
    ['PG', 'SG', 'PF', 'C'].forEach(pos => {
        const p = generatePlayer(pos as any, 'starter');
        p.isStarter = true; p.teamId = teamId; roster.push(p);
    });
    // 5 Bench
    ['PG', 'SG', 'SF', 'PF', 'C'].forEach(pos => {
        const p = generatePlayer(pos as any, 'bench');
        p.isStarter = false; p.teamId = teamId; roster.push(p);
    });
    return roster;
};

// --- SETUP LEAGUE ---
const TEAMS_COUNT = 10; // 10 Teams for speed (Enough for 5 games per day)
const DAYS_TO_SIM = 20;

const teams: Team[] = [];
let players: Player[] = [];

for (let i = 0; i < TEAMS_COUNT; i++) {
    const t = generateTeam(`team_${i}`, `Team ${i}`);
    teams.push(t);
    const r = createRoster(t.id);
    players.push(...r);
    t.rosterIds = r.map(p => p.id);
}

console.log(`\n=== INITIALIZING LEAGUE: ${TEAMS_COUNT} Teams, ${players.length} Players ===`);

// --- SIMULATION LOOP ---
console.log(`\n=== SIMULATING ${DAYS_TO_SIM} DAYS ===`);

// Accumulation Logic from GameContext.tsx
const updatePlayerStats = (p: Player, stats: any) => {
    let statsToUpdate = p.seasonStats || {
        gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
        steals: 0, blocks: 0, turnovers: 0, fouls: 0, plusMinus: 0,
        fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
        ftMade: 0, ftAttempted: 0, offensiveRebounds: 0, defensiveRebounds: 0
    };

    const newStats = { ...statsToUpdate };

    // Robust Accumulation
    newStats.gamesPlayed = (newStats.gamesPlayed || 0) + 1;
    newStats.minutes = (newStats.minutes || 0) + Number(stats.minutes || 0);
    newStats.points = (newStats.points || 0) + Number(stats.points || 0);
    newStats.rebounds = (newStats.rebounds || 0) + Number(stats.rebounds || 0);
    newStats.assists = (newStats.assists || 0) + Number(stats.assists || 0);
    newStats.steals = (newStats.steals || 0) + Number(stats.steals || 0);
    newStats.blocks = (newStats.blocks || 0) + Number(stats.blocks || 0);
    newStats.turnovers = (newStats.turnovers || 0) + Number(stats.turnovers || 0);
    newStats.fouls = (newStats.fouls || 0) + Number(stats.personalFouls || 0);
    newStats.offensiveRebounds = (newStats.offensiveRebounds || 0) + Number(stats.offensiveRebounds || 0);
    newStats.defensiveRebounds = (newStats.defensiveRebounds || 0) + Number(stats.defensiveRebounds || 0);
    newStats.fgMade = (newStats.fgMade || 0) + Number(stats.fgMade || 0);
    newStats.fgAttempted = (newStats.fgAttempted || 0) + Number(stats.fgAttempted || 0);
    newStats.threeMade = (newStats.threeMade || 0) + Number(stats.threeMade || 0);
    newStats.threeAttempted = (newStats.threeAttempted || 0) + Number(stats.threeAttempted || 0);
    newStats.ftMade = (newStats.ftMade || 0) + Number(stats.ftMade || 0);
    newStats.ftAttempted = (newStats.ftAttempted || 0) + Number(stats.ftAttempted || 0);

    return { ...p, seasonStats: newStats };
};

const start = Date.now();

for (let d = 0; d < DAYS_TO_SIM; d++) {
    // Generate Matchups (Round Robin-ish)
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const matchups = [];
    for (let i = 0; i < shuffled.length; i += 2) {
        matchups.push({ home: shuffled[i], away: shuffled[i + 1] });
    }

    matchups.forEach(m => {
        const homeRoster = players.filter(p => p.teamId === m.home.id);
        const awayRoster = players.filter(p => p.teamId === m.away.id);

        const result = simulateMatchII({
            homeTeam: m.home,
            awayTeam: m.away,
            homeRoster: homeRoster,
            awayRoster: awayRoster,
            date: new Date()
        });

        // Merge Stats
        const allStats = { ...result.boxScore.homeStats, ...result.boxScore.awayStats };
        Object.entries(allStats).forEach(([pid, stats]) => {
            const idx = players.findIndex(p => p.id === pid);
            if (idx !== -1) {
                players[idx] = updatePlayerStats(players[idx], stats);
            }
        });
    });

    if (d % 5 === 0) console.log('.');
}

const duration = Date.now() - start;
console.log(`\nDone in ${(duration / 1000).toFixed(2)}s`);

// --- ANALYSIS ---

// 1. Zero Check
const zeroPoints = players.filter(p => p.seasonStats.points === 0 && p.seasonStats.minutes > 10).length;
const zeroRebounds = players.filter(p => p.seasonStats.rebounds === 0 && p.seasonStats.minutes > 50).length; // Over 20 games

console.log(`\n--- INTEGRITY CHECK ---`);
console.log(`Players with 0 PTS (min > 10m total): ${zeroPoints}`);
console.log(`Players with 0 REB (min > 50m total): ${zeroRebounds}`);

// 2. Leaders
const sortedByPoints = [...players].sort((a, b) => (b.seasonStats.points / b.seasonStats.gamesPlayed) - (a.seasonStats.points / a.seasonStats.gamesPlayed));
const top10 = sortedByPoints.slice(0, 10);

console.log(`\n--- LEAGUE LEADERS (PPG) ---`);
top10.forEach((p, i) => {
    const s = p.seasonStats;
    const gp = s.gamesPlayed || 1;
    console.log(`${i + 1}. ${p.firstName} ${p.lastName} (${p.teamId}) - ${(s.points / gp).toFixed(1)} PPG | ${(s.rebounds / gp).toFixed(1)} RPG | ${(s.assists / gp).toFixed(1)} APG | ${(s.minutes / gp).toFixed(1)} MPG`);
});

// 3. Team Analysis
console.log(`\n--- TEAM SCORING AVERAGES ---`);
teams.forEach(t => {
    const teamPlayers = players.filter(p => p.teamId === t.id);
    const totalPoints = teamPlayers.reduce((sum, p) => sum + p.seasonStats.points, 0);
    const gp = teamPlayers[0].seasonStats.gamesPlayed || 1; // Approx
    const ppg = (totalPoints / gp).toFixed(1);
    console.log(`${t.name}: ${ppg} PPG`);
});
