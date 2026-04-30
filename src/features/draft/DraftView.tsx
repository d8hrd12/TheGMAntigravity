import React from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import { getPlayerTradeValue } from '../trade/TradeLogic';
import { getPotentialGrade } from '../../utils/playerUtils';
import { getFuzzyPotential } from '../../utils/scoutingUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { useGame } from '../../store/GameContext';

interface DraftViewProps {
    draftClass: Player[];
    draftOrder: string[]; // Team IDs
    teams: Team[];
    userTeamId: string;
    onPick: (playerId: string) => void;
    onSimulateNext: () => void;
    onSimulateToUser: () => void;
    onFinish: () => void;
    onSelectPlayer: (id: string) => void;
}

export const DraftView: React.FC<DraftViewProps> = ({ draftClass, draftOrder, teams, userTeamId, onPick, onSimulateNext, onSimulateToUser, onFinish, onSelectPlayer }) => {
    const {
        scoutingReports,
        gmProfile,
        players,
        date
    } = useGame();

    const currentYear = date.getFullYear();
    
    const userTeamBaseline = React.useMemo(() => {
        const teamPlayers = players.filter(p => p.teamId === userTeamId);
        return calculateTeamBaseline(teamPlayers);
    }, [players, userTeamId]);
    const [showScoutedOnly, setShowScoutedOnly] = React.useState(false);
    const [filterPos, setFilterPos] = React.useState('All');
    const currentTeamId = draftOrder[0];
    const currentTeam = teams.find(t => t.id === currentTeamId);
    const isUserTurn = currentTeamId === userTeamId;

    // GM Perk: Scouting
    let autoRevealCount = 0;
    if (gmProfile?.unlockedPerks?.includes('scout_2')) autoRevealCount = 3;
    else if (gmProfile?.unlockedPerks?.includes('scout_1')) autoRevealCount = 1;

    // Sort draft class by "Scouted Value" (using trade value logic as proxy)
    // receivingTeam=null, contracts=[], roster=[] for generic rank
    let rankedProspects = [...draftClass].sort((a, b) => getPlayerTradeValue(b, null, [], []) - getPlayerTradeValue(a, null, [], []));

    if (showScoutedOnly) {
        rankedProspects = rankedProspects.filter((p, idx) =>
            (scoutingReports[userTeamId]?.[p.id]?.points || 0) > 0 || (idx < autoRevealCount)
        );
    }

    // Position Filter
    if (filterPos !== 'All') {
        rankedProspects = rankedProspects.filter(p => p.position === filterPos);
    }

    if (draftOrder.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>The Draft is Complete!</h2>
                <button
                    onClick={onFinish}
                    className="btn-primary"
                    style={{ marginTop: '20px', padding: '15px 30px', fontSize: '1.2rem' }}>
                    View Draft Summary
                </button>
            </div>
        )
    }

    return (
        <div style={{ 
            background: '#050505', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
            color: '#fff',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Ambient Background Glows */}
            <div style={{ position: 'fixed', top: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(255, 95, 31, 0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: '400px', height: '400px', background: 'rgba(52, 152, 219, 0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Header Area */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '40px',
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div>
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: 950, 
                        margin: 0, 
                        lineHeight: 1,
                        letterSpacing: '-3px',
                        textTransform: 'uppercase',
                        background: 'linear-gradient(to bottom, #fff 50%, #888 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {currentYear} <span style={{ WebkitTextFillColor: 'initial', color: '#FF5F1F' }}>DRAFT</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 700 }}>
                        The Future Starts Now
                    </p>
                </div>
                
                {!isUserTurn && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={onSimulateNext}
                            style={{ 
                                padding: '12px 24px', 
                                background: 'rgba(255,255,255,0.05)', 
                                color: '#fff', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '12px', 
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                            Skip Pick
                        </button>
                        <button
                            onClick={onSimulateToUser}
                            className="btn-primary"
                            style={{ 
                                padding: '12px 24px', 
                                fontWeight: 800,
                                borderRadius: '12px',
                                boxShadow: '0 8px 20px var(--primary-glow)'
                            }}>
                            Skip to My Pick &rarr;
                        </button>
                    </div>
                )}
            </div>

            {/* Current Pick Status */}
            <div style={{
                background: isUserTurn ? 'linear-gradient(90deg, var(--team-primary), transparent)' : 'rgba(255,255,255,0.03)',
                padding: '20px 25px',
                borderRadius: '20px',
                border: isUserTurn ? '1px solid var(--team-primary)' : '1px solid rgba(255,255,255,0.1)',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: isUserTurn ? '0 0 40px rgba(var(--team-primary-rgb), 0.2)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 900, 
                        color: isUserTurn ? '#fff' : 'var(--text-dim)',
                        opacity: 0.5
                    }}>
                        #{draftOrder.indexOf(currentTeamId) + 1}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: isUserTurn ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)' }}>
                            Now On The Clock
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                            {currentTeam?.city} {currentTeam?.name}
                        </div>
                    </div>
                </div>
                {isUserTurn && (
                    <div style={{ 
                        background: '#fff', 
                        color: '#000', 
                        padding: '8px 20px', 
                        borderRadius: '100px', 
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        animation: 'pulse 2s infinite'
                    }}>
                        YOUR PICK
                    </div>
                )}
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                        <button
                            key={pos}
                            onClick={() => setFilterPos(pos)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                background: filterPos === pos ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: filterPos === pos ? '#fff' : 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                transition: 'all 0.2s'
                            }}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={() => setShowScoutedOnly(!showScoutedOnly)}
                    style={{
                        padding: '10px 20px',
                        background: showScoutedOnly ? 'var(--team-primary)' : 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700
                    }}
                >
                    {showScoutedOnly ? '✨ Scouted Only' : '👤 All Prospects'}
                </button>
            </div>

            {/* Prospects Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: '20px',
                paddingBottom: '40px'
            }}>
                {rankedProspects.map((p, idx) => {
                    const ovr = calculateOverall(p);
                    const report = scoutingReports[userTeamId]?.[p.id];
                    const isRevealed = report?.isPotentialRevealed || (autoRevealCount > 0 && idx < autoRevealCount);
                    const potGrade = getFuzzyPotential(p.potential, report?.points || 0);

                    return (
                        <div key={p.id} className="draft-card" style={{
                            background: 'rgba(255,255,255,0.03)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '24px',
                            padding: '24px',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                        }}>
                            {/* Card Accent Glow */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: '#FF5F1F',
                                opacity: 0.1,
                                filter: 'blur(40px)',
                                borderRadius: '50%'
                            }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', zIndex: 1 }}>
                                <div onClick={() => onSelectPlayer(p.id)} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--team-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>
                                        {p.position} • Prospect
                                    </div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                                        {p.firstName} <span style={{ opacity: 0.7 }}>{p.lastName.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Projected</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>#{idx + 1}</div>
                                </div>
                            </div>

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                padding: '16px',
                                borderRadius: '20px',
                                marginBottom: '24px',
                                zIndex: 1
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px' }}>Skill Level</div>
                                    <StarRating stars={calculateStars(ovr, userTeamBaseline)} size={12} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px' }}>Ceiling</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isRevealed ? 'var(--team-primary)' : '#fff' }}>
                                        {potGrade}
                                    </div>
                                </div>
                            </div>

                            {isUserTurn && (
                                <button
                                    onClick={() => onPick(p.id)}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        fontWeight: 900,
                                        fontSize: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        boxShadow: '0 10px 25px rgba(var(--team-primary-rgb), 0.3)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                        marginTop: 'auto'
                                    }}>
                                    Draft This Player
                                </button>
                            )}

                            <style>{`
                                .draft-card:hover {
                                    transform: translateY(-12px) scale(1.02);
                                    background: rgba(255,255,255,0.04);
                                    border-color: rgba(var(--team-primary-rgb), 0.5);
                                    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                                }
                                .draft-card:hover::after {
                                    content: '';
                                    position: absolute;
                                    inset: 0;
                                    border-radius: 32px;
                                    padding: 2px;
                                    background: linear-gradient(135deg, var(--team-primary), transparent);
                                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                                    -webkit-mask-composite: xor;
                                    mask-composite: exclude;
                                    pointer-events: none;
                                }
                                @keyframes pulse {
                                    0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
                                    70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
                                    100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
                                }
                            `}</style>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
