import type { Position, Personality } from '../../models/Player';
import type { Player, PlayerAttributes } from '../../models/Player';

import { generateUUID } from '../../utils/uuid';
import { getRandomArchetype } from './archetypes';
import { calculateOverall, calculateSecondaryPosition } from '../../utils/playerUtils';

const FIRST_NAMES = [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
    'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
    'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
    'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
    'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry',
    'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle',
    'Luka', 'Nikola', 'Giannis', 'Joel', 'Shai', 'Domantas', 'Victor', 'Alperen', 'Franz'
];
const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
    'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
    'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
    'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter',
    'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins',
    'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey',
    'Doncic', 'Jokic', 'Antetokounmpo', 'Embiid', 'Gilgeous-Alexander', 'Sabonis', 'Wembanyama', 'Sengun', 'Wagner'
];

export const PERSONALITIES: Personality[] = [
    'Professional', 'Workhorse', 'Professional', 'Workhorse', // Common (50%)
    'Loyalist', 'Silent Leader', 'Loyalist', 'Silent Leader', // Reliable (25%)
    'Enforcer', 'Unpredictable', // Niche (12.5%)
    'Diva', 'Mercenary' // Volatile (12.5%)
];

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAttributes(position: Position, tier: 'star' | 'starter' | 'bench' | 'prospect'): { current: PlayerAttributes, potential: PlayerAttributes, archetype: string } {
    // 1. Select Archetype
    const archetype = getRandomArchetype(position);

    // Base stats logic
    const base = 40;
    const variation = 12;

    // Helper to generate a stat with archetype weights
    // Note: archetype.weights might still have old keys if not updated. 
    // We assume archetypes.ts will be ignored or needs update. 
    // For now, we generate flat or simple weighted until archetypes.ts is fixed.

    const generateStat = (baseVal: number) => {
        let val = baseVal + randomInt(-variation, variation);

        // NERFED TIER BONUSES (Round 11 Fix)
        // Previous: Star(+35), Starter(+25), Bench(+15), Prospect(+10)
        if (tier === 'star') val += 15;
        if (tier === 'starter') val += 8;
        if (tier === 'bench') val += 2;
        if (tier === 'prospect') val -= 5;

        return Math.min(99, Math.max(20, val));
    };

    // Simple distribution based on position for now until Archetypes are updated
    const isIso = (pos: Position) => pos === 'PG' || pos === 'SG' || pos === 'SF';
    const isBig = (pos: Position) => pos === 'PF' || pos === 'C';

    const attrs: PlayerAttributes = {
        // Offense
        finishing: generateStat(isBig(position) ? 60 : 50),
        midRange: generateStat(isIso(position) ? 60 : 40),
        threePointShot: generateStat(isIso(position) ? 55 : 30),
        freeThrow: generateStat(50),
        playmaking: generateStat(position === 'PG' ? 70 : 40),
        ballHandling: generateStat(isIso(position) ? 60 : 30),
        offensiveRebound: generateStat(isBig(position) ? 65 : 30),

        // Defense
        interiorDefense: generateStat(isBig(position) ? 65 : 30),
        perimeterDefense: generateStat(isIso(position) ? 60 : 35),
        stealing: generateStat(isIso(position) ? 55 : 35),
        blocking: generateStat(isBig(position) ? 60 : 30),
        defensiveRebound: generateStat(isBig(position) ? 65 : 35),

        // Physical/Mental
        athleticism: generateStat(50),
        // DEEPER IQ PENALTY (Round 11 Fix): -25 for prospects to lower OVR floor
        basketballIQ: generateStat(50) + (tier === 'prospect' ? -25 : 5)
    };

    // Apply Twist (Random Boost)
    const keys = Object.keys(attrs) as Array<keyof PlayerAttributes>;
    const twist = keys[randomInt(0, keys.length - 1)];
    attrs[twist] = Math.min(99, attrs[twist] + 15);

    // Potential
    const potential = { ...attrs };
    // HIGHER POTENTIAL CEILING (Round 11 Fix): 10-28 growth room instead of 20
    const growthRoom = tier === 'prospect' ? 28 : 12;

    for (const k of keys) {
        potential[k] = Math.min(99, attrs[k] + randomInt(8, growthRoom));
    }

    return { current: attrs, potential, archetype: archetype.name };
}

