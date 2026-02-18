import { simulateMatchII as simulateMatch } from './MatchEngineII';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Coach } from '../../models/Coach';
import type { MatchResult, BoxScore, GameEvent, PlayerStats, TeamRotationData } from './SimulationTypes';
import { StatsAccumulator } from './StatsAccumulator';

export type PlaybackMode = "LIVE" | "FAST" | "REPLAY";

export interface LiveGameState {
    playbackMode: PlaybackMode;
    homeTeam: Team;
    awayTeam: Team;
    date: Date;
    homeScore: number;
    awayScore: number;
    quarter: number;
    timeRemaining: number;
    shotClock: number;
    possession: 'HOME' | 'AWAY';
    events: GameEvent[]; // Consumed events to display
    homeLineup: Player[];
    awayLineup: Player[];
    homeBench: Player[];
    awayBench: Player[];
    boxScore: BoxScore;
    isFinished: boolean;
    isPaused: boolean;
    gameSpeed: number;
    homeTimeouts: number;
    awayTimeouts: number;
    homeFouls: number;
    awayFouls: number;
    playerStrategies: Record<string, any>;
    playerFatigue: Record<string, number>;
    isSimulating: boolean;
}

export class LiveGameEngine {
    public state: LiveGameState;
    private subscribers: ((state: LiveGameState) => void)[] = [];
    private allEvents: GameEvent[] = [];
    private eventCursor: number = 0;
    private matchResult: MatchResult | null = null;
    private allPlayers: Player[];
    private accumulator: StatsAccumulator;

    constructor(
        home: Team,
        away: Team,
        homeRoster: Player[],
        awayRoster: Player[],
        date: Date,
        homeCoach?: Coach,
        awayCoach?: Coach,
        userTeamId?: string,
        existingResult?: MatchResult
    ) {
        this.allPlayers = [...homeRoster, ...awayRoster];

        const buildRotation = (roster: Player[]) => {
            const sorted = [...roster].sort((a, b) => (a.rotationIndex ?? 999) - (b.rotationIndex ?? 999));
            const starters = sorted.filter(p => p.isStarter).slice(0, 5);
            const activeStarters = starters.length === 5 ? starters : sorted.slice(0, 5);
            const bench = roster.filter(p => !activeStarters.find(s => s.id === p.id));

            return {
                startingLineup: activeStarters.map(p => p.id),
                bench: bench.map(p => p.id),
                rotationPlan: sorted.map(p => ({
                    playerId: p.id,
                    minutes: p.minutes || 0,
                    isStarter: activeStarters.some(s => s.id === p.id),
                    rotationIndex: p.rotationIndex ?? 999
                }))
            };
        };

        const homeRotation = buildRotation(homeRoster);
        const awayRotation = buildRotation(awayRoster);

        if (existingResult) {
            this.matchResult = existingResult;
        } else {
            this.matchResult = simulateMatch({
                homeTeam: home,
                awayTeam: away,
                homeRoster,
                awayRoster,
                homeCoach,
                awayCoach,
                date,
                userTeamId,
                isInteractive: true
            });
        }
        this.allEvents = this.matchResult!.events;

        this.accumulator = new StatsAccumulator(home.id, away.id, homeRoster, awayRoster);

        // Initial State
        this.state = {
            playbackMode: existingResult ? 'REPLAY' : 'LIVE',
            homeTeam: home,
            awayTeam: away,
            date: date,
            homeScore: 0,
            awayScore: 0,
            quarter: 1,
            timeRemaining: 48 * 60, // 2880
            shotClock: 24,
            possession: 'HOME',
            events: [],
            homeLineup: homeRotation.startingLineup.map(id => homeRoster.find(p => p.id === id)!),
            awayLineup: awayRotation.startingLineup.map(id => awayRoster.find(p => p.id === id)!),
            homeBench: homeRotation.bench.map(id => homeRoster.find(p => p.id === id)!),
            awayBench: awayRotation.bench.map(id => awayRoster.find(p => p.id === id)!),
            boxScore: this.accumulator.getBoxScore(),
            isFinished: false,
            isPaused: true,
            gameSpeed: 1, // 1x
            homeTimeouts: 7,
            awayTimeouts: 7,
            homeFouls: 0,
            awayFouls: 0,
            playerStrategies: {},
            playerFatigue: {}, // Todo: Parse from events or ignore
            isSimulating: false
        };
    }

    // --- Subscription ---
    subscribe(callback: (state: LiveGameState) => void) {
        this.subscribers.push(callback);
        callback(this.state);
        return () => this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }
    private notify() {
        this.subscribers.forEach(cb => cb({ ...this.state }));
    }

