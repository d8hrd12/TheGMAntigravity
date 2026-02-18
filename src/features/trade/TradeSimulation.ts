import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { evaluateTrade, getPlayerTradeValue, getDraftPickValue } from './TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';
import { generateUUID } from '../../utils/uuid';
import type { TradeProposal } from '../../models/TradeProposal';
export type { TradeProposal };

export interface SimulatedTradeProposal {
    proposerId: string;
    targetTeamId: string;
    proposerAssets: { players: Player[], picks: DraftPick[] };
    targetAssets: { players: Player[], picks: DraftPick[] };
}

// Helper to check if team is rebuilding
const isRebuilding = (team: Team) => {
    const games = team.wins + team.losses;
    if (games < 10) return false; // Too early
    return (team.wins / games) < 0.40;
};

// Helper to check if team is contending
const isContending = (team: Team) => {
    const games = team.wins + team.losses;
    if (games < 10) return true; // Assume everyone tries early
    return (team.wins / games) > 0.55;
};

// Helper to check if a trade is a "Blockbuster" (includes 88+ OVR player)
const isBlockbuster = (proposal: SimulatedTradeProposal): boolean => {
    const allPlayers = [...proposal.proposerAssets.players, ...proposal.targetAssets.players];
    return allPlayers.some(p => calculateOverall(p) >= 88);
};

