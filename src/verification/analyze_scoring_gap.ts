import { simulateMatchII } from "../features/simulation/MatchEngineII";
import { generatePlayer } from "../features/player/playerGenerator";
import { Team } from "../models/Team";

function createTeam(id: string, name: string, pace: 'Seven Seconds' | 'Very Slow', offRating: number, defRating: number): Team {
    return {
        id, name, city: 'City', abbreviation: id, conference: 'West', colors: {primary: '#000', secondary: '#fff'},
        salaryCapSpace: 0, cash: 0, debt: 0, fanInterest: 1, ownerPatience: 50, marketSize: 'Medium', draws: 0,
        rosterIds: [], wins: 0, losses: 0, history: [], draftPicks: [], financials: {totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: []}, rivalIds: [],
        tactics: { pace, offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
    };
}

const fastTeam1 = createTeam('FAST1', 'Fast 1', 'Seven Seconds', 95, 70);
const fastTeam2 = createTeam('FAST2', 'Fast 2', 'Seven Seconds', 95, 70);
const slowTeam1 = createTeam('SLOW1', 'Slow 1', 'Very Slow', 70, 95);
const slowTeam2 = createTeam('SLOW2', 'Slow 2', 'Very Slow', 70, 95);

const generateFastRoster = (tid: string) => {
    const r = Array.from({length: 10}, () => generatePlayer(undefined, 'starter'));
    r.forEach(p => { p.teamId = tid; p.attributes.athleticism = 90; p.attributes.threePointShot = 85; p.attributes.finishing = 90; });
    return r;
};
const generateSlowRoster = (tid: string) => {
    const r = Array.from({length: 10}, () => generatePlayer(undefined, 'starter'));
    r.forEach(p => { p.teamId = tid; p.attributes.athleticism = 60; p.attributes.interiorDefense = 85; p.attributes.finishing = 70; });
    return r;
};

let fastPts = 0, slowPts = 0;
for(let i=0; i<5; i++) {
    const res = simulateMatchII({
        homeTeam: fastTeam1, awayTeam: slowTeam1, homeRoster: generateFastRoster('FAST1'), awayRoster: generateSlowRoster('SLOW1'),
        date: new Date(), isInteractive: false,
        homeCoach: { rating: { offense: 90, defense: 70 } } as any,
        awayCoach: { rating: { offense: 70, defense: 90 } } as any
    });
    fastPts += res.homeScore;
    slowPts += res.awayScore;
}
console.log(`Avg: Fast ${fastPts/5} - Slow ${slowPts/5}`);

let f2fPtsHome = 0, f2fPtsAway = 0;
for(let i=0; i<5; i++) {
    const res = simulateMatchII({
        homeTeam: fastTeam1, awayTeam: fastTeam2, homeRoster: generateFastRoster('FAST1'), awayRoster: generateFastRoster('FAST2'),
        date: new Date(), isInteractive: false,
        homeCoach: { rating: { offense: 90, defense: 70 } } as any,
        awayCoach: { rating: { offense: 90, defense: 70 } } as any
    });
    f2fPtsHome += res.homeScore;
    f2fPtsAway += res.awayScore;
}
console.log(`Fast vs Fast Avg: ${f2fPtsHome/5} - ${f2fPtsAway/5}`);

let s2sPtsHome = 0, s2sPtsAway = 0;
for(let i=0; i<5; i++) {
    const res = simulateMatchII({
        homeTeam: slowTeam1, awayTeam: slowTeam2, homeRoster: generateSlowRoster('SLOW1'), awayRoster: generateSlowRoster('SLOW2'),
        date: new Date(), isInteractive: false,
        homeCoach: { rating: { offense: 70, defense: 90 } } as any,
        awayCoach: { rating: { offense: 70, defense: 90 } } as any
    });
    s2sPtsHome += res.homeScore;
    s2sPtsAway += res.awayScore;
}
console.log(`Slow vs Slow Avg: ${s2sPtsHome/5} - ${s2sPtsAway/5}`);
