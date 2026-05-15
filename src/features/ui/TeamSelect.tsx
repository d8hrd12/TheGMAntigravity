import React from 'react';
import type { Team } from '../../models/Team';

interface TeamSelectProps {
    teams: Team[];
    selectedTeamId: string;
    onChange: (teamId: string) => void;
    excludeTeamId?: string;
    style?: React.CSSProperties;
}

export const TeamSelect: React.FC<TeamSelectProps> = ({ teams, selectedTeamId, onChange, excludeTeamId, style }) => {
    // Filter and Sort
    const filterAndSort = (conference: string) => {
        return teams
            .filter(t => t.conference === conference && t.id !== excludeTeamId)
            .sort((a, b) => a.city.localeCompare(b.city));
    };

    const hasEuro = teams.some(t => t.conference === 'EuroLeague' || t.conference === 'EuroCup');

    const westTeams = hasEuro ? [] : filterAndSort('West');
    const eastTeams = hasEuro ? [] : filterAndSort('East');
    const euroLeagueTeams = hasEuro ? filterAndSort('EuroLeague') : [];
    const euroCupTeams = hasEuro ? filterAndSort('EuroCup') : [];

    return (
        <div style={{ position: 'relative', display: 'inline-block', ...style }}>
            <select
                value={selectedTeamId}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    appearance: 'none',
                    padding: '10px 35px 10px 15px',
                    fontSize: '0.95rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: '#fff',
                    color: '#000',
                    cursor: 'pointer',
                    outline: 'none',
                    width: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    fontWeight: 600,
                    ...style // Allow overrides but preserve base style
                }}
            >
                {hasEuro ? (
                    <>
                        {euroLeagueTeams.length > 0 && (
                            <optgroup label="EuroLeague" style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                {euroLeagueTeams.map(t => (
                                    <option key={t.id} value={t.id} style={{ color: '#000', fontSize: '1rem' }}>
                                        {t.city} {t.name}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                        {euroCupTeams.length > 0 && (
                            <optgroup label="EuroCup" style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                {euroCupTeams.map(t => (
                                    <option key={t.id} value={t.id} style={{ color: '#000', fontSize: '1rem' }}>
                                        {t.city} {t.name}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </>
                ) : (
                    <>
                        <optgroup label="Western Conference" style={{ color: '#333' }}>
                            {westTeams.map(t => (
                                <option key={t.id} value={t.id} style={{ color: '#000' }}>
                                    {t.city} {t.name}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Eastern Conference" style={{ color: '#333' }}>
                            {eastTeams.map(t => (
                                <option key={t.id} value={t.id} style={{ color: '#000' }}>
                                    {t.city} {t.name}
                                </option>
                            ))}
                        </optgroup>
                    </>
                )}
            </select>
            {/* Custom Arrow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '15px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.7rem'
            }}>
                ▼
            </div>
        </div>
    );
};
