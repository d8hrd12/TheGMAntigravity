import type { Player, PlayerAttributes } from "../../models/Player";
import { TrainingFocus, type ProgressionResult, type AttributeChange } from "../../models/Training";
import { calculateOverall } from "../../utils/playerUtils";
import { getAttributeTrainability } from "../../utils/trainingUtils";

// Weights for distributing points based on focus
const FOCUS_WEIGHTS: Record<TrainingFocus, Partial<Record<keyof PlayerAttributes, number>>> = {
    [TrainingFocus.BALANCED]: {
        finishing: 1, midRange: 1, threePointShot: 1, freeThrow: 1,
        playmaking: 1, ballHandling: 1, offensiveRebound: 1,
        interiorDefense: 1, perimeterDefense: 1, stealing: 1, blocking: 1,
        defensiveRebound: 1, athleticism: 1, basketballIQ: 1
    },
    [TrainingFocus.NONE]: {},
    [TrainingFocus.SHOOTING]: {
        midRange: 4, threePointShot: 4, freeThrow: 2, finishing: 2
    },
    [TrainingFocus.PLAYMAKING]: {
        playmaking: 4, ballHandling: 4, basketballIQ: 2
    },
    [TrainingFocus.DEFENSE]: {
        interiorDefense: 3, perimeterDefense: 3, stealing: 2, blocking: 2,
        defensiveRebound: 2, basketballIQ: 1
    },
    [TrainingFocus.PHYSICAL]: {
        athleticism: 4, finishing: 1
    },
    [TrainingFocus.FUNDAMENTALS]: {
        basketballIQ: 4, freeThrow: 2, playmaking: 2,
        perimeterDefense: 1
    },
    [TrainingFocus.NATURAL]: {
        finishing: 1, midRange: 1, threePointShot: 1, freeThrow: 1,
        playmaking: 1, ballHandling: 1, offensiveRebound: 1,
        interiorDefense: 1, perimeterDefense: 1, stealing: 1, blocking: 1,
        defensiveRebound: 1, athleticism: 1, basketballIQ: 1
    }
};