    // --- Controls ---
    togglePause() {
        this.state.isPaused = !this.state.isPaused;
        this.notify();
    }
    setGameSpeed(speed: number) {
        this.state.gameSpeed = speed;
        this.notify();
    }
    callTimeout(teamId: string) { /* No-op in playback */ }
    substitute(teamId: string, inId: string, outId: string) { /* No-op in playback */ }
    updatePlayerStrategy(pid: string, type: string, val: string) { /* No-op */ }

    // --- Playback Loop ---
    tick() {
        if (this.state.isPaused || this.state.isFinished) return;

        const dt = 1; // 1 second
        this.state.timeRemaining -= dt;

        this.state.shotClock -= dt;
        if (this.state.shotClock < 0) this.state.shotClock = 24; // Reset visual if needed

        // Consume Events
        while (this.eventCursor < this.allEvents.length) {
            const ev = this.allEvents[this.eventCursor];

            if (this.state.timeRemaining <= ev.gameTime) {
                // Process Event
                this.processEvent(ev);
                this.eventCursor++;
            } else {
                break; // Next event is in the future
            }
        }

        if (this.state.timeRemaining <= 0 && this.eventCursor >= this.allEvents.length) {
            this.state.isFinished = true;
            this.state.isPaused = true;
        }

        this.notify();
    }

    private processEvent(ev: GameEvent) {
        // Add to log (Play-by-play)
        this.state.events.unshift({
            id: String(this.eventCursor), // Temp ID
            text: ev.text || ev.type,
            type: ev.type as any,
            timestamp: 48 * 60 - ev.gameTime,
            teamId: ev.teamId,
            playerId: ev.playerId,
            score: { home: this.state.homeScore, away: this.state.awayScore } // Snapshot score
        } as any); // Casting since we are adapting generic event to UI MatchEvent

        // Update Stats & Derived Scores
        this.accumulator.processEvent(ev);
        const latestBox = this.accumulator.getBoxScore();
        this.state.boxScore = latestBox;
        this.state.homeScore = latestBox.homeScore;
        this.state.awayScore = latestBox.awayScore;

        // Update active lineups for UI
        if (ev.type === 'possession_start' && ev.data?.homeLineup) {
            this.state.homeLineup = ev.data.homeLineup.map((id: string) => this.allPlayers.find(p => p.id === id)!);
            this.state.awayLineup = ev.data.awayLineup.map((id: string) => this.allPlayers.find(p => p.id === id)!);

            // Also update benches
            this.state.homeBench = this.allPlayers.filter(p => p.teamId === this.state.homeTeam.id && !ev.data.homeLineup.includes(p.id));
            this.state.awayBench = this.allPlayers.filter(p => p.teamId === this.state.awayTeam.id && !ev.data.awayLineup.includes(p.id));
        }

        if (ev.type === 'quarter_end') {
            const finishedQtr = ev.data?.quarter || this.state.quarter;
            this.state.quarter = Math.min(4, finishedQtr + 1);

            // Pause on quarter end unless it's the very end of the game
            if (finishedQtr < 4) {
                this.state.isPaused = true;
            } else {
                this.state.isFinished = true;
            }
        }

        // Visual Aids (Shot Clock Reset)
        if (ev.type === "shot_made") {
            this.state.shotClock = 24;
            this.state.possession = ev.teamId === this.state.homeTeam.id ? 'AWAY' : 'HOME';
        } else if (ev.type === "rebound") {
            this.state.possession = ev.teamId === this.state.homeTeam.id ? 'HOME' : 'AWAY';
            this.state.shotClock = ev.subType === "tip_out" ? 14 : 24;
        } else if (ev.type === "turnover") {
            this.state.possession = ev.teamId === this.state.homeTeam.id ? 'AWAY' : 'HOME';
            this.state.shotClock = 24;
        }
    }

    simulateRestOfGame() {
        if (this.state.isSimulating || this.state.isFinished) return;

        this.state.isSimulating = true;
        this.state.playbackMode = 'FAST';
        this.state.isPaused = true;
        this.notify();

        const processChunk = () => {
            if (!this.state.isSimulating) return;

            const chunkSize = 25; // Process 25 events per frame
            let processed = 0;

            while (this.eventCursor < this.allEvents.length && processed < chunkSize) {
                this.processEvent(this.allEvents[this.eventCursor]);
                this.eventCursor++;
                processed++;
            }

            if (this.eventCursor < this.allEvents.length) {
                this.notify();
                requestAnimationFrame(processChunk);
            } else {
                this.state.timeRemaining = 0;
                this.state.isFinished = true;
                this.state.isPaused = true;
                this.state.isSimulating = false;
                this.notify();
            }
        };

        requestAnimationFrame(processChunk);
    }

    stopSimulation() {
        if (!this.state.isSimulating) return;

        this.state.isSimulating = false;
        this.state.isPaused = true;
        this.state.playbackMode = 'LIVE';
        this.notify();
    }

    getResults(): MatchResult {
        return this.matchResult!;
    }
}
