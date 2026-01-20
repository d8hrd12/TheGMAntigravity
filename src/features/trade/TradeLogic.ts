import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { calculateTeamCapSpace } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import type { TradeProposal } from '../../models/TradeProposal';

// ----------------------------------------------------------------------------
// 1. CORE PHILOSOPHY: TEAM STATES & NEEDS
// ----------------------------------------------------------------------------

export type TeamState = 'Rebuilding' | 'Retooling' | 'PlayoffTeam' | 'Contender';

export function getTeamState(team: Team): TeamState {
    const totalGames = (team.wins || 0) + (team.losses || 0);
    const winPct = totalGames > 0 ? (team.wins || 0) / totalGames : 0.5;

    if (totalGames < 15) {
        // Fallback for early season based on roster strength?
        return 'Retooling';
    }

    if (winPct >= 0.60) return 'Contender';
    if (winPct >= 0.50) return 'PlayoffTeam';
    if (winPct >= 0.35) return 'Retooling';
    return 'Rebuilding';
}

// Positional Needs Score (0.0 to 2.0)
export function getPositionalNeed(team: Team, roster: Player[], position: string): number {
    const PLAYABLE_THRESHOLD = 75;

    const playersAtPos = roster.filter(p => p.position === position);
    const playableAtPos = playersAtPos.filter(p => (p.overall || calculateOverall(p)) >= PLAYABLE_THRESHOLD);

    if (playableAtPos.length === 0) return 1.4; // Critical (Reduced from 2.0)
    if (playableAtPos.length === 1) return 1.2; // High (Reduced from 1.5)
    if (playableAtPos.length === 2) return 1.0; // Neutral

    // Surplus
    if (playableAtPos.length >= 3) return 0.8;

    return 1.0;
}

// ----------------------------------------------------------------------------
// 2. CONTEXTUAL PLAYER VALUATION
// ----------------------------------------------------------------------------

export function getPlayerTradeValue(
    player: Player,
    receivingTeam: Team | null | undefined,
    contracts: Contract[],
    roster: Player[]
): number {
    const teamState: TeamState = receivingTeam ? getTeamState(receivingTeam) : 'Retooling';
    const currentOvr = player.overall || calculateOverall(player);
    const potential = player.potential || 70;
    const contract = contracts.find(c => c.playerId === player.id);
    const yearsLeft = contract ? contract.yearsLeft : 0;
    const amount = contract ? contract.amount : 0;

    let value = currentOvr;

    // A. STATE-BASED ADJUSTMENTS
    switch (teamState) {
        case 'Rebuilding':
            if (player.age <= 23) value *= 1.3;
            if (player.age <= 21) value *= 1.1;
            if (potential >= 85) value += (potential - 70) * 0.5;

            if (player.age >= 29) value *= 0.6;
            if (player.age >= 32) value *= 0.3;

            if (yearsLeft > 2 && amount > 20000000 && currentOvr < 85) value *= 0.7;
            break;

        case 'Contender':
            if (currentOvr >= 85) value *= 1.25;
            if (currentOvr >= 80) value *= 1.1;

            if (player.age <= 22 && currentOvr < 75) value *= 0.7;

            if (player.age >= 32 && currentOvr >= 80) value *= 1.1;
            break;

        case 'Retooling':
        case 'PlayoffTeam':
            if (player.age >= 34) value *= 0.7;
            break;
    }

    // B. POSITIONAL NEED ADJUSTMENT
    let needMultiplier = 1.0;
    if (receivingTeam) {
        needMultiplier = getPositionalNeed(receivingTeam, roster, player.position);
    }
    value *= needMultiplier;

    // C. CONTRACT STATUS
    if (contract) {
        if (contract.yearsLeft === 1) {
            if (teamState === 'Rebuilding') value *= 1.15;
        } else if (contract.yearsLeft >= 4 && contract.amount > 25000000) {
            if (currentOvr < 85) value *= 0.8;
            if (player.age > 30) value *= 0.5;
        }
    }

    // D. INJURY RISK 
    if (player.age >= 33) value *= 0.9;

    // E. SELF-INTEREST OVERRULE
    const starAtPos = roster.some(p => p.position === player.position && (p.overall || 0) >= 88);
    if (starAtPos && currentOvr < 80) value *= 0.5;

    return Math.max(0, value);
}

