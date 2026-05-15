import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { evaluateTrade, getPlayerTradeValue, getDraftPickValue, getTeamDirection, getTradingBlock } from './TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';
import { generateUUID } from '../../utils/uuid';
import type { TradeProposal } from '../../models/TradeProposal';
import { 
    calculateEuroBuyoutFee, 
    isEuroPlayerUntouchable, 
    calculateEuroTeamNeeds, 
    calculatePlayerFitScore, 
    determineEuroTeamTarget,
    calculatePanicTrigger
} from '../team/EuroAIGMModule';
import { negotiateEuroBuyout } from './logic/EuroNegotiationAI';
import type { AI_GM } from '../../models/AI_GM';
import type { NBAEuroProspect } from '../league/NBAEuroPoolModule';

export type { TradeProposal };

export interface SimulatedTradeProposal {
    proposerId: string;
    targetTeamId: string;
    proposerAssets: { players: Player[], picks: DraftPick[] };
    targetAssets: { players: Player[], picks: DraftPick[] };
    transferFee?: number;
    isSigning?: boolean;
    reason?: string;
    metadata?: any;
}

export const simulateDailyTrades = (
    teams: Team[],
    players: Player[],
    contracts: Contract[],
    currentYear: number,
    salaryCap: number,
    tradeHistory: any[],
    currentDate: Date,
    seasonStartDate: Date,
    userTeamId?: string,
    aiGms?: AI_GM[]
): SimulatedTradeProposal | null => {
    // 1. FREQUENCY CONTROL
    const msPerDay = 86400000;
    const daysPassed = Math.floor((currentDate.getTime() - seasonStartDate.getTime()) / msPerDay);
    if (daysPassed < 15 || daysPassed > 120) return null;

    const isDeadlineWeek = daysPassed > 110 && daysPassed <= 120;
    const baseChance = isDeadlineWeek ? 0.45 : 0.09; // Increased from 0.35/0.05

    if (Math.random() > baseChance) return null;

    // Attempt Loop
    const ATTEMPTS = 15;
    for (let i = 0; i < ATTEMPTS; i++) {
        const eligibleTeams = teams.filter(t => t.id !== userTeamId);
        const proposer = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];
        if (!proposer) continue;

        const targetTeam = eligibleTeams.filter(t => t.id !== proposer.id)[Math.floor(Math.random() * (eligibleTeams.length - 1))];
        if (!targetTeam) continue;

        const proposerRoster = players.filter(p => p.teamId === proposer.id);
        const targetRoster = players.filter(p => p.teamId === targetTeam.id);

        const proposerGm = aiGms?.find(g => g.id === proposer.gmId);
        const targetGm = aiGms?.find(g => g.id === targetTeam.gmId);

        const propDirection = getTeamDirection(proposer, proposerRoster);
        const targetDirection = getTeamDirection(targetTeam, targetRoster);

        const propBlock = getTradingBlock(proposer, proposerRoster, propDirection, proposerGm);
        const targetBlock = getTradingBlock(targetTeam, targetRoster, targetDirection, targetGm);

        if (propBlock.assets.length === 0 || targetBlock.assets.length === 0) continue;

        // DIRECTION-AWARE TARGETING
        // Contenders want veterans; Rebuilders want picks + youth
        let targetAssetPlayer: Player | undefined;
        if (propDirection === 'Contender' || propDirection === 'PlayoffTeam') {
            // Target the best player on the other team that fits their need
            targetAssetPlayer = targetBlock.assets.sort((a, b) =>
                (b.overall || 0) - (a.overall || 0)
            )[0];
        } else {
            // Rebuilder: target young + high potential from other team
            const youngAssets = targetBlock.assets.filter(p => p.age <= 25);
            targetAssetPlayer = youngAssets.length > 0
                ? youngAssets.sort((a, b) => (b.potential || 0) - (a.potential || 0))[0]
                : targetBlock.assets[0];
        }
        if (!targetAssetPlayer) continue;

        // BUILD MULTI-ASSET PACKAGE TO MATCH VALUE
        const targetPlayerValue = getPlayerTradeValue(targetAssetPlayer, proposer, contracts, proposerRoster, proposerGm);
        const requiredValue = targetPlayerValue * 1.05;

        // Assemble proposer's package: players + picks
        const packagePlayers: Player[] = [];
        const packagePicks: DraftPick[] = [];
        let packageValue = 0;

        // Candidate assets from proposer (filtered by trading block)
        const candidatePlayers = propBlock.assets
            .map(p => ({ player: p, value: getPlayerTradeValue(p, targetTeam, contracts, targetRoster, targetGm) }))
            .sort((a, b) => b.value - a.value);

        const candidatePicks = propBlock.willingToTradePicks
            ? (proposer.draftPicks || [])
                .map(pk => ({ pick: pk, value: getDraftPickValue(pk, currentYear, targetTeam, targetGm, teams) }))
                .sort((a, b) => b.value - a.value)
            : [];

        // Add players first (up to 2)
        for (const { player, value } of candidatePlayers) {
            if (packagePlayers.length >= 2) break;
            packagePlayers.push(player);
            packageValue += value;
            if (packageValue >= requiredValue) break;
        }

        // Add picks to make up value difference (up to 3)
        if (packageValue < requiredValue) {
            for (const { pick, value } of candidatePicks) {
                if (packagePicks.length >= 3) break;
                packagePicks.push(pick);
                packageValue += value;
                if (packageValue >= requiredValue) break;
            }
        }

        if (packagePlayers.length === 0 && packagePicks.length === 0) continue;

        const proposal = {
            proposerId: proposer.id,
            targetTeamId: targetTeam.id,
            proposerAssets: { players: packagePlayers, picks: packagePicks },
            targetAssets: { players: [targetAssetPlayer], picks: [] }
        };

        const result = evaluateTrade(
            proposer, proposal.proposerAssets, targetTeam, proposal.targetAssets,
            teams, players, currentYear, contracts, salaryCap, aiGms
        );

        if (result.accepted) return proposal;
    }

    return null;
};

