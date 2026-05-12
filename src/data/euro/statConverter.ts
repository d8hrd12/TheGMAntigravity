/**
 * EuroLeague Stat → Attribute Converter
 *
 * INPUT: Real player stats from the spreadsheet
 * OUTPUT: Game attributes (shooting, slashing, defense, rebounding, playmaking, athleticism, stars)
 *
 * The rosterSeeder maps these "simple euro format" fields to full PlayerAttributes:
 *   shooting   → midRange, threePointShot, freeThrow
 *   slashing   → finishing
 *   defense    → interiorDefense, perimeterDefense, stealing, blocking
 *   rebounding → offensiveRebound, defensiveRebound
 *   playmaking → playmaking, ballHandling
 *   athleticism→ athleticism
 *   stars      → star rating (1.0–5.0, steps of 0.5)
 */

export interface RawStats {
    /** Points per game */
    ppg: number;
    /** Field goal % as integer (e.g., 542 = 54.2%) */
    fgPct: number;
    /** Three pointers made per game */
    tpm: number;
    /** Three pointer attempts per game */
    tpa: number;
    /** Three point % as integer (e.g., 399 = 39.9%) */
    tpPct: number;
    /** Free throw % as integer (e.g., 893 = 89.3%) */
    ftPct: number;
    /** Offensive rebounds per game */
    oreb: number;
    /** Defensive rebounds per game */
    dreb: number;
    /** Total rebounds per game */
    reb: number;
    /** Assists per game */
    ast: number;
    /** Steals per game */
    stl: number;
    /** Blocks per game */
    blk: number;
    /** Turnovers per game */
    tov: number;
    /** Minutes per game */
    min: number;
    /** Games played */
    gp: number;
    /** Advanced composite rating (last column in spreadsheet, BPM-like) */
    adv: number;
}

function clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, Math.round(val)));
}

/**
 * SHOOTING (40–99)
 * Reflects 3PT ability (volume-weighted), FT reliability, and midrange efficiency.
 * Low 3PA = non-shooter penalty. High FT% = reliable scorer.
 */
function calcShooting(s: RawStats): number {
    let base = 62;

    // 3PT component — volume matters (user's explicit instruction)
    if (s.tpa >= 4.0 && s.tpPct >= 390) base += 24;       // Elite volume shooter (39%+)
    else if (s.tpa >= 3.0 && s.tpPct >= 370) base += 19;  // Good volume shooter
    else if (s.tpa >= 2.0 && s.tpPct >= 350) base += 13;  // Decent shooter
    else if (s.tpa >= 1.5 && s.tpPct >= 400) base += 16;  // Low vol but elite %
    else if (s.tpa >= 2.0 && s.tpPct >= 320) base += 5;   // Average shooter
    else if (s.tpa >= 2.0 && s.tpPct < 310) base -= 5;    // High vol, poor %
    else if (s.tpa < 1.0) base -= 18;                      // Non-shooter

    // FT% component — true shooting reliability
    if (s.ftPct >= 880) base += 8;
    else if (s.ftPct >= 820) base += 5;
    else if (s.ftPct >= 750) base += 2;
    else if (s.ftPct < 680) base -= 7;
    else if (s.ftPct < 600) base -= 12;

    // FG% bonus (general scoring efficiency)
    if (s.fgPct >= 550 && s.tpa < 1.5) base -= 5; // High FG% from close range, not a shooter
    else if (s.fgPct >= 500) base += 2;
    else if (s.fgPct < 400) base -= 4;

    return clamp(base, 40, 99);
}

/**
 * SLASHING (40–99)
 * Finishing at the rim, attacking the basket, interior scoring.
 * Bigs with high FG% = elite finishers. Guards = speed + PPG driven.
 */
function calcSlashing(s: RawStats): number {
    // PPG contribution (scoring ability)
    const ptsBonus = s.ppg * 2.2;

    // FG% contribution (efficiency at rim for bigs, overall for guards)
    const fgBonus = (s.fgPct / 10 - 45) * 0.6;

    // Interior bonus for true rim finishers (FG% > 60%, low 3PA)
    const rimBonus = (s.fgPct >= 600 && s.tpa < 1.0) ? 10 : 0;

    return clamp(48 + ptsBonus + fgBonus + rimBonus, 45, 99);
}

/**
 * DEFENSE (40–99)
 * Reflects steals, blocks, and minutes context.
 * Both perimeter and interior defense are combined here.
 */
function calcDefense(s: RawStats): number {
    const stlBonus = s.stl * 22;
    const blkBonus = s.blk * 14;
    const minBonus = s.min * 0.35;
    return clamp(56 + stlBonus + blkBonus + minBonus, 48, 99);
}

