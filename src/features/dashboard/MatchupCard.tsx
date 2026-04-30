import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { motion } from 'framer-motion';

export const MatchupCard: React.FC = () => {
    const { games, userTeamId, teams, seasonPhase, seasonGamesPlayed, dailyMatchups, startLiveGameFn, playoffs } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    if (!userTeam) return null;

    let playoffOpponentId: string | null = null;
    let seriesStatus = "";
    let isPlayoffs = seasonPhase.startsWith('playoffs');

    if (isPlayoffs) {
        const activeSeries = playoffs.find(s => !s.winnerId && (s.homeTeamId === userTeamId || s.awayTeamId === userTeamId));
        if (activeSeries) {
            playoffOpponentId = activeSeries.homeTeamId === userTeamId ? activeSeries.awayTeamId : activeSeries.homeTeamId;
            const userWins = activeSeries.homeTeamId === userTeamId ? activeSeries.homeWins : activeSeries.awayWins;
            const oppWins = activeSeries.homeTeamId === userTeamId ? activeSeries.awayWins : activeSeries.homeWins;

            if (userWins === 0 && oppWins === 0) seriesStatus = "Game 1";
            else if (userWins > oppWins) seriesStatus = `${userTeam.abbreviation} leads ${userWins}-${oppWins}`;
            else if (oppWins > userWins) seriesStatus = `${teams.find(t => t.id === playoffOpponentId)?.abbreviation} leads ${oppWins}-${userWins}`;
            else seriesStatus = `Series Tied ${userWins}-${oppWins}`;
        }
    }

    const todayMatchup = isPlayoffs
        ? (playoffOpponentId ? { homeId: userTeamId, awayId: playoffOpponentId } : null)
        : dailyMatchups.find(m => m.homeId === userTeamId || m.awayId === userTeamId);

    if (!todayMatchup) return (
        <DashboardCard title="Next Up" variant="primary" icon={<Calendar size={14} />}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Calendar size={32} style={{ marginBottom: '12px', opacity: 0.1 }} />
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {isPlayoffs ? "Eliminated / No Games" : "No Game Scheduled"}
                </div>
            </div>
        </DashboardCard>
    );

    const opponentId = playoffOpponentId || (todayMatchup.homeId === userTeamId ? todayMatchup.awayId : todayMatchup.homeId);
    const opponent = teams.find(t => t.id === opponentId);

    const opponentGames = games.filter(g => g.homeTeamId === opponentId || g.awayTeamId === opponentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const last4Results = opponentGames.slice(0, 4).map(g => {
        const isHome = g.homeTeamId === opponentId;
        const won = isHome ? (g.homeScore > g.awayScore) : (g.awayScore > g.homeScore);
        return won ? 'W' : 'L';
    }).reverse();

    const primaryColor = userTeam.colors?.primary || 'var(--primary)';

    return (
        <DashboardCard
            title="Next Up" 
            variant="primary"
            noPadding
            action={
                <span style={{ opacity: 0.5, fontSize: '0.6rem', fontWeight: 700 }}>{seasonGamesPlayed + 1}/82</span>
            }
            icon={<Calendar size={14} />}
        >
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {seriesStatus || "Next Opponent"}
                </div>

                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {opponent?.city} {opponent?.name}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                    <span>{opponent?.wins || 0}-{opponent?.losses || 0}</span>
                    {last4Results.length > 0 && (
                        <>
                            <span style={{ opacity: 0.2 }}>|</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {last4Results.map((r, i) => (
                                    <span key={i} style={{ color: r === 'W' ? 'var(--accent)' : 'var(--danger)', fontSize: '0.7rem' }}>{r}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => todayMatchup && startLiveGameFn(userTeamId)}
                    className="btn-modern"
                    style={{ width: '100%', marginTop: '20px', background: primaryColor, color: '#fff', border: 'none', padding: '12px' }}
                >
                    PLAY GAME
                </motion.button>
            </div>
        </DashboardCard>
    );
};
