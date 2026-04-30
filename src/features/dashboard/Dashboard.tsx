import React, { useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { SimControls } from './SimControls';
import { Users, BarChart3, TrendingUp, Zap, AlertCircle, ChevronRight } from 'lucide-react';
import { calculateOverall } from '../../utils/playerUtils';
import { StarRating } from '../../components/StarRating';
import { calculateTeamBaseline, calculateStars } from '../../utils/starUtils';
import { formatDate } from '../../utils/dateUtils';

interface DashboardProps {
    onSelectGame: (game: any) => void;
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    onSelectPlayer,
    onSelectTeam,
}) => {
    const {
        players,
        userTeamId,
        teams,
        games,
        contracts,
        date,
        seasonPhase,
        seasonGamesPlayed
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
            const fgp = stats?.fgAttempted ? (stats.fgMade / stats.fgAttempted * 100).toFixed(1) : '0.0';
            const ovr = calculateOverall(p);
            return {
                ...p,
                stars: calculateStars(ovr, teamBaseline),
                ppg: ((stats?.points || 0) / gp).toFixed(1),
                rpg: ((stats?.rebounds || 0) / gp).toFixed(1),
                apg: ((stats?.assists || 0) / gp).toFixed(1),
                fgp
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
            return userScore > oppScore ? 'W' : 'L';
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SimControls />

            <div className="dashboard-grid">
                {/* 1. STARTING 5 WIDGET */}
                {/* ... (Starting 5 content) ... */}
                <DashboardCard title="STARTING LINEUP" className="col-10" icon={<Users size={16} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {startingFive.map((player) => (
                            <div 
                                key={player.id} 
                                onClick={() => onSelectPlayer(player.id)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px', 
                                    padding: '8px', 
                                    background: 'var(--bg-card)', 
                                    borderRadius: '10px', 
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--team-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem' }}>
                                    {player.position}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{player.firstName[0]}. {player.lastName.toUpperCase()}</div>
                                    <StarRating stars={player.stars} size={12} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 40px)', gap: '4px', textAlign: 'center' }}>
                                    <div><div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>PTS</div><div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{player.ppg}</div></div>
                                    <div><div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>REB</div><div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{player.rpg}</div></div>
                                    <div><div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>AST</div><div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{player.apg}</div></div>
                                    <div><div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>FG%</div><div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--team-primary)' }}>{player.fgp}%</div></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* 2. RECENT FORM & RANK */}
                <DashboardCard title="SEASON STATUS" className="col-10" icon={<TrendingUp size={16} />}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '6px' }}>LAST 5</div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {lastFive.length > 0 ? lastFive.map((res, i) => (
                                    <div key={i} style={{ 
                                        width: '24px', 
                                        height: '24px', 
                                        borderRadius: '6px', 
                                        background: res === 'W' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', 
                                        color: res === 'W' ? '#2ecc71' : '#e74c3c',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        border: `1px solid ${res === 'W' ? '#2ecc71' : '#e74c3c'}`
                                    }}>
                                        {res}
                                    </div>
                                )) : <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>No games</div>}
                            </div>
                        </div>
                        <div 
                            onClick={() => onSelectTeam(userTeamId!)}
                            style={{ textAlign: 'right', cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '2px' }}>RANK</div>
                            <div style={{ fontSize: '1.0rem', fontWeight: 900, color: 'var(--team-primary)' }}>
                                {confRank}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{userTeam?.wins}W - {userTeam?.losses}L</div>
                        </div>
                    </div>
                </DashboardCard>

                {/* 3. ROSTER EVALUATION */}
                <DashboardCard title="ROSTER EVALUATION" className="col-10" icon={<BarChart3 size={16} />}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '4px' }}>
                        <div style={{ background: 'rgba(46, 204, 113, 0.03)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(46, 204, 113, 0.1)' }}>
                            <div style={{ fontSize: '0.55rem', color: '#2ecc71', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Zap size={10} /> STRENGTHS
                            </div>
                            <ul style={{ margin: 0, padding: '0 0 0 12px', fontSize: '0.7rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                {evaluation.strengths.map((s, i) => <li key={i} style={{ marginBottom: '2px' }}>{s}</li>)}
                            </ul>
                        </div>
                        <div style={{ background: 'rgba(231, 76, 60, 0.03)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(231, 76, 60, 0.1)' }}>
                            <div style={{ fontSize: '0.55rem', color: '#e74c3c', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertCircle size={10} /> NEEDS
                            </div>
                            <ul style={{ margin: 0, padding: '0 0 0 12px', fontSize: '0.7rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                {evaluation.weaknesses.map((w, i) => <li key={i} style={{ marginBottom: '2px' }}>{w}</li>)}
                            </ul>
                        </div>
                    </div>
                </DashboardCard>

                {/* 4. EXPIRING CONTRACTS */}
                <DashboardCard title="EXPIRING CONTRACTS" className="col-10" icon={<BarChart3 size={16} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {expiringContracts.length > 0 ? expiringContracts.map((contract) => (
                            <div 
                                key={contract.id} 
                                onClick={() => contract.playerId && onSelectPlayer(contract.playerId)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px', 
                                    padding: '8px', 
                                    background: 'var(--bg-card)', 
                                    borderRadius: '10px', 
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{contract.playerName}</div>
                                    <StarRating stars={contract.stars} size={10} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--team-primary)' }}>
                                        ${(contract.amount / 1000000).toFixed(1)}M
                                    </div>
                                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 800 }}>LAST YEAR</div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                No contracts expiring this year.
                            </div>
                        )}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};
