import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { calculateTeamCapSpace } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars } from '../../utils/starUtils';
import type { TradeProposal } from '../../models/TradeProposal';
import type { AI_GM } from '../../models/AI_GM';

// ----------------------------------------------------------------------------
// 1. CORE PHILOSOPHY: TEAM STATES & NEEDS
// ----------------------------------------------------------------------------

export type TeamDirection = 'Contender' | 'PlayoffTeam' | 'Young_Developing' | 'Rebuilding';
export type TeamState = 'Contender' | 'PlayoffTeam' | 'Retooling' | 'Rebuilding';

export interface TradingBlock {
    needs: string[];
    assets: Player[]; // Players they want to move
    untouchables: Player[]; // Players they won't move
    willingToTradePicks: boolean;
}

export function getTeamDirection(team: Team, roster: Player[]): TeamDirection {
    const totalGames = (team.wins || 0) + (team.losses || 0);
    const winPct = totalGames > 0 ? (team.wins || 0) / totalGames : 0.5;

    // 1. Identify Core
    const top3 = roster.sort((a, b) => (b.overall || 0) - (a.overall || 0)).slice(0, 3);
    const avgAgeTop3 = top3.reduce((sum, p) => sum + p.age, 0) / 3;
    const hasSuperstar = top3.some(p => (p.overall || 0) >= 90);

    // 2. Classification Logic
    if (winPct >= 0.60 && hasSuperstar) return 'Contender';
    if (winPct >= 0.45) {
        if (avgAgeTop3 < 25) return 'Young_Developing';
        return 'PlayoffTeam';
    }
    if (avgAgeTop3 < 24) return 'Young_Developing';

    return 'Rebuilding';
}

export function getTeamState(team: Team): TeamState {
    const dir = team.strategy?.direction;
    if (dir === 'Contender') return 'Contender';
    if (dir === 'PlayoffTeam') return 'PlayoffTeam';
    if (dir === 'Rebuilding') return 'Rebuilding';
    return 'Retooling';
}

export function getTradingBlock(team: Team, roster: Player[], direction: TeamDirection, gm?: AI_GM): TradingBlock {
    const assets: Player[] = [];
    const untouchables: Player[] = [];
    const needs: string[] = [];
    let willingToTradePicks = false;

    // define untouchables first
    const depthChart: Record<string, Player[]> = { 'PG': [], 'SG': [], 'SF': [], 'PF': [], 'C': [] };
    roster.forEach(p => { if (depthChart[p.position]) depthChart[p.position].push(p); });

    roster.forEach(p => {
        const stars = calculateStars(p.overall || calculateOverall(p), 75);
        
        // Find rank at position
        const playersAtPos = depthChart[p.position].sort((a, b) => (b.overall || 0) - (a.overall || 0));
        const rank = playersAtPos.findIndex(x => x.id === p.id);

        // GM PHILOSOPHY INFLUENCE
        let youthThreshold = 4.2;
        if (gm?.philosophy === 'Youth') youthThreshold = 3.8; // More protective of youth
        if (gm?.philosophy === 'Win Now') youthThreshold = 4.5; // Less protective of youth

        const isCornerstone = (stars >= 4.7) || (stars >= youthThreshold && p.age < 25) || (stars >= 3.8 && p.age < 22);

        if (isCornerstone && rank < 2) {
            untouchables.push(p);
        } else if (isCornerstone && rank >= 2) {
            assets.push(p);
        }
    });

    switch (direction) {
        case 'Contender':
            needs.push('Veterans', 'Shooters', 'Defenders', 'Win Now');
            willingToTradePicks = true;
            assets.push(...roster.filter(p => !untouchables.includes(p) && p.age < 24 && (p.overall || 0) < 78));
            break;

        case 'PlayoffTeam':
            needs.push('Upgrade Starter', 'Depth');
            willingToTradePicks = true;
            break;

        case 'Young_Developing':
            needs.push('Young Talent', 'Draft Picks', 'Development Minutes');
            willingToTradePicks = false;
            assets.push(...roster.filter(p => p.age > 26 && !untouchables.includes(p)));
            break;

        case 'Rebuilding':
            needs.push('Draft Picks', 'Bad Contracts (for assets)', 'Young High Potential');
            willingToTradePicks = false;
            assets.push(...roster.filter(p => {
                const ovr = p.overall || calculateOverall(p);
                if (untouchables.includes(p)) return false;
                if (ovr >= 90 && p.age < 33 && !p.tradeRequested) return false; 
                return p.age > 26 && ovr > 72;
            }));
            break;
    }

    Object.keys(depthChart).forEach(pos => {
        if (depthChart[pos].length > 3) {
            assets.push(...depthChart[pos].slice(3).filter(p => !untouchables.includes(p)));
        }
    });

    const uniqueAssets = Array.from(new Set(assets)).slice(0, 5);
    return { needs, assets: uniqueAssets, untouchables, willingToTradePicks };
}