export function getDraftPickValue(pick: DraftPick, currentYear: number, receivingTeam: Team | null): number {
    let baseValue = 0;
    const isFuture = pick.year > currentYear;

    if (pick.round === 1) {
        if (isFuture) {
            baseValue = 50 - ((pick.year - currentYear) * 5);
        } else {
            baseValue = 60;
        }
    } else {
        baseValue = 15;
        if (isFuture) baseValue = 10;
    }

    if (receivingTeam) {
        const state = getTeamState(receivingTeam);
        if (state === 'Rebuilding') baseValue *= 1.3;
        if (state === 'Contender') baseValue *= 0.8;
    }

    return baseValue;
}

// ----------------------------------------------------------------------------
// 3. TRADE EVALUATION ENGINE
// ----------------------------------------------------------------------------

export interface TradeResult {
    accepted: boolean;
    message: string;
}

export interface TradeAssetBundle {
    players: Player[];
    picks: DraftPick[];
}

function getPackageValue(
    assets: TradeAssetBundle,
    receivingTeam: Team,
    contracts: Contract[],
    currentRoster: Player[], // Receiving team's roster
    currentYear: number
): number {
    let totalValue = 0;

    const playerValues = assets.players.map(p => getPlayerTradeValue(p, receivingTeam, contracts, currentRoster));

    playerValues.sort((a, b) => b - a);

    playerValues.forEach((val, i) => {
        if (i === 0) totalValue += val;
        else if (i === 1) totalValue += val * 0.8;
        else totalValue += val * 0.5;
    });

    const pickValues = assets.picks.map(p => getDraftPickValue(p, currentYear, receivingTeam));
    pickValues.forEach(val => totalValue += val);

    return totalValue;
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
    gmProfile?: any
): TradeResult {

    // 0. Empty Check
    if (userAssets.players.length === 0 && userAssets.picks.length === 0 && aiAssets.players.length === 0 && aiAssets.picks.length === 0) {
        return { accepted: false, message: "Use the selection boxes to add assets." };
    }

    // 1. FINANCIAL CHECK
    const getAssetsSalary = (assets: TradeAssetBundle) => assets.players.reduce((sum, p) => sum + (contracts.find(c => c.playerId === p.id)?.amount || 0), 0);
    const userOutgoing = getAssetsSalary(userAssets);
    const aiOutgoing = getAssetsSalary(aiAssets);

    const checkFinance = (team: Team, inSal: number, outSal: number) => {
        const space = calculateTeamCapSpace(team, contracts, salaryCap);
        const postTradeSpace = space + outSal - inSal;
        if (postTradeSpace >= 0) return true;

        const maxIn = (outSal * 1.25) + 5000000;
        return inSal <= maxIn;
    };

    if (!checkFinance(userTeam, aiOutgoing, userOutgoing)) return { accepted: false, message: "Salary cap validation failed for your team." };
    if (!checkFinance(aiTeam, userOutgoing, aiOutgoing)) return { accepted: false, message: "The other team cannot afford this trade." };

    // 2. VALUE ANALYSIS
    const aiRoster = allPlayers.filter(p => p.teamId === aiTeam.id && !aiAssets.players.find(ap => ap.id === p.id));

    // Value of what AI RECEIVES (User Assets)
    const valueReceived = getPackageValue(userAssets, aiTeam, contracts, aiRoster, currentYear);

    // Value of what AI GIVES (AI Assets) - Valued from THEIR perspective (Loss aversion)
    const valueGiven = getPackageValue(aiAssets, aiTeam, contracts, aiRoster, currentYear);

    // 3. DECISION LOGIC
    const aiState = getTeamState(aiTeam);

    let ratio = valueReceived / (valueGiven || 1);
    let requiredRatio = 1.05;

    if (aiState === 'Rebuilding') {
        const gettingYoung = userAssets.players.some(p => p.age < 24);
        const gettingPicks = userAssets.picks.length > 0;

        if (!gettingYoung && !gettingPicks) {
            return { accepted: false, message: "We are rebuilding. We need picks or young prospects." };
        }
    }

    if (aiState === 'Contender') {
        const gettingGoodPlayer = userAssets.players.some(p => (p.overall || 0) > 78);
        if (!gettingGoodPlayer && userAssets.picks.length > 0) {
            if (aiOutgoing < userOutgoing + 5000000) {
                return { accepted: false, message: "We are chasing a ring. Picks don't help us score points." };
            }
        }
    }

    if (gmProfile?.unlockedPerks?.includes('deal_1')) requiredRatio -= 0.05;

    if (valueReceived === 0 && valueGiven > 0) return { accepted: false, message: "We aren't a charity." };

    if (ratio >= requiredRatio) {
        return { accepted: true, message: "Deal. Pleasure doing business." };
    } else {
        if (ratio > 0.9) return { accepted: false, message: "Very close... can you add a sweetener?" };
        if (ratio > 0.7) return { accepted: false, message: "The value isn't quite there for us." };
        return { accepted: false, message: "This doesn't make sense for our team direction." };
    }
}

