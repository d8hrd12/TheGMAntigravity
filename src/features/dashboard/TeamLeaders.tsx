import React from 'react';
import { useGame } from '../../store/GameContext';
import { Users, User } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { motion } from 'framer-motion';

interface TeamLeadersProps {
    onSelectPlayer?: (playerId: string) => void;
}

export const TeamLeaders: React.FC<TeamLeadersProps> = ({ onSelectPlayer }) => {
    const { players, userTeamId } = useGame();

    const teamPlayers = players.filter(p => p.teamId === userTeamId);
    if (teamPlayers.length === 0) return null;

    // Get leaders
    const pointsLeader = [...teamPlayers].sort((a, b) => (b.seasonStats?.points || 0) - (a.seasonStats?.points || 0))[0];
    const reboundsLeader = [...teamPlayers].sort((a, b) => (b.seasonStats?.rebounds || 0) - (a.seasonStats?.rebounds || 0))[0];
    const assistsLeader = [...teamPlayers].sort((a, b) => (b.seasonStats?.assists || 0) - (a.seasonStats?.assists || 0))[0];

    const LeaderRow = ({ player, label, statValue, statType }: any) => (
        <motion.div
            whileHover={{ x: 4, backgroundColor: 'var(--bg-card-hover)' }}
            onClick={() => onSelectPlayer && onSelectPlayer(player.id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--bg-card-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-color)'
                }}>
                    {player.position}
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{player.firstName[0]}. {player.lastName}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{statValue}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{statType}</div>
            </div>
        </motion.div>
    );

    return (
        <DashboardCard variant="primary" title="Team Leaders" icon={<Users size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <LeaderRow
                    player={pointsLeader}
                    label="Scoring"
                    statValue={pointsLeader.seasonStats?.gamesPlayed ? (pointsLeader.seasonStats.points / pointsLeader.seasonStats.gamesPlayed).toFixed(1) : "0.0"}
                    statType="PPG"
                />
                <LeaderRow
                    player={reboundsLeader}
                    label="Rebounding"
                    statValue={reboundsLeader.seasonStats?.gamesPlayed ? (reboundsLeader.seasonStats.rebounds / reboundsLeader.seasonStats.gamesPlayed).toFixed(1) : "0.0"}
                    statType="RPG"
                />
                <LeaderRow
                    player={assistsLeader}
                    label="Playmaking"
                    statValue={assistsLeader.seasonStats?.gamesPlayed ? (assistsLeader.seasonStats.assists / assistsLeader.seasonStats.gamesPlayed).toFixed(1) : "0.0"}
                    statType="APG"
                />
            </div>
        </DashboardCard>
    );
};
