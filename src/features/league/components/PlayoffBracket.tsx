import React from 'react';
import { useGame, type PlayoffSeries } from '../../../store/GameContext';
import { ChevronRight } from 'lucide-react';

interface PlayoffBracketProps {
    seriesList: PlayoffSeries[];
    currentRound: number;
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ seriesList, currentRound }) => {
    const { teams, userTeamId } = useGame();

    // Group by Round
    const round1 = seriesList.filter(s => s.round === 1);
    const round2 = seriesList.filter(s => s.round === 2);
    const round3 = seriesList.filter(s => s.round === 3); // Conf Finals
    const round4 = seriesList.filter(s => s.round === 4); // Finals

    // Helper to get Short Name
    const getTeamAbbr = (id: string) => {
        const t = teams.find(team => team.id === id);
        return t ? t.abbreviation : 'TBD';
    };

    const getTeamColor = (id: string) => {
        const t = teams.find(team => team.id === id);
        return t?.colors?.primary || '#ccc';
    };

    const isUserTeam = (id: string) => id === userTeamId;

    const MatchupNode = ({ series }: { series: PlayoffSeries }) => {
        const homeIsUser = isUserTeam(series.homeTeamId);
        const awayIsUser = isUserTeam(series.awayTeamId);
        const isUserSeries = homeIsUser || awayIsUser;

        const homeWinner = series.winnerId === series.homeTeamId;
        const awayWinner = series.winnerId === series.awayTeamId;

        return (
            <div style={{
                marginBottom: '12px',
                background: isUserSeries ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface)',
                border: isUserSeries ? '1px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.8rem',
                minWidth: '100px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: awayWinner ? 0.5 : 1, fontWeight: homeWinner ? 'bold' : 'normal' }}>
                    <span style={{ color: homeIsUser ? 'var(--primary)' : 'var(--text)' }}>
                        {getTeamAbbr(series.homeTeamId)}
                    </span>
                    <span>{series.homeWins}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', opacity: homeWinner ? 0.5 : 1, fontWeight: awayWinner ? 'bold' : 'normal' }}>
                    <span style={{ color: awayIsUser ? 'var(--primary)' : 'var(--text)' }}>
                        {getTeamAbbr(series.awayTeamId)}
                    </span>
                    <span>{series.awayWins}</span>
                </div>
            </div>
        );
    };

    // We only show the User's Conference full tree for mobile optimization?
    // Or we show a vertically stacked set of rounds.
    // Let's do a scrollable horizontal flex for rounds.

    return (
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', paddingLeft: '4px' }}>Bracket</h3>
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '20px',
                paddingBottom: '20px',
                scrollbarWidth: 'none'
            }}>
                {/* Round 1 */}
                <div style={{ minWidth: '140px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>First Round</div>
                    {round1.map(s => <MatchupNode key={s.id} series={s} />)}
                </div>
                {/* Round 2 */}
                <div style={{ minWidth: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Semis</div>
                    {round2.length > 0 ? round2.map(s => <MatchupNode key={s.id} series={s} />) : <div style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>Waiting...</div>}
                </div>
                {/* Round 3 */}
                <div style={{ minWidth: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Conf. Finals</div>
                    {round3.length > 0 ? round3.map(s => <MatchupNode key={s.id} series={s} />) : <div style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>Waiting...</div>}
                </div>
                {/* Round 4 */}
                <div style={{ minWidth: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Finals</div>
                    {round4.length > 0 ? round4.map(s => <MatchupNode key={s.id} series={s} />) : <div style={{ color: '#666', fontSize: '0.8rem', fontStyle: 'italic' }}>Waiting...</div>}
                </div>
            </div>
        </div>
    );
};
