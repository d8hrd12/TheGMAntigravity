
import React, { useState, useMemo, useEffect } from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { useGame } from '../../store/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

interface EuroNegotiationViewProps {
    player: Player;
    team: Team;
    onNegotiate: (offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => { decision: 'ACCEPTED' | 'REJECTED' | 'INSULTED'; feedback: string; };
    onSign: (offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => void;
    onCancel: () => void;
    salaryCap: number;
}

export const EuroNegotiationView: React.FC<EuroNegotiationViewProps> = ({ player, team, onNegotiate, onSign, onCancel, salaryCap }) => {
    const { players } = useGame();
    
    const ovr = calculateOverall(player);
    const teamBaseline = useMemo(() => {
        const teamPlayers = players.filter(p => p.teamId === team.id);
        return calculateTeamBaseline(teamPlayers);
    }, [players, team.id]);

    const asking = useMemo(() => calculateContractAmount(player, salaryCap), [player, salaryCap]);

    const [salary, setSalary] = useState(asking.amount);
    const [years, setYears] = useState(asking.years);
    const [role, setRole] = useState<'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect'>('Rotation');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [lastDecision, setLastDecision] = useState<'ACCEPTED' | 'REJECTED' | 'INSULTED' | null>(null);

    useEffect(() => {
        if (ovr >= 85) setRole('Star');
        else if (ovr >= 78) setRole('Starter');
        else if (ovr >= 74) setRole('Rotation');
        else if (ovr >= 70) setRole('Bench');
        else setRole('Prospect');
    }, [player, ovr]);

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
    };

    const handleOffer = () => {
        const result = onNegotiate({ amount: salary, years, role });
        setFeedback(result.feedback);
        setLastDecision(result.decision);
    };

    const roles: ('Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect')[] = ['Star', 'Starter', 'Rotation', 'Bench', 'Prospect'];

    // Adjusted demand based on role/years
    const currentAsking = calculateAdjustedDemand(player, asking.amount, asking.years, role, years, false);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
                padding: '32px', 
                maxWidth: '500px', 
                width: '100%',
                margin: '0 auto', 
                color: 'var(--text-main)',
                background: 'var(--bg-card)',
                borderRadius: '32px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6)',
                position: 'relative'
            }}
        >
            <button 
                onClick={onCancel}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
                <X size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--team-primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                    Contract Negotiation
                </div>
                <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px' }}>
                    {player.firstName} {player.lastName.toUpperCase()}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 700 }}>{player.position} • AGE {player.age}</span>
                    <StarRating stars={calculateStars(ovr, teamBaseline)} size={12} />
                </div>
            </div>

            {/* Price Target */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', border: '1px solid var(--border-color)', marginBottom: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Target Demand</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2ecc71' }}>
                    {formatMoney(currentAsking)} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ YEAR</span>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Salary */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)' }}>ANNUAL SALARY</label>
                        <span style={{ fontSize: '1rem', fontWeight: 900 }}>{formatMoney(salary)}</span>
                    </div>
                    <input
                        type="range"
                        min={Math.max(1000000, asking.amount * 0.5)}
                        max={Math.min(50000000, asking.amount * 2)}
                        step="100000"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--team-primary)' }}
                    />
                    {salary > team.salaryCapSpace && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e74c3c', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px' }}>
                            <AlertCircle size={14} /> EXCEEDS BUDGET SPACE
                        </div>
                    )}
                </div>

                {/* Years */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '12px' }}>CONTRACT DURATION</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4].map(y => (
                            <button
                                key={y}
                                onClick={() => setYears(y)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '14px',
                                    border: years === y ? '2px solid var(--team-primary)' : '1px solid var(--border-color)',
                                    background: years === y ? 'rgba(var(--team-primary-rgb), 0.1)' : 'transparent',
                                    color: years === y ? 'var(--team-primary)' : 'var(--text-main)',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {y}Y
                            </button>
                        ))}
                    </div>
                </div>

                {/* Role */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '12px' }}>PROJECTED ROLE</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {roles.map(r => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    border: role === r ? 'none' : '1px solid var(--border-color)',
                                    background: role === r ? 'var(--team-primary)' : 'transparent',
                                    color: role === r ? '#fff' : 'var(--text-dim)',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginTop: '24px',
                            padding: '16px',
                            borderRadius: '16px',
                            background: lastDecision === 'ACCEPTED' ? 'rgba(46, 204, 113, 0.1)' : lastDecision === 'INSULTED' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${lastDecision === 'ACCEPTED' ? '#2ecc71' : lastDecision === 'INSULTED' ? '#e74c3c' : 'var(--border-color)'}`,
                            color: lastDecision === 'ACCEPTED' ? '#2ecc71' : lastDecision === 'INSULTED' ? '#e74c3c' : 'var(--text-main)',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            lineHeight: 1.5,
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                        }}
                    >
                        {lastDecision === 'ACCEPTED' ? <Check size={18} /> : <AlertCircle size={18} />}
                        "{feedback}"
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                {lastDecision === 'ACCEPTED' ? (
                    <button
                        onClick={() => onSign({ amount: salary, years, role })}
                        style={{ flex: 1, padding: '18px', borderRadius: '18px', background: '#2ecc71', color: '#fff', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)' }}
                    >
                        SIGN PLAYER
                    </button>
                ) : (
                    <button
                        onClick={handleOffer}
                        disabled={lastDecision === 'INSULTED' || salary > team.salaryCapSpace}
                        style={{ 
                            flex: 1, 
                            padding: '18px', 
                            borderRadius: '18px', 
                            background: 'var(--team-primary)', 
                            color: '#fff', 
                            border: 'none', 
                            fontWeight: 900, 
                            fontSize: '1.1rem', 
                            cursor: (lastDecision === 'INSULTED' || salary > team.salaryCapSpace) ? 'not-allowed' : 'pointer',
                            boxShadow: '0 8px 25px rgba(var(--team-primary-rgb), 0.3)',
                            opacity: (lastDecision === 'INSULTED' || salary > team.salaryCapSpace) ? 0.5 : 1
                        }}
                    >
                        MAKE OFFER
                    </button>
                )}
            </div>
        </motion.div>
    );
};
