import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Globe, ArrowRight, ArrowLeft } from 'lucide-react';

interface LeagueSelectionViewProps {
    onSelect: (type: 'NBA' | 'EURO') => void;
    onBack: () => void;
}

export const LeagueSelectionView: React.FC<LeagueSelectionViewProps> = ({ onSelect, onBack }) => {
    return (
        <div style={{
            minHeight: '100dvh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#000',
            backgroundImage: 'url("/assets/start_career_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            position: 'fixed',
            inset: 0,
            zIndex: 1000
        }}>
            {/* Dark Overlay for Readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.95))',
                zIndex: 0
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ zIndex: 1, textAlign: 'center', marginBottom: window.innerWidth < 768 ? '20px' : '60px' }}
            >
                <h2 style={{ 
                    fontSize: '3.5rem', 
                    fontWeight: 950, 
                    letterSpacing: '-3px', 
                    marginBottom: '10px',
                    textTransform: 'uppercase'
                }}>
                    Select League <span style={{ color: '#FF5F1F' }}>Type</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', fontWeight: 500, maxWidth: '600px' }}>
                    Choose your basketball ecosystem. Rules, rosters, and schedules will adapt.
                </p>
            </motion.div>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '20px', 
                padding: '0 20px',
                marginBottom: '20px'
            }}>
                {/* NBA CARD */}
                <LeagueCard 
                    title="NBA"
                    subtitle="NORTH AMERICA"
                    description="The pinnacle of athleticism. 30 teams, 82 games, trades, and the hunt for the Larry O'Brien trophy."
                    icon={<Trophy size={48} />}
                    color="#FF5F1F"
                    onClick={() => onSelect('NBA')}
                />

                {/* EURO CARD */}
                <LeagueCard 
                    title="EURO"
                    subtitle="EUROPEAN LEAGUES"
                    description="Tactical supremacy. Dual-league schedules, transfer market, and the legendary Final Four format."
                    icon={<Globe size={48} />}
                    color="#3498db"
                    onClick={() => onSelect('EURO')}
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                style={{
                    marginTop: window.innerWidth < 768 ? '20px' : '60px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)',
                    padding: '16px 40px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    zIndex: 1,
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}
            >
                <ArrowLeft size={18} /> Back to Menu
            </motion.button>
        </div>
    );
};

interface LeagueCardProps {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ title, subtitle, description, icon, color, onClick }) => {
    return (
        <motion.div
            whileHover={{ 
                scale: 1.02, 
                rotateY: -5,
                boxShadow: `0 30px 60px -12px ${color}33`,
                borderColor: `${color}66`
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                flex: 1,
                minWidth: 0,
                minHeight: window.innerWidth < 768 ? '320px' : '500px', 
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '40px 30px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                backdropFilter: 'blur(30px)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >


            <div style={{ color: color, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '4px', marginBottom: '8px' }}>
                {subtitle}
            </div>

            <h3 style={{ fontSize: 'clamp(1.2rem, 5vw, 3rem)', fontWeight: 950, margin: '0 0 10px 0', letterSpacing: '-1px' }}>
                {title}
            </h3>

            <div style={{ minHeight: '60px' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(0.7rem, 2.5vw, 1rem)', lineHeight: 1.4, margin: 0 }}>
                    {description}
                </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: color, fontWeight: 800, fontSize: 'clamp(0.6rem, 2vw, 0.8rem)' }}>
                SELECT <ArrowRight size={14} />
            </div>

            {/* Subtle Gradient Glow */}
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-20%',
                width: '60%',
                height: '60%',
                background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                zIndex: -1
            }} />
        </motion.div>
    );
};
