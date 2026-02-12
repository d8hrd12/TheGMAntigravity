
export class OnCourt {
    private homeLineup: Set<string>;
    private awayLineup: Set<string>;
    // Map playerId -> accumulated seconds
    private playingTime: Map<string, number>;

    constructor() {
        this.homeLineup = new Set();
        this.awayLineup = new Set();
        this.playingTime = new Map();
    }

    /**
     * Set the initial lineups for the game/period.
     */
    public setLineups(homeIds: string[], awayIds: string[]) {
        this.homeLineup = new Set(homeIds);
        this.awayLineup = new Set(awayIds);

        // Ensure stats tracking exists for these players
        [...homeIds, ...awayIds].forEach(id => {
            if (!this.playingTime.has(id)) {
                this.playingTime.set(id, 0);
            }
        });
    }

    /**
     * Get the current set of players on the court for a team.
     */
    public getLineup(teamId: string, isHome: boolean): string[] {
        return isHome ? Array.from(this.homeLineup) : Array.from(this.awayLineup);
    }

    /**
     * Substitute a player.
     * Throws if outPlayer is not on court or inPlayer is already on court.
     */
    public substitute(isHome: boolean, inPlayerId: string, outPlayerId: string): boolean {
        const lineup = isHome ? this.homeLineup : this.awayLineup;

        if (!lineup.has(outPlayerId)) {
            console.warn(`Attempted to sub out ${outPlayerId} but they are not on court.`);
            return false;
        }
        if (lineup.has(inPlayerId)) {
            console.warn(`Attempted to sub in ${inPlayerId} but they are already on court.`);
            return false;
        }

        lineup.delete(outPlayerId);
        lineup.add(inPlayerId);

        // Ensure map entry exists
        if (!this.playingTime.has(inPlayerId)) {
            this.playingTime.set(inPlayerId, 0);
        }

        return true;
    }

    /**
     * Advance game time, accumulating seconds for everyone currently on court.
     */
    public advanceTime(seconds: number) {
        if (seconds <= 0) return;

        const allOnCourt = [...this.homeLineup, ...this.awayLineup];
        allOnCourt.forEach(id => {
            const current = this.playingTime.get(id) || 0;
            this.playingTime.set(id, current + seconds);
        });
    }

    /**
     * Get total seconds played for a specific player.
     */
    public getSecondsPlayed(playerId: string): number {
        return this.playingTime.get(playerId) || 0;
    }

    /**
     * Get minutes played (rounded/floored) for a specific player.
     * Often used for box scores.
     */
    public getMinutesPlayed(playerId: string): number {
        return (this.playingTime.get(playerId) || 0) / 60;
    }
}
