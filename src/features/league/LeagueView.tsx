
import React, { useState } from 'react';
import { StandingsView } from './StandingsView';
import { LeagueLeaders } from '../stats/LeagueLeaders';
import { LeagueTeamStats } from './LeagueTeamStats';
import { LeaguePlayersFullView } from './LeaguePlayersFullView';
import { BackButton } from '../ui/BackButton';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import { useGame } from '../../store/GameContext';

import { AwardsHistoryView } from '../awards/AwardsHistoryView';
import type { SeasonAwards } from '../../models/Awards';

interface LeagueViewProps {
    teams: Team[];
    players: Player[];
    awardsHistory: SeasonAwards[];
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
}

import { PageHeader } from '../ui/PageHeader';

export const LeagueView: React.FC<LeagueViewProps> = ({ teams, players, awardsHistory, onBack, onSelectPlayer, onSelectTeam }) => {
    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <PageHeader
                title="League Standings"
                onBack={onBack}
            />

            <StandingsTableOnly teams={teams} onSelectTeam={onSelectTeam} />
        </div >
    );
};

// ... StandingsTableOnly code ...
const StandingsTableOnly = ({ teams, onSelectTeam }: { teams: Team[], onSelectTeam: (id: string) => void }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'pct', direction: 'desc' });

    // Sort teams
    const sortTeams = (teamsToSort: Team[]) => {
        return [...teamsToSort].sort((a, b) => {
            const getVal = (t: Team, key: string) => {
                const total = t.wins + t.losses;
                const pct = total > 0 ? t.wins / total : 0;
                if (key === 'name') return t.city;
                if (key === 'wins') return t.wins;
                if (key === 'losses') return t.losses;
                if (key === 'pct') return pct;
                return 0;
            };

            const aVal = getVal(a, sortConfig.key);
            const bVal = getVal(b, sortConfig.key);

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const westTeams = sortTeams(teams.filter(t => t.conference === 'West'));
    const eastTeams = sortTeams(teams.filter(t => t.conference === 'East'));

    const HeaderCell = ({ label, sortKey, align = 'left' }: { label: string, sortKey: string, align?: 'left' | 'right' | 'center' }) => (
        <th
            style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none', textAlign: align, whiteSpace: 'nowrap', color: '#aaa' }}
            onClick={() => requestSort(sortKey)}
        >
            {label} {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    const StandingsTable = ({ title, teams }: { title: string, teams: Team[] }) => (
        <div style={{ marginBottom: '20px', background: 'var(--surface-glass)', borderRadius: '12px', padding: '10px', overflowX: 'auto' }}>
            <h3 style={{ borderBottom: `2px solid ${title.includes('West') ? '#e74c3c' : '#3498db'}`, paddingBottom: '5px', display: 'inline-block', marginTop: 0, fontSize: '1.1rem' }}>
                {title}
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px', fontSize: '0.85rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <th style={{ padding: '6px', color: '#aaa', textAlign: 'center' }}>#</th>
                        <HeaderCell label="Team" sortKey="name" align="center" />
                        <HeaderCell label="W" sortKey="wins" align="center" />
                        <HeaderCell label="L" sortKey="losses" align="center" />
                        <HeaderCell label="Pct" sortKey="pct" align="center" />
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <tr key={team.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '6px', color: '#666' }}>{index + 1}</td>
                            <td
                                onClick={() => onSelectTeam(team.id)}
                                style={{ padding: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {team.logo ? (
                                    <img
                                        src={team.logo}
                                        alt={team.abbreviation}
                                        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <span style={{ color: team.colors?.primary || '#fff', fontSize: '1.2rem', lineHeight: 0 }}>●</span>
                                )}
                                <span style={{ color: 'var(--text-main)' }}>{team.city}</span>
                            </td>
                            <td style={{ padding: '6px', color: 'var(--text-muted)', textAlign: 'center' }}>{team.wins}</td>
                            <td style={{ padding: '6px', color: 'var(--text-muted)', textAlign: 'center' }}>{team.losses}</td>
                            <td style={{ padding: '6px', color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'monospace' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '40px' }}>
            <StandingsTable title="Western Conference" teams={westTeams} />
            <StandingsTable title="Eastern Conference" teams={eastTeams} />
        </div>
    );
};
