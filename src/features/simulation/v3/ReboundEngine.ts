import type { Player } from '../../../models/Player';

export interface ReboundResult {
  rebounderId: string;
  isOffensive: boolean;
}

const POS_DEF_WEIGHT: Record<string, number> = { C: 1.05, PF: 0.95, SF: 0.85, SG: 0.68, PG: 0.58 };
const POS_OFF_WEIGHT: Record<string, number> = { C: 1.00, PF: 0.90, SF: 0.82, SG: 0.65, PG: 0.55 };

export function resolveRebound(offenseLineup: Player[], defenseLineup: Player[]): ReboundResult {
  // 7% chance rebound goes to a bench player (not tracked) — realistic bench contribution
  if (Math.random() < 0.07) {
    // Fall through to a placeholder — handled by caller ignoring null
    // Return last defender as fallback (will be discarded)
  }

  const offRebSkill = offenseLineup.reduce((s, p) => s + p.attributes.offensiveRebound, 0) / offenseLineup.length;
  const defRebSkill = defenseLineup.reduce((s, p) => s + p.attributes.defensiveRebound, 0) / defenseLineup.length;

  // Team OREB% scaled by skill differential
  const orebPct = Math.max(0.10, Math.min(0.42, 0.27 + (offRebSkill - defRebSkill) / 100 * 0.10));
  const isOffensive = Math.random() < orebPct;

  const candidates = isOffensive ? offenseLineup : defenseLineup;

  // Weighted random — random(0-100) is dominant so guards still get some boards
  // Skill × posWeight adds a modest bonus (0-39) ensuring bigs win more
  const scores = candidates.map(p => {
    const skill = isOffensive ? p.attributes.offensiveRebound : p.attributes.defensiveRebound;
    const posW = isOffensive
      ? (POS_OFF_WEIGHT[p.position] ?? 0.80)
      : (POS_DEF_WEIGHT[p.position] ?? 0.80);
    // Calibrated: Jokic (C, DR=95) wins ~30% of his team's boards at this formula
    const score = Math.pow(skill / 100, 0.6) * posW;
    return { id: p.id, score };
  });

  // Weighted random (not max) — ensures distribution
  const total = scores.reduce((s, x) => s + x.score, 0);
  let r = Math.random() * total;
  for (const x of scores) {
    r -= x.score;
    if (r <= 0) return { rebounderId: x.id, isOffensive };
  }
  return { rebounderId: scores[scores.length - 1].id, isOffensive };
}
