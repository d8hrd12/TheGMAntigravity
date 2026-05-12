
import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import type { LocalTalent } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, TrendingUp, BarChart2, Star, ChevronRight, ArrowLeft, Zap, Target, Flame, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { StarRating } from '../../components/StarRating';

interface Props {
    onBack?: () => void;
}

export const EuroLocalTalentView: React.FC<Props> = ({ onBack }) => {
    const { localTalentPool, teams, userTeamId, setGameState, setView, completeOffseasonTask, seasonPhase } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);
    
    const handleFinish = () => {
        if (seasonPhase === 'scouting') {
            completeOffseasonTask('localTalent');
        } else {
            if (onBack) {
                onBack();
            } else {
                setView('dashboard');
            }
        }
    };

    const [selectedTalent, setSelectedTalent] = useState<LocalTalent | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAge, setFilterAge] = useState<number | 'All'>('All');

    const filteredPool = useMemo(() => {
        return localTalentPool
            .filter(p => filterAge === 'All' || p.age === filterAge)
            .filter(p => searchTerm ? (`${p.firstName} ${p.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) : true)
            .sort((a, b) => b.hype - a.hype); // Sort by hype for "discovery" feel
    }, [localTalentPool, filterAge, searchTerm]);

    const handleSignTalent = (talent: LocalTalent) => {
        // European signing is cheap for youth
        const signingFee = 250000; // €250k training compensation
        const salary = 1200000; // Minimum pro salary (€1.2M)
        
        setGameState(prev => {
            const userTeam = prev.teams.find(t => t.id === userTeamId);
            if (!userTeam || userTeam.cash < signingFee) return prev;

            const updatedTalent = { ...talent, teamId: userTeamId };
            
            // Move from pool to main players
            const newPool = prev.localTalentPool.filter(p => p.id !== talent.id);
            
            return {
                ...prev,
                players: [...prev.players, updatedTalent],
                localTalentPool: newPool,
                teams: prev.teams.map(t => t.id === userTeamId ? { ...t, cash: t.cash - signingFee } : t)
            };
        });
        
        setSelectedTalent(null);
    };

    return (
        <div style={{ 
            padding: '24px', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            color: 'var(--text-main)',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, var(--bg-body) 0%, rgba(var(--team-primary-rgb), 0.05) 100%)'
        }}>
            {/* Standardized Header Design */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', color: '#1a2a3a', letterSpacing: '-2px', lineHeight: 1.1 }}>
                    LOCAL<br/>ACADEMIES
                </h1>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8898a8', margin: '16px 0 32px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    EURO DAY 1 • YOUTH SCOUTING
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px', alignItems: 'stretch' }}>
                    {/* Budget Section */}
                    <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '28px', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#8898a8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '1px' }}>BUDGET</div>
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#2ecc71', lineHeight: 1.1 }}>€{((userTeam?.cash || 0) / 1000000).toFixed(1)}M</div>
                    </div>
                    
                    {/* Finish Action */}
                    <button 
                        onClick={handleFinish}
                        style={{ 
                            background: '#004a99', color: '#fff', border: 'none', borderRadius: '28px', 
                            fontSize: '1.4rem', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase',
                            boxShadow: '0 12px 35px rgba(0, 74, 153, 0.3)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 45px rgba(0, 74, 153, 0.4)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 74, 153, 0.3)';
                        }}
                    >
                        FINISH
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                        type="text" 
                        placeholder="Search youth projects..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 500 }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 16, 17, 18].map(age => (
                        <button 
                            key={age}
                            onClick={() => setFilterAge(age as any)}
                            style={{
                                padding: '0 24px',
                                borderRadius: '16px',
                                border: filterAge === age ? '1px solid var(--team-primary)' : '1px solid var(--border-color)',
                                background: filterAge === age ? 'rgba(var(--team-primary-rgb), 0.1)' : 'var(--bg-card)',
                                color: filterAge === age ? 'var(--team-primary)' : 'var(--text-dim)',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {age === 'All' ? 'ANY AGE' : `${age} YO`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Talent Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {filteredPool.map(talent => {
                    const ovr = calculateOverall(talent);
                    const isSuperstar = talent.growthTrend === 'generational';

                    return (
                        <motion.div
                            key={talent.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedTalent(talent)}
                            style={{
                                background: isSuperstar ? 'linear-gradient(135deg, var(--bg-card) 0%, rgba(241, 196, 15, 0.05) 100%)' : 'var(--bg-card)',
                                borderRadius: '28px',
                                border: isSuperstar ? '2px solid rgba(241, 196, 15, 0.3)' : '1px solid var(--border-color)',
                                padding: '24px',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {isSuperstar && (
                                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#f1c40f', color: '#000', padding: '4px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900 }}>
                                    GENERATIONAL
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2px', color: 'var(--text-main)' }}>{talent.firstName} {talent.lastName}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--team-primary)', background: 'rgba(var(--team-primary-rgb), 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{talent.position}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>{talent.age} YEARS OLD</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{ovr}</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 800 }}>RAW OVR</div>
                                </div>
                            </div>

                            {/* Youth League Stats */}
                            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)' }}>YOUTH LEAGUE (LAST 10)</span>
                                    <TrendingUp size={14} color="var(--text-dim)" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{talent.youthStats?.seasonAvg.pts.toFixed(1)}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>PTS</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{talent.youthStats?.seasonAvg.reb.toFixed(1)}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>REB</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{talent.youthStats?.seasonAvg.ast.toFixed(1)}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', fontWeight: 800 }}>AST</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Flame size={16} color={talent.hype > 80 ? '#e67e22' : 'var(--text-dim)'} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: talent.hype > 80 ? '#e67e22' : 'var(--text-dim)' }}>{talent.hype.toFixed(0)} HYPE</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--team-primary)' }}>VIEW PROFILE <ChevronRight size={14} /></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Talent Detail Modal */}
            <AnimatePresence>
                {selectedTalent && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }} onClick={() => setSelectedTalent(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-card)', borderRadius: '32px', overflow: 'hidden' }}
                        >
                            <div style={{ padding: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{selectedTalent.firstName} {selectedTalent.lastName}</h2>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                            <span style={{ fontWeight: 800, color: 'var(--team-primary)' }}>{selectedTalent.position}</span>
                                            <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>{selectedTalent.height}cm • {selectedTalent.weight}kg</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{calculateOverall(selectedTalent)}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>Current Ability</div>
                                    </div>
                                </div>

                                {/* Scouting Report */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Development Trend</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <TrendingUp color={selectedTalent.growthTrend === 'stagnant' ? '#e74c3c' : '#2ecc71'} />
                                            <span style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase' }}>{selectedTalent.growthTrend}</span>
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Potential Ceiling</div>
                                        <StarRating stars={talentStars(selectedTalent.potential)} size={18} />
                                    </div>
                                </div>
 
                                {/* Clues Section */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                                    <div style={{ background: 'rgba(46, 204, 113, 0.05)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#2ecc71', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CheckCircle2 size={14} /> Key Strengths
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {getTalentClues(selectedTalent).good.map((clue, i) => (
                                                <div key={i} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>• {clue}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(231, 76, 60, 0.05)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(231, 76, 60, 0.2)' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#e74c3c', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <AlertCircle size={14} /> Areas to Improve
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {getTalentClues(selectedTalent).bad.map((clue, i) => (
                                                <div key={i} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>• {clue}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Last 10 Performance Chart (Simplified) */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>Last 10 Games (Efficiency)</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
                                        {selectedTalent.youthStats?.last10.map((game, i) => {
                                            const height = (game.pts / 25) * 100;
                                            return (
                                                <div key={i} style={{ flex: 1, background: 'var(--team-primary)', borderRadius: '4px 4px 0 0', height: `${height}%`, opacity: 0.3 + (i * 0.07) }} />
                                            );
                                        })}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button 
                                        onClick={() => setSelectedTalent(null)}
                                        style={{ flex: 1, padding: '18px', borderRadius: '20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-dim)', fontWeight: 800, cursor: 'pointer' }}
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        onClick={() => handleSignTalent(selectedTalent)}
                                        style={{ flex: 2, padding: '18px', borderRadius: '20px', background: 'var(--team-primary)', color: '#fff', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(var(--team-primary-rgb), 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                                    >
                                        <Zap size={20} /> SIGN TO ACADEMY
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const talentStars = (potential: number) => {
    if (potential >= 95) return 5;
    if (potential >= 88) return 4.5;
    if (potential >= 82) return 4;
    if (potential >= 75) return 3.5;
    if (potential >= 68) return 3;
    return 2;
};
 
const getTalentClues = (talent: LocalTalent) => {
    const attr = talent.attributes;
    const clues: { attr: string, val: number, good: string, bad: string }[] = [
        { attr: 'finishing', val: attr.finishing, good: "Natural finisher near the rim", bad: "Lacks touch on layups" },
        { attr: 'midRange', val: attr.midRange, good: "Efficient mid-range scorer", bad: "Inconsistent from mid-range" },
        { attr: 'threePointShot', val: attr.threePointShot, good: "Sharpshooting potential", bad: "Unreliable outside shot" },
        { attr: 'playmaking', val: attr.playmaking, good: "Advanced court vision", bad: "Prone to passing errors" },
        { attr: 'ballHandling', val: attr.ballHandling, good: "Exceptional ball security", bad: "Loose ball handling" },
        { attr: 'interiorDefense', val: attr.interiorDefense, good: "Tough interior presence", bad: "Weak post defense" },
        { attr: 'perimeterDefense', val: attr.perimeterDefense, good: "High-level perimeter stopper", bad: "Slow lateral movement" },
        { attr: 'stealing', val: attr.stealing, good: "Quick hands on defense", bad: "Reaches too often" },
        { attr: 'blocking', val: attr.blocking, good: "Great shot-blocking timing", bad: "Poor defensive timing" },
        { attr: 'athleticism', val: attr.athleticism, good: "Elite athletic frame", bad: "Below-average mobility" },
        { attr: 'basketballIQ', val: attr.basketballIQ, good: "High basketball intelligence", bad: "Mental lapses on court" },
        { attr: 'defensiveRebound', val: attr.defensiveRebound, good: "Secures the defensive boards", bad: "Gives up second chances" }
    ];
 
    const sorted = [...clues].sort((a, b) => b.val - a.val);
    const good = sorted.slice(0, 3).map(c => c.good);
    const bad = sorted.slice(-3).reverse().map(c => c.bad);
 
    return { good, bad };
};
