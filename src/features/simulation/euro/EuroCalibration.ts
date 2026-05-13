/**
 * EuroCalibration.ts — EuroLeague 2025-26 calibrated constants
 *
 * Derived from real EuroLeague 2025-26 season averages (team totals & advanced stats).
 * League averages used:
 *   - Pace:    ~72.0 possessions/team/game  (range: 69.9–77.0)
 *   - PPG:     ~85.0 pts/game               (range: 79.3–90.7)
 *   - FGA:     ~64.5/game                   (range: 61.3–68.9)
 *   - FG%:     ~47.7%                        (range: 43.6–50.5%)
 *   - 3PA:     ~26.0/game                   (range: 23.6–31.9)
 *   - 3P%:     ~35.6%                        (range: 33.0–37.6%)
 *   - FTA:     ~20.2/game                   (range: 17.0–23.5)
 *   - FT%:     ~78.5%                        (range: 74.3–81.5%)
 *   - OREB:    ~10.7/game
 *   - DREB:    ~23.8/game
 *   - AST:     ~19.2/game                   (range: 14.7–21.6)
 *   - TOV:     ~12.8/game                   (range: 10.7–13.9)
 *   - STL:     ~6.2/game
 *   - BLK:     ~1.3/game (genuine EURO stat — much lower than NBA)
 *
 * Game rules:
 *   - 4 × 10-minute quarters (not 12)
 *   - Foul out at 5 personal fouls (not 6)
 *   - Team foul bonus (bonus FT) after 5th team foul per quarter
 *   - Shot clock: 24 sec (14 sec after offensive rebound)
 */

export const EURO = {
  // Possessions per team per game
  POSSESSIONS: 72,

  // Shooting
  FGA:          64.5,
  FG_PCT:       0.477,
  THREE_PA:     26.0,
  THREE_PCT:    0.356,
  FTA:          20.2,
  FT_PCT:       0.785,

  // Rebounding
  REBOUNDS:     34.5,   // Total (OREB + DREB)
  OREB_PCT:     0.310,  // Offensive rebound %  — higher than NBA due to less athleticism at guard spots
  DREB_PCT:     0.690,

  // Playmaking & defense
  ASSISTS:      19.2,
  TURNOVERS:    12.8,
  STEALS:        6.2,
  BLOCKS:        1.3,   // Very low — EuroLeague has less rim-protecting giants

  // Shot zone distribution (% of FGA)
  // EuroLeague: less rim-running, more mid-post and catch-3
  RIM_RATE:    0.22,   // Less transition/athleticism-driven rim plays
  MID_RATE:    0.38,   // More structured half-court mid-post actions
  THREE_RATE:  0.40,   // High 3PA but less than NBA

  // Make% by zone — calibrated from real FG%, 3P%, finishing data
  RIM_PCT:     0.585,  // Lower than NBA (0.64) — less athletic finishers
  MID_PCT:     0.455,  // Higher than NBA (0.43) — EL teams run more disciplined mid-post
  THREE_FG_PCT: 0.356, // Spot-on to real EL 3P%

  // Foul rates by play type (probability of foul on that possession)
  // EuroLeague fouls more aggressively than NBA — especially on drives
  FOUL_DRIVE:      0.28,
  FOUL_POST:       0.22,  // Post-up game draws more contact in EL
  FOUL_PNR_ROLL:   0.16,
  FOUL_ISO:        0.09,
  FOUL_SPOT3:      0.03,
  FOUL_CATCH3:     0.03,
  FOUL_MID:        0.06,

  // And-1 rate at the rim (lower in EL — different officiating)
  AND_ONE_RIM:     0.04,

  // Team foul bonus threshold (EuroLeague: 5th team foul → bonus free throws)
  TEAM_FOUL_BONUS: 5,

  // Foul-out threshold (EuroLeague rules: 5 personal fouls → disqualification)
  FOUL_OUT_THRESHOLD: 5,

  // Overtime: 5-minute extra period
  OT_POSSESSIONS_PER_TEAM: 10, // ~72/4 * (5/10) scaled down

  // Home court advantage — EuroLeague is renowned for intense home environments
  // (crowds, noise, travel fatigue for away teams)
  HOME_ATTRIBUTE_BOOST: 1.05,   // +5% to home team attributes (same as current implementation)
  HOME_SHOOT_BOOST:     0.015,  // Additional +1.5% to home shooting accuracy
  AWAY_SHOOT_PENALTY:   0.010,  // -1.0% to away shooting accuracy (crowd noise etc.)
};

/**
 * EuroLeague base usage by position.
 * Guards handle ball more but big men (PF/C) get more post touches vs NBA.
 */
export const EURO_BASE_USAGE: Record<string, number> = {
  PG: 0.225,  // Less isolation-heavy than NBA PGs
  SG: 0.200,
  SF: 0.205,  // Wings have higher usage in structured EL offense
  PF: 0.190,  // Post play more common
  C:  0.180,
};

/**
 * Position caps — prevents any one player from monopolizing possessions.
 * EuroLeague is more team-oriented; usage is more distributed.
 */
export const EURO_USAGE_CAP: Record<string, number> = {
  PG: 0.26,
  SG: 0.24,
  SF: 0.23,
  PF: 0.21,
  C:  0.21,
};

/**
 * Minute targets per roster rank for a 10-minute quarter game (40 total minutes).
 * 5 starters × average ~30 min + bench rotation.
 * Total = 200 minutes (5 players × 40 min).
 */
export const EURO_MINUTES_BY_RANK = [34, 32, 28, 26, 24, 20, 14, 10, 6, 4, 2, 0, 0];
