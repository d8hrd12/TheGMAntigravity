import type { Contract } from '../../models/Contract';
import type { Player, PlayerAttributes, Position } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { RealPlayerDef } from '../../data/realRosters';
import { REAL_ROSTERS } from '../../data/realRosters';
import { generatePlayer, deriveTendenciesFromAttributes, deriveArchetypeName, PERSONALITIES } from './playerGenerator';
import { generateUUID } from '../../utils/uuid';
import { calculateOverall, calculateFairSalary } from '../../utils/playerUtils';

// Helper to convert OVR target into rough attributes
function generateAttributesForOvr(targetOvr: number, pos: Position, archetype: string): PlayerAttributes {
    let tier: 'star' | 'starter' | 'bench' = 'bench';
    if (targetOvr >= 90) tier = 'star';
    else if (targetOvr >= 80) tier = 'starter';

    const template = generatePlayer(pos, tier);
    const attrs = { ...template.attributes };

    // Tuning loop: Adjust stats up/down until OVR matches target
    let currentOvr = calculateOverall({ ...template, attributes: attrs });

    let attempts = 0;
    while (Math.abs(currentOvr - targetOvr) > 1 && attempts < 50) {
        attempts++;
        const diff = targetOvr - currentOvr;
        const adjustment = diff > 0 ? 1 : -1;

        for (const key in attrs) {
            const k = key as keyof PlayerAttributes;
            let val = attrs[k] + adjustment;
            attrs[k] = Math.max(40, Math.min(99, val));
        }
        currentOvr = calculateOverall({ ...template, attributes: attrs });
    }

    // Specific Archetype Tuning
    if (archetype.includes('Sharpshooter')) {
        attrs.threePointShot = Math.min(99, Math.max(85, attrs.threePointShot + 5));
    }
    if (archetype.includes('Playmaker')) {
        attrs.playmaking = Math.min(99, Math.max(85, attrs.playmaking + 5));
    }
    if (archetype.includes('Rim Protector')) {
        attrs.blocking = Math.min(99, Math.max(85, attrs.blocking + 5));
        attrs.interiorDefense = Math.min(99, Math.max(85, attrs.interiorDefense + 5));
    }

    return attrs;
}

// Helper to generate realistic height/weight based on position
function generatePhysicals(pos: Position): { height: number, weight: number } {
    const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let height = 200;
    let weight = 100;

    switch (pos) {
        case 'PG':
            height = randomInRange(185, 196); // 6'1" - 6'5"
            weight = randomInRange(80, 95);
            break;
        case 'SG':
            height = randomInRange(191, 201); // 6'3" - 6'7"
            weight = randomInRange(85, 100);
            break;
        case 'SF':
            height = randomInRange(198, 206); // 6'6" - 6'9"
            weight = randomInRange(95, 108);
            break;
        case 'PF':
            height = randomInRange(203, 211); // 6'8" - 6'11"
            weight = randomInRange(100, 115);
            break;
        case 'C':
            height = randomInRange(208, 221); // 6'10" - 7'3"
            weight = randomInRange(108, 125);
            break;
    }
    return { height, weight };
}

// Helper to map BBGM/JSON generic positions to our specific 5 positions
function normalizePosition(rawPos: string): Position {
    if (rawPos === 'PG') return 'PG';
    if (rawPos === 'SG') return 'SG';
    if (rawPos === 'SF') return 'SF';
    if (rawPos === 'PF') return 'PF';
    if (rawPos === 'C') return 'C';

    // Fuzzy mapping
    if (rawPos === 'G') return 'SG'; // Generic Guard -> SG
    if (rawPos === 'F') return 'SF'; // Generic Forward -> SF
    if (rawPos === 'GF' || rawPos === 'FG') return 'SF'; // Guard-Forward -> SF
    if (rawPos === 'FC' || rawPos === 'CF') return 'PF'; // Forward-Center -> PF

    // Fallback
    return 'SF';
}

/**
 * Optimizes a team's rotation by assigning minutes based on OVR.
 * Ensures total minutes = 240.
 */
export function optimizeTeamRotation(players: Player[]) {
    // 1. Sort by OVR descending
    const sorted = [...players].sort((a, b) => b.overall - a.overall);

    // 2. Clear current rotation
    players.forEach(p => {
        p.minutes = 0;
        p.isStarter = false;
        p.rotationIndex = undefined;
    });

    // 3. Define distribution targets (Minutes for 10-man rotation)
    // Starters (1-5), Sixth Man (6), Key Reserves (7-8), End of Bench (9-10)
    const targets = [36, 34, 32, 30, 28, 24, 20, 16, 12, 8];

    // 4. Assign minutes using sorted order as priority
    let totalAssigned = 0;
    sorted.forEach((p, idx) => {
        const actualPlayer = players.find(original => original.id === p.id);
        if (!actualPlayer) return;

        if (idx < 5) {
            actualPlayer.isStarter = true;
        }

        if (idx < targets.length) {
            actualPlayer.minutes = targets[idx];
            actualPlayer.rotationIndex = idx;
            totalAssigned += targets[idx];
        } else {
            actualPlayer.minutes = 0;
            actualPlayer.isStarter = false;
        }
    });

    // 5. Final adjustment to hit exactly 240 (if targets don't sum to 240)
    const targetTotal = 240;
    let diff = targetTotal - totalAssigned;

    if (diff !== 0) {
        // Distribute diff to starters primarily
        for (let i = 0; i < 5; i++) {
            const p = sorted[i];
            const actualPlayer = players.find(original => original.id === p.id);
            if (actualPlayer) {
                const adj = diff > 0 ? 1 : -1;
                actualPlayer.minutes += adj;
                diff -= adj;
                if (diff === 0) break;
            }
        }
    }
}

