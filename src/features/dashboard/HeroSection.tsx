import React from 'react';
import { useGame } from '../../store/GameContext';
import { Calendar, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardCard } from './DashboardCard';

interface HeroSectionProps {
    onEnterPlayoffs?: () => void;
    onStartSeasonTrigger: () => void;
    onStartTrainingTrigger: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterPlayoffs, onStartSeasonTrigger, onStartTrainingTrigger }) => {
    const { teams, userTeamId, seasonPhase, seasonGamesPlayed, leagueType, advanceDay, triggerDraft, isTrainingCampComplete } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    if (!userTeam) return null;

    const regularSeasonLength = leagueType === 'EURO' ? 38 : 82;
    const isSeasonComplete = seasonPhase === 'regular_season' && seasonGamesPlayed >= regularSeasonLength;

    const mainAction = (seasonPhase === 'pre_season')
        ? (isTrainingCampComplete ? onStartSeasonTrigger : onStartTrainingTrigger)
        : (seasonPhase === 'offseason')
            ? triggerDraft
            : (isSeasonComplete ? () => onEnterPlayoffs?.() : (seasonPhase.startsWith('playoffs') ? () => onEnterPlayoffs?.() : advanceDay));

    const mainLabel = (seasonPhase === 'pre_season')
        ? (isTrainingCampComplete ? 'START SEASON' : 'START TRAINING')
        : (seasonPhase === 'offseason' ? 'DRAFT START' : (isSeasonComplete ? 'PLAYOFFS' : (seasonPhase.startsWith('playoffs') ? 'GO PLAYOFFS' : 'ADVANCE DAY')));

    const getPhaseIcon = () => {
        if (isSeasonComplete || seasonPhase.startsWith('playoffs')) return <Trophy size={18} />;
        if (seasonPhase === 'offseason' || seasonPhase === 'draft') return <Calendar size={18} />;
        return <Zap size={18} />;
    };

    return (
        <DashboardCard title="Franchise Hub" variant="secondary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    {leagueType !== 'EURO' && (
                        <div style={{ color: 'var(--text-main)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                            {userTeam.city}
                        </div>
                    )}
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {userTeam.name}
                    </h1>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {userTeam.wins}-{userTeam.losses}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Record</div>
                </div>
            </div>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => mainAction?.()}
                className="btn-modern"
                style={{ width: '100%', marginTop: '20px', background: 'var(--text-main)', color: '#fff', border: 'none', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
                {getPhaseIcon()}
                {mainLabel}
            </motion.button>
        </DashboardCard>
    );
};
