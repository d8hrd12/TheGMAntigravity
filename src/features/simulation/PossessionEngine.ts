import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { GameEvent, PlayerStats } from './SimulationTypes';
import { EventType } from './SimulationTypes';
import type { TeamStrategy } from './TacticsTypes';
import { PACE_MULTIPLIERS, FOCUS_BONUSES } from './TacticsTypes';
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
    // baseline 6-14s (Avg 10s). 
    // multiplier scales this. 
    // Seven Seconds (1.25x) -> divide by 1.25 -> ~4.8-11.2s (Avg 8s)
    // Very Slow (0.85x) -> divide by 0.85 -> ~7-16.5s (Avg 11.7s)
    const secondsDribble = Math.floor((Math.random() * 7 + 5) / paceMod);

    if (ctx.timeRemaining > 2800) {
        console.log(`[DEBUG] Time: ${ctx.timeRemaining} | Dribble: ${secondsDribble} | PaceMod: ${paceMod}`);
    }
    currentTime -= secondsDribble;
    if (currentTime < 0) currentTime = 0;

    // Loop State
    let handler = selectBallHandler(ctx.offenseLineup, ctx.offenseStrategy);
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

                const res = resolveShot(finalTarget, handler, ctx, events, currentTime - 1, 15);
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

                const res = resolveShot(screener, handler, ctx, events, currentTime - 2, 10, true);
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
            const res = resolveShot(handler, lastPasser, ctx, events, currentTime - 1, 0, true);
            if (res.endType === 'TURNOVER' && res.events.some(e => e.id?.includes('cap_defer'))) {
                passes++;
                handler = selectReceiver(handler, ctx);
                safePass = true; // Safety Valve
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
    }

    // Forced Shot at Buzzer/Max Passes
    // If capped here, we must accept the TO or Force BAD SHOT?
    // Let's accept Result (TO).
    // Forced Shot (Bypass Cap)
    return resolveShot(handler, lastPasser, ctx, events, currentTime, 0, false, true);
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
    let target = missing + 75;

    // Apply Modifier
    target -= modifier; // - (-60) = +60. (Target goes up, Steal chance goes down).

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
        return { events, points: 0, endType: 'FOUL', duration: ctx.timeRemaining - time };
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
                    duration: ctx.timeRemaining - time
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
                        duration: ctx.timeRemaining - time
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


