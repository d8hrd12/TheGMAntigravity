import React, { useState, useRef, useEffect } from 'react';
import { Play, FastForward, Pause, Calendar } from 'lucide-react';
import { useGame } from '../../store/GameContext';

export const SimControls: React.FC = () => {
    const { advanceDay, seasonPhase } = useGame();
    const [isSimulating, setIsSimulating] = useState(false);
    const stopSimRef = useRef(false);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            stopSimRef.current = true;
        };
    }, []);

    const handleSimulate = async (days: number) => {
        if (isSimulating) return;

        setIsSimulating(true);
        stopSimRef.current = false;

        for (let i = 0; i < days; i++) {
            if (stopSimRef.current) break;

            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 100));

            // Check if we assume advanceDay is safe to call repeatedly
            advanceDay();
        }
        setIsSimulating(false);
    };

    const stopSim = () => {
        stopSimRef.current = true;
        // The loop will break on next iteration, then set isSimulating false
    }

    if (seasonPhase !== 'regular_season') return null;

    return (
        <div className="glass-panel" style={{
            padding: '12px 20px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            borderRadius: '16px',
            border: '1px solid var(--border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto', color: 'var(--text-secondary)' }}>
                <Calendar size={18} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quick Sim</span>
            </div>

            {isSimulating ? (
                <button
                    onClick={stopSim}
                    style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    <Pause size={16} /> Stop
                </button>
            ) : (
                <>
                    <button
                        onClick={() => handleSimulate(7)}
                        style={{
                            background: 'var(--surface-active)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 500
                        }}
                    >
                        <Play size={16} fill="currentColor" /> Week
                    </button>
                    <button
                        onClick={() => handleSimulate(30)}
                        style={{
                            background: 'var(--surface-active)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 500
                        }}
                    >
                        <FastForward size={16} fill="currentColor" /> Month
                    </button>
                </>
            )}
        </div>
    );
};
