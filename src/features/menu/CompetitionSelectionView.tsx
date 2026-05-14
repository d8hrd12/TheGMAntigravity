import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, TrendingUp, ShieldAlert, ArrowLeft } from 'lucide-react';

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
                style={{ zIndex: 1, textAlign: 'center', marginBottom: window.innerWidth < 768 ? '20px' : '40px' }}
            >
                <h2 style={{ 
                    fontSize: '3.5rem', 
                    fontWeight: 950, 
                    letterSpacing: '-3px', 
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    color: '#ffffff'
                }}>
                    SELECT <span style={{ color: '#EAB308' }}>COMPETITION</span>
                </h2>
                <p style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 500 }}>
                    Determine your path to European glory.
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
                    marginTop: window.innerWidth < 768 ? '15px' : '40px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '15px',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    maxWidth: '600px',
                    zIndex: 1,
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30', padding: '8px', borderRadius: '10px' }}>
                    <ShieldAlert size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#FF3B30', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>
                        The Relegation Factor
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#ffffff', lineHeight: 1.3 }}>
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
                    marginTop: window.innerWidth < 768 ? '20px' : '40px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
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
                <ArrowLeft size={18} /> Back to Mode Selection
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
                minHeight: window.innerWidth < 768 ? '320px' : '500px', 
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

            <h3 style={{ fontSize: 'clamp(1.2rem, 5vw, 2.5rem)', fontWeight: 950, margin: '0 0 10px 0', letterSpacing: '-1px', lineHeight: 1, color: '#fff' }}>
                {title}
            </h3>

            <div style={{ minHeight: '60px' }}> {/* Container to keep text start consistent */}
                <p style={{ color: '#ffffff', fontSize: 'clamp(0.7rem, 2.5vw, 1rem)', lineHeight: 1.4, margin: 0 }}>
                    {description}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', color: '#ffffff', fontWeight: 600 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
                    {feature}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', color: '#ffffff', fontWeight: 600 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
                    {rule}
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 900, fontSize: 'clamp(0.6rem, 2.5vw, 0.85rem)', letterSpacing: '1px' }}>
                SELECT <ArrowRight size={14} />
            </div>
        </motion.div>
    );
};