// Helper to generate tendencies based on attributes
export function deriveTendenciesFromAttributes(attrs: PlayerAttributes, position: Position) {
    const clamp = (n: number) => Math.min(100, Math.max(25, Math.floor(n)));

    const shooting = clamp((attrs.finishing + attrs.threePointShot + attrs.midRange) / 3);
    const passing = clamp((attrs.playmaking + attrs.basketballIQ) / 2);

    // Draft ratio
    const totalW = attrs.finishing + attrs.threePointShot;
    const inside = clamp(shooting * (attrs.finishing / (totalW || 1)) * 2);
    const outside = clamp(shooting * (attrs.threePointShot / (totalW || 1)) * 2);

    return {
        shooting,
        passing,
        inside,
        outside,
        defensiveAggression: clamp((attrs.perimeterDefense + attrs.interiorDefense) / 2),
        foulTendency: 50
    };
}

export function deriveArchetypeName(attrs: PlayerAttributes, ten: any, pos: Position): string {
    const isBig = pos === 'C' || pos === 'PF';
    const eliteShoot = attrs.threePointShot > 85;
    const eliteDef = attrs.perimeterDefense > 85 || attrs.interiorDefense > 85;
    const elitePlay = attrs.playmaking > 85;

    if (elitePlay && eliteShoot) return 'Offensive Threat';
    if (elitePlay) return 'Floor General';
    if (eliteShoot) return 'Sharpshooter';
    if (eliteDef) return 'Lockdown Defender';
    if (attrs.finishing > 85) return 'Slasher';
    if (isBig && attrs.defensiveRebound > 85) return 'Glass Cleaner';

    return 'Balanced';
}

export function generatePlayer(forcedPosition?: Position, forcedTier?: 'star' | 'starter' | 'bench' | 'prospect'): Player {
    const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    const position = forcedPosition || positions[randomInt(0, 4)];

    let tier: 'star' | 'starter' | 'bench' | 'prospect' = 'bench';
    if (forcedTier) {
        tier = forcedTier;
    } else {
        const rand = Math.random();
        if (rand > 0.96) tier = 'star';
        else if (rand > 0.75) tier = 'starter';
        else if (rand > 0.25) tier = 'bench';
        else tier = 'prospect';

        if (rand <= 0.25) tier = 'bench';
    }

    const { current, potential: potentialAttrs, archetype } = generateAttributes(position, tier);
    const tendencies = deriveTendenciesFromAttributes(current, position);
    const finalArchetype = deriveArchetypeName(current, tendencies, position);
    const age = tier === 'prospect' ? randomInt(18, 22) : randomInt(20, 35);
    const overall = calculateOverall(current, position);

    // Height Logic based on Position (cm) for Dual Position Logic to work
    let height = 190;
    let weight = 90;

    switch (position) {
        case 'PG':
            height = randomInt(185, 196); // 6'1" - 6'5"
            weight = randomInt(80, 95);
            break;
        case 'SG':
            height = randomInt(193, 203); // 6'4" - 6'8"
            weight = randomInt(90, 105);
            break;
        case 'SF':
            height = randomInt(198, 208); // 6'6" - 6'10"
            weight = randomInt(95, 110);
            break;
        case 'PF':
            height = randomInt(203, 213); // 6'8" - 7'0"
            weight = randomInt(105, 120);
            break;
        case 'C':
            height = randomInt(208, 224); // 6'10" - 7'4"
            weight = randomInt(110, 130);
            break;
    }

    // Occasional Outliers (5% chance)
    if (Math.random() > 0.95) height += randomInt(-5, 5);

    const player: Player = {
        id: generateUUID(),
        firstName: FIRST_NAMES[randomInt(0, FIRST_NAMES.length - 1)],
        lastName: LAST_NAMES[randomInt(0, LAST_NAMES.length - 1)],
        position,
        age,
        jerseyNumber: randomInt(0, 99),
        height,
        weight,
        personality: PERSONALITIES[randomInt(0, PERSONALITIES.length - 1)],
        attributes: current,
        attributePotentials: potentialAttrs, // Saved here!
        archetype: finalArchetype,
        tendencies,
        morale: 80,
        fatigue: 0,
        teamId: null,
        seasonStats: {
            gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
            turnovers: 0, fouls: 0, offensiveRebounds: 0, defensiveRebounds: 0,
            fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0, plusMinus: 0
        },
        careerStats: [],
        minutes: 0,
        isStarter: false,
        potential: overall + (tier === 'prospect' ? randomInt(10, 28) : randomInt(5, 12)),
        loveForTheGame: randomInt(1, 20),
        overall
    };

    // Calculate Secondary Position
    player.secondaryPosition = calculateSecondaryPosition(player);

    return player;
}