export const simulateDailyTrades = (
    teams: Team[],
    players: Player[],
    contracts: Contract[],
    currentYear: number,
    salaryCap: number,
    tradeHistory: any[], // Type from context
    currentDate: Date,
    seasonStartDate: Date,
    userTeamId?: string
): SimulatedTradeProposal | null => {
    // 1. FREQUENCY CONTROL
    const DAYS_IN_SEASON = 170; // Approx Oct to April
    const TARGET_TRADES = 8;

    // Calculate progress
    const msPerDay = 86400000;
    const daysPassed = Math.floor((currentDate.getTime() - seasonStartDate.getTime()) / msPerDay);
    if (daysPassed < 15) return null; // No trades in first 2 weeks
    if (daysPassed > 120) return null; // Trade Deadline approx Feb (Start Oct) -> 120 days

    // Explicit Trade Deadline Check (Day 110-120 is panic time)
    const isDeadlineWeek = daysPassed > 110 && daysPassed <= 120;

    // Probability Adjustment
    // Expected trades by now:
    const expectedTrades = (daysPassed / 120) * TARGET_TRADES;
    const actualTrades = tradeHistory.length;

    let baseChance = 0.05; // 5% daily base

    if (actualTrades < expectedTrades) {
        baseChance = 0.15; // Behind schedule, boost chance
    } else if (actualTrades > expectedTrades + 2) {
        baseChance = 0.01; // Ahead of schedule, slow down
    }

    if (isDeadlineWeek) baseChance = 0.40; // Panic buying

    if (Math.random() > baseChance) return null;

    // 2. BLOCKBUSTER CHECK
    // If we are past day 80 and NO blockbuster has happened, force one?
    const hasBlockbusterOccurred = tradeHistory.some(t =>
        // Heuristic: check descriptions for stars? Or just trust flag if we had one.
        // Simplified: We just try to generate a trade. If it turns out big, great.
        // We can force higher quality assets if we are desperate.
        false // Hard to check purely from history string without parsing.
    );

    const forceBlockbuster = daysPassed > 100 && !hasBlockbusterOccurred && Math.random() < 0.2;

    // Attempt Loop
    // Try multiple times to find a VALID logic-based trade
    const ATTEMPTS = isDeadlineWeek ? 20 : 5;

    for (let i = 0; i < ATTEMPTS; i++) {
        // A. Pick Proposer (AI Only)
        const potentialProposers = teams.filter(t => t.id !== userTeamId);
        const proposer = potentialProposers[Math.floor(Math.random() * potentialProposers.length)];
        if (!proposer) continue;

        const proposerRoster = players.filter(p => p.teamId === proposer.id);
        const proposerPicks = proposer.draftPicks || [];
        const rebuilding = isRebuilding(proposer);
        const inDebt = (proposer.cash || 0) < 0;

        // B. Identify Assets
        let tradingBlock: Player[] = [];
        let tradingPicks: DraftPick[] = [];

        if (inDebt) {
            // DEBT FIX: Teams in debt prioritize dumping salary
            tradingBlock = proposerRoster.filter(p => {
                const contract = contracts.find(c => c.playerId === p.id);
                return contract && contract.amount > salaryCap * 0.15;
            });
            if (proposer.cash < -100000000) {
                tradingPicks = proposerPicks.slice(0, 1);
            }
        } else {
            // Check for positional surplus FIRST (New logic for better AI intelligence)
            const depthChart: Record<string, Player[]> = { 'PG': [], 'SG': [], 'SF': [], 'PF': [], 'C': [] };
            proposerRoster.forEach(p => { if (depthChart[p.position]) depthChart[p.position].push(p); });

            Object.keys(depthChart).forEach(pos => {
                const atPos = depthChart[pos].sort((a, b) => (b.overall || 0) - (a.overall || 0));
                // If we have 3+ players at 80+ OVR at ONE position, shop the lowest rated of the elites
                if (atPos.length >= 3 && (atPos[2].overall || 0) >= 80) {
                    tradingBlock.push(atPos[2]);
                }
            });

            if (rebuilding) {
                // Rebuilders sell OLD (>28), Good (>75) players
                tradingBlock.push(...proposerRoster.filter(p => p.age > 28 && calculateOverall(p) > 75));
            } else {
                // Contenders sell YOUNG, LOW OVR (Prospects) or PICKS
                tradingPicks = proposerPicks.slice(0, 2);
                tradingBlock.push(...proposerRoster.filter(p => p.age < 24 && calculateOverall(p) < 76));
            }
        }

        if (tradingBlock.length === 0 && tradingPicks.length === 0) continue;

        // Pick best asset to shop
        // If forceBlockbuster, pick the BEST player on roster?
        let shopAsset: Player | DraftPick | null = null;

        if (forceBlockbuster && rebuilding) {
            // Forced Blockbuster: Rebuilder sells their BEST OLD player
            shopAsset = proposerRoster
                .filter(p => p.age > 26) // Slightly younger threshold for stars
                .sort((a, b) => calculateOverall(b) - calculateOverall(a))[0];
            if (shopAsset && calculateOverall(shopAsset) < 85) shopAsset = null; // Not a blockbuster
        } else {
            // Normal trade
            if (tradingBlock.length > 0) shopAsset = tradingBlock[Math.floor(Math.random() * tradingBlock.length)];
            else if (tradingPicks.length > 0) shopAsset = tradingPicks[0];
        }

        if (!shopAsset) continue;

        // Bundle creation (Simplified single asset start)
        const assetsToTrade = {
            players: (shopAsset as Player).firstName ? [shopAsset as Player] : [],
            picks: !(shopAsset as Player).firstName ? [shopAsset as DraftPick] : []
        };

        // C. Find Target
        const potentialTargets = teams.filter(t => t.id !== proposer.id && t.id !== userTeamId);
        if (potentialTargets.length === 0) continue;

        // Optimization: Find a target that NEEDS what we have
        // If selling Old Star -> Target Contenders
        // If selling Young/Pick -> Target Rebuilders
        let preferredTargets = potentialTargets;
        if ((shopAsset as Player).firstName) {
            const p = shopAsset as Player;
            if (p.age > 28) preferredTargets = potentialTargets.filter(t => isContending(t));
            else preferredTargets = potentialTargets.filter(t => isRebuilding(t));
        } else {
            // Selling Pick -> Target Rebuilder? No, Contenders trade picks to get players. 
            // If I am selling a Pick, I want a PLAYER. So I target a Rebuilder who sells players.
            // Wait, if I am Contender selling Pick, I want Vet. Vet is on Rebuilding team.
            preferredTargets = potentialTargets.filter(t => isRebuilding(t));
        }

        if (preferredTargets.length === 0) preferredTargets = potentialTargets;
        const targetTeam = preferredTargets[Math.floor(Math.random() * preferredTargets.length)];

        const targetRoster = players.filter(p => p.teamId === targetTeam.id);
        const targetPicks = targetTeam.draftPicks || [];
        const targetRebuilding = isRebuilding(targetTeam);
        const targetInDebt = (targetTeam.cash || 0) < 0;

        // E. REJECTION: If target is in debt, they won't ADD salary unless it's a steal
        if (targetInDebt) {
            const proposerSalary = assetsToTrade.players.reduce((sum, p) => sum + (contracts.find(c => c.playerId === p.id)?.amount || 0), 0);
            if (proposerSalary > salaryCap * 0.1) {
                // Too much salary for a broke team
                continue;
            }
        }

        // D. Identify Desired Return
        let desiredPlayers: Player[] = [];
        let desiredPicks: DraftPick[] = [];

        // Rebuilders want Picks/Youth. Contenders want Stars/Vets.
        if (targetRebuilding) {
            // They are willing to give up Vets for Picks/Youth
            // But what do *I* (Proposer) want?
            // If Proposer is Rebuilding (Selling Vet), they want Picks/Youth.
            // If Target is Contending (Buying Vet), they give Picks/Youth.
            // Logic Matches.

            // What does Proposer Want?
            if (rebuilding) {
                // I want Picks or Young Players
                if (targetPicks.length > 0 && Math.random() > 0.5) desiredPicks = [targetPicks[0]];
                else {
                    const young = targetRoster.filter(p => p.age < 25 && calculateOverall(p) > 70);
                    if (young.length > 0) desiredPlayers = [young[0]];
                }
            } else {
                // I am Contending (Selling Youth/Pick). I want VET/STAR.
                const vets = targetRoster.filter(p => calculateOverall(p) > 80);
                if (vets.length > 0) desiredPlayers = [vets[0]];
            }
        } else {
            // Target is Contending
            if (rebuilding) {
                // I am Selling Vet. I want their Pick/Youth.
                if (targetPicks.length > 0 && Math.random() > 0.5) desiredPicks = [targetPicks[0]];
                else {
                    const young = targetRoster.filter(p => p.age < 25);
                    if (young.length > 0) desiredPlayers = [young[0]];
                }
            } else {
                // Both Contending? Rare. Swap role players?
                const rolePlayers = targetRoster.filter(p => calculateOverall(p) > 75 && calculateOverall(p) < 85);
                if (rolePlayers.length > 0) desiredPlayers = [rolePlayers[0]];
            }
        }

        if (desiredPlayers.length === 0 && desiredPicks.length === 0) continue;

        const desiredAssets = { players: desiredPlayers, picks: desiredPicks };

        // E. Evaluate
        const result = evaluateTrade(
            proposer, assetsToTrade, targetTeam, desiredAssets,
            teams, players, currentYear, contracts, salaryCap
        );

        if (result.accepted) {
            // Final Sanity Check: User not involved
            if (proposer.id === userTeamId || targetTeam.id === userTeamId) continue;

            return {
                proposerId: proposer.id,
                targetTeamId: targetTeam.id,
                proposerAssets: assetsToTrade,
                targetAssets: desiredAssets
            };
        } else if (result.message.includes("sweetener") || result.message.includes("close")) {
            // Attempt to add a sweetener (2nd Round Pick)
            if (proposer.draftPicks && proposer.draftPicks.length > 0) {
                const sweetener = proposer.draftPicks.find(p => p.round === 2);
                if (sweetener && !assetsToTrade.picks.find(p => p.id === sweetener.id)) {
                    assetsToTrade.picks.push(sweetener);

                    // Re-evaluate
                    const reEval = evaluateTrade(
                        proposer, assetsToTrade, targetTeam, desiredAssets,
                        teams, players, currentYear, contracts, salaryCap
                    );

                    if (reEval.accepted) {
                        return {
                            proposerId: proposer.id,
                            targetTeamId: targetTeam.id,
                            proposerAssets: assetsToTrade,
                            targetAssets: desiredAssets
                        };
                    }
                }
            }
        }
    }

    return null;
};

