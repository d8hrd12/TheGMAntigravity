import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { calculateTeamCapSpace } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars } from '../../utils/starUtils';
import type { TradeProposal } from '../../models/TradeProposal';

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

// Helper for UI/Legacy compatibility
export function getTeamState(team: Team): TeamState {
    // This is a simplified wrapper if needed, or we can update call sites.
    // Ideally, we move everyone to use getTeamDirection with Roster passed in.
    // For now, let's infer based on just the Team record for legacy support (or pass empty list if risky)
    // BUT we need the roster for accuracy.
    // We will Deprecate this in favor of getTeamDirection
    const totalGames = (team.wins || 0) + (team.losses || 0);
    const winPct = totalGames > 0 ? (team.wins || 0) / totalGames : 0.5;
    if (winPct >= 0.60) return 'Contender';
    if (winPct >= 0.50) return 'PlayoffTeam';
    if (winPct >= 0.35) return 'Retooling';
    return 'Rebuilding';
}

export function getTradingBlock(team: Team, roster: Player[], direction: TeamDirection): TradingBlock {
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

        // Franchise Cornerstone Logic: 4.7+ Stars (Superstar) or 4.2+ Stars (High Potential Youth)
        const isCornerstone = (stars >= 4.7) || (stars >= 4.2 && p.age < 25) || (stars >= 3.8 && p.age < 22);

        if (isCornerstone && rank < 2) {
            untouchables.push(p);
        } else if (isCornerstone && rank >= 2) {
            // Surplus Cornerstone: Marked as asset to encourage balancing the roster
            assets.push(p);
        }
    });

    switch (direction) {
        case 'Contender':
            needs.push('Veterans', 'Shooters', 'Defenders', 'Win Now');
            willingToTradePicks = true;
            // Sell: Young players who aren't ready, deep bench
            assets.push(...roster.filter(p => !untouchables.includes(p) && p.age < 24 && (p.overall || 0) < 78));
            break;

        case 'PlayoffTeam':
            needs.push('Upgrade Starter', 'Depth');
            willingToTradePicks = true; // Controlled aggression
            // Sell: Role players to package up
            break;

        case 'Young_Developing':
            needs.push('Young Talent', 'Draft Picks', 'Development Minutes');
            willingToTradePicks = false;
            // Sell: Veterans taking minutes
            assets.push(...roster.filter(p => p.age > 26 && !untouchables.includes(p)));
            break;

        case 'Rebuilding':
            needs.push('Draft Picks', 'Bad Contracts (for assets)', 'Young High Potential');
            willingToTradePicks = false;
            // Sell: Vets over 26 with value. 
            // BUT: Don't just "dump" 90+ superstars unless they are very old (33+) or have trade requests
            assets.push(...roster.filter(p => {
                const ovr = p.overall || calculateOverall(p);
                if (untouchables.includes(p)) return false;
                if (ovr >= 90 && p.age < 33 && !p.tradeRequested) return false; 
                return p.age > 26 && ovr > 72;
            }));
            break;
    }

    // Standard Surplus Logic (Always sell 4th string PG etc)
    Object.keys(depthChart).forEach(pos => {
        if (depthChart[pos].length > 3) {
            assets.push(...depthChart[pos].slice(3).filter(p => !untouchables.includes(p)));
        }
    });

    const uniqueAssets = Array.from(new Set(assets)).slice(0, 5); // Limit size

    return { needs, assets: uniqueAssets, untouchables, willingToTradePicks };
}

