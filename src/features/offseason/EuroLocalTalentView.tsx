import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import type { LocalTalent } from '../../store/GameContext';
import type { Player } from '../../models/Player';
import { calculateOverall } from '../../utils/playerUtils';
import { generateUUID } from '../../utils/uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Users, TrendingUp, BarChart2, Star, ChevronRight, 
    ArrowLeft, Zap, Target, Flame, Info, CheckCircle2, 
    AlertCircle, Coins, Sparkles, UserPlus, ShieldAlert, Award, Trash2 
} from 'lucide-react';
import { StarRating } from '../../components/StarRating';
import { PageHeader } from '../ui/PageHeader';

interface Props {
    onBack?: () => void;
}

export const EuroLocalTalentView: React.FC<Props> = ({ onBack }) => {
    const { 
        localTalentPool, players, contracts, date, teams, userTeamId, 
        setGameState, setView, completeOffseasonTask, seasonPhase 
    } = useGame();
    
    const userTeam = teams.find(t => t.id === userTeamId);
    
    // Filter out our active academy roster players
    const academyPlayers = useMemo(() => {
        return players.filter(p => p.isAcademy && p.teamId === userTeamId);
    }, [players, userTeamId]);

    const handleFinish = async () => {
        if (seasonPhase === 'scouting') {
            const { simulateEuroAI_LocalTalentDraft } = await import('../team/EuroAIGMModule');
            
            setGameState(prev => {
                const { updatedTeams, updatedPlayers, updatedContracts, remainingPool } = simulateEuroAI_LocalTalentDraft(
                    prev.teams,
                    prev.localTalentPool,
                    prev.players,
                    prev.contracts,
                    prev.date.getFullYear()
                );

                return {
                    ...prev,
                    teams: updatedTeams,
                    players: updatedPlayers,
                    contracts: updatedContracts,
                    localTalentPool: remainingPool
                };
            });

            completeOffseasonTask('localTalent');
        } else {
            if (onBack) {
                onBack();
            } else {
                setView('dashboard');
            }
        }
    };

    const [selectedTalent, setSelectedTalent] = useState<LocalTalent | Player | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAge, setFilterAge] = useState<number | 'All'>('All');

    // Recruitment Pool filter (Offseason mode)
    const filteredPool = useMemo(() => {
        return localTalentPool
            .filter(p => filterAge === 'All' || p.age === filterAge)
            .filter(p => searchTerm ? (`${p.firstName} ${p.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) : true)
            .sort((a, b) => b.hype - a.hype); // Sort by hype for "discovery" feel
    }, [localTalentPool, filterAge, searchTerm]);

    // Sign a player into the Youth Academy (Offseason recruit mode)
    const handleSignToAcademy = (talent: LocalTalent) => {
        const signingFee = 250000; // €250k training compensation
        
        setGameState(prev => {
            const team = prev.teams.find(t => t.id === userTeamId);
            if (!team || team.cash < signingFee) {
                alert("Insufficient cash to recruit this talent to your academy!");
                return prev;
            }

            const updatedTalent: Player = {
                ...talent,
                teamId: userTeamId,
                isAcademy: true,
                academyFunding: 0
            };
            
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

    // Change funding level for academy player
    const handleSetFunding = (player: Player, newFunding: number) => {
        const currentFunding = player.academyFunding || 0;
        const diff = newFunding - currentFunding;

        setGameState(prev => {
            const team = prev.teams.find(t => t.id === userTeamId);
            if (!team) return prev;

            if (diff > 0 && team.cash < diff) {
                alert("Insufficient team funds to upgrade this training program!");
                return prev;
            }

            return {
                ...prev,
                players: prev.players.map(p => p.id === player.id ? { ...p, academyFunding: newFunding } : p),
                teams: prev.teams.map(t => t.id === userTeamId ? { ...t, cash: t.cash - diff } : t)
            };
        });

        // Sync local selected talent state if open
        if (selectedTalent && selectedTalent.id === player.id) {
            setSelectedTalent(prev => prev ? { ...prev, academyFunding: newFunding } as any : null);
        }
    };

    // Sign academy player to active pro roster (cheap 3-year contract, €200k/year)
    const handleSignToPro = (player: Player) => {
        const salary = 200000; // €200k pro rookie salary
        const years = 3;

        setGameState(prev => {
            const team = prev.teams.find(t => t.id === userTeamId);
            if (!team) return prev;

            const updatedPlayer: Player = {
                ...player,
                isAcademy: false, // Move from academy to active roster
                acquisition: {
                    type: 'free_agent',
                    year: new Date(prev.date).getFullYear(),
                    details: 'Academy Graduate'
                }
            };

            const newContract = {
                id: generateUUID(),
                playerId: player.id,
                teamId: userTeamId,
                amount: salary,
                yearsLeft: years,
                startYear: new Date(prev.date).getFullYear(),
                role: 'Prospect' as const
            };

            return {
                ...prev,
                players: prev.players.map(p => p.id === player.id ? updatedPlayer : p),
                contracts: [...prev.contracts, newContract],
                teams: prev.teams.map(t => t.id === userTeamId ? { ...t, rosterIds: [...t.rosterIds, player.id] } : t)
            };
        });

        setSelectedTalent(null);
    };

    // Release academy player into general free agent pool
    const handleReleaseTalent = (player: Player) => {
        const confirmRelease = window.confirm(`Are you sure you want to release ${player.firstName} ${player.lastName}? They will enter the general free agency pool.`);
        if (!confirmRelease) return;

        setGameState(prev => {
            return {
                ...prev,
                players: prev.players.map(p => p.id === player.id ? { ...p, isAcademy: false, teamId: null } : p)
            };
        });

        setSelectedTalent(null);
    };

    // Determine current phase view
    const isOffseasonRecruit = seasonPhase === 'scouting';

    return (
        <div style={{ 
            background: 'var(--bg-main)',
            minHeight: '100vh',
            color: 'var(--text-main)',
            paddingTop: '24px'
        }}>
            <PageHeader
                title={isOffseasonRecruit ? "Academy Recruitment" : "Youth Academy Hub"}
                subtitle={isOffseasonRecruit ? "Euro Day 1 • Scout prospects into academy" : `Cohort Year ${date.getFullYear()} • Background Talent Development`}
                onBack={onBack || (() => setView('dashboard'))}
                teamColor={userTeam?.colors?.primary}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'stretch' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '1.5px' }}>AVAILABLE CAPITAL</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2ecc71', lineHeight: 1.1 }}>€{((userTeam?.cash || 0) / 1000000).toFixed(2)}M</div>
                    </div>
                    
                    <button 
                        onClick={handleFinish}
                        style={{ 
                            background: 'var(--team-primary)', color: '#fff', border: 'none', borderRadius: '20px', 
                            fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase',
                            boxShadow: '0 8px 25px rgba(var(--team-primary-rgb), 0.25)', transition: 'all 0.3s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '1px'
                        }}
                    >
                        {isOffseasonRecruit ? "FINISH DRAFT" : "RETURN TO BOARD"}
                    </button>
                </div>
            </PageHeader>

            <div style={{ padding: '0 24px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            {isOffseasonRecruit ? (
                /* --- OFFSEASON SCOUTING/RECRUITING MODE --- */
                <>
                    <div style={{ background: 'linear-gradient(135deg, rgba(var(--team-primary-rgb), 0.1) 0%, rgba(0,0,0,0.2) 100%)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(var(--team-primary-rgb), 0.2)', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ background: 'var(--team-primary)', padding: '12px', borderRadius: '16px', color: '#fff' }}>
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 900 }}>Recruit to Academy</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                                    Sign these highly touted domestic prospects into your Youth Academy for a developmental fee of <strong>€250k</strong>. Allocate cash to groom them until they are 18 and ready for the pros!
                                </p>
                            </div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
                </>
            ) : (
                /* --- ACTIVE REGULAR SEASON YOUTH ACADEMY HUB --- */
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.08) 0%, rgba(0,0,0,0.2) 100%)', borderRadius: '28px', padding: '28px', border: '1px solid rgba(46, 204, 113, 0.2)', width: '100%' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 900, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Award size={22} /> Background Development
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                                These prospects are training intensely in your club's youth academy. You can allocate <strong>€100k - €500k</strong> of cash to fund customized training regimens. 
                                Cash allocated increases their end-of-season attribute boosts! Once a player turns <strong>18 years old</strong>, you can sign them to a cheap pro contract.
                            </p>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '28px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Academy Capacity</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>Active Domestic Roster</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{academyPlayers.length}</span>
                                <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)', fontWeight: 700 }}>/ 5 PLAYERS MAX</span>
                            </div>
                        </div>
                    </div>

                    {academyPlayers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: '32px', border: '1px dashed var(--border-color)' }}>
                            <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.02)', padding: '24px', borderRadius: '50%', marginBottom: '24px', color: 'var(--text-dim)' }}>
                                <Users size={48} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 8px 0' }}>Your Youth Academy is Empty</h3>
                            <p style={{ maxWidth: '500px', margin: '0 auto 24px', fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                                You don't have any local domestic prospects currently in training. During the Offseason Scouting Phase, you can recruit new raw young stars into your academy pool!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                            {academyPlayers.map(prospect => {
                                const ovr = calculateOverall(prospect);
                                const currentFunding = prospect.academyFunding || 0;
                                const isSuperstar = prospect.potential >= 88;

                                return (
                                    <motion.div
                                        key={prospect.id}
                                        whileHover={{ y: -4 }}
                                        style={{
                                            background: isSuperstar ? 'linear-gradient(135deg, var(--bg-card) 0%, rgba(241, 196, 15, 0.03) 100%)' : 'var(--bg-card)',
                                            borderRadius: '28px',
                                            border: isSuperstar ? '2px solid rgba(241, 196, 15, 0.25)' : '1px solid var(--border-color)',
                                            padding: '24px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 4px 0' }}>{prospect.firstName} {prospect.lastName}</h3>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--team-primary)', background: 'rgba(var(--team-primary-rgb), 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{prospect.position}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>{prospect.age} YO • ACADEMY</span>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{ovr}</div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 800 }}>RAW OVR</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '4px' }}>DEVELOPMENT</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2ecc71', textTransform: 'uppercase' }}>{(prospect as any).growthTrend || 'Steady'}</div>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '4px' }}>POTENTIAL CEILING</div>
                                                <StarRating stars={talentStars(prospect.potential)} size={14} />
                                            </div>
                                        </div>

                                        {/* Training Program Selector */}
                                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Coins size={14} /> SEASON TRAINING BUDGET
                                                </span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: currentFunding > 0 ? '#2ecc71' : 'var(--text-dim)' }}>
                                                    {currentFunding > 0 ? `€${(currentFunding/1000).toFixed(0)}k Allocated` : 'No Program'}
                                                </span>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                                                {[
                                                    { level: 0, label: 'NONE', cost: 0, color: 'var(--text-dim)' },
                                                    { level: 100000, label: 'BRONZE', cost: 100000, color: '#cd7f32' },
                                                    { level: 250000, label: 'SILVER', cost: 250000, color: '#bdc3c7' },
                                                    { level: 500000, label: 'GOLD', cost: 500000, color: '#f1c40f' }
                                                ].map(prog => (
                                                    <button
                                                        key={prog.cost}
                                                        onClick={() => handleSetFunding(prospect, prog.cost)}
                                                        style={{
                                                            padding: '10px 4px',
                                                            borderRadius: '12px',
                                                            border: currentFunding === prog.cost ? `2px solid ${prog.color}` : '1px solid var(--border-color)',
                                                            background: currentFunding === prog.cost ? `rgba(255,255,255,0.03)` : 'transparent',
                                                            color: currentFunding === prog.cost ? '#fff' : 'var(--text-dim)',
                                                            fontWeight: 900,
                                                            fontSize: '0.65rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <div style={{ color: prog.color, marginBottom: '2px' }}>{prog.label}</div>
                                                        <div style={{ fontSize: '0.55rem', opacity: 0.7 }}>{prog.cost > 0 ? `€${(prog.cost/1000).toFixed(0)}k` : 'FREE'}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions Row */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                                            <button 
                                                onClick={() => handleReleaseTalent(prospect)}
                                                style={{ 
                                                    flex: '1 1 auto', padding: '10px 12px', borderRadius: '16px', 
                                                    background: 'rgba(231, 76, 60, 0.05)', color: '#e74c3c', 
                                                    border: '1px solid rgba(231, 76, 60, 0.1)', cursor: 'pointer',
                                                    fontWeight: 800, fontSize: '0.75rem', display: 'flex', 
                                                    alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                }}
                                            >
                                                <Trash2 size={16} /> RELEASE
                                            </button>

                                            {prospect.age >= 18 ? (
                                                <button 
                                                    onClick={() => handleSignToPro(prospect)}
                                                    style={{ 
                                                        flex: '2 1 auto', padding: '10px 12px', borderRadius: '16px', 
                                                        background: 'var(--team-primary)', color: '#fff', 
                                                        border: 'none', cursor: 'pointer',
                                                        fontWeight: 900, fontSize: '0.75rem', display: 'flex', 
                                                        alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                        boxShadow: '0 4px 15px rgba(var(--team-primary-rgb), 0.2)',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <UserPlus size={16} /> SIGN TO PRO (3Y)
                                                </button>
                                            ) : (
                                                <div style={{ 
                                                    flex: '2 1 auto', padding: '10px 12px', borderRadius: '16px', 
                                                    background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', 
                                                    border: '1px solid var(--border-color)',
                                                    fontWeight: 700, fontSize: '0.7rem', display: 'flex', 
                                                    alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                    textAlign: 'center'
                                                }}>
                                                    <ShieldAlert size={14} /> WAIT UNTIL 18
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setSelectedTalent(prospect)}
                                                style={{ 
                                                    flex: '1 1 auto', padding: '10px 12px', borderRadius: '16px', 
                                                    background: 'rgba(255,255,255,0.02)', color: 'var(--text-main)', 
                                                    border: '1px solid var(--border-color)', cursor: 'pointer',
                                                    fontWeight: 800, fontSize: '0.75rem', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                PROFILE
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Talent Detail Modal */}
            <AnimatePresence>
                {selectedTalent && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                    }} onClick={() => setSelectedTalent(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            style={{ 
                                width: '95%', 
                                maxWidth: '520px', 
                                maxHeight: '85vh',
                                background: 'var(--bg-card)', 
                                borderRadius: '24px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                overflow: 'hidden',
                                border: '1px solid var(--border-color)' 
                            }}
                        >
                            {/* Scrollable Content Container */}
                            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>{selectedTalent.firstName} {selectedTalent.lastName}</h2>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                                            <span style={{ fontWeight: 800, color: 'var(--team-primary)', fontSize: '0.85rem' }}>{selectedTalent.position}</span>
                                            <span style={{ color: 'var(--text-dim)', fontWeight: 700, fontSize: '0.85rem' }}>{selectedTalent.height}cm • {selectedTalent.weight}kg</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 900 }}>{calculateOverall(selectedTalent)}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>Current Ability</div>
                                    </div>
                                </div>

                                {/* Scouting Report */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Development Trend</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <TrendingUp size={16} color={(selectedTalent as any).growthTrend === 'stagnant' ? '#e74c3c' : '#2ecc71'} />
                                            <span style={{ fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase' }}>{(selectedTalent as any).growthTrend || 'Steady'}</span>
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Potential Ceiling</div>
                                        <StarRating stars={talentStars(selectedTalent.potential)} size={16} />
                                    </div>
                                </div>
 
                                {/* Clues Section */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                    <div style={{ background: 'rgba(46, 204, 113, 0.04)', padding: '16px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.15)' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#2ecc71', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CheckCircle2 size={12} /> Key Strengths
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {getTalentClues(selectedTalent).good.map((clue, i) => (
                                                <div key={i} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>• {clue}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(231, 76, 60, 0.04)', padding: '16px', borderRadius: '20px', border: '1px solid rgba(231, 76, 60, 0.15)' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#e74c3c', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <AlertCircle size={12} /> Areas to Improve
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {getTalentClues(selectedTalent).bad.map((clue, i) => (
                                                <div key={i} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.4' }}>• {clue}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Last 10 Performance Table */}
                                {(selectedTalent as any).youthStats?.last10 && (selectedTalent as any).youthStats.last10.length > 0 && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>Last 10 Games Performance</div>
                                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.2fr', 
                                                padding: '8px 12px', 
                                                background: 'rgba(255, 255, 255, 0.03)', 
                                                borderBottom: '1px solid var(--border-color)',
                                                fontSize: '0.6rem', 
                                                color: 'var(--text-dim)', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase' 
                                            }}>
                                                <div>Game</div>
                                                <div style={{ textAlign: 'center' }}>PTS</div>
                                                <div style={{ textAlign: 'center' }}>REB</div>
                                                <div style={{ textAlign: 'center' }}>AST</div>
                                                <div style={{ textAlign: 'right' }}>FG%</div>
                                            </div>
                                            <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                                {(selectedTalent as any).youthStats.last10.map((game: any, i: number) => (
                                                    <div key={i} style={{ 
                                                        display: 'grid', 
                                                        gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.2fr', 
                                                        padding: '8px 12px', 
                                                        borderBottom: i === (selectedTalent as any).youthStats.last10.length - 1 ? 'none' : '1px solid var(--border-color)',
                                                        fontSize: '0.75rem',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Game #{(selectedTalent as any).youthStats.last10.length - i}</div>
                                                        <div style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-main)' }}>{game.pts.toFixed(1)}</div>
                                                        <div style={{ textAlign: 'center', fontWeight: 600 }}>{game.reb.toFixed(1)}</div>
                                                        <div style={{ textAlign: 'center', fontWeight: 600 }}>{game.ast.toFixed(1)}</div>
                                                        <div style={{ textAlign: 'right', fontWeight: 700, color: '#2ecc71' }}>{game.fgp.toFixed(0)}%</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions Container (Fixed bottom) */}
                            <div style={{ padding: '16px 24px 24px', borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', gap: '12px' }}>
                                <button 
                                    onClick={() => setSelectedTalent(null)}
                                    style={{ flex: 1, padding: '14px', borderRadius: '16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-dim)', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                                >
                                    CLOSE
                                </button>

                                {isOffseasonRecruit ? (
                                    <button 
                                        onClick={() => handleSignToAcademy(selectedTalent as LocalTalent)}
                                        style={{ flex: 2, padding: '14px', borderRadius: '16px', background: 'var(--team-primary)', color: '#fff', border: 'none', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(var(--team-primary-rgb), 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Zap size={16} /> SIGN TO ACADEMY
                                    </button>
                                ) : selectedTalent.isAcademy && selectedTalent.age >= 18 ? (
                                    <button 
                                        onClick={() => handleSignToPro(selectedTalent as Player)}
                                        style={{ flex: 2, padding: '14px', borderRadius: '16px', background: 'var(--team-primary)', color: '#fff', border: 'none', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(var(--team-primary-rgb), 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <UserPlus size={16} /> SIGN (€200k/Yr)
                                    </button>
                                ) : null}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </div>
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
 
const getTalentClues = (talent: LocalTalent | Player) => {
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