export const calculateProgression = (player: Player, focus: TrainingFocus, coachDevRating?: number): { updatedPlayer: Player; report: ProgressionResult } => {
    const changes: AttributeChange[] = [];
    const oldAttributes = { ...player.attributes };
    const oldOverall = player.overall; // Assuming it is up to date

    // 1. Determine Growth Potential
    // Age Curves:
    // 19-24: Rapid Growth
    // 25-28: Prime (Slow Growth / Plateau)
    // 29-32: Slow Decline
    // 33+: Rapid Decline

    let growthPoints = 0;
    const age = player.age;
    const potentialGap = Math.max(0, player.potential - player.overall);

    // Base RNG factor (-10% to +10%) to make it less predictable
    const variance = (Math.random() * 0.2) + 0.9;

    if (age <= 24) {
        // High Growth Phase
        // Can gain 20-40% of the gap per year
        const rate = 0.3 * variance;
        growthPoints = potentialGap * rate;

        // Minimum growth for young players even if close to potential (breakthroughs)
        if (growthPoints < 1) growthPoints = 1 + Math.random() * 2;

    } else if (age <= 28) {
        // Prime Phase
        // Can gain 5-15% of gap
        const rate = 0.1 * variance;
        growthPoints = potentialGap * rate;

        // Chance to stagnate
        if (Math.random() > 0.7) growthPoints = 0;

    } else if (age <= 32) {
        // Physical Regression Phase
        // -1 to -3 points effective (subtracted from specific stats)
        growthPoints = -(1 + Math.random() * 2);

    } else {
        // Sharp Decline
        // -3 to -6 points
        growthPoints = -(3 + Math.random() * 3);
    }

    // Work Ethic Modifier (Hidden or derived)
    // For now random modifier if we don't have explicit work ethic
    // If we had workEthic (0-99): growthPoints *= (0.8 + (workEthic / 200))

    // Apply Coach Development Rating modifier
    // coachDev = 50 -> 1.0x (neutral)
    // coachDev = 100 -> 1.3x (boost)
    // coachDev = 0 -> 0.7x (penalty)
    let devModifier = 1.0;
    if (coachDevRating !== undefined) {
        devModifier = 0.7 + (coachDevRating / 100) * 0.6;
    }
    
    if (growthPoints > 0) {
        growthPoints *= devModifier;
    }

    // 1.5. Playing Time Multiplier (Focus on young players)
    // If a young player (<= 24) didn't play much in the last season, their growth is slowed.
    if (growthPoints > 0 && age <= 24) {
        const lastSeason = player.careerStats?.[player.careerStats.length - 1];
        if (lastSeason) {
            const gp = lastSeason.gamesPlayed || 0;
            const mpg = gp > 0 ? (lastSeason.minutes / gp) : 0;
            
            // Multiplier based on MPG:
            // 25+ MPG: 1.2x boost
            // 15-25 MPG: 1.0x (normal)
            // 5-15 MPG: 0.8x penalty
            // 0-5 MPG: 0.6x penalty
            let playtimeMultiplier = 1.0;
            if (mpg >= 25) playtimeMultiplier = 1.2;
            else if (mpg < 5) playtimeMultiplier = 0.6;
            else if (mpg < 15) playtimeMultiplier = 0.8;
            
            growthPoints *= playtimeMultiplier;
        } else {
            // No career stats (rookie who didn't play)
            growthPoints *= 0.7;
        }
    }
    const weights = FOCUS_WEIGHTS[focus];
    const targetAttributes = Object.keys(weights) as Array<keyof PlayerAttributes>;

    // Normalize weights to distribute the total pool
    const totalWeight = targetAttributes.reduce((sum, attr) => sum + (weights[attr] || 0), 0);

    const newAttributes = { ...player.attributes };

    if (growthPoints > 0) {
        // GROWTH LOGIC
        // We have a "pool" of OVR points to gain. 
        // Note: 1 OVR point != 1 Attribute point. 
        // 1 OVR point is roughly 15-20 attribute points spread out. 
        // Let's multiply growthPoints by a factor to get "Attribute Points"
        // Reduced from 12 to 6 to prevent extreme single-season OVR jumps
        const attributePool = growthPoints * 6;

        targetAttributes.forEach(attr => {
            const weight = weights[attr] || 0;
            const portion = (weight / totalWeight) * attributePool;

            // Apply noise
            const actualGain = portion * ((Math.random() * 0.5) + 0.75);

            if (actualGain > 0) {
                const currentVal = newAttributes[attr] || 50; // default safety

                // Check trainability
                const trainability = getAttributeTrainability(player, attr);

                if (!trainability.canTrain) {
                    // Cannot train this attribute - skip or apply minimal gain
                    const minimalGain = Math.min(actualGain * 0.1, 1); // 10% of intended gain, max 1 point
                    newAttributes[attr] = Math.min(trainability.maxPotential, currentVal + minimalGain);
                } else {
                    // Normal training with max potential cap
                    const newValue = currentVal + actualGain;
                    newAttributes[attr] = Math.min(trainability.maxPotential, Math.min(99, newValue));
                }
            }
        });

    } else {
        // REGRESSION LOGIC
        // Focus matters LESS for regression, but 'Physical' focus can slow physical decline.
        // 'Fundamentals' can slow skill decline.

        // Apply Coach modifier to slow regression
        // If devModifier is > 1.0 (good coach), we divide the regression by it, so it's smaller.
        // If devModifier is < 1.0 (bad coach), we divide by it, so regression is larger.
        let regressionModifier = 1.0;
        if (coachDevRating !== undefined) {
             regressionModifier = devModifier; 
        }

        // Reduced from 15 to 8 to prevent extreme single-season OVR drops
        const regressionPool = (Math.abs(growthPoints) / regressionModifier) * 8; // Decline hits harder on raw stats

        // Decline affects PHYSICALS first regardless of focus, unless focus is PHYSICAL
        const physicalStats: Array<keyof PlayerAttributes> = ['athleticism'];
        const skillStats = Object.keys(newAttributes).filter(k => k !== 'athleticism') as Array<keyof PlayerAttributes>;

        // If Focus is PHYSICAL, we reduce physical damage by 50%
        const physicalSave = focus === TrainingFocus.PHYSICAL ? 0.5 : 1.0;

        // Apply 60% of regression to Physicals
        const physicalLoss = regressionPool * 0.6 * physicalSave;
        const skillLoss = regressionPool * 0.4; // Skills fade slower

        // Distribute Physical Loss
        physicalStats.forEach(attr => {
            const currentVal = newAttributes[attr] || 50;
            const loss = (physicalLoss / physicalStats.length) * ((Math.random() * 0.5) + 0.75);
            newAttributes[attr] = Math.max(25, currentVal - loss); // Floor at 25
        });

        // Distribute Skill Loss (Randomly across skills, simulating rust)
        skillStats.forEach(attr => {
            if (Math.random() > 0.5) { // Only hit half the skills per year
                const currentVal = newAttributes[attr] || 50;
                // Distribute skill loss across roughly 10 skills
                const loss = (skillLoss / 10) * ((Math.random() * 0.5) + 0.75);
                newAttributes[attr] = Math.max(25, currentVal - loss);
            }
        });
    }

    // 3. Finalize and Round
    (Object.keys(newAttributes) as Array<keyof PlayerAttributes>).forEach(key => {
        newAttributes[key] = Math.round(newAttributes[key]);
        const oldVal = oldAttributes[key] || 0; // Handle potentially undefined?
        const newVal = newAttributes[key];

        if (oldVal !== newVal) {
            changes.push({
                attributeName: key,
                oldValue: oldVal,
                newValue: newVal,
                delta: newVal - oldVal
            });
        }
    });

    // 4. Recalculate Overall
    // We need a helper for this that doesn't rely on the component context.
    // 'calculateOverall' from playerUtils is pure.
    // We need to construct a temp player object to pass to it if it expects one, or just attributes.
    // Looking at playerUtils, it accepts Player OR Attributes.

    // Need to cast to match PlayerAttributes fully if we missed any keys?
    // The cloning should preserve keys.

    const updatedPlayer = {
        ...player,
        attributes: newAttributes,
        previousAttributes: oldAttributes // Store for UI progression tracking
    };

    // Recalc OVR
    const newOverall = calculateOverall(updatedPlayer);
    updatedPlayer.overall = newOverall;

    // Report
    const report: ProgressionResult = {
        playerId: player.id,
        name: `${player.firstName} ${player.lastName}`,
        focus: focus,
        changes: changes.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)), // Biggest changes first
        overallChange: newOverall - oldOverall,
        isRegression: newOverall < oldOverall
    };

    return { updatedPlayer, report };
};

