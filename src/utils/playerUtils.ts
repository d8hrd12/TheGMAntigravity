import type { Player, PlayerAttributes, Position } from "../models/Player";


const POSITION_WEIGHTS: Record<string, Record<keyof PlayerAttributes, number>> = {
    'PG': {
        finishing: 1.5, midRange: 2.0, threePointShot: 3.0, freeThrow: 1.0,
        playmaking: 4.0, ballHandling: 4.0, offensiveRebound: 0.1,
        interiorDefense: 0.2, perimeterDefense: 2.5, stealing: 2.5, blocking: 0.1,
        defensiveRebound: 0.5, athleticism: 3.5, basketballIQ: 3.5
    },
    'SG': {
        finishing: 2.5, midRange: 3.0, threePointShot: 4.0, freeThrow: 1.5,
        playmaking: 2.0, ballHandling: 2.5, offensiveRebound: 0.2,
        interiorDefense: 0.5, perimeterDefense: 3.0, stealing: 2.0, blocking: 0.5,
        defensiveRebound: 1.0, athleticism: 3.5, basketballIQ: 2.0
    },
    'SF': {
        finishing: 3.0, midRange: 2.5, threePointShot: 2.5, freeThrow: 1.5,
        playmaking: 1.5, ballHandling: 2.0, offensiveRebound: 1.5,
        interiorDefense: 2.0, perimeterDefense: 3.5, stealing: 2.0, blocking: 1.5,
        defensiveRebound: 2.0, athleticism: 3.0, basketballIQ: 2.5
    },
    'PF': {
        finishing: 4.0, midRange: 2.0, threePointShot: 1.0, freeThrow: 1.5,
        playmaking: 1.0, ballHandling: 1.0, offensiveRebound: 3.5,
        interiorDefense: 3.5, perimeterDefense: 1.5, stealing: 1.0, blocking: 3.0,
        defensiveRebound: 3.5, athleticism: 2.5, basketballIQ: 2.5
    },
    'C': {
        finishing: 4.5, midRange: 1.0, threePointShot: 0.1, freeThrow: 1.5,
        playmaking: 0.5, ballHandling: 0.5, offensiveRebound: 4.0,
        interiorDefense: 4.0, perimeterDefense: 0.5, stealing: 0.5, blocking: 4.0,
        defensiveRebound: 4.0, athleticism: 2.0, basketballIQ: 2.5
    }
};

// Accepting either a full Player object OR just the attributes
// Also accepts an optional Position argument to override or provide context if input is just attributes
export const calculateOverall = (input: Player | PlayerAttributes, positionArg?: string): number => {
    const isPlayer = 'attributes' in input;
    const attr = isPlayer ? (input as Player).attributes : (input as PlayerAttributes);
    
    // Calculate the max OVR across all positions to give players a true rating
    // regardless of their arbitrarily assigned position (e.g. Tatum at PF)
    let maxOverall = 0;
    const positionsToTest = ['PG', 'SG', 'SF', 'PF', 'C'];
    
    positionsToTest.forEach(pos => {
        const weights = POSITION_WEIGHTS[pos];
        if (!weights) return;

        let totalWeightedScore = 0;
        let totalMaxWeight = 0;

        (Object.keys(weights) as Array<keyof PlayerAttributes>).forEach(key => {
            const weight = weights[key] as number;
            const val = attr[key];
            if (typeof val === 'number') {
                totalWeightedScore += val * weight;
                totalMaxWeight += 99 * weight;
            }
        });

        if (totalMaxWeight > 0) {
            const normalized = (totalWeightedScore / totalMaxWeight) * 99;
            const finalOvr = Math.min(99, Math.round(normalized));
            if (finalOvr > maxOverall) maxOverall = finalOvr;
        }
    });

    return maxOverall || 50; // Fallback
};

import type { SeasonAwards } from "../models/Awards";

export const checkHallOfFameEligibility = (player: Player, awardsHistory: SeasonAwards[]): boolean => {
    let score = 0;

    // Career Totals
    const totalPoints = (player.careerStats || []).reduce((sum, s) => sum + s.points, 0);
    // const totalAssists = (player.careerStats || []).reduce((sum, s) => sum + s.assists, 0); 
    // const totalRebounds = (player.careerStats || []).reduce((sum, s) => sum + s.rebounds, 0);

    // Milestones
    if (totalPoints > 30000) score += 50; // Lock
    else if (totalPoints > 20000) score += 25;
    else if (totalPoints > 15000) score += 10;

    // Awards Analysis
    awardsHistory.forEach(season => {
        // MVP (Major Impact)
        if (season.mvp.playerId === player.id) score += 25;

        // Finals MVP (Major Impact)
        if (season.finalsMvp?.playerId === player.id) score += 20;

        // DPOY
        if (season.dpoy.playerId === player.id) score += 10;

        // All-Stars
        const isWestAllStar = season.allStars.west.some(as => as.playerId === player.id);
        const isEastAllStar = season.allStars.east.some(as => as.playerId === player.id);
        if (isWestAllStar || isEastAllStar) score += 5;

        // Champions
        const careerYear = (player.careerStats || []).find(c => c.season === season.year);
        // Also check current season if not yet in career stats? 
        // Usually careerStats are archived at end of season, and awardsHistory is updated.
        // If checking at retirement, careerStats should be full.
        if (season.champion && careerYear && careerYear.teamId === season.champion.teamId) {
            score += 15; // Ring value
        }
    });

    // Score Threshold
    // 1 MVP (25) + 5 All-Star (25) = 50 -> HOF
    // 3 Rings (45) + Role Player = 45 -> close, maybe not?
    // 20k Points (25) + 5 All-Star (25) = 50 -> HOF
    return score >= 50;
};
// Helper to get letter grade from potential
export const getPotentialGrade = (potential: number): string => {
    if (potential >= 95) return 'S'; // Elite
    if (potential >= 90) return 'A+';
    if (potential >= 85) return 'A';
    if (potential >= 80) return 'B+';
    if (potential >= 75) return 'B';
    if (potential >= 70) return 'C+';
    if (potential >= 65) return 'C';
    if (potential >= 60) return 'D+';
    if (potential >= 50) return 'D';
    return 'F';
};

