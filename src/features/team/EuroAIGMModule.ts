import { generateUUID } from '../../utils/uuid';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Contract } from '../../models/Contract';
import { calculateOverall } from '../../utils/playerUtils';

export type EuroTeamTarget = 
    | 'EuroLeague Title Contender'
    | 'EuroLeague Playoff Push'
    | 'EuroLeague Avoid Relegation'
    | 'EuroCup Promotion Chaser'
    | 'EuroCup Talent Farm';

/**
 * Calculates a team's prestige (0-100) based on league, performance, and market.
 * Used by players to decide where to sign.
 */
export function calculateTeamPrestige(team: Team): number {
    // 1. Base by League
    let p = team.conference === 'EuroLeague' ? 75 : 35;

    // 2. Performance Bonus (Last Season)
    const lastSeason = team.history?.[team.history.length - 1];
    if (lastSeason) {
        if (lastSeason.playoffResult === 'Champion') p += 15;
        else if (lastSeason.playoffResult === 'Finalist') p += 10;
        else if (lastSeason.playoffResult === 'Final Four') p += 7;
        else if (lastSeason.playoffResult === 'Playoffs') p += 4;
        
        // Promotion/Relegation feel
        if (team.conference === 'EuroLeague' && lastSeason.wins < 10) p -= 10;
        if (team.conference === 'EuroCup' && lastSeason.wins > 20) p += 10;
    }

    // 3. Market Factor
    if (team.marketSize === 'Large') p += 5;
    if (team.marketSize === 'Small') p -= 5;

    return Math.max(0, Math.min(100, p));
}

export interface TeamNeeds {
    scoring: number;    // 0-10 (Importance)
    defense: number;
    playmaking: number;
    rebounding: number;
}

/**
 * Evaluates the team's statistical deficiencies to prioritize transfer targets.
 */
export function calculateEuroTeamNeeds(team: Team, roster: Player[]): TeamNeeds {
    if (roster.length === 0) return { scoring: 5, defense: 5, playmaking: 5, rebounding: 5 };

    const totalGames = team.wins + team.losses;
    // Base needs on team ratings or recent performance if available
    // For now, we look at the average attributes of the top 8 players (the main rotation)
    const rotation = [...roster].sort((a, b) => calculateOverall(b) - calculateOverall(a)).slice(0, 8);
    
    const avgFinishing = rotation.reduce((sum, p) => sum + p.attributes.finishing + p.attributes.midRange + p.attributes.threePointShot, 0) / (rotation.length * 3);
    const avgDefense = rotation.reduce((sum, p) => sum + p.attributes.interiorDefense + p.attributes.perimeterDefense, 0) / (rotation.length * 2);
    const avgPlaymaking = rotation.reduce((sum, p) => sum + p.attributes.playmaking + p.attributes.ballHandling, 0) / (rotation.length * 2);
    const avgRebounding = rotation.reduce((sum, p) => sum + p.attributes.offensiveRebound + p.attributes.defensiveRebound, 0) / (rotation.length * 2);

    return {
        scoring: Math.max(0, 85 - avgFinishing) / 5,
        defense: Math.max(0, 85 - avgDefense) / 5,
        playmaking: Math.max(0, 85 - avgPlaymaking) / 5,
        rebounding: Math.max(0, 85 - avgRebounding) / 5
    };
}

/**
 * Dynamically evaluates a team's roster and financial standing to set their goal for the season.
 */
export function determineEuroTeamTarget(team: Team, roster: Player[]): EuroTeamTarget {
    // Basic evaluation of the current roster's strength
    const sortedOvr = roster.map(p => calculateOverall(p)).sort((a, b) => b - a);
    const top5Avg = sortedOvr.slice(0, 5).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(5, sortedOvr.length));
    
    if (team.conference === 'EuroLeague') {
        if (top5Avg >= 82 || team.cash >= 20000000) {
            return 'EuroLeague Title Contender';
        } else if (top5Avg >= 77) {
            return 'EuroLeague Playoff Push';
        } else {
            return 'EuroLeague Avoid Relegation';
        }
    } else {
        // EuroCup
        if (team.isRelegatedParachute || top5Avg >= 74 || team.cash >= 8000000) {
            return 'EuroCup Promotion Chaser';
        } else {
            return 'EuroCup Talent Farm';
        }
    }
}

