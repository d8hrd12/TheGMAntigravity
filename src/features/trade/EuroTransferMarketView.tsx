import React, { useState, useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateOverall } from '../../utils/playerUtils';
import { StarRating } from '../../components/StarRating';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { calculateEuroBuyoutFee, determineEuroTeamTarget, isEuroPlayerUntouchable } from '../team/EuroAIGMModule';
import { EuroNegotiationView } from '../negotiation/EuroNegotiationView';
import { Search, DollarSign, ArrowRightLeft, Target, ShieldCheck, Handshake, CheckCircle2, X, ArrowLeft, ShieldAlert } from 'lucide-react';
import { generateUUID } from '../../utils/uuid';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import { negotiateEuroBuyout, negotiateEuroContract } from './logic/EuroNegotiationAI';
import { REAL_ROSTERS } from '../../data/realRosters';
import { NBA_TEAMS } from '../../data/teams';

// === DYNAMIC NBA VETERAN POOL ===
// Real data covers 2025-2030 (6 seasons). From 2031+ we cycle the 2025-2028 waves
// with random names so the tab never runs empty.
// All attributes apply age-based decay: athletic stats drop hard, skill stats drop gently.
const BASE_YEAR = 2025;
const CYCLE_LENGTH = 4;
const MIN_NBA_POOL = 10;

// Random name pools for fictional cycled veterans
const RAND_FIRST = [
    'Marcus','DeShawn','Jalen','Tyrese','Isaiah','Darius','Malik','Devon',
    'Kendall','Andre','Jordan','Lamont','Darnell','Xavier','Kareem','Rashid',
    'Elijah','Antoine','Damien','Cortez','Marques','Terrell','Brandon','Ashton',
    'Javon','Corey','Derrick','Jamal','Quentin','Reggie'
];
const RAND_LAST = [
    'Washington','Coleman','Mitchell','Jefferson','Harrison','Brooks','Crawford',
    'Ellis','Tucker','Simmons','Porter','Patterson','Dixon','Banks','Fleming',
    'Horton','Walton','Griffith','Benson','Caldwell','Chambers','Holt','Vance',
    'Barton','Mercer','Payne','Rollins','Stanton','Wilkes','Norwood'
];

/**
 * Build decayed attributes for a veteran player based on their current age.
 * - Athletic stats (speed, athleticism, finishing, etc.) decay aggressively: -2.5% per year over 30
 * - Skill stats (shooting, playmaking, IQ) decay gently: -1% per year over 30
 * - IQ actually improves slightly — veterans get smarter
 */
function applyAgingDecay(attrs: any, baseOvr: number, currentAge: number) {
    const yearsOverPrime = Math.max(0, currentAge - 30);
    const athleticScale = Math.max(0.60, 1 - yearsOverPrime * 0.025); // hard physical drop
    const skillScale    = Math.max(0.82, 1 - yearsOverPrime * 0.010); // slower skill drop
    const iqBonus       = Math.min(8, Math.floor(yearsOverPrime * 0.5)); // vets get smarter

    const s = (v: number, scale: number) => Math.max(30, Math.round((v || baseOvr) * scale));

    return {
        // Athletic — decay hard
        finishing:        s(attrs.finishing,        athleticScale),
        athleticism:      s(attrs.athleticism,       athleticScale),
        speed:            s(attrs.speed,             athleticScale),
        agility:          s(attrs.agility,           athleticScale),
        vertical:         s(attrs.vertical,          athleticScale),
        ballHandling:     s(attrs.ballHandling,      athleticScale),
        drivingDunk:      s(attrs.drivingDunk,       athleticScale),
        offensiveRebound: s(attrs.offensiveRebound,  athleticScale),
        defensiveRebound: s(attrs.defensiveRebound,  athleticScale),
        blocking:         s(attrs.blocking,          athleticScale),
        // Skill — decay gently
        midRange:         s(attrs.midRange,          skillScale),
        threePointShot:   s(attrs.threePointShot,   skillScale),
        freeThrow:        s(attrs.freeThrow,         skillScale),
        playmaking:       s(attrs.playmaking,        skillScale),
        interiorDefense:  s(attrs.interiorDefense,   skillScale),
        perimeterDefense: s(attrs.perimeterDefense,  skillScale),
        stealing:         s(attrs.stealing,          skillScale),
        postControl:      s(attrs.postControl,       skillScale),
        drawFoul:         s(attrs.drawFoul,          skillScale),
        standingDunk:     s(attrs.standingDunk,      skillScale),
        layup:            s(attrs.layup,             skillScale),
        // IQ & character — improves / stable
        basketballIQ:     Math.min(99, (attrs.basketballIQ || baseOvr) + iqBonus),
        workEthic:        Math.min(99, (attrs.workEthic || 80) + Math.floor(iqBonus * 0.5)),
        offensiveConsistency: s(attrs.offensiveConsistency, skillScale),
        defensiveConsistency: s(attrs.defensiveConsistency, skillScale),
        // Physical — largely fixed
        strength:         attrs.strength || 70,
        stamina:          Math.max(65, (attrs.stamina || 85) - yearsOverPrime * 1.5),
    };
}