// ----------------------------------------------------------------------------
// IN-SEASON PROGRESSION (FLUID POTENTIAL & PERFORMANCE BOOSTS)
// ----------------------------------------------------------------------------
export const calculateInSeasonProgression = (player: Player, coachDevRating?: number): Player => {
    const s = player.seasonStats;
    if (!s || s.gamesPlayed < 10) return player; // Not enough data

    const updatedPlayer = { 
        ...player,
        attributes: { ...player.attributes },
        previousAttributes: { ...player.attributes } // Snapshot for UI diffs
    };
    
    let ovrChange = 0;
    const oldOverall = calculateOverall(player);

    const mpg = s.minutes / s.gamesPlayed;
    const gp = s.gamesPlayed;

    // Calculate Valuation (similar to ContractUtils but slightly more forgiving)
    const gmSc = (s.points + 0.4 * s.fgMade - 0.7 * s.fgAttempted - 0.4 * (s.ftAttempted - s.ftMade) + 0.5 * s.offensiveRebounds + 0.3 * s.defensiveRebounds + s.steals + 0.6 * s.assists + 0.6 * s.blocks - 0.4 * s.fouls - s.turnovers) / gp;
    let perfOvr = 58 + (gmSc * 1.45); // Increased from 1.3 to make OVR scaling better
    if (s.points / gp < 5 && perfOvr > 75) perfOvr -= 5;
    perfOvr = Math.max(40, Math.min(99, perfOvr));

    const diff = perfOvr - oldOverall;

    // 1. FLUID POTENTIAL (Young players only)
    if (updatedPlayer.age <= 24) {
        if (mpg >= 18 && diff > 1.0) {
            // Outperforming and playing a solid role: Outrun potential!
            // Higher minutes = higher potential ceiling increase
            const boost = mpg >= 25 ? Math.ceil(diff / 1.0) : Math.ceil(diff / 1.5);
            updatedPlayer.potential = Math.min(99, updatedPlayer.potential + boost);
        } else if (mpg < 10 && updatedPlayer.potential > oldOverall + 2) {
            // High potential but not playing: Potential drops significantly (regression of ceiling)
            const drop = mpg < 5 ? 3 : 1;
            updatedPlayer.potential = Math.max(oldOverall, updatedPlayer.potential - drop);
        }
    }

    // 2. IN-SEASON ATTRIBUTE PROGRESSION / REGRESSION
    // Only apply if the diff is significant
    
    // Check if coach can help push a player over the edge for progression, or save them from regression
    const coachBoost = coachDevRating ? (coachDevRating - 50) / 100 : 0; // -0.5 to +0.5
    
    if ((diff + coachBoost) >= 2 && updatedPlayer.age < 30) {
        // Player is balling out! Give them a slight bump (+1 OVR roughly)
        ovrChange = 1;
    } else if ((diff - coachBoost) <= -3 && updatedPlayer.age >= 30) {
        // Veteran is completely washed this year! Give them a slight regression
        ovrChange = -1;
    }

    if (ovrChange !== 0) {
        // Distribute the change across trainable attributes
        const attributesToChange = Object.keys(updatedPlayer.attributes) as Array<keyof PlayerAttributes>;
        let pointsDistributed = 0;
        const maxPoints = Math.abs(ovrChange) * 6; // Roughly 6 attribute points = 1 OVR

        for (let i = 0; i < attributesToChange.length; i++) {
            if (pointsDistributed >= maxPoints) break;
            
            // Pick a random attribute to adjust
            const attr = attributesToChange[Math.floor(Math.random() * attributesToChange.length)];
            const trainability = getAttributeTrainability(updatedPlayer, attr);

            if (ovrChange > 0) {
                // Progression: Must be trainable and under max potential
                if (trainability.canTrain && updatedPlayer.attributes[attr] < trainability.maxPotential) {
                    updatedPlayer.attributes[attr] = Math.min(trainability.maxPotential, updatedPlayer.attributes[attr] + 1);
                    pointsDistributed++;
                }
            } else {
                // Regression: Just drop the stat
                updatedPlayer.attributes[attr] = Math.max(25, updatedPlayer.attributes[attr] - 1);
                pointsDistributed++;
            }
        }
    }

    const newOverall = calculateOverall(updatedPlayer);
    updatedPlayer.overall = newOverall;
    updatedPlayer.inSeasonProgress = newOverall - oldOverall;

    return updatedPlayer;
};
