import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Star } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, getStarString } from '../../utils/starUtils';
import { PageHeader } from '../ui/PageHeader';

type ViewMode = 'list' | 'stats' | 'history';

export const PlayerLeagueListView: React.FC<{ onBack: () => void, onSelectPlayer: (id: string) => void, initialMode?: ViewMode }> = ({ onBack, onSelectPlayer, initialMode = 'list' }) => {
    const { players, teams, leagueRecords, leagueType } = useGame();
    const [selectedLeague, setSelectedLeague] = useState<'EuroLeague' | 'EuroCup' | 'Free Agents'>('EuroLeague');
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string>(initialMode === 'stats' ? 'stats.points' : 'ovr');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

    const { nbaToEuroPool, localTalentPool } = useGame();

    const filteredPlayers = useMemo(() => {
        const searchLower = search.toLowerCase();
        
        let pool = [...players];
        if (leagueType === 'EURO' && selectedLeague === 'Free Agents') {
            // Include NBA pool and local talent in the "Free Agents" view
            const nbaVets = (nbaToEuroPool || []).map(p => ({ ...p, isNBAPool: true }));
            const localTalent = (localTalentPool || []).map(p => ({ 
                ...p, 
                firstName: p.firstName, 
                lastName: p.lastName,
                overall: calculateOverall(p),
                isLocalTalent: true 
            }));
            pool = [...players.filter(p => !p.teamId), ...nbaVets as any, ...localTalent as any];
        }

        return pool.filter(p => {
            if (leagueType === 'EURO') {
                if (selectedLeague === 'Free Agents') {
                    // Already filtered pool above
                    return true;
                }
                const leagueTeamIds = new Set(teams.filter(t => t.conference === selectedLeague).map(t => t.id));
                if (!p.teamId || !leagueTeamIds.has(p.teamId)) return false;
            } else {
                if (!p.teamId) return false;
            }

            const team = teams.find(t => t.id === p.teamId);
            const teamName = team?.name || (p.id.startsWith('nba_') ? 'NBA Market' : (p as any).isLocalTalent ? 'Youth Academy' : 'Free Agent');
            const playerName = `${p.firstName} ${p.lastName}`;
            return playerName.toLowerCase().includes(searchLower) ||
                   teamName.toLowerCase().includes(searchLower);
        }).map(p => ({
            ...p,
            ovr: p.overall || calculateOverall(p)
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
                if (key === 'stats.fgPct') return stats.fgAttempted > 0 ? stats.fgMade / stats.fgAttempted : 0;
                if (key === 'stats.threePct') return stats.threeAttempted > 0 ? stats.threeMade / stats.threeAttempted : 0;
                if (key === 'stats.ftPct') return stats.ftAttempted > 0 ? stats.ftMade / stats.ftAttempted : 0;
                if (key === 'stats.steals') return (stats.steals || 0) / gp;
                if (key === 'stats.blocks') return (stats.blocks || 0) / gp;
                if (key === 'stats.turnovers') return (stats.turnovers || 0) / gp;
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categories.map(cat => {
                const record = leagueRecords?.find(r => r.category === cat.key);
                return (
                    <div key={cat.key} className="modern-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                            {cat.icon}
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', width: '100%' }}>{cat.label.toUpperCase()}</h3>
                        </div>
                        {record ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>{record.value}</div>
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

    const SortHeader = ({ label, sortKey: sk, style }: { label: string, sortKey: string, style?: React.CSSProperties }) => (
        <th
            onClick={() => handleSort(sk)}
            style={{ padding: '10px 6px', textAlign: 'center', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', ...style }}
        >
            {label} {sortKey === sk ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    return (
        <div className="animate-fade" style={{ width: '100%' }}>
            <PageHeader
                title={
                    initialMode === 'list' ? 'League Player Database' :
                    initialMode === 'stats' ? 'League Statistics Leaders' :
                    'League Players Records'
                }
                subtitle={
                    initialMode === 'list' ? 'Comprehensive scouting & attributes' :
                    initialMode === 'stats' ? 'Global performance ranking' :
                    'Historical single-game legends'
                }
                onBack={onBack}
            >
                {leagueType === 'EURO' && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '16px' }}>
                        <div style={{ 
                            display: 'flex', 
                            background: 'rgba(0,0,0,0.06)', 
                            padding: '4px', 
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            width: 'fit-content'
                        }}>
                            {(['EuroLeague', 'EuroCup', 'Free Agents'] as const).map(league => (
                                <button
                                    key={league}
                                    onClick={() => setSelectedLeague(league)}
                                    style={{
                                        padding: '8px 16px',
                                        minWidth: '110px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: selectedLeague === league ? 'var(--team-primary)' : 'transparent',
                                        color: selectedLeague === league ? '#fff' : 'var(--text-dim)',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        textAlign: 'center'
                                    }}
                                >
                                    {league}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </PageHeader>

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
                            padding: '10px 10px 10px 36px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            fontSize: '0.85rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
            )}

            {initialMode === 'history' ? renderHistory() : (
                <div className="premium-table-wrapper">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <SortHeader label="Player" sortKey="name" style={{ position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 12 }} />
                                <SortHeader label="Team" sortKey="team" />
                                {initialMode === 'list' ? (
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
                                        <SortHeader label="PPG" sortKey="stats.points" />
                                        <SortHeader label="RPG" sortKey="stats.rebounds" />
                                        <SortHeader label="APG" sortKey="stats.assists" />
                                        <SortHeader label="FG%" sortKey="stats.fgPct" />
                                        <SortHeader label="3P%" sortKey="stats.threePct" />
                                        <SortHeader label="FT%" sortKey="stats.ftPct" />
                                        <SortHeader label="SPG" sortKey="stats.steals" />
                                        <SortHeader label="BPG" sortKey="stats.blocks" />
                                        <SortHeader label="TOV" sortKey="stats.turnovers" />
                                    </>
                                )}
                            </tr>
                        </thead>
                            <tbody>
                                {filteredPlayers.map(player => {
                                    const gp = player.seasonStats?.gamesPlayed || 1;
                                    const isHighlighted = highlightedRow === player.id;
                                    return (
                                        <tr 
                                            key={player.id} 
                                            onClick={() => {
                                                setHighlightedRow(isHighlighted ? null : player.id);
                                                onSelectPlayer(player.id);
                                            }}
                                            style={{ 
                                                borderBottom: '1px solid var(--border-color)', 
                                                cursor: 'pointer',
                                                background: isHighlighted ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                                                transition: 'background 0.15s'
                                            }}
                                            className="list-row-hover"
                                        >
                                            <td className="sticky-col" style={{ 
                                                padding: '10px 8px', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap',
                                                left: 0, background: isHighlighted ? 'rgba(52, 152, 219, 0.1)' : 'var(--bg-card)', zIndex: 10
                                            }}>
                                                {player.firstName.charAt(0)}. {player.lastName}
                                            </td>
                                            <td style={{ padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '0.7rem' }}>
                                                {teams.find(t => t.id === player.teamId)?.abbreviation || 'FA'}
                                            </td>
                                            {initialMode === 'list' ? (
                                                <>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-main)' }}>{getStarString(calculateStars(player.ovr, 80))}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{player.position}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{player.age}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#2ecc71', fontWeight: 600 }}>{player.attributes.finishing}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#3498db', fontWeight: 600 }}>{player.attributes.midRange}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#f1c40f', fontWeight: 600 }}>{player.attributes.threePointShot}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#f39c12', fontWeight: 600 }}>{player.attributes.freeThrow}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#2ecc71', fontWeight: 600 }}>{player.attributes.playmaking}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#16a085', fontWeight: 600 }}>{player.attributes.ballHandling}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#e67e22', fontWeight: 600 }}>{player.attributes.offensiveRebound}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#d35400', fontWeight: 600 }}>{player.attributes.defensiveRebound}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#e74c3c', fontWeight: 600 }}>{player.attributes.interiorDefense}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#c0392b', fontWeight: 600 }}>{player.attributes.perimeterDefense}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#9b59b6', fontWeight: 600 }}>{player.attributes.basketballIQ}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#3498db', fontWeight: 600 }}>{player.attributes.athleticism}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700 }}>{((player.seasonStats?.points || 0) / gp).toFixed(1)}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{((player.seasonStats?.rebounds || 0) / gp).toFixed(1)}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{((player.seasonStats?.assists || 0) / gp).toFixed(1)}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '0.65rem' }}>{player.seasonStats?.fgAttempted ? ((player.seasonStats.fgMade / player.seasonStats.fgAttempted) * 100).toFixed(0) : 0}%</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '0.65rem' }}>{player.seasonStats?.threeAttempted ? ((player.seasonStats.threeMade / player.seasonStats.threeAttempted) * 100).toFixed(0) : 0}%</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '0.65rem' }}>{player.seasonStats?.ftAttempted ? ((player.seasonStats.ftMade / player.seasonStats.ftAttempted) * 100).toFixed(0) : 0}%</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{((player.seasonStats?.steals || 0) / gp).toFixed(1)}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{((player.seasonStats?.blocks || 0) / gp).toFixed(1)}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-muted)' }}>{((player.seasonStats?.turnovers || 0) / gp).toFixed(1)}</td>
                                                </>
                                            )}
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
