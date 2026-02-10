import React, { useRef, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { ensureColorVibrancy } from '../../utils/colorUtils';

export const RecentGames: React.FC<{ onSelectGame: (game: any) => void }> = ({ onSelectGame }) => {
    const { games, teams, userTeamId, seasonPhase } = useGame();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to end on mount/update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [games.length]);

    if (seasonPhase !== 'regular_season') return null;

    const userGames = games.filter(g => g.homeTeamId === userTeamId || g.awayTeamId === userTeamId);

    if (userGames.length === 0) return null;

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Games</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Full Schedule
                </div>
            </div>

            <div
                ref={scrollRef}
                className="hide-scrollbar"
                style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                    scrollBehavior: 'smooth'
                }}
            >
                {userGames.map(game => {
                    const isHome = game.homeTeamId === userTeamId;
                    const opponentId = isHome ? game.awayTeamId : game.homeTeamId;
                    const opponent = teams.find(t => t.id === opponentId);
                    const home = teams.find(t => t.id === game.homeTeamId);
                    const away = teams.find(t => t.id === game.awayTeamId);
                    const isWin = game.winnerId === userTeamId;

                    return (
                        <div
                            key={game.id}
                            onClick={() => onSelectGame(game)}
                            style={{
                                minWidth: '120px',
                                background: 'var(--surface-glass)',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            {/* Win/Loss Indicator */}
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: isWin ? '#2ecc71' : '#e74c3c'
                            }} />

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                {isHome ? 'vs' : '@'} {opponent?.abbreviation}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, opacity: game.winnerId === game.awayTeamId ? 1 : 0.7 }}>
                                    <span>{away?.abbreviation}</span>
                                    <span>{game.awayScore}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, opacity: game.winnerId === game.homeTeamId ? 1 : 0.7 }}>
                                    <span>{home?.abbreviation}</span>
                                    <span>{game.homeScore}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
