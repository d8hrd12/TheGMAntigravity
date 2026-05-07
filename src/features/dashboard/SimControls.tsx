import React from 'react';
import { Trophy, ArrowRightLeft, Zap, Calendar, Play } from 'lucide-react';
import { useGame } from '../../store/GameContext';

export const SimControls: React.FC = () => {
    const { 
        simulateToTradeDeadline, 
        simulateToPlayoffs, 
        seasonPhase, 
        advanceDay, 
        isTrainingCampComplete,
        seasonGamesPlayed,
        triggerDraft,
        isSimulating,
        setShowPayrollModal,
        startPlayoffs,
        setView,
        endCoachFreeAgency,
        endResigning,
        endFreeAgency
    } = useGame();

    const SimButton = ({ onClick, icon: Icon, label, variant = 'standard' }: any) => (
        <button
            onClick={onClick}
            disabled={isSimulating}
            style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                fontSize: '0.65rem',
                fontWeight: 800,
                background: variant === 'primary' ? 'var(--team-primary)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                color: variant === 'primary' ? '#fff' : 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                boxShadow: 'var(--shadow-sm)',
                opacity: isSimulating ? 0.7 : 1
            }}
        >
            <Icon size={14} style={{ color: variant === 'primary' ? '#fff' : 'var(--team-primary)' }} />
            {label}
        </button>
    );

    const isSeasonComplete = seasonPhase === 'regular_season' && seasonGamesPlayed >= 82;


    if (
        seasonPhase === 'scouting' || 
        seasonPhase === 'offseason' || 
        seasonPhase === 'pre_season' || 
        seasonPhase === 'retirement_summary' ||
        seasonPhase === 'training' ||
        seasonPhase === 'draft' ||
        seasonPhase === 'draft_summary' ||
        seasonPhase === 'expansion_draft' ||
        seasonPhase === 'coach_free_agency' ||
        seasonPhase === 'resigning' ||
        seasonPhase === 'free_agency'
    ) {
        return (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <SimButton
                    onClick={() => setView('offseason_menu')}
                    icon={Calendar}
                    label="GO TO PRESEASON MENU"
                    variant="primary"
                />
            </div>
        );
    }


    if (isSeasonComplete) {
        return (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <SimButton
                    onClick={startPlayoffs}
                    icon={Trophy}
                    label="START PLAYOFFS"
                    variant="primary"
                />
            </div>
        );
    }

    if (seasonPhase.startsWith('playoffs')) {
        return (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <SimButton
                    onClick={() => setView('playoffs')}
                    icon={Trophy}
                    label="GO PLAYOFFS"
                    variant="primary"
                />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <SimButton
                    onClick={advanceDay}
                    icon={Zap}
                    label="ADVANCE DAY"
                    variant="primary"
                />
            </div>
            {seasonPhase === 'regular_season' && (
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <SimButton
                        onClick={simulateToTradeDeadline}
                        icon={ArrowRightLeft}
                        label="SIM TO DEADLINE"
                    />
                    <SimButton
                        onClick={simulateToPlayoffs}
                        icon={Trophy}
                        label="SIM TO PLAYOFFS"
                    />
                </div>
            )}
        </div>
    );
};
