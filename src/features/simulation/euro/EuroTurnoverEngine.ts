/**
 * EuroTurnoverEngine.ts — EuroLeague turnover resolution
 *
 * EuroLeague turnover profile:
 *   - TOV: ~12.8/game (vs NBA ~15/game), but per fewer possessions → ~17.8% TO rate
 *   - EL is more disciplined (structured offenses, fewer hero-ball mistakes)
 *   - Strong team defense creates more turnovers via pressure systems
 *   - Steals: ~6.2/game (high for the pace — defensive intensity)
 *   - EL defenders use zonal reads, traps, and gambling steals more
 */

import type { Player } from '../../../models/Player';
import type { DefensiveStrategy } from '../TacticsTypes';
import { DEFENSIVE_SCHEME_EFFECTS } from '../TacticsTypes';

export interface EuroTurnoverResult {
  isTurnover: boolean;
  isSteal: boolean;
  stealerId?: string;
  cause: 'steal' | 'bad_pass' | 'shot_clock' | 'offensive_foul' | 'trap' | 'none';
}

export function checkEuroTurnover(
  handler: Player,
  defenseLineup: Player[],
  stamina: number = 100,
  defenseScheme?: DefensiveStrategy,
  morale: number = 50
): EuroTurnoverResult {
  const def = defenseLineup.find(p => p.position === handler.position) ?? defenseLineup[0];

  // ----------------------------------------------------------------
  // SCHEME-FORCED TURNOVERS (Full Court Press, Trapping zones)
  // ----------------------------------------------------------------
  const scheme = defenseScheme ? DEFENSIVE_SCHEME_EFFECTS[defenseScheme] : null;
  const schemeTOBonus = scheme?.turnoverForced ?? 0;
  if (schemeTOBonus > 0 && Math.random() < schemeTOBonus) {
    const stealer = defenseLineup.reduce((b, p) =>
      p.attributes.stealing > b.attributes.stealing ? p : b
    );
    return { isTurnover: true, isSteal: true, stealerId: stealer.id, cause: 'trap' };
  }

  // ----------------------------------------------------------------
  // ON-BALL STEAL by primary defender
  // EL defenders are craftier — slightly higher steal rate than NBA
  // Base steal probability calibrated: ~6.2 steals/game @ ~72 poss/team
  // → ~8.6% of turnovers are steals
  // ----------------------------------------------------------------
  const defStealing = def.attributes.stealing;
  const defPerim    = def.attributes.perimeterDefense;
  const defIQ       = def.attributes.basketballIQ;

  // Only elite defenders (60+ stealing) have meaningful on-ball steal rates
  // Further reduced to target 1.4 SPG leader
  const onBallStealProb = Math.max(0,
    (defStealing - 60) * 0.00065 +
    (defPerim    - 60) * 0.00025 +
    (defIQ       - 70) * 0.00015
  );
  if (Math.random() < onBallStealProb) {
    return { isTurnover: true, isSteal: true, stealerId: def.id, cause: 'steal' };
  }

  // ----------------------------------------------------------------
  // HELP-SIDE / PASSING LANE STEAL
  // ----------------------------------------------------------------
  const bestDef = defenseLineup.reduce((b, p) =>
    (p.attributes.stealing + p.attributes.basketballIQ) > (b.attributes.stealing + b.attributes.basketballIQ) ? p : b
  );
  const helpStealProb = Math.max(0,
    (bestDef.attributes.stealing - 75)    * 0.00020 +
    (bestDef.attributes.basketballIQ - 75) * 0.00010
  );
  if (Math.random() < helpStealProb) {
    return { isTurnover: true, isSteal: true, stealerId: bestDef.id, cause: 'steal' };
  }

  // ----------------------------------------------------------------
  // HANDLER-SIDE RISK
  // Poor ball-handling or IQ under defensive pressure
  // EL: structured players (high IQ) protect the ball better
  // ----------------------------------------------------------------
  const handlerRisk = Math.max(0,
    (78 - handler.attributes.playmaking)   * 0.0012 +
    (72 - handler.attributes.ballHandling)  * 0.0009 +
    (75 - handler.attributes.basketballIQ)  * 0.0006
  );

  // Fatigue: tired players lose handle
  const fatigueMod = stamina < 50 ? (50 - stamina) * 0.00025 : 0;

  // Morale: frustrated/unhappy players rush decisions
  let moraleMod = 0;
  if (morale < 30)      moraleMod = 0.025;
  else if (morale < 50) moraleMod = 0.012;

  // ----------------------------------------------------------------
  // BASE NOISE: shot-clock violations, offensive fouls, bad read passes
  // Calibrated: ~12.8 TO / 72 possessions = ~17.8% TO rate
  // After accounting for steals (~2.5% above), base = ~15.3%
  // Sub-components: bad pass 7%, off. foul 3%, shot clock 3%, misc 2%
  // ----------------------------------------------------------------
  const baseNoise = 0.078;

  const totalTOProb = handlerRisk + fatigueMod + moraleMod + baseNoise;

  if (Math.random() < totalTOProb) {
    // Categorize the turnover type for future commentary
    const roll = Math.random();
    const cause = roll < 0.40 ? 'bad_pass'
      : roll < 0.60 ? 'shot_clock'
      : 'offensive_foul';
    return { isTurnover: true, isSteal: false, cause };
  }

  return { isTurnover: false, isSteal: false, cause: 'none' };
}
