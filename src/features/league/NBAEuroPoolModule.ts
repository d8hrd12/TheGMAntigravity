import type { Player } from '../../models/Player';
import { generatePlayer } from '../player/playerGenerator';
import { generateUUID } from '../../utils/uuid';

/**
 * Logic for generating and managing the pool of NBA players 
 * who are interested in playing in Europe.
 */

export interface NBAEuroProspect extends Player {
    nbaStatus: 'Veteran' | 'Fringe' | 'G-League';
    nbaHistory?: string;
}

export function generateNBAEuroPool(count: number): NBAEuroProspect[] {
    const pool: NBAEuroProspect[] = [];
    
    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let tier: 'starter' | 'bench' | 'prospect' = 'bench';
        let status: 'Veteran' | 'Fringe' | 'G-League' = 'Fringe';
        let minOvr = 75;
        let maxOvr = 82;
        let ageRange = [24, 30];

        if (rand > 0.8) {
            // The Aging Veteran
            status = 'Veteran';
            tier = 'starter';
            minOvr = 78;
            maxOvr = 83;
            ageRange = [32, 37];
        } else if (rand < 0.3) {
            // The G-League Standout
            status = 'G-League';
            tier = 'prospect';
            minOvr = 72;
            maxOvr = 77;
            ageRange = [21, 24];
        }

        const player = generatePlayer(undefined, tier) as NBAEuroProspect;
        
        // Overwrite some attributes for NBA feel
        player.age = Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1)) + ageRange[0];
        player.overall = Math.floor(Math.random() * (maxOvr - minOvr + 1)) + minOvr;
        player.nbaStatus = status;
        
        // Mark as acquisition type 'free_agent' but with NBA background
        player.acquisition = {
            type: 'free_agent',
            year: new Date().getFullYear(),
            details: `Ex-NBA ${status}`
        };

        pool.push(player);
    }

    return pool;
}

/**
 * Updates the pool by removing some players (who "signed" elsewhere)
 * and adding new "NBA castoffs".
 */
export function refreshNBAEuroPool(currentPool: NBAEuroProspect[]): NBAEuroProspect[] {
    // 1. Remove 20-40% of fictional players (simulating they signed in China, G-League, or retired)
    // NEVER remove real NBA veterans (IDs starting with 'nba_target_')
    const survivors = currentPool.filter(p => p.id.startsWith('nba_target_') || Math.random() > 0.3);
    
    // 2. Add 3-6 new players
    const newArrivals = generateNBAEuroPool(Math.floor(Math.random() * 4) + 3);
    
    return [...survivors, ...newArrivals].sort((a, b) => b.overall - a.overall);
}