// --------------------------------------------------------------------------------
// TRADE FINDER & HELPERS
// --------------------------------------------------------------------------------

// Verify that all assets in the proposal still belong to the corrected teams
export function validateTradeProposal(proposal: TradeProposal, players: Player[], picks: DraftPick[]): boolean {
    // 1. Check User Assets (if any)
    for (const pid of proposal.userPlayerIds) {
        // Technically this function usually checks AI offers to User, 
        // where userPlayerIds is what USER gives.
        // We just need to check if the player exists and is on the user's team?
        // Actually, just check if they exist. Ownership might change if we are validating historical?
        // But for "Ghost Player", we usually mean an AI player offered is gone.
        const p = players.find(x => x.id === pid);
        if (!p) return false;
        // Verify ownership?
        // We don't have team IDs easily here unless we pass them.
        // But preventing crash: existence is key.
    }

    // 2. Check AI Assets (Critical)
    for (const pid of proposal.aiPlayerIds) {
        const p = players.find(x => x.id === pid);
        if (!p) return false;
        if (p.teamId !== proposal.aiTeamId) return false; // CHANGED TEAMS!
    }

    // 3. Check Picks
    // Helper to find pick by ID
    const findPick = (id: string) => picks.find(x => x.id === id);

    for (const pid of proposal.aiPickIds) {
        const pick = findPick(pid);
        if (!pick) return false;
        // Verify pick belongs to AI team currently?
        // Picks array passed in should include current owner info if possible?
        // DraftPick model doesn't explicitly have 'currentTeamId' unless defined.
        // Usually implied by being in Team.draftPicks array.
        // If we passed all picks, we can check.
        // We'll rely on existence for picks for now.
    }

    return true;
}