export function getPlayerTradeValue(
    player: Player,
    receivingTeam: Team | null | undefined,
    contracts: Contract[],
    roster: Player[],
    gm?: AI_GM
): number {
    const teamDirection = receivingTeam ? getTeamDirection(receivingTeam, roster) : 'PlayoffTeam';
    const currentOvr = player.overall || calculateOverall(player);
    const potential = player.potential || 70;
    const contract = contracts.find(c => c.playerId === player.id);
    const yearsLeft = contract ? contract.yearsLeft : 0;
    const amount = contract ? contract.amount : 0;

    let value = currentOvr;
    const stars = calculateStars(currentOvr, 75);

    if (stars >= 5.0) value *= 5.0;
    else if (stars >= 4.5) value *= 3.5;
    else if (stars >= 4.0) value *= 2.0;
    else if (stars >= 3.5) value *= 1.2;

    switch (teamDirection) {
        case 'Rebuilding':
        case 'Young_Developing':
            if (player.age <= 23) value *= 1.4;
            if (player.age <= 21) value *= 1.2;
            if (potential >= 85) value += (potential - 70) * 0.8;
            const agePenaltyFactor = stars >= 4.2 ? 0.90 : 0.6;
            if (player.age >= 29) value *= agePenaltyFactor;
            if (player.age >= 32) value *= (stars >= 4.5 ? 0.75 : 0.4);
            if (yearsLeft > 2 && amount > 25000000 && stars < 4.0) value *= 0.6;
            break;

        case 'Contender':
            if (stars >= 4.5) value *= 1.5;
            if (stars >= 4.0) value *= 1.2;
            if (player.age >= 31) value *= 1.3;
            break;
    }

    if (gm) {
        if (gm.skills.drafting > 80 && player.age < 22) value *= 1.1;
    }

    return value;
}

export function getDraftPickValue(pick: DraftPick, currentYear: number, receivingTeam: Team, gm?: AI_GM, allTeams: Team[] = []): number {
    const yearDiff = pick.year - currentYear;
    let baseValue = pick.round === 1 ? 60 : 15;

    if (yearDiff === 0 && pick.round === 1) {
        const origTeam = allTeams.find(t => t.id === pick.originalTeamId);
        if (origTeam) {
            const wins = origTeam.wins || 0;
            const losses = origTeam.losses || 0;
            const total = wins + losses;
            const winPct = total > 0 ? wins / total : 0.5;
            if (winPct < 0.35) baseValue = 100;
            else if (winPct < 0.45) baseValue = 85;
            else if (winPct > 0.60) baseValue = 40;
        }
    }

    let value = baseValue / (1 + yearDiff * 0.2);

    if (gm?.philosophy === 'Youth') value *= 1.2;
    if (gm?.philosophy === 'Win Now') value *= 0.8;

    return value;
}

export interface TradeAssetBundle {
    players: Player[];
    picks: DraftPick[];
}