/**
 * REBOUNDING (30–99)
 * Total rebounds weighted, offensive rebounds get extra credit (hustle).
 */
function calcRebounding(s: RawStats): number {
    return clamp(38 + s.reb * 6.5 + s.oreb * 5, 30, 99);
}

/**
 * PLAYMAKING (40–99)
 * Assists drive this. Turnover penalty applied. High AST/TOV ratio = elite.
 */
function calcPlaymaking(s: RawStats): number {
    const astBonus = s.ast * 13;
    const tovPenalty = s.tov * 4;
    const stlBonus = s.stl * 2; // court awareness
    return clamp(48 + astBonus + stlBonus - tovPenalty, 40, 99);
}

/**
 * ATHLETICISM (55–99)
 * Estimated by position defaults + performance indicators.
 * Pass your own override if you know the player's profile.
 */
function calcAthleticism(s: RawStats, positionOverride?: number): number {
    if (positionOverride !== undefined) return clamp(positionOverride, 55, 99);
    // Default: derive from MIN/scoring efficiency
    const base = 72;
    const minBonus = s.min > 25 ? 5 : s.min > 18 ? 2 : 0;
    const ppgBonus = s.ppg > 15 ? 5 : s.ppg > 10 ? 3 : 0;
    return clamp(base + minBonus + ppgBonus, 60, 92);
}

/**
 * STARS (0.5–5.0, steps of 0.5)
 * Blends PPG with the advanced BPM-like composite rating.
 * Advanced stat normalizes impact; PPG captures usage/scoring.
 * Edge case: small sample sizes (GP < 12) are down-weighted.
 */
function calcStars(s: RawStats): number {
    const gpFactor = s.gp < 12 ? 0.8 : 1.0;
    const raw = (s.adv / 7.5 + s.ppg / 7) * gpFactor;
    // Round to nearest 0.5
    const rounded = Math.round(raw * 2) / 2;
    return Math.max(1.0, Math.min(5.0, rounded));
}

export interface EuroPlayerAttrs {
    shooting: number;
    slashing: number;
    defense: number;
    rebounding: number;
    playmaking: number;
    athleticism: number;
    stars: number;
}

/**
 * Main converter: pass raw stats → get game attributes
 * @param stats Raw stats from spreadsheet
 * @param athleticismOverride Optional manual override for athleticism (position-based)
 */
export function convertStats(stats: RawStats, athleticismOverride?: number): EuroPlayerAttrs {
    return {
        shooting: calcShooting(stats),
        slashing: calcSlashing(stats),
        defense: calcDefense(stats),
        rebounding: calcRebounding(stats),
        playmaking: calcPlaymaking(stats),
        athleticism: calcAthleticism(stats, athleticismOverride),
        stars: calcStars(stats),
    };
}

// ─── QUICK REFERENCE TABLE (for manual team entry) ─────────────────────────
//
// SHOOTING:
//   Elite 3PT shooter (3PA>=4, 3P%>=39%): ~86-96
//   Good shooter (3PA>=3, 3P%>=37%): ~80-88
//   Average shooter (3P%>=33%): ~70-78
//   Non-shooter (3PA<1.0): ~40-55
//   Always boosted by high FT%
//
// SLASHING:
//   Big man with FG%>62%: ~82-95
//   Athletic guard, PPG>15: ~85-95
//   Role player/spot scorer: ~60-75
//
// DEFENSE:
//   Perimeter stopper (STL>1.5): ~85-95
//   Interior protector (BLK>1.5): ~82-92
//   Average (STL~0.7, BLK~0.3): ~70-78
//
// REBOUNDING:
//   Elite rebounder (REB>9): ~95+
//   Good (REB 6-9): ~76-90
//   Guard/wing (REB 2-4): ~50-65
//
// PLAYMAKING:
//   Elite PG (AST>6): ~90-99
//   Solid playmaker (AST 4-6): ~78-90
//   Scorer (AST 2-3): ~60-75
//   Big man (AST<1.5): ~45-58
//
// ATHLETICISM (manual override recommended):
//   Explosive guard/wing: 85-95
//   Athletic forward: 78-88
//   Mobile big: 68-80
//   Veteran/slow big: 58-70
//
// STARS:
//   ~5.0 = Elite starter, all-EL level (adv>20, PPG>16)
//   ~4.5 = Top starter (adv>15, PPG>13)
//   ~4.0 = Solid starter (adv>12, PPG>10)
//   ~3.5 = Key rotation player
//   ~3.0 = Rotational piece
//   ~2.5 = Bench contributor
//   ~1.5-2.0 = Deep bench / limited role