export function generateTradeOffers(
    userTeam: Team,
    shopPlayerId: string,
    allTeams: Team[],
    players: Player[],
    contracts: Contract[],
    picks: DraftPick[],
    salaryCap: number,
    currentYear: number
): TradeProposal[] {
    const shopPlayer = players.find(p => p.id === shopPlayerId);
    if (!shopPlayer) return [];

    const offers: TradeProposal[] = [];
    const aiTeams = allTeams.filter(t => t.id !== userTeam.id && t.id !== '31');

    for (const aiTeam of aiTeams) {
        const aiStrategy = getTeamState(aiTeam);

        // Initial Interest Filter
        let interest = 1.0;
        const currentOvr = shopPlayer.overall || calculateOverall(shopPlayer);

        if (aiStrategy === 'Contender') {
            if (currentOvr > 78) interest *= 1.3;
            if (shopPlayer.age < 24 && currentOvr < 75) interest *= 0.6;
        } else if (aiStrategy === 'Rebuilding') {
            if (shopPlayer.age < 25) interest *= 1.4;
            if (shopPlayer.age > 30) interest *= 0.1;
        }

        if (interest < 0.5) continue;

        // TARGET VALUE
        const aiRoster = players.filter(p => p.teamId === aiTeam.id);
        const valueToDistribute = getPlayerTradeValue(shopPlayer, aiTeam, contracts, aiRoster);

        if (valueToDistribute < 5) continue;

        // Define Picks Early (Scope Fix)
        const aiPicks = picks.filter(p => p.originalTeamId === aiTeam.id && p.year <= currentYear + 2);

        // AI Logic: Identify assets to give up
        const aiAssetsScored = aiRoster.map(p => {
            // Valuing "Keeping" the player:
            return { player: p, value: getPlayerTradeValue(p, aiTeam, contracts, aiRoster.filter(r => r.id !== p.id)) };
        }).sort((a, b) => b.value - a.value); // Sort High to Low

        // SANITY CHECK: Don't trade a star (85+) for a non-star (<82) unless rebuilding
        const isShopPlayerStar = currentOvr >= 85;
        const isShopPlayerStarter = currentOvr >= 80;

        // STRATEGIC BUNDLING
        // Instead of pure Greedy, assume AI constructs a logical package.
        // Package Types:
        // 1. Match Value Exact (Fair)
        // 2. Dump Salary + Asset (If ShopPlayer is cheap/better)
        // 3. Two-for-One (Consolidation)

        let proposedAiPlayers: Player[] = [];
        let proposedAiPicks: DraftPick[] = [];
        let currentOfferValue = 0;

        // Try to find a single player match first (+/- 10%)
        const singleMatch = aiAssetsScored.find(a => {
            // Safety: Don't trade a significantly better player for a worse one
            if (a.player.overall > currentOvr + 4 && aiStrategy !== 'Rebuilding') return false;
            if (a.player.overall >= 88 && currentOvr < 85) return false; // Never trade an 88+ for <85

            return Math.abs(a.value - valueToDistribute) < valueToDistribute * 0.1;
        });

        if (singleMatch) {
            proposedAiPlayers.push(singleMatch.player);
            currentOfferValue += singleMatch.value;
        } else {
            // Build a package
            // Start with highest affordable asset
            for (const asset of aiAssetsScored) {
                if (proposedAiPlayers.length >= 3) break;
                if (asset.value > valueToDistribute * 1.2) continue;
                if (currentOfferValue + asset.value > valueToDistribute * 1.15) continue;

                // Safety Checks
                if (asset.player.overall > currentOvr + 5 && aiStrategy !== 'Rebuilding') continue;
                if (asset.player.overall >= 88 && currentOvr < 85) continue;

                proposedAiPlayers.push(asset.player);
                currentOfferValue += asset.value;
            }

            // Pick Logic
            // Redundant aiPicks definition removed here.
        }

        // Fill gap with picks
        if (currentOfferValue < valueToDistribute * 0.95) {
            for (const pick of aiPicks) {
                const pickVal = getDraftPickValue(pick, currentYear, aiTeam);
                if (currentOfferValue + pickVal <= valueToDistribute * 1.2) {
                    proposedAiPicks.push(pick);
                    currentOfferValue += pickVal;
                    if (currentOfferValue >= valueToDistribute * 0.95) break;
                }
            }
        }

        if (proposedAiPlayers.length > 0 || proposedAiPicks.length > 0) {
            const userBundle = { players: [shopPlayer], picks: [] };
            const aiBundle = { players: proposedAiPlayers, picks: proposedAiPicks };

            // Final Validation: Does AI Accept?
            // This ensures "Self Interest" logic in evaluateTrade is respected.
            const evaluation = evaluateTrade(
                aiTeam,
                aiBundle,
                userTeam,
                userBundle,
                allTeams,
                players,
                currentYear,
                contracts,
                salaryCap
            );

            if (evaluation.accepted) {
                offers.push({
                    userPlayerIds: [shopPlayerId],
                    userPickIds: [],
                    aiPlayerIds: proposedAiPlayers.map(p => p.id),
                    aiPickIds: proposedAiPicks.map(p => p.id),
                    aiTeamId: aiTeam.id,
                    status: 'pending'
                });
            }
        }
    }

    return offers.slice(0, 5);
}