// Positional Needs Score (0.0 to 2.0)
export function getPositionalNeed(team: Team, roster: Player[], position: string): number {
    const PLAYABLE_THRESHOLD = 75;

    const playersAtPos = roster.filter(p => p.position === position);
    const playableAtPos = playersAtPos.filter(p => (p.overall || calculateOverall(p)) >= PLAYABLE_THRESHOLD);

    if (playableAtPos.length === 0) return 1.4; // Critical
    if (playableAtPos.length === 1) return 1.2; // High
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
    roster: Player[] // Roster of the team VALUING the player (usually receivingTeam)
): number {
    const teamDirection = receivingTeam ? getTeamDirection(receivingTeam, roster) : 'PlayoffTeam'; // Fallback
    const currentOvr = player.overall || calculateOverall(player);
    const potential = player.potential || 70;
    const contract = contracts.find(c => c.playerId === player.id);
    const yearsLeft = contract ? contract.yearsLeft : 0;
    const amount = contract ? contract.amount : 0;

    let value = currentOvr;
    const stars = calculateStars(currentOvr, 75);

    // E. STAR SCALING (Exponential Value for Elites - NBA Style)
    // Using Star Rating as the source of truth for "Quality"
    if (stars >= 5.0) value *= 5.0;      // Generational (Jokic/Luka Tier) - Hard to get
    else if (stars >= 4.5) value *= 3.5; // Superstar Tier
    else if (stars >= 4.0) value *= 2.0; // All-Star/Elite Starter Tier
    else if (stars >= 3.5) value *= 1.2; // Quality Rotation

    // A. DIRECTION-BASED ADJUSTMENTS
    switch (teamDirection) {
        case 'Rebuilding':
        case 'Young_Developing':
            if (player.age <= 23) value *= 1.4;
            if (player.age <= 21) value *= 1.2;
            if (potential >= 85) value += (potential - 70) * 0.8;

            // ELITE PLAYER AGE FLOOR:
            // High Star players don't lose value as fast even for rebuilders
            const agePenaltyFactor = stars >= 4.2 ? 0.90 : 0.6;
            if (player.age >= 29) value *= agePenaltyFactor;
            if (player.age >= 32) value *= (stars >= 4.5 ? 0.75 : 0.4);

            // Cap Space Eaters
            if (yearsLeft > 2 && amount > 25000000 && stars < 4.0) value *= 0.6;
            break;

        case 'Contender':
            if (stars >= 4.5) value *= 1.5; // Desperate for superstars
            if (stars >= 4.0) value *= 1.2;
            // Win NOW
            if (player.age <= 22 && stars < 3.5) value *= 0.6; // Can't wait
            break;
    }

    // B. POSITIONAL NEED & DIMINISHING RETURNS
    let needMultiplier = 1.0;
    if (receivingTeam && roster.length > 0) {
        needMultiplier = getPositionalNeed(receivingTeam, roster, player.position);

        // Internal Diminishing Returns:
        const elitesAtPos = roster.filter(p => p.position === player.position && (p.overall || calculateOverall(p)) >= 82);
        if (elitesAtPos.length >= 2) {
            value *= 0.7; // Heavy penalty for 3rd elite player at same pos
        } else if (elitesAtPos.length === 1 && currentOvr >= 82) {
            value *= 0.85; // Medium penalty for 2nd elite player at same pos
        }
    }
    value *= needMultiplier;

    // C. CONTRACT STATUS
    if (contract) {
        if (contract.yearsLeft === 1) {
            // Expiring
            if (teamDirection === 'Rebuilding') value *= 1.25; // Massive asset flip potential
        } else if (contract.yearsLeft >= 4 && contract.amount > 30000000) {
            // Bad Contract Risk
            if (currentOvr < 82) value *= 0.7;
            if (player.age > 31 && currentOvr < 85) value *= 0.5;
        }
    }

    // D. STAR TAX (Loss Aversion)
    // If a team is GIVING AWAY a star, they demand a premium because it hurts their brand/fanbase
    if (currentOvr >= 92) value *= 2.0; // Elite Superstars are nearly untouchable
    else if (currentOvr >= 88) value *= 1.5; 

    return Math.max(0, value);
}

