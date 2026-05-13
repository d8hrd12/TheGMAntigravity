import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { TeamSelectionView } from '../ui/TeamSelectionView';
import { CreateTeamView } from './CreateTeamView';
import { SaveLoadView } from '../ui/SaveLoadView';
import { LeagueSelectionView } from './LeagueSelectionView';
import { CompetitionSelectionView } from './CompetitionSelectionView';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FolderOpen, Settings, Trophy, Users } from 'lucide-react';

export const MainMenu: React.FC = () => {
    const { startNewGame, loadGame, setLeagueType, leagueType, setCompetitionType, competitionType } = useGame();
    const [view, setView] = useState<'main' | 'mode_selection' | 'competition_selection' | 'setup' | 'selection' | 'create_team'>('main');
    const [setupData, setSetupData] = useState<{ difficulty: 'Easy' | 'Medium' | 'Hard' }>({ difficulty: 'Medium' });
    const [showLoadMenu, setShowLoadMenu] = useState(false);


    if (view === 'mode_selection') {
        return <LeagueSelectionView 
            onSelect={(type) => {
                setLeagueType(type);
                if (type === 'NBA') {
                    setCompetitionType('NBA');
                    setView('selection');
                } else {
                    setView('competition_selection');
                }
            }} 
            onBack={() => setView('main')} 
        />;
    }

    if (view === 'competition_selection') {
        return <CompetitionSelectionView 
            onSelect={(comp) => {
                setCompetitionType(comp);
                setView('selection');
            }}
            onBack={() => setView('mode_selection')}
        />;
    }


    if (view === 'create_team') {
        return <CreateTeamView onBack={() => setView('main')} />;
    }

    if (view === 'selection') {
        return <TeamSelectionView
            onSelectTeam={(teamId) => {
                try {
                    startNewGame(teamId, setupData.difficulty);
                } catch (e) {
                    console.error("MainMenu: Error starting game:", e);
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
            minHeight: '100dvh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000', // Deep black fallback
            backgroundImage: 'url("/assets/landing_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff',
            fontFamily: 'var(--font-main)'
        }}>
            {/* Dark Overlay with Gradient */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
                zIndex: 1
            }} />

            {/* Content Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                    zIndex: 2, 
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '480px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Logo Area */}
                <div style={{ marginBottom: '40px', width: '100%' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255, 95, 31, 0.2)',
                            padding: '6px 14px',
                            borderRadius: '100px',
                            border: '1px solid rgba(255, 95, 31, 0.5)',
                            marginBottom: '20px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Trophy size={14} color="#FF5F1F" strokeWidth={3} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', color: '#FF5F1F' }}>
                            Pro Manager
                        </span>
                    </motion.div>
                    
                    <h1 style={{ 
                        fontSize: '6rem', 
                        fontWeight: 950, 
                        margin: 0, 
                        lineHeight: 0.8,
                        letterSpacing: '-6px',
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        textShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 100px rgba(255,255,255,0.1)'
                    }}>
                        TheGM
                    </h1>
                    <p style={{ 
                        marginTop: '10px', 
                        color: 'rgba(255,255,255,0.4)', 
                        fontSize: '0.9rem', 
                        fontWeight: 800,
                        letterSpacing: '12px',
                        textTransform: 'uppercase',
                        textIndent: '12px' // Perfect centering for tracking
                    }}>
                        Basketball
                    </p>
                </div>

                {/* Main Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <motion.button
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setView('mode_selection')}
                        style={{
                            padding: '24px 40px',
                            background: 'linear-gradient(135deg, #FF5F1F 0%, #E64A19 100%)',
                            color: 'white',
                            border: 'none',
                            fontSize: '1.2rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            boxShadow: '0 15px 35px rgba(255, 95, 31, 0.3)',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}
                    >
                        <Play size={24} fill="currentColor" />
                        Start New Career
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, x: 5, background: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowLoadMenu(true)}
                        style={{
                            padding: '20px 40px',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <FolderOpen size={20} />
                        Load Career
                    </motion.button>
                </div>

                {/* Footer Info */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{ 
                        marginTop: '80px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '40px',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={14} /> 1,200+ Players
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trophy size={14} /> 31 Franchises
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={14} /> v1.0.4
                    </div>
                </motion.div>
            </motion.div>

            {/* Corner Decorative Elements */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                zIndex: 2,
                textAlign: 'right'
            }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px' }}>
                    Engineered by
                </div>
                <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '-1px' }}>
                    DEEPMIND / ANTIGRAVITY
                </div>
            </div>
        </div>
    );
};