/**
 * Calculates a fair annual salary based on player Overall (OVR)
 * Formula: Min Salary + (Normalized OVR ^ 2.5) * (Max - Min)
 */
export const calculateFairSalary = (ovr: number): number => {
    const MIN_SALARY = 1100000;
    const MAX_SALARY = 50000000;
    const MIN_OVR = 65;
    const MAX_OVR = 99;

    if (ovr <= MIN_OVR) return MIN_SALARY;
    
    let salary = MIN_SALARY;
    if (ovr >= 95) {
        salary = 45000000 + ((ovr - 95) / 4) * 5000000; // 45M to 50M
    } else if (ovr >= 90) {
        salary = 35000000 + ((ovr - 90) / 5) * 10000000; // 35M to 45M
    } else if (ovr >= 85) {
        salary = 25000000 + ((ovr - 85) / 5) * 10000000; // 25M to 35M
    } else if (ovr >= 80) {
        salary = 15000000 + ((ovr - 80) / 5) * 10000000; // 15M to 25M
    } else if (ovr >= 75) {
        salary = 8000000 + ((ovr - 75) / 5) * 7000000; // 8M to 15M
    } else if (ovr >= 70) {
        salary = 3000000 + ((ovr - 70) / 5) * 5000000; // 3M to 8M
    } else {
        salary = MIN_SALARY + ((ovr - 65) / 5) * (3000000 - MIN_SALARY);
    }

    // Round to nearest 100k for cleaner look
    return Math.round(salary / 100000) * 100000;
};

export const calculateTendencies = (player: Player, minutes: number = 0, teammates: Player[] = []): Player['tendencies'] => {
    const attr = player.attributes;
    const ovr = calculateOverall(player);
    const position = player.position;

    // 1. CORE PRINCIPLE: Tendencies are INDEPENDENT, skill-driven values.
    //    NOT a zero-sum budget. Elite players score AND facilitate at high volume.
    //    A Jokic-type (95 shoot, 96 pass) should have BOTH high, not one killing the other.

    const scoringSkills = [attr.finishing, attr.midRange, attr.threePointShot].sort((a, b) => b - a);
    const shootSkill = (scoringSkills[0] * 0.60) + (scoringSkills[1] * 0.30) + (scoringSkills[2] * 0.10);
    const passSkill  = (attr.playmaking * 0.6) + (attr.basketballIQ * 0.3) + (attr.ballHandling * 0.1);

    // 2. BASE TENDENCIES directly from skill (70 skill = 70 base tendency)
    let finalShooting = shootSkill;
    let finalPassing  = passSkill;

    // 3. STAR MULTIPLIER: elite scorers see more looks and take more shots
    //    Applied only to shooting — passing stays pure skill
    if (ovr >= 89 && (position === 'PG' || position === 'SG' || position === 'SF')) {
        finalShooting = Math.min(92, finalShooting * 1.10); // Superstar
    } else if (ovr >= 85 && (position === 'PG' || position === 'SG' || position === 'SF')) {
        finalShooting = Math.min(90, finalShooting * 1.05); // Star
    } else if (ovr >= 88) {
        // Elite big man scorer (Jokic etc) — smaller boost
        finalShooting = Math.min(88, finalShooting * 1.06);
    }

    // 4. ROLE PLAYER DEFER: non-elite scorers pull back shooting, NOT passing
    //    They still move the ball, they just don't create their own shot
    if (shootSkill < 78) {
        const deferFactor = 0.65 + (shootSkill - 60) * 0.01; // 60 skill → 0.65x, 77 skill → 0.82x
        finalShooting = finalShooting * Math.max(0.55, deferFactor);
    }

    // 5. NON-SHOOTER HARD CAP
    if (shootSkill < 65) finalShooting = Math.min(finalShooting, 52);
    if (shootSkill < 55) finalShooting = Math.min(finalShooting, 38);

    // 6. MINUTES SCALING: bench players don't get as many looks
    if (minutes < 15) {
        finalShooting *= 0.72;
        finalPassing  *= 0.85;
    } else if (minutes < 22) {
        finalShooting *= 0.85;
    }

    // 7. POSITIONAL BIG-MAN CAP: one-dimensional bigs shouldn't ISO-shoot
    if (position === 'C' || position === 'PF') {
        const isOneDimensional = attr.midRange < 60 && attr.threePointShot < 60 && attr.playmaking < 60;
        if (isOneDimensional) finalShooting = Math.min(finalShooting, 62);
    }

    // 8. TEAM CONTEXT: only affects non-elite scorers (84 and below)
    //    Elite scorers (85+ shootSkill) create regardless of teammates
    if (shootSkill < 85 && teammates.length > 0) {
        const totalThreat = teammates.reduce((sum, p) => {
            if (p.id === player.id) return sum;
            return sum + (p.attributes.finishing + p.attributes.threePointShot + p.attributes.midRange) / 3;
        }, 0);
        const avgThreat = totalThreat / Math.max(1, teammates.length - 1);
        if (avgThreat > 78) finalShooting *= 0.90; // Great teammates → share more
        else if (avgThreat < 64) finalShooting = Math.min(92, finalShooting * 1.08); // No help → carry
    }

    // 9. CLAMP FINAL VALUES
    finalShooting = Math.min(92, Math.max(15, Math.round(finalShooting)));
    finalPassing  = Math.min(97, Math.max(20, Math.round(finalPassing)));

    // 10. INSIDE vs OUTSIDE SPLIT
    const totalShootSkill = attr.finishing + attr.threePointShot;
    let insideBias  = totalShootSkill > 0 ? attr.finishing      / totalShootSkill : 0.5;
    let outsideBias = totalShootSkill > 0 ? attr.threePointShot / totalShootSkill : 0.5;

    if (attr.threePointShot < 60) outsideBias *= 0.25;
    else if (attr.threePointShot < 70) outsideBias *= 0.55;
    else if (attr.threePointShot >= 80) outsideBias *= 1.10;

    const finalInside  = Math.min(99, Math.max(15, Math.round(finalShooting * insideBias  * 2)));
    const finalOutside = Math.min(99, Math.max(15, Math.round(finalShooting * outsideBias * 2)));

    return {
        ...player.tendencies,
        shooting: finalShooting,
        passing:  finalPassing,
        inside:   finalInside,
        outside:  finalOutside
    };
};

