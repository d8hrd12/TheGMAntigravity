import React from 'react';
import { FastForward, Trophy, ArrowRightLeft } from 'lucide-react';
import { useGame } from '../../store/GameContext';
import { DashboardCard } from './DashboardCard';
import { motion } from 'framer-motion';

export const SimControls: React.FC = () => {
    const { advanceDay, simulateToTradeDeadline, simulateToPlayoffs, seasonPhase } = useGame();

    if (seasonPhase !== 'regular_season') return null;

    const SimBox = ({ onClick, icon: Icon, label }: any) => (
        <DashboardCard
            variant="white"
            noPadding
            onClick={onClick}
            style={{ flex: 1, cursor: 'pointer' }}
        >
            <motion.div
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'center'
                }}
            >
                <div style={{ color: '#3b82f6' }}>
                    <Icon size={24} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A1A1A' }}>
                    {label}
                </span>
            </motion.div>
        </DashboardCard>
    );

    return (
        <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            <SimBox
                onClick={simulateToTradeDeadline}
                icon={ArrowRightLeft}
                label="Sim to Deadline"
            />
            <SimBox
                onClick={simulateToPlayoffs}
                icon={Trophy}
                label="Sim to Playoffs"
            />
        </div>
    );
};