export function seedRealRosters(teams: Team[]): { players: Player[], contracts: Contract[] } {
    let allPlayers: Player[] = [];
    let allContracts: Contract[] = [];

    teams.forEach(team => {
        const realPlayers = REAL_ROSTERS[team.abbreviation];

        // 1. Generate Real Players
        if (realPlayers) {
            realPlayers.forEach(def => {
                const position = normalizePosition(def.pos);
                // Map Real Player Attributes to Model
                const rawAttrs = def.attributes || generateAttributesForOvr(def.ovr, position, def.archetype);

                // MAPPING LOGIC
                const attrs: PlayerAttributes = {
                    finishing: rawAttrs.finishing || Math.round((rawAttrs.layup + rawAttrs.drivingDunk + rawAttrs.standingDunk + rawAttrs.insideShot) / 4) || 60,
                    midRange: rawAttrs.midRange || rawAttrs.midRangeShot || 60,
                    threePointShot: rawAttrs.threePointShot || 60,
                    freeThrow: rawAttrs.freeThrow || 70, // Default if missing
                    playmaking: rawAttrs.playmaking || rawAttrs.passing || 60,
                    ballHandling: rawAttrs.ballHandling || 60,
                    basketballIQ: rawAttrs.basketballIQ || rawAttrs.iq || 60,
                    interiorDefense: rawAttrs.interiorDefense || 50,
                    perimeterDefense: rawAttrs.perimeterDefense || 50,
                    stealing: rawAttrs.stealing || rawAttrs.steal || 50,
                    blocking: rawAttrs.blocking || rawAttrs.block || 50,
                    offensiveRebound: rawAttrs.offensiveRebound || 50,
                    defensiveRebound: rawAttrs.defensiveRebound || 50,
                    athleticism: rawAttrs.athleticism || Math.round((rawAttrs.speed + rawAttrs.agility + rawAttrs.vertical + rawAttrs.strength) / 4) || 60
                };

                if (!attrs.freeThrow && def.ovr) attrs.freeThrow = def.ovr; // Fallback

                const physicals = generatePhysicals(position);
                const tendencies = deriveTendenciesFromAttributes(attrs, position);

                // Generate Attribute Potentials for Real Players
                const attributePotentials = { ...attrs };
                const growthRoom = Math.max(0, 27 - def.age) * 2; // Simple age-based room
                (Object.keys(attributePotentials) as Array<keyof PlayerAttributes>).forEach(k => {
                    const noise = Math.floor(Math.random() * 5);
                    attributePotentials[k] = Math.min(99, attrs[k] + growthRoom + noise);
                });

                const player: Player = {
                    id: generateUUID(),
                    firstName: def.firstName,
                    lastName: def.lastName,
                    position: position,
                    age: def.age,
                    height: physicals.height,
                    weight: physicals.weight,
                    personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
                    attributes: attrs,
                    attributePotentials: attributePotentials,
                    archetype: deriveArchetypeName(attrs, tendencies, position),
                    tendencies: tendencies,
                    morale: 90,
                    fatigue: 0,
                    teamId: team.id,
                    isStarter: true, // Assume top 5 are starters
                    minutes: 30,
                    seasonStats: {
                        gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                        turnovers: 0, offensiveRebounds: 0, defensiveRebounds: 0, fouls: 0,
                        fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0,
                        plusMinus: 0
                    },
                    careerStats: [],
                    potential: Math.min(99, def.ovr + (30 - def.age > 0 ? (30 - def.age) * 2 : 0)), // Simple potential logic
                    loveForTheGame: 15,
                    badges: def.badges,
                    overall: calculateOverall(attrs, position),
                    jerseyNumber: Math.floor(Math.random() * 100),
                    acquisition: {
                        type: 'initial',
                        year: 2024
                    }
                };
                // Generate Real Contract
                const fairSalary = calculateFairSalary(player.overall);
                const years = Math.floor(Math.random() * 4) + 1;

                allContracts.push({
                    id: generateUUID(),
                    playerId: player.id,
                    teamId: team.id,
                    amount: fairSalary,
                    yearsLeft: years,
                    startYear: 2024,
                    role: 'Starter'
                });

                allPlayers.push(player);
            });
        }

        // 2. Fill Rest of Roster (Target 14 players)
        const currentCount = realPlayers ? realPlayers.length : 0;
        const needed = 14 - currentCount;

        for (let i = 0; i < needed; i++) {
            const filler = generatePlayer(undefined, 'bench');
            filler.teamId = team.id;
            filler.isStarter = false;
            filler.minutes = 15;

            // Tune down potential for generic fillers
            filler.potential = filler.overall + Math.floor(Math.random() * 4);

            allPlayers.push(filler);

            // Generate Fair Generic Contract
            const fairSalary = calculateFairSalary(filler.overall);
            const years = filler.age < 24 ? 3 : Math.floor(Math.random() * 2) + 1; // Prospects get 3yr, vets 1-2

            allContracts.push({
                id: generateUUID(),
                playerId: filler.id,
                teamId: team.id,
                amount: fairSalary,
                yearsLeft: years,
                startYear: 2024,
                role: 'Bench'
            });
        }

        // 3. Optimize Rotation
        const teamPlayers = allPlayers.filter(p => p.teamId === team.id);
        optimizeTeamRotation(teamPlayers);
    });

    return { players: allPlayers, contracts: allContracts };
}
