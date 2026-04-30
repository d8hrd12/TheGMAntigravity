/**
 * NBA-calibrated constants based on 2025-26 season averages.
 * Per team, per game targets.
 */
export const NBA = {
  POSSESSIONS:      100,   // Per team per game
  FGA:               89,   // Field goal attempts
  FG_PCT:          0.475,  // Overall FG%
  THREE_PA:          37,   // 3-point attempts
  THREE_PCT:        0.365, // 3P%
  FTA:               23,   // Free throw attempts
  FT_PCT:           0.78,  // FT%
  REBOUNDS:          44,   // Total (12 OREB + 32 DREB)
  OREB_PCT:         0.27,  // Offensive rebound rate
  ASSISTS:           26,   // Per game
  TURNOVERS:         15,   // Per game (15% of possessions)
  STEALS:             8,
  BLOCKS:             5,

  // Shot zone distribution (of FGA)
  RIM_RATE:         0.30,
  MID_RATE:         0.28,
  THREE_RATE:       0.42,

  // Make % by zone (league avg)
  RIM_PCT:          0.640,
  MID_PCT:          0.430,
  THREE_FG_PCT:     0.365,

  // Foul rate by play type (chance of a shooting foul on that possession)
  FOUL_DRIVE:       0.22,
  FOUL_POST:        0.18,
  FOUL_PNR_ROLL:    0.14,
  FOUL_ISO:         0.07,
  FOUL_SPOT3:       0.02,
  FOUL_CATCH3:      0.02,
  FOUL_MID:         0.04,

  // And-1 probability on makes at the rim
  AND_ONE_RIM:      0.06,
};

/** Base usage rate by position (sums to ~1.0 across a 5-man lineup) */
export const BASE_USAGE: Record<string, number> = {
  PG: 0.235,
  SG: 0.210,
  SF: 0.200,
  PF: 0.185,
  C:  0.170,
};

/** Minutes target by roster rank (sorted by scoring skill) */
export const MINUTES_BY_RANK = [37, 35, 32, 28, 26, 20, 15, 10, 7, 3, 0, 0, 0];
