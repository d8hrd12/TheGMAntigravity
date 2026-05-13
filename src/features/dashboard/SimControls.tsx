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

    // Euro season = 38 match-days; NBA season = 82 games
    const regularSeasonLength = leagueType === 'EURO' ? 38 : 82;
    const isSeasonComplete = seasonPhase === 'regular_season' && seasonGamesPlayed >= regularSeasonLength;


    const wrapperStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '500px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
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
