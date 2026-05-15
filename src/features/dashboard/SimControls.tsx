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
        leagueType,
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
                gap: '10px',
                padding: '14px 16px',
                fontSize: '0.75rem',
                fontWeight: 900,
                background: variant === 'primary' ? 'var(--team-primary)' : '#ffffff',
                border: variant === 'primary' ? 'none' : '1px solid #e5e5ea',
                borderRadius: '30px',
                color: variant === 'primary' ? '#fff' : '#1c1c1e',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                boxShadow: variant === 'primary' ? '0 8px 20px rgba(var(--primary-rgb), 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isSimulating ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
                if (!isSimulating) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    if (variant !== 'primary') e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                if (variant !== 'primary') e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
        >
            <Icon size={16} style={{ color: variant === 'primary' ? '#fff' : 'var(--team-primary)' }} />
            {label}
        </button>
    );

    // Euro season = 38 match-days; NBA season = 82 games
    const regularSeasonLength = leagueType === 'EURO' ? 38 : 82;
    const isSeasonComplete = seasonPhase === 'regular_season' && seasonGamesPlayed >= regularSeasonLength;

    const wrapperStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '480px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(30px) saturate(180%)',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    };

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
            <div style={wrapperStyle}>
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
            <div style={wrapperStyle}>
                <SimButton
                    onClick={startPlayoffs}
                    icon={Trophy}
                    label={leagueType === 'EURO' ? "START POST-SEASON" : "START PLAYOFFS"}
                    variant="primary"
                />
            </div>
        );
    }

    if (seasonPhase === 'euro_playin') {
        return (
            <div style={wrapperStyle}>
                <SimButton
                    onClick={() => setView('euro_playin')}
                    icon={Trophy}
                    label="GO TO PLAY-IN"
                    variant="primary"
                />
            </div>
        );
    }

    if (seasonPhase.startsWith('playoffs')) {
        return (
            <div style={wrapperStyle}>
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
        <div style={wrapperStyle}>
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
