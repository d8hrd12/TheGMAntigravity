/**
 * EuroReboundEngine.ts — EuroLeague rebound resolution
 *
 * EuroLeague rebounding profile:
 *   - OREB%: ~31% (higher than NBA ~27%) — box-out discipline varies more
 *   - Teams average ~10.7 OREB and ~23.8 DREB per game
 *   - Bigs still dominant but wing rebounding is important in EL
 *   - Less dominant rim-running = more contested mid-air battles
 *   - Shot type matters: missed 3s lead to longer rebounds → guards more involved
 */

import type { Player } from '../../../models/Player';
import { EURO } from './EuroCalibration';

export interface EuroReboundResult {
  rebounderId: string;
  isOffensive: boolean;
  isLongRebound: boolean; // True on missed 3 — guards more likely
}

// Position defensive rebound weight (EL: wings contribute more than NBA)
const EL_DEF_WEIGHT: Record<string, number> = {
  C:  1.05,
  PF: 0.95,
  SF: 0.88,  // Slightly higher than NBA (0.85) — EL wings box out better
  SG: 0.70,
  PG: 0.60,
};

// Position offensive rebound weight
const EL_OFF_WEIGHT: Record<string, number> = {
  C:  1.00,
  PF: 0.92,
  SF: 0.84,
  SG: 0.68,
  PG: 0.58,
};

// Long rebound (missed 3) position modifier — guards crash more
const LONG_REB_DEF_WEIGHT: Record<string, number> = {
  C:  0.75,
  PF: 0.82,
  SF: 0.90,
  SG: 0.98,
  PG: 1.05,
};
const LONG_REB_OFF_WEIGHT: Record<string, number> = {
  C:  0.70,
  PF: 0.78,
  SF: 0.90,
  SG: 1.00,
  PG: 1.08,
};

export function resolveEuroRebound(
  offenseLineup: Player[],
  defenseLineup: Player[],
  isLongRebound: boolean = false  // Missed 3-pointer → longer ball
): EuroReboundResult {
  // Average rebound skill
  const offRebSkill = offenseLineup.reduce((s, p) => s + p.attributes.offensiveRebound, 0) / offenseLineup.length;
  const defRebSkill = defenseLineup.reduce((s, p) => s + p.attributes.defensiveRebound, 0) / defenseLineup.length;

  // Team OREB% — EuroLeague baseline is 31%, skill differential adjusts
  // Range: ~0.18 (elite defensive rebounding team) to ~0.42 (dominant offensive rebounding)
  const baseOrebPct = EURO.OREB_PCT; // 0.31
  const orebPct = Math.max(0.14, Math.min(0.45,
    baseOrebPct + (offRebSkill - defRebSkill) / 100 * 0.12
  ));
  const isOffensive = Math.random() < orebPct;

  const candidates = isOffensive ? offenseLineup : defenseLineup;
  const posWeights = isOffensive
    ? (isLongRebound ? LONG_REB_OFF_WEIGHT : EL_OFF_WEIGHT)
    : (isLongRebound ? LONG_REB_DEF_WEIGHT : EL_DEF_WEIGHT);

  // Weighted random — attribute + position weight
  const scores = candidates.map(p => {
    const skill = isOffensive ? p.attributes.offensiveRebound : p.attributes.defensiveRebound;
    const posW = posWeights[p.position] ?? 0.82;
    // Slightly more random than NBA (0.6 power) → EL rebounding less predictable
    const score = Math.pow(skill / 100, 0.55) * posW;
    return { id: p.id, score };
  });

  const total = scores.reduce((s, x) => s + x.score, 0);
  let r = Math.random() * total;
  for (const x of scores) {
    r -= x.score;
    if (r <= 0) return { rebounderId: x.id, isOffensive, isLongRebound };
  }
  return {
    rebounderId: scores[scores.length - 1].id,
    isOffensive,
    isLongRebound
  };
}
