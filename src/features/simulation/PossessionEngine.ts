import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { GameEvent, PlayerStats } from './SimulationTypes';
import { EventType } from './SimulationTypes';
import type { TeamStrategy } from './TacticsTypes';
import { PACE_MULTIPLIERS, FOCUS_BONUSES, DEFENSIVE_SCHEME_EFFECTS } from './TacticsTypes';
import type { ActionType } from './ActionTypes';
import { CommentaryEngine } from './CommentaryEngine';
import { calculateTendencies, calculateOverall } from '../../utils/playerUtils';

export type Territory = '3PT' | 'MID_RANGE' | 'FINISHING';

export interface PossessionContext {
    offenseTeam: Team;
    defenseTeam: Team;
    offenseLineup: Player[];
    defenseLineup: Player[];
    offenseStrategy: TeamStrategy;
    defenseStrategy: TeamStrategy;
    timeRemaining: number;
    shotClock: number;
    quarter: number;
    scoreMargin: number; // Offense Score - Defense Score
    getStats?: (playerId: string) => PlayerStats | undefined;
    playerConfidence: Record<string, number>; // -1 to +1
    playerPressure: Record<string, number>; // 0 to 1
    gameVariance: number; // -0.05 to +0.05
    offenseCoachRating: number;
    defenseCoachRating: number;
}

export interface PossessionResult {
    events: GameEvent[];
    points: number;
    defensivePoints?: number; // Logic overhaul: Allow defense to score (e.g. Critical Steal)
    endType: 'SCORE' | 'MISS' | 'TURNOVER' | 'FOUL';
    duration: number;
    keepPossession?: boolean;
}

/**
 * Simulates a single possession from start to finish.
 */
// Helper to determine new territory for receiver
// --- 2. SUCCESS CURVES (Point 3) ---
function sigmoid(x: number, k: number, x0: number): number {
    return 1 / (1 + Math.exp(-k * (x - x0)));
}

const SIGMOID_CURVES = {
    RIM: { k: 0.12, x0: 50, base: 0.52 },    // Nudge up
    MID: { k: 0.10, x0: 55, base: 0.46 },    // Nudge up
    THREE: { k: 0.10, x0: 60, base: 0.36 },
    FT: { k: 0.15, x0: 65, base: 0.80 }
};

export const BASE_SUCCESS = {
    RIM: (fin: number) => {
        const { k, x0, base } = SIGMOID_CURVES.RIM;
        return base + (1 - base) * sigmoid(fin, k, x0);
    },
    MID: (mid: number) => {
        const { k, x0, base } = SIGMOID_CURVES.MID;
        return base + (0.50 - base) * sigmoid(mid, k, x0); // Cap Mid at 0.50
    },
    THREE: (three: number) => {
        const { k, x0, base } = SIGMOID_CURVES.THREE;
        return base + (0.45 - base) * sigmoid(three, k, x0); // Cap 3PT at 0.45
    },
    FT: (ft: number) => {
        const { k, x0, base } = SIGMOID_CURVES.FT;
        return base + (0.95 - base) * sigmoid(ft, k, x0);
    }
};

// --- 4. USAGE NORMALIZATION (Point 4) ---
export function calculateUsageLineup(lineup: Player[]): Record<string, number> {
    const usageScores: Record<string, number> = {};
    let totalLineupScore = 0;

    lineup.forEach(p => {
        const a = p.attributes;
        const score = (0.4 * (a.finishing + a.midRange + a.threePointShot) / 3) +
            (0.3 * a.ballHandling) +
            (0.2 * a.playmaking) +
            (0.1 * a.basketballIQ);
        usageScores[p.id] = score;
        totalLineupScore += score;
    });

    // Normalized end-rate target
    const normalized: Record<string, number> = {};
    lineup.forEach(p => {
        normalized[p.id] = (usageScores[p.id] / totalLineupScore);
    });
    return normalized;
}

// --- 5. DECISION MODEL (Point 5) ---
export function calculateDecisionAccuracy(player: Player, ctx: PossessionContext): number {
    const iq = player.attributes.basketballIQ;
    const fatigue = (100 - (player.stamina || 100)) / 100;
    const pressure = ctx.playerPressure[player.id] || 0.5;
    const confidence = ctx.playerConfidence[player.id] || 0;

    const coachBonus = (ctx.offenseCoachRating - 70) * 0.001;
    const prob = 0.60 + (iq - 50) * 0.004 - (fatigue * 0.15) - (pressure * 0.10) + (confidence * 0.05) + coachBonus;
    return Math.min(0.92, Math.max(0.50, prob));
}

// --- 7. ADVANTAGE MODEL (Point 7) ---
export function calculateAdvantageMargin(off: Player, def: Player, ctx: PossessionContext): number {
    const oa = off.attributes;
    const da = def.attributes;
    const confidence = ctx.playerConfidence[off.id] || 0;

    const creation = (0.35 * oa.ballHandling) + (0.25 * oa.playmaking) + (0.20 * oa.athleticism) + (0.10 * oa.basketballIQ) + (0.10 * (confidence + 1) * 50);

    // Containment needs defensive schemes
    const scheme = ctx.defenseStrategy.defense;
    const schemeBonus = (DEFENSIVE_SCHEME_EFFECTS[scheme]?.isolationModifier || 0) + 50; // Base 50

    const containment = (0.40 * da.perimeterDefense) + (0.25 * da.athleticism) + (0.20 * da.basketballIQ) + (0.15 * schemeBonus);

    return creation - containment;
}

// Gaussian helper (Point 9)
export function randomGaussian(mean: number, stdDev: number): number {
    const u = 1 - Math.random();
    const v = 1 - Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
}

// --- 8. SHOT QUALITY (Point 8) ---
export function calculateShotQuality(
    advantageMargin: number,
    contestStrength: number, // 0 to 100
    helpImpact: number, // 0 to 100
    player: Player,
    ctx: PossessionContext
): number {
    const fatigue = (100 - (player.stamina || 100)) / 100;
    const confidence = ctx.playerConfidence[player.id] || 0;

    const coachBonus = (ctx.offenseCoachRating - ctx.defenseCoachRating) * 0.0005;

    const modifier = (advantageMargin * 0.001) -
        (contestStrength * 0.002) -
        (helpImpact * 0.001) -
        (fatigue * 0.001) +
        (confidence * 0.002) +
        coachBonus;

    // Range approx -0.25 to +0.20
    return Math.max(-0.25, Math.min(0.20, modifier));
}

