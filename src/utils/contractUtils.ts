import type { Player } from '../models/Player';
import type { Contract } from '../models/Contract';
import type { Team } from '../models/Team';
import { calculateOverall } from './playerUtils';
import { generateUUID } from './uuid';

export const calculatePlayerValuation = (player: Player): number => {
    if (!player.seasonStats || player.seasonStats.gamesPlayed < 10) return calculateOverall(player);

    const s = player.seasonStats;
    const gp = s.gamesPlayed;
    const gmSc = (s.points + 0.4 * s.fgMade - 0.7 * s.fgAttempted - 0.4 * (s.ftAttempted - s.ftMade) + 0.5 * s.offensiveRebounds + 0.3 * s.defensiveRebounds + s.steals + 0.6 * s.assists + 0.6 * s.blocks - 0.4 * s.fouls - s.turnovers) / gp;
    let perfOvr = 58 + (gmSc * 1.3);
    if (s.points / gp < 5 && perfOvr > 75) perfOvr -= 5;
    return Math.max(40, Math.min(99, perfOvr));
};

export const calculateContractAmount = (player: Player, salaryCap: number = 140000000): { amount: number; years: number; type?: 'standard' | 'prove_it' | 'breakout'; explanation: string } => {
    const overall = calculateOverall(player);
    const performanceVal = calculatePlayerValuation(player);

    // NBA MAX CONTRACT RULES
    // 0-6 Years: 25% of cap
    // 7-9 Years: 30% of cap
    // 10+ Years: 35% of cap
    const getMaxPercentage = (years: number) => {
        if (years >= 10) return 0.35;
        if (years >= 7) return 0.30;
        return 0.25;
    };

    const maxPct = getMaxPercentage(player.yearsOfService || 0);
    const maxSalary = salaryCap * maxPct;
    const minSalary = salaryCap * 0.008;

    const getBaseValue = (ovr: number) => {
        if (ovr >= 93) return maxSalary;
        if (ovr >= 88) return maxSalary * 0.85;
        if (ovr >= 84) return maxSalary * 0.65;
        if (ovr >= 80) return salaryCap * 0.15;
        if (ovr >= 76) return salaryCap * 0.08;
        if (ovr >= 72) return salaryCap * 0.04;
        return minSalary;
    };

    const ovrValue = getBaseValue(overall);
    const perfValue = getBaseValue(performanceVal);

    let amount = (ovrValue * 0.7 + perfValue * 0.3);
    let years = overall > 80 ? 4 : (overall > 74 ? 3 : 2);
    let explanation = "Standard Market Value.";
    let type: 'standard' | 'prove_it' | 'breakout' = 'standard';

    const diff = performanceVal - overall;
    if (diff < -4 && player.age < 32) {
        amount = (ovrValue * 0.4 + perfValue * 0.6);
        years = 1;
        type = 'prove_it';
        explanation = `Underperformed (${performanceVal.toFixed(0)} rating). Prove-it deal.`;
    } else if (diff > 3) {
        amount = (ovrValue * 0.3 + perfValue * 0.7);
        years = Math.min(4, player.age > 30 ? 2 : 4);
        type = 'breakout';
        explanation = `Breakout Season! Cashing in.`;
    }

    // Age Decline
    if (player.age >= 32) {
        const agePenalty = (player.age - 31) * 0.08;
        const successMod = performanceVal > 85 ? 0.4 : 1.0;
        amount *= (1 - (agePenalty * successMod));
        years = Math.min(years, (player.age > 35 ? 1 : 2));
    }

    // Clamp
    amount = Math.max(minSalary, Math.min(amount, maxSalary));

    return { amount: Math.floor(amount), years, type, explanation };
};

export const generateContract = (player: Player, startYear: number, salaryCap: number = 140000000): Contract => {
    const { amount, years } = calculateContractAmount(player, salaryCap);
    return {
        id: generateUUID(),
        playerId: player.id,
        teamId: player.teamId || '',
        amount: amount,
        yearsLeft: years,
        startYear: startYear,
        role: 'Rotation'
    };
};

export const calculateTeamCapSpace = (team: Team, contracts: Contract[], salaryCap: number): number => {
    const teamContracts = contracts.filter(c => c.teamId === team.id && c.yearsLeft > 0);
    const totalSalary = teamContracts.reduce((sum, c) => sum + c.amount, 0);
    return salaryCap - totalSalary;
};

export const calculateAdjustedDemand = (
    player: Player,
    baseAmount: number,
    baseYears: number,
    offeredRole: string,
    offeredYears: number,
    isHomeTeam: boolean = false
): number => {
    let multiplier = 1.0;

    // Role Adjustments
    if (offeredRole === 'Starter' || offeredRole === 'Star') multiplier *= 0.95; // Happy to start
    if (offeredRole === 'Bench' || offeredRole === 'Prospect') multiplier *= 1.15; // Want more money to sit

    // Years Adjustments
    if (offeredYears > baseYears) multiplier *= 0.92; // Security discount
    if (offeredYears < baseYears) multiplier *= 1.08; // Short term premium

    // Home Team Discount
    if (isHomeTeam) multiplier *= 0.95;

    return Math.floor(baseAmount * multiplier);
};