/** Build a single player object from roster def + computed year context. */
function makeNBAVeteranPlayer(
    def: any, abbr: string, team: any,
    currentAge: number, currentOvr: number, gameYear: number,
    overrideName?: { firstName: string; lastName: string }
): Player {
    const attrs = applyAgingDecay(def.attributes || {}, def.ovr || 75, currentAge);
    const firstName = overrideName?.firstName ?? def.firstName;
    const lastName  = overrideName?.lastName  ?? def.lastName;
    return {
        id: `nba_target_${gameYear}_${abbr}_${firstName}_${lastName}`.replace(/[\s.]+/g, '_'),
        firstName,
        lastName,
        position: (def.pos as any) || 'SF',
        age: currentAge,
        height: 200,
        weight: 100,
        teamId: team?.id || abbr,
        overall: currentOvr,
        potential: currentOvr,
        attributes: attrs,
        tendencies: {
            shootsThrees: 50, drivesToBasket: 50, postUp: 50, passFirst: 50,
            foulDrawer: 50, helperDefender: 50, highPressurePlayer: 50, clutchFactor: 50
        },
        personality: 'Veteran Leader',
        archetype: def.archetype || 'Veteran',
        morale: 80,
        fatigue: 0,
        stamina: 100,
        yearsOfService: Math.max(1, currentAge - 19),
        isStarter: true,
        minutes: 28,
        loveForTheGame: 15,
        seasonStats: {
            gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
            steals: 0, blocks: 0, turnovers: 0, offensiveRebounds: 0, defensiveRebounds: 0,
            fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
            ftMade: 0, ftAttempted: 0, fouls: 0, plusMinus: 0,
            rimMade: 0, rimAttempted: 0, rimAssisted: 0,
            midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
            threePointAssisted: 0
        },
        careerStats: [],
        jerseyNumber: Math.floor(Math.random() * 50),
        acquisition: { type: 'initial', year: gameYear - 1, details: 'NBA Contract Expiring' }
    };
}

/** Extract all qualifying players for a given virtual year (real data). */
function extractPoolForYear(gameYear: number, nameSuffix?: string): Player[] {
    const yearsElapsed = Math.max(0, gameYear - BASE_YEAR);
    const pool: Player[] = [];

    for (const [abbr, roster] of Object.entries(REAL_ROSTERS)) {
        const team = NBA_TEAMS.find(t => t.abbreviation === abbr);
        for (const def of roster as any[]) {
            const currentAge = def.age + yearsElapsed;
            const contractYearsLeft = (def.contract?.years || 0) - yearsElapsed;
            if (contractYearsLeft !== 1) continue;
            if (currentAge <= 31) continue;
            const ageDrop = Math.max(0, currentAge - 33);
            const currentOvr = Math.max(65, (def.ovr || 75) - ageDrop);
            if (currentOvr <= 76) continue;
            pool.push(makeNBAVeteranPlayer(def, abbr, team, currentAge, currentOvr, gameYear));
        }
    }
    return pool.sort((a, b) => b.overall - a.overall);
}

