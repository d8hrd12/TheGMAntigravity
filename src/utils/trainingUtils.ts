import type { Player, PlayerAttributes, Position } from '../models/Player';

/**
 * Calculate attribute-specific potential based on player's overall potential,
 * current attribute value, and archetype/position appropriateness.
 */
export const getAttributePotential = (
    player: Player,
    attribute: keyof PlayerAttributes
): number => {
    const currentValue = player.attributes[attribute];
    const overallGap = Math.max(0, player.potential - player.overall);

    // Base potential: current value + proportional share of overall gap
    let attributePotential = currentValue + (overallGap * 0.7);

    // Apply archetype/position modifiers
    const trainability = getAttributeTrainability(player, attribute);

    if (!trainability.canTrain) {
        // If can't train, potential is capped at current + small buffer
        attributePotential = Math.min(attributePotential, currentValue + 3);
    } else {
        // Respect max potential from trainability
        attributePotential = Math.min(attributePotential, trainability.maxPotential);
    }

    // Cap at 99
    return Math.min(99, Math.round(attributePotential));
};

/**
 * Determine if an attribute can be trained based on player archetype and position.
 */
export const getAttributeTrainability = (
    player: Player,
    attribute: keyof PlayerAttributes
): { canTrain: boolean; maxPotential: number; reason?: string } => {
    const currentValue = player.attributes[attribute];
    const position = player.position;
    const archetype = player.archetype?.toLowerCase() || '';

    // Default: can train up to 95
    const defaultMax = 95;

    // === POSITION-BASED RESTRICTIONS ===

    // Big men (C, PF) with low shooting can't develop shooting
    if ((position === 'C' || position === 'PF') && attribute === 'threePointShot') {
        if (currentValue < 60 && !archetype.includes('stretch') && !archetype.includes('shooter')) {
            return {
                canTrain: false,
                maxPotential: currentValue + 5,
                reason: 'Non-shooting big men cannot develop 3PT shooting'
            };
        }
    }

    // Guards with low interior skills can't become rim protectors
    if ((position === 'PG' || position === 'SG') && (attribute === 'blocking' || attribute === 'interiorDefense')) {
        if (currentValue < 55) {
            return {
                canTrain: false,
                maxPotential: currentValue + 5,
                reason: 'Guards cannot develop elite interior defense'
            };
        }
    }

    // === ARCHETYPE-BASED RESTRICTIONS ===

    // Defensive specialists can't become sharpshooters
    if (archetype.includes('rim protector') || archetype.includes('paint') || archetype.includes('defensive')) {
        if (attribute === 'threePointShot' || attribute === 'midRange') {
            if (currentValue < 65) {
                return {
                    canTrain: false,
                    maxPotential: currentValue + 8,
                    reason: 'Defensive specialists have limited shooting development'
                };
            }
        }
    }

    // Sharpshooters/Playmakers can't become elite interior defenders
    if (archetype.includes('sharpshooter') || archetype.includes('playmaker') || archetype.includes('scorer')) {
        if (attribute === 'blocking' || attribute === 'interiorDefense') {
            if (currentValue < 65) {
                return {
                    canTrain: false,
                    maxPotential: currentValue + 8,
                    reason: 'Offensive specialists have limited interior defense development'
                };
            }
        }
    }

    // Can train normally
    return {
        canTrain: true,
        maxPotential: defaultMax
    };
};
