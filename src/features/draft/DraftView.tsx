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
import { PageHeader } from '../ui/PageHeader';

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

    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return (
        <div style={{ 
            background: 'var(--bg-main)', 
            minHeight: '100vh',
            color: 'var(--text-main)',
            overflowY: 'auto'
        }}>
            <PageHeader
                title={`${currentYear} NBA Draft`}
                subtitle="The Future Starts Now"
                onBack={onFinish}
                backLabel="Exit"
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            />

            <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
                {!isUserTurn && (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                        <button
                            onClick={onSimulateNext}
                            style={{ 
                                padding: '12px 24px', 
                                background: '#ffffff', 
                                color: '#111111', 
                                border: '1px solid #eeeeee', 
                                borderRadius: '12px', 
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                            Skip Pick
                        </button>
                        <button
                            onClick={onSimulateToUser}
                            className="btn-primary"
                            style={{ 
                                padding: '12px 24px', 
                                fontWeight: 700,
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)'
                            }}>
                            Skip to My Pick &rarr;
                        </button>
                    </div>
                )}

                {/* Current Pick Status */}
                <div style={{
                    background: isUserTurn ? '#f2f2f7' : '#ffffff',
                    padding: '24px',
                    borderRadius: '24px',
                    border: '1px solid #eeeeee',
                    marginBottom: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: 800, 
                            color: '#111111',
                            opacity: 0.2
                        }}>
                            {getOrdinal(draftOrder.indexOf(currentTeamId) + 1)}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.85rem', color: '#8e8e93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Round {getOrdinal(Math.ceil((60 - draftOrder.length + 1) / 30))} • Pick {60 - draftOrder.length + 1}
                            </div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
                                {currentTeam?.city} {currentTeam?.name} <span style={{ color: '#8e8e93', fontWeight: 500 }}>is on the clock</span>
                            </div>
                        </div>
                    </div>
                    {isUserTurn && (
                        <div style={{ 
                            background: '#007aff', 
                            color: '#ffffff', 
                            padding: '6px 16px', 
                            borderRadius: '100px', 
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            YOUR TURN
                        </div>
                    )}
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', background: '#f2f2f7', padding: '4px', borderRadius: '12px' }}>
                        {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                            <button
                                key={pos}
                                onClick={() => setFilterPos(pos)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: filterPos === pos ? '#ffffff' : 'transparent',
                                    color: filterPos === pos ? '#111111' : '#8e8e93',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: filterPos === pos ? 700 : 500,
                                    transition: 'all 0.2s',
                                    boxShadow: filterPos === pos ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => setShowScoutedOnly(!showScoutedOnly)}
                        style={{
                            padding: '10px 18px',
                            background: showScoutedOnly ? '#111111' : '#ffffff',
                            color: showScoutedOnly ? '#ffffff' : '#111111',
                            border: '1px solid #eeeeee',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                    >
                        {showScoutedOnly ? '✨ Scouted' : '👤 All Prospects'}
                    </button>
                </div>

                {/* Prospects Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '20px',
                        paddingBottom: 'calc(60px + env(safe-area-inset-bottom))'
                    }}>
                    {rankedProspects.map((p, idx) => {
                        const ovr = calculateOverall(p);
                        const report = scoutingReports[userTeamId]?.[p.id];
                        const isRevealed = report?.isPotentialRevealed || (autoRevealCount > 0 && idx < autoRevealCount);
                        const potGrade = getFuzzyPotential(p.potential, report?.points || 0);

                        return (
                            <div key={p.id} style={{
                                background: '#ffffff',
                                border: '1px solid #eeeeee',
                                borderRadius: '24px',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                transition: 'all 0.2s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                            }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div onClick={() => onSelectPlayer(p.id)} style={{ cursor: 'pointer' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#007aff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                            {p.position}
                                        </div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
                                            {p.firstName} <span style={{ fontWeight: 500, color: '#8e8e93' }}>{p.lastName.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111111' }}>#{idx + 1}</div>
                                        <div style={{ fontSize: '0.6rem', color: '#8e8e93', textTransform: 'uppercase', fontWeight: 700 }}>Rank</div>
                                    </div>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr', 
                                    gap: '12px',
                                    background: '#f9f9f9',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    marginBottom: '20px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', color: '#8e8e93', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Current</div>
                                        <StarRating stars={calculateStars(ovr, userTeamBaseline)} size={10} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', color: '#8e8e93', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Potential</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isRevealed ? '#007aff' : '#111111' }}>
                                            {potGrade}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelectPlayer(p.id); }}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '12px',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            background: '#ffffff',
                                            border: '1px solid #eeeeee',
                                            color: '#111111',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Profile
                                    </button>
                                    {isUserTurn && (
                                        <button
                                            onClick={() => onPick(p.id)}
                                            className="btn-primary"
                                            style={{
                                                flex: 2,
                                                padding: '12px',
                                                borderRadius: '12px',
                                                fontWeight: 800,
                                                fontSize: '0.85rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.02em',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Draft
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
