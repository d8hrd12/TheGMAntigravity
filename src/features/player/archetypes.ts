
import type { PlayerAttributes, Position } from '../../models/Player';
import type { Player } from '../../models/Player';

// Extract the Tendencies type from Player for re-use
type PlayerTendencies = Player['tendencies'];

export interface Archetype {
    name: string;
    position: Position;
    weights: Partial<Record<keyof PlayerAttributes, number>>; // 1.0 = base, 1.5 = high, 0.5 = low
    tendencies: PlayerTendencies;
}

export const ARCHETYPES: Archetype[] = [
    // --- POINT GUARDS ---
    {
        name: 'Playmaker', position: 'PG',
        weights: { playmaking: 1.6, ballHandling: 1.5, basketballIQ: 1.5, offensiveRebound: 0.4, blocking: 0.4 },
        tendencies: {
            shooting: 35, passing: 85,
            inside: 30, outside: 70,
            defensiveAggression: 40, foulTendency: 20
        }
    },
    {
        name: 'Scoring Guard', position: 'PG',
        weights: { threePointShot: 1.4, midRange: 1.4, finishing: 1.3, athleticism: 1.4, playmaking: 1.1 },
        tendencies: {
            shooting: 85, passing: 30,
            inside: 30, outside: 70,
            defensiveAggression: 30, foulTendency: 30
        }
    },
    {
        name: 'Defensive Specialist', position: 'PG',
        weights: { perimeterDefense: 1.6, stealing: 1.6, athleticism: 1.6, playmaking: 1.0, threePointShot: 0.9 },
        tendencies: {
            shooting: 30, passing: 60,
            inside: 50, outside: 50,
            defensiveAggression: 95, foulTendency: 60
        }
    },

    // --- SHOOTING GUARDS ---
    {
        name: 'Sharpshooter', position: 'SG',
        weights: { threePointShot: 1.7, midRange: 1.1, basketballIQ: 1.6, finishing: 0.6, defensiveRebound: 0.5 },
        tendencies: {
            shooting: 65, passing: 35,
            inside: 10, outside: 90,
            defensiveAggression: 40, foulTendency: 20
        }
    },
    {
        name: 'Slasher', position: 'SG',
        weights: { finishing: 1.6, athleticism: 1.5, ballHandling: 1.3, threePointShot: 0.6, freeThrow: 1.5 },
        tendencies: {
            shooting: 75, passing: 40,
            inside: 80, outside: 20,
            defensiveAggression: 60, foulTendency: 50
        }
    },
    {
        name: 'Two-Way Wing', position: 'SG',
        weights: { perimeterDefense: 1.5, threePointShot: 1.3, stealing: 1.3 },
        tendencies: {
            shooting: 55, passing: 50,
            inside: 30, outside: 70,
            defensiveAggression: 80, foulTendency: 40
        }
    },

    // --- SMALL FORWARDS ---
    {
        name: 'Point Forward', position: 'SF',
        weights: { playmaking: 1.4, ballHandling: 1.3, basketballIQ: 1.4, offensiveRebound: 1.1, defensiveRebound: 1.1 },
        tendencies: {
            shooting: 60, passing: 75,
            inside: 40, outside: 60,
            defensiveAggression: 50, foulTendency: 30
        }
    },
    {
        name: '3&D Wing', position: 'SF',
        weights: { threePointShot: 1.4, perimeterDefense: 1.5, playmaking: 0.8, ballHandling: 0.8 },
        tendencies: {
            shooting: 40, passing: 50,
            inside: 30, outside: 70,
            defensiveAggression: 75, foulTendency: 40
        }
    },
    {
        name: 'Scoring Forward', position: 'SF',
        weights: { midRange: 1.5, finishing: 1.4, threePointShot: 1.3, perimeterDefense: 0.7, athleticism: 1.3 },
        tendencies: {
            shooting: 90, passing: 25,
            inside: 30, outside: 70,
            defensiveAggression: 40, foulTendency: 30
        }
    },

    // --- POWER FORWARDS ---
    {
        name: 'Stretch 4', position: 'PF',
        weights: { threePointShot: 1.6, midRange: 1.2, offensiveRebound: 0.8, defensiveRebound: 0.8, blocking: 0.7 },
        tendencies: {
            shooting: 55, passing: 50,
            inside: 10, outside: 90,
            defensiveAggression: 40, foulTendency: 20
        }
    },
    {
        name: 'Post Scorer', position: 'PF',
        weights: { finishing: 1.7, midRange: 1.3, athleticism: 0.5, basketballIQ: 1.4 },
        tendencies: {
            shooting: 70, passing: 40,
            inside: 60, outside: 40,
            defensiveAggression: 50, foulTendency: 40
        }
    },
    {
        name: 'Glass Cleaner', position: 'PF',
        weights: { defensiveRebound: 1.6, offensiveRebound: 1.6, blocking: 1.2, threePointShot: 0.3, midRange: 0.4 },
        tendencies: {
            shooting: 20, passing: 60,
            inside: 90, outside: 10,
            defensiveAggression: 80, foulTendency: 50
        }
    },

    // --- CENTERS ---
    {
        name: 'Paint Beast', position: 'C',
        weights: { finishing: 1.6, offensiveRebound: 1.5, defensiveRebound: 1.5, blocking: 1.3, athleticism: 1.7, freeThrow: 0.6 },
        tendencies: {
            shooting: 65, passing: 30,
            inside: 95, outside: 5,
            defensiveAggression: 85, foulTendency: 60
        }
    },
    {
        name: 'Rim Protector', position: 'C',
        weights: { blocking: 1.8, defensiveRebound: 1.5, interiorDefense: 1.7, playmaking: 0.4, threePointShot: 0.2, midRange: 0.3 },
        tendencies: {
            shooting: 25, passing: 50,
            inside: 95, outside: 5,
            defensiveAggression: 90, foulTendency: 50
        }
    },
    {
        name: 'Modern Center', position: 'C',
        weights: { threePointShot: 1.3, playmaking: 1.3, basketballIQ: 1.4, offensiveRebound: 1.0, defensiveRebound: 1.0 },
        tendencies: {
            shooting: 50, passing: 70,
            inside: 30, outside: 70,
            defensiveAggression: 50, foulTendency: 30
        }
    }
];

// Helper to get random archetype for position
export const getRandomArchetype = (position: Position): Archetype => {
    const options = ARCHETYPES.filter(a => a.position === position);
    return options[Math.floor(Math.random() * options.length)];
};
