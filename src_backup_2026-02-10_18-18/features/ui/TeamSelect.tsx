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
    const filterAndSort = (conference: 'West' | 'East') => {
        return teams
            .filter(t => t.conference === conference && t.id !== excludeTeamId)
            .sort((a, b) => a.city.localeCompare(b.city));
    };

    const westTeams = filterAndSort('West');
    const eastTeams = filterAndSort('East');

    return (
        <div style={{ position: 'relative', display: 'inline-block', ...style }}>
            <select
                value={selectedTeamId}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    appearance: 'none',
                    padding: '10px 35px 10px 15px',
                    fontSize: '0.95rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    outline: 'none',
                    width: '100%',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    ...style // Allow overrides but preserve base style
                }}
            >
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
            </select>
            {/* Custom Arrow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '12px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-secondary)'
            }}>
                ▼
            </div>
        </div>
    );
};
