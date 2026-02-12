import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';
import { BackButton } from '../ui/BackButton';
import { TeamSelect } from '../ui/TeamSelect';

interface TeamStatsViewProps {
    players: Player[];
    teams: Team[];
    userTeamId: string;
    onBack?: () => void;
    onSelectPlayer: (playerId: string) => void;
    initialTeamId?: string;
    onViewHistory?: () => void;
    onShowLeagueHistory?: () => void;
}

export const TeamStatsView: React.FC<TeamStatsViewProps> = ({ players, teams, userTeamId, onBack, onSelectPlayer, initialTeamId, onViewHistory, onShowLeagueHistory }) => {
    const [selectedTeamId, setSelectedTeamId] = React.useState(initialTeamId || userTeamId);
    const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'points', direction: 'desc' });

    console.log('TeamStatsView Debug:', { initialTeamId, userTeamId, selectedTeamId, totalPlayers: players.length });

    const teamPlayers = players.filter(p => p.teamId === selectedTeamId);
    console.log('TeamPlayers:', teamPlayers.length);

    // Sort players
    const sortedPlayers = React.useMemo(() => {
        let sortablePlayers = [...teamPlayers];
        sortablePlayers.sort((a, b) => {
            const getVal = (p: Player, key: string) => {
                const stats = p.seasonStats || { gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 };
                const gp = stats.gamesPlayed || 1;

                if (key === 'name') return p.lastName;
                if (key === 'pos') return p.position;
                if (key === 'ovr') return calculateOverall(p);
                if (key === 'gp') return stats.gamesPlayed;
                // Stats
                if (key === 'points') return stats.points / gp;
                if (key === 'rebounds') return stats.rebounds / gp;
                if (key === 'assists') return stats.assists / gp;
                if (key === 'steals') return stats.steals / gp;
                if (key === 'blocks') return stats.blocks / gp;
                if (key === 'turnovers') return (stats.turnovers || 0) / gp;
                if (key === 'mpg') return (stats.minutes || 0) / gp;
                if (key === 'fgPct') return stats.fgAttempted > 0 ? stats.fgMade / stats.fgAttempted : 0;
                if (key === 'threePct') return stats.threeAttempted > 0 ? stats.threeMade / stats.threeAttempted : 0;
                return 0;
            };

            const aVal = getVal(a, sortConfig.key);
            const bVal = getVal(b, sortConfig.key);

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortablePlayers;
    }, [teamPlayers, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const [visibleStat, setVisibleStat] = React.useState<'all' | 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks' | 'turnovers'>('all');

    const STAT_OPTIONS = [
        { key: 'points', label: 'PTS', color: '#e74c3c' },
        { key: 'rebounds', label: 'REB', color: '#3498db' },
        { key: 'assists', label: 'AST', color: '#f1c40f' },
        { key: 'steals', label: 'STL', color: '#e67e22' },
        { key: 'blocks', label: 'BLK', color: '#e67e22' },
        { key: 'turnovers', label: 'TOV', color: '#95a5a6' },
        { key: 'all', label: 'ALL', color: '#7f8c8d' },
    ];

    const HeaderCell = ({ label, sortKey, align = 'left', visible = true }: { label: string, sortKey: string, align?: 'left' | 'right' | 'center', visible?: boolean }) => {
        if (!visible) return null;
        return (
            <th
                style={{ padding: '10px', cursor: 'pointer', userSelect: 'none', textAlign: align, whiteSpace: 'nowrap' }}
                onClick={() => requestSort(sortKey)}
            >
                {label} {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
        );
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {onBack && (
                    <BackButton onClick={onBack} />
                )}

                <TeamSelect
                    teams={teams}
                    selectedTeamId={selectedTeamId}
                    onChange={setSelectedTeamId}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>Team Season Stats</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {onViewHistory && (
                        <button
                            onClick={onViewHistory}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}
                        >
                            Team History
                        </button>
                    )}
                    {onShowLeagueHistory && (
                        <button
                            onClick={onShowLeagueHistory}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '20px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}
                        >
                            League History
                        </button>
                    )}
                </div>
            </div>

            {/* Stat Category Toggles */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
                {STAT_OPTIONS.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => setVisibleStat(opt.key as any)}
                        style={{
                            padding: '6px 16px',
                            background: visibleStat === opt.key ? opt.color : 'rgba(255,255,255,0.1)',
                            color: visibleStat === opt.key ? '#fff' : 'var(--text-secondary)',
                            border: `1px solid ${visibleStat === opt.key ? opt.color : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', borderRadius: '12px' }}>
                <table style={{ width: '100%', minWidth: visibleStat === 'all' ? '800px' : 'auto', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)' }}>
                            <HeaderCell label="Player" sortKey="name" />
                            <HeaderCell label="Pos" sortKey="pos" />
                            <HeaderCell label="OVR" sortKey="ovr" />
                            <HeaderCell label="GP" sortKey="gp" align="center" />
                            <HeaderCell label="PTS" sortKey="points" align="right" visible={visibleStat === 'all' || visibleStat === 'points'} />
                            <HeaderCell label="AST" sortKey="assists" align="right" visible={visibleStat === 'all' || visibleStat === 'assists'} />
                            <HeaderCell label="REB" sortKey="rebounds" align="right" visible={visibleStat === 'all' || visibleStat === 'rebounds'} />
                            <HeaderCell label="MPG" sortKey="mpg" align="center" />
                            <HeaderCell label="STL" sortKey="steals" align="right" visible={visibleStat === 'all' || visibleStat === 'steals'} />
                            <HeaderCell label="BLK" sortKey="blocks" align="right" visible={visibleStat === 'all' || visibleStat === 'blocks'} />
                            <HeaderCell label="TOV" sortKey="turnovers" align="right" visible={visibleStat === 'all' || visibleStat === 'turnovers'} />
                            <HeaderCell label="FG%" sortKey="fgPct" align="right" visible={visibleStat === 'all'} />
                            <HeaderCell label="3P%" sortKey="threePct" align="right" visible={visibleStat === 'all'} />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((p, index) => {
                            const stats = p.seasonStats || { gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgAttempted: 0, fgMade: 0, threeAttempted: 0, threeMade: 0 };
                            const gp = stats.gamesPlayed || 1;
                            const isVisible = (key: string) => visibleStat === 'all' || visibleStat === key;

                            const fgPct = stats.fgAttempted > 0 ? ((stats.fgMade / stats.fgAttempted) * 100).toFixed(1) : '0.0';
                            const threePct = stats.threeAttempted > 0 ? ((stats.threeMade / stats.threeAttempted) * 100).toFixed(1) : '0.0';

                            return (
                                <tr
                                    key={p.id}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s', background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                                    onClick={() => onSelectPlayer(p.id)}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                                >
                                    <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#fff' }}>{p.firstName} {p.lastName}</td>
                                    <td style={{ padding: '12px 10px', color: '#aaa' }}>{p.position}</td>
                                    <td style={{ padding: '12px 10px', color: getRatingColor(calculateOverall(p)), fontWeight: 'bold' }}>{calculateOverall(p)}</td>
                                    <td style={{ padding: '12px 10px', color: '#ccc', textAlign: 'center' }}>{stats.gamesPlayed}</td>
                                    {isVisible('points') && <td style={{ padding: '12px 10px', color: '#fff', textAlign: 'right', fontWeight: 'bold' }}>{(stats.points / gp).toFixed(1)}</td>}
                                    {isVisible('assists') && <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: isVisible('assists') && visibleStat !== 'all' ? 'bold' : 'normal', color: isVisible('assists') && visibleStat !== 'all' ? '#fff' : '#ccc' }}>{(stats.assists / gp).toFixed(1)}</td>}
                                    {isVisible('rebounds') && <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: isVisible('rebounds') && visibleStat !== 'all' ? 'bold' : 'normal', color: isVisible('rebounds') && visibleStat !== 'all' ? '#fff' : '#ccc' }}>{(stats.rebounds / gp).toFixed(1)}</td>}
                                    <td style={{ padding: '12px 10px', color: '#ccc', textAlign: 'center' }}>{((stats.minutes || 0) / gp).toFixed(1)}</td>
                                    {isVisible('steals') && <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: isVisible('steals') && visibleStat !== 'all' ? 'bold' : 'normal', color: isVisible('steals') && visibleStat !== 'all' ? '#fff' : '#ccc' }}>{(stats.steals / gp).toFixed(1)}</td>}
                                    {isVisible('blocks') && <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: isVisible('blocks') && visibleStat !== 'all' ? 'bold' : 'normal', color: isVisible('blocks') && visibleStat !== 'all' ? '#fff' : '#ccc' }}>{(stats.blocks / gp).toFixed(1)}</td>}
                                    {isVisible('turnovers') && <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: isVisible('turnovers') && visibleStat !== 'all' ? 'bold' : 'normal', color: isVisible('turnovers') && visibleStat !== 'all' ? '#fff' : '#ccc' }}>{((stats.turnovers || 0) / gp).toFixed(1)}</td>}
                                    {visibleStat === 'all' && <td style={{ padding: '12px 10px', textAlign: 'right', color: '#ccc' }}>{fgPct}%</td>}
                                    {visibleStat === 'all' && <td style={{ padding: '12px 10px', textAlign: 'right', color: '#ccc' }}>{threePct}%</td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const getRatingColor = (value: number) => {
    if (value >= 85) return '#2ecc71';
    if (value >= 75) return '#3498db';
    if (value >= 65) return '#f1c40f';
    return '#e74c3c';
};
