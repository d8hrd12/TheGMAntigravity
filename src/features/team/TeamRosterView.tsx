
import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Star, BarChart2, Users } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, getStarString } from '../../utils/starUtils';
import { PageHeader } from '../ui/PageHeader';

type ViewMode = 'list' | 'stats';

export const TeamRosterView: React.FC = () => {
    const { players, teams, userTeamId, setSelectedPlayerId, setView } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);
    
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string>('ovr');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

    const roster = useMemo(() => {
        const searchLower = search.toLowerCase();
        
        return players.filter(p => {
            if (p.teamId !== userTeamId) return false;
            const playerName = `${p.firstName} ${p.lastName}`;
            return playerName.toLowerCase().includes(searchLower);
        }).map(p => ({
            ...p,
            ovr: calculateOverall(p)
        })).sort((a, b) => {
            const getVal = (p: any, key: string) => {
                const stats = p.seasonStats || { gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 };
                const gp = stats.gamesPlayed || 1;

                if (key === 'name') return `${p.firstName} ${p.lastName}`;
                if (key === 'ovr') return calculateOverall(p);
                if (key === 'pos') return p.position;
                if (key === 'age') return p.age;
                
                if (key === 'stats.points') return stats.points / gp;
                if (key === 'stats.rebounds') return stats.rebounds / gp;
                if (key === 'stats.assists') return stats.assists / gp;
                if (key === 'stats.fgPct') return stats.fgAttempted > 0 ? stats.fgMade / stats.fgAttempted : 0;
                if (key === 'stats.threePct') return stats.threeAttempted > 0 ? stats.threeMade / stats.threeAttempted : 0;
                if (key === 'stats.ftPct') return stats.ftAttempted > 0 ? stats.ftMade / stats.ftAttempted : 0;
                
                // Attributes
                if (p.attributes && (p.attributes as any)[key] !== undefined) return (p.attributes as any)[key];
                
                return 0;
            };

            const valA = getVal(a, sortKey);
            const valB = getVal(b, sortKey);

            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [players, userTeamId, search, sortKey, sortDir]);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const SortHeader = ({ label, sortKey: sk, style }: { label: string, sortKey: string, style?: React.CSSProperties }) => (
        <th
            onClick={() => handleSort(sk)}
            style={{ 
                padding: '12px 6px', 
                textAlign: 'center', 
                cursor: 'pointer', 
                whiteSpace: 'nowrap', 
                fontSize: '0.7rem', 
                fontWeight: 800, 
                color: 'var(--text-muted)', 
                ...style 
            }}
        >
            {label} {sortKey === sk ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    return (
        <div className="animate-fade" style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <PageHeader
                title="Team Roster"
                subtitle={`${userTeam?.city} ${userTeam?.name} • ${roster.length} Players`}
                onBack={() => setView('dashboard')}
                teamColor={userTeam?.colors?.primary}
            >
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '16px' }}>
                    <div style={{ 
                        display: 'flex', 
                        background: 'rgba(0,0,0,0.06)', 
                        padding: '4px', 
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        width: 'fit-content'
                    }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: viewMode === 'list' ? 'var(--team-primary)' : 'transparent',
                                color: viewMode === 'list' ? '#fff' : 'var(--text-dim)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Users size={14} /> Attributes
                        </button>
                        <button
                            onClick={() => setViewMode('stats')}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: viewMode === 'stats' ? 'var(--team-primary)' : 'transparent',
                                color: viewMode === 'stats' ? '#fff' : 'var(--text-dim)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <BarChart2 size={14} /> Statistics
                        </button>
                    </div>
                </div>
            </PageHeader>

            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div className="premium-table-wrapper">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <SortHeader label="Player" sortKey="name" style={{ position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 12 }} />
                                {viewMode === 'list' ? (
                                    <>
                                        <SortHeader label="OVR" sortKey="ovr" />
                                        <SortHeader label="POS" sortKey="pos" />
                                        <SortHeader label="AGE" sortKey="age" />
                                        <SortHeader label="FIN" sortKey="finishing" />
                                        <SortHeader label="MID" sortKey="midRange" />
                                        <SortHeader label="3PT" sortKey="threePointShot" />
                                        <SortHeader label="FT" sortKey="freeThrow" />
                                        <SortHeader label="PLY" sortKey="playmaking" />
                                        <SortHeader label="BH" sortKey="ballHandling" />
                                        <SortHeader label="ORB" sortKey="offensiveRebound" />
                                        <SortHeader label="DRB" sortKey="defensiveRebound" />
                                        <SortHeader label="INT" sortKey="interiorDefense" />
                                        <SortHeader label="PER" sortKey="perimeterDefense" />
                                        <SortHeader label="IQ" sortKey="basketballIQ" />
                                        <SortHeader label="ATH" sortKey="athleticism" />
                                    </>
                                ) : (
                                    <>
                                        <SortHeader label="GP" sortKey="stats.gamesPlayed" />
                                        <SortHeader label="PPG" sortKey="stats.points" />
                                        <SortHeader label="RPG" sortKey="stats.rebounds" />
                                        <SortHeader label="APG" sortKey="stats.assists" />
                                        <SortHeader label="FG%" sortKey="stats.fgPct" />
                                        <SortHeader label="3P%" sortKey="stats.threePct" />
                                        <SortHeader label="FT%" sortKey="stats.ftPct" />
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {roster.map(player => {
                                const gp = player.seasonStats?.gamesPlayed || 1;
                                const isHighlighted = highlightedRow === player.id;
                                return (
                                    <tr 
                                        key={player.id} 
                                        onClick={() => setSelectedPlayerId(player.id)}
                                        style={{ 
                                            borderBottom: '1px solid var(--border-color)', 
                                            cursor: 'pointer',
                                            background: isHighlighted ? 'rgba(var(--team-primary-rgb), 0.05)' : 'transparent',
                                            transition: 'background 0.15s'
                                        }}
                                        className="list-row-hover"
                                    >
                                        <td className="sticky-col" style={{ 
                                            padding: '12px 8px', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap',
                                            left: 0, background: 'var(--bg-card)', zIndex: 10, fontSize: '0.9rem'
                                        }}>
                                            {player.firstName.charAt(0)}. {player.lastName}
                                        </td>
                                        {viewMode === 'list' ? (
                                            <>
                                                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)' }}>{player.ovr}</span>
                                                </td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{player.position}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.75rem' }}>{player.age}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#2ecc71', fontWeight: 700 }}>{player.attributes.finishing}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#3498db', fontWeight: 700 }}>{player.attributes.midRange}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#f1c40f', fontWeight: 700 }}>{player.attributes.threePointShot}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#f39c12', fontWeight: 700 }}>{player.attributes.freeThrow}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#2ecc71', fontWeight: 700 }}>{player.attributes.playmaking}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#16a085', fontWeight: 700 }}>{player.attributes.ballHandling}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#e67e22', fontWeight: 700 }}>{player.attributes.offensiveRebound}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#d35400', fontWeight: 700 }}>{player.attributes.defensiveRebound}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#e74c3c', fontWeight: 700 }}>{player.attributes.interiorDefense}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#c0392b', fontWeight: 700 }}>{player.attributes.perimeterDefense}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#9b59b6', fontWeight: 700 }}>{player.attributes.basketballIQ}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#3498db', fontWeight: 700 }}>{player.attributes.athleticism}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td style={{ padding: '12px 8px', textAlign: 'center' }}>{player.seasonStats?.gamesPlayed || 0}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700 }}>{((player.seasonStats?.points || 0) / gp).toFixed(1)}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center' }}>{((player.seasonStats?.rebounds || 0) / gp).toFixed(1)}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center' }}>{((player.seasonStats?.assists || 0) / gp).toFixed(1)}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.75rem' }}>{player.seasonStats?.fgAttempted ? ((player.seasonStats.fgMade / player.seasonStats.fgAttempted) * 100).toFixed(0) : 0}%</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.75rem' }}>{player.seasonStats?.threeAttempted ? ((player.seasonStats.threeMade / player.seasonStats.threeAttempted) * 100).toFixed(0) : 0}%</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '0.75rem' }}>{player.seasonStats?.ftAttempted ? ((player.seasonStats.ftMade / player.seasonStats.ftAttempted) * 100).toFixed(0) : 0}%</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
