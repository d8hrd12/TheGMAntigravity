import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ArrowUpDown, Star, Users, BarChart3, History, Trophy } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, getStarString } from '../../utils/starUtils';

type ViewMode = 'list' | 'stats' | 'history';

export const PlayerLeagueListView: React.FC<{ onBack: () => void, onSelectPlayer: (id: string) => void, initialMode?: ViewMode }> = ({ onBack, onSelectPlayer, initialMode = 'list' }) => {
    const { players, teams, leagueRecords } = useGame();
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string>(initialMode === 'stats' ? 'stats.points' : 'ovr');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const filteredPlayers = useMemo(() => {
        const searchLower = search.toLowerCase();
        return players.filter(p => {
            const team = teams.find(t => t.id === p.teamId);
            const teamName = team?.name || 'Free Agent';
            const playerName = `${p.firstName} ${p.lastName}`;
            return playerName.toLowerCase().includes(searchLower) ||
                   teamName.toLowerCase().includes(searchLower);
        }).map(p => ({
            ...p,
            ovr: calculateOverall(p)
        })).sort((a, b) => {
            const getVal = (p: any, key: string) => {
                const stats = p.seasonStats || { gamesPlayed: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 };
                const gp = stats.gamesPlayed || 1;

                if (key === 'name') return `${p.firstName} ${p.lastName}`;
                if (key === 'team') return teams.find(t => t.id === p.teamId)?.name || '';
                if (key === 'ovr') return calculateOverall(p);
                if (key === 'pos') return p.position;
                if (key === 'age') return p.age;
                
                if (key === 'stats.points') return stats.points / gp;
                if (key === 'stats.rebounds') return stats.rebounds / gp;
                if (key === 'stats.assists') return stats.assists / gp;
                return 0;
            };

            const valA = getVal(a, sortKey);
            const valB = getVal(b, sortKey);

            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [players, teams, search, sortKey, sortDir]);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const categories = [
        { label: 'Most Points', key: 'Points', icon: <Star size={16} color="#f1c40f" /> },
        { label: 'Most Rebounds', key: 'Rebounds', icon: <Star size={16} color="#3498db" /> },
        { label: 'Most Assists', key: 'Assists', icon: <Star size={16} color="#2ecc71" /> },
        { label: 'Most Steals', key: 'Steals', icon: <Star size={16} color="#e74c3c" /> },
        { label: 'Most Blocks', key: 'Blocks', icon: <Star size={16} color="#9b59b6" /> },
        { label: 'Most Threes', key: 'Threes', icon: <Star size={16} color="#f39c12" /> },
    ];

    const renderHistory = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {categories.map(cat => {
                const record = leagueRecords?.find(r => r.category === cat.key);
                return (
                    <div key={cat.key} className="modern-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                            {cat.icon}
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{cat.label.toUpperCase()}</h3>
                        </div>
                        {record ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{record.value}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{record.playerName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {record.teamName} vs {record.opponentName}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)' }}>{record.year}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(record.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                No record set yet.
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="animate-fade" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button onClick={onBack} className="btn-modern" style={{ padding: '8px' }}>
                    <ChevronLeft size={20} />
                </button>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                    {initialMode === 'list' && 'League Player Database'}
                    {initialMode === 'stats' && 'League Statistics Leaders'}
                    {initialMode === 'history' && 'League Players Records'}
                </h1>
            </div>

            {initialMode !== 'history' && (
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search players or teams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            )}

            {initialMode === 'history' ? renderHistory() : (
                <div className="modern-card" style={{ overflow: 'hidden', padding: 0 }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                            <thead style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    <th onClick={() => handleSort('name')} style={{ padding: '12px', textAlign: 'left', cursor: 'pointer' }}>Player <ArrowUpDown size={12} /></th>
                                    <th onClick={() => handleSort('team')} style={{ padding: '12px', textAlign: 'left', cursor: 'pointer' }}>Team <ArrowUpDown size={12} /></th>
                                    {initialMode === 'list' ? (
                                        <>
                                            <th onClick={() => handleSort('ovr')} style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>OVR <ArrowUpDown size={12} /></th>
                                            <th onClick={() => handleSort('pos')} style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>POS <ArrowUpDown size={12} /></th>
                                            <th onClick={() => handleSort('age')} style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>AGE <ArrowUpDown size={12} /></th>
                                        </>
                                    ) : (
                                        <>
                                            <th onClick={() => handleSort('stats.points')} style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>PPG <ArrowUpDown size={12} /></th>
                                            <th onClick={() => handleSort('stats.rebounds')} style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>RPG <ArrowUpDown size={12} /></th>
                                            <th onClick={() => handleSort('stats.assists')} style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}>APG <ArrowUpDown size={12} /></th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayers.map(player => (
                                    <tr 
                                        key={player.id} 
                                        onClick={() => onSelectPlayer(player.id)}
                                        style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                                        className="list-row-hover"
                                    >
                                        <td style={{ padding: '12px', fontWeight: 600 }}>{player.firstName} {player.lastName}</td>
                                        <td style={{ padding: '12px' }}>{teams.find(t => t.id === player.teamId)?.name || 'Free Agent'}</td>
                                        {initialMode === 'list' ? (
                                            <>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{getStarString(calculateStars(player.ovr, 80))}</span>
                                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{player.ovr}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{player.position}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{player.age}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>{((player.seasonStats?.points || 0) / (player.seasonStats?.gamesPlayed || 1)).toFixed(1)}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{((player.seasonStats?.rebounds || 0) / (player.seasonStats?.gamesPlayed || 1)).toFixed(1)}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{((player.seasonStats?.assists || 0) / (player.seasonStats?.gamesPlayed || 1)).toFixed(1)}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
