import type { Player, PlayerAttributes } from "../../models/Player";
import { TrainingFocus, type ProgressionResult, type AttributeChange } from "../../models/Training";
import { calculateOverall } from "../../utils/playerUtils";

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
    }
};

export const calculateProgression = (player: Player, focus: TrainingFocus): { updatedPlayer: Player; report: ProgressionResult } => {
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

    // 2. Distribute Points
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
        const attributePool = growthPoints * 12;

        targetAttributes.forEach(attr => {
            const weight = weights[attr] || 0;
            const portion = (weight / totalWeight) * attributePool;

            // Apply noise
            let actualGain = portion * ((Math.random() * 0.5) + 0.75);

            // CAP LOGIC
            // If we have specific attribute potentials, enforce them
            const currentVal = newAttributes[attr] || 50;
            let cap = 99;

            if (player.attributePotentials && player.attributePotentials[attr]) {
                cap = player.attributePotentials[attr]!;
            } else {
                // Legacy Fallback: Cap at Current + 15 (Simulating natural ceiling)
                cap = Math.min(99, currentVal + 15);
            }

            // SOFT CAP: If exceeding potential, slash gains by 90%
            if (currentVal >= cap) {
                actualGain *= 0.1;
                // Hard Cap at Cap + 5 (Absolute maximum breakthrough)
                if (currentVal >= cap + 5) actualGain = 0;
            }

            if (actualGain > 0) {
                newAttributes[attr] = Math.min(99, currentVal + actualGain);
            }
        });

    } else {
        // REGRESSION LOGIC
        // Focus matters LESS for regression, but 'Physical' focus can slow physical decline.
        // 'Fundamentals' can slow skill decline.

        const regressionPool = Math.abs(growthPoints) * 15; // Decline hits harder on raw stats

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
