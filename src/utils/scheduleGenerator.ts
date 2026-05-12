import type { Team } from '../models/Team';

interface Matchup {
    homeId: string;
    awayId: string;
}

/**
 * Generates a balanced NBA schedule: exactly 82 rounds, every team plays once per round.
 * 30 teams → 15 games/round × 82 rounds = 1230 total games = exactly 82 games/team.
 *
 * Structure: 29 first-half rounds + 29 second-half (home/away swapped) + 24 extra rounds = 82.
 * Uses the standard circle method for balanced round-robin scheduling.
 */
export const generate82GameSchedule = (teams: Team[]): { homeId: string; awayId: string }[][] => {
    const n = teams.length;
    if (n < 2) return [];

    const ids = teams.map(t => t.id);
    // Ensure even count
    const evenIds = n % 2 === 0 ? [...ids] : [...ids, '__BYE__'];
    const N = evenIds.length; // 30 for NBA

    const fixed = evenIds[N - 1];
    const rotating = evenIds.slice(0, N - 1); // N-1 = 29 elements

    // Generate one full round-robin half (N-1 rounds, each team plays once per round)
    const generateHalf = (swapHomeAway: boolean): { homeId: string; awayId: string }[][] => {
        const rounds: { homeId: string; awayId: string }[][] = [];
        for (let round = 0; round < N - 1; round++) {
            const roundMatchups: { homeId: string; awayId: string }[] = [];
            const slot = [...rotating.slice(round), ...rotating.slice(0, round)];

            // Pair slot[0] with fixed
            if (slot[0] !== '__BYE__' && fixed !== '__BYE__') {
                roundMatchups.push(swapHomeAway
                    ? { homeId: fixed as string, awayId: slot[0] }
                    : { homeId: slot[0], awayId: fixed as string });
            }

            // Pair slot[i] with slot[N-1-i]
            for (let i = 1; i < N / 2; i++) {
                const t1 = slot[i];
                const t2 = slot[N - 1 - i];
                if (t1 !== '__BYE__' && t2 !== '__BYE__') {
                    roundMatchups.push(swapHomeAway
                        ? { homeId: t2, awayId: t1 }
                        : { homeId: t1, awayId: t2 });
                }
            }

            rounds.push(roundMatchups);
        }
        return rounds;
    };

    const firstHalf = generateHalf(false); // 29 rounds
    const secondHalf = generateHalf(true); // 29 rounds (home/away swapped)

    // 29 + 29 = 58 rounds. Need 82 total → add 24 more from firstHalf
    const extraRounds = firstHalf.slice(0, 82 - (firstHalf.length + secondHalf.length));

    return [...firstHalf, ...secondHalf, ...extraRounds]; // exactly 82 rounds
};


/**
 * Generates a full double round-robin schedule for a Euro league.
 * Each team plays every other team exactly twice (once home, once away).
 * With N=20 teams there are 19 rounds per half → 38 rounds total.
 * Uses the standard "circle method" for balanced round-robin scheduling.
 *
 * Returns an array of 38 rounds, each containing ~10 matchups.
 * All teams in the input array must belong to the same conference.
 */
export const generateEuroSchedule = (teams: Team[]): { homeId: string; awayId: string }[][] => {
    const n = teams.length;
    if (n < 2) return [];

    const ids = teams.map(t => t.id);
    // Ensure even count (20 teams is already even)
    const evenIds = n % 2 === 0 ? [...ids] : [...ids, '__BYE__'];
    const N = evenIds.length;

    const firstHalf: { homeId: string; awayId: string }[][] = [];

    // Circle method: fix last element, rotate the rest
    const fixed = evenIds[N - 1];
    const rotating = evenIds.slice(0, N - 1);

    for (let round = 0; round < N - 1; round++) {
        const roundMatchups: { homeId: string; awayId: string }[] = [];

        // Rotate: shift left by `round`
        const slot = [...rotating.slice(round), ...rotating.slice(0, round)];

        // Pair slot[0] with fixed
        if (slot[0] !== '__BYE__' && fixed !== '__BYE__') {
            const homeFirst = round % 2 === 0;
            roundMatchups.push(homeFirst
                ? { homeId: slot[0], awayId: fixed }
                : { homeId: fixed, awayId: slot[0] }
            );
        }

        // Pair slot[i] with slot[N-1-i] for i = 1 .. N/2-1
        for (let i = 1; i < N / 2; i++) {
            const t1 = slot[i];
            const t2 = slot[N - 1 - i];
            if (t1 !== '__BYE__' && t2 !== '__BYE__') {
                // Better home/away alternation: use index `i` parity
                const homeFirst = i % 2 === 0;
                roundMatchups.push(homeFirst
                    ? { homeId: t1, awayId: t2 }
                    : { homeId: t2, awayId: t1 }
                );
            }
        }

        firstHalf.push(roundMatchups);
    }

    // Second half: swap home/away for every matchup (return fixtures)
    const secondHalf: { homeId: string; awayId: string }[][] = firstHalf.map(round =>
        round.map(m => ({ homeId: m.awayId, awayId: m.homeId }))
    );

    // Sequential: all 19 first-half rounds, then all 19 second-half rounds.
    // This guarantees every team appears exactly once per round → 38 games per team, 0 byes.
    return [...firstHalf, ...secondHalf];
};
