import type { Player } from '../models/Player';
import type { Team } from '../models/Team';
import { calculateOverall } from './playerUtils';

/**
 * Generates an automatic hierarchy based on player overalls.
 * Returns a mapping of playerId -> tier number (1, 2, 3, 4).
 * Tier 1: 1 player (Leader)
 * Tier 2: 2 players (Core)
 * Tier 3: 4 players (Rotation)
 * Tier 4: Rest (Bench)
 */
export function getAutoHierarchy(players: Player[]): Record<string, number> {
    const sorted = [...players].sort((a, b) => calculateOverall(b) - calculateOverall(a));
    const hierarchy: Record<string, number> = {};

    sorted.forEach((p, i) => {
        if (i === 0) {
            hierarchy[p.id] = 1; // 1 Leader
        } else if (i > 0 && i <= 2) {
            hierarchy[p.id] = 2; // 2 Core
        } else if (i > 2 && i <= 6) {
            hierarchy[p.id] = 3; // 4 Rotation
        } else {
            hierarchy[p.id] = 4; // Rest Bench
        }
    });

    return hierarchy;
}

/**
 * Calculates the overall team chemistry using the hierarchy weights.
 * Tier 1: 40% weight
 * Tier 2: 30% weight
 * Tier 3: 20% weight
 * Tier 4: 10% weight
 */
export function calculateTeamChemistry(players: Player[], team?: Team): number {
    if (!players || players.length === 0) return 50;

    // Use custom hierarchy if it exists and matches roster size roughly, else auto generate
    let hierarchy = team?.hierarchy;
    
    // Quick validation: Ensure hierarchy covers all players, if not, fill in or regenerate
    if (!hierarchy || Object.keys(hierarchy).length !== players.length) {
        // If there's a partial hierarchy, we could try to merge, but simple auto is safer for missing players
        const auto = getAutoHierarchy(players);
        hierarchy = { ...auto, ...hierarchy }; 
    }

    let tier1Score = 0; let tier1Count = 0;
    let tier2Score = 0; let tier2Count = 0;
    let tier3Score = 0; let tier3Count = 0;
    let tier4Score = 0; let tier4Count = 0;

    players.forEach(p => {
        const tier = hierarchy![p.id] || 4;
        const morale = p.morale ?? 50;
        
        if (tier === 1) { tier1Score += morale; tier1Count++; }
        else if (tier === 2) { tier2Score += morale; tier2Count++; }
        else if (tier === 3) { tier3Score += morale; tier3Count++; }
        else { tier4Score += morale; tier4Count++; }
    });

    let totalWeight = 0;
    let weightedScore = 0;

    if (tier1Count > 0) {
        weightedScore += (tier1Score / tier1Count) * 0.40;
        totalWeight += 0.40;
    }
    if (tier2Count > 0) {
        weightedScore += (tier2Score / tier2Count) * 0.30;
        totalWeight += 0.30;
    }
    if (tier3Count > 0) {
        weightedScore += (tier3Score / tier3Count) * 0.20;
        totalWeight += 0.20;
    }
    if (tier4Count > 0) {
        weightedScore += (tier4Score / tier4Count) * 0.10;
        totalWeight += 0.10;
    }

    if (totalWeight === 0) return 50;

    return Math.round(weightedScore / totalWeight);
}
