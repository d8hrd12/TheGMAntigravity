import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { TeamSelectionView } from '../ui/TeamSelectionView';
import { CreateTeamView } from './CreateTeamView';
import { SaveLoadView } from '../ui/SaveLoadView';
import { LeagueSelectionView } from './LeagueSelectionView';
import { CompetitionSelectionView } from './CompetitionSelectionView';
import { RosterEditorView } from './RosterEditorView';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FolderOpen, Settings, Trophy, Users } from 'lucide-react';

export const MainMenu: React.FC = () => {
    const { startNewGame, loadGame, setLeagueType, leagueType, setCompetitionType, competitionType } = useGame();
    const [view, setView] = useState<'main' | 'mode_selection' | 'competition_selection' | 'setup' | 'selection' | 'create_team' | 'roster_editor' | 'settings'>('main');
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

    if (view === 'roster_editor') {
        return <RosterEditorView onBack={() => setView('main')} />;
    }

    if (view === 'settings') {
        return (
            <div style={{
                height: '100dvh',
                width: '100vw',
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000',
                backgroundImage: 'url("/assets/start_career_bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 5000,
                padding: '40px'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 0 }} />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ zIndex: 1 }}
                >
                    <h2 style={{ 
                        fontSize: 'clamp(2rem, 8vw, 4rem)', 
                        fontWeight: 950, 
                        letterSpacing: '-2px', 
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        color: '#FF5F1F',
                        marginBottom: '30px'
                    }}>
                        Go back you <span style={{ color: '#fff' }}>scumbag!</span>
                    </h2>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 700, 
                        color: 'rgba(255,255,255,0.4)', 
                        maxWidth: '500px',
                        marginBottom: '60px'
                    }}>
                        There is no easy mode on this...
                    </p>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setView('main')}
                        style={{
                            padding: '20px 60px',
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '15px',
                            fontSize: '1rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            cursor: 'pointer'
                        }}
                    >
                        I understand.
                    </motion.button>
                </motion.div>
            </div>
        );
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
            onBack={() => {
                if (leagueType === 'NBA') {
                    setView('mode_selection');
                } else {
                    setView('competition_selection');
                }
            }}
        />;
    }

    if (showLoadMenu) {
        return <SaveLoadView mode="load" onClose={() => setShowLoadMenu(false)} />;
    }

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            backgroundImage: 'url("/assets/start_career_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Cinematic Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.95) 100%)',
                zIndex: 1
            }} />

            {/* Top Black Bar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '40px',
                background: 'rgba(0,0,0,0.9)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                backdropFilter: 'blur(10px)'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 900, 
                        color: '#FF5F1F', 
                        letterSpacing: '6px', 
                        textTransform: 'uppercase'
                    }}
                >
                    LevedisGames™ presents
                </motion.div>
            </div>

            {/* Content Container */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                    zIndex: 2, 
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '500px',
                    padding: '0 20px'
                }}
            >
                {/* Logo Area */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ marginBottom: '60px' }}
                >
                    <h1 style={{ 
                        fontSize: 'clamp(3rem, 15vw, 6rem)', 
                        fontWeight: 900, 
                        letterSpacing: '-2px', 
                        lineHeight: 0.85,
                        margin: 0,
                        textTransform: 'uppercase',
                        fontFamily: "'Orbitron', sans-serif"
                    }}>
                        TheGm™<br/>
                        <span style={{ color: '#FF5F1F' }}>2026</span>
                    </h1>
                    <div style={{ 
                        height: '2px', 
                        width: '80px', 
                        background: '#FF5F1F', 
                        margin: '20px auto',
                        borderRadius: '10px',
                        boxShadow: '0 0 15px rgba(255, 95, 31, 0.5)'
                    }} />
                </motion.div>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <MenuButton 
                        icon={<Play size={20} />} 
                        label="New Career" 
                        primary 
                        onClick={() => setView('mode_selection')} 
                        delay={0.4}
                    />
                    <MenuButton 
                        icon={<FolderOpen size={20} />} 
                        label="Load Career" 
                        onClick={() => setShowLoadMenu(true)} 
                        delay={0.5}
                    />
                    <MenuButton 
                        icon={<Users size={20} />} 
                        label="Roster Editor" 
                        onClick={() => setView('roster_editor')} 
                        delay={0.6}
                    />
                    <MenuButton 
                        icon={<Settings size={20} />} 
                        label="Settings" 
                        onClick={() => setView('settings')} 
                        delay={0.7}
                    />
                </div>

                {/* Footer Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{ 
                        marginTop: '80px', 
                        fontSize: '0.7rem', 
                        color: 'rgba(255,255,255,0.3)', 
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}
                >
                    V.5.7.0 Powered by MyMac&MyMadness
                </motion.div>
            </motion.div>

            {/* Corner Decorative Elements */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                opacity: 0.6
            }}>
                <Trophy size={20} color="#FF5F1F" />
                <div style={{ height: '1px', width: '40px', background: 'rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>HALL OF FAME</span>
            </div>
        </div>
    );
};

interface MenuButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    primary?: boolean;
    delay?: number;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onClick, primary, delay = 0 }) => {
    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                width: '100%',
                padding: '22px 30px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                background: primary ? 'linear-gradient(135deg, #FF5F1F 0%, #E64A19 100%)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                boxShadow: primary ? '0 10px 30px rgba(255, 95, 31, 0.3)' : '0 4px 20px rgba(0,0,0,0.2)'
            }}
        >
            <span style={{ color: primary ? '#fff' : '#FF5F1F' }}>{icon}</span>
            {label}
        </motion.button>
    );
};
