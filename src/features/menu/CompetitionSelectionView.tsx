import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, TrendingUp, ShieldAlert } from 'lucide-react';

interface CompetitionSelectionViewProps {
    onSelect: (type: 'EuroLeague' | 'EuroCup') => void;
    onBack: () => void;
}

export const CompetitionSelectionView: React.FC<CompetitionSelectionViewProps> = ({ onSelect, onBack }) => {
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
            backgroundImage: 'url("/assets/league_mode_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Font Import */}
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
            </style>

            {/* Dark Overlay for Readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.9))',
                zIndex: 0
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ zIndex: 1, textAlign: 'center', marginBottom: '20px' }}
            >
                <h2 style={{ 
                    fontSize: 'clamp(1.8rem, 7vw, 3.5rem)', 
                    fontWeight: 900, 
                    letterSpacing: '-2px', 
                    marginBottom: '5px',
                    textTransform: 'uppercase'
                }}>
                    Select <span style={{ color: '#EAB308' }}>Competition</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.8rem, 3.5vw, 1.1rem)', fontWeight: 500, padding: '0 10px' }}>
                    Determine your path to European glory.
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
                padding: '0 10px'
            }}>
                {/* EUROLEAGUE CARD */}
                <CompetitionCard 
                    title="EuroLeague"
                    tagline="THE ELITE"
                    description="The highest tier of European basketball. Face the biggest clubs on the continent. Only the top survive."
                    feature="Final Four format"
                    rule="Strict licensing"
                    icon={<Star size={32} />}
                    color="#EAB308"
                    onClick={() => onSelect('EuroLeague')}
                />

                {/* EUROCUP CARD */}
                <CompetitionCard 
                    title="EuroCup"
                    tagline="THE PATHWAY"
                    description="A brutal competition with a high reward. Win it all to earn your place in the EuroLeague."
                    feature="Promotion system"
                    rule="Relegation threat"
                    icon={<TrendingUp size={32} />}
                    color="#3498db"
                    onClick={() => onSelect('EuroCup')}
                />
            </div>

            {/* Relegation Info Box */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    marginTop: '40px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '20px 30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    maxWidth: '800px',
                    zIndex: 1,
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30', padding: '10px', borderRadius: '12px' }}>
                    <ShieldAlert size={24} />
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#FF3B30', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        The Relegation Factor
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                        Unlike the NBA, performance matters at both ends of the table. Failing in the Domestic league can lead to relegation, 
                        while EuroCup finalists fight for promotion to the EuroLeague. Every game is a battle for survival.
                    </p>
                </div>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                style={{
                    marginTop: '40px',
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
                Back to Mode Selection
            </motion.button>
        </div>
    );
};

interface CompetitionCardProps {
    title: string;
    tagline: string;
    description: string;
    feature: string;
    rule: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ title, tagline, description, feature, rule, icon, color, onClick }) => {
    return (
        <motion.div
            whileHover={{ 
                scale: 1.02, 
                boxShadow: `0 30px 60px -12px ${color}22`,
                borderColor: `${color}66`
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                flex: 1,
                minWidth: 0,
                minHeight: '480px', 
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '40px 30px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                backdropFilter: 'blur(30px)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            <div style={{ color: color, marginBottom: '25px', height: '32px', display: 'flex', alignItems: 'center' }}>
                {icon}
            </div>

            <div style={{ color: color, fontSize: '0.7rem', fontWeight: 900, letterSpacing: '3px', marginBottom: '8px' }}>
                {tagline}
            </div>

            <h3 style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)', fontWeight: 950, margin: '0 0 10px 0', letterSpacing: '-1px', lineHeight: 1 }}>
                {title}
            </h3>

            <div style={{ minHeight: '60px' }}> {/* Container to keep text start consistent */}
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(0.7rem, 2.5vw, 1rem)', lineHeight: 1.4, margin: 0 }}>
                    {description}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
                    {feature}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
                    {rule}
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: color, fontWeight: 900, fontSize: 'clamp(0.6rem, 2.5vw, 0.85rem)', letterSpacing: '1px' }}>
                SELECT <ArrowRight size={14} />
            </div>
        </motion.div>
    );
};
