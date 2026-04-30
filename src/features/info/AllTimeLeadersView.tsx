import React, { useState } from 'react';
import { ChevronLeft, Trophy, Users, BarChart3, Star } from 'lucide-react';
import { useGame, type CumulativeRecord } from '../../store/GameContext';

interface AllTimeLeadersViewProps {
    onBack: () => void;
    mode: 'league' | 'team';
    teamId?: string;
}

export const AllTimeLeadersView: React.FC<AllTimeLeadersViewProps> = ({ onBack, mode, teamId }) => {
    const { leagueAllTimeLeaders, teamAllTimeLeaders, teams } = useGame();
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
        <div className="animate-fade" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={onBack} className="btn-modern" style={{ padding: '8px' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                            {mode === 'league' ? 'NBA All-Time Leaders' : `${team?.name} All-Time Leaders`}
                        </h1>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Career cumulative totals (Top 50)
                        </p>
                    </div>
                </div>
                <Trophy size={28} color="var(--warning)" />
            </div>

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
                            background: category === cat ? 'var(--primary)' : 'var(--bg-card)',
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
            <div className="modern-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0 }}>
                            <tr>
                                <th style={{ padding: '12px 20px', textAlign: 'left', width: '60px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>RANK</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.7rem' }}>PLAYER</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.7rem' }}>TOTAL {category.toUpperCase()}</th>
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
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }} className="list-row-hover">
                                        <td style={{ padding: '12px 20px', fontWeight: 900, color: idx < 3 ? 'var(--warning)' : 'var(--text-muted)', fontSize: '1rem' }}>
                                            {idx + 1}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rec.playerName}</div>
                                            {mode === 'league' && rec.teamId && (
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                    {teams.find(t => t.id === rec.teamId)?.abbreviation}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                                            {rec.total.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