// --- 9. FINAL MAKE PROBABILITY (Point 9) ---
export function calculateFinalMakeProb(
    baseProb: number,
    qualityModifier: number,
    variance: number // Global game variance
): number {
    const gaussian = randomGaussian(0, 0.05); // StdDev 0.05
    const final = baseProb + qualityModifier + variance + gaussian;
    return Math.max(0.05, Math.min(0.95, final));
}

function getReceiverTerritory(receiver: Player): Territory {
    const p = receiver.position;
    const roll = Math.random() * 100;

    if (p === 'C' || p === 'PF') {
        // "Cs and PF get it at the finishing territory most of the time"
        // "(except they have high 3pt>79... 50% 3pt)"
        if (receiver.attributes.threePointShot > 79 && Math.random() < 0.5) {
            return '3PT';
        }
        return 'FINISHING';
    }

    if (p === 'SG' || p === 'PG') { // Assuming PG similar to SG
        // "start from the 3pt territory 90% of the time and 10% from the mid range"
        return roll < 90 ? '3PT' : 'MID_RANGE';
    }

    if (p === 'SF') {
        // "mid range 40%... 3pt 40%... finishing 20%"
        if (roll < 40) return 'MID_RANGE';
        if (roll < 80) return '3PT';
        return 'FINISHING';
    }

    return '3PT'; // Fallback
}