/** Main entry — always returns at least MIN_NBA_POOL players by cycling waves. */
const buildNBATargetPool = (gameYear: number): Player[] => {
    // 1. Try to get real players for this year
    const realPool = extractPoolForYear(gameYear);

    if (realPool.length >= MIN_NBA_POOL) return realPool;

    // 2. Real data is thin — top up with a cycled wave (2025-2028 loop) using random names
    const cycleOffset = (gameYear - BASE_YEAR) % CYCLE_LENGTH;
    const cycleBaseYear = BASE_YEAR + cycleOffset; // 2025-2028

    // Deterministic seeded index so names don't change on every render
    const seed = gameYear * 31;
    const pick = (arr: string[], i: number) => arr[(seed + i * 7) % arr.length];

    const cyclePool = extractPoolForYear(cycleBaseYear)
        .filter(cp => !realPool.some(rp => rp.lastName === cp.lastName))
        .map((p, i) => ({
            ...p,
            id: `nba_cycled_${gameYear}_${i}`,
            firstName: pick(RAND_FIRST, i),
            lastName:  pick(RAND_LAST,  i + 13),
            overall:   Math.max(77, p.overall - 1),
        }));

    return [...realPool, ...cyclePool]
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 20);
};



const PlayerListItem: React.FC<{ 
    player: Player, 
    owningTeam?: Team, 
    allPlayers: Player[],
    userTeam: Team,
    isSelected: boolean, 
    onClick: () => void 
}> = ({ player, owningTeam, allPlayers, userTeam, isSelected, onClick }) => {
    const ovr = calculateOverall(player);
    const stats = player.seasonStats;
    const gp = stats?.gamesPlayed || 0;

    // Calculate Untouchable Status
    const untouchableInfo = useMemo(() => {
        if (!owningTeam) return { untouchable: false };
        const owningRoster = allPlayers.filter(p => p.teamId === owningTeam.id);
        return isEuroPlayerUntouchable(player, owningTeam, owningRoster, userTeam);
    }, [player, owningTeam, allPlayers, userTeam]);

    // Calculate Dynamic Fee
    const estimatedFee = useMemo(() => {
        if (!owningTeam) return 0;
        const owningRoster = allPlayers.filter(p => p.teamId === owningTeam.id);
        return calculateEuroBuyoutFee(player, owningTeam, owningRoster);
    }, [player, owningTeam, allPlayers]);
    
    const ppg = gp > 0 ? ((stats?.points || 0) / gp).toFixed(1) : '0.0';
    const rpg = gp > 0 ? ((stats?.rebounds || 0) / gp).toFixed(1) : '0.0';
    const apg = gp > 0 ? ((stats?.assists || 0) / gp).toFixed(1) : '0.0';
    
    const fgPct = stats?.fgAttempted && stats.fgAttempted > 0 
        ? ((stats.fgMade / stats.fgAttempted) * 100).toFixed(1) + '%' 
        : '0%';
    const threePct = stats?.threeAttempted && stats.threeAttempted > 0 
        ? ((stats.threeMade / stats.threeAttempted) * 100).toFixed(1) + '%' 
        : '0%';

    return (
        <div 
            onClick={onClick}
            style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                background: isSelected ? 'rgba(var(--team-primary-rgb), 0.1)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                opacity: untouchableInfo.untouchable ? 0.8 : 1
            }}
        >
            {/* Line 1 & 2: Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: untouchableInfo.untouchable ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: untouchableInfo.untouchable ? '#e74c3c' : 'var(--team-primary)', flexShrink: 0, fontSize: '1.1rem' }}>
                    {ovr}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {player.firstName} {player.lastName.toUpperCase()}
                            {untouchableInfo.untouchable && <ShieldAlert size={14} color="#e74c3c" />}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: untouchableInfo.untouchable ? 'var(--text-dim)' : '#2ecc71' }}>
                            {untouchableInfo.untouchable ? 'NOT FOR SALE' : `€${(estimatedFee / 1000000).toFixed(1)}M`}
                        </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                        {owningTeam ? owningTeam.name : 'Free Agent'} • {player.position} • {player.age}yo
                    </div>
                </div>
            </div>

            {/* Line 3: Stats Row */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'rgba(0,0,0,0.2)', 
                padding: '8px 12px', 
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.03)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{ppg}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-dim)' }}>PPG</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{rpg}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-dim)' }}>RPG</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{apg}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-dim)' }}>APG</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#2ecc71' }}>{fgPct}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-dim)' }}>FG%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--team-primary)' }}>{threePct}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-dim)' }}>3P%</span>
                </div>
            </div>
        </div>
    );
};

