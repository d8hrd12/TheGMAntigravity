import React from 'react';
import type { SeasonAwards, AwardWinner } from '../../models/Awards';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Users, X } from 'lucide-react';

interface AwardsPopupProps {
    awards: SeasonAwards;
    onClose: () => void;
}

export const AwardsPopup: React.FC<AwardsPopupProps> = ({ awards, onClose }) => {
    const isChampionship = !!awards.champion;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: '20px'
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                style={{
                    background: 'var(--bg-card)',
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '32px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header Decoration */}
                <div style={{
                    height: '140px',
                    background: isChampionship ? 'linear-gradient(135deg, #FFD700, #DAA520)' : 'linear-gradient(135deg, var(--team-primary), #d35400)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    position: 'relative'
                }}>
                    <Trophy size={48} style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }} />
                    <h2 style={{ margin: '10px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 950, fontSize: '1.5rem' }}>
                        {isChampionship ? 'League Champions' : `${awards.year} Season Awards`}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '30px', maxHeight: '70vh', overflowY: 'auto' }}>
                    {isChampionship ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', letterSpacing: '2px' }}>World Champions</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--team-primary)', lineHeight: 1.1 }}>{awards.champion?.teamName.toUpperCase()}</div>
                            </div>
                            {awards.finalsMvp && (
                                <div style={{ padding: '24px', background: 'rgba(var(--team-primary-rgb), 0.05)', borderRadius: '24px', border: '1px solid rgba(var(--team-primary-rgb), 0.1)' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px' }}>Finals MVP</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>{awards.finalsMvp.playerName}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{awards.finalsMvp.statsSummary}</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <AwardRow label="Most Valuable Player" winner={awards.mvp} icon={<Star size={20} color="#f1c40f" />} />
                            <AwardRow label="Rookie of the Year" winner={awards.roty} icon={<Users size={20} color="#3498db" />} />
                            <AwardRow label="Defensive Player" winner={awards.dpoy} icon={<Award size={20} color="#e74c3c" />} />
                            <AwardRow label="Most Improved" winner={awards.mip} icon={<Trophy size={20} color="#2ecc71" />} />
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            marginTop: '30px',
                            padding: '18px',
                            borderRadius: '16px',
                            fontWeight: 800,
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: '0 10px 25px rgba(var(--team-primary-rgb), 0.3)'
                        }}
                    >
                        {isChampionship ? 'Proceed to Offseason' : 'Continue to Playoffs'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const AwardRow = ({ label, winner, icon }: { label: string, winner: AwardWinner, icon: React.ReactNode }) => {
    if (winner.playerId === 'err') return null;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{winner.playerName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{winner.teamName}</span>
                    <span>{winner.statsSummary}</span>
                </div>
            </div>
        </div>
    );
};
