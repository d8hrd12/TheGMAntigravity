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
        return <TeamSelectionView onSelectTeam={(teamId) => {
            console.log("MainMenu: Selected team", teamId);
            try {
                startNewGame(teamId, setupData.difficulty);
                console.log("MainMenu: startNewGame returned");
            } catch (e) {
                console.error("MainMenu: Error starting game:", e);
                alert("Failed to start game: " + e); // Visible feedback
            }
        }} />;
    }

    if (showLoadMenu) {
        return <SaveLoadView mode="load" onClose={() => setShowLoadMenu(false)} />;
    }

    return (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h1>TheGM</h1>
            <p style={{ marginBottom: '30px', color: '#666' }}>Basketball Manager Simulation</p>
            <button
                onClick={() => setView('setup')}
                style={{ fontSize: '1.2rem', padding: '15px 40px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)', marginBottom: '20px', display: 'block', margin: '0 auto 20px auto' }}
            >
                Start New Career
            </button>
            <button
                onClick={() => setView('create_team')}
                style={{ fontSize: '1.1rem', padding: '15px 40px', background: 'var(--surface)', color: 'white', border: '1px solid var(--border)', borderRadius: '50px', marginBottom: '20px', display: 'block', margin: '0 auto 20px auto', cursor: 'pointer' }}
            >
                Create a Team
            </button>
            <button
                onClick={() => setShowLoadMenu(true)}
                style={{ fontSize: '1rem', padding: '12px 30px', background: 'transparent', color: 'var(--text)', border: '2px solid var(--border)', borderRadius: '50px', cursor: 'pointer' }}
            >
                Load Career
            </button>
        </div>
    );
};
