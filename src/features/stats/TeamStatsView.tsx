import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall, calculateEWA } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { BackButton } from '../ui/BackButton';
import { TeamSelect } from '../ui/TeamSelect';
import { PageHeader } from '../ui/PageHeader';
import { useGame } from '../../store/GameContext';

interface TeamStatsViewProps {
    players: Player[];
    teams: Team[];
    userTeamId: string;
    onBack?: () => void;
    onSelectPlayer: (playerId: string) => void;
    initialTeamId?: string;
    onViewHistory?: () => void;
    onShowLeagueHistory?: () => void;
    onTeamChange?: (teamId: string) => void;
    onShowGm?: (gmId: string) => void;
}

export const TeamStatsView: React.FC<TeamStatsViewProps> = ({ players, teams, userTeamId, onBack, onSelectPlayer, initialTeamId, onViewHistory, onShowLeagueHistory, onTeamChange, onShowGm }) => {
    const { aiGms } = useGame();
    const [selectedTeamId, setSelectedTeamId] = React.useState(initialTeamId || userTeamId);
    const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'ovr', direction: 'desc' });
    const [highlightedRow, setHighlightedRow] = React.useState<string | null>(null);
    const [visibleStat, setVisibleStat] = React.useState<'all' | 'points' | 'assists' | 'rebounds' | 'steals' | 'blocks' | 'turnovers' | 'ewa'>('all');
    const [activeTab, setActiveTab] = React.useState<'roster' | 'league'>('roster');

    const handleTeamChange = (id: string) => {
        setSelectedTeamId(id);
        if (onTeamChange) onTeamChange(id);
    };

    const teamPlayers = players.filter(p => p.teamId === selectedTeamId);
    const teamBaseline = React.useMemo(() => calculateTeamBaseline(teamPlayers), [teamPlayers]);

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
                if (key === 'ewa') return calculateEWA(p);
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
                if (key === 'ftPct') return stats.ftAttempted > 0 ? stats.ftMade / stats.ftAttempted : 0;
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



    const STAT_OPTIONS = [
        { key: 'points', label: 'PTS', color: '#e74c3c' },
        { key: 'rebounds', label: 'REB', color: '#3498db' },
        { key: 'assists', label: 'AST', color: '#f1c40f' },
        { key: 'steals', label: 'STL', color: '#e67e22' },
        { key: 'blocks', label: 'BLK', color: '#e67e22' },
        { key: 'turnovers', label: 'TOV', color: '#95a5a6' },
        { key: 'ewa', label: 'EWA', color: '#9b59b6' },
        { key: 'all', label: 'ALL', color: 'var(--text-muted)' },
    ];

    const HeaderCell = ({ label, sortKey, align = 'center', visible = true }: { label: string, sortKey: string, align?: 'left' | 'right' | 'center', visible?: boolean }) => {
        if (!visible) return null;
        return (
            <th
                style={{ padding: '12px 10px', cursor: 'pointer', userSelect: 'none', textAlign: align, whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-color)' }}
                onClick={() => requestSort(sortKey)}
            >
                {label} {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
        );
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '80px', background: 'var(--bg-main)', width: '100%' }}>
            <PageHeader
                title={activeTab === 'roster' ? "Team Roster & Stats" : "League Team Rankings"}
                onBack={onBack!}
            />

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <button 
                    onClick={() => setActiveTab('roster')}
                    className="btn-modern"
                    style={{ flex: 1, background: activeTab === 'roster' ? 'var(--primary)' : 'var(--bg-card)', color: activeTab === 'roster' ? '#fff' : 'var(--text-main)' }}
                >
                    Team Roster
                </button>
                <button 
                    onClick={() => setActiveTab('league')}
                    className="btn-modern"
                    style={{ flex: 1, background: activeTab === 'league' ? 'var(--primary)' : 'var(--bg-card)', color: activeTab === 'league' ? '#fff' : 'var(--text-main)' }}
                >
                    League Stats
                </button>
            </div>

            {activeTab === 'roster' ? (
                <>

            {/* Team Selector and History Buttons */}
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                <div style={{ flex: '1 1 auto', minWidth: '160px' }}>
                    <TeamSelect
                        teams={teams}
                        selectedTeamId={selectedTeamId}
                        onChange={handleTeamChange}
                        style={{ width: '100%', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {onViewHistory && (
                        <button
                            onClick={onViewHistory}
                            className="btn-modern"
                            style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                        >
                            History
                        </button>
                    )}
                </div>
            </div>

            {/* Team Strategy & GM Info */}
            <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '15px',
                background: 'rgba(255,255,255,0.03)',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Strategic Direction</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 'bold',
                            color: teams.find(t => t.id === selectedTeamId)?.strategy?.direction === 'Contender' ? '#f44336' : '#4caf50'
                        }}>
                            {teams.find(t => t.id === selectedTeamId)?.strategy?.direction || 'Balanced'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>•</span>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                            {teams.find(t => t.id === selectedTeamId)?.strategy?.focus || 'Balanced'} Focused
                        </span>
                    </div>
                </div>
                {selectedTeamId !== userTeamId && (
                    <button 
                        onClick={() => {
                            const team = teams.find(t => t.id === selectedTeamId);
                            if (team?.gmId && onShowGm) onShowGm(team.gmId);
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        View GM
                    </button>
                )}
            </div>

            {/* Stat Category Toggle Widget */}
            <div style={{
                display: 'flex',
                background: 'var(--bg-card)',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                marginBottom: '15px',
                gap: '4px'
            }}>
                {STAT_OPTIONS.map(opt => {
                    const isActive = visibleStat === opt.key;
                    return (
                        <button
                            key={opt.key}
                            onClick={() => setVisibleStat(opt.key as any)}
                            style={{
                                padding: '6px 12px',
                                background: isActive ? (opt.key === 'all' ? 'var(--primary)' : opt.color) : 'transparent',
                                color: isActive ? '#fff' : 'var(--text-muted)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: isActive ? 700 : 500,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                                flex: '0 0 auto',
                            }}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            <div className="premium-table-wrapper" style={{ border: 'none', background: 'transparent' }}>
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th className="sticky-col"
                                style={{
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    left: 0,
                                    zIndex: 10,
                                    background: 'var(--bg-card)', 
                                }}
                                onClick={() => requestSort('name')}
                            >
                                Player {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <HeaderCell label="Pos" sortKey="pos" />
                            <HeaderCell label="Age" sortKey="age" />
                            <HeaderCell label="Stars" sortKey="ovr" />
                            <HeaderCell label="GP" sortKey="gp" />
                            <HeaderCell label="MIN" sortKey="mpg" />
                            <HeaderCell label="PTS" sortKey="points" visible={visibleStat === 'all' || visibleStat === 'points'} />
                            <HeaderCell label="AST" sortKey="assists" visible={visibleStat === 'all' || visibleStat === 'assists'} />
                            <HeaderCell label="REB" sortKey="rebounds" visible={visibleStat === 'all' || visibleStat === 'rebounds'} />
                            <HeaderCell label="STL" sortKey="steals" visible={visibleStat === 'all' || visibleStat === 'steals'} />
                            <HeaderCell label="BLK" sortKey="blocks" visible={visibleStat === 'all' || visibleStat === 'blocks'} />
                            <HeaderCell label="TOV" sortKey="turnovers" visible={visibleStat === 'all' || visibleStat === 'turnovers'} />
                            <HeaderCell label="FG%" sortKey="fgPct" visible={visibleStat === 'all'} />
                            <HeaderCell label="3P%" sortKey="threePct" visible={visibleStat === 'all'} />
                            <HeaderCell label="FT%" sortKey="ftPct" visible={visibleStat === 'all'} />
                            <HeaderCell label="EWA" sortKey="ewa" visible={visibleStat === 'all' || visibleStat === 'ewa'} />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((p, index) => {
                            const stats = p.seasonStats || { gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fgAttempted: 0, fgMade: 0, threeAttempted: 0, threeMade: 0, ftAttempted: 0, ftMade: 0 };
                            const gp = stats.gamesPlayed || 1;
                            const isVisible = (key: string) => visibleStat === 'all' || visibleStat === key;

                            const fgPct = stats.fgAttempted > 0 ? ((stats.fgMade / stats.fgAttempted) * 100).toFixed(1) : '0.0';
                            const threePct = stats.threeAttempted > 0 ? ((stats.threeMade / stats.threeAttempted) * 100).toFixed(1) : '0.0';
                            const ftPct = stats.ftAttempted > 0 ? ((stats.ftMade / stats.ftAttempted) * 100).toFixed(1) : '0.0';
                            const isHighlighted = highlightedRow === p.id;

                            return (
                                <tr
                                    key={p.id}
                                    style={{ 
                                        borderBottom: '1px solid var(--border-color)', 
                                        cursor: 'pointer', 
                                        background: isHighlighted ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                                        transition: 'background 0.15s'
                                    }}
                                    className="list-row-hover"
                                    onClick={() => {
                                        setHighlightedRow(isHighlighted ? null : p.id);
                                        onSelectPlayer(p.id);
                                    }}
                                >
                                    <td className="sticky-col" style={{
                                        fontWeight: 'bold',
                                        color: 'var(--text-main)',
                                        left: 0,
                                        zIndex: 10,
                                        background: isHighlighted ? 'rgba(52, 152, 219, 0.1)' : 'var(--bg-card)',
                                        textAlign: 'center',
                                        transition: 'background 0.15s'
                                    }}>
                                        {p.firstName} {p.lastName}
                                    </td>
                                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)', textAlign: 'center' }}>{p.position}</td>
                                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)' }}>{p.age}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2px' }}>
                                            <StarRating stars={calculateStars(calculateOverall(p), teamBaseline)} size={12} />
                                            {p.inSeasonProgress ? (
                                                <span style={{ 
                                                    color: p.inSeasonProgress > 0 ? '#2ecc71' : '#e74c3c', 
                                                    fontSize: '0.8rem', 
                                                    fontWeight: 800 
                                                }}>
                                                    {p.inSeasonProgress > 0 ? '+' : '-'}
                                                </span>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)', textAlign: 'center' }}>{stats.gamesPlayed}</td>
                                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)', textAlign: 'center' }}>{((stats.minutes || 0) / gp).toFixed(1)}</td>
                                    {isVisible('points') && <td style={{ padding: '12px 10px', color: 'var(--text-main)', textAlign: 'center', fontWeight: 'bold' }}>{(stats.points / gp).toFixed(1)}</td>}
                                    {isVisible('assists') && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-main)' }}>{(stats.assists / gp).toFixed(1)}</td>}
                                    {isVisible('rebounds') && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-main)' }}>{(stats.rebounds / gp).toFixed(1)}</td>}
                                    {isVisible('steals') && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-main)' }}>{(stats.steals / gp).toFixed(1)}</td>}
                                    {isVisible('blocks') && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-main)' }}>{(stats.blocks / gp).toFixed(1)}</td>}
                                    {isVisible('turnovers') && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-main)' }}>{((stats.turnovers || 0) / gp).toFixed(1)}</td>}
                                    {visibleStat === 'all' && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>{fgPct}%</td>}
                                    {visibleStat === 'all' && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>{threePct}%</td>}
                                    {visibleStat === 'all' && <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>{ftPct}%</td>}
                                    {(visibleStat === 'all' || visibleStat === 'ewa') && <td style={{ padding: '12px 10px', color: 'var(--primary)', textAlign: 'center', fontWeight: 'bold' }}>{calculateEWA(p)}</td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
                </>
            ) : (
                <div className="premium-table-wrapper" style={{ border: 'none', background: 'transparent' }}>
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="sticky-col">Team</th>
                                <th>Record</th>
                                <th>PPG</th>
                                <th>OPP PPG</th>
                                <th>REB</th>
                                <th>AST</th>
                                <th>FG%</th>
                                <th>3P%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...teams].sort((a,b) => b.wins - a.wins).map(t => {
                                const tPlayers = players.filter(p => p.teamId === t.id);
                                const gp = (t.wins + t.losses) || 1;
                                
                                const ppg = tPlayers.reduce((s, p) => s + (p.seasonStats?.points || 0), 0) / gp;
                                const rpg = tPlayers.reduce((s, p) => s + (p.seasonStats?.rebounds || 0), 0) / gp;
                                const apg = tPlayers.reduce((s, p) => s + (p.seasonStats?.assists || 0), 0) / gp;
                                
                                const fgm = tPlayers.reduce((s, p) => s + (p.seasonStats?.fgMade || 0), 0);
                                const fga = tPlayers.reduce((s, p) => s + (p.seasonStats?.fgAttempted || 0), 0) || 1;
                                const fgPct = (fgm / fga * 100).toFixed(1);

                                const t3m = tPlayers.reduce((s, p) => s + (p.seasonStats?.threeMade || 0), 0);
                                const t3a = tPlayers.reduce((s, p) => s + (p.seasonStats?.threeAttempted || 0), 0) || 1;
                                const t3Pct = (t3m / t3a * 100).toFixed(1);

                                return (
                                    <tr key={t.id} onClick={() => handleTeamChange(t.id)} style={{ cursor: 'pointer' }}>
                                        <td className="sticky-col" style={{ fontWeight: 800, background: 'var(--bg-card)' }}>
                                            {t.abbreviation} {t.name}
                                        </td>
                                        <td style={{ fontWeight: 700 }}>{t.wins}-{t.losses}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{ppg.toFixed(1)}</td>
                                        <td>-</td> {/* We'd need game results to calculate OPP PPG properly, showing dash for now */}
                                        <td>{rpg.toFixed(1)}</td>
                                        <td>{apg.toFixed(1)}</td>
                                        <td>{fgPct}%</td>
                                        <td>{t3Pct}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const getRatingColor = (value: number) => {
    if (value >= 85) return '#2ecc71';
    if (value >= 75) return '#3498db';
    if (value >= 65) return '#f1c40f';
    return '#e74c3c';
};
