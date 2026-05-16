/**
 * EuroOffseasonAI.ts
 * 
 * AI GM engine for European teams during the offseason.
 * Each team is classified into an archetype based on roster OVR + last season W/L,
 * then executes a 3-source signing plan:
 *   1. Free Agents (cheapest, immediate roster fill)
 *   2. Younglings (cheapest, future value)
 *   3. NBA Veterans (expensive, high-OVR impact)
 *
 * Teams aim for a realistic 3-year roster plan.
 */

import { generateUUID } from '../../utils/uuid';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Contract } from '../../models/Contract';
import { calculateOverall } from '../../utils/playerUtils';
import { buildNBATargetPoolForAI } from './EuroNBAVeteranPool';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TeamArchetype =
    | 'CONTENDER'        // Win now, EL top-4 level. OVR 81+ or big cash
    | 'PLAYOFF_PUSH'     // Middle of the pack, wants to reach Final 8
    | 'REBUILDER'        // Low OVR, younger roster, 3-year development plan
    | 'TALENT_FARM'      // EuroCup, focuses on younglings & selling stars
    | 'BUDGET_CLUB';     // Low cash, fills gaps with free agents and younglings

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: Classify team archetype
// ─────────────────────────────────────────────────────────────────────────────

export function classifyTeamArchetype(team: Team, roster: Player[]): TeamArchetype {
    const sortedOvr = roster.map(p => calculateOverall(p)).sort((a, b) => b - a);
    const top5Avg = sortedOvr.slice(0, 5).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(5, sortedOvr.length));
    const totalGames = team.wins + team.losses;
    const winPct = totalGames > 0 ? team.wins / totalGames : 0.5;

    // Cash threshold: below €3M = budget club
    if (team.cash < 3_000_000) return 'BUDGET_CLUB';

    // EuroCup teams default to talent farm unless high OVR
    if (team.conference === 'EuroCup') {
        if (top5Avg >= 76 && team.cash >= 6_000_000) return 'PLAYOFF_PUSH';
        return 'TALENT_FARM';
    }

    // EuroLeague classifications
    if (top5Avg >= 82 || (top5Avg >= 79 && winPct >= 0.6)) return 'CONTENDER';
    if (top5Avg >= 76 || winPct >= 0.45) return 'PLAYOFF_PUSH';
    if (top5Avg < 72 && winPct < 0.35) return 'REBUILDER';

    return 'PLAYOFF_PUSH'; // Default middle tier
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: Determine what the team NEEDS (positional needs)
// ─────────────────────────────────────────────────────────────────────────────
function detectRosterNeeds(roster: Player[]): { position: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }[] {
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    const needs: { position: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }[] = [];

    for (const pos of positions) {
        const playersAtPos = roster.filter(p => p.position === pos);
        const count = playersAtPos.length;
        if (count === 0) needs.push({ position: pos, priority: 'HIGH' }); // CRITICAL need
        else if (count === 1) needs.push({ position: pos, priority: 'MEDIUM' }); // Needs backup
        else if (count >= 3) needs.push({ position: pos, priority: 'LOW' }); // Surplus risk
        else needs.push({ position: pos, priority: 'LOW' }); 
    }

    return needs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: Contract logic based on archetype
// ─────────────────────────────────────────────────────────────────────────────

function determineContract(
    player: Player,
    archetype: TeamArchetype,
    playerType: 'FREE_AGENT' | 'YOUNGLING' | 'NBA_VET',
    currentYear: number
): { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' } {
    const ovr = calculateOverall(player);

    if (playerType === 'YOUNGLING') {
        return { amount: 600_000, years: 3, role: 'Prospect' };
    }

    if (playerType === 'NBA_VET') {
        // Reduced amounts to make them 'Gems' for contenders (User Request)
        const amount = ovr >= 90 ? 3_000_000 : ovr >= 85 ? 2_200_000 : 1_500_000;
        return { amount, years: 2, role: ovr >= 84 ? 'Star' : 'Starter' };
    }

    // Free Agent — based on archetype and player quality
    if (ovr >= 82) {
        const amount = archetype === 'CONTENDER' ? 4_000_000 : 3_000_000;
        return { amount, years: archetype === 'CONTENDER' ? 3 : 2, role: 'Star' };
    } else if (ovr >= 76) {
        const amount = archetype === 'CONTENDER' ? 2_500_000 : 1_800_000;
        return { amount, years: 2, role: 'Starter' };
    } else if (ovr >= 70) {
        return { amount: 1_200_000, years: 2, role: 'Rotation' };
    } else {
        return { amount: 700_000, years: 1, role: 'Bench' };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4: Sign a player (mutates local state arrays)
// ─────────────────────────────────────────────────────────────────────────────

function signPlayer(
    player: Player,
    team: Team,
    archetype: TeamArchetype,
    playerType: 'FREE_AGENT' | 'YOUNGLING' | 'NBA_VET',
    updatedPlayers: Player[],
    updatedContracts: Contract[],
    currentYear: number
): { success: boolean, transaction?: any } {
    const contract = determineContract(player, archetype, playerType, currentYear);

    // Check if team can afford it
    if (team.cash < contract.amount) return { success: false };

    // Check roster size
    if (team.rosterIds.length >= 15) return { success: false };

    // Clone player with new team assignment
    const signedPlayer: Player = {
        ...player,
        teamId: team.id,
        acquisition: {
            type: playerType === 'NBA_VET' ? 'trade' : 'free_agent',
            year: currentYear,
            details: playerType === 'NBA_VET'
                ? 'Signed from NBA'
                : playerType === 'YOUNGLING'
                ? 'Academy Signing'
                : 'Free Agency'
        }
    };

    // Add / update in players list
    const existingIdx = updatedPlayers.findIndex(p => p.id === player.id);
    if (existingIdx >= 0) {
        updatedPlayers[existingIdx] = signedPlayer;
    } else {
        updatedPlayers.push(signedPlayer);
    }

    // Remove any old contract for this player
    const contractIdx = updatedContracts.findIndex(c => c.playerId === player.id);
    if (contractIdx >= 0) updatedContracts.splice(contractIdx, 1);

    // Add new contract
    updatedContracts.push({
        id: generateUUID(),
        playerId: player.id,
        teamId: team.id,
        amount: contract.amount,
        yearsLeft: contract.years,
        startYear: currentYear,
        role: contract.role
    });

    // Update team financials & roster
    team.cash -= contract.amount;
    if (!team.rosterIds.includes(player.id)) {
        team.rosterIds.push(player.id);
    }

    const transaction = {
        date: new Date(), 
        type: playerType === 'NBA_VET' ? 'NBA SIGNING' : playerType === 'YOUNGLING' ? 'ACADEMY' : 'SIGNING',
        description: `${team.name} signed ${player.firstName} ${player.lastName} (${playerType}).`,
        teamId: team.id,
        playerId: player.id,
        playerName: `${player.firstName} ${player.lastName}`,
        amount: contract.amount,
        years: contract.years
    };

    return { success: true, transaction };
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 5: Per-archetype signing strategy
// ─────────────────────────────────────────────────────────────────────────────

interface SigningBudget {
    freeAgentSlots: number;
    younglingSlots: number;
    nbaVetSlots: number;
    minOvrFreeAgent: number;
    minOvrNBAVet: number;
}

function getArchetypeBudget(archetype: TeamArchetype): SigningBudget {
    switch (archetype) {
        case 'CONTENDER':
            // Win now: 1 NBA vet, 2 quality free agents, 1 youngling
            return { freeAgentSlots: 2, younglingSlots: 1, nbaVetSlots: 1, minOvrFreeAgent: 78, minOvrNBAVet: 82 };
        case 'PLAYOFF_PUSH':
            // Balanced: 2 free agents, 1-2 younglings, maybe 1 NBA vet
            return { freeAgentSlots: 2, younglingSlots: 2, nbaVetSlots: 1, minOvrFreeAgent: 74, minOvrNBAVet: 79 };
        case 'REBUILDER':
            // Future-focused: lots of younglings, cheap free agents, no NBA vets
            return { freeAgentSlots: 1, younglingSlots: 3, nbaVetSlots: 0, minOvrFreeAgent: 68, minOvrNBAVet: 99 };
        case 'TALENT_FARM':
            // Academy-first: mostly younglings + one solid free agent
            return { freeAgentSlots: 1, younglingSlots: 3, nbaVetSlots: 0, minOvrFreeAgent: 65, minOvrNBAVet: 99 };
        case 'BUDGET_CLUB':
            // Scrap the market: any available free agent, 1-2 younglings
            return { freeAgentSlots: 3, younglingSlots: 2, nbaVetSlots: 0, minOvrFreeAgent: 60, minOvrNBAVet: 99 };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN: Run Euro AI offseason for all non-user teams
// ─────────────────────────────────────────────────────────────────────────────

export function simulateEuroAIOffseason(params: {
    teams: Team[];
    players: Player[];
    contracts: Contract[];
    localTalentPool: any[];   // LocalTalent[]
    userTeamId: string;
    gameYear: number;
    nbaPool?: Player[];
}): {
    updatedTeams: Team[];
    updatedPlayers: Player[];
    updatedContracts: Contract[];
    remainingLocalTalentPool: any[];
    remainingNBAPool: Player[];
    signingLog: string[];
    transactions: any[];
} {
    const { teams, userTeamId, gameYear } = params;
    const updatedPlayers = [...params.players];
    const updatedContracts = [...params.contracts];
    const updatedTeams = teams.map(t => ({ ...t, rosterIds: [...t.rosterIds] }));
    let remainingLocalTalentPool = [...params.localTalentPool];
    const signingLog: string[] = [];
    const transactions: any[] = [];

    // Build NBA veteran pool for this year (available to all AI teams)
    const nbaPool = params.nbaPool || buildNBATargetPoolForAI(gameYear);

    // Track which free agents / younglings / nba vets have been claimed
    const claimedFAIds = new Set<string>();
    const claimedNBAIds = new Set<string>();

    // Sort team processing order:
    // Contenders pick first from NBA pool, then by conference tier
    const processingOrder = [...updatedTeams]
        .filter(t => t.id !== userTeamId)
        .sort((a, b) => {
            const aRoster = updatedPlayers.filter(p => p.teamId === a.id);
            const bRoster = updatedPlayers.filter(p => p.teamId === b.id);
            const aAvg = aRoster.length > 0 ? aRoster.map(p => calculateOverall(p)).reduce((s, v) => s + v, 0) / aRoster.length : 0;
            const bAvg = bRoster.length > 0 ? bRoster.map(p => calculateOverall(p)).reduce((s, v) => s + v, 0) / bRoster.length : 0;
            return bAvg - aAvg; // Best teams pick first
        });

    for (const team of processingOrder) {
        const teamRoster = updatedPlayers.filter(p => p.teamId === team.id);
        const archetype = classifyTeamArchetype(team, teamRoster);
        const budget = getArchetypeBudget(archetype);
        const needs = detectRosterNeeds(teamRoster);
        const openSlots = 15 - team.rosterIds.length;

        if (openSlots <= 0) continue;

        // ── Source 1: FREE AGENTS ────────────────────────────────────────────
        {
            const freeAgents = updatedPlayers
                .filter(p =>
                    !p.teamId &&
                    !p.id.startsWith('nba_target') &&
                    !p.id.startsWith('nba_cycled') &&
                    !claimedFAIds.has(p.id) &&
                    calculateOverall(p) >= budget.minOvrFreeAgent
                )
                .sort((a, b) => {
                    const aCount = teamRoster.filter(p => p.position === a.position).length;
                    const bCount = teamRoster.filter(p => p.position === b.position).length;
                    
                    const aOvr = calculateOverall(a);
                    const bOvr = calculateOverall(b);

                    // 1. STAR CLASHING: If we have a 90+ star, don't sign another 82+ at same spot
                    const hasStarA = teamRoster.some(p => p.position === a.position && calculateOverall(p) >= 88);
                    const hasStarB = teamRoster.some(p => p.position === b.position && calculateOverall(p) >= 88);
                    
                    const starPenaltyA = (hasStarA && aOvr >= 80) ? -40 : 0;
                    const starPenaltyB = (hasStarB && bOvr >= 80) ? -40 : 0;

                    // 2. TOP 5 IMPROVEMENT: If player doesn't beat our current starter, reduce value
                    const bestAtPosA = teamRoster.filter(p => p.position === a.position).reduce((max, p) => Math.max(max, calculateOverall(p)), 0);
                    const bestAtPosB = teamRoster.filter(p => p.position === b.position).reduce((max, p) => Math.max(max, calculateOverall(p)), 0);
                    
                    const improvementA = aOvr > bestAtPosA ? 15 : -10;
                    const improvementB = bOvr > bestAtPosB ? 15 : -10;

                    // 3. ROSTER SYMMETRY
                    const getPosWeight = (count: number) => {
                        if (count === 0) return 60; // Desperate
                        if (count === 1) return 30; // Need backup
                        if (count === 2) return 0;  // Standard
                        if (count >= 3) return -50; // Surplus (Avoid)
                        return 0;
                    };

                    const aScore = aOvr + getPosWeight(aCount) + starPenaltyA + improvementA;
                    const bScore = bOvr + getPosWeight(bCount) + starPenaltyB + improvementB;
                    
                    return bScore - aScore;
                });

            let faSignCount = 0;
            for (const fa of freeAgents) {
                if (faSignCount >= budget.freeAgentSlots) break;
                if (team.rosterIds.length >= 15) break;
                const result = signPlayer(fa, team, archetype, 'FREE_AGENT', updatedPlayers, updatedContracts, gameYear);
                if (result.success) {
                    claimedFAIds.add(fa.id);
                    faSignCount++;
                    signingLog.push(`[${archetype}] ${team.name} signed FA ${fa.firstName} ${fa.lastName} (OVR ${calculateOverall(fa)})`);
                    if (result.transaction) transactions.push(result.transaction);
                }
            }
        }

        // ── Source 2: YOUNGLINGS ─────────────────────────────────────────────
        {
            const younglings = remainingLocalTalentPool
                .filter(t => {
                    const ovr = calculateOverall(t);
                    const pot = t.potential ?? 75;
                    if (archetype === 'CONTENDER') return pot >= 88 || ovr >= 72;
                    if (archetype === 'PLAYOFF_PUSH') return pot >= 82 || ovr >= 68;
                    if (archetype === 'REBUILDER' || archetype === 'TALENT_FARM') return pot >= 75;
                    return pot >= 72; // BUDGET_CLUB
                })
                .sort((a, b) => {
                    const valA = (calculateOverall(a) * 0.4) + ((a.potential ?? 75) * 0.6);
                    const valB = (calculateOverall(b) * 0.4) + ((b.potential ?? 75) * 0.6);
                    return valB - valA;
                });

            let youngSignCount = 0;
            for (const yt of younglings) {
                if (youngSignCount >= budget.younglingSlots) break;
                if (team.rosterIds.length >= 15) break;

                const youngAsPlayer: Player = {
                    id: yt.id,
                    firstName: yt.firstName,
                    lastName: yt.lastName,
                    age: yt.age,
                    position: yt.position,
                    height: yt.height ?? 195,
                    weight: yt.weight ?? 90,
                    personality: 'Professional',
                    overall: calculateOverall(yt),
                    potential: yt.potential ?? 80,
                    attributes: yt.attributes,
                    tendencies: {
                        shooting: 50,
                        passing: 50,
                        inside: 50,
                        outside: 50,
                        defensiveAggression: 50,
                        foulTendency: 50
                    },
                    teamId: team.id,
                    morale: 80,
                    fatigue: 0,
                    stamina: 100,
                    seasonStats: {
                        gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                        steals: 0, blocks: 0, turnovers: 0, fouls: 0, offensiveRebounds: 0,
                        defensiveRebounds: 0, fgMade: 0, fgAttempted: 0, threeMade: 0,
                        threeAttempted: 0, ftMade: 0, ftAttempted: 0, rimMade: 0,
                        rimAttempted: 0, rimAssisted: 0, midRangeMade: 0, midRangeAttempted: 0,
                        midRangeAssisted: 0, threePointAssisted: 0, plusMinus: 0
                    },
                    careerStats: [],
                    jerseyNumber: Math.floor(Math.random() * 50),
                    minutes: 0,
                    isStarter: false,
                    loveForTheGame: 10,
                    yearsOfService: 0,
                    acquisition: { type: 'free_agent', year: gameYear, details: 'Academy Graduate' }
                };

                const result = signPlayer(youngAsPlayer, team, archetype, 'YOUNGLING', updatedPlayers, updatedContracts, gameYear);
                if (result.success) {
                    remainingLocalTalentPool = remainingLocalTalentPool.filter(t => t.id !== yt.id);
                    youngSignCount++;
                    signingLog.push(`[${archetype}] ${team.name} signed YOUNGLING ${yt.firstName} ${yt.lastName} (POT ${yt.potential})`);
                    if (result.transaction) transactions.push(result.transaction);
                }
            }
        }

        // ── Source 3: NBA VETERANS ───────────────────────────────────────────
        if (budget.nbaVetSlots > 0) {
            const availableVets = nbaPool
                .filter(p =>
                    !claimedNBAIds.has(p.id) &&
                    calculateOverall(p) >= budget.minOvrNBAVet
                )
                .sort((a, b) => {
                    const aCount = teamRoster.filter(p => p.position === a.position).length;
                    const bCount = teamRoster.filter(p => p.position === b.position).length;
                    
                    const aOvr = calculateOverall(a);
                    const bOvr = calculateOverall(b);

                    const hasStarA = teamRoster.some(p => p.position === a.position && calculateOverall(p) >= 88);
                    const hasStarB = teamRoster.some(p => p.position === b.position && calculateOverall(p) >= 88);
                    
                    const starPenaltyA = (hasStarA && aOvr >= 80) ? -40 : 0;
                    const starPenaltyB = (hasStarB && bOvr >= 80) ? -40 : 0;

                    const bestAtPosA = teamRoster.filter(p => p.position === a.position).reduce((max, p) => Math.max(max, calculateOverall(p)), 0);
                    const bestAtPosB = teamRoster.filter(p => p.position === b.position).reduce((max, p) => Math.max(max, calculateOverall(p)), 0);
                    
                    const improvementA = aOvr > bestAtPosA ? 15 : -10;
                    const improvementB = bOvr > bestAtPosB ? 15 : -10;

                    const getPosWeight = (count: number) => {
                        if (count === 0) return 60;
                        if (count === 1) return 30;
                        if (count >= 3) return -50;
                        return 0;
                    };

                    const aScore = aOvr + getPosWeight(aCount) + starPenaltyA + improvementA;
                    const bScore = bOvr + getPosWeight(bCount) + starPenaltyB + improvementB;
                    
                    return bScore - aScore;
                });

            let vetSignCount = 0;
            for (const vet of availableVets) {
                if (vetSignCount >= budget.nbaVetSlots) break;
                if (team.rosterIds.length >= 15) break;

                // NBA vets are not in updatedPlayers yet — add them
                const result = signPlayer(vet, team, archetype, 'NBA_VET', updatedPlayers, updatedContracts, gameYear);
                if (result.success) {
                    claimedNBAIds.add(vet.id);
                    vetSignCount++;
                    signingLog.push(`[${archetype}] ${team.name} signed NBA VET ${vet.firstName} ${vet.lastName} (OVR ${calculateOverall(vet)})`);
                    if (result.transaction) transactions.push(result.transaction);
                }
            }
        }
    }

    return {
        updatedTeams,
        updatedPlayers,
        updatedContracts,
        remainingLocalTalentPool,
        remainingNBAPool: nbaPool.filter(p => !claimedNBAIds.has(p.id)),
        signingLog,
        transactions
    };
}
