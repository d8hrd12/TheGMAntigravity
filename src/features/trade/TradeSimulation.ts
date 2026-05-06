import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { evaluateTrade, getPlayerTradeValue, getDraftPickValue, getTeamDirection, getTradingBlock } from './TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';
import { generateUUID } from '../../utils/uuid';
import type { TradeProposal } from '../../models/TradeProposal';
import type { AI_GM } from '../../models/AI_GM';

export type { TradeProposal };

export interface SimulatedTradeProposal {
    proposerId: string;
    targetTeamId: string;
    proposerAssets: { players: Player[], picks: DraftPick[] };
    targetAssets: { players: Player[], picks: DraftPick[] };
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
