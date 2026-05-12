import type { Player } from '../models/Player';
import { calculateOverall } from './playerUtils';

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING SYSTEM  (3-factor, position-aware)
//
// Factor 1 (50%): Position Score — rewards attributes that matter for the role,
//                 penalises irrelevant ones only lightly.
// Factor 2 (30%): Global Score — complete attribute evaluation regardless of role.
// Factor 3 (20%): Team Value — how much does this player elevate their team?
// ─────────────────────────────────────────────────────────────────────────────

type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

interface AttributeWeight {
    key: keyof Player['attributes'];
    weight: number; // positive → reward, these should sum to 1.0
}

const POSITION_WEIGHTS: Record<Position, AttributeWeight[]> = {
    PG: [
        { key: 'playmaking',       weight: 0.22 },
        { key: 'ballHandling',     weight: 0.20 },
        { key: 'basketballIQ',     weight: 0.15 },
        { key: 'perimeterDefense', weight: 0.12 },
        { key: 'stealing',         weight: 0.10 },
        { key: 'threePointShot',   weight: 0.10 },
        { key: 'athleticism',      weight: 0.06 },
        { key: 'midRange',         weight: 0.05 },
    ],
    SG: [
        { key: 'threePointShot',   weight: 0.22 },
        { key: 'midRange',         weight: 0.16 },
        { key: 'athleticism',      weight: 0.14 },
        { key: 'perimeterDefense', weight: 0.12 },
        { key: 'ballHandling',     weight: 0.10 },
        { key: 'finishing',        weight: 0.10 },
        { key: 'stealing',         weight: 0.08 },
        { key: 'basketballIQ',     weight: 0.08 },
    ],
    SF: [
        { key: 'finishing',        weight: 0.18 },
        { key: 'threePointShot',   weight: 0.16 },
        { key: 'athleticism',      weight: 0.14 },
        { key: 'perimeterDefense', weight: 0.12 },
        { key: 'defensiveRebound', weight: 0.10 },
        { key: 'midRange',         weight: 0.10 },
        { key: 'basketballIQ',     weight: 0.10 },
        { key: 'playmaking',       weight: 0.10 },
    ],
    PF: [
        { key: 'offensiveRebound', weight: 0.16 },
        { key: 'defensiveRebound', weight: 0.16 },
        { key: 'finishing',        weight: 0.14 },
        { key: 'interiorDefense',  weight: 0.14 },
        { key: 'athleticism',      weight: 0.12 },
        { key: 'threePointShot',   weight: 0.10 }, // stretch PF bonus
        { key: 'basketballIQ',     weight: 0.10 },
        { key: 'blocking',         weight: 0.08 },
    ],
    C: [
        { key: 'offensiveRebound', weight: 0.20 },
        { key: 'defensiveRebound', weight: 0.20 },
        { key: 'interiorDefense',  weight: 0.18 },
        { key: 'finishing',        weight: 0.16 },
        { key: 'blocking',         weight: 0.14 },
        { key: 'basketballIQ',     weight: 0.08 },
        { key: 'athleticism',      weight: 0.04 },
    ],
};

// All attributes with equal weight for the "global" factor
const ALL_ATTRIBUTES: (keyof Player['attributes'])[] = [
    'finishing', 'midRange', 'threePointShot', 'freeThrow',
    'playmaking', 'ballHandling', 'basketballIQ', 'athleticism',
    'interiorDefense', 'perimeterDefense', 'stealing', 'blocking',
    'offensiveRebound', 'defensiveRebound',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Weighted sum of position-relevant attributes, normalised to 0–100. */
function positionScore(player: Player): number {
    const pos = (player.position as Position) in POSITION_WEIGHTS
        ? (player.position as Position)
        : 'SF'; // fallback
    const weights = POSITION_WEIGHTS[pos];
    let score = 0;
    for (const { key, weight } of weights) {
        score += (player.attributes[key] ?? 70) * weight;
    }
    return score; // already 0–100 range
}

/** Simple average of all 14 attributes. */
function globalScore(player: Player): number {
    const total = ALL_ATTRIBUTES.reduce(
        (sum, key) => sum + (player.attributes[key] ?? 70),
        0,
    );
    return total / ALL_ATTRIBUTES.length;
}

/** How much does this player improve the team?
 *  Measured as (player global score) - (team average global score).
 *  Returns a delta in the range roughly -30 … +30. */
function teamValueDelta(player: Player, teamPlayers: Player[]): number {
    if (!teamPlayers || teamPlayers.length <= 1) return 0;
    const others = teamPlayers.filter(p => p.id !== player.id);
    if (others.length === 0) return 0;
    const teamAvg = others.reduce((sum, p) => sum + globalScore(p), 0) / others.length;
    return globalScore(player) - teamAvg;
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Calculate a 0.5–5.0 star rating for a player based on:
 *   50% → How good they are AT THEIR POSITION (position-specific weights)
 *   30% → How good they are overall (complete attribute average)
 *   20% → How much value they add to their current team
 */
export function calculatePlayerStars(player: Player, teamPlayers: Player[]): number {
    const pos  = positionScore(player);   // 0–100
    const glob = globalScore(player);     // 0–100
    const delta = teamValueDelta(player, teamPlayers); // roughly -30 to +30

    // Combine: weighted composite score (0–100 range)
    // Team delta is scaled so ±20 pts shifts the composite by ±4 pts
    const composite = pos * 0.50 + glob * 0.30 + (delta * 0.20);

    // Map composite to 0.5–5.0 stars
    // Calibration:  ≤ 60  → 0.5 stars (bench player)
    //                  75  → 3.0 stars (solid starter)
    //                  85  → 4.5 stars (star player)
    //               ≥ 90  → 5.0 stars (superstar / MVP)
    const LOW  = 60;
    const HIGH = 90;
    const raw  = ((composite - LOW) / (HIGH - LOW)) * 4.5 + 0.5;

    // Clamp and round to nearest 0.5
    const stars = Math.max(0.5, Math.min(5.0, raw));
    return Math.round(stars * 2) / 2;
}

// ── Legacy shim — kept so existing callers still compile ─────────────────────
// Many components call calculateStars(overall, baseline).
// We keep the old signature but reroute through the simple linear mapping
// so the codebase doesn't break. Components that have a full Player object
// should prefer calculatePlayerStars().
export const calculateStars = (playerOverall: number, teamBaseline: number): number => {
    const diff = playerOverall - teamBaseline;
    const starShift = diff / 8.0;
    let stars = 3.0 + starShift;
    stars = Math.max(0.5, Math.min(5.0, stars));
    return Math.round(stars * 2) / 2;
};

// ── Team baseline (unchanged) ─────────────────────────────────────────────────
export const calculateTeamBaseline = (teamPlayers: Player[]): number => {
    if (!teamPlayers || teamPlayers.length === 0) return 75;
    // Always recalculate from attributes so stale stored .overall never causes issues
    const withOvr = teamPlayers.map(p => ({ p, ovr: calculateOverall(p) }));
    const sorted = withOvr.sort((a, b) => b.ovr - a.ovr);
    const core = sorted.slice(0, 8);
    const sum = core.reduce((acc, { ovr }) => acc + ovr, 0);
    return sum / core.length;
};

// Formatting helper
export const getStarString = (stars: number): string => {
    const full = Math.floor(stars);
    const hasHalf = stars % 1 !== 0;
    const starStr = '★'.repeat(full) + (hasHalf ? '½' : '');
    return starStr || '½';
};
