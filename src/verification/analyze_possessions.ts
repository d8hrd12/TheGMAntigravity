import { simulateMatchII } from "../features/simulation/MatchEngineII";
import { generatePlayer } from "../features/player/playerGenerator";
import { Team } from "../models/Team";

function createTeam(id: string, name: string, pace: 'Seven Seconds' | 'Very Slow' | 'Normal', offRating: number, defRating: number): Team {
    return {
        id, name, city: 'City', abbreviation: id, conference: 'West', colors: { primary: '#000', secondary: '#fff' },
        salaryCapSpace: 0, cash: 0, debt: 0, fanInterest: 1, ownerPatience: 50, marketSize: 'Medium', draws: 0,
        rosterIds: [], wins: 0, losses: 0, history: [], draftPicks: [], financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }, rivalIds: [],
        tactics: { pace, offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
    };
}

const fastTeam1 = createTeam('FAST1', 'Fast 1', 'Seven Seconds', 95, 70);
const slowTeam1 = createTeam('SLOW1', 'Slow 1', 'Very Slow', 70, 95);
const normalTeam1 = createTeam('NORM1', 'Normal 1', 'Normal', 80, 80);

const generateRoster = (tid: string, isFast: boolean) => {
    const r = Array.from({ length: 10 }, () => generatePlayer(undefined, 'starter'));
    r.forEach(p => {
        p.teamId = tid;
        if (isFast) {
            p.attributes.athleticism = 90; p.attributes.threePointShot = 85; p.attributes.finishing = 90;
        } else {
            p.attributes.athleticism = 60; p.attributes.interiorDefense = 85; p.attributes.finishing = 70;
        }
    });
    return r;
};

const runSim = (t1: Team, t2: Team, isFast1: boolean, isFast2: boolean) => {
    let pts1 = 0, pts2 = 0, poss = 0;
    const rounds = 5;
    for (let i = 0; i < rounds; i++) {
        const res = simulateMatchII({
            homeTeam: t1, awayTeam: t2, homeRoster: generateRoster(t1.id, isFast1), awayRoster: generateRoster(t2.id, isFast2),
            date: new Date(), isInteractive: false,
            homeCoach: { rating: { offense: 90, defense: 90 } } as any,
            awayCoach: { rating: { offense: 90, defense: 90 } } as any
        });
        pts1 += res.homeScore;
        pts2 += res.awayScore;
        poss += res.events.filter(e => e.type === 'possession_start').length;
    }
    return { pts1: pts1 / rounds, pts2: pts2 / rounds, poss: poss / rounds };
};

console.log('Fast vs Fast:', runSim(fastTeam1, { ...fastTeam1, id: 'FAST2' }, true, true));
console.log('Normal vs Normal:', runSim(normalTeam1, { ...normalTeam1, id: 'NORM2' }, false, false));
console.log('Slow vs Slow:', runSim(slowTeam1, { ...slowTeam1, id: 'SLOW2' }, false, false));
