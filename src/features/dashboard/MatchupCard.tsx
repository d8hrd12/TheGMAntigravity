import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { motion } from 'framer-motion';

interface MatchupCardProps {
}

export const MatchupCard: React.FC<MatchupCardProps> = () => {
    const { games, date, userTeamId, teams, seasonPhase, seasonGamesPlayed, dailyMatchups, startLiveGameFn, playoffs } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    if (!userTeam) return null;

    // CHECK FOR PLAYOFF SERIES
    let playoffOpponentId: string | null = null;
    let seriesStatus = "";
    let isPlayoffs = seasonPhase.startsWith('playoffs');

    if (isPlayoffs) {
        // Find active series
        const activeSeries = playoffs.find(s => !s.winnerId && (s.homeTeamId === userTeamId || s.awayTeamId === userTeamId));
        if (activeSeries) {
            playoffOpponentId = activeSeries.homeTeamId === userTeamId ? activeSeries.awayTeamId : activeSeries.homeTeamId;
            const userWins = activeSeries.homeTeamId === userTeamId ? activeSeries.homeWins : activeSeries.awayWins;
            const oppWins = activeSeries.homeTeamId === userTeamId ? activeSeries.awayWins : activeSeries.homeWins;

            // Format Series Status
            if (userWins === 0 && oppWins === 0) seriesStatus = "Game 1";
            else if (userWins > oppWins) seriesStatus = `${userTeam.abbreviation} leads ${userWins}-${oppWins}`;
            else if (oppWins > userWins) seriesStatus = `${teams.find(t => t.id === playoffOpponentId)?.abbreviation} leads ${oppWins}-${userWins}`;
            else seriesStatus = `Series Tied ${userWins}-${oppWins}`;
        }
    }

    // source from scheduled matchups if no live game object created yet
    // PRIORITIZE PLAYOFFS
    const todayMatchup = isPlayoffs
        ? (playoffOpponentId ? { homeId: userTeamId, awayId: playoffOpponentId } : null)
        : dailyMatchups.find(m => m.homeId === userTeamId || m.awayId === userTeamId);

    if (!todayMatchup) return (
        <DashboardCard variant="white" title="Next Up" icon={<Calendar size={14} />}>
            <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.3 }}>
                <Calendar size={32} style={{ marginBottom: '12px', opacity: 0.2 }} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1A1A1A' }}>
                    {isPlayoffs ? "Eliminated / No Games" : "No Game Scheduled"}
                </div>
            </div>
        </DashboardCard>
    );

    const opponentId = playoffOpponentId || (todayMatchup.homeId === userTeamId ? todayMatchup.awayId : todayMatchup.homeId);
    const opponent = teams.find(t => t.id === opponentId);

    // Calculate Opponent Last 4 Results
    const opponentGames = games.filter(g => g.homeTeamId === opponentId || g.awayTeamId === opponentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const last4Results = opponentGames.slice(0, 4).map(g => {
        const isHome = g.homeTeamId === opponentId;
        const won = isHome ? (g.homeScore > g.awayScore) : (g.awayScore > g.homeScore);
        return won ? 'W' : 'L';
    }).reverse();

    const primaryColor = userTeam.colors?.primary || '#3b82f6';
    const secondaryColor = userTeam.colors?.secondary || '#eab308';

    return (
        <DashboardCard
            variant="white"
            noPadding
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Next Up</span>
                    <span style={{ opacity: 0.3, fontSize: '0.65rem' }}>{seasonGamesPlayed + 1}/82</span>
                </div>
            }
            icon={<Calendar size={14} />}
            style={{ position: 'relative', minHeight: 'auto' }}
        >
            {/* Massive 200% Watermark Centered Behind Name */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200%',
                height: '200%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.05,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 0
            }}>
                <img
                    src={opponent?.logo || `/logos/${opponent?.name.toLowerCase().replace(/\s+/g, '_')}.png`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </div>

            <div style={{
                padding: '20px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    color: 'rgba(0,0,0,0.5)',
                    marginBottom: '4px'
                }}>
                    {seriesStatus || "Next Opponent"}
                </div>

                <h2 style={{
                    margin: '0 0 4px 0',
                    fontSize: '2rem',
                    fontWeight: 950,
                    color: '#1A1A1A',
                    letterSpacing: '-0.8px',
                    lineHeight: 1.05
                }}>
                    {opponent?.city} {opponent?.name}
                </h2>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'rgba(0,0,0,0.4)'
                }}>
                    <span style={{ color: '#1A1A1A' }}>{opponent?.wins || 0}<span style={{ opacity: 0.3, margin: '0 2px' }}>-</span>{opponent?.losses || 0}</span>
                    {last4Results.length > 0 && (
                        <>
                            <span style={{ opacity: 0.2 }}>|</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {last4Results.map((r, i) => (
                                    <span key={i} style={{
                                        color: r === 'W' ? '#059669' : '#dc2626',
                                        fontSize: '0.75rem',
                                        fontWeight: 900
                                    }}>{r}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 12px 25px ${primaryColor}66` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        if (todayMatchup) {
                            startLiveGameFn(userTeamId);
                        }
                    }}
                    style={{
                        width: '100%',
                        marginTop: '24px',
                        padding: '14px',
                        borderRadius: '24px',
                        border: 'none',
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: 950,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        boxShadow: `0 10px 20px ${primaryColor}44`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        transition: 'box-shadow 0.3s'
                    }}
                >
                    <Play size={22} fill="white" />
                    PLAY GAME
                </motion.button>
            </div>
        </DashboardCard>
    );
};
