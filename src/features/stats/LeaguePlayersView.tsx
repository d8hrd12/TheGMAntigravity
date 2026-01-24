import React, { useState } from 'react';
import type { Player, PlayerAttributes } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';

interface LeaguePlayersViewProps {
    players: Player[];
    teams: Team[];
    onBack: () => void;
}

const ATTRIBUTE_KEYS: (keyof PlayerAttributes)[] = [
    'finishing', 'midRange', 'threePointShot',
    'interiorDefense', 'perimeterDefense', 'stealing', 'blocking', 'defensiveRebound',
    'playmaking', 'ballHandling', 'basketballIQ'
];

export const LeaguePlayersView: React.FC<LeaguePlayersViewProps> = ({ players, teams, onBack }) => {
    const [selectedTeamId, setSelectedTeamId] = useState<string>('all');

    const filteredPlayers = selectedTeamId === 'all'
        ? players
        : players.filter(p => p.teamId === selectedTeamId);

    // Sorting: by OVR descending by default
    const sortedPlayers = [...filteredPlayers].sort((a, b) => {
        const ovrA = calculateOverall(a);
        const ovrB = calculateOverall(b);
        return ovrB - ovrA;
    });

    const getAttributeDiff = (player: Player, attr: keyof PlayerAttributes) => {
        if (!player.previousAttributes) return 0;
        return player.attributes[attr] - player.previousAttributes[attr];
    };

    const renderDiff = (diff: number) => {
        if (diff > 0) return <span style={{ color: 'green', fontSize: '0.8em', marginLeft: '4px' }}>+{diff}</span>;
        if (diff < 0) return <span style={{ color: 'red', fontSize: '0.8em', marginLeft: '4px' }}>{diff}</span>;
        return null;
    };

    return (
        <div className="glass-panel" style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>League Player Stats</h2>
                <button onClick={onBack} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Back to Dashboard
                </button>
            </header>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold', color: 'var(--text)' }}>Filter by Team:</label>
                <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                >
                    <option value="all">All Teams</option>
                    {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.city} {t.name}</option>
                    ))}
                    <option value="free_agent">Free Agents</option>
                </select>
                <span style={{ marginLeft: '20px', color: 'var(--text-secondary)' }}>Showing {sortedPlayers.length} players</span>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead style={{ background: 'var(--surface-glass)' }}>
                        <tr>
                            <th style={{ padding: '10px', textAlign: 'left', position: 'sticky', left: 0, background: 'var(--surface)', color: 'var(--text-secondary)' }}>Name</th>
                            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-secondary)' }}>Team</th>
                            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-secondary)' }}>Pos</th>
                            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-secondary)' }}>Age</th>
                            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-secondary)' }}>OVR</th>
                            {ATTRIBUTE_KEYS.map(key => (
                                <th key={key} style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{key.substring(0, 3).toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.slice(0, 100).map(p => {
                            const team = teams.find(t => t.id === p.teamId);
                            const ovr = calculateOverall(p);
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px', fontWeight: 'bold', position: 'sticky', left: 0, background: 'var(--surface-glass)', color: 'var(--text)' }}>{p.firstName} {p.lastName}</td>
                                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{team ? team.abbreviation : 'FA'}</td>
                                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{p.position}</td>
                                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{p.age}</td>
                                    <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text)' }}>{ovr}</td>
                                    {ATTRIBUTE_KEYS.map(key => (
                                        <td key={key} style={{ padding: '10px', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
                                            {p.attributes[key]}
                                            {renderDiff(getAttributeDiff(p, key))}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {sortedPlayers.length > 100 && <div style={{ padding: '10px', textAlign: 'center', fontStyle: 'italic', color: '#888' }}>... and {sortedPlayers.length - 100} more</div>}
            </div>
        </div>
    );
};