export function simulatePossession(ctx: PossessionContext): PossessionResult {
    const events: GameEvent[] = [];
    let currentTime = ctx.timeRemaining;

    // Pace Logic (Dribble up)
    const paceMod = PACE_MULTIPLIERS[ctx.offenseStrategy.pace] || 1.0;

    // ADJUST DURATION: 
    // baseline 8-16s (Avg 12s). 
    // multiplier scales this. 
    const secondsDribble = Math.floor((Math.random() * 8 + 8) / paceMod);

    if (ctx.timeRemaining > 2800) {
        console.log(`[DEBUG] Time: ${ctx.timeRemaining} | Dribble: ${secondsDribble} | PaceMod: ${paceMod}`);
    }
    currentTime -= secondsDribble;
    if (currentTime < 0) currentTime = 0;

    // Loop State
    let handler = selectBallHandler(ctx.offenseLineup, ctx);
    let territory: Territory = '3PT'; // Starts at 3PT
    let passes = 0;
    let safePass = false; // Safety Valve State
    const MAX_PASSES = 5;
    let lastPasser: Player | undefined = undefined;

    // POSSESSION LOOP
    while (passes < MAX_PASSES) {



        // 1. Defense Roll (Attempt Steal on THIS handler)
        // CHECK: Is this a "Safety Valve" pass? (Deferral from Usage Cap)
        // OR Is this a "Swing Pass" (Routine ball movement)?
        // User Request: "Safe Swing" -> Routine 'PASS' bypass defense roll.
        // If passes > 0, we assume ball is swinging.
        // We apply massive bonus to OFFENSE (Target goes UP).
        // Mod -60 (from before) made Target 135 (Safe).
        // Let's apply -75 for swings.
        let defenseModifier = 0;
        if (safePass) defenseModifier = -60;
        else if (passes > 0) defenseModifier = -75; // Safe Swing

        safePass = false; // Reset

        const defender = ctx.defenseLineup.find(p => p.position === handler.position) || ctx.defenseLineup[0];
        const defenseResult = attemptDefenseRoll(defender, handler, ctx, events, currentTime, defenseModifier);
        if (defenseResult) return defenseResult;

        // 2. Decide Action
        const action = decideAction(handler, ctx, territory);

        // 3. Resolution
        if (action === 'PASS') {
            // Turnover Check (Bad Pass)
            if (handler.attributes.playmaking < 60) {
                const risk = (70 - handler.attributes.playmaking) / 100;
                if (Math.random() < risk * 0.1) return createTurnover(handler, ctx, events, currentTime);
            }

            const receiver = selectReceiver(handler, ctx, lastPasser);

            // TERRITORY RESET (User Request: Wings always receive in 3PT)
            // "Wings (SG/SF) always receive ball in '3PT' territory."
            if (receiver.position === 'SG' || receiver.position === 'SF' || receiver.position === 'PG') {
                territory = '3PT';
            } else {
                territory = getReceiverTerritory(receiver);
            }

            events.push({
                id: `evt_${Date.now()}_pass_${passes}`,
                type: 'action',
                text: `${handler.lastName} passes to ${receiver.lastName} (${territory}).`,
                teamId: ctx.offenseTeam.id,
                gameTime: currentTime,
                possessionId: currentTime
            });

            lastPasser = handler; // Record Assist Potential
            handler = receiver; // Transfer Ball
            passes++;
            currentTime -= 1; // Passes take time
            // Loop continues...

        } else if (action === 'KICK_OUT') {
            // Logic: Pick One SG/SF (3pt) and One C/PF (Fin).
            // High IQ > 70 chooses BEST. Low IQ chooses RANDOM.
            // Target gets +15% Boost.

            const wings = ctx.offenseLineup.filter(p => p.position === 'SG' || p.position === 'SF' || p.position === 'PG');
            const bigs = ctx.offenseLineup.filter(p => p.position === 'C' || p.position === 'PF');

            const wingTarget = wings.length > 0 ? wings[Math.floor(Math.random() * wings.length)] : null;
            const bigTarget = bigs.length > 0 ? bigs[Math.floor(Math.random() * bigs.length)] : null;

            let finalTarget = wingTarget || bigTarget || ctx.offenseLineup.find(p => p.id !== handler.id); // Fallback

            if (wingTarget && bigTarget) {
                if (handler.attributes.basketballIQ > 70) {
                    // Choose Best
                    // Compare Wing 3PT vs Big Finish
                    if (wingTarget.attributes.threePointShot > bigTarget.attributes.finishing) {
                        finalTarget = wingTarget;
                    } else {
                        finalTarget = bigTarget;
                    }
                } else {
                    // Choose Random
                    finalTarget = Math.random() < 0.5 ? wingTarget : bigTarget;
                }
            }

            // Execute Kickout Pass

            if (finalTarget) {
                events.push({
                    id: `evt_${Date.now()}_kickout`,
                    type: 'action',
                    text: `${handler.lastName} drives and KICKS OUT to ${finalTarget.lastName}!`,
                    teamId: ctx.offenseTeam.id,
                    gameTime: currentTime,
                    possessionId: currentTime
                });
                // Bonus 15%
                // Suggestion 3: 40% chance to continue passing instead of shooting
                if (Math.random() < 0.4) {
                    lastPasser = handler;
                    handler = finalTarget;
                    territory = getReceiverTerritory(handler);
                    passes++;
                    currentTime -= 1;
                    continue;
                }

                // KICKOUT FIX: Check if receiver is in FINISHING territory (Rim)
                // If so, pass driveDunkChance=true to force inside shot logic.
                const targetTerritory = getReceiverTerritory(finalTarget);
                const isRim = targetTerritory === 'FINISHING';
                // KICKOUT: If Rim, it is ALWAYS a Catch & Finish (Assisted)
                const res = resolveShot(finalTarget, handler, ctx, events, currentTime - 1, 15, isRim, isRim);
                if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                    // Capped -> Recycle
                    lastPasser = handler;
                    handler = finalTarget;
                    passes++;
                    safePass = true; // Safety Valve
                    if (passes >= MAX_PASSES) return res; // Fallback
                    continue;
                }
                return res;
            } else {
                // No one to pass to? Shoot.
                const res = resolveShot(handler, lastPasser, ctx, events, currentTime);
                if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                    passes++;
                    handler = selectReceiver(handler, ctx);
                    safePass = true; // Safety Valve
                    if (passes >= MAX_PASSES) return res;
                    continue;
                }
                return res;
            }

        } else if (action === 'PICK_AND_ROLL') {
            // Terminating Action
            const screeners = ctx.offenseLineup.filter(p => p.position === 'C' || p.position === 'PF');
            let screener = screeners[0];
            if (screeners.length > 1) {
                screener = screeners.sort((a, b) => (b.attributes.finishing + b.attributes.athleticism) - (a.attributes.finishing + a.attributes.athleticism))[0];
            }

            if (screener && screener.id !== handler.id) {
                events.push({
                    id: `evt_${Date.now()}_pnr`,
                    type: 'action',
                    text: `${handler.lastName} runs P&R with ${screener.lastName}.`,
                    teamId: ctx.offenseTeam.id,
                    gameTime: currentTime,
                    possessionId: currentTime
                });
                // Suggestion 3: 40% chance to continue passing instead of shooting (Screen & Roll -> Kick out/Swing)
                if (Math.random() < 0.4) {
                    lastPasser = handler;
                    handler = screener;
                    territory = 'FINISHING';
                    passes++;
                    currentTime -= 1;
                    continue;
                }

                // PnR Roll Man Finish -> Assisted
                const res = resolveShot(screener, handler, ctx, events, currentTime - 2, 10, true, true);
                if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                    handler = screener;
                    passes++;
                    safePass = true; // Safety Valve
                    if (passes >= MAX_PASSES) return res;
                    continue;
                }
                return res;
            } else {
                const res = resolveShot(handler, lastPasser, ctx, events, currentTime);
                if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                    passes++;
                    handler = selectReceiver(handler, ctx);
                    safePass = true; // Safety Valve
                    if (passes >= MAX_PASSES) return res;
                    continue;
                }
                return res;
            }

        } else if (action === 'DRIVE') {
            // Successful Drive -> Layup/Dunk
            // SELF-CREATION: Clear lastPasser for drives to ensure they are unassisted unless explicitly Catch & Finish
            const res = resolveShot(handler, undefined, ctx, events, currentTime - 1, 0, true);
            if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                passes++;
                handler = selectReceiver(handler, ctx);
                safePass = true; // Safety Valve
                if (passes >= MAX_PASSES) return res;
                continue;
            }
            return res;

        } else if (action === 'CATCH_AND_FINISH') {
            // NEW: Catch & Finish (Assisted Rim Attempt)
            // Unlike Drive, this credits the passer.
            const res = resolveShot(handler, lastPasser, ctx, events, currentTime - 1, 0, false, true);
            if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                passes++;
                handler = selectReceiver(handler, ctx);
                safePass = true;
                if (passes >= MAX_PASSES) return res;
                continue;
            }
            return res;

        } else {
            // SHOOT (Jumper)
            const res = resolveShot(handler, lastPasser, ctx, events, currentTime - 1);
            if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                passes++;
                handler = selectReceiver(handler, ctx);
                safePass = true; // Safety Valve
                if (passes >= MAX_PASSES) return res;
                continue;
            }
            return res;
        }

        // Forced Shot at Buzzer/Max Passes
        // If capped here, we must accept the TO or Force BAD SHOT?
        // Let's accept Result (TO).
    } // End While Loop

    return resolveShot(handler, lastPasser, ctx, events, currentTime);
}

/**
 * New "Defense First" Dice Roll Logic.
 * Returns a PossessionResult if the defense terminates the possession (Steal/Foul).
 * Returns null if offense continues.
 */