export function getPackageValue(
    bundle: TradeAssetBundle,
    valuingTeam: Team,
    contracts: Contract[],
    roster: Player[],
    currentYear: number,
    allTeams: Team[],
    gm?: AI_GM
): number {
    let totalValue = 0;
    bundle.players.forEach(p => {
        totalValue += getPlayerTradeValue(p, valuingTeam, contracts, roster, gm);
    });
    bundle.picks.forEach(p => {
        totalValue += getDraftPickValue(p, currentYear, valuingTeam, gm, allTeams);
    });
    return totalValue;
}

export interface TradeResult {
    accepted: boolean;
    message: string;
    ratio?: number;
}

export function evaluateTrade(
    userTeam: Team,
    userAssets: TradeAssetBundle,
    aiTeam: Team,
    aiAssets: TradeAssetBundle,
    allTeams: Team[],
    allPlayers: Player[],
    currentYear: number,
    contracts: Contract[],
    salaryCap: number,
    gms?: AI_GM[]
): TradeResult {
    if (userAssets.players.length === 0 && userAssets.picks.length === 0 && aiAssets.players.length === 0 && aiAssets.picks.length === 0) {
        return { accepted: false, message: "Use the selection boxes to add assets." };
    }

    const getAssetsSalary = (assets: TradeAssetBundle) => assets.players.reduce((sum, p) => sum + (contracts.find(c => c.playerId === p.id)?.amount || 0), 0);
    const userOutgoing = getAssetsSalary(userAssets);
    const aiOutgoing = getAssetsSalary(aiAssets);

    const checkFinance = (team: Team, inSal: number, outSal: number) => {
        const space = calculateTeamCapSpace(team, contracts, salaryCap);
        const postTradeSpace = space + outSal - inSal;
        return postTradeSpace >= 0 || inSal <= (outSal * 1.25) + 5000000;
    };

    if (!checkFinance(userTeam, aiOutgoing, userOutgoing)) return { accepted: false, message: "Salary cap validation failed for your team." };
    if (!checkFinance(aiTeam, userOutgoing, aiOutgoing)) return { accepted: false, message: "The other team cannot afford this trade." };

    const aiRoster = allPlayers.filter(p => p.teamId === aiTeam.id);
    const aiDirection = getTeamDirection(aiTeam, aiRoster);
    const aiGm = gms?.find(g => g.id === aiTeam.gmId);
    const block = getTradingBlock(aiTeam, aiRoster, aiDirection, aiGm);

    if (aiAssets.players.find(p => block.untouchables.some(u => u.id === p.id))) {
        return { accepted: false, message: "We aren't trading our franchise cornerstone." };
    }

    const aiRosterPost = aiRoster.filter(p => !aiAssets.players.find(ap => ap.id === p.id));
    const valueReceived = getPackageValue(userAssets, aiTeam, contracts, aiRosterPost, currentYear, allTeams, aiGm);
    const valueGiven = getPackageValue(aiAssets, aiTeam, contracts, aiRosterPost, currentYear, allTeams, aiGm);

    let ratio = valueReceived / (valueGiven || 1);
    let requiredRatio = 1.05;
    
    if (aiGm) {
        requiredRatio += (aiGm.skills.trading - 50) / 200; // Skillful GMs want more value
    }

    if (aiDirection === 'Rebuilding') {
        if (!userAssets.players.some(p => p.age < 24) && userAssets.picks.length === 0) {
            return { accepted: false, message: "We need picks or young prospects." };
        }
    }

    if (ratio >= requiredRatio) return { accepted: true, message: "Deal. Pleasure doing business." };
    return { accepted: false, message: ratio > 0.9 ? "Very close... can you add a sweetener?" : "This doesn't make sense for our team." };
}

