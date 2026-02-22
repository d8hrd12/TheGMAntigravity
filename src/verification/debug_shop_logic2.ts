import { getPlayerTradeValue, getTeamDirection, getTradingBlock, evaluateTrade, getPackageValue } from '../features/trade/TradeLogic';
import { generatePlayer } from '../features/player/playerGenerator';
import { Team } from '../models/Team';

// Mock Teams
const bucks: Team = {
    id: 'MIL', name: 'Bucks', city: 'Milwaukee', abbreviation: 'MIL', conference: 'East',
    colors: { primary: '#00471B', secondary: '#F0EBD2' }, salaryCapSpace: 0, cash: 0, debt: 0, fanInterest: 1, ownerPatience: 50, marketSize: 'Medium', draws: 0,
    rosterIds: [], wins: 0, losses: 0, history: [], draftPicks: [], financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }, rivalIds: [], tactics: { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
};

const heat: Team = {
    id: 'MIA', name: 'Heat', city: 'Miami', abbreviation: 'MIA', conference: 'East',
    colors: { primary: '#98002E', secondary: '#F9A01B' }, salaryCapSpace: 0, cash: 0, debt: 0, fanInterest: 1, ownerPatience: 50, marketSize: 'Medium', draws: 0,
    rosterIds: [], wins: 30, losses: 10, history: [], draftPicks: [], financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }, rivalIds: [], tactics: { pace: 'Normal', offensiveFocus: 'Balanced', defense: 'Man-to-Man' }
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
const bam = generatePlayer(undefined, 'starter'); bam.teamId = heat.id; bam.overall = 87; bam.age = 26; bam.firstName = 'Bam'; allPlayers.push(bam);
const tyler = generatePlayer(undefined, 'starter'); tyler.teamId = heat.id; tyler.overall = 83; tyler.age = 23; tyler.firstName = 'Tyler'; allPlayers.push(tyler);
const jaquez = generatePlayer(undefined, 'bench'); jaquez.teamId = heat.id; jaquez.overall = 78; jaquez.age = 22; jaquez.firstName = 'Jaquez'; allPlayers.push(jaquez);
const jovic = generatePlayer(undefined, 'bench'); jovic.teamId = heat.id; jovic.overall = 82; jovic.age = 20; jovic.firstName = 'Jovic'; allPlayers.push(jovic);
for (let i = 0; i < 8; i++) {
    const p = generatePlayer(undefined, 'bench'); p.teamId = heat.id; p.overall = 72; p.age = 25 + i; p.firstName = 'Role'; allPlayers.push(p);
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

const heatRoster = allPlayers.filter(p => p.teamId === heat.id);
const heatDir = getTeamDirection(heat, heatRoster);
const heatBlock = getTradingBlock(heat, heatRoster, heatDir);
const valueToDistribute = getPlayerTradeValue(giannis, heat, contracts, heatRoster);

console.log(`Heat Direction: ${heatDir}`);
console.log(`Giannis Value to Heat: ${valueToDistribute}`);
console.log(`Heat Untouchables: ${heatBlock.untouchables.map(p => p.firstName).join(', ')}`);

const heatAssetsScored = heatRoster.map(p => {
    return { player: p, value: getPlayerTradeValue(p, heat, contracts, heatRoster.filter(r => r.id !== p.id)) };
}).sort((a, b) => b.value - a.value);

let proposedAiPlayers = [];
let currentOfferValue = 0;
const maxPackageRatio = valueToDistribute > 140 ? 1.30 : 1.15;
for (const asset of heatAssetsScored) {
    if (proposedAiPlayers.length >= 3) break;
    if (asset.value > valueToDistribute * 1.2) continue;
    if (currentOfferValue + asset.value > valueToDistribute * maxPackageRatio) continue;

    if (asset.player.overall > 90 + 5 && heatDir !== 'Rebuilding') continue;
    if (asset.player.overall >= 88 && 90 < 85) continue;

    proposedAiPlayers.push(asset.player);
    currentOfferValue += asset.value;
}

console.log(`Proposed AI Players: ${proposedAiPlayers.map(p => p.firstName).join(', ')}`);
console.log(`Current Offer Value: ${currentOfferValue}`);

const aiBundle = { players: proposedAiPlayers, picks: [] };
const userBundle = { players: [giannis], picks: [] };

const valReceived = getPackageValue(userBundle, heat, contracts, heatRoster.filter(p => !aiBundle.players.includes(p)), 2024);
const valGiven = getPackageValue(aiBundle, heat, contracts, heatRoster.filter(p => !aiBundle.players.includes(p)), 2024);
const ratio = valReceived / (valGiven || 1);
console.log(`Val Received: ${valReceived}, Val Given: ${valGiven}, Ratio: ${ratio}`);

const evaluation = evaluateTrade(
    heat,
    aiBundle,
    bucks,
    userBundle,
    [heat, bucks],
    allPlayers,
    2024,
    contracts,
    140000000
);

console.log('Evaluation:', evaluation);
