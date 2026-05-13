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
 *   - BLK:     ~1.8/game (Adjusted up to reward elite rim protectors)
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
  REBOUNDS:     36.5,   // Slightly up to ensure elite centers get impact
  OREB_PCT:     0.310,  
  DREB_PCT:     0.690,

  // Playmaking & defense
  ASSISTS:      22.0,   
  TURNOVERS:    12.8,
  STEALS:        3.8,   // Lowered from 4.2 to hit 1.4 leader target
  BLOCKS:        2.2,   

  // Shot zone distribution (% of FGA)
  RIM_RATE:    0.22,   
  MID_RATE:    0.38,   
  THREE_RATE:  0.40,   

  // Make% by zone — EuroLeague is significantly lower efficiency due to spacing/rules
  RIM_PCT:     0.490,  // Drastic reduction to stop 30 PPG leaders
  MID_PCT:     0.395,  
  THREE_FG_PCT: 0.315, // Targeting ~34-37% team averages after skill adjustments

  // Foul rates by play type
  FOUL_DRIVE:      0.28,
  FOUL_POST:       0.22,  
  FOUL_PNR_ROLL:   0.16,
  FOUL_ISO:        0.09,
  FOUL_SPOT3:      0.03,
  FOUL_CATCH3:     0.03,
  FOUL_MID:        0.06,

  // And-1 rate at the rim
  AND_ONE_RIM:     0.04,

  // Team foul bonus threshold
  TEAM_FOUL_BONUS: 5,

  // Foul-out threshold
  FOUL_OUT_THRESHOLD: 5,

  // Overtime
  OT_POSSESSIONS_PER_TEAM: 10, 

  // Home court advantage
  HOME_ATTRIBUTE_BOOST: 1.05,   
  HOME_SHOOT_BOOST:     0.015,  
  AWAY_SHOOT_PENALTY:   0.010,  
};

/**
 * EuroLeague base usage by position.
 */
export const EURO_BASE_USAGE: Record<string, number> = {
  PG: 0.225,  
  SG: 0.200,
  SF: 0.205,  
  PF: 0.190,  
  C:  0.180,
};

/**
 * Position caps.
 */
export const EURO_USAGE_CAP: Record<string, number> = {
  PG: 0.24, 
  SG: 0.23,
  SF: 0.22,
  PF: 0.21,
  C:  0.21,
};

/**
 * EuroLeague stars play less than NBA stars (25-31 MPG).
 */
export const EURO_MINUTES_BY_RANK = [31, 30, 29, 28, 26, 22, 16, 12, 6, 0, 0, 0, 0];