function selectBallHandler(lineup: Player[], strategy: TeamStrategy): Player {
    let bestPlayer = lineup[0];
    let maxWeight = -1;

    lineup.forEach(p => {
        // FLATTENED WEIGHTS (Round 10 Fix):
        // Previous: Handling*1.5 + Playmaking + Bonuses = ~300+ vs 200.
        // New: Handling*0.8 + Playmaking*0.8 + Flat Base.

        let weight = (p.attributes.ballHandling * 0.8) + (p.attributes.playmaking * 0.8) + 50;

        const attr = p.attributes;
        const isPlaymaker = attr.playmaking > 85;
        const isSlasher = attr.finishing > 85 && attr.athleticism > 80;
        const isShooter = attr.threePointShot > 85;
        // Strength doesn't exist, use InteriorDefense as proxy for "Big Man Strength"
        const isInteriorForce = attr.interiorDefense > 85 && attr.finishing > 85;

        // --- INTELLIGENT HANDLER SELECTION ---

        // 1. Playmakers (Primary Role)
        if (isPlaymaker) weight += 15; // Reduced from 25

        // 2. Elite Slashers (Secondary Role)
        if (isSlasher && attr.ballHandling > 75) weight += 10; // Reduced from 15

        // 3. Star Gravity (The "Give me the ball" factor)
        // Capped severely to prevent 70% usage
        if (p.overall > 85) weight += 2; // Reduced from 5
        if (p.overall > 90) weight += 3; // Reduced from 5 (Total +5 max)

        // 4. Scorer Gravity
        if (isShooter || isInteriorForce) weight += 3; // Reduced from 5

        // 5. Penalize pure Interior Forces (Centers) bringing it up
        if (isInteriorForce && attr.ballHandling < 65) weight -= 50; // Increased penalty

        // 6. SKILL BASED INITIATION (The "Giannis Rule")
        // Elite Handlers (Kyrie/Steph/Luka/Giannis) -> The "System"
        if (attr.ballHandling > 85) weight += 20; // Reduced from 30
        else if (attr.ballHandling > 75) weight += 10; // Reduced from 15

        // Secondary Playmakers (Connecting Forward/Guard)
        if (attr.playmaking > 80) weight += 7; // Reduced from 10

        // TIE BREAKER: Position is still relevant for "Default", but weak.
        if (p.position === 'PG') weight += 5; // Reduced from 10
        if (p.position === 'SG') weight += 3; // Reduced from 5

        // INCREASE VARIANCE: Prevent Heliocentric dominance
        // New: Random(550). Was Random(400).
        // This allows a role player to beat a Star even more often to spread the ball.
        const roll = Math.random() * 550;
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
    // 1. FLOW OFFENSE CHECK (Coaching System)
    // "Not every possession allows the handler to Iso".
    // We enforce ball movement on a percentage of plays regardless of who has the ball.
    // Exception: Late Clock (< 6 seconds).
    const isLateClock = (ctx.shotClock || 24) < 6;
    const flowPassChance = 0.25; // Reduced from 45% to allow tendencies to matter more

    // If not late clock, roll for System Compliance
    if (!isLateClock && Math.random() < flowPassChance) {
        // Force a PASS (unless no teammate is open, handled by fallback)
        return checkPassingOptions(handler, ctx) || 'PASS';
    }

    // 2. USAGE CAP CHECK (Safety Net)
    if (!checkUsageCap(handler, ctx)) {
        // STRICT: If capped, FORCE a simple pass. 
        // Do NOT allow Pick & Roll (which is a play call that leads to usage).
        return 'PASS';
    }

    // --- TENDENCY SYSTEM v2 ---
    // User Requirement: Use tendencies to determine intent, keeping stars grounded.
    const t = calculateTendencies(handler, handler.minutes, ctx.offenseLineup);

    // Intent Generation (Independent Rolls allow "Dual Threat")
    const scoreRoll = Math.random() * 100;
    const passRoll = Math.random() * 100;
    // --- OFFENSIVE FOCUS IMPACT ---
    const focus = ctx.offenseStrategy.offensiveFocus || 'Balanced';
    const focusBonuses = FOCUS_BONUSES[focus] || FOCUS_BONUSES['Balanced'];

    // Adjust Intent Rolls based on Focus
    const shootBias = focusBonuses.shot || 1.0;
    const passBias = focusBonuses.pass || 1.0;

    const wantsToScore = scoreRoll < (t.shooting * shootBias);
    const wantsToPass = passRoll < (t.passing * passBias);

    // DETERMINATION
    let intent: 'SCORE' | 'PASS' = 'PASS';

    if (wantsToScore && wantsToPass) {
        // Dual threat scenario: Weight by tendency strength instead of 50/50
        // Example: 83 passing vs 72 shooting → 53.5% pass, 46.5% score
        const scoreWeight = t.shooting * shootBias;
        const passWeight = t.passing * passBias;
        const totalWeight = scoreWeight + passWeight;

        intent = Math.random() < (passWeight / totalWeight) ? 'PASS' : 'SCORE';
    } else if (wantsToScore) {
        intent = 'SCORE';
    } else if (wantsToPass) {
        intent = 'PASS';
    } else {
        // Passive: Default to pass
        intent = 'PASS';
    }

    // --- EXECUTION ---

    // 3. GRAVITY & SINGLE/DOUBLE COVERAGE (Physics Check)
    // If player wants to score, checks if defense collapses.
    if (intent === 'SCORE') {
        const maxOffense = Math.max(handler.attributes.finishing, handler.attributes.threePointShot, handler.attributes.midRange);
        const threatLevel = (t.shooting + maxOffense) / 2;

        // Stars (Threat > 80) draw attention
        if (threatLevel > 80) {
            // Chance of Defense Collapsing (Gravity)
            // Increased from 30% to 35% to generate more kickout assists for teammates
            const doubleTeamChance = 0.35;

            if (Math.random() < doubleTeamChance) {
                // "Defense Collapses"
                // The Shot becomes Bad (Contested), The Pass becomes Good (Kickout)
                // We override their Scoring Intent to a PASS.
                // This simulates the Star driving, drawing help, and kicking out.
                // It lowers their FGA but INCREASES stats for teammates (Assists/Open Shots).
                return checkPassingOptions(handler, ctx) || 'PASS';
            }
        }
    }

    // 4. SCORING EXECUTION
    if (intent === 'SCORE') {
        const defender = ctx.defenseLineup.find(p => p.position === handler.position) || ctx.defenseLineup[0];
        const perimeterDef = defender.attributes.perimeterDefense;

        // Determine MODE based on Inside/Outside Tendencies
        // Normalize range
        const totalPref = t.inside + t.outside; // e.g. 70 + 90 = 160
        const outsideRatio = totalPref > 0 ? (t.outside / totalPref) : 0.5;

        if (Math.random() < outsideRatio) {
            // TARGET: PERIMETER (Shoot 3/Mid)
            // Physics Check: Can he get the shot off?
            const attRating = handler.attributes.threePointShot;

            // "Weak Defense" Bonus (Att > Def)
            if (attRating > perimeterDef) {
                return 'SHOOT'; // Clean look
            }
            // "Strong Defense": Contested.
            // Aggressive players shoot anyway?
            // If Shooting Tendency is Elite (>90), force it 30% of time?
            if (t.shooting > 90 && Math.random() < 0.3) return 'SHOOT';

            // Otherwise, fall through to Drive or Pass?
            // Let's Fall through to Drive check (Counter-move)
        }

        // TARGET: DRIVE (Inside)
        // Physics Check: Blow-by
        const driveRating = (handler.attributes.playmaking + handler.attributes.ballHandling) / 2;

        if (driveRating > perimeterDef) {
            // Beat the perimeter defender.
            // Now facing help logic (Mid Range vs Rim)
            const bigs = ctx.defenseLineup.filter(p => p.position === 'C' || p.position === 'PF');
            const helpDefender = bigs.length > 0 ? bigs[Math.floor(Math.random() * bigs.length)] : defender;
            const interiorDef = helpDefender.attributes.interiorDefense;

            // Decision: Pull-up or Rim?
            if (handler.attributes.finishing > interiorDef) return 'DRIVE'; // Rim
            else return 'SHOOT'; // Mid-range pull-up (Sim interprets SHOOT as jumper)
        }

        // If blocked on both checks: Reset to Pass
    }

    // 2. PASSING INTENT (or Failed Score)
    // Check for High Value Passes first
    const playmakingAction = checkPassingOptions(handler, ctx);
    if (playmakingAction) return playmakingAction;

    return 'PASS'; // Safe Recycle
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
    return { events, points: 0, endType: 'TURNOVER', duration: ctx.timeRemaining - time };
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
    return { events, points: 0, endType: 'TURNOVER', duration: ctx.timeRemaining - time };
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


export function resolveShot(shooter: Player, assister: Player | undefined, ctx: PossessionContext, events: GameEvent[], time: number, bonusPercent: number = 0, driveDunkChance: boolean = false, ignoreCap: boolean = false): PossessionResult {
    const attr = shooter.attributes;

    // USAGE CAP CHECK (Final Gate)
    if (!ignoreCap && !checkUsageCap(shooter, ctx)) {
        events.push({
            id: `evt_${Date.now()}_cap_defer`, // ID used by loop to trigger pass
            type: 'turnover', // Pseudo-turnover
            text: `(Cap Reached for ${shooter.lastName})`,
            teamId: ctx.offenseTeam.id,
            gameTime: time,
            possessionId: time
        });
        return {
            events,
            points: 0,
            endType: 'TURNOVER',
            duration: 0,
            keepPossession: true
        };
    }


    // --- SHOT TYPE DETERMINATION (Probabilistic) ---
    // We already rolled intent in decideAction, but resolveShot needs to execute it.
    // We re-roll here to determine the specific OUTCOME type if it wasn't a forced drive.

    // If driveDunkChance is passed (from Drive action), we stick to it.
    // If not, we decide 3PT vs Mid based on the 35/65 rule AND attributes.

    let isThree = false;

    if (!driveDunkChance) {
        // Roll for 3PT Intent
        // Base 35% * Skill Modifier.
        const skillMod = Math.max(0, (attr.threePointShot - 50) / 40);

        // OFFENSIVE FOCUS: Perimeter focus significantly boosts 3PT rate.
        const focus = ctx.offenseStrategy.offensiveFocus || 'Balanced';
        let baseThreeChance = 0.35;
        if (focus === 'Perimeter') baseThreeChance = 0.48;
        if (focus === 'Inside') baseThreeChance = 0.22;

        const threeChance = baseThreeChance * (0.5 + skillMod);

        if (Math.random() < threeChance) {
            isThree = true;
        }
    }

    // Shot Ratings
    let shotRating = isThree ? attr.threePointShot : attr.midRange;
    if (driveDunkChance) shotRating = attr.finishing;

    // ASSIST DECAY (User Request: "Lower assists a bit")
    // Not every pass leading to a score is an assist. NBA Rule: "Basketball Move" wipes assist.
    // We simulate this based on Shot Type.
    if (assister) {
        let keepAssistChance = 1.0;

        if (driveDunkChance) {
            keepAssistChance = 0.4; // Drives are mostly ISO (60% unassisted)
        } else if (!isThree) {
            keepAssistChance = 0.5; // Mid-range is often Pull-up (50% unassisted)
        } else {
            keepAssistChance = 0.95; // 3PT is mostly Catch & Shoot (5% unassisted)
        }

        // Context Modifiers
        // Bad passes force receiver to ISO -> Wipes assist
        if (assister.attributes.playmaking < 60) keepAssistChance -= 0.3;

        // Elite passes lead directly to score -> Keeps assist
        if (assister.attributes.playmaking > 85) keepAssistChance += 0.2;

        // Roll
        if (Math.random() > keepAssistChance) {
            assister = undefined; // Assist Wiped (Self-Created Score)
        }
    }

    // --- FOUL LOGIC ---
    // TUNING: Reduced Foul Rates to increase FGA flow (User Request: 90-100 FGA)
    let foulChance = 0.05; // Was 0.12
    if (driveDunkChance) foulChance += 0.08; // Was 0.15 (Total 13%)
    if (shooter.overall > 90) foulChance += 0.04; // Was 0.05

    if (Math.random() < foulChance) {
        // ... Foul Execution (Simplified for Brevity - keeping logic) ...
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
        const isAndOne = Math.random() < 0.25;
        if (!isAndOne) {
            const numShots = isThree ? 3 : 2;
            return resolveFreeThrows(shooter, numShots, ctx, events, time);
        }
    }

    // ... Block Logic Unchanged ...
    if (driveDunkChance || !isThree) {
        // Chance to interact with bigs
        const blockers = ctx.defenseLineup.filter(p => p.position === 'C' || p.position === 'PF');
        const blocker = blockers.length > 0 ? blockers[Math.floor(Math.random() * blockers.length)] : ctx.defenseLineup[0];

        // Block Synergy: Block*0.5 + IntDef*0.3 + Ath*0.2
        const blockScore = (blocker.attributes.blocking * 0.5) + (blocker.attributes.interiorDefense * 0.3) + (blocker.attributes.athleticism * 0.2);

        if (blocker && blockScore > 60) {
            // REDUCED BLOCK CHANCE (Was /800, now /400 to boost blocks)
            const blockChance = (blockScore - 50) / 400;
            if (Math.random() < blockChance) {
                // BLOCKED
                events.push({
                    id: `evt_${Date.now()}_block`,
                    type: 'shot_miss',
                    subType: 'blocked',
                    text: `${blocker.lastName} swats ${shooter.lastName}'s shot!`,
                    teamId: ctx.offenseTeam.id,
                    playerId: shooter.id,
                    secondaryPlayerId: blocker.id,
                    gameTime: time,
                    possessionId: time
                });
                return resolveRebound(ctx, events, time);
            }
        }
    }


    // --- EFFICIENCY / MAKE CHANCE ---
    const defense = 50;

    // Formula: (Rating * Factor) - Defense
    // We want 3PT to be ~35-40% and 2PT to be ~50-60%.

    let chance = 0;

    if (driveDunkChance) {
        // INSIDE: High Percentage (Boosted to 50 for scoring balance)
        const skillBonus = (shotRating - 70) * 0.5;
        chance = 50 + skillBonus + bonusPercent;
        if (chance < 35) chance = 35;
        if (chance > 75) chance = 75;
    } else if (isThree) {
        // 3PT: Lower Percentage
        // Soft cap with diminishing returns (no hard wall)
        const skillBonus = (shotRating - 70) * 0.8;
        chance = 25 + skillBonus + bonusPercent;
        if (chance < 20) chance = 20;
        // Soft cap: 42% + 40% of excess (allows elite shooters to reach ~45-46%)
        if (chance > 42) {
            const excess = chance - 42;
            chance = 42 + (excess * 0.4);
        }
    } else {
        // MID-RANGE: Middle Percentage
        const skillBonus = (shotRating - 70) * 0.6;
        chance = 36 + skillBonus + bonusPercent; // Was 40 (Suggestion 3 compensation)
        if (chance < 30) chance = 30;
        if (chance > 70) chance = 70;
    }

    // Star Bonus: Stars hit tougher shots
    if (shooter.overall > 90) chance += 5;

    // DIMER BONUS (Creative Assist)
    // Smoothed bonus to help "OK" playmakers contribute
    if (assister) {
        // Scale: 60 PM -> 0%, 80 PM -> 6%, 100 PM -> 12%
        // Formula: (PM - 60) * 0.3
        const pm = assister.attributes.playmaking;
        const bonus = Math.max(0, (pm - 60) * 0.3);
        chance += bonus;
    }

    // GLOBAL NERF: 10% reduction to final percentage (Suggestion 3 - Was 20% to reduce miss volume)
    chance *= 0.9;

    // SAGGING OFF (Defense vs Non-Shooters)
    // If player can't shoot 3s, the defense camps the paint.
    if ((driveDunkChance || !isThree) && attr.threePointShot < 60) {
        const sagPenalty = (60 - attr.threePointShot) / 2; // Up to -15% penalty
        chance -= sagPenalty;
        if (Math.random() < 0.1) { // Visual feedback via event text
            events.push({
                id: `evt_${Date.now()}_sag_penalty`,
                type: 'action',
                text: `Defense sags off ${shooter.lastName}, forcing a tough interior look.`,
                teamId: ctx.defenseTeam.id,
                gameTime: time,
                possessionId: time
            });
        }
    }

    // CAP CHANCE
    if (chance > 95) chance = 95;
    if (chance < 15) chance = 15; // Floor raised from 5

    // Duplicate Usage Cap Logic Removed.
    // Handled at start of function via checkUsageCap(shooter, ctx) which respects ignoreCap.

    const roll = Math.random() * 100;
    const isMake = roll < chance;

    // DEBUG SHOT LOGIC
    // if (isThree) console.log(`[SHOT] ${shooter.lastName} 3PT | Chance: ${chance.toFixed(1)}% | Roll: ${roll.toFixed(1)} | Make: ${isMake}`);

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
            subType: isThree ? 'three_point' : 'jumpshot'
        });

        // AND-ONE CHECK (If we had a foul logic that passed through)
        // For now, simple random And-1 on makes
        if (Math.random() < 0.03) { // 3% of makes are And-1s
            events.push({
                id: `evt_${Date.now()}_and1`,
                type: 'foul',
                text: `And one! ${shooter.lastName} heads to the line.`,
                teamId: ctx.defenseTeam.id,
                playerId: ctx.defenseLineup[0].id, // Random fouler
                gameTime: time,
                possessionId: time
            });
            return resolveFreeThrows(shooter, 1, ctx, events, time, true); // 1 FT, Keep Points
        }

        return { events, points, endType: 'SCORE', duration: ctx.timeRemaining - time };
    } else {
        events.push({
            id: `evt_${Date.now()}_miss`,
            type: 'shot_miss',
            text: `${shooter.lastName} misses.`,
            teamId: ctx.offenseTeam.id,
            playerId: shooter.id,
            gameTime: time,
            possessionId: time,
            subType: isThree ? 'three_point' : 'jumpshot'
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
    return { events, points: made, endType: 'SCORE', duration: ctx.timeRemaining - time };
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
            duration: ctx.timeRemaining - time,
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

        // COMPRESSION + OFFENSE DIFFICULTY (Reduced from +20 to +10 to allow Off Rebels to win)
        // This forces teams to have GOOD defensive rebounders, otherwise they lose the board.
        let threshold = ((100 - skill) * 1.0 + 15) + 10;

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
        duration: ctx.timeRemaining - time,
        keepPossession: !isDefReb
    };
}
