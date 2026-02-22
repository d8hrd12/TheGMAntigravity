import { generateTradeOffers, getPlayerTradeValue } from '../features/trade/TradeLogic';
import { generatePlayer } from '../features/player/playerGenerator';
import { Team } from '../models/Team';

// Mock Teams
const bucks: Team = {
    id: 'MIL', name: 'Bucks', city: 'Milwaukee', abbreviation: 'MIL', conference: 'East',
    colors: { primary: '#00471B', secondary: '#F0EBD2' }, salaryCapSpace: 0, cash: 0, debt: 0, fanInterest: 1, ownerPatience: 50, marketSize: 'Medium', draws: 0,
    rosterIds: [], wins: 0, losses: 0, history: [], draftPicks: [], financials: {totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: []}, rivalIds: [], tactics: { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
};

const heat: Team = {
    id: 'MIA', name: 'Heat', city: 'Miami', abbreviation: 'MIA', conference: 'East',
    colors: { primary: '#98002E', secondary: '#F9A01B' }, salaryCapSpace: 0, cash: 0, debt: 0, fanInterest: 1, ownerPatience: 50, marketSize: 'Medium', draws: 0,
    rosterIds: [], wins: 30, losses: 10, history: [], draftPicks: [], financials: {totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: []}, rivalIds: [], tactics: { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
};

const pistons: Team = {
    id: 'DET', name: 'Pistons', city: 'Detroit', abbreviation: 'DET', conference: 'East',
    colors: { primary: '#C8102E', secondary: '#1D42BA' }, salaryCapSpace: 0, cash: 0, debt: 0, fanInterest: 1, ownerPatience: 50, marketSize: 'Medium', draws: 0,
    rosterIds: [], wins: 10, losses: 30, history: [], draftPicks: [], financials: {totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: []}, rivalIds: [], tactics: { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
};

// Mock Players
const allPlayers = [];
const giannis = generatePlayer(undefined, 'starter');
giannis.id = 'giannis';
giannis.firstName = 'Giannis';
giannis.overall = 90;
giannis.teamId = bucks.id;
giannis.age = 28;
allPlayers.push(giannis);

// Fill Heat (Contender)
const bam = generatePlayer(undefined, 'starter'); bam.teamId = heat.id; bam.overall = 87; bam.age = 26; allPlayers.push(bam);
const tyler = generatePlayer(undefined, 'starter'); tyler.teamId = heat.id; tyler.overall = 83; tyler.age = 23; allPlayers.push(tyler);
const jaquez = generatePlayer(undefined, 'bench'); jaquez.teamId = heat.id; jaquez.overall = 78; jaquez.age = 22; allPlayers.push(jaquez);
const jovic = generatePlayer(undefined, 'bench'); jovic.teamId = heat.id; jovic.overall = 75; jovic.age = 20; allPlayers.push(jovic);
for(let i=0; i<8; i++) {
    const p = generatePlayer(undefined, 'bench'); p.teamId = heat.id; p.overall = 72; p.age = 25+i; allPlayers.push(p);
}


// Fill Pistons (Rebuilding)
const cade = generatePlayer(undefined, 'starter'); cade.teamId = pistons.id; cade.overall = 85; cade.age = 22; allPlayers.push(cade);
const ivey = generatePlayer(undefined, 'starter'); ivey.teamId = pistons.id; ivey.overall = 81; ivey.age = 21; allPlayers.push(ivey);
const duren = generatePlayer(undefined, 'bench'); duren.teamId = pistons.id; duren.overall = 80; duren.age = 20; allPlayers.push(duren);
const bagley = generatePlayer(undefined, 'bench'); bagley.teamId = pistons.id; bagley.overall = 76; bagley.age = 24; allPlayers.push(bagley);
for(let i=0; i<8; i++) {
    const p = generatePlayer(undefined, 'bench'); p.teamId = pistons.id; p.overall = 72; p.age = 25+i; allPlayers.push(p);
}


const contracts = allPlayers.map(p => ({
    id: 'c_' + p.id,
    playerId: p.id,
    teamId: p.teamId,
    amount: (p.level === 'starter' || p.overall > 80) ? 20000000 : 5000000,
    years: 3,
    startYear: 2024,
    type: 'standard' as any,
    perks: []
}));

const offers = generateTradeOffers(
    bucks,
    giannis.id,
    [bucks, heat, pistons],
    allPlayers,
    contracts,
    [],
    140000000,
    2024
);

console.log(`Pistons Asset Value (Cade): ${getPlayerTradeValue(cade, bucks, contracts, allPlayers.filter(p => p.teamId === bucks.id))}`);
console.log(`Giannis Value (To Pistons): ${getPlayerTradeValue(giannis, pistons, contracts, allPlayers.filter(p => p.teamId === pistons.id))}`);
console.log(`Giannis Value (To Heat): ${getPlayerTradeValue(giannis, heat, contracts, allPlayers.filter(p => p.teamId === heat.id))}`);
console.log(`Generated Offers: ${offers.length}`);
if (offers.length > 0) {
    console.log(JSON.stringify(offers, null, 2));
}