export const calculateSecondaryPosition = (player: Player): Position | undefined => {
    const { position, height, tendencies } = player;

    // 1. Tall SF -> PF
    if (position === 'SF') {
        if (height >= 206) return 'PF';
    }

    // 2. Short C -> PF
    if (position === 'C') {
        if (height <= 208) return 'PF';
    }

    // 3. Tall SG -> SF
    if (position === 'SG') {
        if (height >= 198) return 'SF';
    }

    // 4. Scoring PG -> SG
    if (position === 'PG') {
        // If they shoot way more than they pass
        if (tendencies.shooting > tendencies.passing + 15) return 'SG';
        // Or if they are tall for a PG
        if (height >= 193) return 'SG';
    }

    // 5. Short PF -> SF ? (Optional, but logical)
    if (position === 'PF') {
        if (height <= 201) return 'SF';
        if (player.attributes.threePointShot > 80) return 'SF'; // Stretch 4
    }


    return undefined;
};

/**
 * Calculates Estimated Wins Added (EWA) based on player stats.
 * Formula roughly approximates Win Shares scaled to 82 games.
 */
export const calculateEWA = (player: Player): number => {
    const s = player.seasonStats;
    if (!s || s.gamesPlayed === 0) return 0;

    // Calculate "Value" (Approximate Game Score)
    const games = s.gamesPlayed;

    // Per Game Stats
    const pts = s.points / games;
    const reb = s.rebounds / games;
    const ast = s.assists / games;
    const stl = s.steals / games;
    const blk = s.blocks / games;
    const tov = s.turnovers / games;
    const fga = s.fgAttempted / games;
    const fgm = s.fgMade / games;
    const fta = s.ftAttempted / games;
    const ftm = s.ftMade / games;

    // Value Formula
    // PTS + REB*1.2 + AST*1.5 + STL*2.5 + BLK*2.5 - TOV*1.5 - Misses
    const missFG = fga - fgm;
    const missFT = fta - ftm;

    const valuePerGame = pts
        + (reb * 1.2)
        + (ast * 1.5)
        + (stl * 2.5)
        + (blk * 2.5)
        - (tov * 2.0) // Increased turnover penalty 
        - (missFG * 1.0) // Increased miss penalty
        - (missFT * 1.0); // Increased miss FT penalty

    // Filter out very poor performances to avoid negative stacking too hard for rookies
    // But negative IS possible (Replacement level logic)

    // Total Value Generated
    const totalValue = valuePerGame * games;

    // Scaling Factor
    // 200 Value points ~= 1 Win (Approx calibrated to MVP ~15-20 wins)
    // 3500 Value -> 17.5 Wins
    return Number((totalValue / 200).toFixed(1));
};
