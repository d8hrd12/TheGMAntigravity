import React from 'react';
import type { Team } from '../../models/Team';
import { PageHeader } from '../ui/PageHeader';

interface StandingsViewProps {
    teams: Team[];
    onBack: () => void;
}

export const StandingsView: React.FC<StandingsViewProps> = ({ teams, onBack }) => {
    // Sort teams: Most Wins, then Least Losses
    const sortTeams = (teams: Team[]) => [...teams].sort((a, b) => {
        if (a.wins !== b.wins) return b.wins - a.wins;
        return a.losses - b.losses;
    });

    const westTeams = sortTeams(teams.filter(t => t.conference === 'West'));
    const eastTeams = sortTeams(teams.filter(t => t.conference === 'East'));

    const StandingsTable = ({ title, teams }: { title: string, teams: Team[] }) => (
        <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
            <h3 style={{ borderBottom: `2px solid ${title.includes('West') ? '#e74c3c' : '#3498db'}`, paddingBottom: '5px', display: 'inline-block' }}>
                {title}
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '8px', color: '#aaa' }}>Rank</th>
                        <th style={{ padding: '8px', color: '#aaa' }}>Team</th>
                        <th style={{ padding: '8px', color: '#aaa' }}>W</th>
                        <th style={{ padding: '8px', color: '#aaa' }}>L</th>
                        <th style={{ padding: '8px', color: '#aaa' }}>Pct</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <tr key={team.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '8px', color: '#ccc' }}>{index + 1}</td>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>
                                <span style={{ color: team.colors?.primary || '#fff', marginRight: '5px' }}>●</span>
                                <span style={{ color: '#fff' }}>{team.city} {team.name}</span>
                            </td>
                            <td style={{ padding: '8px', color: '#ccc' }}>{team.wins}</td>
                            <td style={{ padding: '8px', color: '#ccc' }}>{team.losses}</td>
                            <td style={{ padding: '8px', color: '#ccc' }}>
                                {(team.wins + team.losses) > 0
                                    ? (team.wins / (team.wins + team.losses)).toFixed(3)
                                    : '.000'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <PageHeader
                title="League Standings"
                onBack={onBack}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <StandingsTable title="Western Conference" teams={westTeams} />
                <StandingsTable title="Eastern Conference" teams={eastTeams} />
            </div>
        </div>
    );
};
