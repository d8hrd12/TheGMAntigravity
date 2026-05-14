import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import { NBA_TEAMS } from '../../data/teams';
import { EURO_TEAMS } from '../../data/euro/teams';
import { useGame } from '../../store/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Trophy, Plus, ArrowLeft } from 'lucide-react';
import { PageHeader } from './PageHeader';

interface TeamSelectionViewProps {
    onSelectTeam: (teamId: string) => void;
    onCreateTeam: () => void;
    onBack: () => void;
}

export const TeamSelectionView: React.FC<TeamSelectionViewProps> = ({ onSelectTeam, onCreateTeam, onBack }) => {
    const { leagueType, competitionType } = useGame();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const teamsToDisplay = leagueType === 'EURO' 
        ? EURO_TEAMS.filter(t => t.conference === competitionType)
        : NBA_TEAMS;
    
    const westernTeams = teamsToDisplay.filter(t => t.conference === 'West' || t.conference === 'EuroLeague' || t.conference === 'EuroCup');
    const easternTeams = teamsToDisplay.filter(t => t.conference === 'East');

    const handleConfirm = () => {
        if (selectedId) {
            onSelectTeam(selectedId);
        }
    };

    const TeamCard = ({ team }: { team: Team }) => {
        const isSelected = selectedId === team.id;
        return (
            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedId(team.id)}
                style={{
                    position: 'relative',
                    padding: '16px',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255, 95, 31, 0.15)' : 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign: 'center',
                    overflow: 'hidden',
                    height: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: isSelected ? '0 10px 30px rgba(255, 95, 31, 0.2)' : '0 4px 15px rgba(0,0,0,0.2)'
                }}
            >
                {/* Watermark Logo */}
                {team.logo && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 0,
                        pointerEvents: 'none',
                        opacity: isSelected ? 0.2 : 0.05,
                        filter: isSelected ? 'none' : 'grayscale(100%) brightness(0.5)',
                        transition: 'all 0.5s ease',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                    }}>
                        <img src={team.logo} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                    </div>
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>{team.city}</div>
                    <div style={{ 
                        fontSize: team.name.length > 15 ? '1rem' : '1.2rem', 
                        fontWeight: 950, 
                        color: isSelected ? '#fff' : 'rgba(255,255,255,0.9)', 
                        margin: '2px 0',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.5px'
                    }}>
                        {team.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: isSelected ? '#FF5F1F' : 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '2px' }}>{team.abbreviation}</div>
                </div>
            </motion.div>
        );
    };

    return (
        <div style={{
            minHeight: '100dvh',
            width: '100vw',
            backgroundColor: '#000',
            backgroundImage: 'url("/assets/start_career_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            overflowY: 'auto',
            paddingBottom: '120px'
        }}>
            {/* Overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.95))',
                zIndex: 0
            }} />

            <PageHeader
                title="Select Franchise"
                subtitle="Choose your destiny or create a legacy"
                onBack={onBack}
            />
            <div style={{ position: 'relative', zIndex: 1, padding: '0 25px' }}>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: window.innerWidth < 768 ? '1fr' : (leagueType === 'EURO' ? '1fr' : '1fr 1fr'), 
                    gap: window.innerWidth < 768 ? '40px' : '60px',
                    marginBottom: '80px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 900, 
                            color: '#FF5F1F', 
                            textTransform: 'uppercase', 
                            letterSpacing: '4px',
                            marginBottom: '25px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{ height: '2px', width: '20px', background: '#FF5F1F' }} />
                            {leagueType === 'NBA' ? 'Western Conference' : 'All Teams'}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                            {westernTeams.map(team => <TeamCard key={team.id} team={team} />)}
                        </div>
                    </motion.div>

                    {leagueType === 'NBA' && (
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 style={{ 
                                fontSize: '0.8rem', 
                                fontWeight: 900, 
                                color: '#3498db', 
                                textTransform: 'uppercase', 
                                letterSpacing: '4px',
                                marginBottom: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <div style={{ height: '2px', width: '20px', background: '#3498db' }} />
                                Eastern Conference
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                                {easternTeams.map(team => <TeamCard key={team.id} team={team} />)}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Expansion CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <button
                        onClick={onCreateTeam}
                        style={{
                            padding: '30px 50px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            maxWidth: '600px',
                            width: '100%'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ 
                            background: 'linear-gradient(135deg, #FF5F1F 0%, #E64A19 100%)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '10px',
                            boxShadow: '0 10px 20px rgba(255, 95, 31, 0.4)'
                        }}>
                            <Plus size={24} color="white" />
                        </div>
                        <span style={{ fontSize: '1.4rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Expansion Franchise
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                            Add a new team and define your own history
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.9)',
                    backdropFilter: 'blur(30px)',
                    borderTop: '1px solid var(--bg-card-hover)',
                    padding: window.innerWidth < 768 ? '15px' : '20px 40px',
                    display: 'flex',
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    gap: '10px'
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    style={{
                        padding: '18px 40px',
                        background: 'var(--bg-card-hover)',
                        color: '#000',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}
                >
                    <ArrowLeft size={20} /> Back
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={!selectedId}
                    onClick={handleConfirm}
                    style={{
                        width: window.innerWidth < 768 ? '100%' : 'auto',
                        padding: window.innerWidth < 768 ? '16px' : '18px 80px',
                        background: selectedId ? 'linear-gradient(135deg, #FF5F1F 0%, #E64A19 100%)' : 'var(--bg-card-hover)',
                        color: selectedId ? 'white' : 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '15px',
                        fontSize: window.innerWidth < 768 ? '1.1rem' : '1.2rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        cursor: selectedId ? 'pointer' : 'not-allowed',
                        boxShadow: selectedId ? '0 10px 30px rgba(255, 95, 31, 0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px'
                    }}
                >
                    Start Career <ChevronRight size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
};
