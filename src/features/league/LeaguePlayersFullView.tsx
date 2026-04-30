import React, { useState, useMemo } from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { Search } from 'lucide-react';

interface LeaguePlayersFullViewProps {
    players: Player[];
    teams: Team[];
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
}

export const LeaguePlayersFullView: React.FC<LeaguePlayersFullViewProps> = ({ players, teams, onSelectPlayer, onSelectTeam }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'ovr', direction: 'desc' });

    // Filter and Sort Players
    const filteredPlayers = useMemo(() => {
        let result = players.filter(p => !p.isRetired); // Ensure only active

        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.firstName.toLowerCase().includes(lowerQuery) ||
                p.lastName.toLowerCase().includes(lowerQuery)
            );
        }

        // Sorting Logic
        return result.sort((a, b) => {
            let aVal: any = 0;
            let bVal: any = 0;

            if (sortConfig.key === 'name') {
                aVal = a.firstName + ' ' + a.lastName;
                bVal = b.firstName + ' ' + b.lastName;
            } else if (sortConfig.key === 'team') {
                const tA = teams.find(t => t.id === a.teamId);
                const tB = teams.find(t => t.id === b.teamId);
                aVal = tA ? tA.city + ' ' + tA.name : 'ZZ Free Agent'; // Free Agent last
                bVal = tB ? tB.city + ' ' + tB.name : 'ZZ Free Agent';
            } else if (sortConfig.key === 'pos') {
                aVal = a.position;
                bVal = b.position;
            } else if (sortConfig.key === 'age') {
                aVal = a.age;
                bVal = b.age;
            } else if (sortConfig.key === 'ovr') {
                aVal = calculateOverall(a);
                bVal = calculateOverall(b);
            } else {
                // Determine if key is a direct attribute or nested
                // All 14 new stats are in player.attributes
                aVal = (a.attributes as any)[sortConfig.key] || 0;
                bVal = (b.attributes as any)[sortConfig.key] || 0;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [players, searchQuery, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        // Toggle direction if clicking same key
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader = ({ label, sortKey, title, align = 'center' }: { label: string, sortKey: string, title?: string, align?: 'left' | 'center' | 'right' }) => (
        <th
            style={{
                padding: '12px 5px',
                textAlign: align,
                color: sortConfig.key === sortKey ? 'var(--team-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: sortKey.length > 3 ? '0.9rem' : '0.75rem',
                borderRight: sortKey === 'ovr' ? '1px solid var(--border-color)' : 'none'
            }}
            title={title || label}
            onClick={() => requestSort(sortKey)}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: '2px' }}>
                {label}
                {sortConfig.key === sortKey && <span style={{ fontSize: '0.6rem' }}>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>}
            </div>
        </th>
    );

    // Pagination for performance (Render top 50, load more if needed)
    const displayPlayers = filteredPlayers.slice(0, 100);

    const getTeamName = (teamId: string | null) => {
        if (!teamId) return 'Free Agent';
        const t = teams.find(team => team.id === teamId);
        return t ? `${t.city} ${t.name}` : 'Unknown';
    };

    const getArchetypeColor = (value: number) => {
        if (value >= 85) return 'var(--accent)'; // Specialist
        if (value >= 75) return 'var(--primary)'; // Good
        if (value >= 60) return 'var(--text-dim)'; // Average
        return 'var(--text-muted)'; // Bad
    };

    return (
        <div style={{ padding: '0 0 20px 0' }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '20px', position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-main)', padding: '10px 0', display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', flex: 1 }}>
                    <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontSize: '1rem',
                            flex: 1,
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Players Table */}
            <div className="modern-card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border-color)' }}>
                        <tr>
                            <SortableHeader label="Player" sortKey="name" align="left" />
                            <SortableHeader label="Team" sortKey="team" align="left" />
                            <SortableHeader label="Pos" sortKey="pos" />
                            <SortableHeader label="Age" sortKey="age" />
                            <SortableHeader label="Stars" sortKey="ovr" title="Rating" />

                            {/* EXPANDED MSSI ATTRIBUTES */}
                            <SortableHeader label="FIN" sortKey="finishing" title="Finishing" />
                            <SortableHeader label="MID" sortKey="midRange" title="Mid Range" />
                            <SortableHeader label="3PT" sortKey="threePointShot" title="3-Point" />
                            <SortableHeader label="FT" sortKey="freeThrow" title="Free Throw" />
                            <SortableHeader label="PLY" sortKey="playmaking" title="Playmaking" />
                            <SortableHeader label="HND" sortKey="ballHandling" title="Ball Handling" />
                            <SortableHeader label="IQ" sortKey="basketballIQ" title="Basketball IQ" />
                            <SortableHeader label="IDEF" sortKey="interiorDefense" title="Interior Defense" />
                            <SortableHeader label="PDEF" sortKey="perimeterDefense" title="Perimeter Defense" />
                            <SortableHeader label="STL" sortKey="stealing" title="Stealing" />
                            <SortableHeader label="BLK" sortKey="blocking" title="Blocking" />
                            <SortableHeader label="ORB" sortKey="offensiveRebound" title="Offensive Rebound" />
                            <SortableHeader label="DRB" sortKey="defensiveRebound" title="Defensive Rebound" />
                            <SortableHeader label="ATH" sortKey="athleticism" title="Athleticism" />
                        </tr>
                    </thead>
                    <tbody>
                        {displayPlayers.map((player, index) => {
                            const attr = player.attributes;
                            const team = teams.find(t => t.id === player.teamId);
                            return (
                                <tr
                                    key={player.id}
                                    style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        background: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)'}
                                >
                                    <td 
                                        onClick={() => onSelectPlayer(player.id)}
                                        style={{ padding: '12px 10px', fontWeight: 'bold', color: 'var(--text-main)', whiteSpace: 'nowrap' }}
                                    >
                                        {player.firstName} {player.lastName}
                                    </td>
                                    <td 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (player.teamId) onSelectTeam(player.teamId);
                                        }}
                                        style={{ padding: '12px 10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
                                    >
                                        {getTeamName(player.teamId)}
                                    </td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        {player.position}
                                    </td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        {player.age}
                                    </td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <StarRating stars={calculateStars(calculateOverall(player), 75)} size={10} />
                                        </div>
                                    </td>

                                    {/* 14 MSSI Stats */}
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.finishing), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.finishing)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.midRange), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.midRange)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.threePointShot), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.threePointShot)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.freeThrow), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.freeThrow)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.playmaking), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.playmaking)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.ballHandling), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.ballHandling)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.basketballIQ), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.basketballIQ)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.interiorDefense), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.interiorDefense)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.perimeterDefense), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.perimeterDefense)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.stealing), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.stealing)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.blocking), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.blocking)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.offensiveRebound), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.offensiveRebound)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.defensiveRebound), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.defensiveRebound)}</td>
                                    <td style={{ padding: '12px 5px', textAlign: 'center', color: getArchetypeColor(attr.athleticism), fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(attr.athleticism)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredPlayers.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No players found.
                    </div>
                )}

                {filteredPlayers.length > 100 && (
                    <div style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
                        Showing top 100 of {filteredPlayers.length} matches. Use search to find specific players.
                    </div>
                )}
            </div>
        </div>
    );
};
