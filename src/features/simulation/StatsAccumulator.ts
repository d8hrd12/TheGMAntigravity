import type { GameEvent, PlayerStats, BoxScore } from './SimulationTypes';
import type { Player } from '../../models/Player';

export class StatsAccumulator {
    private homeStats: Record<string, PlayerStats> = {};
    private awayStats: Record<string, PlayerStats> = {};
    private lastGameTime: number = 2880; // Default start time (48 minutes)
    private currentHomeLineup: string[] = [];
    private currentAwayLineup: string[] = [];
    private homeTeamId: string;
    private awayTeamId: string;

    constructor(homeTeamId: string, awayTeamId: string, homeRoster: Player[], awayRoster: Player[]) {
        this.homeTeamId = homeTeamId;
        this.awayTeamId = awayTeamId;

        homeRoster.forEach(p => {
            this.homeStats[p.id] = this.createEmptyStats(p);
        });
        awayRoster.forEach(p => {
            this.awayStats[p.id] = this.createEmptyStats(p);
        });

        // Initialize lineups based on roster starters
        this.currentHomeLineup = homeRoster.filter(p => p.isStarter).map(p => p.id).slice(0, 5);
        this.currentAwayLineup = awayRoster.filter(p => p.isStarter).map(p => p.id).slice(0, 5);

        // Fallback if no starters tagged
        if (this.currentHomeLineup.length === 0) this.currentHomeLineup = homeRoster.slice(0, 5).map(p => p.id);
        if (this.currentAwayLineup.length === 0) this.currentAwayLineup = awayRoster.slice(0, 5).map(p => p.id);
    }

    public setLineups(homeLineupIds: string[], awayLineupIds: string[]) {
        this.currentHomeLineup = homeLineupIds;
        this.currentAwayLineup = awayLineupIds;
    }

    private createEmptyStats(p: Player): PlayerStats {
        return {
            playerId: p.id,
            name: p.lastName,
            minutes: 0,
            points: 0,
            fgMade: 0,
            fgAttempted: 0,
            threeMade: 0,
            threeAttempted: 0,
            rimMade: 0,
            rimAttempted: 0,
            midRangeMade: 0,
            midRangeAttempted: 0,
            ftMade: 0,
            ftAttempted: 0,
            rebounds: 0,
            offensiveRebounds: 0,
            defensiveRebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            personalFouls: 0,
            plusMinus: 0,
            consecutiveFieldGoalsMade: 0
        };
    }

    public processEvents(events: GameEvent[]) {
        events.forEach(ev => this.processEvent(ev));
    }

    public processEvent(ev: GameEvent) {
        // Debug Log
        // console.log(`[StatsAccumulator] Processing ${ev.type} for ${ev.playerId} (Time: ${ev.gameTime})`);

        // 1. Accumulate Minutes Play by Play
        // We use the absolute gameTime diff between events
        if (ev.gameTime < this.lastGameTime) {
            const dt = this.lastGameTime - ev.gameTime;
            const minPerPlayer = dt / 60;

            this.currentHomeLineup.forEach(id => {
                if (this.homeStats[id]) this.homeStats[id].minutes += minPerPlayer;
            });
            this.currentAwayLineup.forEach(id => {
                if (this.awayStats[id]) this.awayStats[id].minutes += minPerPlayer;
            });

            this.lastGameTime = ev.gameTime;
        }

        // 2. Handle Lineup Changes (Substitutions) or Possession Starts
        if (ev.type === 'possession_start' && ev.data?.homeLineup && ev.data?.awayLineup) {
            this.currentHomeLineup = ev.data.homeLineup;
            this.currentAwayLineup = ev.data.awayLineup;
        } else if (ev.type === 'substitution' && ev.data?.playerInId && ev.data?.playerOutId) {
            if (ev.teamId === this.homeTeamId) {
                this.currentHomeLineup = this.currentHomeLineup.filter(id => id !== ev.data.playerOutId);
                this.currentHomeLineup.push(ev.data.playerInId);
            } else {
                this.currentAwayLineup = this.currentAwayLineup.filter(id => id !== ev.data.playerOutId);
                this.currentAwayLineup.push(ev.data.playerInId);
            }
        }

        // 3. Attribute Stats
        const pId = ev.playerId;
        if (!pId) return; // CRITICAL RULE: No stat without explicit playerId

        const stats = this.homeStats[pId] || this.awayStats[pId];
        if (!stats) {
            console.warn(`[StatsAccumulator] Stats not found for PlayerID: ${pId}. Team IDs: ${this.homeTeamId}/${this.awayTeamId}`);
            return;
        }

        const sId = ev.secondaryPlayerId;
        const secondaryStats = sId ? (this.homeStats[sId] || this.awayStats[sId]) : null;

        switch (ev.type) {
            case "shot_made":
                // console.error(`[STATS] Shot Made Pts: ${ev.score} Type: ${ev.subType}`);
                stats.points += ev.score || 0;
                stats.fgMade++;
                stats.fgAttempted++;
                stats.consecutiveFieldGoalsMade++;

                if (ev.subType === "THREE_POINT") {
                    stats.threeMade++;
                    stats.threeAttempted++;
                } else if (ev.subType === "MID_RANGE") {
                    stats.midRangeMade++;
                    stats.midRangeAttempted++;
                } else if (ev.subType === "LAYUP" || ev.subType === "DUNK") {
                    stats.rimMade++;
                    stats.rimAttempted++;
                }

                if (secondaryStats) {
                    secondaryStats.assists++;
                }
                break;
            case "shot_miss":
                stats.fgAttempted++;
                stats.consecutiveFieldGoalsMade = 0;

                if (ev.subType === "THREE_POINT") {
                    stats.threeAttempted++;
                } else if (ev.subType === "MID_RANGE") {
                    stats.midRangeAttempted++;
                } else if (ev.subType === "LAYUP" || ev.subType === "DUNK") {
                    stats.rimAttempted++;
                }

                if (secondaryStats && ev.subType === "blocked") {
                    secondaryStats.blocks++;
                }
                break;
            case "rebound":
                stats.rebounds++;
                if (ev.subType === "offensive") stats.offensiveRebounds++;
                if (ev.subType === "defensive") stats.defensiveRebounds++;
                break;
            case "turnover":
                stats.turnovers++;
                if (secondaryStats && ev.subType === "steal") {
                    secondaryStats.steals++;
                }
                break;
            case "foul":
                stats.personalFouls++;
                break;
            case "free_throw_made":
                stats.ftAttempted++;
                stats.ftMade++;
                stats.points++;
                break;
            case "free_throw_miss":
                stats.ftAttempted++;
                break;
            case "steal":
                stats.steals++;
                break;
            case "block":
                stats.blocks++;
                break;
        }
    }

    public getStats(playerId: string): PlayerStats | undefined {
        return this.homeStats[playerId] || this.awayStats[playerId];
    }

    public getBoxScore(): BoxScore {
        // DERIVED Team Totals
        const homeScore = Object.values(this.homeStats).reduce((acc, s) => acc + s.points, 0);
        const awayScore = Object.values(this.awayStats).reduce((acc, s) => acc + s.points, 0);

        return {
            homeStats: { ...this.homeStats },
            awayStats: { ...this.awayStats },
            homeScore,
            awayScore,
            quarters: [] // Derived quarters logic could be added if events had quarter marks
        };
    }
}
