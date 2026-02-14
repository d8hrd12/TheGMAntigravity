import React from 'react';
import type { Player, PlayerAttributes } from '../../../models/Player';
import { calculateOverall } from '../../../utils/playerUtils';
import { motion } from 'framer-motion';
import { X, Award, Activity, TrendingUp } from 'lucide-react';

interface PlayerDetailModalProps {
    player: Player;
    onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
    const ovr = calculateOverall(player);

    const AttributeRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{
                fontWeight: 600,
                color: value >= 85 ? '#e74c3c' : value >= 75 ? '#2ecc71' : value >= 65 ? '#f1c40f' : 'var(--text)'
            }}>
                {value}
            </span>
        </div>
    );

    const StatBox: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px', textAlign: 'center', minWidth: '70px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{value}</div>
        </div>
    );

    const stats = player.seasonStats ? player.seasonStats : (player.careerStats && player.careerStats.length > 0) ? player.careerStats[player.careerStats.length - 1] : null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }} onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#1c1c1e', width: '90%', maxWidth: '800px', maxHeight: '90vh',
                    borderRadius: '24px', overflowY: 'auto', padding: '0',
                    border: '1px solid #333', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Header Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    padding: '30px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '25px'
                }}>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%',
                        width: '32px', height: '32px', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <X size={18} />
                    </button>



                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <h2 style={{ margin: 0, fontSize: '2.2rem', color: 'white' }}>{player.firstName} {player.lastName}</h2>
                            <div style={{
                                background: ovr >= 85 ? '#e74c3c' : ovr >= 75 ? '#2ecc71' : '#f1c40f',
                                color: 'white', padding: '4px 10px', borderRadius: '6px', fontWeight: 800
                            }}>
                                {ovr}
                            </div>
                        </div>
                        <div style={{ fontSize: '1.1rem', color: '#cbd5e1', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>{player.age} Years Old</span>
                            <span>•</span>
                            <span>{player.archetype || 'Balanced'}</span>
                            <span>•</span>
                            <span>{player.height}cm / {player.weight}kg</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '30px' }}>
                    {/* Stats Overview */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#94a3b8' }}>
                            <Activity size={18} /> Season Statistics
                        </h3>
                        {stats ? (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <StatBox label="PPG" value={(stats.points / (stats.gamesPlayed || 1)).toFixed(1)} />
                                <StatBox label="RPG" value={(stats.rebounds / (stats.gamesPlayed || 1)).toFixed(1)} />
                                <StatBox label="APG" value={(stats.assists / (stats.gamesPlayed || 1)).toFixed(1)} />
                                <StatBox label="SPG" value={(stats.steals / (stats.gamesPlayed || 1)).toFixed(1)} />
                                <StatBox label="BPG" value={(stats.blocks / (stats.gamesPlayed || 1)).toFixed(1)} />
                                <StatBox label="FG%" value={((stats.fgMade / stats.fgAttempted || 0) * 100).toFixed(1) + '%'} />
                                <StatBox label="3P%" value={((stats.threeMade / stats.threeAttempted || 0) * 100).toFixed(1) + '%'} />
                                <StatBox label="GP" value={stats.gamesPlayed} />
                            </div>
                        ) : (
                            <div style={{ color: '#64748b', fontStyle: 'italic' }}>No stats available for current context.</div>
                        )}
                    </div>

                    {/* Attributes Grid */}
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#94a3b8' }}>
                            <TrendingUp size={18} /> Attributes
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                            {/* Shooting */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                <div style={{ color: '#64748b', fontWeight: 700, marginBottom: '10px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Shooting</div>
                                <AttributeRow label="Finishing" value={player.attributes.finishing} />
                                <AttributeRow label="Mid-Range" value={player.attributes.midRange} />
                                <AttributeRow label="3-Point" value={player.attributes.threePointShot} />
                                <AttributeRow label="Free Throw" value={player.attributes.freeThrow} />
                            </div>

                            {/* Playmaking */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                <div style={{ color: '#64748b', fontWeight: 700, marginBottom: '10px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Playmaking</div>
                                <AttributeRow label="Passing" value={player.attributes.playmaking} />
                                <AttributeRow label="Ball Handle" value={player.attributes.ballHandling} />
                                <AttributeRow label="IQ" value={player.attributes.basketballIQ} />
                            </div>

                            {/* Defense */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                <div style={{ color: '#64748b', fontWeight: 700, marginBottom: '10px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Defense</div>
                                <AttributeRow label="Interior" value={player.attributes.interiorDefense} />
                                <AttributeRow label="Perimeter" value={player.attributes.perimeterDefense} />
                                <AttributeRow label="Stealing" value={player.attributes.stealing} />
                                <AttributeRow label="Blocking" value={player.attributes.blocking} />
                            </div>

                            {/* Athleticism */}
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                <div style={{ color: '#64748b', fontWeight: 700, marginBottom: '10px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Physical</div>
                                <AttributeRow label="Athleticism" value={player.attributes.athleticism} />
                                <AttributeRow label="Stamina" value={100 - (player.fatigue || 0)} />
                                <AttributeRow label="Off. Rebound" value={player.attributes.offensiveRebound} />
                                <AttributeRow label="Def. Rebound" value={player.attributes.defensiveRebound} />
                            </div>
                        </div>
                    </div>

                    {/* Badge / Personality if needed */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px 16px', borderRadius: '20px', color: '#38bdf8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Award size={14} /> {player.personality}
                        </div>
                        {player.badges && Object.entries(player.badges).map(([name, level]) => (
                            <div key={name} style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '8px 16px', borderRadius: '20px', color: '#fbbf24', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                                {name.replace('_', ' ')} ({level})
                            </div>
                        ))}
                    </div>

                </div>
            </motion.div>
        </div>
    );
};