function attemptDefenseRoll(defender: Player, handler: Player, ctx: PossessionContext, events: GameEvent[], time: number, modifier: number = 0): PossessionResult | null {
    // 1. The Roll
    // SAFE PASS EXIT (User Request: "Safe Swing")
    // If the modifier is massive (e.g. -75), it means the pass is routine.
    // We shouldn't even risk a Foul (Roll < 20).
    // Safe means Safe.
    if (modifier <= -50) return null;

    // 1. The Roll
    const roll = Math.floor(Math.random() * 100); // 0-99 (Close enough to d100)

    // 2. Target Calculation
    // "amount his steal is missing to 100 + 75"
    // Choice 1 (Hard Cap): Max chance capped at 12% (Target 88).
    // Even if formula gives 101 or 76, we clamp to minimum 88.

    const missing = 100 - defender.attributes.stealing;
    let target = missing + 65; // 75 ovr -> 25 + 65 = 90 (10% chance)

    // Apply Modifier
    target -= modifier; // - (-60) = +60. (Target goes up, Steal chance goes down).

    // Coach Influence: Defensive coach helps disrupt, offensive coach helps protect
    const coachImpact = (ctx.defenseCoachRating - ctx.offenseCoachRating) * 0.2;
    target -= coachImpact;

    // HARD CAP: Ensure target is at least 88 (Max 12% chance)
    // If Safety Pass, Target might be 140 (Impossible). That's fine.
    if (target < 88) target = 88;

    // --- GAME CAP (User Request: "3 Steals Rule") ---
    // "After a player gets 3 steals in order to steal again he needs to roll ONLY 100"
    // Our dice is 0-99. So "Only 100" roughly means "Perfect Roll" (99).
    // Logic: If currentSteals >= 3, Target = 99.
    if (ctx.getStats) {
        const stats = ctx.getStats(defender.id);
        if (stats && stats.steals >= 3) {
            target = 99; // Top 1% chance only
        }
    }

    // 3. Outcomes
    if (roll < 5) { // User Request: "Turnovers through the roof" -> Reduced from 20 -> 5.
        // REACH IN FOUL
        // "If the roll is under 20 the player that attempted to steal gets a reach in foul."
        events.push({
            id: `evt_${Date.now()}_foul_reach`,
            type: 'foul',
            text: `${defender.lastName} called for a reach-in foul on ${handler.lastName}.`,
            teamId: ctx.defenseTeam.id,
            playerId: defender.id, // Fouler
            secondaryPlayerId: handler.id,
            gameTime: time,
            possessionId: time
        });

        // Foul Outcome: Reset clock? Side out?
        // Simpler for now: End possession as FOUL type (no points, but counts as consumption usually?)
        // In this engine, 'FOUL' type usually just ends it.
        // User implied "resets clock" on steal. Foul usually resets to 14 if non-shooting.
        // Let's return FOUL result.
        return { events, points: 0, endType: 'FOUL', duration: time };
    }

    if (roll >= target) {
        // STEAL SUCCESS
        // "resets the clock since th position has changed" -> Implied new possession for other team.
        // "player that did it is credited with the steal".

        // CRITICAL SUCCESS CHECK
        if (roll > 95) {
            // Option 1: Dunk
            // "if his athletisism is over 85 and his finishing over 85 he runs for the dunk"
            if (defender.attributes.athleticism > 85 && defender.attributes.finishing > 85) {
                events.push({
                    id: `evt_${Date.now()}_steal_crit_dunk`,
                    type: 'turnover',
                    subType: 'steal',
                    text: `${defender.lastName} PICKS THE POCKET AND SLAMS IT HOME!`,
                    teamId: ctx.offenseTeam.id, // Turnover for offense
                    playerId: handler.id, // Victim
                    secondaryPlayerId: defender.id, // Thief
                    gameTime: time,
                    possessionId: time
                });

                // CRITICAL FIX: We use defensivePoints to signal MatchEngine.
                // IMMEDIATE SCORE for Defense Team.

                // Return Outcome
                // We return 'TURNOVER' endType because the possession technically ended in a turnover for the offense.
                // BUT we pass defensivePoints = 2.
                return {
                    events,
                    points: 0,
                    defensivePoints: 2,
                    endType: 'TURNOVER',
                    duration: time
                };
            }

            // Option 2: Assist
            // "If his playmaking is over 90 and and iq is over 90 he gives a fast break assits"
            if (defender.attributes.playmaking > 90 && defender.attributes.basketballIQ > 90) {
                // Find teammate with highest athleticism
                const teammate = ctx.defenseLineup.find(p => p.id !== defender.id &&
                    p.attributes.athleticism === Math.max(...ctx.defenseLineup.filter(t => t.id !== defender.id).map(t => t.attributes.athleticism))
                );

                if (teammate) {
                    events.push({
                        id: `evt_${Date.now()}_steal_crit_assist`,
                        type: 'turnover',
                        subType: 'steal',
                        text: `${defender.lastName} STEALS AND DISHES TO ${teammate.lastName} FOR THE DUNK!`,
                        teamId: ctx.offenseTeam.id,
                        playerId: handler.id,
                        secondaryPlayerId: defender.id,
                        gameTime: time,
                        possessionId: time
                    });

                    // Award Stats for the SCORE?
                    // We need a proper 'score' event for valid stats tracking in StatsAccumulator.
                    // StatsAccumulator processes 'shot_made' usually.
                    // But if we return 'TURNOVER', accumulator only sees turnover.

                    // We must inject a 'shot_made' event for the defensive team.
                    // Problem: StatsAccumulator assumes events belong to possession team?
                    // Actually, StatsAccumulator looks at `teamId` in event.
                    // So if we push a 'shot_made' with `teamId: ctx.defenseTeam.id`, it should work!

                    events.push({
                        id: `evt_${Date.now()}_crit_score`,
                        type: 'shot_made',
                        text: `${teammate.lastName} throws it down!`,
                        teamId: ctx.defenseTeam.id, // Credits Defense
                        playerId: teammate.id,
                        secondaryPlayerId: defender.id, // Assist
                        score: 2,
                        gameTime: time,
                        possessionId: time,
                        subType: 'dunk'
                    });

                    return {
                        events,
                        points: 0,
                        defensivePoints: 2,
                        endType: 'TURNOVER',
                        duration: time
                    };
                }
            }

            // If neither critical condition met, fallback to standard steal
        }

        // Standard Steal (or fallback from failed crit reqs)
        return createSteal(handler, defender, ctx, events, time);
    }

    return null;
}


function selectBallHandler(lineup: Player[], ctx: PossessionContext): Player {
    const usageNorms = calculateUsageLineup(lineup);
    let bestPlayer = lineup[0];
    let maxWeight = -1;

    lineup.forEach(p => {
        // Lineup-Aware Usage (Point 4)
        const baseUsage = usageNorms[p.id];

        // Decision Accuracy (Point 5)
        const decisionAcc = calculateDecisionAccuracy(p, ctx);

        // Weight: Base Usage * Decision Accuracy * 100
        let weight = baseUsage * decisionAcc * 100;

        // Position bias
        if (p.position === 'PG') weight += 5;
        if (p.position === 'SG') weight += 2;

        const roll = Math.random() * 50;
        if ((weight + roll) > maxWeight) {
            maxWeight = weight + roll;
            bestPlayer = p;
        }
    });

    return bestPlayer;
}