// NEW FUNCTION: Explicitly generate a proposal FOR the user
export const generateAiTradeProposalForUser = (
    userTeamId: string,
    teams: Team[],
    players: Player[],
    contracts: Contract[],
    currentYear: number,
    salaryCap: number
): SimulatedTradeProposal | null => {
    // 1. Pick a proposer (AI Team)
    const potentialProposers = teams.filter(t => t.id !== userTeamId);
    const proposer = potentialProposers[Math.floor(Math.random() * potentialProposers.length)];
    if (!proposer) return null;

    const proposerRoster = players.filter(p => p.teamId === proposer.id);
    const proposerPicks = proposer.draftPicks || [];
    const rebuilding = isRebuilding(proposer);

    // 2. Identify Trading Block
    let tradingBlock: Player[] = [];
    let tradingPicks: DraftPick[] = [];

    if (rebuilding) {
        tradingBlock = proposerRoster.filter(p => p.age > 28 && calculateOverall(p) > 75);
    } else {
        tradingPicks = proposerPicks.slice(0, 2);
        tradingBlock = proposerRoster.filter(p => p.age < 24 && calculateOverall(p) < 75);
    }

    if (tradingBlock.length === 0 && tradingPicks.length === 0) return null;

    const assetsToTrade = {
        players: tradingBlock.slice(0, 2),
        picks: tradingPicks.slice(0, 1)
    };
    if (assetsToTrade.players.length === 0 && assetsToTrade.picks.length === 0) return null;

    // 3. User is Target
    const userTeam = teams.find(t => t.id === userTeamId);
    if (!userTeam) return null;

    const targetRoster = players.filter(p => p.teamId === userTeam.id);
    const targetPicks = userTeam.draftPicks || [];

    // 4. Identify Desired Assets from User
    let desiredPlayers: Player[] = [];
    let desiredPicks: DraftPick[] = [];

    if (rebuilding) {
        desiredPicks = targetPicks.slice(0, 1);
        desiredPlayers = targetRoster.filter(p => p.age < 24 && calculateOverall(p) > 70).slice(0, 1);
    } else {
        desiredPlayers = targetRoster.filter(p => calculateOverall(p) > 80).slice(0, 1);
    }

    if (desiredPlayers.length === 0 && desiredPicks.length === 0) return null;

    const desiredAssets = {
        players: desiredPlayers,
        picks: desiredPicks
    };

    // 5. Check if *AI* accepts the deal (User has to accept manually later)
    const result = evaluateTrade(
        proposer,
        assetsToTrade,
        userTeam,
        desiredAssets,
        teams,
        players,
        currentYear,
        contracts,
        salaryCap
    );

    if (result.accepted) {
        return {
            proposerId: proposer.id,
            targetTeamId: userTeam.id,
            proposerAssets: assetsToTrade,
            targetAssets: desiredAssets
        };
    }

    return null;
};