export function getDraftPickValue(pick: DraftPick, currentYear: number, receivingTeam: Team | null, pickNumber?: number, allTeams?: Team[]): number {
    let baseValue = 0;
    const isFuture = pick.year > currentYear;

    if (pick.round === 1) {
        if (pickNumber) {
            // KNOWN PICK VALUE (Draft Day / Lottery Set)
            if (pickNumber === 1) baseValue = 130; // Wemby/LeBron level asset
            else if (pickNumber === 2) baseValue = 110;
            else if (pickNumber === 3) baseValue = 95;
            else if (pickNumber === 4) baseValue = 75; // The Drop-off
            else if (pickNumber <= 10) baseValue = 75 - (pickNumber - 4) * 3; // 4->75, 10->57
            else if (pickNumber <= 20) baseValue = 55 - (pickNumber - 10) * 2; // 11->53, 20->35
            else baseValue = 35 - (pickNumber - 20) * 1; // 21->34, 30->25
        } else {
            // UNKNOWN FUTURE PICK
            // The value depends on the STRENGTH of the ORIGINAL team.
            let strengthFactor = 1.0;
            if (allTeams) {
                const originalTeam = allTeams.find(t => t.id === pick.originalTeamId);
                if (originalTeam) {
                    const direction = getTeamDirection(originalTeam, []); // Use default empty roster for inference
                    if (direction === 'Rebuilding') strengthFactor = 1.5; // High lottery potential
                    else if (direction === 'Young_Developing') strengthFactor = 1.25;
                    else if (direction === 'PlayoffTeam') strengthFactor = 0.9;
                    else if (direction === 'Contender') strengthFactor = 0.6; // Low pick expected
                }
            }

            if (isFuture) {
                const yearsOut = pick.year - currentYear;
                if (yearsOut <= 2) {
                    baseValue = (60 - (yearsOut * 10)) * strengthFactor;
                } else {
                    baseValue = (40 + ((yearsOut - 2) * 8)) * strengthFactor;
                }
            } else {
                baseValue = 60 * strengthFactor;
            }
        }
    } else {
        // Round 2
        if (pickNumber) {
            if (pickNumber <= 40) baseValue = 22;
            else if (pickNumber <= 50) baseValue = 12;
            else baseValue = 5;
        } else {
            baseValue = 12;
            if (isFuture && pick.year > currentYear + 1) baseValue = 8;
        }
    }

    if (receivingTeam) {
        const state = getTeamState(receivingTeam);
        if (state === 'Rebuilding') baseValue *= 1.8; // Rebuilders value picks much more
        if (state === 'Contender') baseValue *= 0.7; // Contenders prefer immediate help
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

export function getPackageValue(
    assets: TradeAssetBundle,
    receivingTeam: Team,
    contracts: Contract[],
    currentRoster: Player[], // Receiving team's roster
    currentYear: number,
    allTeams: Team[]
): number {
    let totalValue = 0;

    const playerValues = assets.players.map(p => getPlayerTradeValue(p, receivingTeam, contracts, currentRoster));

    playerValues.sort((a, b) => b - a);

    playerValues.forEach((val, i) => {
        if (i === 0) totalValue += val;
        else if (i === 1) totalValue += val * 0.8;
        else totalValue += val * 0.5;
    });

    const pickValues = assets.picks.map(p => getDraftPickValue(p, currentYear, receivingTeam, undefined, allTeams));
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

    // 1.5 FRANCHISE CORNERSTONE CHECK
    const aiRoster = allPlayers.filter(p => p.teamId === aiTeam.id);
    const aiDirection = getTeamDirection(aiTeam, aiRoster);
    const block = getTradingBlock(aiTeam, aiRoster, aiDirection);

    // Dynamic untouchable check
    const untouchables = block.untouchables; // Already calculated
    const requestedUntouchable = aiAssets.players.find(p => untouchables.some(u => u.id === p.id));

    if (requestedUntouchable) {
        return { accepted: false, message: `${requestedUntouchable.lastName} is a Franchise Cornerstone. We are building around him, not trading him.` };
    }

    // 2. VALUE ANALYSIS
    const aiRosterPost = aiRoster.filter(p => !aiAssets.players.find(ap => ap.id === p.id));

    // Value of what AI RECEIVES (User Assets)
    const valueReceived = getPackageValue(userAssets, aiTeam, contracts, aiRosterPost, currentYear, allTeams);

    // Value of what AI GIVES (AI Assets) - Valued from THEIR perspective (Loss aversion)
    const valueGiven = getPackageValue(aiAssets, aiTeam, contracts, aiRosterPost, currentYear, allTeams);

    // 3. DECISION LOGIC
    let ratio = valueReceived / (valueGiven || 1);
    let requiredRatio = 1.05;

    // Logic based on Direction
    if (aiDirection === 'Rebuilding') {
        const gettingYoung = userAssets.players.some(p => p.age < 24);
        const gettingPicks = userAssets.picks.length > 0;

        if (!gettingYoung && !gettingPicks) {
            return { accepted: false, message: "We are rebuilding. We need picks or young prospects." };
        }
    }

    if (aiDirection === 'Contender') {
        const gettingGoodPlayer = userAssets.players.some(p => (p.overall || 0) > 78);
        if (!gettingGoodPlayer && userAssets.picks.length > 0) {
            // Contenders only take picks if they are OVERWHELMING value to flip later
            if (ratio < 1.5) return { accepted: false, message: "We are chasing a ring. Picks don't help us score points right now." };
        }

        // SUPERSTAR EXCEPTION (NBA Style)
        const gettingSuperstar = userAssets.players.some(p => (p.overall || calculateOverall(p)) >= 88);
        if (gettingSuperstar) {
            requiredRatio = 0.90; // Desperate for a star
        }

        // MANDATORY QUALITY CHECK (Anti-Scrub Rule)
        // Using Star Rating thresholds (Baseline 75): 4.5+ Stars = Superstar, 5 Stars = Generational
        const aiStars = calculateStars(aiAssets.players[0]?.overall || calculateOverall(aiAssets.players[0] || {}), 75);
        const aiGivingStar = aiAssets.players.find(p => calculateStars(p.overall || calculateOverall(p), 75) >= 4.2);
        
        if (aiGivingStar) {
            const userGivingQuality = userAssets.players.some(p => calculateStars(p.overall || calculateOverall(p), 75) >= 4.0);
            const userGivingProspect = userAssets.players.some(p => p.age < 23 && (p.potential || 0) >= 88);
            const userGivingMultipleFirsts = userAssets.picks.filter(p => p.round === 1).length >= 3;

            if (!userGivingQuality && !userGivingProspect && !userGivingMultipleFirsts) {
                return { accepted: false, message: `We are not trading a ${calculateStars(aiGivingStar.overall, 75).toFixed(1)}-star talent like ${aiGivingStar.lastName} for bench warmers. We need a 4-star starter, a blue-chip prospect, or at least three 1st round picks.` };
            }
            
            // Generational Tier (5 Stars)
            if (calculateStars(aiGivingStar.overall || calculateOverall(aiGivingStar), 75) >= 4.8) {
                 const userGivingStar = userAssets.players.some(p => calculateStars(p.overall || calculateOverall(p), 75) >= 4.5);
                 const userGivingManyPicks = userAssets.picks.filter(p => p.round === 1).length >= 4;
                 if (!userGivingStar && !userGivingManyPicks) {
                     return { accepted: false, message: `A player like ${aiGivingStar.lastName} is the face of our franchise. We aren't trading him unless we get a superstar in return or a historic haul of draft picks.` };
                 }
            }
        }
    } // End of Contender block

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
// 4. "MAKE IT WORK" SUGGESTION ENGINE
// --------------------------------------------------------------------------------

export function suggestTradePackage(
    userTeam: Team,
    aiTeam: Team,
    desiredAssets: TradeAssetBundle,
    allPlayers: Player[], // Needed for roster context
    contracts: Contract[],
    currentYear: number,
    salaryCap: number,
    allTeams: Team[]
): TradeProposal | null {
    // Goal: Find a package of User Assets that matches the value of DesiredAssets

    const userRoster = allPlayers.filter(p => p.teamId === userTeam.id);
    const aiRoster = allPlayers.filter(p => p.teamId === aiTeam.id);
    const aiDirection = getTeamDirection(aiTeam, aiRoster);

    // 1. Calculate Value Needed
    const aiRosterPost = aiRoster.filter(p => !desiredAssets.players.some(dp => dp.id === p.id));
    const valueToMatch = getPackageValue(desiredAssets, aiTeam, contracts, aiRosterPost, currentYear, allTeams);
    const targetValue = valueToMatch * 1.1; // AI wants a win

    // 2. Filter User Assets based on AI Needs
    let availableAssets: { asset: Player | DraftPick, value: number, type: 'player' | 'pick' }[] = [];

    // Players
    userRoster.forEach(p => {
        // Don't trade if user recently acquired? (Skipping for now)
        // Valuation from AI perspective
        const val = getPlayerTradeValue(p, aiTeam, contracts, aiRosterPost);

        let interest = 1.0;
        if (aiDirection === 'Rebuilding') {
            if (p.age > 27) interest = 0.1; // Don't want old
            if (p.age < 24) interest = 1.5;
        } else if (aiDirection === 'Contender') {
            if (p.age < 24 && (p.overall || 0) < 76) interest = 0.2; // Can't help now
            if ((p.overall || 0) > 80) interest = 1.3;
        }

        if (val > 0 && interest > 0.5) availableAssets.push({ asset: p, value: val, type: 'player' });
    });

    // Picks
    const userPicks = userTeam.draftPicks || [];
    userPicks.forEach(pick => {
        const val = getDraftPickValue(pick, currentYear, aiTeam);
        // Contenders value picks less, but getDraftPickValue handles that? 
        // Logic check: yes, it does at end.
        if (val > 0) availableAssets.push({ asset: pick, value: val, type: 'pick' });
    });

    // Sort by Value Desc
    availableAssets.sort((a, b) => b.value - a.value);

    // 3. Knapsack / Greedy construct
    // Try to find single asset match first
    const single = availableAssets.find(a => Math.abs(a.value - targetValue) < targetValue * 0.15);
    if (single) {
        return {
            userPlayerIds: single.type === 'player' ? [single.asset.id] : [],
            userPickIds: single.type === 'pick' ? [single.asset.id] : [],
            aiPlayerIds: desiredAssets.players.map(p => p.id),
            aiPickIds: desiredAssets.picks.map(p => p.id),
            aiTeamId: aiTeam.id,
            status: 'pending'
        };
    }

    // Build Package (Max 4 items)
    let currentVal = 0;
    let packageItems: typeof availableAssets = [];

    for (const item of availableAssets) {
        if (packageItems.length >= 4) break;
        if (currentVal + item.value > targetValue * 1.25) continue; // Too much

        packageItems.push(item);
        currentVal += item.value;

        if (currentVal >= targetValue) break;
    }

    if (currentVal >= targetValue * 0.9) {
        return {
            userPlayerIds: packageItems.filter(i => i.type === 'player').map(i => i.asset.id),
            userPickIds: packageItems.filter(i => i.type === 'pick').map(i => i.asset.id),
            aiPlayerIds: desiredAssets.players.map(p => p.id),
            aiPickIds: desiredAssets.picks.map(p => p.id),
            aiTeamId: aiTeam.id,
            status: 'pending'
        };
    }

    return null; // Can't make it work
}

// --------------------------------------------------------------------------------
// TRADE FINDER & HELPERS
// --------------------------------------------------------------------------------

// Verify that all assets in the proposal still belong to the corrected teams
export function validateTradeProposal(proposal: TradeProposal, players: Player[], picks: DraftPick[]): boolean {
    for (const pid of proposal.userPlayerIds) {
        const p = players.find(x => x.id === pid);
        if (!p) return false;
    }

    for (const pid of proposal.aiPlayerIds) {
        const p = players.find(x => x.id === pid);
        if (!p) return false;
        if (p.teamId !== proposal.aiTeamId) return false;
    }

    const findPick = (id: string) => picks.find(x => x.id === id);

    for (const pid of proposal.aiPickIds) {
        const pick = findPick(pid);
        if (!pick) return false;
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
        const aiRoster = players.filter(p => p.teamId === aiTeam.id);
        const aiDirection = getTeamDirection(aiTeam, aiRoster);

        // Initial Interest Filter
        let interest = 1.0;
        const currentOvr = shopPlayer.overall || calculateOverall(shopPlayer);

        if (aiDirection === 'Contender') {
            if (currentOvr > 78) interest *= 1.3;
            if (shopPlayer.age < 24 && currentOvr < 75) interest *= 0.6;
        } else if (aiDirection === 'Rebuilding') {
            if (shopPlayer.age < 25) interest *= 1.4;
            if (shopPlayer.age > 30) interest *= 0.1;
        }

        if (interest < 0.5) continue;

        // TARGET VALUE
        const valueToDistribute = getPlayerTradeValue(shopPlayer, aiTeam, contracts, aiRoster);

        if (valueToDistribute < 5) continue;

        const aiPicks = picks.filter(p => p.originalTeamId === aiTeam.id && p.year <= currentYear + 2);

        const block = getTradingBlock(aiTeam, aiRoster, aiDirection);
        // AI Logic: Identify assets to give up (excluding untouchables)
        const aiAssetsScored = aiRoster
            .filter(p => !block.untouchables.some(u => u.id === p.id))
            .map(p => {
                return { player: p, value: getPlayerTradeValue(p, aiTeam, contracts, aiRoster.filter(r => r.id !== p.id)) };
            }).sort((a, b) => b.value - a.value);

        let proposedAiPlayers: Player[] = [];
        let proposedAiPicks: DraftPick[] = [];
        let currentOfferValue = 0;

        // Try to find a single player match first (+/- 10%)
        const singleMatch = aiAssetsScored.find(a => {
            const aiStars = calculateStars(a.player.overall || calculateOverall(a.player), 75);
            const userStars = calculateStars(currentOvr, 75);

            // ANTI-JOKIC-FOR-SCRUB RULE:
            if (aiStars >= 4.5 && userStars < 4.0) return false;
            if (aiStars >= 5.0 && userStars < 4.5) return false;

            if (aiStars > userStars + 1.0 && aiDirection !== 'Rebuilding') return false;
            if (aiStars >= 4.5 && userStars < 4.2) return false;
            if (aiStars >= 5.0 && a.player.age < 27) return false; // Untouchable check

            return Math.abs(a.value - valueToDistribute) < valueToDistribute * 0.1;
        });

        if (singleMatch) {
            proposedAiPlayers.push(singleMatch.player);
            currentOfferValue += singleMatch.value;
        } else {
            // SUPERSTAR EXCEPTION: Allow more package overpay for elite talent
            const maxPackageRatio = valueToDistribute > 140 ? 1.30 : 1.15;
            for (const asset of aiAssetsScored) {
                if (proposedAiPlayers.length >= 3) break;
                if (asset.value > valueToDistribute * 1.2) continue;
                if (currentOfferValue + asset.value > valueToDistribute * maxPackageRatio) continue;

                if (asset.player.overall > currentOvr + 5 && aiDirection !== 'Rebuilding') continue;
                if (asset.player.overall >= 88 && currentOvr < 85) continue;

                proposedAiPlayers.push(asset.player);
                currentOfferValue += asset.value;
            }
        }

        if (currentOfferValue < valueToDistribute * 0.95) {
            for (const pick of aiPicks) {
                const pickVal = getDraftPickValue(pick, currentYear, aiTeam, undefined, allTeams);
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

            // STRICTER CHECK FOR OFFER GENERATION
            // We want the AI to be "sure" when it offers, so we don't get a bait-and-switch.
            // Normal evaluateTrade checks for ~1.05 ratio. 
            // We check for 1.10 here to provide a safety buffer against minor context shifts (roster changes during eval).
            const evaluation = evaluateTrade(
                userTeam,
                userBundle,
                aiTeam,
                aiBundle,
                allTeams,
                players,
                currentYear,
                contracts,
                salaryCap
            );

            // MANUALLY CHECK RATIO BUFFER
            const valReceived = getPackageValue(userBundle, aiTeam, contracts, aiRoster.filter(p => !aiBundle.players.includes(p)), currentYear, allTeams);
            const valGiven = getPackageValue(aiBundle, aiTeam, contracts, aiRoster.filter(p => !aiBundle.players.includes(p)), currentYear, allTeams);
            const ratio = valReceived / (valGiven || 1);

            // SUPERSTAR EXCEPTION: Contenders will accept a slight loss to land an elite player
            const requiredRatio = (aiDirection === 'Contender' && currentOvr >= 88) ? 0.95 : 1.10;

            if (evaluation.accepted && ratio >= requiredRatio) {
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
