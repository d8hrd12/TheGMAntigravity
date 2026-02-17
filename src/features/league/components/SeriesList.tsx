import React from 'react';
import { useGame, type PlayoffSeries } from '../../../store/GameContext';

interface SeriesListProps {
    series: PlayoffSeries[];
    title: string;
}

export const SeriesList: React.FC<SeriesListProps> = ({ series, title }) => {
    const { teams, userTeamId } = useGame();

    if (series.length === 0) return null;

    const getTeam = (id: string) => teams.find(t => t.id === id);

    return (
        <div style={{ marginBottom: '24px' }}>
            <h4 style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '12px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '4px'
            }}>
                {title}
            </h4>

            <div style={{ display: 'grid', gap: '12px' }}>
                {series.map(s => {
                    const home = getTeam(s.homeTeamId);
                    const away = getTeam(s.awayTeamId);
                    if (!home || !away) return null;

                    const isElimination = (s.homeWins === 3 || s.awayWins === 3);
                    const isFinished = !!s.winnerId;

                    return (
                        <div key={s.id} style={{
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            padding: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            opacity: isFinished ? 0.7 : 1
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: s.winnerId === home.id ? 'bold' : 'normal' }}>
                                    <span style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {s.round === 1 ? (s.id.includes('1_1') || s.id.includes('1_4') ? (s.id.includes('1_1') ? '1' : '4') : (s.id.includes('1_2') ? '2' : '3')) : ''}
                                        {/* Rank logic is simplified here, ideally passed down */}
                                    </span>
                                    <span>{home.city} {home.name}</span>
                                    {s.winnerId === home.id && <span style={{ fontSize: '0.8em', color: 'var(--success)' }}>✓</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: s.winnerId === away.id ? 'bold' : 'normal' }}>
                                    <span style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {s.round === 1 ? (s.id.includes('1_1') || s.id.includes('1_4') ? (s.id.includes('1_1') ? '8' : '5') : (s.id.includes('1_2') ? '7' : '6')) : ''}
                                    </span>
                                    <span>{away.city} {away.name}</span>
                                    {s.winnerId === away.id && <span style={{ fontSize: '0.8em', color: 'var(--success)' }}>✓</span>}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {s.homeWins} - {s.awayWins}
                                </div>
                                {isElimination && !isFinished && (
                                    <div style={{ fontSize: '0.65rem', color: '#EF4444', fontWeight: 'bold', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                                        ELIMINATION
                                    </div>
                                )}
                                {isFinished && (
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        Final
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