export function selectReceiver(handler: Player, ctx: PossessionContext, lastPasser?: Player): Player {
    const teammates = ctx.offenseLineup.filter(p => p.id !== handler.id);

    // HIERARCHY AWARENESS
    // We need to find the Alpha Dogs among teammates
    const scores = teammates.map(p => {
        const attr = p.attributes;
        const finishScore = (attr.finishing * 0.8) + (attr.athleticism * 0.2);
        const shootScore = (attr.threePointShot * 0.7) + (attr.midRange * 0.3);

        // Position-based threat weighting (prevents center dominance)
        let maxThreat = 0;
        if (p.position === 'C' || p.position === 'PF') {
            maxThreat = (finishScore * 0.7) + (shootScore * 0.3);  // Bigs: 70% inside
        } else if (p.position === 'PG' || p.position === 'SG') {
            maxThreat = (finishScore * 0.2) + (shootScore * 0.8);  // Guards: 80% outside
        } else {
            maxThreat = (finishScore * 0.5) + (shootScore * 0.5);  // SFs: balanced
        }

        return { id: p.id, maxThreat, finishScore, shootScore };
    });

    // Sort to find Ranks
    scores.sort((a, b) => b.maxThreat - a.maxThreat);
    const rank1Id = scores[0].id; // Best option available
    const rank2Id = scores.length > 1 ? scores[1].id : null;

    return teammates.sort((a, b) => {
        const sA = scores.find(s => s.id === a.id);
        const sB = scores.find(s => s.id === b.id);

        let weightA = sA ? sA.maxThreat : 70;
        let weightB = sB ? sB.maxThreat : 70;

        // PING-PONG PREVENTION
        // Heavily penalize passing back to the player who just passed to you
        // This prevents A→B→A loops (star passes to role player, role player passes back)
        if (lastPasser && a.id === lastPasser.id) weightA -= 200;
        if (lastPasser && b.id === lastPasser.id) weightB -= 200;

        // HIERARCHY BONUS (The "Feed the Star" Rule) - MASSIVELY NERFED
        // Shifting 10% more production to role players by softening this bonus.
        if (a.id === rank1Id) weightA += 5; // Was 10.
        if (b.id === rank1Id) weightB += 5;

        if (a.id === rank2Id) weightA += 2; // Was 5.
        if (b.id === rank2Id) weightB += 2;

        // IQ / Playmaking Context of Handler
        // If Handler is Elite Playmaker, they find the absolute best option reliably.
        // If Handler is Scrub, variance is high.
        const variance = handler.attributes.playmaking > 85 ? 40 : 100;

        // Random Fluctuation
        // Reduced from 150 to ensure Hierarchy matters
        let score = weightB - weightA + (Math.random() * variance - (variance / 2));

        // Synergies: Don't pass to non-shooters/non-finishers
        if ((sB?.maxThreat || 0) < 70) score -= 50;

        return score;
    })[0];
}


export function decideAction(handler: Player, ctx: PossessionContext, territory: Territory = '3PT'): ActionType {
    // 1. DECISION ACCURACY (Point 5)
    const accuracy = calculateDecisionAccuracy(handler, ctx);

    // CHAOS EVENT: If decision roll is very low, possible turnover (Chaos Point 18)
    if (Math.random() > accuracy - 0.05) {
        // "Oops" moment - backcourt, travel, double dribble
        return 'TURNOVER' as any; // Hack: PossessionEngine expects ActionType, but we can return special type if we handle it
    }

    // 2. TENDENCY SYSTEM v2 (Point 11)
    const t = calculateTendencies(handler, handler.minutes, ctx.offenseLineup);

    // Intent Generation
    const scoreRoll = Math.random() * 100;
    const passRoll = Math.random() * 100;

    const focus = ctx.offenseStrategy.offensiveFocus;
    const focusBonuses = FOCUS_BONUSES[focus] || FOCUS_BONUSES['Balanced'];

    const wantsToScore = scoreRoll < (t.shooting * (focusBonuses.shot || 1.0));
    const wantsToPass = passRoll < (t.passing * (focusBonuses.pass || 1.0));

    // DETERMINATION
    let intent: 'SCORE' | 'PASS' = 'PASS';
    if (wantsToScore && wantsToPass) {
        intent = Math.random() < 0.5 ? 'PASS' : 'SCORE';
    } else if (wantsToScore) {
        intent = 'SCORE';
    } else if (wantsToPass) {
        intent = 'PASS';
    }

    // 3. DEFENSIVE COLLAPSE / GRAVITY (Point 14)
    if (intent === 'SCORE') {
        const defender = ctx.defenseLineup.find(p => p.position === handler.position) || ctx.defenseLineup[0];
        const margin = calculateAdvantageMargin(handler, defender, ctx);

        // High Advantage -> High Gravity
        if (margin > 15 && Math.random() < 0.4) {
            // Defense collapses to stop the blow-by
            return 'KICK_OUT';
        }
    }

    // 4. EXECUTION
    if (intent === 'SCORE') {
        // Determine MODE based on Territory and Ratings
        if (territory === 'FINISHING') return 'CATCH_AND_FINISH'; // Was DRIVE, which wiped assists.

        const shoot3 = handler.attributes.threePointShot;
        const shootMid = handler.attributes.midRange;

        if (shoot3 > shootMid && shoot3 >= 60) return 'SHOOT';
        if (shootMid >= 62) return 'SHOOT';

        return 'DRIVE';
    }

    // Faciliation
    if (handler.attributes.playmaking > 80 && Math.random() < 0.3) return 'PICK_AND_ROLL';

    return 'PASS';
}

// Helper for Step 3 (Passing)

// HELPER: Scorer Rating
function getScorerRating(p: Player): number {
    return p.attributes.finishing + p.attributes.midRange + p.attributes.threePointShot;
}

