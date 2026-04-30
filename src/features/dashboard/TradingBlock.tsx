import React, { useMemo, useState } from 'react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { ArrowRightLeft, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '../../models/Player';
import { StarRating } from '../../components/StarRating';
import { calculateStars } from '../../utils/starUtils';
import { getTradingBlock, getTeamDirection } from '../trade/TradeLogic';

interface TradingBlockProps {
    onSelectPlayer: (id: string) => void;
}

export const TradingBlock: React.FC<TradingBlockProps> = ({ onSelectPlayer }) => {
    const { players, teams, userTeamId } = useGame();
    const [currentIndex, setCurrentIndex] = useState(0);

    const blockPlayers = useMemo(() => {
        const otherTeams = teams.filter(t => t.id !== userTeamId && t.id !== '31');
        const assets: Player[] = [];

        otherTeams.forEach(team => {
            const teamRoster = players.filter(p => p.teamId === team.id);
            const direction = getTeamDirection(team, teamRoster);
            const block = getTradingBlock(team, teamRoster, direction);
            assets.push(...block.assets);
        });

        const requestPlayers = players.filter(p => p.teamId && p.teamId !== userTeamId && p.tradeRequested && !assets.find(a => a.id === p.id));
        assets.push(...requestPlayers);

        const sorted = assets.sort((a, b) => (b.overall || 0) - (a.overall || 0));

        if (sorted.length < 3) {
            return players.filter(p => p.teamId && p.teamId !== userTeamId).sort((a, b) => b.overall - a.overall).slice(0, 10);
        }

        return sorted.slice(0, 15);
    }, [players, teams, userTeamId]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % blockPlayers.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + blockPlayers.length) % blockPlayers.length);
    };

    if (blockPlayers.length === 0) return null;

    const currentPlayer = blockPlayers[currentIndex];
    const playerTeam = teams.find(t => t.id === currentPlayer.teamId);

    return (
        <DashboardCard 
            title="League Trading Block" 
            icon={<ArrowRightLeft size={16} />} 
            variant="primary"
            noPadding
        >
            <div style={{ position: 'relative', padding: '20px', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPlayer.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                        onClick={() => onSelectPlayer(currentPlayer.id)}
                    >
                        <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '10px', 
                            background: 'var(--bg-card-hover)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border-color)',
                            flexShrink: 0
                        }}>
                            {playerTeam?.logo ? (
                                <img src={playerTeam.logo} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            ) : (
                                <User size={24} color="var(--text-dim)" />
                            )}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {playerTeam?.abbreviation} • {currentPlayer.position}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {currentPlayer.firstName} {currentPlayer.lastName}
                            </div>
                            <div style={{ marginTop: '2px' }}>
                                <StarRating stars={calculateStars(currentPlayer.overall, 75)} size={10} />
                            </div>
                        </div>

                        {currentPlayer.tradeRequested && (
                            <div style={{ background: 'var(--danger)', color: '#fff', fontSize: '0.55rem', padding: '3px 6px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                                Transfer Req
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {blockPlayers.map((_, idx) => (
                            <div key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: idx === currentIndex ? 'var(--primary)' : 'var(--border-color)', transition: 'background 0.3s' }} />
                        ))}
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </DashboardCard>
    );
};
