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
    const position = positionArg || (isPlayer ? (input as Player).position : 'SF'); // Default to SF (Balanced)

    const weights = POSITION_WEIGHTS[position] || POSITION_WEIGHTS['SF'];

    let totalWeightedScore = 0;
    let totalMaxWeight = 0;

    // Iterate over defined weights to check only relevant stats
    (Object.keys(weights) as Array<keyof PlayerAttributes>).forEach(key => {
        const weight = weights[key];
        // Only use stats that exist in the attributes object (handling potential partial objects)
        if (typeof attr[key] === 'number') {
            totalWeightedScore += (attr[key] || 50) * weight;
            totalMaxWeight += 99 * weight;
        }
    });

    if (totalMaxWeight === 0) return 50; // Fallback

    const normalized = (totalWeightedScore / totalMaxWeight) * 99;

    // Slight boost (1.1x) to allow specialists to reach 99 without being perfect at everything
    // e.g. a C doesn't need 99 Passing to be a 99 OVR C.
    const boosted = normalized * 1.1;

    return Math.min(99, Math.round(boosted));
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

    // Normalize OVR between 0 and 1
    const normalized = (ovr - MIN_OVR) / (MAX_OVR - MIN_OVR);

    // Exponential scaling (power of 2.5)
    // 65 OVR -> 1.1M
    // 80 OVR -> ~5.2M
    // 90 OVR -> ~16.5M
    // 95 OVR -> ~33M
    // 99 OVR -> 50M
    const salary = MIN_SALARY + Math.pow(normalized, 2.5) * (MAX_SALARY - MIN_SALARY);

    // Round to nearest 50k for cleaner look
    return Math.round(salary / 50000) * 50000;
};

export const calculateTendencies = (player: Player, minutes: number = 0, teammates: Player[] = []): Player['tendencies'] => {
    const attr = player.attributes;

    // 1. Determine "Point Allocation Budget" based on Role & Talent
    // Star (>30m): 155 Points 
    // Starter (>20m): 135 Points
    // Role (<20m): 100 Points
    // Bench End: 80 Points
    let budget = 100;
    if (minutes >= 30) budget = 155;
    else if (minutes >= 20) budget = 135;
    else if (minutes < 15) budget = 80;

    // Talent-Based Scaling: Adjust budget based on OVR relative to league average (approx 76-78)
    // Only give usage boost to perimeter players to prevent center dominance
    const ovr = calculateOverall(player);
    const position = player.position;

    if (ovr > 88 && (position === 'PG' || position === 'SG' || position === 'SF')) {
        budget += 20;  // Superstars get extra usage (guards/wings only)
    } else if (ovr > 84 && (position === 'PG' || position === 'SG' || position === 'SF')) {
        budget += 10;  // Stars get extra usage (guards/wings only)
    } else if (ovr < 75) {
        budget -= 15;  // Role players lose usage
    } else if (ovr < 70) {
        budget -= 30;  // Bench players lose significant usage
    }

    // 2. Base Skill Ratings
    const shootSkill = (attr.finishing + attr.midRange + attr.threePointShot) / 3;
    const passSkill = (attr.playmaking + attr.basketballIQ + attr.ballHandling) / 3;

    // 3. Team Context Adjustment
    // "In a team full of scorers pass more... No scorers lean on scoring"
    let teammateBias = 0; // Positive = Pass/Share, Negative = Shoot/Carry

    if (teammates.length > 0) {
        // Calculate average "Scoring Threat" of teammates
        const totalThreat = teammates.reduce((sum, p) => {
            if (p.id === player.id) return sum; // Skip self
            const pThreat = (p.attributes.finishing + p.attributes.threePointShot + p.attributes.midRange) / 3;
            // Or just check if they are "Scorers" (>80 stats)
            return sum + pThreat;
        }, 0);
        const avgThreat = totalThreat / (Math.max(1, teammates.length - 1));

        // Thresholds
        if (avgThreat > 75) teammateBias = 20; // High quality teammates -> Share
        else if (avgThreat < 65) teammateBias = -20; // Low quality -> Carry
    }

    // 4. Weight Calculation (Zero-Sum Distribution)
    let wShoot = shootSkill;
    let wPass = passSkill + teammateBias;

    // Safety: "If the player has no passing skills he will always lean more on scoring."
    if (passSkill < 55) {
        wPass = passSkill; // Ignore bias if incompetent
    }

    // Normalize weights
    wShoot = Math.max(10, wShoot);
    wPass = Math.max(10, wPass);
    const totalWeight = wShoot + wPass;

    // Allocate Budget
    let allocShoot = Math.round(budget * (wShoot / totalWeight));
    let allocPass = Math.round(budget * (wPass / totalWeight));

    // 5. Clamping (User: "Make cap of points and allocate")
    // Should typically be 20-99.
    const clamp = (val: number) => Math.min(100, Math.max(25, val));

    const finalShooting = clamp(allocShoot);
    const finalPassing = clamp(allocPass);

    // 6. Inside vs Outside Split (Preference within Scoring)
    const totalShootSkill = attr.finishing + attr.threePointShot;
    let insideBias = totalShootSkill > 0 ? (attr.finishing / totalShootSkill) : 0.5;
    let outsideBias = totalShootSkill > 0 ? (attr.threePointShot / totalShootSkill) : 0.5;

    // SCALER: Penalize Outside Tendency for poor shooters
    if (attr.threePointShot < 60) {
        outsideBias *= 0.25; // Aggressive Penalty for non-shooters (Target ~20 for 50-skill)
    } else if (attr.threePointShot < 70) {
        outsideBias *= 0.55; // Moderate Penalty
    } else if (attr.threePointShot >= 80) {
        outsideBias *= 1.1; // Small boost for elites
    }

    // Scale them. Since Inside/Outside are independent checks in PossessionEngine,
    // We can just set them based on skill ratios relative to the *ShootingTendency*.

    const finalInside = clamp(finalShooting * (insideBias * 2));
    const finalOutside = clamp(finalShooting * (outsideBias * 2));

    return {
        ...player.tendencies,
        shooting: finalShooting,
        passing: finalPassing,
        inside: finalInside,
        outside: finalOutside
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
