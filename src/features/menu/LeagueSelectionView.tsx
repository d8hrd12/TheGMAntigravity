import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Globe, ArrowRight } from 'lucide-react';

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
            background: '#0a0a0a',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background Decorative elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(255, 95, 31, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(52, 152, 219, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ zIndex: 1, textAlign: 'center', marginBottom: '40px' }}
            >
                <h2 style={{ 
                    fontSize: 'clamp(2.2rem, 8vw, 4rem)', 
                    fontWeight: 950, 
                    letterSpacing: '-2px', 
                    marginBottom: '10px',
                    textTransform: 'uppercase'
                }}>
                    Select League <span style={{ color: '#FF5F1F' }}>Type</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', fontWeight: 500, padding: '0 20px' }}>
                    Choose your basketball ecosystem. Rules, rosters, and schedules will adapt.
                </p>
            </motion.div>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '12px', 
                width: '100%', 
                maxWidth: '1200px',
                zIndex: 1,
                perspective: '1000px',
                padding: '0 10px'
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
                    isNew
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                style={{
                    marginTop: '60px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.6)',
                    padding: '12px 30px',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    zIndex: 1
                }}
            >
                Back to Menu
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
    isNew?: boolean;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ title, subtitle, description, icon, color, onClick, isNew }) => {
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
                minHeight: '380px', 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: 'clamp(15px, 3vw, 30px) clamp(10px, 2vw, 20px)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                backdropFilter: 'blur(20px)',
                transition: 'border-color 0.3s ease'
            }}
        >
            {isNew && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: color,
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    letterSpacing: '1px'
                }}>
                    NEW MODE
                </div>
            )}

            <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '20px', 
                background: `${color}22`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: color,
                marginBottom: '30px',
                border: `1px solid ${color}44`
            }}>
                {icon}
            </div>

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