// HELPER: Usage Cap Check
// Returns TRUE if allowed to shoot, FALSE if capped (must facilitate).
function checkUsageCap(handler: Player, ctx: PossessionContext): boolean {
    if (!ctx.getStats) return true;
    const stats = ctx.getStats(handler.id);
    if (!stats) return true;

    const fga = stats.fgAttempted;
    const qtr = ctx.quarter;
    const ovr = calculateOverall(handler);
    const minutesPlayed = stats.minutes;

    // PROGRESSIVE HARD CAPS by OVR (base values for 48 minutes)
    let baseHardCap = 25; // Superstars
    if (ovr < 75) baseHardCap = 15;      // Strict Role Player Cap
    else if (ovr < 78) baseHardCap = 18; // Low Starter Cap
    else if (ovr < 85) baseHardCap = 22; // High Starter Cap

    // MINUTES-BASED SCALING
    // Scale the cap based on minutes played to prevent bench players from having star efficiency
    // Example: 15 min player gets 15/48 = 31% of the cap (4.6 FGA for role player)
    //          30 min player gets 30/48 = 62.5% of the cap (9.4 FGA for role player)
    const minutesFactor = Math.min(1.0, minutesPlayed / 48);
    const hardCap = Math.ceil(baseHardCap * minutesFactor);

    if (fga >= hardCap) {
        if (stats.consecutiveFieldGoalsMade >= 7) return true; // Heater Rule
        return false; // Stop
    }

    // PROGRESSIVE PACING (Soft Caps)
    // Q1: 25%, Q2: 50%, Q3: 75% of Hard Cap
    let paceLimit = hardCap;
    if (qtr === 1) paceLimit = Math.floor(hardCap * 0.25);
    else if (qtr === 2) paceLimit = Math.floor(hardCap * 0.50);
    else if (qtr === 3) paceLimit = Math.floor(hardCap * 0.75);

    if (qtr < 4 && fga >= paceLimit) {
        // Exception: Minor Heater (5+)
        if (stats.consecutiveFieldGoalsMade >= 5) return true;
        return false; // Force Facilitation
    }

    return true;
}

function checkPassingOptions(handler: Player, ctx: PossessionContext): ActionType | null {
    // 3b) Pick and Roll Check (Priority)
    // "Requirements are ball handler iq > 70 and playmaking > 80"
    if (handler.attributes.basketballIQ > 70 && handler.attributes.playmaking > 80) {
        // Check for Big
        const hasBig = ctx.offenseLineup.some(p => (p.position === 'C' || p.position === 'PF') && p.id !== handler.id);
        if (hasBig) {
            return 'PICK_AND_ROLL';
        }
    }


    // 3a) Standard Pass (Fallback) -> Return NULL to allow Drive Check
    // If we return 'PASS' here, we never Drive.
    return null;
}


// HELPER: Elite Offense Check
function getOffensiveTotal(p: Player) {
    return p.attributes.finishing + p.attributes.midRange + p.attributes.threePointShot;
}

// HELPER for Ranks
function getLineupRanks(lineup: Player[]) {
    const scores = lineup.map(p => {
        const attr = p.attributes;
        return {
            id: p.id,
            finishScore: (attr.finishing * 0.8) + (attr.athleticism * 0.2),
            shootScore: (attr.threePointShot * 0.7) + (attr.midRange * 0.3),
            playmakeScore: (attr.playmaking * 0.8) + (attr.basketballIQ * 0.2)
        };
    });

    const finishRank = [...scores].sort((a, b) => b.finishScore - a.finishScore);
    const shootRank = [...scores].sort((a, b) => b.shootScore - a.shootScore);
    const playRank = [...scores].sort((a, b) => b.playmakeScore - a.playmakeScore);

    const rankMap = new Map<string, { fRank: number, sRank: number, pRank: number }>();
    lineup.forEach(p => {
        rankMap.set(p.id, {
            fRank: finishRank.findIndex(s => s.id === p.id) + 1,
            sRank: shootRank.findIndex(s => s.id === p.id) + 1,
            pRank: playRank.findIndex(s => s.id === p.id) + 1
        });
    });

    return rankMap;
}


function createTurnover(player: Player, ctx: PossessionContext, events: GameEvent[], time: number): PossessionResult {
    events.push({
        id: `evt_${Date.now()}_to`,
        type: 'turnover',
        text: CommentaryEngine.generateCommentary(EventType.TURNOVER, player),
        teamId: ctx.offenseTeam.id,
        playerId: player.id,
        gameTime: time,
        possessionId: time
    });
    return { events, points: 0, endType: 'TURNOVER', duration: time };
}

function createSteal(victim: Player, thief: Player, ctx: PossessionContext, events: GameEvent[], time: number): PossessionResult {
    events.push({
        id: `evt_${Date.now()}_steal`,
        type: 'turnover', // Base type turnover
        subType: 'steal', // Subtype steal implies defensive stat
        text: `${thief.lastName} strips the ball from ${victim.lastName}!`,
        teamId: ctx.offenseTeam.id, // Turnover assigned to offense
        playerId: victim.id,
        secondaryPlayerId: thief.id, // Secondary gets the steal stat
        gameTime: time,
        possessionId: time
    });
    return { events, points: 0, endType: 'TURNOVER', duration: time };
}

// Forced Shot at Buzzer/Max Passes
// If capped here, we must accept the TO or Force BAD SHOT?
// Let's accept Result (TO).
// WAIT: User reports "Absurd Turnovers". This is the cause.
// If we are forced to shoot (Buzzer Beater), we should IGNORE caps.
// Otherwise, a Star who is "Capped" but gets the ball with 1 second left just... drops it?
// Fix: Pass ignoreCap=true.
// This line is likely part of simulatePossession, but the context provided only shows the call.
// Assuming `currentTime` is defined in `simulatePossession`.
// return resolveShot(handler, undefined, ctx, events, currentTime, 0, false, true);
// } // End simulatePossession


