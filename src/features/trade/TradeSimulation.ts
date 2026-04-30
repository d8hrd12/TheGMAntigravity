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
    const baseChance = isDeadlineWeek ? 0.35 : 0.05;

    if (Math.random() > baseChance) return null;

    // Attempt Loop
    const ATTEMPTS = 10;
    for (let i = 0; i < ATTEMPTS; i++) {
        const proposer = teams.filter(t => t.id !== userTeamId)[Math.floor(Math.random() * (teams.length - 1))];
        if (!proposer) continue;

        const targetTeam = teams.filter(t => t.id !== proposer.id && t.id !== userTeamId)[Math.floor(Math.random() * (teams.length - 2))];
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

        const assetToGive = propBlock.assets[0];
        const assetToGet = targetBlock.assets[0];

        const proposal = {
            proposerId: proposer.id,
            targetTeamId: targetTeam.id,
            proposerAssets: { players: [assetToGive], picks: [] },
            targetAssets: { players: [assetToGet], picks: [] }
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
