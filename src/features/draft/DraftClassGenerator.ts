import type { Player } from '../../models/Player';
import { generatePlayer } from '../player/playerGenerator';

export const generateMockDraftClass = (year: number): Player[] => {
    const draftees: Player[] = [];
    for (let i = 0; i < 60; i++) {
        // Generate with age 19-22
        const age = 19 + Math.floor(Math.random() * 4);
        const positions = ['PG', 'SG', 'SF', 'PF', 'C'] as const;
        const pos = positions[Math.floor(Math.random() * positions.length)];

        const rookie = generatePlayer(pos, 'prospect');
        rookie.age = age; // Override age

        // Adjust for Draft Class
        rookie.acquisition = { type: 'draft', year: year };
        rookie.contractValue = 0;
        rookie.teamId = null;

        draftees.push(rookie);
    }
    return draftees;
};
