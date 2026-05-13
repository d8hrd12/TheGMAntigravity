import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { DraftPick } from '../../models/DraftPick';
import type { Contract } from '../../models/Contract';
import { evaluateTrade, getPlayerTradeValue, getDraftPickValue, validateTradeProposal, suggestTradePackage } from './TradeLogic';
import { calculateTeamCapSpace } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import type { TradeProposal } from '../../models/TradeProposal';
import type { SimulatedTradeProposal } from './TradeSimulation';
import { Info } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { TeamSelect } from '../ui/TeamSelect';
import { PageHeader } from '../ui/PageHeader';


import { MidSeasonFreeAgents } from './MidSeasonFreeAgents';

// Helper to map a team's generic draft pick asset to a specific live draft slot
const getSpecificPickNumber = (teamId: string, pick: DraftPick, draftOrder: string[]): number | null => {
    // 1. Identify which round this pick is for
    const round = pick.round;

    // 2. Find all slots in the remaining draft order belonging to this team
    const teamSlots = draftOrder.map((tid, idx) => ({ tid, idx })).filter(x => x.tid === teamId);

    // 3. Filter slots by round (Assuming 30 teams, 1-30 R1, 31-60 R2)
    // IMPORTANT: detailed draft order logic usually puts R2 after R1.
    // If draftOrder is shrinking, we need to know 'absolute' index to know round?
    // OR, we assume draftOrder contains the *current* queue.
    // If we are at Pick 35. draftOrder[0] is R2 Pick 5.
    // We need to know if draftOrder[0] is R1 or R2.
    // Heuristic: If draftOrder.length > 30, indices 0-(len-31) are R1?
    // This is risky. 
    // Alternative: GameContext draftOrder is initialized as full 60?
    // "prevState.draftOrder.slice(1)" -> Yes.
    // So we can deduce Round from (60 - draftOrder.length + idx).
    // Pick Number (Absolute) = 60 - draftOrder.length + idx + 1.

    const potentialPicks = teamSlots.map(s => {
        // Calculate Absolute Pick Number
        const pickNum = (60 - draftOrder.length) + s.idx + 1;
        const pickRound = pickNum <= 30 ? 1 : 2;
        return { pickNum, pickRound };
    });

    // 4. Match (Find the first slot matching the pick's round)
    // Note: If team has multiple picks in same round, which one is this?
    // Since we don't have unique IDs, this might alias them.
    // But for UI "Pick 5", it's fine.
    const match = potentialPicks.find(p => p.pickRound === round);

    return match ? match.pickNum : null;
};

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
    gmProfile?: any;
    draftOrder?: string[];
    seasonPhase?: string;
    seasonGamesPlayed?: number;
    leagueType?: 'NBA' | 'EURO';
}

