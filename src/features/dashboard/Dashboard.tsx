import React, { useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { SimControls } from './SimControls';
import { TeamMoraleDashboard } from './TeamMoraleDashboard';
import { EuroMatchCalendar } from './EuroMatchCalendar';
import { Users, BarChart3, TrendingUp, Zap, AlertCircle, ChevronRight } from 'lucide-react';
import { calculateOverall } from '../../utils/playerUtils';
import { StarRating } from '../../components/StarRating';
import { calculateTeamBaseline, calculateStars } from '../../utils/starUtils';
import { formatDate } from '../../utils/dateUtils';

interface DashboardProps {
    onSelectGame: (game: any) => void;
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
    onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    onSelectGame,
    onSelectPlayer,
    onSelectTeam,
    onNavigate
}) => {
    const {
        players,
        userTeamId,
        teams,
        games,
        contracts,
        date,
        seasonPhase,
        seasonGamesPlayed,
        leagueType,
    } = useGame();

    const userTeam = useMemo(() => teams.find(t => t.id === userTeamId), [teams, userTeamId]);

    const teamBaseline = useMemo(() => {
        const teamPlayers = players.filter(p => p.teamId === userTeamId);
        return calculateTeamBaseline(teamPlayers);
    }, [players, userTeamId]);

    // 1. STARTING 5 + STATS
    const startingFive = useMemo(() => {
        const teamPlayers = players.filter(p => p.teamId === userTeamId);
        const starters = [...teamPlayers]
            .sort((a, b) => (a.rotationIndex ?? 99) - (b.rotationIndex ?? 99))
            .slice(0, 5);
        
        return starters.map(p => {
            const stats = p.seasonStats;
            const gp = stats?.gamesPlayed || 1;
            const ovr = calculateOverall(p);
            return {
                ...p,
                stars: calculateStars(ovr, teamBaseline),
                ppg: ((stats?.points || 0) / gp).toFixed(1),
                rpg: ((stats?.rebounds || 0) / gp).toFixed(1),
                apg: ((stats?.assists || 0) / gp).toFixed(1),
                spg: ((stats?.steals || 0) / gp).toFixed(1),
                bpg: ((stats?.blocks || 0) / gp).toFixed(1),
                fgp: stats?.fgAttempted ? (stats.fgMade / stats.fgAttempted * 100).toFixed(0) : '0',
                tpp: stats?.threeAttempted ? (stats.threeMade / stats.threeAttempted * 100).toFixed(0) : '0'
            };
        });
    }, [players, userTeamId, teamBaseline]);

    // 2. LAST 5 GAMES (W/L) + CONFERENCE RANK
    const lastFive = useMemo(() => {
        const teamGames = games
            .filter(g => g.homeScore !== undefined && (g.homeTeamId === userTeamId || g.awayTeamId === userTeamId))
            .sort((a, b) => b.id.localeCompare(a.id)) 
            .slice(0, 5);
        
        return teamGames.map(g => {
            const isHome = g.homeTeamId === userTeamId;
            const userScore = isHome ? g.homeScore! : g.awayScore!;
            const oppScore = isHome ? g.awayScore! : g.homeScore!;
            return {
                result: userScore > oppScore ? 'W' : 'L',
                game: g
            };
        }).reverse();
    }, [games, userTeamId]);

    const confRank = useMemo(() => {
        if (!userTeam) return 'N/A';
        const confTeams = teams.filter(t => t.conference === userTeam.conference);
        const sorted = [...confTeams].sort((a, b) => {
            const winPctA = a.wins / (a.wins + a.losses || 1);
            const winPctB = b.wins / (b.wins + b.losses || 1);
            if (winPctB !== winPctA) return winPctB - winPctA;
            return b.wins - a.wins;
        });
        const rank = sorted.findIndex(t => t.id === userTeamId) + 1;
        const suffix = (rank: number) => {
            if (rank === 1) return 'st';
            if (rank === 2) return 'nd';
            if (rank === 3) return 'rd';
            return 'th';
        };
        return `${rank}${suffix(rank)} in ${userTeam.conference}`;
    }, [teams, userTeam, userTeamId]);

    // 3. ROSTER EVALUATION (3 strengths, 3 weaknesses)
    const evaluation = useMemo(() => {
        const teamPlayers = players.filter(p => p.teamId === userTeamId);
        if (teamPlayers.length === 0) return { strengths: [], weaknesses: [] };

        const posGroups: Record<string, number[]> = { 'PG': [], 'SG': [], 'SF': [], 'PF': [], 'C': [] };
        teamPlayers.forEach(p => {
            if (posGroups[p.position]) posGroups[p.position].push(calculateOverall(p));
        });

        const posAverages = Object.entries(posGroups).map(([pos, ovrs]) => ({
            pos,
            avg: ovrs.length > 0 ? ovrs.reduce((a, b) => a + b, 0) / ovrs.length : 0,
            count: ovrs.length
        }));

        const strengths: string[] = [];
        const weaknesses: string[] = [];

        const sortedPos = [...posAverages].sort((a, b) => b.avg - a.avg);
        sortedPos.slice(0, 2).forEach(p => {
            if (p.avg > 75) strengths.push(`Elite ${p.pos} depth`);
            else strengths.push(`Solid ${p.pos} core`);
        });

        const avgAge = teamPlayers.reduce((a, b) => a + b.age, 0) / teamPlayers.length;
        if (avgAge < 24) strengths.push('High potential youth');
        else if (avgAge > 29) strengths.push('Veteran leadership');
        else strengths.push('Balanced age profile');

        const worstPos = [...posAverages].sort((a, b) => a.avg - b.avg);
        worstPos.slice(0, 2).forEach(p => {
            if (p.avg < 70) weaknesses.push(`Upgrade ${p.pos} starter`);
            else weaknesses.push(`Refine ${p.pos} rotation`);
        });

        const totalPayroll = contracts.filter(c => c.teamId === userTeamId).reduce((a, b) => a + b.amount, 0);
        if (totalPayroll > 150000000) weaknesses.push('Salary cap pressure');
        else if (teamPlayers.length < 13) weaknesses.push('Roster depth concerns');
        else weaknesses.push('Bench scoring impact');

        return {
            strengths: strengths.slice(0, 3),
            weaknesses: weaknesses.slice(0, 3)
        };
    }, [players, userTeamId, contracts]);

    // 4. EXPIRING CONTRACTS
    const expiringContracts = useMemo(() => {
        const teamContracts = contracts.filter(c => c.teamId === userTeamId && c.yearsLeft === 1);
        return teamContracts.map(c => {
            const player = players.find(p => p.id === c.playerId);
            const ovr = player ? calculateOverall(player) : 0;
            return {
                ...c,
                playerName: player ? `${player.firstName[0]}. ${player.lastName.toUpperCase()}` : 'Unknown',
                stars: calculateStars(ovr, teamBaseline),
                playerId: player?.id
            };
        }).sort((a, b) => b.amount - a.amount);
    }, [players, contracts, userTeamId, teamBaseline]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '120px', paddingTop: 'calc(20px + env(safe-area-inset-top))' }}>
            <SimControls />

            {/* EURO MATCH CALENDAR — only visible in Euro mode */}
            {(leagueType === 'EURO' || userTeam?.conference === 'EuroLeague' || userTeam?.conference === 'EuroCup') && (
                <div style={{ padding: '0 4px' }}>
                    <EuroMatchCalendar />
                </div>
            )}

            <div className="dashboard-grid">
                {/* 1. STARTING 5 WIDGET */}
                <DashboardCard title="STARTING LINEUP" className="col-10" icon={<Users size={16} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {startingFive.map((player) => (
                            <div 
                                key={player.id} 
                                onClick={() => onSelectPlayer(player.id)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '16px', 
                                    padding: '14px', 
                                    background: '#f9f9fb', 
                                    borderRadius: '16px', 
                                    border: '1px solid #f2f2f7',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.01)';
                                    e.currentTarget.style.background = '#ffffff';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.background = '#f9f9fb';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    background: 'var(--team-primary)', 
                                    color: '#fff', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: 900, 
                                    fontSize: '0.85rem', 
                                    flexShrink: 0,
                                }}>
                                    {player.position}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ 
                                        fontSize: '1rem', 
                                        fontWeight: 900, 
                                        color: '#1c1c1e',
                                        letterSpacing: '-0.02em',
                                        marginBottom: '2px'
                                    }}>
                                        {player.firstName} {player.lastName.toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <StarRating stars={player.stars} size={12} />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8e8e93' }}>
                                            OVR {calculateOverall(player)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ 
                                    display: 'flex', 
                                    gap: '12px', 
                                    background: '#ffffff', 
                                    padding: '8px 12px', 
                                    borderRadius: '12px',
                                    border: '1px solid #f2f2f7'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.5rem', color: '#8e8e93', fontWeight: 800 }}>PPG</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{player.ppg}</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.5rem', color: '#8e8e93', fontWeight: 800 }}>RPG</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{player.rpg}</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.5rem', color: '#8e8e93', fontWeight: 800 }}>APG</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{player.apg}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* MORALE WIDGET */}
                <div className="col-10">
                    {userTeamId && userTeam && (
                        <TeamMoraleDashboard players={players} team={userTeam} onSelectPlayer={onSelectPlayer} onNavigate={() => onNavigate('team_chemistry')} />
                    )}
                </div>

                {/* 2. RECENT FORM & RANK */}
                <DashboardCard title="SEASON STATUS" className="col-5" icon={<TrendingUp size={16} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '0.6rem', color: '#8e8e93', fontWeight: 800, marginBottom: '8px' }}>RECENT FORM</div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {lastFive.map((data, i) => (
                                    <div 
                                        key={i} 
                                        style={{ 
                                            width: '28px', 
                                            height: '28px', 
                                            borderRadius: '8px', 
                                            background: data.result === 'W' ? '#2ecc71' : '#e74c3c', 
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8rem',
                                            fontWeight: 900,
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {data.result}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ paddingTop: '12px', borderTop: '1px solid #f2f2f7' }}>
                            <div style={{ fontSize: '0.6rem', color: '#8e8e93', fontWeight: 800, marginBottom: '4px' }}>CONFERENCE</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1c1c1e' }}>{confRank}</div>
                            <div style={{ fontSize: '0.7rem', color: '#8e8e93', fontWeight: 600 }}>Record: {userTeam?.wins}W - {userTeam?.losses}L</div>
                        </div>
                    </div>
                </DashboardCard>

                {/* 3. ROSTER EVALUATION */}
                <DashboardCard title="ROSTER EVALUATION" className="col-5" icon={<BarChart3 size={16} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(46, 204, 113, 0.05)', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.55rem', color: '#2ecc71', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Zap size={10} /> STRENGTHS
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1c1c1e' }}>
                                {evaluation.strengths[0]}
                            </div>
                        </div>
                        <div style={{ background: 'rgba(231, 76, 60, 0.05)', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.55rem', color: '#e74c3c', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertCircle size={10} /> KEY NEED
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1c1c1e' }}>
                                {evaluation.weaknesses[0]}
                            </div>
                        </div>
                    </div>
                </DashboardCard>

                {/* 4. EXPIRING CONTRACTS */}
                <DashboardCard title="EXPIRING CONTRACTS" className="col-10" icon={<BarChart3 size={16} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                        {expiringContracts.slice(0, 4).map((contract) => (
                            <div 
                                key={contract.id} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px', 
                                    padding: '12px', 
                                    background: '#f9f9fb', 
                                    borderRadius: '14px', 
                                    border: '1px solid #f2f2f7'
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1c1c1e' }}>{contract.playerName}</div>
                                    <StarRating stars={contract.stars} size={10} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--team-primary)' }}>
                                        ${(contract.amount / 1000000).toFixed(1)}M
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};
