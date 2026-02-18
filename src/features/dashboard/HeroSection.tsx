import React from 'react';
import { useGame } from '../../store/GameContext';
import { Shirt } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardCard } from './DashboardCard';

interface HeroSectionProps {
    onEnterPlayoffs?: () => void;
    onStartSeasonTrigger: () => void;
    onStartTrainingTrigger: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterPlayoffs, onStartSeasonTrigger, onStartTrainingTrigger }) => {
    const { teams, userTeamId, date, seasonPhase, seasonGamesPlayed, advanceDay, triggerDraft, isTrainingCampComplete, setGameState } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    if (!userTeam) return null;

    // ADJUSTMENT: If season is over, main action is entering playoffs
    const isSeasonComplete = seasonPhase === 'regular_season' && seasonGamesPlayed >= 82;

    const mainAction = (seasonPhase === 'pre_season')
        ? (isTrainingCampComplete ? onStartSeasonTrigger : onStartTrainingTrigger)
        : (seasonPhase === 'offseason')
            ? triggerDraft
            : (isSeasonComplete ? () => onEnterPlayoffs?.() : (seasonPhase.startsWith('playoffs') ? () => onEnterPlayoffs?.() : advanceDay));

    const mainLabel = (seasonPhase === 'pre_season')
        ? (isTrainingCampComplete ? 'Pay Contracts' : 'Start Training Camp')
        : (seasonPhase === 'offseason' ? 'Start Offseason' : (isSeasonComplete ? 'Enter Playoffs' : (seasonPhase.startsWith('playoffs') ? 'Go to Playoffs' : 'Simulate Day')));

    const gameLabel = isSeasonComplete
        ? "Regular Season Complete"
        : (seasonPhase === 'regular_season'
            ? `Game ${seasonGamesPlayed + 1}/82`
            : seasonPhase.charAt(0).toUpperCase() + seasonPhase.slice(1).replace('_', ' '));

    const primaryColor = userTeam.colors?.primary || '#1a365d';
    const secondaryColor = userTeam.colors?.secondary || '#eab308';

    return (
        <DashboardCard
            variant="hero"
            noPadding
            style={{
                position: 'relative',
                background: `linear-gradient(135deg, ${primaryColor} 0%, #0a0a0a 100%)`, // Dynamic primary color
            }}
        >
            {/* Logo Watermark - Team Specific */}
            <div style={{
                position: 'absolute',
                right: '-5%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '60%',
                opacity: 0.2,
                filter: 'grayscale(0.5) brightness(1.5) contrast(1.2)', // More vibrant watermark
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <img
                    src={userTeam.logo || `/logos/${userTeam.name.toLowerCase().replace(/\s+/g, '_')}.png`}
                    alt=""
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </div>

            <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            opacity: 0.7
                        }}>
                            {gameLabel}
                        </span>
                        <h1 style={{
                            margin: '4px 0 0 0',
                            fontSize: '2.6rem',
                            fontWeight: 950,
                            lineHeight: 1.0,
                            letterSpacing: '-1.2px',
                            color: 'white',
                            textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            {userTeam.city}<br />
                            <span style={{ color: secondaryColor, filter: 'brightness(1.2)' }}>{userTeam.name}</span>
                        </h1>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.08)',
                        padding: '10px 16px',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-0.5px', color: 'white' }}>
                            {userTeam.wins}<span style={{ opacity: 0.3, margin: '0 2px' }}>-</span>{userTeam.losses}
                        </div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>RECORD</div>
                    </div>
                </div>

                {/* Main Action Button - Dynamic Highlight Colors */}
                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: `0 15px 35px ${primaryColor}66` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => mainAction?.()}
                    style={{
                        marginTop: '24px',
                        width: '100%',
                        padding: '16px',
                        borderRadius: '24px',
                        border: 'none',
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                        color: 'white',
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        boxShadow: `0 12px 30px ${primaryColor}44`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        transition: 'box-shadow 0.3s'
                    }}
                >
                    <Shirt size={24} strokeWidth={2.5} />
                    {mainLabel}
                </motion.button>
                {/* SYSTEM REPAIR: Only show if season is glitched (NaN or >82 games) */}
                {(seasonGamesPlayed > 82 || isNaN(seasonGamesPlayed)) && (
                    <button
                        onClick={() => {
                            setGameState(prev => ({
                                ...prev,
                                seasonGamesPlayed: 82
                            }));
                            alert("System Repaired: The season cycle has been reset. Please click 'Simulate' to start the Playoffs.");
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            fontSize: '0.75rem',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            zIndex: 10
                        }}
                    >
                        ⚠ Repair Season Glitch
                    </button>
                )}
            </div>
        </DashboardCard >
    );
};
