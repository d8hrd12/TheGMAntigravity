import React, { useState } from 'react';
import type { SeasonAwards, AwardWinner } from '../../models/Awards';

interface AwardsHistoryViewProps {
    awardsHistory: SeasonAwards[];
}

export const AwardsHistoryView: React.FC<AwardsHistoryViewProps> = ({ awardsHistory }) => {
    // Sort history by year descending
    const sortedHistory = [...awardsHistory].sort((a, b) => b.year - a.year);

    return (
        <div style={{ paddingBottom: '20px' }}>
            {sortedHistory.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No history available yet. Complete a season to see awards.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {sortedHistory.map(season => (
                        <SeasonCard key={season.year} season={season} />
                    ))}
                </div>
            )}
        </div>
    );
};

const SeasonCard = ({ season }: { season: SeasonAwards }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="modern-card" style={{ padding: '15px', borderRadius: '12px' }}>
            <div
                onClick={() => setExpanded(!expanded)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
                <div>
                    <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>{season.year} Season</h3>
                    {season.champion && (
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>🏆</span>
                            <span style={{ fontWeight: 'bold', color: '#fff' }}>{season.champion.teamName}</span>
                        </div>
                    )}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                    {expanded ? '▲' : '▼'}
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <AwardRow title="Finals MVP" winner={season.finalsMvp} icon="🌟" />
                        <AwardRow title="League MVP" winner={season.mvp} icon="👑" />
                        <AwardRow title="Rookie of Year" winner={season.roty} icon="👶" />
                        <AwardRow title="Defensive Player" winner={season.dpoy} icon="🛡️" />
                        <AwardRow title="Most Improved" winner={season.mip} icon="📈" />
                    </div>
                </div>
            )}
        </div>
    );
};

const AwardRow = ({ title, winner, icon }: { title: string, winner?: AwardWinner, icon: string }) => {
    if (!winner || winner.playerId === 'err') return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <span>{icon}</span>
                <span>{title}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#fff' }}>{winner.playerName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{winner.teamName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{winner.statsSummary}</div>
            </div>
        </div>
    );
};
