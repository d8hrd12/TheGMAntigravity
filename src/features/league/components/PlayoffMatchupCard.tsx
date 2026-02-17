import React from 'react';
import { useGame, type PlayoffSeries } from '../../../store/GameContext';
import { ChevronRight } from 'lucide-react';

interface PlayoffMatchupCardProps {
    series: PlayoffSeries;
}

export const PlayoffMatchupCard: React.FC<PlayoffMatchupCardProps> = ({ series }) => {
    const { teams, userTeamId } = useGame();

    const home = teams.find(t => t.id === series.homeTeamId);
    const away = teams.find(t => t.id === series.awayTeamId);

    if (!home || !away) return null;

    const isUserSeries = (series.homeTeamId === userTeamId || series.awayTeamId === userTeamId);
    const isFinished = !!series.winnerId;

    const TeamRow = ({ team, wins, isWinner, isUser }: { team: any, wins: number, isWinner: boolean, isUser: boolean }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
            opacity: series.winnerId && !isWinner ? 0.6 : 1
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                    fontWeight: isWinner ? 'bold' : 'normal',
                    color: isUser ? 'var(--primary)' : 'var(--text)',
                    fontSize: '1rem'
                }}>
                    {team.city} {team.name}
                </span>
                {isWinner && <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>✓</span>}
            </div>
            <span style={{
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: isWinner ? 'var(--text)' : 'var(--text-secondary)'
            }}>
                {wins}
            </span>
        </div>
    );

    return (
        <div style={{
            background: isUserSeries ? 'rgba(var(--primary-rgb), 0.05)' : 'var(--surface)',
            border: isUserSeries ? '1px solid rgba(var(--primary-rgb), 0.3)' : '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '10px'
        }}>
            {/* Conference / Seed Info (Optional, skipping for clean look or adding small tag) */}
            <div style={{ marginBottom: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                {series.conference} Conference
            </div>

            <TeamRow
                team={home}
                wins={series.homeWins}
                isWinner={series.winnerId === home.id}
                isUser={home.id === userTeamId}
            />
            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0', opacity: 0.5 }} />
            <TeamRow
                team={away}
                wins={series.awayWins}
                isWinner={series.winnerId === away.id}
                isUser={away.id === userTeamId}
            />

            {/* Status Text for unfinished */}
            {!isFinished && (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                    {series.homeWins === series.awayWins ? 'Series Tied' :
                        (series.homeWins > series.awayWins ? `${home.abbreviation} leads ${series.homeWins}-${series.awayWins}` : `${away.abbreviation} leads ${series.awayWins}-${series.homeWins}`)}
                </div>
            )}
        </div>
    );
};