export function suggestTradePackage(
    userTeam: Team,
    aiTeam: Team,
    desiredAssets: TradeAssetBundle,
    allPlayers: Player[],
    contracts: Contract[],
    currentYear: number,
    salaryCap: number,
    allTeams: Team[],
    gms?: AI_GM[]
): TradeProposal | null {
    const aiRoster = allPlayers.filter(p => p.teamId === aiTeam.id);
    const aiGm = gms?.find(g => g.id === aiTeam.gmId);
    const valueToMatch = getPackageValue(desiredAssets, aiTeam, contracts, aiRoster, currentYear, allTeams, aiGm);
    const targetValue = valueToMatch * 1.1;

    const userRoster = allPlayers.filter(p => p.teamId === userTeam.id);
    let available: { asset: any, value: number, type: 'player' | 'pick' }[] = [];

    userRoster.forEach(p => {
        const val = getPlayerTradeValue(p, aiTeam, contracts, aiRoster, aiGm);
        if (val > 0) available.push({ asset: p, value: val, type: 'player' });
    });
    userTeam.draftPicks.forEach(pick => {
        const val = getDraftPickValue(pick, currentYear, aiTeam, aiGm, allTeams);
        if (val > 0) available.push({ asset: pick, value: val, type: 'pick' });
    });

    available.sort((a, b) => b.value - a.value);
    let current = 0;
    let selected: any[] = [];
    for (const item of available) {
        if (selected.length >= 4) break;
        selected.push(item);
        current += item.value;
        if (current >= targetValue) break;
    }

    if (current >= targetValue * 0.9) {
        return {
            userPlayerIds: selected.filter(i => i.type === 'player').map(i => i.asset.id),
            userPickIds: selected.filter(i => i.type === 'pick').map(i => i.asset.id),
            aiPlayerIds: desiredAssets.players.map(p => p.id),
            aiPickIds: desiredAssets.picks.map(p => p.id),
            aiTeamId: aiTeam.id,
            status: 'pending'
        };
    }
    return null;
}

export function generateTradeOffers(
    userTeam: Team,
    shopPlayerId: string,
    allTeams: Team[],
    players: Player[],
    contracts: Contract[],
    picks: DraftPick[],
    salaryCap: number,
    currentYear: number,
    gms?: AI_GM[]
): TradeProposal[] {
    const shopPlayer = players.find(p => p.id === shopPlayerId);
    if (!shopPlayer) return [];
    const offers: TradeProposal[] = [];

    for (const aiTeam of allTeams.filter(t => t.id !== userTeam.id && t.id !== '31')) {
        const aiGm = gms?.find(g => g.id === aiTeam.gmId);
        const aiRoster = players.filter(p => p.teamId === aiTeam.id);
        const val = getPlayerTradeValue(shopPlayer, aiTeam, contracts, aiRoster, aiGm);
        if (val < 10) continue;

        const aiAssets = aiRoster.filter(p => p.overall < (shopPlayer.overall || 75)).slice(0, 2);
        if (aiAssets.length > 0) {
            offers.push({
                userPlayerIds: [shopPlayerId],
                userPickIds: [],
                aiPlayerIds: aiAssets.map(p => p.id),
                aiPickIds: [],
                aiTeamId: aiTeam.id,
                status: 'pending'
            });
        }
    }
    return offers;
}

export function validateTradeProposal(proposal: TradeProposal, players: Player[], picks: DraftPick[]): boolean {
    // 1. Check user players
    for (const id of proposal.userPlayerIds) {
        const p = players.find(x => x.id === id);
        if (!p || !p.teamId) return false; // Must be on a team
    }

    // 2. Check AI players
    for (const id of proposal.aiPlayerIds) {
        const p = players.find(x => x.id === id);
        if (!p || p.teamId !== proposal.aiTeamId) return false; // Must be on the specified AI team
    }

    // 3. Check picks
    const allPickIds = [...proposal.userPickIds, ...proposal.aiPickIds];
    for (const id of allPickIds) {
        const pick = picks.find(x => x.id === id);
        if (!pick) return false;
    }

    return true;
}
