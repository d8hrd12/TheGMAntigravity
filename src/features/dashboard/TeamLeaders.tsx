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
            whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }}
            onClick={() => onSelectPlayer && onSelectPlayer(player.id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9CA3AF',
                    fontSize: '0.75rem',
                    fontWeight: 800
                }}>
                    {player.position}
                </div>
                <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1A1A1A' }}>{player.firstName[0]}. {player.lastName}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>{label}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1A1A1A' }}>{statValue}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9CA3AF' }}>{statType}</div>
            </div>
        </motion.div>
    );

    return (
        <DashboardCard variant="white" title="Team Leaders" icon={<Users size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <LeaderRow
                    player={pointsLeader}
                    label="Scoring Leader"
                    statValue={pointsLeader.seasonStats?.gamesPlayed ? (pointsLeader.seasonStats.points / pointsLeader.seasonStats.gamesPlayed).toFixed(1) : "0.0"}
                    statType="PPG"
                />
                <LeaderRow
                    player={reboundsLeader}
                    label="Rebounding Leader"
                    statValue={reboundsLeader.seasonStats?.gamesPlayed ? (reboundsLeader.seasonStats.rebounds / reboundsLeader.seasonStats.gamesPlayed).toFixed(1) : "0.0"}
                    statType="RPG"
                />
                <LeaderRow
                    player={assistsLeader}
                    label="Playmaking Leader"
                    statValue={assistsLeader.seasonStats?.gamesPlayed ? (assistsLeader.seasonStats.assists / assistsLeader.seasonStats.gamesPlayed).toFixed(1) : "0.0"}
                    statType="APG"
                />
            </div>
        </DashboardCard>
    );
};