export const generateAiTradeProposalForUser = (
    userTeamId: string,
    teams: Team[],
    players: Player[],
    contracts: Contract[],
    currentYear: number,
    salaryCap: number,
    aiGms?: AI_GM[]
): SimulatedTradeProposal | null => {
    const proposer = teams.filter(t => t.id !== userTeamId)[Math.floor(Math.random() * (teams.length - 1))];
    if (!proposer) return null;

    const userTeam = teams.find(t => t.id === userTeamId)!;
    const proposerRoster = players.filter(p => p.teamId === proposer.id);
    const userRoster = players.filter(p => p.teamId === userTeamId);
    
    const proposerGm = aiGms?.find(g => g.id === proposer.gmId);
    const propDirection = getTeamDirection(proposer, proposerRoster);
    const block = getTradingBlock(proposer, proposerRoster, propDirection, proposerGm);

    if (block.assets.length === 0) return null;

    const assetToGive = block.assets[0];
    const assetToGet = userRoster.sort((a, b) => b.overall - a.overall)[Math.floor(Math.random() * 3)];

    const proposal = {
        proposerId: proposer.id,
        targetTeamId: userTeamId,
        proposerAssets: { players: [assetToGive], picks: [] },
        targetAssets: { players: [assetToGet], picks: [] }
    };

    const result = evaluateTrade(
        proposer, proposal.proposerAssets, userTeam, proposal.targetAssets,
        teams, players, currentYear, contracts, salaryCap, aiGms
    );

    if (result.accepted) return proposal;
    return null;
};

