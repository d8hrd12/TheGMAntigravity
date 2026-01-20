import React from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import { getPlayerTradeValue } from '../trade/TradeLogic';
import { getPotentialGrade } from '../../utils/playerUtils';
import { useGame } from '../../store/GameContext'; // Better to use context here for scouting data

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
    const { scoutingReports, gmProfile } = useGame();
    const [showScoutedOnly, setShowScoutedOnly] = React.useState(false);
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
            scoutingReports[userTeamId]?.[p.id]?.isPotentialRevealed || (idx < autoRevealCount)
        );
    }

    if (draftOrder.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>The Draft is Complete!</h2>
                <button
                    onClick={onFinish}
                    className="btn-primary"
                    style={{ marginTop: '20px', padding: '15px 30px', fontSize: '1.2rem' }}>
                    Start Regular Season
                </button>
            </div>
        )
    }

    return (
        <div style={{ background: 'var(--background)', minHeight: '100%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>
                    The Draft - {isUserTurn ? <span style={{ color: 'var(--primary)' }}>Your Pick!</span> : <span style={{ color: 'var(--text-secondary)' }}>{currentTeam?.city} Picking...</span>}
                </h2>
                {!isUserTurn && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={onSimulateNext}
                            style={{ padding: '10px 20px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
                            Simulate Next
                        </button>
                        <button
                            onClick={onSimulateToUser}
                            className="btn-primary"
                            style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                            Skip to My Pick &rarr;
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => setShowScoutedOnly(!showScoutedOnly)}
                        style={{
                            padding: '6px 12px',
                            background: showScoutedOnly ? 'var(--primary)' : 'var(--surface)',
                            color: showScoutedOnly ? 'white' : 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {showScoutedOnly ? 'Showing Scouted Only' : 'Show Scouted Only'}
                    </button>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {rankedProspects.length} Players Available
                </div>
            </div>

            {/* User Picks Summary */}
            <div style={{ marginBottom: '15px', padding: '10px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--primary)' }}>
                <span style={{ color: 'var(--text-secondary)', marginRight: '10px' }}>Your Upcoming Picks:</span>
                {draftOrder
                    .map((tid, idx) => ({ tid, pick: idx + 1 }))
                    .filter(x => x.tid === userTeamId)
                    .map(x => (
                        <span key={x.pick} style={{ marginRight: '15px', fontWeight: 'bold', color: x.pick === (draftOrder.indexOf(currentTeamId) + 1) ? 'var(--primary)' : 'white' }}>
                            Pick {x.pick}
                        </span>
                    ))
                }
                {draftOrder.filter(tid => tid === userTeamId).length === 0 && (
                    <span style={{ color: '#aaa', fontStyle: 'italic' }}>No picks remaining</span>
                )}
            </div>

            {/* Top Bar: Upcoming Picks Ticker */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                scrollbarWidth: 'none'
            }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)', marginRight: '10px' }}>Upcoming:</span>
                {draftOrder.slice(0, 15).map((teamId, idx) => {
                    const team = teams.find(t => t.id === teamId);
                    const isNext = idx === 0;
                    return (
                        <div key={idx} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '8px 16px',
                            background: isNext ? 'var(--primary-glow)' : 'var(--surface-glass)',
                            border: isNext ? '1px solid var(--primary)' : '1px solid var(--border)',
                            borderRadius: '20px',
                            color: teamId === userTeamId ? 'var(--primary)' : 'var(--text)',
                            fontWeight: isNext ? 'bold' : 'normal',
                            minWidth: 'max-content'
                        }}>
                            <span style={{ color: 'var(--text-secondary)', marginRight: '8px', fontSize: '0.8rem' }}>{idx + 1}.</span>
                            {team?.city} {team?.name}
                        </div>
                    )
                })}
            </div>

            {/* Player List (Card Layout for Mobile) */}
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)', padding: '10px' }}>
                {rankedProspects.map((p, idx) => (
                    <div key={p.id} style={{
                        background: 'var(--surface-glass)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        marginBottom: '10px',
                        padding: '15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {/* Top Row: Basic Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div
                                    onClick={() => onSelectPlayer(p.id)}
                                    style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)', cursor: 'pointer' }}>
                                    {p.firstName} {p.lastName} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({p.position})</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    Age: <span style={{ color: 'var(--text)' }}>{p.age}</span> • Potential: <span style={{ color: 'var(--text)' }}>
                                        {((scoutingReports && scoutingReports[userTeamId] && scoutingReports[userTeamId][p.id] && scoutingReports[userTeamId][p.id].isPotentialRevealed) || (autoRevealCount > 0 && idx < autoRevealCount)) // Assuming list stays sorted by value, top N are auto-revealed
                                            ? getPotentialGrade(p.potential)
                                            : '??'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Row: Full Width Button */}
                        {isUserTurn && (
                            <button
                                onClick={() => onPick(p.id)}
                                className="btn-primary"
                                style={{
                                    padding: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    width: '100%',
                                    borderRadius: '8px',
                                    marginTop: '5px' // Space between info and button
                                }}>
                                DRAFT PLAYER
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