interface Props {
    onBack: () => void;
}

export const EuroTransferMarketView: React.FC<Props> = ({ onBack }) => {
    const { players, teams, userTeamId, contracts, setGameState, salaryCap, date } = useGame();
    
    const userTeam = teams.find(t => t.id === userTeamId);
    if (!userTeam) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [transferPhase, setTransferPhase] = useState<'SELECT' | 'TEAM_NEGOTIATION' | 'PLAYER_NEGOTIATION'>('SELECT');
    
    // Browse Logic
    const [searchMode, setSearchMode] = useState<'PLAYERS' | 'TEAMS' | 'NBA'>('PLAYERS');
    const [leagueFilter, setLeagueFilter] = useState<'EuroLeague' | 'EuroCup'>('EuroLeague');
    const [browsingTeamId, setBrowsingTeamId] = useState<string | null>(null);
    const [positionFilter, setPositionFilter] = useState<string>('All');

    // Player Negotiation Rounds
    const [negotiationRound, setNegotiationRound] = useState<number>(1);
    const [playerDemand, setPlayerDemand] = useState<number>(0);

    // Transfer Negotiation State
    const [cashOffer, setCashOffer] = useState<number>(0);
    const [previousBuyoutOffer, setPreviousBuyoutOffer] = useState<number | undefined>(undefined);
    const [transferFeedback, setTransferFeedback] = useState<{ status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER'; msg: string }>({ status: 'PENDING', msg: '' });

    const teamBaseline = useMemo(() => {
        const teamPlayers = players.filter(p => p.teamId === userTeamId);
        return calculateTeamBaseline(teamPlayers);
    }, [players, userTeamId]);

    const otherPlayers = useMemo(() => {
        return players.filter(p => p.teamId && p.teamId !== userTeamId);
    }, [players, userTeamId]);

    const filteredPlayers = useMemo(() => {
        return otherPlayers
            .filter(p => (`${p.firstName} ${p.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => positionFilter === 'All' || p.position === positionFilter)
            .filter(p => {
                const owningTeam = teams.find(t => t.id === p.teamId);
                if (!owningTeam) return true;
                const owningRoster = otherPlayers.filter(pl => pl.teamId === owningTeam.id);
                const check = isEuroPlayerUntouchable(p, owningTeam, owningRoster, userTeam);
                return !check.untouchable;
            })
            .sort((a, b) => calculateOverall(b) - calculateOverall(a));
    }, [otherPlayers, searchTerm, positionFilter, teams, userTeam]);


    const filteredNBAPool = useMemo(() => {
        // Rebuild every year — shows a fresh cohort of veterans each season
        const gameYear = date instanceof Date ? date.getFullYear() : new Date(date).getFullYear();
        const pool = buildNBATargetPool(gameYear);
        return pool
            .filter(p => (`${p.firstName} ${p.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => positionFilter === 'All' || p.position === positionFilter)
            .sort((a, b) => b.overall - a.overall);
    }, [date, searchTerm, positionFilter]);


    const handleSelectPlayer = (p: Player) => {
        setSelectedPlayer(p);
        
        if (searchMode === 'NBA') {
            // NBA players are free agents for Europe (no buyout)
            setTransferPhase('PLAYER_NEGOTIATION');
            const market = calculateContractAmount(p, salaryCap);
            setPlayerDemand(market.amount);
            setNegotiationRound(1);
        } else {
            setTransferPhase('TEAM_NEGOTIATION');
            setTransferFeedback({ status: 'PENDING', msg: '' });
            setNegotiationRound(1); // Reset rounds
            setPreviousBuyoutOffer(undefined);
            
            // Setup initial expected fee based on AI calculation
            const owningTeam = teams.find(t => t.id === p.teamId);
            if (owningTeam) {
                const owningRoster = players.filter(pl => pl.teamId === owningTeam.id);
                const fee = calculateEuroBuyoutFee(p, owningTeam, owningRoster);
                setCashOffer(Math.round(fee * 0.9)); // Default offer to 90% of what they might want
            }
        }
    };

    const formatCash = (val: number) => {
        return new Intl.NumberFormat('de-DE').format(val);
    };

    const handleProposeTransfer = () => {
        if (!selectedPlayer || !selectedPlayer.teamId) return;
        const owningTeam = teams.find(t => t.id === selectedPlayer.teamId);
        if (!owningTeam) return;

        const owningRoster = players.filter(p => p.teamId === owningTeam.id);
        const result = negotiateEuroBuyout(selectedPlayer, userTeam, owningTeam, owningRoster, cashOffer, previousBuyoutOffer);

        if (result.decision === 'ACCEPTED') {
            setTransferFeedback({ status: 'ACCEPTED', msg: result.msg });
            // Set initial player demand based on market logic
            const market = calculateContractAmount(selectedPlayer, salaryCap);
            setPlayerDemand(market.amount);
            
            setTimeout(() => {
                setTransferPhase('PLAYER_NEGOTIATION');
            }, 1500);
        } else if (result.decision === 'COUNTER') {
            setTransferFeedback({ status: 'COUNTER', msg: result.msg });
            setPreviousBuyoutOffer(cashOffer);
            if (result.counterAmount) setCashOffer(result.counterAmount);
        } else {
            setTransferFeedback({ status: 'REJECTED', msg: result.msg });
        }
    };

    const handlePlayerNegotiate = (offer: { amount: number; years: number; role: any }) => {
        if (!selectedPlayer) return { decision: 'REJECTED' as const, feedback: '' };

        const owningTeam = teams.find(t => t.id === selectedPlayer.teamId);
        const target = owningTeam ? determineEuroTeamTarget(userTeam, players.filter(p => p.teamId === userTeamId)) : 'EuroLeague Avoid Relegation';
        const isContender = target.includes('Contender') || target.includes('Chaser');

        const result = negotiateEuroContract(selectedPlayer, userTeam, isContender, offer.amount, playerDemand, negotiationRound);

        setNegotiationRound(prev => prev + 1);
        if (result.counterAmount) setPlayerDemand(result.counterAmount);

        return { 
            decision: result.decision as any, 
            feedback: result.msg 
        };
    };

    const executeTransfer = (contractOffer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => {
        if (!selectedPlayer) return;
        
        setGameState(prev => {
            // 1. Deduct cash from user, add to AI (if transferring from team)
            const updatedTeams = prev.teams.map(t => {
                if (t.id === userTeamId) {
                    return { ...t, cash: t.cash - (selectedPlayer.teamId ? cashOffer : 0), rosterIds: [...t.rosterIds, selectedPlayer.id] };
                }
                if (selectedPlayer.teamId && t.id === selectedPlayer.teamId) {
                    return { ...t, cash: t.cash + cashOffer, rosterIds: t.rosterIds.filter(id => id !== selectedPlayer.id) };
                }
                return t;
            });

            // 2. Update Player
            const updatedPlayers = prev.players.map(p => {
                if (p.id === selectedPlayer.id) {
                    return {
                        ...p,
                        teamId: userTeamId,
                        acquisition: {
                            type: 'trade' as const,
                            year: prev.date.getFullYear(),
                            details: selectedPlayer.teamId ? `Bought from ${teams.find(t => t.id === p.teamId)?.name} for €${(cashOffer / 1000000).toFixed(1)}M` : 'Signed from Free Agency'
                        }
                    };
                }
                return p;
            });

            // 3. Remove old contract, add new
            const filteredContracts = prev.contracts.filter(c => c.playerId !== selectedPlayer.id);
            const newContract: Contract = {
                id: generateUUID(),
                playerId: selectedPlayer.id,
                teamId: userTeamId,
                amount: contractOffer.amount,
                yearsLeft: contractOffer.years,
                startYear: prev.date.getFullYear(),
                role: contractOffer.role
            };

            // 4. Log Transaction
            const transaction = {
                date: prev.date,
                type: 'Trade',
                description: `TRANSFER: Signed ${selectedPlayer.firstName} ${selectedPlayer.lastName} for ${selectedPlayer.teamId ? `€${(cashOffer / 1000000).toFixed(1)}M fee. ` : ''}Contract: €${(contractOffer.amount / 1000000).toFixed(1)}M / ${contractOffer.years} yrs.`
            };

            return {
                ...prev,
                teams: updatedTeams,
                players: updatedPlayers,
                contracts: [...filteredContracts, newContract],
                transactions: [transaction, ...prev.transactions]
            };
        });

        // Reset
        setSelectedPlayer(null);
        setTransferPhase('SELECT');
    };

    return (
        <div style={{ padding: '20px', width: '100%', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={onBack} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', color: 'var(--text-main)', cursor: 'pointer' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowRightLeft color="var(--team-primary)" /> EUROPEAN TRANSFER MARKET
                    </h1>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                        Buy out players from other teams using your cash reserves.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Left Pane: Target Search */}
                <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px' }}>
                    
                    {/* Search Mode Toggle */}
                    <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-color)' }}>
                        <button 
                            onClick={() => { setSearchMode('PLAYERS'); setBrowsingTeamId(null); }}
                            style={{ 
                                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                background: searchMode === 'PLAYERS' ? 'var(--team-primary)' : 'transparent',
                                color: searchMode === 'PLAYERS' ? '#fff' : 'var(--text-dim)',
                                fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            PLAYERS
                        </button>
                        <button 
                            onClick={() => setSearchMode('TEAMS')}
                            style={{ 
                                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                background: searchMode === 'TEAMS' ? 'var(--team-primary)' : 'transparent',
                                color: searchMode === 'TEAMS' ? '#fff' : 'var(--text-dim)',
                                fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            TEAMS
                        </button>
                        <button 
                            onClick={() => { setSearchMode('NBA'); setBrowsingTeamId(null); }}
                            style={{ 
                                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                background: searchMode === 'NBA' ? 'var(--team-primary)' : 'transparent',
                                color: searchMode === 'NBA' ? '#fff' : 'var(--text-dim)',
                                fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            NBA
                        </button>
                    </div>

                    {searchMode === 'PLAYERS' ? (
                        <>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search players to buy out..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ 
                                        width: '100%', padding: '16px 16px 16px 44px', borderRadius: '16px', 
                                        border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)',
                                        fontSize: '1rem', fontWeight: 600, outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                                    <button 
                                        key={pos}
                                        onClick={() => setPositionFilter(pos)}
                                        style={{ 
                                            padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)',
                                            background: positionFilter === pos ? 'var(--team-primary)' : 'var(--bg-card)',
                                            color: positionFilter === pos ? '#fff' : 'var(--text-dim)',
                                            fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem', whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : !browsingTeamId ? (
                        <>
                            {searchMode !== 'NBA' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => setLeagueFilter('EuroLeague')}
                                        style={{ 
                                            flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                            background: leagueFilter === 'EuroLeague' ? 'rgba(var(--team-primary-rgb), 0.1)' : 'var(--bg-card)',
                                            color: leagueFilter === 'EuroLeague' ? 'var(--team-primary)' : 'var(--text-dim)',
                                            fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        EuroLeague
                                    </button>
                                    <button 
                                        onClick={() => setLeagueFilter('EuroCup')}
                                        style={{ 
                                            flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                            background: leagueFilter === 'EuroCup' ? 'rgba(var(--team-primary-rgb), 0.1)' : 'var(--bg-card)',
                                            color: leagueFilter === 'EuroCup' ? 'var(--team-primary)' : 'var(--text-dim)',
                                            fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        EuroCup
                                    </button>
                                </div>
                            )}

                            {searchMode === 'NBA' && filteredNBAPool.length === 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--text-dim)' }}>No NBA veterans match this filter. Try a different position.</p>
                                </div>
                            )}

                            {searchMode === 'NBA' && filteredNBAPool.length > 0 && (() => {
                                const gameYear = date instanceof Date ? date.getFullYear() : new Date(date).getFullYear();
                                return (
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                                        {filteredNBAPool.length} NBA VETERANS AVAILABLE — {gameYear} OFFSEASON · FINAL CONTRACT YEAR
                                    </p>
                                );
                            })()}
                        </>
                    ) : (
                        <button 
                            onClick={() => setBrowsingTeamId(null)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', 
                                background: 'transparent', border: 'none', color: 'var(--team-primary)', 
                                fontWeight: 800, cursor: 'pointer' 
                            }}
                        >
                            <ArrowLeft size={16} /> BACK TO TEAMS
                        </button>
                    )}

                    <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {searchMode === 'PLAYERS' ? (
                                filteredPlayers.slice(0, 50).map(player => (
                                    <PlayerListItem 
                                        key={player.id}
                                        player={player}
                                        owningTeam={teams.find(t => t.id === player.teamId)}
                                        allPlayers={players}
                                        userTeam={userTeam}
                                        isSelected={selectedPlayer?.id === player.id}
                                        onClick={() => handleSelectPlayer(player)}
                                    />
                                ))
                            ) : searchMode === 'NBA' ? (
                                filteredNBAPool.map(player => (
                                    <PlayerListItem 
                                        key={player.id}
                                        player={player}
                                        owningTeam={NBA_TEAMS.find(t => t.id === player.teamId)}
                                        allPlayers={players}
                                        userTeam={userTeam}
                                        isSelected={selectedPlayer?.id === player.id}
                                        onClick={() => handleSelectPlayer(player)}
                                    />
                                ))
                            ) : !browsingTeamId ? (
                                teams.filter(t => t.conference === leagueFilter && t.id !== userTeamId).map(team => (
                                    <div 
                                        key={team.id}
                                        onClick={() => setBrowsingTeamId(team.id)}
                                        style={{
                                            padding: '20px',
                                            borderBottom: '1px solid var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <div style={{ fontWeight: 800 }}>{team.name.toUpperCase()}</div>
                                        <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', color: 'var(--text-dim)' }} />
                                    </div>
                                ))
                            ) : (
                                players.filter(p => p.teamId === browsingTeamId).sort((a, b) => calculateOverall(b) - calculateOverall(a)).map(player => (
                                    <PlayerListItem 
                                        key={player.id}
                                        player={player}
                                        owningTeam={teams.find(t => t.id === player.teamId)}
                                        allPlayers={players}
                                        userTeam={userTeam}
                                        isSelected={selectedPlayer?.id === player.id}
                                        onClick={() => handleSelectPlayer(player)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Negotiation Modal Overlay */}
            {selectedPlayer && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', boxSizing: 'border-box'
                }}>
                    <div style={{ 
                        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                        background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)',
                        position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedPlayer(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', cursor: 'pointer', zIndex: 10 }}
                        >
                            <X size={20} />
                        </button>

                        {transferPhase === 'PLAYER_NEGOTIATION' ? (
                            <div style={{ padding: '24px' }}>
                                <EuroNegotiationView 
                                    player={selectedPlayer}
                                    team={userTeam}
                                    salaryCap={salaryCap}
                                    onCancel={() => setSelectedPlayer(null)}
                                    onNegotiate={handlePlayerNegotiate}
                                    onSign={(offer) => executeTransfer(offer)}
                                />
                            </div>
                        ) : (
                            <div style={{ padding: '32px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', borderRadius: '24px', background: 'rgba(var(--team-primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'var(--team-primary)' }}>
                                        {calculateOverall(selectedPlayer)}
                                    </div>
                                    <h2 style={{ margin: '0 0 4px 0', fontSize: '1.6rem', fontWeight: 900 }}>
                                        {selectedPlayer.firstName} {selectedPlayer.lastName.toUpperCase()}
                                    </h2>
                                    <p style={{ margin: 0, color: 'var(--text-dim)', fontWeight: 600 }}>
                                        Targeting: {teams.find(t => t.id === selectedPlayer.teamId)?.name}
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                                        Club-to-Club Negotiation
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Your Budget:</span>
                                        <span style={{ fontWeight: 900, color: '#2ecc71', fontSize: '1.1rem' }}>€{formatCash(userTeam.cash)}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-dim)' }}>PROPOSED BUYOUT FEE</label>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--team-primary)' }}>€{formatCash(cashOffer)}</span>
                                        </div>
                                        <input 
                                            type="number"
                                            value={cashOffer}
                                            onChange={(e) => setCashOffer(Number(e.target.value))}
                                            style={{
                                                width: '100%', padding: '16px', borderRadius: '12px',
                                                border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)',
                                                color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: 900, outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                {transferFeedback.msg && (
                                    <div style={{ 
                                        padding: '16px', borderRadius: '12px', marginBottom: '24px',
                                        background: transferFeedback.status === 'ACCEPTED' ? 'rgba(46, 204, 113, 0.1)' : 
                                                    transferFeedback.status === 'COUNTER' ? 'rgba(241, 196, 15, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                        border: `1px solid ${transferFeedback.status === 'ACCEPTED' ? '#2ecc71' : 
                                                            transferFeedback.status === 'COUNTER' ? '#f1c40f' : '#e74c3c'}`,
                                        color: transferFeedback.status === 'ACCEPTED' ? '#2ecc71' : 
                                               transferFeedback.status === 'COUNTER' ? '#f1c40f' : '#e74c3c',
                                        fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px'
                                    }}>
                                        {transferFeedback.status === 'ACCEPTED' ? <CheckCircle2 size={20} /> : 
                                         transferFeedback.status === 'COUNTER' ? <Handshake size={20} /> : <X size={20} />}
                                        {transferFeedback.msg}
                                    </div>
                                )}

                                <button
                                    onClick={handleProposeTransfer}
                                    disabled={transferFeedback.status === 'ACCEPTED'}
                                    style={{
                                        width: '100%', padding: '20px', borderRadius: '16px',
                                        background: 'var(--team-primary)', color: '#fff', border: 'none',
                                        fontWeight: 900, fontSize: '1.1rem', cursor: transferFeedback.status === 'ACCEPTED' ? 'not-allowed' : 'pointer',
                                        opacity: transferFeedback.status === 'ACCEPTED' ? 0.5 : 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        boxShadow: '0 8px 20px rgba(var(--team-primary-rgb), 0.3)'
                                    }}
                                >
                                    <Handshake size={24} />
                                    SEND BUYOUT OFFER
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