export const simulateEuroDailyTransfers = (
    teams: Team[],
    players: Player[],
    contracts: Contract[],
    currentDate: Date,
    seasonStartDate: Date,
    userTeamId: string,
    aiGms?: AI_GM[],
    freeAgents: Player[] = [],
    nbaEuroPool: NBAEuroProspect[] = []
): SimulatedTradeProposal | null => {
    // 1. WINDOW CONTROL
    const msPerDay = 86400000;
    const daysPassed = Math.floor((currentDate.getTime() - seasonStartDate.getTime()) / msPerDay);
    if (daysPassed < 15 || daysPassed > 100) return null;

    // 15% daily probability
    if (Math.random() > 0.15) return null;

    const aiTeams = teams.filter(t => t.id !== userTeamId);
    if (aiTeams.length < 1) return null;

    // Pick a random proposer (Buyer)
    const buyer = aiTeams[Math.floor(Math.random() * aiTeams.length)];
    if (!buyer) return null;

    const buyerRoster = players.filter(p => p.teamId === buyer.id);
    const buyerTarget = determineEuroTeamTarget(buyer, buyerRoster);
    const buyerNeeds = calculateEuroTeamNeeds(buyer, buyerRoster);
    const panic = calculatePanicTrigger(buyer, buyerRoster);
    
    // --- PHASE 1: CHECK FREE AGENCY & NBA VETERANS FIRST ---
    const marketCandidates: { player: Player, score: number, type: 'FA' | 'NBA' }[] = [];

    // NBA Pool
    nbaEuroPool.forEach(p => {
        let fit = calculatePlayerFitScore(p, buyerNeeds);
        if (panic.panic && p.position === panic.position) fit *= 1.5;
        if (fit > 1.35) marketCandidates.push({ player: p, score: fit, type: 'NBA' });
    });

    // General FAs
    freeAgents.forEach(p => {
        let fit = calculatePlayerFitScore(p, buyerNeeds);
        if (panic.panic && p.position === panic.position) fit *= 1.5;
        if (fit > 1.45) marketCandidates.push({ player: p, score: fit, type: 'FA' });
    });

    if (marketCandidates.length > 0) {
        const best = marketCandidates.sort((a, b) => b.score - a.score)[0];
        if (buyer.cash > 2000000) {
            let reason = `to strengthen their roster at ${best.player.position}`;
            if (panic.panic && best.player.position === panic.position) {
                reason = `as an emergency replacement for an injured key player`;
            }

            return {
                proposerId: buyer.id,
                targetTeamId: 'FREE_AGENCY',
                proposerAssets: { players: [], picks: [] },
                targetAssets: { players: [best.player], picks: [] },
                isSigning: true,
                reason
            };
        }
    }

    // --- PHASE 2: SCAN OTHER TEAMS (TRANSFERS) ---
    const potentialTargets: { player: Player, seller: Team, score: number }[] = [];

    teams.forEach(seller => {
        if (seller.id === buyer.id) return;
        
        const sellerRoster = players.filter(p => p.teamId === seller.id);
        const sellerBlock = getTradingBlock(seller, sellerRoster, getTeamDirection(seller, sellerRoster));
        
        let candidates = sellerBlock.assets;
        if (seller.id === userTeamId) {
            const sortedUserRoster = [...sellerRoster].sort((a, b) => calculateOverall(b) - calculateOverall(a));
            candidates = sortedUserRoster.slice(3); 
        }

        candidates.forEach(player => {
            if (isEuroPlayerUntouchable(player, seller, sellerRoster, buyer).untouchable) return;

            let fitScore = calculatePlayerFitScore(player, buyerNeeds);
            
            // Panic bonus
            if (panic.panic && player.position === panic.position) fitScore *= 1.4;

            const isMidLow = buyerTarget.includes('Avoid Relegation') || buyerTarget.includes('Talent Farm') || buyerTarget.includes('Promotion');
            if (isMidLow && player.age <= 23) fitScore *= 1.3;
            else if (buyerTarget.includes('Contender') && player.age > 30) fitScore *= 1.1;

            if (buyer.conference !== seller.conference) fitScore *= 1.1; 

            potentialTargets.push({ player, seller, score: fitScore });
        });
    });

    potentialTargets.sort((a, b) => b.score - a.score);

    for (const target of potentialTargets) {
        const { player, seller, score } = target;
        if (score < 1.1) continue; 

        const sellerRoster = players.filter(p => p.teamId === seller.id);
        
        // Position Crowding Check
        const samePosPlayers = buyerRoster.filter(p => p.position === player.position);
        if (samePosPlayers.length >= 3) {
            const worstSamePosOvr = Math.min(...samePosPlayers.map(p => calculateOverall(p)));
            if (calculateOverall(player) < worstSamePosOvr + 5) continue;
        }

        const fee = calculateEuroBuyoutFee(player, seller, sellerRoster, contracts);
        
        // Budget Guardrail: Don't spend more than 50% of total cash on one player 
        // unless it's a Promotion/Title push and it's a Panic Buy.
        const isPushing = buyerTarget.includes('Contender') || buyerTarget.includes('Promotion');
        const maxSpendPct = (isPushing && panic.panic) ? 0.75 : 0.5;
        if (fee > buyer.cash * maxSpendPct) continue;
        
        if (buyer.cash < fee * 1.1) continue;

        const result = negotiateEuroBuyout(player, buyer, seller, sellerRoster, contracts, fee);
        
        if (result.decision === 'ACCEPTED') {
            const primaryDeficit = Object.entries(buyerNeeds).sort(([,a], [,b]) => b - a)[0][0];
            let reason = `to address a ${primaryDeficit} deficit at ${player.position}`;
            if (panic.panic && player.position === panic.position) {
                reason = `as an emergency replacement for an injured starter`;
            }

            return {
                proposerId: buyer.id,
                targetTeamId: seller.id,
                proposerAssets: { players: [], picks: [] },
                targetAssets: { players: [player], picks: [] },
                transferFee: fee,
                reason
            };
        }
    }

    // --- PHASE 3: SELLING (REDUNDANCY MANAGEMENT) ---
    // If we have 4+ players at a position, try to sell the worst one
    const crowdedPos = ['PG', 'SG', 'SF', 'PF', 'C'].find(pos => buyerRoster.filter(p => p.position === pos).length >= 4);
    if (crowdedPos && Math.random() < 0.3) {
        const playerToSell = buyerRoster
            .filter(p => p.position === crowdedPos)
            .sort((a, b) => calculateOverall(a) - calculateOverall(b))[0];
        
        if (playerToSell) {
            // Find a team that NEEDS this position
            const potentialBuyer = aiTeams.find(t => {
                if (t.id === buyer.id) return false;
                const tRoster = players.filter(p => p.teamId === t.id);
                const tNeeds = calculateEuroTeamNeeds(t, tRoster);
                // Check if this position is a need (Simplified check)
                const posSkill = tRoster.filter(p => p.position === crowdedPos).length;
                return posSkill <= 1 && t.cash > 1000000;
            });

            if (potentialBuyer) {
                return {
                    proposerId: potentialBuyer.id,
                    targetTeamId: buyer.id,
                    proposerAssets: { players: [], picks: [] },
                    targetAssets: { players: [playerToSell], picks: [] },
                    transferFee: 800000,
                    reason: `to reduce roster congestion at ${crowdedPos}`
                };
            }
        }
    }

    return null;
};

