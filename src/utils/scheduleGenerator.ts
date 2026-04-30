import type { Team } from '../models/Team';

interface Matchup {
    homeId: string;
    awayId: string;
}

export const generate82GameSchedule = (teams: Team[]): Matchup[][] => {
    const schedule: Matchup[][] = [];
    const gamesPerTeam: Record<string, number> = {};
    teams.forEach(t => gamesPerTeam[t.id] = 0);

    const eastTeams = teams.filter(t => t.conference === 'East');
    const westTeams = teams.filter(t => t.conference === 'West');

    // Define divisions (3 per conference, 5 teams each)
    const divisions: Record<string, string[]> = {
        'Atlantic': ['16', '25', '21', '19', '24'], // BOS, BKN, NYK, PHI, TOR
        'Central': ['17', '20', '30', '26', '18'],   // CHI, CLE, DET, IND, MIL
        'Southeast': ['23', '29', '22', '28', '27'], // ATL, CHA, MIA, ORL, WAS
        'Northwest': ['8', '9', '11', '12', '13'],   // DEN, MIN, OKC, POR, UTA
        'Pacific': ['2', '4', '1', '3', '5'],        // GSW, LAC, LAL, PHX, SAC
        'Southwest': ['6', '15', '7', '10', '14']    // DAL, HOU, MEM, NOP, SAS
    };

    const teamToDivision: Record<string, string> = {};
    Object.entries(divisions).forEach(([divName, teamIds]) => {
        teamIds.forEach(id => teamToDivision[id] = divName);
    });

    const allMatchups: Matchup[] = [];

    // 1. Inter-conference (2 games each: 1 home, 1 away)
    eastTeams.forEach(et => {
        westTeams.forEach(wt => {
            allMatchups.push({ homeId: et.id, awayId: wt.id });
            allMatchups.push({ homeId: wt.id, awayId: et.id });
        });
    });

    // 2. Intra-division (4 games each: 2 home, 2 away)
    Object.values(divisions).forEach(divTeams => {
        for (let i = 0; i < divTeams.length; i++) {
            for (let j = i + 1; j < divTeams.length; j++) {
                const t1 = divTeams[i];
                const t2 = divTeams[j];
                allMatchups.push({ homeId: t1, awayId: t2 });
                allMatchups.push({ homeId: t1, awayId: t2 });
                allMatchups.push({ homeId: t2, awayId: t1 });
                allMatchups.push({ homeId: t2, awayId: t1 });
            }
        }
    });

    // 3. Intra-conference, Out-of-division
    // NBA rule is complex (6 teams 4 times, 4 teams 3 times).
    // To simplify and ensure exactly 82 games:
    // Every team has 10 out-of-division conference opponents.
    // We need 24 + 12 = 36 games from these 10 opponents.
    // So 6 opponents x 4 games = 24
    // 4 opponents x 3 games = 12
    const handleIntraConfOutDiv = (confTeams: Team[]) => {
        confTeams.forEach((t, i) => {
            const outDivOpponents = confTeams.filter(ot => ot.id !== t.id && teamToDivision[ot.id] !== teamToDivision[t.id]);
            
            outDivOpponents.forEach((opp, j) => {
                // To avoid double counting, we only process when t.id < opp.id
                if (t.id < opp.id) {
                    const gamesToPlay = (i + j) % 2 === 0 ? 4 : 3; // Mixed 3 and 4
                    for (let k = 0; k < gamesToPlay; k++) {
                        if (k % 2 === 0) {
                            allMatchups.push({ homeId: t.id, awayId: opp.id });
                        } else {
                            allMatchups.push({ homeId: opp.id, awayId: t.id });
                        }
                    }
                }
            });
        });
    };

    handleIntraConfOutDiv(eastTeams);
    handleIntraConfOutDiv(westTeams);

    // Shuffle all matchups
    for (let i = allMatchups.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allMatchups[i], allMatchups[j]] = [allMatchups[j], allMatchups[i]];
    }

    // Group into days (trying to keep ~10-15 games per day)
    // Actually, it's better to just distribute them so everyone plays 82.
    const days: Matchup[][] = [];
    const tempMatchups = [...allMatchups];
    
    // A simple way to distribute: 
    // NBA season is ~170 days. 1230 total games / 170 days = ~7.2 games/day.
    // We'll create a list of days and fill them ensuring no team plays twice in a day.
    
    const teamLastPlayed: Record<string, number> = {};
    teams.forEach(t => teamLastPlayed[t.id] = -1);

    let currentDay = 0;
    while (tempMatchups.length > 0) {
        if (!days[currentDay]) days[currentDay] = [];
        
        const teamsPlayingToday = new Set<string>();
        
        for (let i = 0; i < tempMatchups.length; i++) {
            const m = tempMatchups[i];
            if (!teamsPlayingToday.has(m.homeId) && !teamsPlayingToday.has(m.awayId)) {
                // Add to day
                days[currentDay].push(m);
                teamsPlayingToday.add(m.homeId);
                teamsPlayingToday.add(m.awayId);
                tempMatchups.splice(i, 1);
                i--; // Adjust index after removal
                
                // Max games per day to keep season long enough
                if (days[currentDay].length >= 12) break; 
            }
        }
        currentDay++;
        if (currentDay > 1000) break; // Safety break
    }

    return days;
};