export function resolveShot(
    shooter: Player,
    assister: Player | undefined,
    ctx: PossessionContext,
    events: GameEvent[],
    time: number,
    externalBonus: number = 0,
    isDrive: boolean = false,
    isCatchAndFinish: boolean = false
): PossessionResult {
    const attr = shooter.attributes;

    // 1. Determine Shot Type & Territory
    let isThree = false;
    let isMid = false;
    let isRim = isDrive || isCatchAndFinish;

    if (!isRim) {
        // Roll for 3PT Intent (Point 2)
        const focus = ctx.offenseStrategy.offensiveFocus;
        let threeFreq = 0.28 + (attr.threePointShot - 50) * 0.0035;
        if (focus === 'Perimeter') threeFreq += 0.10;
        if (focus === 'Inside') threeFreq -= 0.10;

        isThree = Math.random() < threeFreq && attr.threePointShot >= 55;
        isMid = !isThree;
    }

    // 2. Base Probability (Point 3 - Sigmoid Curves)
    let baseProb = 0;
    if (isRim) baseProb = BASE_SUCCESS.RIM(attr.finishing);
    else if (isThree) baseProb = BASE_SUCCESS.THREE(attr.threePointShot);
    else baseProb = BASE_SUCCESS.MID(attr.midRange);

    // 3. Advantage & Containment (Point 7)
    const defender = ctx.defenseLineup.find(p => p.position === shooter.position) || ctx.defenseLineup[0];
    const margin = calculateAdvantageMargin(shooter, defender, ctx) + externalBonus;

    // 4. Shot Quality (Point 8)
    // Estimate help: if it's a rim shot, more help
    const helpImpact = isRim ? 15 : 0;
    const contest = (defender.attributes.perimeterDefense + (isRim ? defender.attributes.interiorDefense : 0)) / 2;

    const qualityMod = calculateShotQuality(margin, contest, helpImpact, shooter, ctx);

    // 5. Final Make Probability (Point 9 - Gaussian Variance)
    let finalProb = calculateFinalMakeProb(baseProb, qualityMod, ctx.gameVariance);

    // Assisted Bonus
    if (assister) {
        const dimerBonus = Math.max(0, (assister.attributes.playmaking - 60) * 0.003);
        finalProb += dimerBonus;
    }

    // --- EXECUTION ---

    // Foul Check (Point 13)
    let foulChance = 0.06;
    if (isRim) foulChance += 0.08;
    if (Math.random() < foulChance) {
        const fouler = ctx.defenseLineup[Math.floor(Math.random() * ctx.defenseLineup.length)];
        events.push({
            id: `evt_${Date.now()}_foul`,
            type: 'foul',
            text: `${fouler.lastName} fouls ${shooter.lastName} on the shot!`,
            teamId: ctx.defenseTeam.id,
            playerId: fouler.id,
            secondaryPlayerId: shooter.id,
            gameTime: time,
            possessionId: time
        });
        return resolveFreeThrows(shooter, isThree ? 3 : 2, ctx, events, time);
    }

    // Block Check (Point 13)
    if (isRim || isMid) {
        const blockers = ctx.defenseLineup.filter(p => p.position === 'C' || p.position === 'PF');
        const blocker = blockers[Math.floor(Math.random() * blockers.length)] || defender;
        const blockScore = (blocker.attributes.blocking * 0.6) + (blocker.attributes.interiorDefense * 0.4);

        const blockChance = Math.max(0, (blockScore - 60) / 450); // Reduced from 200 to 450 for realism
        if (Math.random() < blockChance) {
            events.push({
                id: `evt_${Date.now()}_block`,
                type: 'block',
                text: `${blocker.lastName} rejects ${shooter.lastName}'s shot!`,
                teamId: ctx.defenseTeam.id,
                playerId: blocker.id,
                secondaryPlayerId: shooter.id,
                gameTime: time,
                possessionId: time
            });
            events.push({
                id: `evt_${Date.now()}_miss_blk`,
                type: 'shot_miss',
                text: `${shooter.lastName} is blocked.`,
                teamId: ctx.offenseTeam.id,
                playerId: shooter.id,
                gameTime: time,
                possessionId: time,
                subType: isRim ? 'LAYUP' : 'MID_RANGE'
            });
            return resolveRebound(ctx, events, time);
        }
    }

    const isMake = Math.random() < finalProb;
    const points = isThree ? 3 : 2;

    if (isMake) {
        events.push({
            id: `evt_${Date.now()}_make`,
            type: 'shot_made',
            text: `${shooter.lastName} scores!`,
            teamId: ctx.offenseTeam.id,
            playerId: shooter.id,
            secondaryPlayerId: assister?.id,
            score: points,
            gameTime: time,
            possessionId: time,
            subType: isThree ? 'THREE_POINT' : (isRim ? (Math.random() < 0.3 ? 'DUNK' : 'LAYUP') : 'MID_RANGE')
        });
        return { events, points, endType: 'SCORE', duration: time };
    } else {
        events.push({
            id: `evt_${Date.now()}_miss`,
            type: 'shot_miss',
            text: `${shooter.lastName} misses.`,
            teamId: ctx.offenseTeam.id,
            playerId: shooter.id,
            gameTime: time,
            possessionId: time,
            subType: isThree ? 'THREE_POINT' : (isRim ? 'LAYUP' : 'MID_RANGE')
        });
        return resolveRebound(ctx, events, time);
    }
}