/**
 * AI Logic for Euro teams interacting with the Local Talents Academy pool.
 */
export function simulateEuroAI_LocalTalentDraft(
    teams: Team[], 
    localTalentPool: any[], 
    currentPlayers: Player[], 
    currentContracts: Contract[], 
    currentYear: number
) {
    let updatedPlayers = [...currentPlayers];
    let updatedContracts = [...currentContracts];
    let updatedTeams = teams.map(t => ({ ...t, rosterIds: [...t.rosterIds] }));
    let remainingPool = [...localTalentPool];

    // Teams take turns evaluating the pool.
    // Order: Weaker teams (lower top 5 OVR / lower cash) get priority or take more chances.
    // For simplicity, sort teams by cash ascending so poorer teams pick first from the farm.
    const sortedTeams = [...updatedTeams].sort((a, b) => a.cash - b.cash);

    sortedTeams.forEach(team => {
        // Skip user team. User signs manually.
        if (team.id === updatedTeams.find(t => t.id === 'user')?.id) return; // Note: userTeamId should be passed or ignored appropriately later.

        const teamRoster = updatedPlayers.filter(p => p.teamId === team.id);
        const target = determineEuroTeamTarget(team, teamRoster);
        
        // Count current roster size
        if (team.rosterIds.length >= 15) return; 

        // Filter the pool based on team standards
        const interestedTalents = remainingPool.filter(talent => {
            const ovr = talent.attributes.overall;
            const pot = talent.attributes.potential;

            if (target === 'EuroLeague Title Contender') {
                // Giants only care for extremely good talent
                return ovr >= 70 || pot >= 88;
            } else if (target === 'EuroLeague Playoff Push' || target === 'EuroLeague Avoid Relegation') {
                // Mid/Low EL teams need help or future profit
                return ovr >= 65 || pot >= 82;
            } else if (target === 'EuroCup Promotion Chaser') {
                // Top EC teams want decent rotation players or high ceiling
                return ovr >= 62 || pot >= 80;
            } else {
                // Talent Farm: takes chances on younglings for future profit
                return pot >= 75; 
            }
        });

        // Sort by perceived value (potential is highly valued for profit, OVR for immediate help)
        interestedTalents.sort((a, b) => {
            const valA = (a.attributes.overall * 0.4) + (a.attributes.potential * 0.6);
            const valB = (b.attributes.overall * 0.4) + (b.attributes.potential * 0.6);
            return valB - valA;
        });

        // Determine how many to sign based on target
        let maxToSign = 0;
        if (target === 'EuroCup Talent Farm') maxToSign = 2;
        else if (target === 'EuroLeague Title Contender') maxToSign = 1;
        else maxToSign = 1;

        let signed = 0;
        while (signed < maxToSign && interestedTalents.length > 0 && team.rosterIds.length < 15) {
            const pick = interestedTalents.shift();
            if (!pick) break;

            // Remove from remaining pool
            remainingPool = remainingPool.filter(t => t.id !== pick.id);

            // Convert to Player
            const newPlayer: Player = {
                id: pick.id,
                firstName: pick.firstName,
                lastName: pick.lastName,
                age: pick.age,
                position: pick.position,
                height: pick.height,
                weight: pick.weight,
                personality: 'Professional',
                overall: pick.attributes.overall,
                potential: pick.attributes.potential,
                attributes: {
                    finishing: pick.attributes.insideScoring || 60,
                    midRange: pick.attributes.outsideScoring || 60,
                    threePointShot: pick.attributes.outsideScoring || 60,
                    freeThrow: 75,
                    playmaking: pick.attributes.playmaking || 60,
                    ballHandling: pick.attributes.playmaking || 60,
                    offensiveRebound: pick.attributes.rebounding || 50,
                    defensiveRebound: pick.attributes.rebounding || 50,
                    interiorDefense: pick.attributes.interiorDefense || 60,
                    perimeterDefense: pick.attributes.perimeterDefense || 60,
                    stealing: pick.attributes.perimeterDefense || 60,
                    blocking: pick.attributes.interiorDefense || 60,
                    athleticism: pick.attributes.athletic || 60,
                    basketballIQ: pick.attributes.basketballIq || 60
                },
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
                acquisition: {
                    type: 'free_agent',
                    year: currentYear,
                    details: 'Academy Graduate'
                }
            };

            // Contract (Cheap 3-year rookie deal)
            const contract: Contract = {
                id: generateUUID(),
                playerId: newPlayer.id,
                teamId: team.id,
                amount: 300000,
                yearsLeft: 3,
                startYear: currentYear,
                role: 'Prospect'
            };

            updatedPlayers.push(newPlayer);
            updatedContracts.push(contract);
            team.rosterIds.push(newPlayer.id);
            team.cash -= 300000;
            if (team.salaryCapSpace !== undefined) {
                team.salaryCapSpace -= 300000;
            }
            signed++;
        }
    });

    return { updatedTeams, updatedPlayers, updatedContracts, remainingPool };
}

