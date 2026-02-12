import React, { useState, useMemo } from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';

interface LeagueTeamStatsProps {
    teams: Team[];
    players: Player[];
    onSelectTeam: (teamId: string) => void;
}

interface TeamStatRow {
    teamId: string;
    teamName: string;
    city: string;
    primaryColor: string;
    gp: number;
    ppg: number;
    rpg: number;
    apg: number;
    spg: number;
    bpg: number;
    tpg: number;
    fgPct: number;
    threePct: number;
    ftPct: number;
}

export const LeagueTeamStats: React.FC<LeagueTeamStatsProps> = ({ teams, players, onSelectTeam }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof TeamStatRow, direction: 'asc' | 'desc' }>({ key: 'ppg', direction: 'desc' });

    // Calculate aggregated stats
    const teamStats: TeamStatRow[] = useMemo(() => {
        return teams.map(team => {
            const teamPlayers = players.filter(p => p.teamId === team.id);
            const teamGames = team.wins + team.losses || 1; // Avoid div by zero, though stats are usually per player game sum / 5? 
            // Actually, team PPG is usually sum of all player points / team games played.
            // But here we have player season totals.
            // Team Total Points = Sum(Player.SeasonPoints)
            // Team PPG = Team Total Points / Team Games
            // BUT wait, if players were traded, their stats follow them. 
            // In a simple sim, this might be approximate. 
            // Ideal: Team has its own stats history. 
            // Current model: We don't track team stats separately.
            // Approximation: Sum current roster stats. (Note: this is inaccurate if roster changed, but best we have now).

            const totalPoints = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.points || 0), 0);
            const totalRebounds = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.rebounds || 0), 0);
            const totalAssists = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.assists || 0), 0);
            const totalSteals = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.steals || 0), 0);
            const totalBlocks = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.blocks || 0), 0);
            const totalTurnovers = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.turnovers || 0), 0);

            const totalFGM = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.fgMade || 0), 0);
            const totalFGA = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.fgAttempted || 0), 0);
            const total3PM = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.threeMade || 0), 0);
            const total3PA = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.threeAttempted || 0), 0);
            const totalFTM = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.ftMade || 0), 0);
            const totalFTA = teamPlayers.reduce((sum, p) => sum + (p.seasonStats?.ftAttempted || 0), 0);

            // Games played... varies by player. 
            // We should use the Team's games played (wins + losses).
            // If team hasn't played, 1 to avoid NaN.
            const games = Math.max(1, team.wins + team.losses);

            return {
                teamId: team.id,
                teamName: team.name,
                city: team.city,
                primaryColor: team.colors?.primary || '#333',
                gp: team.wins + team.losses,
                ppg: totalPoints / games,
                rpg: totalRebounds / games,
                apg: totalAssists / games,
                spg: totalSteals / games,
                bpg: totalBlocks / games,
                tpg: totalTurnovers / games,
                fgPct: totalFGA > 0 ? (totalFGM / totalFGA) * 100 : 0,
                threePct: total3PA > 0 ? (total3PM / total3PA) * 100 : 0,
                ftPct: totalFTA > 0 ? (totalFTM / totalFTA) * 100 : 0,
            };
        });
    }, [teams, players]);

    const sortedStats = useMemo(() => {
        return [...teamStats].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [teamStats, sortConfig]);

    const requestSort = (key: keyof TeamStatRow) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const HeaderCell = ({ label, sortKey, align = 'right' }: { label: string, sortKey: keyof TeamStatRow, align?: 'left' | 'right' | 'center' }) => (
        <th
            style={{ padding: '12px 10px', cursor: 'pointer', userSelect: 'none', textAlign: align, whiteSpace: 'nowrap', color: '#aaa', fontSize: '0.9rem' }}
            onClick={() => requestSort(sortKey)}
        >
            {label} {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px' }}>
                <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                            <HeaderCell label="Team" sortKey="city" align="left" />
                            <HeaderCell label="GP" sortKey="gp" align="center" />
                            <HeaderCell label="PPG" sortKey="ppg" />
                            <HeaderCell label="RPG" sortKey="rpg" />
                            <HeaderCell label="APG" sortKey="apg" />
                            <HeaderCell label="SPG" sortKey="spg" />
                            <HeaderCell label="BPG" sortKey="bpg" />
                            <HeaderCell label="TPG" sortKey="tpg" />
                            <HeaderCell label="FG%" sortKey="fgPct" />
                            <HeaderCell label="3P%" sortKey="threePct" />
                            <HeaderCell label="FT%" sortKey="ftPct" />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStats.map((stat, index) => (
                            <tr
                                key={stat.teamId}
                                style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onClick={() => onSelectTeam(stat.teamId)}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                            >
                                <td style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold' }}>
                                    <span style={{ color: stat.primaryColor, marginRight: '8px' }}>●</span>
                                    <span style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{stat.city}</span>
                                </td>
                                <td style={{ padding: '12px 10px', color: '#ccc', textAlign: 'center' }}>{stat.gp}</td>
                                <td style={{ padding: '12px 10px', color: '#fff', fontWeight: 'bold' }}>{stat.ppg.toFixed(1)}</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.rpg.toFixed(1)}</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.apg.toFixed(1)}</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.spg.toFixed(1)}</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.bpg.toFixed(1)}</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.tpg.toFixed(1)}</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.fgPct.toFixed(1)}%</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.threePct.toFixed(1)}%</td>
                                <td style={{ padding: '12px 10px', color: '#ccc' }}>{stat.ftPct.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                * Stats are aggregated from current roster totals.
            </div>
        </div>
    );
};