export const TradeView: React.FC<TradeViewProps> = ({ userTeam, teams, players, contracts, currentYear, salaryCap, initialAiPlayerId, initialProposal, onExecuteTrade, onBack, onSelectPlayer, gmProfile, draftOrder, seasonPhase, seasonGamesPlayed, leagueType }) => {

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
    const isOffseason = ['scouting', 'draft', 'resigning', 'free_agency', 'retirement_summary', 'expansion_draft'].includes(seasonPhase || '');
    const isRegularSeasonBeforeDeadline = (seasonPhase === 'regular_season' && (seasonGamesPlayed || 0) <= 40);
    const canTrade = isOffseason || isRegularSeasonBeforeDeadline;
    const [feedback, setFeedback] = useState<string | null>(null);
    const [tradeMessage, setTradeMessage] = useState<{ text: string, type: 'error' | 'info' | 'success' } | null>(null);

    if (!canTrade) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-color)', margin: '20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '10px' }}>TRADE DEADLINE PASSED</h2>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 30px auto' }}>
                    The mid-season trade deadline has passed. Roster moves are restricted until the next off-season begins at the Draft.
                </p>
                <button 
                    onClick={onBack}
                    className="btn-secondary"
                    style={{ padding: '12px 30px', borderRadius: '12px', fontWeight: 700 }}
                >
                    RETURN TO DASHBOARD
                </button>
            </div>
        );
    }

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

    const opponentTeamBaseline = React.useMemo(() => calculateTeamBaseline(aiRoster), [aiRoster]);

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
                const success = onExecuteTrade(
                    userSelected, 
                    userPickSelected, 
                    aiSelected, 
                    aiPickSelected, 
                    selectedTeamId,
                    (initialProposal as TradeProposal)?.transferFee || 0
                );
                if (success) {
                    setFeedback("Trade Completed! Returning to Dashboard...");
                } else {
                    setFeedback("Trade Rejected: Financial Violation!");
                }
            }, 1000);
        }
    };

    const handleSuggest = () => {
        if (!opponentTeam) return;

        // Inputs: User wants aiSelected / aiPickSelected
        // We need to find what USER gives (userSelected / userPickSelected)

        const desiredPlayers = players.filter(p => aiSelected.includes(p.id));
        const desiredPicks = (opponentTeam.draftPicks || []).filter(p => aiPickSelected.includes(p.id));

        const suggestion = suggestTradePackage(
            userTeam,
            opponentTeam,
            { players: desiredPlayers, picks: desiredPicks },
            players,
            contracts,
            currentYear,
            salaryCap,
            teams
        );

        if (suggestion) {
            setUserSelected(suggestion.userPlayerIds);
            setUserPickSelected(suggestion.userPickIds);
            setFeedback("AI Proposal: \"Here is what would make this deal work for us.\"");
        } else {
            setFeedback("AI: \"We couldn't find a package from your team that makes this specific trade work.\"");
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
            <div style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.75rem' }}>
                <div style={{ fontWeight: '900', marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>{title} Finance</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Outgoing:</span>
                    <span style={{ fontWeight: 700 }}>{formatMoney(outgoingSalary)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Incoming:</span>
                    <span style={{ color: incomingSalary > 0 ? 'var(--primary)' : 'inherit', fontWeight: 700 }}>{formatMoney(incomingSalary)}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0', paddingTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800 }}>Proj. Cap:</span>
                    <span style={{ fontWeight: '900', color: isIllegal ? '#e74c3c' : (postTradeSpace >= 0 ? '#2ecc71' : '#f39c12') }}>
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
        <div style={{ minHeight: '100vh', padding: '10px 4px', display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '0 auto' }}>


            <div style={{ marginBottom: '15px' }}>
                <label>Trading Partner: </label>
                <TeamSelect
                    teams={teams}
                    selectedTeamId={selectedTeamId}
                    onChange={(id) => { setSelectedTeamId(id); setAiSelected([]); setAiPickSelected([]); setFeedback(null); }}
                    excludeTeamId={userTeam.id}
                    style={{ marginLeft: '10px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '6px', flex: 1, overflow: 'hidden' }}>
                {/* User Team Col */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', background: 'var(--bg-card)', minWidth: 0 }}>
                    <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '5px', fontSize: '0.9rem', marginBottom: '8px' }}>{userTeam.abbreviation} Assets</h3>
                    {leagueType === 'EURO' && (initialProposal as TradeProposal)?.transferFee && (
                        <div style={{ padding: '8px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '8px', marginBottom: '8px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                            <div style={{ fontSize: '0.65rem', color: '#27ae60', fontWeight: 900, textTransform: 'uppercase' }}>Incoming Cash</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#27ae60' }}>€{new Intl.NumberFormat('de-DE').format((initialProposal as TradeProposal).transferFee || 0)}</div>
                        </div>
                    )}
                    <TradeFinancialHelper team={userTeam} selectedPlayerIds={userSelected} incomingSalary={userIncoming} title={userTeam.abbreviation} />
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <h4 style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>Players</h4>
                        {userRoster.map(p => {
                            const contract = getPlayerContract(p.id);
                            return (
                                <div key={p.id}
                                    onClick={() => toggleUserPlayer(p.id)}
                                    style={{
                                        padding: '6px 8px',
                                        borderBottom: '1px solid var(--border-color)',
                                        background: userSelected.includes(p.id) ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectPlayer(p.id);
                                            }}
                                            style={{
                                                padding: '2px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                zIndex: 5
                                            }}
                                        >
                                            <Info size={14} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-main)' }}>{p.firstName[0]}. {p.lastName}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {p.position} • {p.age}yo • <StarRating stars={calculateStars(calculateOverall(p), opponentTeamBaseline)} size={10} />
                                            </div>
                                            {contract && (
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '1px', fontWeight: 600 }}>
                                                    {formatMoney(contract.amount)} / {contract.yearsLeft}y
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '900', color: 'var(--team-primary)', fontSize: '0.85rem' }}>{Math.round(getPlayerTradeValue(p, opponentTeam, contracts, aiRoster))}</div>
                                </div>
                            );
                        })}
                        <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#666' }}>Draft Picks</h4>
                        {(userTeam.draftPicks || [])
                            .filter(p => {
                                // Filter out "used" picks if we are in draft mode
                                if (seasonPhase === 'draft' && p.year === currentYear && draftOrder) {
                                    // If this team has NO surviving picks in the current draft order for this round, hide it
                                    // But we need to match specific pick instance if possible.
                                    // Since we don't have pick IDs in draftOrder, we count slots.
                                    // Simplified: If team has X remaining picks in Round Y, play it safe?
                                    // Better: We iterate draftOrder. If teamId is there, we find the pick.
                                    // Filter Logic:
                                    // 1. Is it future? Keep.
                                    if (p.year > currentYear) return true;
                                    // 2. Is it current year?
                                    // Does my team specific ID appear in the remaining draft order for this round?
                                    // Problem: If I have 2 R1 picks, and 1 is remaining. Which one is it?
                                    // We will render ALL current year picks that "fit" in the remaining slots.
                                    // But here we are iterating specific pick objects.
                                    // Let's rely on matching count.
                                    // But easier: Just check if the team appears in draftOrder for this round at all?
                                    // Actually, we can just calculate the specific pick number below. If it returns null, hide it.
                                    const rounds = [1, 2];
                                    const teamPicksInOrder = draftOrder.reduce((acc, tid, idx) => {
                                        if (tid === userTeam.id) acc.push(idx + 1 + (30 * 0)); // Flat index 1-60
                                        // Wait, draftOrder is 60 items.
                                        return acc;
                                    }, [] as number[]);
                                    // This is getting complex.
                                    // Simple logic:
                                    // If p.year == currentYear, only show if we can map it to a remaining slot?
                                    // Let's show all, but label them "Already Picked" if not found?
                                    // Or just hide.
                                    // Let's hide if we can't find a corresponding slot.
                                    const exactPick = getSpecificPickNumber(userTeam.id, p, draftOrder || []);
                                    return exactPick !== null;
                                }
                                return true;
                            })
                            .map(p => {
                                const exactPick = (seasonPhase === 'draft' && p.year === currentYear) ? getSpecificPickNumber(userTeam.id, p, draftOrder || []) : null;

                                return (
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
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                {p.year} | Round {p.round} | {userTeam.name} | {(p.originalTeamName || 'Unknown')}®
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#4caf50' }}>{Math.round(opponentTeam ? getDraftPickValue(p, currentYear, opponentTeam, undefined, teams) : 0)}</div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', background: 'var(--bg-card)', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--text-main)', paddingBottom: '5px', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem' }}>{opponentTeam?.abbreviation} Assets</h3>
                        {opponentTeam && (
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Strategy</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: opponentTeam.strategy?.direction === 'Contender' ? '#f44336' : '#4caf50' }}>
                                    {opponentTeam.strategy?.direction}
                                </div>
                            </div>
                        )}
                    </div>
                    {opponentTeam && <TradeFinancialHelper team={opponentTeam} selectedPlayerIds={aiSelected} incomingSalary={aiIncoming} title={opponentTeam.abbreviation} />}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <h4 style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>Players</h4>
                        {aiRoster.map(p => {
                            const contract = getPlayerContract(p.id);
                            return (
                                <div key={p.id}
                                    onClick={() => toggleAiPlayer(p.id)}
                                    style={{
                                        padding: '6px 8px',
                                        borderBottom: '1px solid var(--border-color)',
                                        background: aiSelected.includes(p.id) ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectPlayer(p.id);
                                            }}
                                            style={{
                                                padding: '2px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                zIndex: 5
                                            }}
                                        >
                                            <Info size={14} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '0.8rem', color: 'var(--text-main)' }}>{p.firstName[0]}. {p.lastName}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {p.position} • {p.age}yo • <StarRating stars={calculateStars(calculateOverall(p), opponentTeamBaseline)} size={10} />
                                            </div>
                                            {contract && (
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '1px', fontWeight: 600 }}>
                                                    {formatMoney(contract.amount)} / {contract.yearsLeft}y
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '900', color: 'var(--team-primary)', fontSize: '0.85rem' }}>{Math.round(getPlayerTradeValue(p, opponentTeam, contracts, aiRoster))}</div>
                                </div>
                            );
                        })}
                        <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#666' }}>Draft Picks</h4>
                        {(opponentTeam?.draftPicks || [])
                            .filter(p => {
                                if (seasonPhase === 'draft' && p.year === currentYear && draftOrder) {
                                    if (p.year > currentYear) return true;
                                    const exactPick = getSpecificPickNumber(opponentTeam!.id, p, draftOrder);
                                    return exactPick !== null;
                                }
                                return true;
                            })
                            .map(p => {
                                const exactPick = (seasonPhase === 'draft' && p.year === currentYear) ? getSpecificPickNumber(opponentTeam!.id, p, draftOrder || []) : null;
                                return (
                                    <div key={p.id}
                                        onClick={() => toggleAiPick(p.id)}
                                        style={{
                                            padding: '8px',
                                            borderBottom: '1px solid #f0f0f0',
                                            background: aiPickSelected.includes(p.id) ? '#eee' : 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                {p.year} | Round {p.round} | {opponentTeam?.name} | {(p.originalTeamName || 'Unknown')}®
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#4caf50' }}>{Math.round(opponentTeam ? getDraftPickValue(p, currentYear, opponentTeam, undefined, teams) : 0)}</div>
                                    </div>
                                );
                            })}
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
                        cursor: (userSelected.length === 0 && aiSelected.length === 0 && userPickSelected.length === 0 && aiPickSelected.length === 0) ? 'not-allowed' : 'pointer',
                        opacity: (userSelected.length === 0 && aiSelected.length === 0 && userPickSelected.length === 0 && aiPickSelected.length === 0) ? 0.5 : 1
                    }}>
                    Propose Trade
                </button>

                {aiSelected.length > 0 && userSelected.length === 0 && userPickSelected.length === 0 && (
                    <div style={{ marginTop: '10px' }}>
                        <button
                            onClick={handleSuggest}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--primary)',
                                color: 'var(--primary)',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            What would make this work?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
