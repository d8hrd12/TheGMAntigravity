import { simulateEuroMatch } from '../src/features/simulation/euro/EuroMatchEngine';
import { Player } from '../src/models/Player';
import { Team } from '../src/models/Team';

const mockPlayer = (id: string, pos: string, attr: number): Player => ({
  id,
  firstName: 'Player',
  lastName: id,
  position: pos,
  age: 25,
  attributes: {
    finishing: attr, midRange: attr, threePointShot: attr,
    freeThrow: attr, playmaking: attr, ballHandling: attr,
    offensiveRebound: attr, defensiveRebound: attr,
    interiorDefense: attr, perimeterDefense: attr,
    stealing: attr, blocking: attr, athleticism: attr,
    basketballIQ: attr, stamina: 100
  },
  salary: 1000000,
  years: 1,
  teamId: 'T1'
});

const homeRoster = [
    mockPlayer('H1', 'PG', 85),
    mockPlayer('H2', 'SG', 80),
    mockPlayer('H3', 'SF', 80),
    mockPlayer('H4', 'PF', 80),
    mockPlayer('H5', 'C', 80),
    mockPlayer('H6', 'PG', 70),
    mockPlayer('H7', 'SG', 70),
    mockPlayer('H8', 'SF', 70),
    mockPlayer('H9', 'PF', 70),
    mockPlayer('H10', 'C', 70),
];

const awayRoster = homeRoster.map(p => ({ ...p, id: p.id.replace('H', 'A'), teamId: 'T2' }));

const homeTeam: Team = { id: 'T1', name: 'Home', city: 'City', abbreviation: 'HOM', conference: 'EuroLeague', division: 'A', wins: 0, losses: 0, cash: 10000000, rosterIds: [], logo: '' };
const awayTeam: Team = { id: 'T2', name: 'Away', city: 'City', abbreviation: 'AWY', conference: 'EuroLeague', division: 'A', wins: 0, losses: 0, cash: 10000000, rosterIds: [], logo: '' };

const result = simulateEuroMatch({
    homeTeam, awayTeam, homeRoster, awayRoster,
    date: new Date(),
    leagueType: 'EURO'
});

console.log("FINAL SCORE:", result.homeScore, "-", result.awayScore);
const homeStats = Object.values(result.boxScore.homeStats);
console.log("TOP 5 SCORERS (HOME):");
homeStats.sort((a,b) => b.points - a.points).slice(0, 5).forEach(s => {
    console.log(`${s.name}: ${s.points} pts (${s.fgMade}/${s.fgAttempted} FG) | Blocks: ${s.blocks} | in ${s.minutes}m`);
});
