import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { evaluateTrade, getPlayerTradeValue, getDraftPickValue, validateTradeProposal } from './TradeLogic';
import { calculateTeamCapSpace } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import type { TradeProposal } from '../../models/TradeProposal';
import type { SimulatedTradeProposal } from './TradeSimulation';
import { Info } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { TeamSelect } from '../ui/TeamSelect';

import { MidSeasonFreeAgents } from './MidSeasonFreeAgents';
import { TradingBlockView } from './TradingBlockView';

interface TradeViewProps {
    userTeam: Team;
    teams: Team[]; // All teams to select opponent
    players: Player[];
    contracts: Contract[];
    currentYear: number;
    salaryCap: number;
    initialAiPlayerId?: string;
    initialProposal?: TradeProposal | SimulatedTradeProposal | null;
    onExecuteTrade: (userPlayerIds: string[], userPickIds: string[], aiPlayerIds: string[], aiPickIds: string[], aiTeamId: string) => boolean;
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
    gmProfile?: any; // Avoiding circular dependency or rigorous type for now, but ideally import GMProfile type
}

export const TradeView: React.FC<TradeViewProps> = ({ userTeam, teams, players, contracts, currentYear, salaryCap, initialAiPlayerId, initialProposal, onExecuteTrade, onBack, onSelectPlayer, gmProfile }) => {

    // Helper to find initial team based on player
    const getInitialTeamId = () => {
        if (initialProposal) {
            if ('proposerId' in initialProposal) return initialProposal.proposerId; // Simulated
            return initialProposal.aiTeamId; // Flat
        }
        if (initialAiPlayerId) {
            const p = players.find(x => x.id === initialAiPlayerId);
            if (p) return p.teamId;
        }
        return teams.find(t => t.id !== userTeam.id)?.id || '';
    };

    const [selectedTeamId, setSelectedTeamId] = useState<string>(getInitialTeamId() || '');
    const [viewMode, setViewMode] = useState<'trade' | 'block' | 'free_agents'>('trade');

    // Parse Initial Selections
    const getInitialUserPlayers = (): string[] => {
        if (!initialProposal) return [];
        if ('targetAssets' in initialProposal) return initialProposal.targetAssets.players.map(p => p.id);
        return initialProposal.userPlayerIds;
    };
    const getInitialAiPlayers = (): string[] => {
        if (!initialProposal) return (initialAiPlayerId ? [initialAiPlayerId] : []);
        if ('proposerAssets' in initialProposal) return initialProposal.proposerAssets.players.map(p => p.id);
        return initialProposal.aiPlayerIds;
    };

    const [userSelected, setUserSelected] = useState<string[]>(getInitialUserPlayers());
    const [aiSelected, setAiSelected] = useState<string[]>(getInitialAiPlayers());
    const [userPickSelected, setUserPickSelected] = useState<string[]>(
        initialProposal ? ('targetAssets' in initialProposal ? initialProposal.targetAssets.picks.map(p => p.id) : initialProposal.userPickIds) : []
    );
    const [aiPickSelected, setAiPickSelected] = useState<string[]>(
        initialProposal ? ('proposerAssets' in initialProposal ? initialProposal.proposerAssets.picks.map(p => p.id) : initialProposal.aiPickIds) : []
    );
    const [feedback, setFeedback] = useState<string | null>(null);

    // Validate on load
    React.useEffect(() => {
        if (initialProposal) {
            const allPicks = teams.flatMap(t => t.draftPicks);
            let isValid = true;

            if ('proposerAssets' in initialProposal) {
                // SimulatedTradeProposal
                // Check if players are still on the team
                const pAssets = initialProposal.proposerAssets.players;
                const tAssets = initialProposal.targetAssets.players;
                // Verify proposer assets match proposerId
                if (pAssets.some(p => p.teamId !== initialProposal.proposerId)) isValid = false;
                // Verify target assets match targetTeamId
                if (tAssets.some(p => p.teamId !== initialProposal.targetTeamId)) isValid = false;
            } else {
                // TradeProposal (Standard)
                isValid = validateTradeProposal(initialProposal, players, allPicks);
            }

            if (!isValid) {
                setFeedback("This trade offer is invalid. Some assets are no longer available.");
                // Disable interaction?
                setUserSelected([]);
                setAiSelected([]);
                setAiPickSelected([]);
            }
        }
    }, [initialProposal]);

    const opponentTeam = teams.find(t => t.id === selectedTeamId);
    const userRoster = players
        .filter(p => p.teamId === userTeam.id)
        .sort((a, b) => calculateOverall(b) - calculateOverall(a));
    const aiRoster = players
        .filter(p => p.teamId === selectedTeamId)
        .sort((a, b) => calculateOverall(b) - calculateOverall(a));

    const toggleUserPlayer = (id: string) => {
        setUserSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        setFeedback(null);
    };

    const toggleAiPlayer = (id: string) => {
        setAiSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        setFeedback(null);
    };

    const toggleUserPick = (id: string) => {
        setUserPickSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        setFeedback(null);
    };

    const toggleAiPick = (id: string) => {
        setAiPickSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        setFeedback(null);
    };

    const handlePropose = () => {
        if (!opponentTeam) return;

        const userP = players.filter(p => userSelected.includes(p.id));
        const aiP = players.filter(p => aiSelected.includes(p.id));
        const userPicks = (userTeam.draftPicks || []).filter(p => userPickSelected.includes(p.id));
        const aiPicks = (opponentTeam.draftPicks || []).filter(p => aiPickSelected.includes(p.id));

        const result = evaluateTrade(
            userTeam,
            { players: userP, picks: userPicks },
            opponentTeam,
            { players: aiP, picks: aiPicks },
            teams,
            players,
            currentYear,
            contracts,
            salaryCap,
            // Assuming 'gameState' is available in this scope, or passed as a prop.
            // If not, this will cause a reference error.
            // The instruction implies 'gameState' is accessible.
            // The provided diff is malformed, so I'm interpreting the intent to add this argument.
            // If gameState.gmProfile is not directly available, it needs to be passed via props.
            // For now, I'm adding it as per the instruction's literal interpretation.
            // If 'gameState' is not defined, this will be a runtime error.
            // The instruction's provided "Code Edit" snippet was syntactically incorrect.
            // I'm making the most reasonable interpretation based on the text instruction.
            // 124: Using prop instead of window fallback
            gmProfile
        );
        setFeedback(result.message);

        if (result.accepted) {
            setTimeout(() => {
                const success = onExecuteTrade(userSelected, userPickSelected, aiSelected, aiPickSelected, selectedTeamId);
                if (success) {
                    setFeedback("Trade Completed! Returning to Dashboard...");
                } else {
                    setFeedback("Trade Rejected: Salary Cap Violation!");
                }
            }, 1000);
        }
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 1,
            notation: 'compact',
            compactDisplay: 'short'
        }).format(amount);
    };

    const getPlayerContract = (playerId: string) => contracts.find(c => c.playerId === playerId);

    const TradeFinancialHelper = ({ team, selectedPlayerIds, incomingSalary, title }: { team: Team, selectedPlayerIds: string[], incomingSalary: number, title: string }) => {
        const outgoingSalary = players
            .filter(p => selectedPlayerIds.includes(p.id))
            .reduce((sum, p) => sum + (getPlayerContract(p.id)?.amount || 0), 0);

        const currentCapSpace = calculateTeamCapSpace(team, contracts, salaryCap);
        const postTradeSpace = currentCapSpace + outgoingSalary - incomingSalary;

        const MATCH_BUFFER = 5000000;
        const isIllegal = postTradeSpace < 0 && incomingSalary > (outgoingSalary * 1.25) + MATCH_BUFFER;

        return (
            <div style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', marginBottom: '10px', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#666' }}>{title} Finance</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Outgoing:</span>
                    <span>{formatMoney(outgoingSalary)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Incoming:</span>
                    <span style={{ color: incomingSalary > 0 ? 'var(--primary)' : 'inherit' }}>{formatMoney(incomingSalary)}</span>
                </div>
                <div style={{ borderTop: '1px solid #ddd', margin: '5px 0', paddingTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Proj. Cap:</span>
                    <span style={{ fontWeight: 'bold', color: isIllegal ? '#e74c3c' : (postTradeSpace >= 0 ? '#2ecc71' : '#f39c12') }}>
                        {formatMoney(postTradeSpace)}
                        {isIllegal && " (ILLEGAL)"}
                    </span>
                </div>
            </div>
        );
    };

    const userIncoming = players
        .filter(p => aiSelected.includes(p.id))
        .reduce((sum, p) => sum + (getPlayerContract(p.id)?.amount || 0), 0);

    const aiIncoming = players
        .filter(p => userSelected.includes(p.id))
        .reduce((sum, p) => sum + (getPlayerContract(p.id)?.amount || 0), 0);

    return (
        <div style={{ minHeight: '100vh', padding: '10px', display: 'flex', flexDirection: 'column' }}>

            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', background: '#e0e0e0', borderRadius: '8px', padding: '4px' }}>
                    <button
                        onClick={() => setViewMode('trade')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: viewMode === 'trade' ? 'white' : 'transparent', fontWeight: 'bold' }}
                    >
                        Propose Trade
                    </button>
                    <button
                        onClick={() => setViewMode('block')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: viewMode === 'block' ? 'white' : 'transparent', fontWeight: 'bold' }}
                    >
                        Trading Block
                    </button>
                    <button
                        onClick={() => setViewMode('free_agents')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: viewMode === 'free_agents' ? 'white' : 'transparent', fontWeight: 'bold' }}
                    >
                        Mid-Season FA
                    </button>
                </div>

                {viewMode === 'trade' && (
                    <>
                        <label>Trading Partner: </label>
                        <TeamSelect
                            teams={teams}
                            selectedTeamId={selectedTeamId}
                            onChange={(id) => { setSelectedTeamId(id); setAiSelected([]); setAiPickSelected([]); setFeedback(null); }}
                            excludeTeamId={userTeam.id}
                            style={{ marginLeft: '10px' }}
                        />
                    </>
                )}
            </div>

            {viewMode === 'block' && (
                <TradingBlockView
                    teams={teams}
                    players={players}
                    userTeamId={userTeam.id}
                    onClose={() => setViewMode('trade')}
                    onInitiateTrade={(targetTeamId, targetPlayerId) => {
                        setSelectedTeamId(targetTeamId);
                        if (targetPlayerId) {
                            setAiSelected([targetPlayerId]);
                        } else {
                            setAiSelected([]);
                        }
                        setViewMode('trade');
                    }}
                />
            )}

            {viewMode === 'free_agents' && (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
                    Mid Season FA Not Implemented Yet
                </div>
            )}

            {viewMode === 'trade' && (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '10px', flex: 1, overflow: 'hidden' }}>
                        {/* User Team Col */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
                            <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '5px' }}>{userTeam.abbreviation} Assets</h3>
                            <TradeFinancialHelper team={userTeam} selectedPlayerIds={userSelected} incomingSalary={userIncoming} title={userTeam.abbreviation} />
                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                <h4 style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>Players</h4>
                                {userRoster.map(p => {
                                    const contract = getPlayerContract(p.id);
                                    return (
                                        <div key={p.id}
                                            onClick={() => toggleUserPlayer(p.id)}
                                            style={{
                                                padding: '8px',
                                                borderBottom: '1px solid #f0f0f0',
                                                background: userSelected.includes(p.id) ? '#fff3e0' : 'transparent',
                                                cursor: 'pointer',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectPlayer(p.id);
                                                    }}
                                                    style={{
                                                        padding: '4px',
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                        color: '#666',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        zIndex: 5
                                                    }}
                                                >
                                                    <Info size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{p.firstName} {p.lastName}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                        {p.position} • {p.age}yo • <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{calculateOverall(p)} OVR</span>
                                                    </div>
                                                    {contract && (
                                                        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>
                                                            {formatMoney(contract.amount)} / {contract.yearsLeft}y
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 'bold', color: '#4caf50' }}>{Math.round(getPlayerTradeValue(p, opponentTeam, contracts, aiRoster))}</div>
                                        </div>
                                    );
                                })}
                                <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#666' }}>Draft Picks</h4>
                                {(userTeam.draftPicks || []).map(p => (
                                    <div key={p.id}
                                        onClick={() => toggleUserPick(p.id)}
                                        style={{
                                            padding: '8px',
                                            borderBottom: '1px solid #f0f0f0',
                                            background: userPickSelected.includes(p.id) ? '#fff3e0' : 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{p.year} Round {p.round}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>From: {p.originalTeamName || 'Unknown'}</div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#4caf50' }}>{Math.round(getDraftPickValue(p, currentYear, opponentTeam || null))}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Team Col */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
                            <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>{opponentTeam?.abbreviation} Assets</h3>
                            {opponentTeam && <TradeFinancialHelper team={opponentTeam} selectedPlayerIds={aiSelected} incomingSalary={aiIncoming} title={opponentTeam.abbreviation} />}
                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                <h4 style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>Players</h4>
                                {aiRoster.map(p => {
                                    const contract = getPlayerContract(p.id);
                                    return (
                                        <div key={p.id}
                                            onClick={() => toggleAiPlayer(p.id)}
                                            style={{
                                                padding: '8px',
                                                borderBottom: '1px solid #f0f0f0',
                                                background: aiSelected.includes(p.id) ? '#eee' : 'transparent',
                                                cursor: 'pointer',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectPlayer(p.id);
                                                    }}
                                                    style={{
                                                        padding: '4px',
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                        color: '#666',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        zIndex: 5
                                                    }}
                                                >
                                                    <Info size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{p.firstName} {p.lastName}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                        {p.position} • {p.age}yo • <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{calculateOverall(p)} OVR</span>
                                                    </div>
                                                    {contract && (
                                                        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>
                                                            {formatMoney(contract.amount)} / {contract.yearsLeft}y
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 'bold', color: '#4caf50' }}>{Math.round(getPlayerTradeValue(p, opponentTeam, contracts, aiRoster))}</div>
                                        </div>
                                    );
                                })}
                                <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#666' }}>Draft Picks</h4>
                                {(opponentTeam?.draftPicks || []).map(p => (
                                    <div key={p.id}
                                        onClick={() => toggleAiPick(p.id)}
                                        style={{
                                            padding: '8px',
                                            borderBottom: '1px solid #f0f0f0',
                                            background: aiPickSelected.includes(p.id) ? '#d1e7dd' : 'transparent', // clearly distinct green tint
                                            borderLeft: aiPickSelected.includes(p.id) ? '4px solid #198754' : '4px solid transparent',
                                            cursor: 'pointer',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{p.year} Round {p.round}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>From: {p.originalTeamName || 'Unknown'}</div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#4caf50' }}>{Math.round(getDraftPickValue(p, currentYear, opponentTeam || null))}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        {feedback && (
                            <div style={{
                                marginBottom: '10px',
                                padding: '10px',
                                background: feedback.includes('accept') || feedback.includes('Completed') ? '#d4edda' : '#f8d7da',
                                color: feedback.includes('accept') || feedback.includes('Completed') ? '#155724' : '#721c24',
                                borderRadius: '4px'
                            }}>
                                {feedback}
                            </div>
                        )}
                        <button
                            onClick={handlePropose}
                            disabled={userSelected.length === 0 && aiSelected.length === 0 && userPickSelected.length === 0 && aiPickSelected.length === 0}
                            style={{
                                padding: '15px 40px',
                                background: 'var(--primary)',
                                color: 'white',
                                fontSize: '1.2rem',
                                border: 'none',
                                borderRadius: '50px',
                                opacity: (userSelected.length === 0 && aiSelected.length === 0 && userPickSelected.length === 0 && aiPickSelected.length === 0) ? 0.5 : 1
                            }}>
                            Propose Trade
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