function resolveFreeThrows(shooter: Player, count: number, ctx: PossessionContext, events: GameEvent[], time: number, isAndOne: boolean = false): PossessionResult {
    let made = 0;
    const rating = shooter.attributes.freeThrow || 75; // Default 75 if missing

    for (let i = 0; i < count; i++) {
        if (Math.random() * 100 < rating) {
            made++;
            events.push({
                id: `evt_${Date.now()}_ft_${i}`,
                type: 'free_throw_made', // Need to handle this type in accumulation
                text: `${shooter.lastName} makes free throw ${i + 1} of ${count}.`,
                teamId: ctx.offenseTeam.id,
                playerId: shooter.id,
                score: 1,
                gameTime: time,
                possessionId: time
            });
        } else {
            events.push({
                id: `evt_${Date.now()}_ft_miss_${i}`,
                type: 'free_throw_miss', // Using 'free_throw_made' implies attempt, but we need 'miss' type if strict
                // Actually, let's use 'shot_miss' subType 'free_throw' if we want strict event typing?
                // For now, assume StatsAccumulator parses 'text' or we add a new type.
                // Let's stick to valid types. If 'free_throw_miss' exists, use it.
                // Based on previous files, we only saw basic types. Let's use 'shot_miss' w/ text.
                // WAIT: StatsAccumulator usually checks `type`. 
                // Let's assume we need to update SimulationTypes.ts later if FT types don't exist.
                // For now: 
                // Type: 'free_throw_miss' (We will add this if needed, or mapping)
                text: `${shooter.lastName} misses free throw ${i + 1} of ${count}.`,
                teamId: ctx.offenseTeam.id,
                playerId: shooter.id,
                score: 0,
                gameTime: time,
                possessionId: time
            });
        }
    }

    // Points from FTs
    // If And-One, we return the total points (Shot + FTs). 
    // BUT resolveShot already returns the Shot Points if we returned early?
    // No, resolveShot calls this. 
    // If isAndOne, the caller (resolveShot) should have already pushed the Shot Made event.
    // So here we only return the FT points.

    // Result
    // If Last FT Missed -> Rebound?
    // For simplicity, we assume ball goes to defense on last miss often, or loose ball.
    // Realism: If last FT is missed, live ball.
    // Logic:
    /*
    if (missedLast) {
       return resolveRebound(...)
    }
    */

    // For now, Auto-End possession on FTs unless we want to simulate rebound.
    // Let's just give points and end. (Simulates make or Def Rebound implicitly for flow)
    return { events, points: made, endType: 'SCORE', duration: time };
}

export function resolveRebound(ctx: PossessionContext, events: GameEvent[], time: number): PossessionResult {
    // SUGGESTION 1: Team Rebound / Dead Ball (25% chance)
    // "awards no individual stat, awards to team - prevents inflation"
    if (Math.random() < 0.25) {
        const isDef = Math.random() < 0.8; // 80% go to defense usually on loose balls
        const team = isDef ? ctx.defenseTeam : ctx.offenseTeam;

        events.push({
            id: `evt_${Date.now()}_team_reb`,
            type: 'rebound',
            subType: isDef ? 'defensive' : 'offensive',
            text: `Loose ball gathered by ${team.abbreviation} (Team Rebound).`,
            teamId: team.id,
            playerId: '', // Empty ID = Team Stat
            gameTime: time,
            possessionId: time
        });

        return {
            events,
            points: 0,
            endType: 'MISS',
            duration: time,
            keepPossession: !isDef
        };
    }

    // NEW LOGIC: Simultaneous Dice Roll
    // Everyone rolls. 
    // Def Needs: 100 - DefReb
    // Off Needs: (100 - OffReb) + 15

    const candidates: { player: Player, team: Team, margin: number, isDef: boolean }[] = [];

    // 1. Process Defense
    ctx.defenseLineup.forEach(p => {
        let skill = p.attributes.defensiveRebound;

        // COMPRESSION FORMULA: Make rebounding harder (increased from 0.85 to 1.0)
        // Flatten output by giving role players a boost and slightly nerfing elites.
        let threshold = (100 - skill) * 1.0 + 15;

        // REBOUND CAP (Diminishing Returns)
        // Lowered from 13 to 10 to account for faster pace (more opportunities)
        if (ctx.getStats) {
            const stats = ctx.getStats(p.id);
            if (stats && (stats.defensiveRebounds + stats.offensiveRebounds) > 10) {
                threshold += 40;
            }
        }

        const roll = Math.random() * 100;
        const margin = roll - threshold;
        candidates.push({ player: p, team: ctx.defenseTeam, margin, isDef: true });
    });

    // 2. Process Offense
    ctx.offenseLineup.forEach(p => {
        let skill = p.attributes.offensiveRebound;

        // COMPRESSION + OFFENSE DIFFICULTY (+20 to make it significantly harder than defense)
        // This forces teams to have GOOD defensive rebounders, otherwise they lose the board.
        let threshold = ((100 - skill) * 1.0 + 15) + 20;

        // O-REBOUND CAP (lowered from 6 to 4 for faster pace)
        if (ctx.getStats) {
            const stats = ctx.getStats(p.id);
            if (stats && stats.offensiveRebounds > 4) {
                threshold += 40;
            }
        }

        const roll = Math.random() * 100;
        const margin = roll - threshold;
        candidates.push({ player: p, team: ctx.offenseTeam, margin, isDef: false });
    });

    // 3. Sort by Margin (Highest wins)
    candidates.sort((a, b) => b.margin - a.margin);

    let winner = candidates[0];

    // REBOUND SHARING (Fix for 20 RPG inflation)
    // If the winner is already hoarding rebounds (Capped), and the runner-up is a teammate,
    // let the teammate have it. This spreads stats without losing the rebound to the opponent.
    if (ctx.getStats) {
        const stats = ctx.getStats(winner.player.id);
        const totalRebs = stats ? (stats.defensiveRebounds + stats.offensiveRebounds) : 0;

        // If capped (>10), look for ANY teammate to take it (Westbrook/Jokic rule)
        if (totalRebs > 10) {
            // Find best teammate (skip index 0 which is winner)
            const teammate = candidates.find((c, i) => i > 0 && c.isDef === winner.isDef);

            if (teammate) {
                // Give it to the teammate!
                // This prevents elite rebounders from hoarding stats once they hit their cap.
                // The TEAM still secures the rebound, but the STAT is distributed.
                winner = teammate;
            }
        }
    }
    const bestRebounder = winner.player;
    const reboundTeam = winner.team;
    const isDefReb = winner.isDef;

    events.push({
        id: `evt_${Date.now()}_reb`,
        type: 'rebound',
        subType: isDefReb ? 'defensive' : 'offensive',
        text: `${bestRebounder.lastName} grabs the ${isDefReb ? 'defensive' : 'offensive'} rebound.`,
        teamId: reboundTeam.id,
        playerId: bestRebounder.id,
        gameTime: time,
        possessionId: time
    });

    return {
        events,
        points: 0,
        endType: 'MISS',
        duration: time,
        keepPossession: !isDefReb
    };
}
