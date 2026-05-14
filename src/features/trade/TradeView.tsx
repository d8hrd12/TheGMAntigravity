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
            <div style={{ 
                padding: '100px 20px', 
                textAlign: 'center', 
                background: '#ffffff', 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ 
                    fontSize: '4rem', 
                    marginBottom: '32px',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))'
                }}>⏳</div>
                <h2 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 900, 
                    marginBottom: '16px',
                    letterSpacing: '-0.04em',
                    color: '#111111'
                }}>Trade Deadline Passed</h2>
                <p style={{ 
                    color: '#8e8e93', 
                    lineHeight: 1.6, 
                    maxWidth: '460px', 
                    margin: '0 auto 48px auto',
                    fontSize: '1.1rem',
                    fontWeight: 500
                }}>
                    The mid-season trade deadline has passed. Roster moves are restricted until the next off-season begins at the Draft.
                </p>
                <button 
                    onClick={onBack}
                    style={{
                        background: '#111111',
                        color: '#ffffff',
                        padding: '16px 48px',
                        borderRadius: '100px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Return to Dashboard
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
                const pAssets = initialProposal.proposerAssets.players;
                const tAssets = initialProposal.targetAssets.players;
                if (pAssets.some(p => p.teamId !== initialProposal.proposerId)) isValid = false;
                if (tAssets.some(p => p.teamId !== initialProposal.targetTeamId)) isValid = false;
            } else {
                isValid = validateTradeProposal(initialProposal, players, allPicks);
            }

            if (!isValid) {
                setFeedback("This trade offer is invalid. Some assets are no longer available.");
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
            <div style={{ 
                padding: '16px', 
                background: '#f9f9f9', 
                borderRadius: '16px', 
                marginBottom: '16px',
                border: '1px solid #eeeeee'
            }}>
                <div style={{ 
                    fontWeight: 800, 
                    marginBottom: '12px', 
                    color: '#8e8e93', 
                    textTransform: 'uppercase', 
                    fontSize: '0.65rem', 
                    letterSpacing: '0.08em' 
                }}>{title} Financials</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? '1fr' : '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #eeeeee', display: 'flex', flexDirection: window.innerWidth < 480 ? 'row' : 'column', justifyContent: 'space-between', alignItems: window.innerWidth < 480 ? 'center' : 'flex-start' }}>
                        <div style={{ fontSize: '0.6rem', color: '#8e8e93', fontWeight: 700, textTransform: 'uppercase' }}>Outgoing</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111' }}>{formatMoney(outgoingSalary)}</div>
                    </div>
                    <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #eeeeee', display: 'flex', flexDirection: window.innerWidth < 480 ? 'row' : 'column', justifyContent: 'space-between', alignItems: window.innerWidth < 480 ? 'center' : 'flex-start' }}>
                        <div style={{ fontSize: '0.6rem', color: '#8e8e93', fontWeight: 700, textTransform: 'uppercase' }}>Incoming</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: incomingSalary > 0 ? '#007aff' : '#111111' }}>{formatMoney(incomingSalary)}</div>
                    </div>
                </div>

                <div style={{ 
                    marginTop: '12px', 
                    padding: '12px',
                    borderRadius: '12px',
                    background: isIllegal ? 'rgba(255, 59, 48, 0.05)' : (postTradeSpace >= 0 ? 'rgba(52, 199, 89, 0.05)' : 'rgba(255, 149, 0, 0.05)'),
                    border: '1px solid ' + (isIllegal ? 'rgba(255, 59, 48, 0.1)' : (postTradeSpace >= 0 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)')),
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 700, fontSize: '0.75rem', color: isIllegal ? '#ff3b30' : (postTradeSpace >= 0 ? '#34c759' : '#ff9500') }}>
                        {isIllegal ? 'EXCEEDS CAP' : 'PROJ. CAP SPACE'}
                    </span>
                    <span style={{ 
                        fontWeight: 900, 
                        fontSize: '1rem',
                        color: isIllegal ? '#ff3b30' : (postTradeSpace >= 0 ? '#34c759' : '#ff9500')
                    }}>
                        {formatMoney(postTradeSpace)}
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
        <div style={{ 
            minHeight: '100vh', 
            background: '#ffffff',
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%', 
            maxWidth: '1400px', 
            margin: '0 auto' 
        }}>
            <PageHeader 
                title="Trade Center" 
                subtitle="Roster Transactions & Draft Pick Exchange"
                onBack={onBack}
                teamColor="#111111"
            />

            <div style={{ padding: '0 24px 40px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                    marginBottom: '32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    justifyContent: 'center',
                    background: '#f2f2f7',
                    padding: '12px 24px',
                    borderRadius: '100px',
                    width: 'fit-content',
                    margin: '16px auto 32px auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                    <label style={{ fontWeight: 800, fontSize: '0.85rem', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trading Partner</label>
                    <TeamSelect
                        teams={teams}
                        selectedTeamId={selectedTeamId}
                        onChange={(id) => { setSelectedTeamId(id); setAiSelected([]); setAiPickSelected([]); setFeedback(null); }}
                        excludeTeamId={userTeam.id}
                        style={{ 
                            background: 'transparent',
                            border: 'none',
                            fontWeight: 900,
                            fontSize: '1rem',
                            color: '#111111',
                            cursor: 'pointer'
                        }}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
                    gap: '32px', 
                    flex: 1 
                }}>
                    {/* User Team Col */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '16px',
                            padding: '0 8px',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <div style={{ flex: 1, minWidth: '140px' }}>
                                <h3 style={{ margin: 0, fontSize: window.innerWidth < 480 ? '1.25rem' : '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userTeam.name}</h3>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase' }}>Your Assets</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase' }}>Team State</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111111' }}>Contender</div>
                            </div>
                        </div>

                        {leagueType === 'EURO' && (initialProposal as TradeProposal)?.transferFee && (
                            <div style={{ 
                                padding: '16px', 
                                background: 'rgba(52, 199, 89, 0.05)', 
                                borderRadius: '16px', 
                                marginBottom: '16px', 
                                border: '1px solid rgba(52, 199, 89, 0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ fontSize: '0.75rem', color: '#34c759', fontWeight: 900, textTransform: 'uppercase' }}>Incoming Cash</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34c759' }}>€{new Intl.NumberFormat('de-DE').format((initialProposal as TradeProposal).transferFee || 0)}</div>
                            </div>
                        )}

                        <TradeFinancialHelper team={userTeam} selectedPlayerIds={userSelected} incomingSalary={userIncoming} title={userTeam.abbreviation} />
                        
                        <div style={{ 
                            flex: 1, 
                            border: '1px solid #eeeeee', 
                            borderRadius: '24px', 
                            background: '#ffffff',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ padding: '20px', overflowY: 'auto' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Roster</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {userRoster.map(p => {
                                        const contract = getPlayerContract(p.id);
                                        const isSelected = userSelected.includes(p.id);
                                        return (
                                            <div key={p.id}
                                                onClick={() => toggleUserPlayer(p.id)}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderRadius: '16px',
                                                    background: isSelected ? '#111111' : '#f9f9f9',
                                                    cursor: 'pointer',
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    border: isSelected ? '1px solid #111111' : '1px solid transparent'
                                                }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div onClick={(e) => { e.stopPropagation(); onSelectPlayer(p.id); }} style={{ color: isSelected ? 'rgba(255,255,255,0.4)' : '#8e8e93', display: 'flex' }}>
                                                        <Info size={16} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#ffffff' : '#111111' }}>{p.firstName[0]}. {p.lastName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: isSelected ? 'rgba(255,255,255,0.5)' : '#8e8e93', fontWeight: 600 }}>
                                                            {p.position} • {p.age}yo • {formatMoney(contract?.amount || 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 900, color: isSelected ? '#ffffff' : '#111111', fontSize: '1rem' }}>{Math.round(getPlayerTradeValue(p, opponentTeam!, contracts, aiRoster))}</div>
                                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: isSelected ? 'rgba(255,255,255,0.5)' : '#8e8e93', textTransform: 'uppercase' }}>Value</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <h4 style={{ margin: '24px 0 12px 0', fontSize: '0.75rem', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Draft Assets</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(userTeam.draftPicks || [])
                                        .filter(p => {
                                            if (seasonPhase === 'draft' && p.year === currentYear && draftOrder) {
                                                const exactPick = getSpecificPickNumber(userTeam.id, p, draftOrder || []);
                                                return exactPick !== null;
                                            }
                                            return true;
                                        })
                                        .map(p => {
                                            const isSelected = userPickSelected.includes(p.id);
                                            return (
                                                <div key={p.id}
                                                    onClick={() => toggleUserPick(p.id)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        borderRadius: '16px',
                                                        background: isSelected ? '#111111' : '#f9f9f9',
                                                        cursor: 'pointer',
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center',
                                                        transition: 'all 0.2s ease',
                                                        border: isSelected ? '1px solid #111111' : '1px solid transparent'
                                                    }}>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#ffffff' : '#111111' }}>
                                                            {p.year} R{p.round}
                                                        </div>
                                                        <div style={{ fontSize: '0.7rem', color: isSelected ? 'rgba(255,255,255,0.5)' : '#8e8e93', fontWeight: 600 }}>
                                                            via {(p.originalTeamName || 'Self')}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontWeight: 900, color: isSelected ? '#34c759' : '#34c759', fontSize: '1rem' }}>
                                                        {Math.round(opponentTeam ? getDraftPickValue(p, currentYear, opponentTeam, undefined, teams) : 0)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Team Col */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '16px',
                            padding: '0 8px',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <div style={{ flex: 1, minWidth: '140px' }}>
                                <h3 style={{ margin: 0, fontSize: window.innerWidth < 480 ? '1.25rem' : '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opponentTeam?.name}</h3>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase' }}>Target Assets</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase' }}>Strategy</div>
                                <div style={{ 
                                    fontSize: '0.9rem', 
                                    fontWeight: 800, 
                                    color: opponentTeam?.strategy?.direction === 'Contender' ? '#ff3b30' : '#34c759' 
                                }}>
                                    {opponentTeam?.strategy?.direction || 'Unknown'}
                                </div>
                            </div>
                        </div>

                        {opponentTeam && <TradeFinancialHelper team={opponentTeam} selectedPlayerIds={aiSelected} incomingSalary={aiIncoming} title={opponentTeam.abbreviation} />}
                        
                        <div style={{ 
                            flex: 1, 
                            border: '1px solid #eeeeee', 
                            borderRadius: '24px', 
                            background: '#ffffff',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ padding: '20px', overflowY: 'auto' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Roster</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {aiRoster.map(p => {
                                        const contract = getPlayerContract(p.id);
                                        const isSelected = aiSelected.includes(p.id);
                                        return (
                                            <div key={p.id}
                                                onClick={() => toggleAiPlayer(p.id)}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderRadius: '16px',
                                                    background: isSelected ? '#111111' : '#f9f9f9',
                                                    cursor: 'pointer',
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s ease',
                                                    border: isSelected ? '1px solid #111111' : '1px solid transparent'
                                                }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div onClick={(e) => { e.stopPropagation(); onSelectPlayer(p.id); }} style={{ color: isSelected ? 'rgba(255,255,255,0.4)' : '#8e8e93', display: 'flex' }}>
                                                        <Info size={16} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#ffffff' : '#111111' }}>{p.firstName[0]}. {p.lastName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: isSelected ? 'rgba(255,255,255,0.5)' : '#8e8e93', fontWeight: 600 }}>
                                                            {p.position} • {p.age}yo • {formatMoney(contract?.amount || 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 900, color: isSelected ? '#ffffff' : '#111111', fontSize: '1rem' }}>{Math.round(getPlayerTradeValue(p, opponentTeam!, contracts, aiRoster))}</div>
                                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: isSelected ? 'rgba(255,255,255,0.5)' : '#8e8e93', textTransform: 'uppercase' }}>Value</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <h4 style={{ margin: '24px 0 12px 0', fontSize: '0.75rem', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Draft Assets</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(opponentTeam?.draftPicks || [])
                                        .filter(p => {
                                            if (seasonPhase === 'draft' && p.year === currentYear && draftOrder) {
                                                const exactPick = getSpecificPickNumber(opponentTeam!.id, p, draftOrder);
                                                return exactPick !== null;
                                            }
                                            return true;
                                        })
                                        .map(p => {
                                            const isSelected = aiPickSelected.includes(p.id);
                                            return (
                                                <div key={p.id}
                                                    onClick={() => toggleAiPick(p.id)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        borderRadius: '16px',
                                                        background: isSelected ? '#111111' : '#f9f9f9',
                                                        cursor: 'pointer',
                                                        display: 'flex', 
                                                        justifyContent: 'space-between', 
                                                        alignItems: 'center',
                                                        transition: 'all 0.2s ease',
                                                        border: isSelected ? '1px solid #111111' : '1px solid transparent'
                                                    }}>
                                                    <div>
                                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#ffffff' : '#111111' }}>
                                                            {p.year} R{p.round}
                                                        </div>
                                                        <div style={{ fontSize: '0.7rem', color: isSelected ? 'rgba(255,255,255,0.5)' : '#8e8e93', fontWeight: 600 }}>
                                                            via {(p.originalTeamName || 'Self')}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontWeight: 900, color: isSelected ? '#34c759' : '#34c759', fontSize: '1rem' }}>
                                                        {Math.round(opponentTeam ? getDraftPickValue(p, currentYear, opponentTeam, undefined, teams) : 0)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ 
                    marginTop: '32px', 
                    paddingTop: '32px',
                    borderTop: '1px solid #eeeeee',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    {feedback && (
                        <div style={{
                            padding: '14px 28px',
                            background: feedback.includes('accept') || feedback.includes('Completed') ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                            color: feedback.includes('accept') || feedback.includes('Completed') ? '#34c759' : '#ff3b30',
                            borderRadius: '100px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            animation: 'fadeInUp 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
                        }}>
                            {feedback}
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {aiSelected.length > 0 && userSelected.length === 0 && userPickSelected.length === 0 && (
                            <button
                                onClick={handleSuggest}
                                style={{
                                    background: '#ffffff',
                                    border: '2px solid #111111',
                                    color: '#111111',
                                    padding: window.innerWidth < 480 ? '12px 24px' : '14px 32px',
                                    borderRadius: '100px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    flex: window.innerWidth < 480 ? 1 : 'none',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#111111';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#ffffff';
                                    e.currentTarget.style.color = '#111111';
                                }}
                            >
                                Ask for Counter-Offer
                            </button>
                        )}

                        <button
                            onClick={handlePropose}
                            disabled={userSelected.length === 0 && aiSelected.length === 0 && userPickSelected.length === 0 && aiPickSelected.length === 0}
                            style={{
                                padding: window.innerWidth < 480 ? '16px 32px' : '16px 64px',
                                background: '#111111',
                                color: '#ffffff',
                                fontSize: '1.1rem',
                                fontWeight: 900,
                                border: 'none',
                                borderRadius: '100px',
                                flex: window.innerWidth < 480 ? 1 : 'none',
                                cursor: (userSelected.length === 0 && aiSelected.length === 0 && userPickSelected.length === 0 && aiPickSelected.length === 0) ? 'not-allowed' : 'pointer',
                                opacity: (userSelected.length === 0 && aiSelected.length === 0 && userPickSelected.length === 0 && aiPickSelected.length === 0) ? 0.3 : 1,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'scale(1.03)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            Propose Trade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