/**
 * Modifies perceived value of a Free Agent based on the dynamic Euro Target.
 * Replaces the generic AI evaluation.
 */
export function evaluateEuroFreeAgentValue(player: Player, team: Team, roster: Player[], baseValue: number): number {
    const target = determineEuroTeamTarget(team, roster);
    let modifiedValue = baseValue;

    if (target === 'EuroLeague Title Contender') {
        // Wants best player. Heavily favors high OVR veterans over raw potential.
        modifiedValue += (player.overall * 1.5);
        if (player.age >= 26 && player.age <= 32) modifiedValue *= 1.2;
        
        // AGING LEGEND LOGIC: If the team has high cash, they don't penalize older players as much
        // because they can afford to keep legends AND sign new stars.
        if (player.age > 33 && team.cash > 15000000) {
            modifiedValue *= 1.1; // Loyalty/Leadership bonus
        }
    } 
    else if (target === 'EuroCup Talent Farm' || target === 'EuroLeague Avoid Relegation') {
        // Wants younglings to elevate the team in future seasons.
        if (player.age <= 23) {
            modifiedValue *= 1.5; // Big boost to young players
            modifiedValue += (player.potential * 1.0);
        } else if (player.age > 30) {
            modifiedValue *= 0.6; // Avoid old players, no resale value
        }
    }
    else {
        // Balanced approach for Playoff Push / Promotion Chasers
        if (player.overall >= 75) modifiedValue *= 1.1; // Wants immediate help to push
    }

    return modifiedValue;
}

/**
 * Determines if a player is "Untouchable" for the European market.
 * Core players are not for sale unless the team is failing or broke.
 */
export function isEuroPlayerUntouchable(
    player: Player, 
    sellingTeam: Team, 
    sellingTeamRoster: Player[], 
    buyerTeam: Team
): { untouchable: boolean; reason?: string } {
    const isUserBuying = buyerTeam.id === 'user' || buyerTeam.id.includes('user'); // Basic check

    // Rule: EuroLeague teams can buy ALL EuroCup players (no untouchables for them)
    if (buyerTeam.conference === 'EuroLeague' && sellingTeam.conference === 'EuroCup') {
        return { untouchable: false };
    }

    // Identify Core Players (Top 3 by OVR)
    const sortedRoster = [...sellingTeamRoster].sort((a, b) => calculateOverall(b) - calculateOverall(a));
    const isCore = sortedRoster.slice(0, 3).some(p => p.id === player.id);
    
    if (!isCore) return { untouchable: false };

    // Financial Distress Exception
    if (sellingTeam.cash <= 0) return { untouchable: false };

    // Failing Targets Exception
    const target = determineEuroTeamTarget(sellingTeam, sellingTeamRoster);
    const totalGames = sellingTeam.wins + sellingTeam.losses;
    const winPct = totalGames > 0 ? (sellingTeam.wins / totalGames) : 1.0;

    if (totalGames >= 15) {
        if (target.includes('Contender') && winPct < 0.45) return { untouchable: false };
        if (target.includes('Playoff') && winPct < 0.35) return { untouchable: false };
        if (target.includes('Promotion') && winPct < 0.35) return { untouchable: false };
    }

    // If none of the exceptions met, a Core player is untouchable for peer/lower teams
    return { 
        untouchable: true, 
        reason: `${player.lastName} is a core player of our project. We are not listening to offers while we are on track for our targets.` 
    };
}

