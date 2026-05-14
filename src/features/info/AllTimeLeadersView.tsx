import React, { useState } from 'react';
import { Trophy, BarChart3 } from 'lucide-react';
import { useGame, type CumulativeRecord } from '../../store/GameContext';
import { PageHeader } from '../ui/PageHeader';

interface AllTimeLeadersViewProps {
    onBack: () => void;
    mode: 'league' | 'team';
    teamId?: string;
}

export const AllTimeLeadersView: React.FC<AllTimeLeadersViewProps> = ({ onBack, mode, teamId }) => {
    const { leagueAllTimeLeaders, teamAllTimeLeaders, teams, userTeamId } = useGame();
    const [category, setCategory] = useState<string>('Points');

    const categories = ['Points', 'Rebounds', 'Assists', 'Steals', 'Blocks', 'Threes'];

    const getLeaders = (): CumulativeRecord[] => {
        if (mode === 'league') {
            return leagueAllTimeLeaders[category] || [];
        } else if (teamId && teamAllTimeLeaders[teamId]) {
            return teamAllTimeLeaders[teamId][category] || [];
        }
        return [];
    };

    const leaders = getLeaders();
    const team = teamId ? teams.find(t => t.id === teamId) : null;

    return (
        <div className="animate-fade" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: '500px', margin: '0 auto' }}>
            {/* Header */}
            <PageHeader
                title={mode === 'league' ? 'League All-Time Leaders' : `${team?.name} All-Time Leaders`}
                subtitle="Historical Career Totals"
                onBack={onBack}
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            />

            {/* Category Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            background: category === cat ? 'var(--text-main)' : 'var(--bg-card)',
                            color: category === cat ? '#fff' : 'var(--text-main)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Leaderboard Table */}
            <div className="premium-table-wrapper">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th className="sticky-col">RANK</th>
                            <th>PLAYER</th>
                            <th>TOTAL {category.toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <BarChart3 size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                                    <p style={{ fontSize: '0.85rem' }}>No data recorded for this category yet.</p>
                                </td>
                            </tr>
                        ) : (
                            leaders.map((rec, idx) => (
                                <tr key={idx} className="list-row-hover">
                                    <td className="sticky-col" style={{ fontWeight: 900, color: idx < 3 ? 'var(--warning)' : 'var(--text-muted)', fontSize: '1rem', background: 'var(--bg-card)' }}>
                                        {idx + 1}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rec.playerName}</div>
                                        {mode === 'league' && rec.teamId && (
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                {teams.find(t => t.id === rec.teamId)?.abbreviation}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                        {rec.total.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
