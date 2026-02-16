import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateEWA } from '../../utils/playerUtils';

interface LeagueLeadersProps {
    players: Player[];
    teams: Team[];
    onSelectPlayer: (playerId: string) => void;
}

interface LeaderCategory {
    title: string;
    key: 'points' | 'rebounds' | 'offensiveRebounds' | 'assists' | 'steals' | 'blocks' | 'turnovers' | 'fgPct' | 'threePct' | 'ftPct' | 'ftAttempted' | 'mpg' | 'ewa';
    format: (val: number) => string;
}

const CATEGORIES: LeaderCategory[] = [
    { title: 'Points', key: 'points', format: (v) => v.toFixed(1) },
    { title: 'Rebounds', key: 'rebounds', format: (v) => v.toFixed(1) },
    { title: 'Off. Reb', key: 'offensiveRebounds', format: (v) => v.toFixed(1) },
    { title: 'Assists', key: 'assists', format: (v) => v.toFixed(1) },
    { title: 'Steals', key: 'steals', format: (v) => v.toFixed(1) },
    { title: 'Blocks', key: 'blocks', format: (v) => v.toFixed(1) },
    { title: 'Turnovers', key: 'turnovers', format: (v) => v.toFixed(1) },
    { title: 'EWA', key: 'ewa', format: (v) => v.toFixed(1) },
    { title: 'MPG', key: 'mpg', format: (v) => v.toFixed(1) },
    { title: 'FG%', key: 'fgPct', format: (v) => (v * 100).toFixed(1) + '%' },
    { title: '3PT%', key: 'threePct', format: (v) => (v * 100).toFixed(1) + '%' },
    { title: 'FT%', key: 'ftPct', format: (v) => (v * 100).toFixed(1) + '%' },
    { title: 'FTA', key: 'ftAttempted', format: (v) => v.toFixed(1) },
];

export const LeagueLeaders: React.FC<LeagueLeadersProps> = ({ players, teams, onSelectPlayer }) => {
    // Only consider qualified players (e.g., played > 0 games, or just > 0 for now)
    const qualifiedPlayers = players.filter(p => p.seasonStats && p.seasonStats.gamesPlayed > 0);

    const getTop5 = (category: LeaderCategory['key']) => {
        let filtered = [...qualifiedPlayers];

        // Specific filters for percentages
        if (category === 'threePct') {
            // At least 3 attempts per game
            filtered = filtered.filter(p => (p.seasonStats.threeAttempted / p.seasonStats.gamesPlayed) >= 3);
        } else if (category === 'ftPct') {
            // At least 3 attempts per game
            filtered = filtered.filter(p => (p.seasonStats.ftAttempted / p.seasonStats.gamesPlayed) >= 1.5);
        } else if (category === 'ftAttempted') {
            filtered = filtered.filter(p => p.seasonStats.gamesPlayed > 0);
        } else if (category === 'fgPct') {
            // More than 10 shots total in season
            filtered = filtered.filter(p => p.seasonStats.fgAttempted > 10);
        } else if (category === 'mpg' || category === 'ewa') {
            // No specific filter needed beyond games played > 0
        }

        return filtered.sort((a, b) => {
            let valA = 0;
            let valB = 0;

            if (category === 'threePct') {
                valA = a.seasonStats.threeAttempted > 0 ? a.seasonStats.threeMade / a.seasonStats.threeAttempted : 0;
                valB = b.seasonStats.threeAttempted > 0 ? b.seasonStats.threeMade / b.seasonStats.threeAttempted : 0;
            } else if (category === 'ftPct') {
                valA = a.seasonStats.ftAttempted > 0 ? a.seasonStats.ftMade / a.seasonStats.ftAttempted : 0;
                valB = b.seasonStats.ftAttempted > 0 ? b.seasonStats.ftMade / b.seasonStats.ftAttempted : 0;
            } else if (category === 'fgPct') {
                valA = a.seasonStats.fgAttempted > 0 ? a.seasonStats.fgMade / a.seasonStats.fgAttempted : 0;
                valB = b.seasonStats.fgAttempted > 0 ? b.seasonStats.fgMade / b.seasonStats.fgAttempted : 0;
            } else if (category === 'ftAttempted') {
                valA = a.seasonStats.ftAttempted / a.seasonStats.gamesPlayed;
                valB = b.seasonStats.ftAttempted / b.seasonStats.gamesPlayed;
            } else if (category === 'ewa') {
                valA = calculateEWA(a);
                valB = calculateEWA(b);
            } else if (category === 'mpg') {
                valA = a.seasonStats.minutes / a.seasonStats.gamesPlayed;
                valB = b.seasonStats.minutes / b.seasonStats.gamesPlayed;
            } else {
                // Standard counting stats (per game)
                // @ts-ignore - dynamic key access
                valA = a.seasonStats[category] / a.seasonStats.gamesPlayed;
                // @ts-ignore - dynamic key access
                valB = b.seasonStats[category] / b.seasonStats.gamesPlayed;
            }

            return valB - valA;
        }).slice(0, 5);
    };

    return (
        <section style={{ marginTop: '20px' }}>
            <h3>League Leaders</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                {CATEGORIES.map(cat => {
                    const leaders = getTop5(cat.key);
                    return (
                        <div className="glass-panel" key={cat.key} style={{ padding: '15px' }}>
                            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', color: '#fff' }}>{cat.title}</h4>
                            {leaders.length === 0 ? <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.8rem' }}>No stats yet</p> : (
                                <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {leaders.map((p, i) => {
                                            const team = teams.find(t => t.id === p.teamId);
                                            let displayVal = 0;

                                            if (cat.key === 'threePct') {
                                                displayVal = p.seasonStats.threeAttempted > 0 ? p.seasonStats.threeMade / p.seasonStats.threeAttempted : 0;
                                            } else if (cat.key === 'ftPct') {
                                                displayVal = p.seasonStats.ftAttempted > 0 ? p.seasonStats.ftMade / p.seasonStats.ftAttempted : 0;
                                            } else if (cat.key === 'fgPct') {
                                                displayVal = p.seasonStats.fgAttempted > 0 ? p.seasonStats.fgMade / p.seasonStats.fgAttempted : 0;
                                            } else if (cat.key === 'ftAttempted') {
                                                displayVal = p.seasonStats.ftAttempted / p.seasonStats.gamesPlayed;
                                            } else if (cat.key === 'ewa') {
                                                displayVal = calculateEWA(p);
                                            } else if (cat.key === 'mpg') {
                                                displayVal = p.seasonStats.minutes / p.seasonStats.gamesPlayed;
                                            } else {
                                                // @ts-ignore
                                                displayVal = p.seasonStats[cat.key] / p.seasonStats.gamesPlayed;
                                            }
                                            return (
                                                <tr
                                                    key={p.id}
                                                    onClick={() => onSelectPlayer(p.id)}
                                                    style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <td style={{ width: '20px', color: '#888', padding: '4px' }}>{i + 1}.</td>
                                                    <td style={{ padding: '4px' }}>
                                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>{p.lastName}</div>
                                                        <div style={{ fontSize: '0.7em', color: '#aaa' }}>{team?.abbreviation}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)', padding: '4px' }}>{cat.format(displayVal)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