/**
 * [STUB] Calculates the required cash buyout fee to poach a player from a Euro team.
 * Follows European soccer/basketball transfer logic instead of NBA player-for-player trades.
 */
export function calculateEuroBuyoutFee(player: Player, sellingTeam: Team, sellingTeamRoster: Player[], allContracts: Contract[]): number {
    // 0. NBA Players are free agents for the purpose of the European market
    if (player.id.startsWith('nba_')) return 0;

    // 0.1 Check for explicit Release Clause in contract
    const contract = allContracts.find(c => c.playerId === player.id);
    if (contract?.buyoutClause) {
        return contract.buyoutClause;
    }

    // 1. Base Value based on OVR and Potential (Scaled for €5M-€7M peak)
    let baseFee = (player.overall * 30000) + (player.potential * 15000);
    if (player.age < 24) baseFee *= 1.3;

    // 2. Irreplaceability factor (More conservative multipliers)
    const samePositionPlayers = sellingTeamRoster.filter(p => p.position === player.position && p.id !== player.id);
    const bestBackupOvr = samePositionPlayers.length > 0 
        ? Math.max(...samePositionPlayers.map(p => calculateOverall(p))) 
        : 0;
    
    const ovrDropoff = calculateOverall(player) - bestBackupOvr;

    if (ovrDropoff > 10) {
        // Irreplaceable star: Demand premium
        baseFee *= 1.6;
    } else if (ovrDropoff > 5) {
        // Hard to replace
        baseFee *= 1.3;
    }

    // 3. Financial distress (Fire Sale)
    if (sellingTeam.cash <= 0) {
        baseFee *= 0.6; // Desperate for cash
    }

    // 4. League Tier Adjustment
    if (sellingTeam.conference === 'EuroCup') {
        baseFee *= 0.7; // EuroCup players are generally cheaper
    }

    return Math.round(baseFee);
}

/**
 * Scores how well a player fits the team's specific needs.
 * Returns a multiplier (e.g., 1.5 if perfect fit, 0.8 if poor fit).
 */
export function calculatePlayerFitScore(player: Player, needs: TeamNeeds): number {
    let score = 0;
    
    // Evaluate how well the player's best skills match the team's top needs
    const playerScoring = (player.attributes.finishing + player.attributes.midRange + player.attributes.threePointShot) / 3;
    const playerDefense = (player.attributes.interiorDefense + player.attributes.perimeterDefense) / 2;
    const playerPlaymaking = (player.attributes.playmaking + player.attributes.ballHandling) / 2;
    const playerRebounding = (player.attributes.offensiveRebound + player.attributes.defensiveRebound) / 2;

    score += (playerScoring / 100) * needs.scoring;
    score += (playerDefense / 100) * needs.defense;
    score += (playerPlaymaking / 100) * needs.playmaking;
    score += (playerRebounding / 100) * needs.rebounding;

    // Normalize: Avg need is 5, avg skill is 70. 
    // Max theoretical raw score: (100/100 * 10) * 4 = 40. 
    // Expected good fit score: ~15-20.
    return 0.7 + (score / 20); 
}

/**
 * Triggers a 'Panic Buy' state if a key player is injured for a long duration.
 */
export function calculatePanicTrigger(team: Team, roster: Player[]): { panic: boolean; position?: string } {
    // Check for players injured for 4+ weeks
    const longTermInjuries = roster.filter(p => p.injury && p.injury.returnDate && (
        (new Date(p.injury.returnDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) >= 25
    ));
    
    if (longTermInjuries.length === 0) return { panic: false };

    // If any of the top 5 players are out long-term, it's a panic trigger
    const sortedRoster = [...roster].sort((a, b) => calculateOverall(b) - calculateOverall(a));
    const top5 = sortedRoster.slice(0, 5);
    
    const injuredKeyPlayer = longTermInjuries.find(p => top5.some(s => s.id === p.id));
    
    if (injuredKeyPlayer) {
        return { panic: true, position: injuredKeyPlayer.position };
    }
    
    return { panic: false };
}
