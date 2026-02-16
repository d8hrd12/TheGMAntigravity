import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { TeamSelectionView } from '../ui/TeamSelectionView';
import { NewGameSetupView } from '../ui/NewGameSetupView';
import { CreateTeamView } from './CreateTeamView';
import { SaveLoadView } from '../ui/SaveLoadView';

export const MainMenu: React.FC = () => {
    const { startNewGame } = useGame();
    const [view, setView] = useState<'main' | 'setup' | 'selection' | 'create_team'>('main');
    const [setupData, setSetupData] = useState<{ difficulty: 'Easy' | 'Medium' | 'Hard' } | null>(null);

    const handleSetupComplete = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
        setSetupData({ difficulty });
        setView('selection');
    };

    const [showLoadMenu, setShowLoadMenu] = useState(false);
    const { loadGame } = useGame();

    if (view === 'setup') {
        return <NewGameSetupView onNext={handleSetupComplete} onBack={() => setView('main')} />;
    }

    if (view === 'create_team') {
        return <CreateTeamView onBack={() => setView('main')} />;
    }

    if (view === 'selection' && setupData) {
        return <TeamSelectionView
            onSelectTeam={(teamId) => {
                console.log("MainMenu: Selected team", teamId);
                try {
                    startNewGame(teamId, setupData.difficulty);
                    console.log("MainMenu: startNewGame returned");
                } catch (e) {
                    console.error("MainMenu: Error starting game:", e);
                    alert("Failed to start game: " + e); // Visible feedback
                }
            }}
            onCreateTeam={() => setView('create_team')}
        />;
    }

    if (showLoadMenu) {
        return <SaveLoadView mode="load" onClose={() => setShowLoadMenu(false)} />;
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--background, #1a1a1a)',
            color: 'var(--text, #ffffff)'
        }}>
            <h1 style={{ marginBottom: '10px', fontSize: '3rem', letterSpacing: '-1px', fontWeight: 800 }}>TheGM</h1>
            <p style={{ marginBottom: '60px', color: '#888', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Basketball Manager Simulation</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
                <button
                    onClick={() => setView('setup')}
                    style={{
                        padding: '20px',
                        background: 'var(--primary, #FF5F1F)',
                        color: 'white',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        borderRadius: '4px' // Squarish
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Start New Career
                </button>

                <button
                    onClick={() => setShowLoadMenu(true)}
                    style={{
                        padding: '20px',
                        background: 'transparent',
                        color: 'var(--text, #ffffff)',
                        border: '2px solid #333',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.1s',
                        borderRadius: '4px' // Squarish
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#666'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Load Career
                </button>
            </div>
        </div>
    );
};
