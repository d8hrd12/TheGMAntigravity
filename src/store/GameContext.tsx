import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode, useCallback } from 'react';
import { simulateFreeAgencyDay } from '../features/free_agency/logic/FreeAgencyEngine';
import type { FreeAgencyOffer } from '../features/free_agency/logic/FreeAgencyEngine';
import type { Coach, PlayingStyle } from '../models/Coach';
import type { Player, PlayerAttributes, CareerStat } from '../models/Player';
import type { AwardWinner, SeasonAwards } from '../models/Awards';
import type { Team, RotationSegment } from '../models/Team';
import type { Contract } from '../models/Contract';
import type { DraftPick } from '../models/DraftPick';
import type { NewsStory } from '../models/NewsStory';
import { generatePlayer } from '../features/player/playerGenerator';
import { generateCoach, getTacticsForStyle } from '../features/team/coachGenerator';
import { shouldFireCoach, fireCoach, hireCoach } from '../features/team/CoachLogic';
import { seedRealRosters } from '../features/player/rosterSeeder';
import { generateLocalTalentPool, calculateOverall } from '../utils/playerUtils';
import { processGMDismissals, updateTeamStrategy } from '../features/team/GMManagement';
import { initializeLeagueGMs } from '../features/team/gmGenerator';
import type { SocialMediaPost } from '../models/SocialMediaPost';

import { LiveGameEngine } from '../features/simulation/LiveGameEngine';
import { simulateMatchV3 as simulateMatch } from '../features/simulation/v3/MatchEngineV3';
import { generateDailyPosts } from '../socialMediaUtils';
import type { MatchResult, TeamRotationData, PlayerStats, MerchCampaign, ActiveMerchCampaign } from '../features/simulation/SimulationTypes';

import type { TeamStrategy } from '../features/simulation/TacticsTypes';
// import { runProgression } from '../features/simulation/progressionSystem'; // Removed
import { generateUUID } from '../utils/uuid';
import { generateContract, calculateContractAmount, calculateTeamCapSpace, calculateAdjustedDemand } from '../utils/contractUtils';
import { simulateDailyTrades, generateAiTradeProposalForUser, type TradeProposal } from '../features/trade/TradeSimulation';
import { getTeamDirection } from '../features/trade/TradeLogic';
import { updatePlayerMorale, applyTeamDynamics, checkTradeRequests, checkProveItDemands } from '../features/simulation/MoraleSystem';
// TradeProposalModal import removed (unused and caused potential cycle)
import { optimizeRotation } from '../utils/rotationUtils';
import { formatDate } from '../utils/dateUtils';

import { checkHallOfFameEligibility, calculateFairSalary, calculateSecondaryPosition } from '../utils/playerUtils';
import { calculateStars, calculateTeamBaseline, getStarString } from '../utils/starUtils';
import { NBA_TEAMS } from '../data/teams';
import { EURO_TEAMS } from '../data/euro/teams';
import { REAL_ROSTERS } from '../data/realRosters';
import {
    calculateExpectation,
    evaluateSeasonPerformance,
    calculateAnnualFinancials,
    calculateLeagueFinancials,
    processMerchCampaigns,
    type SeasonResult,
    type ExpectationLevel
} from '../features/finance/FinancialEngine';
import { generate82GameSchedule, generateEuroSchedule } from '../utils/scheduleGenerator';
import { saveToDB, loadFromDB, deleteFromDB, type SaveMeta } from '../utils/storage';
import { TrainingFocus, type ProgressionResult } from '../models/Training';
import { calculateProgression, calculateInSeasonProgression } from '../features/training/TrainingLogic';
import { importNbaPlayers } from '../features/league/CsvImporter';
import { applyRealWorldTrades } from '../data/tradeUpdates';



// ... (imports)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
// Re-define PlayoffSeries since I might have deleted it or it was there before
export interface PlayoffSeries {
    id: string;
    round: number;
    conference: 'West' | 'East' | 'Finals' | 'EuroLeague' | 'EuroCup';
    homeTeamId: string;
    awayTeamId: string;
    homeWins: number;
    awayWins: number;
    winnerId?: string;
}

export interface PlayInMatchup {
    id: string;
    type: '7vs8' | '9vs10' | 'Loser78vsWinner910';
    conference: 'EuroLeague' | 'EuroCup';
    homeTeamId: string;
    awayTeamId: string;
    winnerId?: string;
    loserId?: string;
    played: boolean;
    result?: MatchResult;
}

export interface RetiredPlayer extends Player {
    exitYear: number;
    ageAtRetirement: number;
}

export interface Message {
    id: string;
    date: Date;
    title: string;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'news';
    read: boolean;
}

import { NewsEngine } from '../features/news/NewsEngine';

// Define DraftResult Interface used in GameState
export interface DraftResult {
    pick: number;
    teamId: string;
    playerId: string;
    playerName: string;
    round: number;
}

export interface GMProfile {
    firstName: string;
    lastName: string;
    level: number;
    xp: number;
    unlockedPerks: string[];
    perkPoints: number;
}

export interface GameRecord {
    category: string;
    value: number;
    playerId: string;
    playerName: string;
    teamId: string;
    teamName: string;
    year: number;
    date: Date;
    opponentName: string;
}

export interface CumulativeRecord {
    playerId: string;
    playerName: string;
    total: number;
    category: string;
    teamId?: string;
}

export interface GameState {
    players: Player[];
    teams: Team[];
    aiGms: import('../models/AI_GM').AI_GM[];
    news: NewsStory[];
    coaches: Coach[];
    userTeamId: string;
    contracts: Contract[];
    games: MatchResult[];
    date: Date;
    isInitialized: boolean;
    gmProfile: GMProfile;
    draftClass: Player[];
    draftOrder: string[];
    draftResults: DraftResult[]; // Results of current/recent draft
    draftHistory: Record<number, DraftResult[]>; // Historical results by year
    playoffs: PlayoffSeries[];
    seasonPhase: 'regular_season' | 'euro_playin' | 'playoffs_r1' | 'playoffs_r2' | 'playoffs_r3' | 'playoffs_finals' | 'offseason' | 'pre_season' | 'draft' | 'draft_summary' | 'resigning' | 'free_agency' | 'retirement_summary' | 'expansion_draft' | 'scouting' | 'coach_free_agency' | 'training';
    expansionPool: Player[];
    salaryCap: number;
    transactions: { date: Date; type: string; description: string }[];
    messages: Message[];
    isSimulating: boolean;
    tradeHistory: CompletedTrade[];
    tradeOffer: TradeProposal | null;
    awardsHistory: SeasonAwards[];
    leagueType: 'NBA' | 'EURO';
    competitionType: 'NBA' | 'EuroLeague' | 'EuroCup';
    retiredPlayersHistory: { year: number; players: RetiredPlayer[] }[];
    offseasonTasks: {
        retirements: boolean;
        scouting: boolean;
        coaching: boolean;
        draft: boolean;
        resigning: boolean;
        freeAgency: boolean;
        training: boolean;
        trainingResults: boolean;
        paySalaries: boolean;
        localTalent: boolean;
        financials: boolean;
    };
    localTalentPool: LocalTalent[];
    showAwardsModal: 'regular' | 'finals' | null;
    showMidSeasonProgressionModal: boolean;
    currentHallOfFame: Player[];
    scoutingPoints: Record<string, number>;
    scoutingReports: Record<string, Record<string, { points: number, isPotentialRevealed: boolean }>>;
    isPotentialRevealed: boolean;
    settings: {
        difficulty: 'Easy' | 'Medium' | 'Hard';
        showLoveForTheGame: boolean;
    };
    currentSaveSlot: number | null;
    // Records
    leagueRecords: GameRecord[];
    teamRecords: Record<string, GameRecord[]>;
    leagueAllTimeLeaders: Record<string, CumulativeRecord[]>; // Category -> Top 50
    teamAllTimeLeaders: Record<string, Record<string, CumulativeRecord[]>>; // TeamId -> Category -> Top 50
    // Training
    trainingSettings: Record<string, TrainingFocus>;
    trainingReport: ProgressionResult[] | null;
    isTrainingCampComplete: boolean;
    dailyMatchups: { homeId: string, awayId: string }[];
    euroSchedule: { homeId: string; awayId: string }[][];  // Full pre-generated Euro schedule (38 rounds × 10 games)
    nbaSchedule: { homeId: string; awayId: string }[][];   // Full pre-generated NBA schedule (~170 days × ~7 games)
    pendingUserResult: MatchResult | null;
    tutorialFlags: {
        hasSeenNewsTutorial: boolean;
    };
    isProcessing: boolean;
    socialMediaPosts: SocialMediaPost[];
    activeMerchCampaigns: ActiveMerchCampaign[];
    seasonGamesPlayed: number;
    isFirstSeasonPaid: boolean;
    activeCoachOffers: FreeAgencyOffer[];
    lastFreeAgencyResult?: {
        offersUpdated: FreeAgencyOffer[];
        leagueNews: string[];
        day: number;
    };
    activeOffers: FreeAgencyOffer[];
    freeAgencyDay: number;
    euroPlayIn?: {
        matchups: PlayInMatchup[];
        seedsLocked: Record<string, string[]>; // conf -> array of top 6 IDs
    };
    view: string;
}

export interface LocalTalent extends Player {
    potential: number; // 0-100
    hype: number; // 0-100
    youthStats?: {
        last10: {
            pts: number;
            reb: number;
            ast: number;
            fgp: number;
            date: Date;
        }[];
        seasonAvg: {
            pts: number;
            reb: number;
            ast: number;
        };
    };
    growthTrend: 'stagnant' | 'steady' | 'rapid' | 'generational';
}

// --- New Trade Interface for Interactivity ---
export interface TradeAssetItem {
    type: 'player' | 'pick' | 'cash';
    id: string; // PlayerId, PickId, or some unique id for cash
    description: string; // "LeBron James", "2025 Round 1", or "$15M Cash"
    subText?: string;
    color?: string;
    originalTeamId?: string; // For picks
}

export interface CompletedTrade {
    id: string;
    date: Date;
    team1Id: string;
    team2Id: string;
    team1Assets: string[]; // Keep for legacy
    team2Assets: string[];
    team1Items: TradeAssetItem[]; // New rich data
    team2Items: TradeAssetItem[];
}

export interface RotationViewData {
    startingLineup: string[];
    bench: string[];
    rotationPlan: {
        playerId: string;
        minutes: number;
        isStarter: boolean;
        rotationIndex: number;
    }[];
}

interface GameContextType extends GameState {
    startNewGame: (userTeamId: string, difficulty: 'Easy' | 'Medium' | 'Hard', expansionDetails?: { city: string, name: string, division: string, logo?: string, primaryColor?: string }) => void;
    advanceDay: () => void;
    executeTrade: (userPlayerIds: string[], userPickIds: string[], aiPlayerIds: string[], aiPickIds: string[], aiTeamId: string) => boolean;
    finishExpansionDraft: (selectedPlayerIds: string[]) => void;
    triggerDraft: () => void;
    handleDraftPick: (playerId: string) => void;
    simulateNextPick: () => void;
    simulateToUserPick: () => void;
    endDraft: () => void;
    continueFromRetirements: () => void;
    endCoachFreeAgency: () => void;
    endResigning: () => void;
    signFreeAgent: (playerId: string) => void;
    signPlayerWithContract: (playerId: string, offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => void;
    releasePlayer: (playerId: string) => void;
    negotiateContract: (playerId: string, offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => { decision: 'ACCEPTED' | 'REJECTED' | 'INSULTED'; feedback: string; };
    endFreeAgency: () => void;
    startRegularSeason: () => void;
    paySalaries: () => boolean; // Returns true if successful, false if insufficient funds
    startPlayoffs: () => void;
    startRetirementPhase: () => void; // Transition from Draft Summary
    userHireCoach: (coachId: string) => void;
    userFireCoach: (teamId: string) => void;

    spendScoutingPoints: (prospectId: string, points: number) => void;
    addNewsStory: (story: NewsStory) => void;
    endScoutingPhase: () => void;
    updateRotation: (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[]) => void;
    updateTeamHierarchy: (teamId: string, hierarchy: Record<string, number>) => void;
    simulateToTradeDeadline: () => void;
    simulateToPlayoffs: () => void;
    simulatePlayoffs: () => void;
    stopSimulation: () => void;
    simulateRound: () => void;
    saveGame: (slotId: number, silent?: boolean) => Promise<void>;
    loadGame: (slotId: number) => Promise<boolean>;
    completeOffseasonTask: (taskName: keyof GameState['offseasonTasks']) => void;

    updateCoachSettings: (teamId: string, settings: TeamStrategy) => void;
    updateRotationSchedule: (teamId: string, schedule: RotationSegment[]) => void;
    acceptTradeOffer: () => void;
    rejectTradeOffer: () => void;
    liveGameData: { home: Team, away: Team, date: Date } | null;
    startLiveGameFn: (startTimeOrMatchup?: string | { home: Team, away: Team }) => void;
    endLiveGameFn: (result: MatchResult) => void;
    startMerchCampaign: (campaign: MerchCampaign) => void;

    deleteSave: (slotId: number) => void;
    isProcessing: boolean;
    simTarget: 'none' | 'deadline' | 'playoffs' | 'playoffs_end' | 'round';
    simSpeed: number;
    setSimSpeed: (speed: number) => void;
    updatePlayerAttribute: (id: string, attr: string, val: any) => void;
    setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
    // UI State in Context for deep access
    selectedPlayerId: string | null;
    setSelectedPlayerId: (id: string | null) => void;
    selectedGame: MatchResult | null;
    setSelectedGame: (game: MatchResult | null) => void;
    shopPlayerId: string | null;
    setShopPlayerId: (id: string | null) => void;
    leagueType: 'NBA' | 'EURO';
    setLeagueType: (type: 'NBA' | 'EURO') => void;
    competitionType: 'NBA' | 'EuroLeague' | 'EuroCup';
    setCompetitionType: (type: 'NBA' | 'EuroLeague' | 'EuroCup') => void;
    initialAiPlayerId: string | undefined;
    setInitialAiPlayerId: (id: string | undefined) => void;
    prefilledTrade: any | null;
    setPrefilledTrade: (proposal: any | null) => void;
    completeLiveGame: (result: MatchResult) => void;
    showingAwards: SeasonAwards | null;
    setShowingAwards: (awards: SeasonAwards | null) => void;
    showSaveLoad: 'save' | 'load' | null;
    setShowSaveLoad: (mode: 'save' | 'load' | null) => void;
    selectedTeamId: string | null;
    setSelectedTeamId: (id: string | null) => void;
    showExitModal: boolean;
    setShowExitModal: (show: boolean) => void;
    showPayrollModal: boolean;
    setShowPayrollModal: (show: boolean) => void;
    modalMessage: { title: string, msg: string, type: 'error' | 'info' | 'success' } | null;
    setModalMessage: (msg: { title: string, msg: string, type: 'error' | 'info' | 'success' } | null) => void;
    currentNegotiation: any | null;
    year: number;
    setView: (view: string) => void;

    // Training
    updateTrainingFocus: (playerId: string, focus: TrainingFocus) => void;
    runTrainingCamp: () => void;
    generateDailyMatchups: () => void;
    setHasSeenNewsTutorial: () => void;
    placeOffer: (playerId: string, amount: number, years: number) => void;
    advanceFreeAgencyDay: () => void;
    sellPlayer: (playerId: string) => void;
    sellPlayerToTeam: (playerId: string, targetTeamId: string) => { success: boolean, message: string };
    placeCoachOffer: (coachId: string, amount: number, years: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        console.error('[GameContext] useGame was called outside of a GameProvider!');
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameState, setGameState] = useState<GameState>({
        players: [],
        teams: NBA_TEAMS,
        news: [],
        coaches: [],
        userTeamId: NBA_TEAMS[0].id,
        contracts: [],
        games: [],
        date: new Date(2026, 9, 22), // Start of season (approx)
        isInitialized: false,
        gmProfile: {
            firstName: 'GM',
            lastName: 'User',
            level: 1,
            xp: 0,
            unlockedPerks: [],
            perkPoints: 0
        },
        draftClass: [],
        draftOrder: [],
        draftResults: [],
        draftHistory: {},
        offseasonTasks: {
            retirements: false,
            scouting: false,
            coaching: false,
            draft: false,
            resigning: false,
            freeAgency: false,
            training: false,
            trainingResults: false,
            paySalaries: false,
            localTalent: false,
            financials: false
        },
        localTalentPool: [],
        showAwardsModal: null,
        showMidSeasonProgressionModal: false,
        currentHallOfFame: [],
        seasonPhase: 'regular_season',
        playoffs: [],
        salaryCap: 155000000,
        transactions: [],
        messages: [],
        awardsHistory: [],
        leagueType: 'NBA',
        competitionType: 'NBA',
        retiredPlayersHistory: [],
        scoutingPoints: {},
        isPotentialRevealed: false,
        leagueRecords: [],
        teamRecords: {},
        leagueAllTimeLeaders: {},
        teamAllTimeLeaders: {},
        settings: {
            difficulty: 'Medium',
            showLoveForTheGame: false
        },
        currentSaveSlot: null,
        trainingSettings: {},
        trainingReport: null,
        expansionPool: [],
        isSimulating: false,
        tradeHistory: [],
        tradeOffer: null,
        scoutingReports: {},
        isTrainingCampComplete: false,
        dailyMatchups: [],
        euroSchedule: [],
        nbaSchedule: [],
        pendingUserResult: null,
        tutorialFlags: { hasSeenNewsTutorial: false },
        isProcessing: false,
        activeOffers: [],
        freeAgencyDay: 1,
        socialMediaPosts: [],
        activeMerchCampaigns: [],
        seasonGamesPlayed: 0,
        isFirstSeasonPaid: false,
        activeCoachOffers: [],
        aiGms: [],
        view: 'dashboard'
    });

    // Ref to hold the latest state, avoiding stale closures in async functions or event handlers
    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    // Constants
    const SALARY_CAP = 155000000;
    const LUXURY_TAX_THRESHOLD = 188000000;
    const MIN_ROSTER_SIZE = 8;
    const MAX_ROSTER_SIZE = 15;
    const [simTarget, setSimTarget] = useState<'none' | 'deadline' | 'playoffs' | 'playoffs_end' | 'round'>('none');
    console.log(`[Render] GameProvider Rendered. simTarget: ${simTarget}`);
    const [targetRound, setTargetRound] = useState<number | null>(null);
    const [simSpeed, setSimSpeed] = useState<number>(1000);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const generateDailyMatchups = () => {
        setGameState(prev => {
            const roundIdx = prev.seasonGamesPlayed || 0;

            if (prev.leagueType === 'EURO') {
                // Euro: index into pre-generated 38-round schedule
                if (roundIdx < (prev.euroSchedule?.length || 0)) {
                    return { ...prev, dailyMatchups: prev.euroSchedule[roundIdx] };
                }
                return { ...prev, dailyMatchups: [] };
            }

            // NBA: index into pre-generated 82-day schedule
            if (prev.nbaSchedule && prev.nbaSchedule.length > 0) {
                if (roundIdx < prev.nbaSchedule.length) {
                    return { ...prev, dailyMatchups: prev.nbaSchedule[roundIdx] };
                }
                return { ...prev, dailyMatchups: [] };
            }

            // Fallback (old save without nbaSchedule): generate on-the-fly for this day only
            const activeTeams = prev.teams.filter(t => (t.wins + t.losses) < 82);
            const matchups: { homeId: string, awayId: string }[] = [];
            const shuffled = [...activeTeams].sort(() => Math.random() - 0.5);
            for (let i = 0; i < shuffled.length; i += 2) {
                if (i + 1 < shuffled.length) {
                    matchups.push({ homeId: shuffled[i].id, awayId: shuffled[i + 1].id });
                }
            }
            return { ...prev, dailyMatchups: matchups };
        });
    };

    // Live Game State
    const [liveGame, setLiveGame] = useState<{ home: Team, away: Team, date: Date } | null>(null);

    const isSimulating = simTarget !== 'none';
    const stopSimulation = () => setSimTarget('none');

    const startLiveGame = (arg?: string | { home: Team, away: Team }) => {
        // Option A: Direct Matchup passed (e.g. from Playoffs)
        if (typeof arg === 'object' && arg.home && arg.away) {
            setLiveGame({
                home: arg.home,
                away: arg.away,
                date: gameState.date
            });
            return;
        }

        // Option B: Regular Season Daily Matchup
        const userMatchup = gameState.dailyMatchups.find(m => m.homeId === gameState.userTeamId || m.awayId === gameState.userTeamId);
        if (!userMatchup) return;

        const homeTeam = gameState.teams.find(t => t.id === userMatchup.homeId)!;
        const awayTeam = gameState.teams.find(t => t.id === userMatchup.awayId)!;

        setLiveGame({
            home: homeTeam,
            away: awayTeam,
            date: gameState.date
        });
    };

    // UI State for Deep Navigation & Modals
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [selectedGame, setSelectedGame] = useState<MatchResult | null>(null);
    const [shopPlayerId, setShopPlayerId] = useState<string | null>(null);
    const [initialAiPlayerId, setInitialAiPlayerId] = useState<string | undefined>(undefined);
    const [prefilledTrade, setPrefilledTrade] = useState<any | null>(null);
    const [showingAwards, setShowingAwards] = useState<SeasonAwards | null>(null);
    const [showSaveLoad, setShowSaveLoad] = useState<'save' | 'load' | null>(null);
    const [showExitModal, setShowExitModal] = useState<boolean>(false);
    const [showPayrollModal, setShowPayrollModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<{ title: string, msg: string, type: 'error' | 'info' | 'success' } | null>(null);
    const [currentNegotiation, setCurrentNegotiation] = useState<any | null>(null);

    const setLeagueType = (type: 'NBA' | 'EURO') => {
        setGameState(prev => ({ ...prev, leagueType: type }));
    };

    const setCompetitionType = (type: 'NBA' | 'EuroLeague' | 'EuroCup') => {
        setGameState(prev => ({ ...prev, competitionType: type }));
    };

    const setView = (v: string) => setGameState(prev => ({ ...prev, view: v }));

    // Auto-advance after manual game
    useEffect(() => {
        if (gameState.pendingUserResult) {
            advanceDay();
        }
    }, [gameState.pendingUserResult]);

    const completeLiveGame = (result: MatchResult) => {
        setGameState(prev => {
            const { leagueRecords, teamRecords } = checkAndUpdateRecords(
                prev.leagueRecords || [],
                prev.teamRecords || {},
                [result],
                prev.date,
                prev.teams
            );
            const isRegularSeason = prev.seasonPhase === 'regular_season';
            const { leagueLeaders, teamLeaders } = isRegularSeason 
                ? updateCumulativeTotals(
                    prev.leagueAllTimeLeaders || {},
                    prev.teamAllTimeLeaders || {},
                    [result]
                )
                : { leagueLeaders: prev.leagueAllTimeLeaders, teamLeaders: prev.teamAllTimeLeaders };
            return {
                ...prev,
                pendingUserResult: result,
                leagueRecords,
                teamRecords,
                leagueAllTimeLeaders: leagueLeaders,
                teamAllTimeLeaders: teamLeaders
            };
        });
        setLiveGame(null);
    };

    // Ensure dailyMatchups are initialized for existing saves
    useEffect(() => {
        const _seasonLength = gameState.leagueType === 'EURO' ? 38 : 82;
        if (gameState.isInitialized && 
            gameState.seasonPhase === 'regular_season' && 
            gameState.dailyMatchups.length === 0 && 
            (gameState.seasonGamesPlayed || 0) < _seasonLength
        ) {
            console.log("Initializing dailyMatchups for regular season...");
            generateDailyMatchups();
        }
    }, [gameState.isInitialized, gameState.seasonPhase, gameState.dailyMatchups.length]);

    // RECOVERY: Check for orphaned playoff stats (Fix for missing history)
    useEffect(() => {
        if (!gameState.isInitialized) return;
        if (gameState.seasonPhase !== 'regular_season') return;

        // Check if any player has playoff stats that weren't archived
        const needsRecovery = gameState.players.some(p => p.playoffStats && p.playoffStats.gamesPlayed > 0);

        if (needsRecovery) {
            console.log("[Recovery] Found orphaned playoff stats. Archiving...");
            setGameState(prev => {
                // Safety check within the update
                const stillNeedsRecovery = prev.players.some(p => p.playoffStats && p.playoffStats.gamesPlayed > 0);
                if (!stillNeedsRecovery) return prev;

                // Assuming these are from the PREVIOUS season (e.g. 2025 playoffs, now in 2026 season)
                // If we are in reg season, the "current" year is the END year of the current season.
                // So previous playoffs = currentYear - 1.
                const recoveredYear = prev.date.getFullYear() - 1;

                const recoveredPlayers = prev.players.map(p => {
                    if (p.playoffStats && p.playoffStats.gamesPlayed > 0) {
                        const newCareerStat: CareerStat = {
                            ...p.playoffStats,
                            season: recoveredYear,
                            teamId: p.teamId || 'REL', // Fallback if released
                            isPlayoffs: true
                        };
                        return {
                            ...p,
                            careerStats: [...p.careerStats, newCareerStat],
                            playoffStats: undefined // Clear the source
                        };
                    }
                    return p;
                });

                return {
                    ...prev,
                    players: recoveredPlayers
                };
            });
        }
    }, [gameState.isInitialized, gameState.seasonPhase, gameState.players]);

    const updatePlayerAttribute = (id: string, attr: string, val: any) => {
        setGameState(prev => ({
            ...prev,
            players: prev.players.map(p => p.id === id ? { ...p, attributes: { ...p.attributes, [attr]: val } } : p)
        }));
    };

    const setHasSeenNewsTutorial = () => {
        setGameState(prev => ({
            ...prev,
            tutorialFlags: { ...prev.tutorialFlags, hasSeenNewsTutorial: true }
        }));
    };

    const addNewsStory = (story: NewsStory) => {
        setGameState(prev => ({
            ...prev,
            news: [story, ...prev.news].slice(0, 100) // Keep last 100 stories
        }));
    };

    const expandLeague = async (city: string, name: string, division: string, logo?: string, primaryColor?: string) => {
        setIsProcessing(true);
        try {
            const newTeamId = (gameState.teams.length + 1).toString(); // Simple ID generation
            const conference = ['Atlantic', 'Central', 'Southeast'].includes(division) ? 'East' : 'West';

            const newTeam: Team = {
                id: newTeamId,
                name: name,
                city: city,
                abbreviation: name.substring(0, 3).toUpperCase(),
                conference: conference,
                logo: logo,
                cash: 350000000,
                salaryCapSpace: 140000000,
                debt: 0,
                fanInterest: 1.0,
                ownerPatience: 100,
                marketSize: 'Medium',
                rosterIds: [],
                wins: 0,
                losses: 0,
                history: [],
                draftPicks: [],
                colors: { primary: primaryColor || '#000000', secondary: '#FFFFFF' },
                financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] },
                rivalIds: []
            };

            // Generate future picks for each team
            const currentYear = new Date().getFullYear();
            gameState.teams.forEach(t => {
                const futurePicks: DraftPick[] = [];
                for (let year = currentYear; year <= currentYear + 4; year++) {
                    futurePicks.push({ 
                        id: generateUUID(), 
                        year, 
                        round: 1, 
                        originalTeamId: t.id,
                        originalTeamName: t.name
                    });
                    futurePicks.push({ 
                        id: generateUUID(), 
                        year, 
                        round: 2, 
                        originalTeamId: t.id,
                        originalTeamName: t.name
                    });
                }
                t.draftPicks = futurePicks;
            });

            // Generate Expansion Pool
            // In a real scenario, we'd ask teams to protect players.
            // Simplified: Generate a pool of "Expansion Level" players (Role players, vets, some prospects)
            // + Potentially grab some deep benchers from existing teams? 
            // Let's generate a dedicated pool to avoid messing up existing team rotations mid-season.
            const poolSize = 50;
            const expansionPool = Array.from({ length: poolSize }, () => {
                const tier = Math.random() > 0.8 ? 'starter' : 'bench'; // Mostly bench/role players
                const p = generatePlayer(undefined, tier);
                // Nerf slightly to reflect "unprotected" status
                p.overall = Math.max(70, p.overall - 3);
                return p;
            });

            setGameState(prev => ({
                ...prev,
                teams: [...prev.teams, newTeam],
                userTeamId: newTeamId, // Switch user to new team
                expansionPool: expansionPool,
                seasonPhase: 'expansion_draft',
                messages: [...prev.messages, {
                    id: generateUUID(),
                    date: prev.date,
                    title: 'League Expansion',
                    text: `The ${city} ${name} have officially joined the league! The Expansion Draft will begin immediately.`,
                    type: 'success',
                    read: false
                }],
                news: [{
                    id: generateUUID(),
                    date: prev.date,
                    title: `League Expands to ${city}`,
                    headline: `The ${name} join the league!`,
                    image: logo,
                    content: `The league has announced the addition of the ${city} ${name} as its newest franchise.`,
                    type: 'GENERAL',
                    priority: 10,
                    hasRead: false
                }, ...prev.news]
            }));

        } catch (error) {
            console.error("Failed to expand league:", error);
        } finally {
            setIsProcessing(false);
        }
    };





    // ... (inside GameProvider)

    const startNewGame = async (
        userTeamId: string,
        difficulty: 'Easy' | 'Medium' | 'Hard',
        expansionConfig?: { city: string, name: string, division: string, logo?: string, primaryColor?: string }
    ) => {
        console.log("GameContext: startNewGame called...");
        setIsProcessing(true); // Show loading state if applicable
        try {
            // 1. Load Teams from Data
            const baseTeams = gameState.leagueType === 'EURO' ? EURO_TEAMS : NBA_TEAMS;
            const teams: Team[] = JSON.parse(JSON.stringify(baseTeams));

            let currentExpansionPool: Player[] = [];
            let currentSeasonPhase: any = 'regular_season';
            let finalUserTeamId = userTeamId;

            // Handle Expansion Config
            if (expansionConfig) {
                const newTeamId = '31';
                const conference = ['Atlantic', 'Central', 'Southeast'].includes(expansionConfig.division) ? 'East' : 'West';

                const newTeam: Team = {
                    id: newTeamId,
                    name: expansionConfig.name,
                    city: expansionConfig.city,
                    abbreviation: (expansionConfig.name.length > 3 ? expansionConfig.name.substring(0, 3) : expansionConfig.name).toUpperCase(),
                    conference: conference,
                    logo: expansionConfig.logo,
                    cash: 350000000,
                    salaryCapSpace: 140000000,
                    debt: 0,
                    fanInterest: 1.0,
                    ownerPatience: 100,
                    marketSize: 'Medium',
                    rosterIds: [],
                    wins: 0,
                    losses: 0,
                    history: [],
                    draftPicks: [],
                    colors: { primary: expansionConfig.primaryColor || '#000000', secondary: '#FFFFFF' },
                    financials: { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] },
                    strategy: { direction: 'Rebuilding', aggressiveness: 50, focus: 'Balanced', lastDirectionChangeYear: 2025 },
                    rivalIds: []
                };

                // Generate Picks
                const currentYear = new Date().getFullYear();
                for (let yr = currentYear; yr <= currentYear + 4; yr++) {
                    newTeam.draftPicks.push({ id: generateUUID(), year: yr, round: 1, originalTeamId: newTeamId, originalTeamName: newTeam.name });
                    newTeam.draftPicks.push({ id: generateUUID(), year: yr, round: 2, originalTeamId: newTeamId, originalTeamName: newTeam.name });
                }

                teams.push(newTeam);
                finalUserTeamId = newTeamId;
                currentSeasonPhase = 'expansion_draft';
            }

            // 2. Generate Players & Contracts using CSV IMPORTER
            console.log("GameContext: Importing rosters from CSV...");
            // Use empty array for existing players to force fresh import
            const result = await importNbaPlayers(teams, []);

            let players = result.newPlayers;
            let contracts = result.newContracts;


            // Fallback if CSV fails or is empty (should not happen if file exists)
            if (players.length === 0 || gameState.leagueType === 'EURO') {
                if (gameState.leagueType !== 'EURO') {
                    console.warn("CSV Import failed or empty. Falling back to Seeded Rosters.");
                } else {
                    console.log("EuroLeague Mode: Using Seeded Euro Rosters.");
                }
            
                // 2. Generate Players & Contracts
                const seeded = seedRealRosters(teams, gameState.leagueType);
                players = seeded.players;
                contracts = seeded.contracts;
            } else {
                console.log(`GameContext: Imported ${players.length} players and ${contracts.length} contracts from CSV.`);
            }

            // 3. Assign Players to Teams
            let updatedPlayers = [...players];
            // BACKFILL LOGIC: Ensure every team has at least 14 players before Expansion Logic runs
            // This fixes the "Expansion Draft only has 60 players" bug if CSV rosters are small (e.g. 10 players)
            teams.forEach(t => {
                const teamPlayers = updatedPlayers.filter(p => p.teamId === t.id);
                if (teamPlayers.length < 14) {
                    const needed = 14 - teamPlayers.length;
                    console.log(`[StartGame] Backfilling ${t.name} with ${needed} players.`);
                    for (let i = 0; i < needed; i++) {
                        // Generate Bench/Prospect level players
                        const p = generatePlayer(undefined, Math.random() > 0.7 ? 'bench' : 'prospect');
                        p.teamId = t.id;
                        updatedPlayers.push(p);

                        // Generate contract for them too
                        contracts.push({
                            id: `cont_${p.id}`,
                            playerId: p.id,
                            teamId: t.id,
                            amount: 1000000 + Math.floor(Math.random() * 2000000), // 1-3M
                            yearsLeft: 1 + Math.floor(Math.random() * 2), // 1-2 years
                            startYear: 2024,
                            role: 'Bench'
                        });
                    }
                }
            });

            updatedPlayers.forEach(player => {
                const team = teams.find(t => t.id === player.teamId);
                if (!team) return;

                if (!team.rosterIds) team.rosterIds = [];
                // Ensure no duplicates if using fallback logic improperly, but here we are clean
                if (!team.rosterIds.includes(player.id)) {
                    team.rosterIds.push(player.id);
                }
            });

            // DRAFT CLASS GENERATION (Ensures enough prospects for all teams)
            let initialDraftClass: Player[] = [];
            console.log("GameContext: Generating Draft Class (70 Prospects)...");
            // Generate a full class to ensure no shortages (62 picks needed for 31 teams)
            for (let i = 0; i < 70; i++) {
                const type = i < 15 ? 'starter' : (i < 40 ? 'bench' : 'prospect');
                initialDraftClass.push(generatePlayer(undefined, type));
            }

            // Handle Realistic Expansion Pool Generation
            if (expansionConfig) {
                console.log("GameContext: Generating Realistic Expansion Pool...");
                teams.forEach(t => {
                    if (t.id === '31') return;

                    const teamRoster = updatedPlayers.filter(p => p.teamId === t.id);
                    const sorted = [...teamRoster].sort((a, b) => b.overall - a.overall);

                    const exposed = sorted.slice(8);
                    exposed.forEach(p => {
                        // Remove from original team roster
                        t.rosterIds = t.rosterIds.filter(id => id !== p.id);
                        // Add to expansion pool
                        currentExpansionPool.push(p);
                        // Clear teamId for the draft view to distinguish them
                        p.teamId = null;
                        // Contract remains for return logic
                    });
                });
                console.log(`GameContext: Expansion Pool initialized with ${currentExpansionPool.length} players.`);
            }

            const INITIAL_SALARY_CAP = 155000000;
            const EURO_BASE_CAP = 30000000; // Used as a fallback for league-wide state

            // 4. Initialize AI GMs
            const allTeamIds = teams.map(t => t.id);
            const initialGms = initializeLeagueGMs(allTeamIds);

            // Assign GMs to teams in the team objects
            teams.forEach(t => {
                const teamGm = initialGms.find(g => g.teamId === t.id);
                if (teamGm) {
                    t.gmId = teamGm.id;
                }
            });

            // 5. Update Team Budgets & Draft Picks
            teams.forEach(t => {
                const teamContracts = contracts.filter(c => c.teamId === t.id);
                const totalSalary = teamContracts.reduce((sum, c) => sum + c.amount, 0);
                
                if (gameState.leagueType === 'EURO') {
                    // EURO EXCLUSIVE FINANCIAL SYSTEM
                    let teamSalaryCap = t.conference === 'EuroLeague' ? 25000000 : 8000000;
                    
                    if (t.conference === 'EuroLeague') {
                        if (t.cash >= 25000000) teamSalaryCap = 35000000; // Powerhouses (Panathinaikos, Real Madrid, etc.)
                        else if (t.cash >= 18000000) teamSalaryCap = 25000000; // Contenders (Olympiacos, Milan, etc.)
                        else teamSalaryCap = 18000000; // Lower tier EL
                    } else if (t.conference === 'EuroCup') {
                        if (t.cash >= 8000000) teamSalaryCap = 15000000; // Top EuroCup (Hapoel Jerusalem, London)
                        else teamSalaryCap = 8000000; // Standard EuroCup
                    }
                    
                    t.salaryCapSpace = teamSalaryCap - totalSalary;
                    // Note: t.cash is preserved from teams.ts for European teams
                } else {
                    // NBA FINANCIAL SYSTEM (UNTOUCHED)
                    t.salaryCapSpace = INITIAL_SALARY_CAP - totalSalary;
                    t.cash = 100000000; // Standard NBA Reserve
                }

                if (t.id === userTeamId) {
                    if (gameState.leagueType === 'EURO') {
                        if (difficulty === 'Easy') t.cash += 10000000; 
                        if (difficulty === 'Hard') t.cash -= 5000000;
                    } else {
                        if (difficulty === 'Easy') t.cash += 50000000;
                        if (difficulty === 'Hard') t.cash -= 50000000;
                    }
                }

                t.rosterIds = updatedPlayers.filter(p => p.teamId === t.id).map(p => p.id);

                t.draftPicks = [];
                const currentYear = 2025;
                for (let yr = currentYear; yr <= currentYear + 4; yr++) {
                    t.draftPicks.push({
                        id: generateUUID(),
                        year: yr,
                        round: 1,
                        originalTeamId: t.id,
                        originalTeamName: t.name
                    });
                    t.draftPicks.push({
                        id: generateUUID(),
                        year: yr,
                        round: 2,
                        originalTeamId: t.id,
                        originalTeamName: t.name
                    });
                }
            });

            // Initialize Coaches - one per team + 20 surplus free agents
            const initialCoaches: Coach[] = teams.map(t => {
                const coach = generateCoach(t.id);
                t.coachId = coach.id;
                t.tactics = getTacticsForStyle(coach.style);
                return coach;
            });
            // Add surplus free agent coaches
            for (let i = 0; i < 20; i++) {
                initialCoaches.push(generateCoach(null));
            }


            // coachSettings logic removed as it's deprecated in Team model

            // 6. Apply AI Rotation Logic
            teams.forEach(t => {
                const teamPlayers = updatedPlayers.filter(p => p.teamId === t.id);
                if (teamPlayers.length > 0) {
                    const strategy = t.id === userTeamId ? 'Standard' : 'Heavy Starters';
                    const optimized = optimizeRotation(teamPlayers, strategy);
                    updatedPlayers = updatedPlayers.map(p => {
                        const opt = optimized.find(op => op.id === p.id);
                        return opt ? opt : p;
                    });
                }
            });

            // 5. Free Agents (Optional: small pool) - Balanced to keep OVR < 85
            for (let i = 0; i < 20; i++) { 
                const fa = generatePlayer(undefined, 'bench');
                // Ensure no superstasr (85+) in initial pool
                if (fa.overall > 85) fa.overall = 82; 
                updatedPlayers.push(fa); 
            }

            console.log("GameContext: Setting Game State...", {
                playerCount: updatedPlayers.length,
                teamCount: teams.length,
                userTeamId: finalUserTeamId
            });

            // Determine Slot
            let assignedSlot: number | null = null;
            if (!localStorage.getItem('save_slot_1')) assignedSlot = 1;
            else if (!localStorage.getItem('save_slot_2')) assignedSlot = 2;
            else if (!localStorage.getItem('save_slot_3')) assignedSlot = 3;

            setGameState({
                teams,
                players: updatedPlayers,
                userTeamId: finalUserTeamId,
                contracts,
                games: [],
                date: new Date(2025, 9, 22), // Oct 22
                salaryCap: gameState.leagueType === 'EURO' ? EURO_BASE_CAP : INITIAL_SALARY_CAP,
                coaches: initialCoaches, // Add coaches here
                news: [],
                isInitialized: true,
                aiGms: initializeLeagueGMs(teams.map(t => t.id)),
                isPotentialRevealed: false,
                awardsHistory: [],
                activeMerchCampaigns: [],
                gmProfile: {
                    firstName: 'GM',
                    lastName: 'User',
                    level: 1,
                    xp: 0,
                    unlockedPerks: [],
                    perkPoints: 0
                },
                draftClass: initialDraftClass, // Use the injected class if expansion, else empty
                draftOrder: [], // Will be set on init
                draftResults: [],
                draftHistory: {},
                offseasonTasks: {
                    retirements: false,
                    scouting: false,
                    coaching: false,
                    draft: false,
                    resigning: false,
                    freeAgency: false,
                    training: false,
                    trainingResults: false,
                    paySalaries: false,
                    localTalent: false,
                    financials: false
                },
                localTalentPool: generateLocalTalentPool(30),
                seasonPhase: currentSeasonPhase,
                playoffs: [],
                transactions: [],
                messages: [],
                trainingSettings: {},
                trainingReport: null,
                isTrainingCampComplete: false,
                expansionPool: currentExpansionPool,
                isSimulating: false,
                tradeHistory: [],
                tradeOffer: null,
                settings: {
                    difficulty,
                    showLoveForTheGame: true
                },
                currentSaveSlot: assignedSlot,
                retiredPlayersHistory: [],
                scoutingPoints: {},
                scoutingReports: {},
                dailyMatchups: (() => {
                    if (gameState.leagueType === 'EURO') {
                        const elTeams = teams.filter(t => t.conference === 'EuroLeague');
                        const ecTeams = teams.filter(t => t.conference === 'EuroCup');
                        const elRounds = generateEuroSchedule(elTeams);
                        const ecRounds = generateEuroSchedule(ecTeams);
                        const totalRounds = Math.max(elRounds.length, ecRounds.length);
                        const built: { homeId: string; awayId: string }[][] = [];
                        for (let i = 0; i < totalRounds; i++) {
                            built.push([...(elRounds[i] || []), ...(ecRounds[i] || [])]);
                        }
                        return built.length > 0 ? built[0] : [];
                    } else {
                        const built = generate82GameSchedule(teams);
                        return built.length > 0 ? built[0] : [];
                    }
                })(),
                euroSchedule: (() => {
                    if (gameState.leagueType !== 'EURO') return [];
                    const elTeams = teams.filter(t => t.conference === 'EuroLeague');
                    const ecTeams = teams.filter(t => t.conference === 'EuroCup');
                    const elRounds = generateEuroSchedule(elTeams);
                    const ecRounds = generateEuroSchedule(ecTeams);
                    const totalRounds = Math.max(elRounds.length, ecRounds.length);
                    const built: { homeId: string; awayId: string }[][] = [];
                    for (let i = 0; i < totalRounds; i++) {
                        built.push([...(elRounds[i] || []), ...(ecRounds[i] || [])]);
                    }
                    return built;
                })(),
                nbaSchedule: (() => {
                    if (gameState.leagueType !== 'NBA') return [];
                    return generate82GameSchedule(teams);
                })(),
                pendingUserResult: null,
                tutorialFlags: { hasSeenNewsTutorial: false },
                isProcessing: false,
                socialMediaPosts: [],
                seasonGamesPlayed: 0,
                isFirstSeasonPaid: true, // First season is free, so we don't get blocked by the budget gate
                activeOffers: [],
                activeCoachOffers: [],
                freeAgencyDay: 1,
                leagueRecords: [],
                teamRecords: {},
                leagueAllTimeLeaders: {},
                teamAllTimeLeaders: {},
                showAwardsModal: null,
                showMidSeasonProgressionModal: false,
                currentHallOfFame: [],
                leagueType: gameState.leagueType,
                competitionType: gameState.competitionType,
                view: "dashboard"
            });

            // Apply Real-World Trades (Post-Init Patch)
            setGameState(prev => applyRealWorldTrades(prev));

            // Initial Save if slot assigned
            if (assignedSlot) {
                // We rely on auto-save effect or manual save.
                // Auto-save effect might not check 'currentSaveSlot' inside strict mode immediately?
                // Actually Effect depends on gameState, so it will trigger.
            }

            console.log("GameContext: Game State set.");

            setSimTarget('none');
        } catch (error) {
            console.error("GameContext: Fatal error in startNewGame", error);
            // Ensure alert shows even if caught
            alert("Fatal Error Starting Game: " + (error instanceof Error ? error.message : String(error)));
            throw error;
        }
    };

    const startCustomGame = async (
        teams: Team[],
        players: Player[],
        contracts: Contract[],
        userTeamId: string,
        difficulty: 'Easy' | 'Medium' | 'Hard',
        initialDraftClass: Player[],
        currentSeasonPhase: 'regular_season' | 'playoffs_r1' | 'playoffs_r2' | 'playoffs_r3' | 'playoffs_finals' | 'offseason' | 'pre_season' | 'draft' | 'draft_summary' | 'resigning' | 'free_agency' | 'retirement_summary' | 'expansion_draft' | 'scouting' | 'coach_free_agency',
        currentExpansionPool: Player[]
    ) => {
        try {
            setGameState(prev => ({ ...prev, isProcessing: true })); // Set processing flag

            // Initialize Coaches for custom game
            const initialCoaches: Coach[] = teams.map(t => {
                const coach = generateCoach(t.id);
                t.coachId = coach.id; // Assign coachId to the team
                t.tactics = getTacticsForStyle(coach.style); // Assign tactics based on style
                return coach;
            });

            setGameState({
                teams,
                players,
                aiGms: initializeLeagueGMs(teams.map(t => t.id)),
                userTeamId,
                contracts,
                games: [],
                date: new Date(2025, 9, 22), // Oct 22
                salaryCap: gameState.leagueType === 'EURO' ? 30000000 : 155000000,
                coaches: initialCoaches, // Add coaches here
                news: [],
                isInitialized: true,
                isPotentialRevealed: false,
                awardsHistory: [],
                activeMerchCampaigns: [],
                gmProfile: {
                    firstName: 'GM',
                    lastName: 'User',
                    level: 1,
                    xp: 0,
                    unlockedPerks: [],
                    perkPoints: 0
                },
                draftClass: initialDraftClass,
                draftOrder: [],
                draftResults: [],
                draftHistory: {},
                localTalentPool: [],
                offseasonTasks: {
                    retirements: false,
                    scouting: false,
                    coaching: false,
                    draft: false,
                    resigning: false,
                    freeAgency: false,
                    training: false,
                    trainingResults: false,
                    paySalaries: false,
                    localTalent: false,
                    financials: false
                },
                seasonPhase: currentSeasonPhase,
                playoffs: [],
                transactions: [],
                messages: [],
                trainingSettings: {},
                trainingReport: null,
                isTrainingCampComplete: false,
                expansionPool: currentExpansionPool,
                isSimulating: false,
                tradeHistory: [],
                tradeOffer: null,
                settings: {
                    difficulty,
                    showLoveForTheGame: true
                },
                currentSaveSlot: null, // Custom games don't auto-assign a slot
                retiredPlayersHistory: [],
                scoutingPoints: {},
                scoutingReports: {},
                dailyMatchups: (() => {
                    if (gameState.leagueType === 'EURO') {
                        const elTeams = teams.filter(t => t.conference === 'EuroLeague');
                        const ecTeams = teams.filter(t => t.conference === 'EuroCup');
                        const elRounds = generateEuroSchedule(elTeams);
                        const ecRounds = generateEuroSchedule(ecTeams);
                        const totalRounds = Math.max(elRounds.length, ecRounds.length);
                        const built: { homeId: string; awayId: string }[][] = [];
                        for (let i = 0; i < totalRounds; i++) {
                            built.push([...(elRounds[i] || []), ...(ecRounds[i] || [])]);
                        }
                        return built.length > 0 ? built[0] : [];
                    } else {
                        const built = generate82GameSchedule(teams);
                        return built.length > 0 ? built[0] : [];
                    }
                })(),
                euroSchedule: (() => {
                    if (gameState.leagueType !== 'EURO') return [];
                    const elTeams = teams.filter(t => t.conference === 'EuroLeague');
                    const ecTeams = teams.filter(t => t.conference === 'EuroCup');
                    const elRounds = generateEuroSchedule(elTeams);
                    const ecRounds = generateEuroSchedule(ecTeams);
                    const totalRounds = Math.max(elRounds.length, ecRounds.length);
                    const built: { homeId: string; awayId: string }[][] = [];
                    for (let i = 0; i < totalRounds; i++) {
                        built.push([...(elRounds[i] || []), ...(ecRounds[i] || [])]);
                    }
                    return built;
                })(),
                nbaSchedule: (() => {
                    if (gameState.leagueType !== 'NBA') return [];
                    return generate82GameSchedule(teams);
                })(),
                pendingUserResult: null,
                tutorialFlags: { hasSeenNewsTutorial: false },
                isProcessing: false,
                socialMediaPosts: [],
                seasonGamesPlayed: 0,
                isFirstSeasonPaid: true,
                activeOffers: [],
                activeCoachOffers: [],
                freeAgencyDay: 1,
                leagueRecords: [],
                teamRecords: {},
                leagueAllTimeLeaders: {},
                teamAllTimeLeaders: {},
                showAwardsModal: null,
                showMidSeasonProgressionModal: false,
                currentHallOfFame: [],
                leagueType: gameState.leagueType,
                competitionType: gameState.competitionType,
                view: "dashboard"
            });

            setGameState(prev => applyRealWorldTrades(prev));

            console.log("GameContext: Custom Game State set.");
            setSimTarget('none');
        } catch (error) {
            console.error("GameContext: Fatal error in startCustomGame", error);
            alert("Fatal Error Starting Custom Game: " + (error instanceof Error ? error.message : String(error)));
            throw error;
        }
    };

    // Helper: Generate Picks for a specific year
    const generatePicksForYear = (teams: Team[], year: number): DraftPick[] => {
        const newPicks: DraftPick[] = [];
        teams.forEach(t => {
            newPicks.push({ id: generateUUID(), year, round: 1, originalTeamId: t.id, originalTeamName: t.name });
            newPicks.push({ id: generateUUID(), year, round: 2, originalTeamId: t.id, originalTeamName: t.name });
        });
        return newPicks;
    };


    const paySalaries = (): boolean => {
        const { teams, userTeamId, contracts } = gameState;
        const team = teams.find(t => t.id === userTeamId);
        if (!team) return false;

        const totalSalaries = contracts
            .filter(c => c.teamId === userTeamId && c.yearsLeft > 0)
            .reduce((sum, c) => sum + c.amount, 0);

        if (team.cash < totalSalaries) {
            return false;
        }

        // Deduct Cash
        setGameState(prev => {
            const updatedTeams = prev.teams.map(t => {
                if (t.id === userTeamId) {
                    return { ...t, cash: t.cash - totalSalaries };
                }
                return t;
            });

            // Add Transaction Log
            const newTransaction = {
                date: new Date(prev.date),
                type: 'Financial',
                description: `Paid Player Salaries: -$${(totalSalaries / 1000000).toFixed(2)}M`
            };

            return {
                ...prev,
                teams: updatedTeams,
                transactions: [newTransaction, ...prev.transactions],
                isFirstSeasonPaid: true, // Mark as paid so we don't ask again
                offseasonTasks: {
                    ...prev.offseasonTasks,
                    paySalaries: true
                }
            };
        });

        return true;
    };

    const startRegularSeason = () => {
        setGameState(prev => {
            const userTeam = prev.teams.find(t => t.id === prev.userTeamId);
            if (!userTeam) return prev;

            // 1. Roster Check
            if (userTeam.rosterIds.length < 10) {
                alert(`Team Roster Error: You must have at least 10 players to start the season. Current roster: ${userTeam.rosterIds.length}`);
                return prev;
            }

            // 2. Financial Gate
            const userContracts = prev.contracts.filter(c => c.teamId === userTeam.id);
            const totalSalary = userContracts.reduce((sum, c) => sum + c.amount, 0);

            let updatedCash = userTeam.cash;
            let firstSeasonPaid = prev.isFirstSeasonPaid;

            if (!firstSeasonPaid) {
                if (userTeam.cash < totalSalary) {
                    alert(`Financial Gate Blocked: You need $${totalSalary.toLocaleString()} to pay your roster for the season, but only have $${userTeam.cash.toLocaleString()}. Trade or release players to proceed.`);
                    return prev;
                }
                updatedCash -= totalSalary;
                console.log(`[Finance] Season contracts paid: -$${totalSalary.toLocaleString()}`);
            } else {
                console.log(`[Finance] First season is free. No deduction.`);
                firstSeasonPaid = false;
            }

            try {
                // New Season Date: Oct 1st
                const nextSeasonDate = new Date(prev.date.getFullYear(), 9, 22);

                // 1. Initialize updatedPlayers with current players (and archive playoff stats)
                // RESET SEASON STATS HERE
                let updatedPlayers: Player[] = prev.players.map(p => {
                    // Safeguard: Archive Playoff Stats just in case (e.g. manual finish or skipped logic)
                    let careerStats = [...p.careerStats];
                    // Also archive regular season stats if they exist and weren't archived yet (though endRegularSeason usually does this)
                    // But more importantly, we MUST CLEAR seasonStats for the new season.

                    if (p.playoffStats && p.playoffStats.gamesPlayed > 0) {
                        // Archive last playoffs
                        careerStats.push({
                            ...p.playoffStats,
                            season: prev.date.getFullYear(),
                            teamId: p.teamId || 'REL',
                            overall: p.overall, // Include OVR for history
                            isPlayoffs: true
                        });
                    }

                    // Reset stats for new season
                    return {
                        ...p,
                        careerStats,
                        playoffStats: undefined,
                        seasonStats: {
                            gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                            steals: 0, blocks: 0, turnovers: 0, fouls: 0, plusMinus: 0,
                            fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
                            ftMade: 0, ftAttempted: 0, offensiveRebounds: 0, defensiveRebounds: 0,
                            rimMade: 0, rimAttempted: 0, rimAssisted: 0,
                            midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
                            threePointAssisted: 0
                        }
                    };
                });

                // 2. RESTORED AI FILLING & OPTIMIZATION
                const MIN_ROSTER_SIZE = 12;
                const availableFreeAgents = updatedPlayers
                    .filter(p => !p.teamId)
                    .sort((a, b) => calculateOverall(b) - calculateOverall(a));

                let teamsForUpdate = prev.teams.map(t => ({ ...t, rosterIds: [...t.rosterIds] }));

                teamsForUpdate.forEach(t => {
                    t.rosterIds = t.rosterIds.filter(id => updatedPlayers.some(p => p.id === id));
                });

                let updatedContracts = [...prev.contracts];

                teamsForUpdate.forEach((team) => {
                    if (team.id === prev.userTeamId) return;

                    const rosterCount = team.rosterIds.length;
                    if (rosterCount < MIN_ROSTER_SIZE) {
                        const defect = MIN_ROSTER_SIZE - rosterCount;
                        for (let k = 0; k < defect; k++) {
                            const freeAgent = availableFreeAgents.shift();
                            if (freeAgent) {
                                const faIndex = updatedPlayers.findIndex(p => p.id === freeAgent.id);
                                if (faIndex !== -1) {
                                    updatedPlayers[faIndex] = { ...updatedPlayers[faIndex], teamId: team.id };
                                    team.rosterIds.push(freeAgent.id);
                                    updatedContracts.push({
                                        id: generateUUID(),
                                        playerId: freeAgent.id,
                                        teamId: team.id,
                                        amount: 1000000,
                                        yearsLeft: 1,
                                        startYear: nextSeasonDate.getFullYear(),
                                        role: 'Bench'
                                    });
                                }
                            }
                        }
                    }
                });

                // 3. GENERATE FUTURE DRAFT PICKS & ARCHIVE HISTORY
                const currentYear = nextSeasonDate.getFullYear();
                const targetYear = currentYear + 4;

                const finalTeams = teamsForUpdate.map(t => {
                    let currentPicks = t.draftPicks ? [...t.draftPicks] : [];
                    const alreadyHas = currentPicks.some(p => p.year === targetYear && p.round === 1 && p.originalTeamId === t.id);
                    if (!alreadyHas) {
                        currentPicks = [...currentPicks, ...generatePicksForYear([t], targetYear)];
                    }

                    const completedSeasonYear = currentYear - 1;
                    let newHistory = t.history ? [...t.history] : [];
                    if (!newHistory.find(h => h.year === completedSeasonYear)) {
                        newHistory.push({ year: completedSeasonYear, wins: t.wins, losses: t.losses });
                    }

                    const teamContracts = updatedContracts.filter(c => c.teamId === t.id);
                    const payroll = teamContracts.reduce((sum, c) => sum + c.amount, 0);

                    const isUser = t.id === prev.userTeamId;
                    const finalCash = isUser ? t.cash : t.cash - payroll;

                    return { ...t, draftPicks: currentPicks, history: newHistory, wins: 0, losses: 0, cash: finalCash };
                });




                // Build schedule for the new season
                const builtEuroSchedule: { homeId: string; awayId: string }[][] = (() => {
                    if (prev.leagueType !== 'EURO') return [];
                    const elTeams = finalTeams.filter(t => t.conference === 'EuroLeague');
                    const ecTeams = finalTeams.filter(t => t.conference === 'EuroCup');
                    const elRounds = generateEuroSchedule(elTeams);  // 38 rounds
                    const ecRounds = generateEuroSchedule(ecTeams);  // 38 rounds
                    const totalRounds = Math.max(elRounds.length, ecRounds.length);
                    const result: { homeId: string; awayId: string }[][] = [];
                    for (let i = 0; i < totalRounds; i++) {
                        result.push([
                            ...(elRounds[i] || []),
                            ...(ecRounds[i] || []),
                        ]);
                    }
                    return result;
                })();

                const builtNbaSchedule: { homeId: string; awayId: string }[][] = (() => {
                    if (prev.leagueType !== 'NBA') return [];
                    return generate82GameSchedule(finalTeams);
                })();

                const firstDay = prev.leagueType === 'EURO'
                    ? (builtEuroSchedule[0] || [])
                    : (builtNbaSchedule[0] || []);

                return {
                    ...prev,
                    players: updatedPlayers,
                    games: [],
                    teams: finalTeams,
                    contracts: updatedContracts,
                    date: nextSeasonDate,
                    seasonPhase: 'regular_season',
                    view: 'dashboard',
                    dailyMatchups: firstDay,
                    euroSchedule: builtEuroSchedule,
                    nbaSchedule: builtNbaSchedule,
                    pendingUserResult: null,
                    isFirstSeasonPaid: firstSeasonPaid,
                    seasonGamesPlayed: 0
                };
            } catch (error) {
                console.error("Start Season CRITICAL FAILURE:", error);
                alert("Failed to start season. Check console for details.");
                return prev;
            }
        });
    };

    const startPlayoffs = () => {
        setGameState(prev => {
            // Check for regular season end (82 games NBA / 38 match days Euro)
            const regularSeasonLength = prev.leagueType === 'EURO' ? 38 : 82;
            if (prev.seasonPhase !== 'regular_season' || prev.seasonGamesPlayed < regularSeasonLength) {
                console.warn("GameContext: startPlayoffs called prematurely or in wrong phase:", prev.seasonPhase, prev.seasonGamesPlayed);
                return prev;
            }

            console.log("GameContext: Starting Post-Season...");
            const currentYear = prev.date.getFullYear();
            const awards = calculateRegularSeasonAwards(prev.players, prev.teams, currentYear);

            if (prev.leagueType === 'EURO') {
                // --- EURO PLAY-IN INITIALIZATION ---
                const conferences: ('EuroLeague' | 'EuroCup')[] = ['EuroLeague', 'EuroCup'];
                const playinMatchups: PlayInMatchup[] = [];
                const seedsLocked: Record<string, string[]> = {};

                conferences.forEach(conf => {
                    const confTeams = [...prev.teams]
                        .filter(t => t.conference === conf)
                        .sort((a, b) => {
                            if (b.wins !== a.wins) return b.wins - a.wins;
                            return a.losses - b.losses; // Tie-breaker: fewer losses
                        });
                    
                    // Top 6 guaranteed
                    seedsLocked[conf] = confTeams.slice(0, 6).map(t => t.id);

                    // 7th vs 8th (Game A)
                    const t7 = confTeams[6];
                    const t8 = confTeams[7];
                    if (t7 && t8) {
                        playinMatchups.push({
                            id: `playin_${conf}_7vs8`,
                            type: '7vs8',
                            conference: conf,
                            homeTeamId: t7.id,
                            awayTeamId: t8.id,
                            played: false
                        });
                    }

                    // 9th vs 10th (Game B)
                    const t9 = confTeams[8];
                    const t10 = confTeams[9];
                    if (t9 && t10) {
                        playinMatchups.push({
                            id: `playin_${conf}_9vs10`,
                            type: '9vs10',
                            conference: conf,
                            homeTeamId: t9.id,
                            awayTeamId: t10.id,
                            played: false
                        });
                    }
                });

                return {
                    ...prev,
                    seasonPhase: 'euro_playin',
                    euroPlayIn: {
                        matchups: playinMatchups,
                        seedsLocked
                    },
                    awardsHistory: [...prev.awardsHistory, awards],
                    showAwardsModal: 'regular',
                    view: 'euro_playin',
                    date: new Date(prev.date.getTime() + 86400000),
                    dailyMatchups: [],
                    euroSchedule: [],
                    pendingUserResult: null
                };
            }

            // --- STANDARD NBA PLAYOFFS ---
            const conferences = ['West', 'East'];
            
            const createSeries = (round: number, conf: string): PlayoffSeries[] => {
                const confTeams = [...prev.teams].filter(t => t.conference === conf).sort((a, b) => (b.wins || 0) - (a.wins || 0));
                const series: PlayoffSeries[] = [];
                const playoffTeams = confTeams.slice(0, 8); // Top 8

                const matchups = [[0, 7], [1, 6], [2, 5], [3, 4]];
                matchups.forEach((m, idx) => {
                    const home = playoffTeams[m[0]];
                    const away = playoffTeams[m[1]];
                    if (home && away) {
                        series.push({
                            id: `${conf}_1_${idx + 1}`,
                            round: 1,
                            conference: conf as any,
                            homeTeamId: home.id,
                            awayTeamId: away.id,
                            homeWins: 0,
                            awayWins: 0
                        });
                    }
                });
                return series;
            };

            const allSeries: PlayoffSeries[] = [];
            conferences.forEach(conf => {
                allSeries.push(...createSeries(1, conf));
            });

            const playoffTeamIds = allSeries.flatMap(s => [s.homeTeamId, s.awayTeamId]);

            // Update Rotations for Playoff Teams
            const updatedPlayers = [...prev.players];
            const updatedTeams = prev.teams.map(t => {
                if (playoffTeamIds.includes(t.id) && t.id !== prev.userTeamId) {
                    const teamRoster = updatedPlayers.filter(p => p.teamId === t.id);
                    if (teamRoster.length > 0) {
                        const optimized = optimizeRotation(teamRoster, 'Playoffs');
                        optimized.forEach(op => {
                            const idx = updatedPlayers.findIndex(p => p.id === op.id);
                            if (idx !== -1) updatedPlayers[idx] = op;
                        });
                    }
                }
                return t;
            });

            return {
                ...prev,
                players: updatedPlayers,
                teams: updatedTeams,
                seasonPhase: 'playoffs_r1',
                playoffs: allSeries,
                date: new Date(prev.date.getTime() + 86400000),
                awardsHistory: [...prev.awardsHistory, awards],
                showAwardsModal: 'regular',
                dailyMatchups: [],
                euroSchedule: [],
                pendingUserResult: null,
                view: 'playoffs'
            };
        });
    };

    const executeTrade = (
        userPlayerIds: string[],
        userPickIds: string[],
        aiPlayerIds: string[],
        aiPickIds: string[],
        aiTeamId: string
    ): boolean => {
        // --- TRADE WINDOW CHECK ---
        const { seasonPhase, seasonGamesPlayed } = gameState;

        const isOffseason = ['scouting', 'draft', 'resigning', 'free_agency', 'retirement_summary', 'expansion_draft'].includes(seasonPhase);
        const isRegularSeasonBeforeDeadline = (seasonPhase === 'regular_season' && seasonGamesPlayed <= 40);

        if (!isOffseason && !isRegularSeasonBeforeDeadline) {
            // Already handled by UI now, but keeping for safety
            return false;
        }

        let tradeSuccessful = false;

        setGameState(prev => {
            const userTeam = prev.teams.find(t => t.id === prev.userTeamId);
            const aiTeam = prev.teams.find(t => t.id === aiTeamId);
            if (!userTeam || !aiTeam) return prev;

            // 1. Calculate Salary Differences
            const userOutgoingSalary = prev.players
                .filter(p => userPlayerIds.includes(p.id))
                .reduce((sum, p) => {
                    const c = prev.contracts.find(ct => ct.playerId === p.id);
                    return sum + (c ? c.amount : 0);
                }, 0);

            const aiOutgoingSalary = prev.players
                .filter(p => aiPlayerIds.includes(p.id))
                .reduce((sum, p) => {
                    const c = prev.contracts.find(ct => ct.playerId === p.id);
                    return sum + (c ? c.amount : 0);
                }, 0);

            // 2. Validate Financials for both teams
            const MATCH_BUFFER = 5000000;
            const validateFinancials = (team: Team, incoming: number, outgoing: number): boolean => {
                const teamContracts = prev.contracts.filter(c => c.teamId === team.id);
                const currentPayroll = teamContracts.reduce((sum, c) => sum + c.amount, 0);
                const currentCapSpace = prev.salaryCap - currentPayroll;
                const postTradeSpace = currentCapSpace + outgoing - incoming;

                if (postTradeSpace >= 0) return true; // Under cap is fine

                // Over cap -> Must match salaries
                const maxIncoming = (outgoing * 1.25) + MATCH_BUFFER;
                return incoming <= maxIncoming;
            };

            if (!validateFinancials(userTeam, aiOutgoingSalary, userOutgoingSalary)) {
                alert("Trade rejected: Team over salary cap must match incoming and outgoing salaries.");
                return prev;
            }
            if (!validateFinancials(aiTeam, userOutgoingSalary, aiOutgoingSalary)) {
                alert("Trade rejected: AI team over salary cap must match incoming and outgoing salaries.");
                return prev;
            }

            // --- TRADE VALID ---
            tradeSuccessful = true;
            const userTeamId = prev.userTeamId;

            // 1. Swap Contracts
            const updatedContracts = prev.contracts.map((c: Contract) => {
                if (userPlayerIds.includes(c.playerId)) return { ...c, teamId: aiTeamId };
                if (aiPlayerIds.includes(c.playerId)) return { ...c, teamId: userTeamId };
                return c;
            });

            // 2. Update Players — snapshot stats before resetting (split stats)
            const EMPTY_SEASON_STATS = {
                gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                steals: 0, blocks: 0, turnovers: 0, fouls: 0,
                offensiveRebounds: 0, defensiveRebounds: 0,
                fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
                ftMade: 0, ftAttempted: 0, plusMinus: 0,
                rimMade: 0, rimAttempted: 0, rimAssisted: 0,
                midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
                threePointAssisted: 0
            };

            const updatedPlayers = prev.players.map((p: Player) => {
                if (userPlayerIds.includes(p.id)) {
                    // Snapshot current season stats as a split row for the old team
                    const splitStat: CareerStat = {
                        ...p.seasonStats,
                        season: prev.date.getFullYear(),
                        teamId: p.teamId || 'FA',
                        overall: p.overall,
                        isTradeSplit: true,
                    };
                    const newCareerStats = p.seasonStats.gamesPlayed > 0
                        ? [...p.careerStats, splitStat]
                        : [...p.careerStats];
                    return {
                        ...p,
                        teamId: aiTeamId,
                        careerStats: newCareerStats,
                        seasonStats: { ...EMPTY_SEASON_STATS },
                        acquisition: {
                            type: 'trade' as const,
                            year: prev.date.getFullYear(),
                            previousTeamId: userTeamId
                        }
                    };
                }
                if (aiPlayerIds.includes(p.id)) {
                    // Snapshot current season stats as a split row for the old team
                    const splitStat: CareerStat = {
                        ...p.seasonStats,
                        season: prev.date.getFullYear(),
                        teamId: p.teamId || 'FA',
                        overall: p.overall,
                        isTradeSplit: true,
                    };
                    const newCareerStats = p.seasonStats.gamesPlayed > 0
                        ? [...p.careerStats, splitStat]
                        : [...p.careerStats];
                    return {
                        ...p,
                        teamId: userTeamId,
                        careerStats: newCareerStats,
                        seasonStats: { ...EMPTY_SEASON_STATS },
                        acquisition: {
                            type: 'trade' as const,
                            year: prev.date.getFullYear(),
                            previousTeamId: aiTeamId
                        }
                    };
                }
                return p;
            });


            // 3. Update Teams (Picks)
            const updatedTeams = prev.teams.map(t => {
                let newPicks = [...(t.draftPicks || [])];
                if (t.id === userTeamId) {
                    // Remove sent picks, add received picks
                    const receivedPicks = prev.teams.find(at => at.id === aiTeamId)!.draftPicks.filter(pk => aiPickIds.includes(pk.id));
                    newPicks = newPicks.filter(pk => !userPickIds.includes(pk.id)).concat(receivedPicks);
                } else if (t.id === aiTeamId) {
                    // Remove sent picks, add received picks
                    const receivedPicks = prev.teams.find(ut => ut.id === userTeamId)!.draftPicks.filter(pk => userPickIds.includes(pk.id));
                    newPicks = newPicks.filter(pk => !aiPickIds.includes(pk.id)).concat(receivedPicks);
                }

                // Update rosterIds
                const teamMembers = updatedPlayers.filter(p => p.teamId === t.id).map(p => p.id);
                // Calculate Cap Space
                const teamContracts = updatedContracts.filter(c => c.teamId === t.id);
                const teamPayroll = teamContracts.reduce((sum, c) => sum + c.amount, 0);
                const newCapSpace = prev.salaryCap - teamPayroll;

                return { ...t, draftPicks: newPicks, rosterIds: teamMembers, salaryCapSpace: newCapSpace };
            });

            // 4. Log Trade (Updated for Interactivity)
            const team1Baseline = calculateTeamBaseline(prev.players.filter(p => p.teamId === userTeamId));
            const team2Baseline = calculateTeamBaseline(prev.players.filter(p => p.teamId === aiTeamId));

            const t1Items: TradeAssetItem[] = [
                ...updatedPlayers.filter(p => userPlayerIds.includes(p.id)).map(p => ({
                    type: 'player' as const,
                    id: p.id,
                    description: `${p.firstName} ${p.lastName}`,
                    subText: getStarString(calculateStars(calculateOverall(p), team1Baseline)),
                    color: '#22c55e' // Green for player
                })),
                ...prev.teams.find(t => t.id === userTeamId)!.draftPicks.filter(pk => userPickIds.includes(pk.id)).map(pk => {
                    const originalTeam = prev.teams.find(t => t.id === pk.originalTeamId);
                    const owner = prev.teams.find(t => t.id === userTeamId);
                    return {
                        type: 'pick' as const,
                        id: pk.id,
                        description: `${pk.year} | ${pk.round === 1 ? '1st' : '2nd'} Round | ${owner?.abbreviation || 'TBD'} | ${originalTeam?.abbreviation || pk.originalTeamName || 'Unknown'}®`,
                        subText: "",
                        color: '#eab308',
                        originalTeamId: pk.originalTeamId
                    };
                })
            ];

            const t2Items: TradeAssetItem[] = [
                ...updatedPlayers.filter(p => aiPlayerIds.includes(p.id)).map(p => ({
                    type: 'player' as const,
                    id: p.id,
                    description: `${p.firstName} ${p.lastName}`,
                    subText: getStarString(calculateStars(calculateOverall(p), team2Baseline)),
                    color: '#22c55e'
                })),
                ...prev.teams.find(t => t.id === aiTeamId)!.draftPicks.filter(pk => aiPickIds.includes(pk.id)).map(pk => {
                    const originalTeam = prev.teams.find(t => t.id === pk.originalTeamId);
                    const owner = prev.teams.find(t => t.id === aiTeamId);
                    return {
                        type: 'pick' as const,
                        id: pk.id,
                        description: `${pk.year} | ${pk.round === 1 ? '1st' : '2nd'} Round | ${owner?.abbreviation || 'TBD'} | ${originalTeam?.abbreviation || pk.originalTeamName || 'Unknown'}®`,
                        subText: "",
                        color: '#eab308',
                        originalTeamId: pk.originalTeamId
                    };
                })
            ];

            const newTrade: CompletedTrade = {
                id: generateUUID(),
                date: prev.date,
                team1Id: userTeamId,
                team2Id: aiTeamId,
                team1Assets: t1Items.map(i => `${i.description} (${i.subText})`),
                team2Assets: t2Items.map(i => `${i.description} (${i.subText})`),
                team1Items: t1Items,
                team2Items: t2Items
            };

            // 5. Generate News
            const tradeNews: NewsStory = {
                id: generateUUID(),
                date: prev.date,
                headline: `TRADE: ${userTeam.name} and ${aiTeam.name} DEAL`,
                content: `${userTeam.name} receive ${newTrade.team2Assets.join(', ')}. ${aiTeam.name} receive ${newTrade.team1Assets.join(', ')}.`,
                type: 'TRADE',
                image: aiTeam.logo,
                priority: 5,
                relatedTeamId: userTeam.id
            };

            return {
                ...prev,
                players: updatedPlayers,
                teams: updatedTeams,
                contracts: updatedContracts,
                tradeHistory: [...(prev.tradeHistory || []), newTrade],
                news: [tradeNews, ...(prev.news || [])]
            };
        });

        return tradeSuccessful;
    };


    const simulateToPlayoffs = () => {
        setSimTarget('playoffs');
    };

    const simulatePlayoffs = () => {
        setSimTarget('playoffs_end');
        setGameState(prev => ({ ...prev, isSimulating: true }));
    };

    const triggerDraft = () => {
        setGameState(prev => {
            if (prev.seasonPhase !== 'offseason' && prev.seasonPhase !== 'scouting') {
                console.warn("GameContext: triggerDraft called but phase is not valid:", prev.seasonPhase);
                return prev;
            }

            console.log("GameContext: Transitioning to Draft Phase.");

            return {
                ...prev,
                seasonPhase: 'draft',
                view: 'draft'
            };
        });
    };


    // Helper for AI Draft Logic
    const getPlayerTradeValue = (p: Player) => {
        // Simple heuristic: Overall + Potential + Age Factor
        const ageFactor = Math.max(0, 30 - p.age) * 2;
        return calculateOverall(p) * 0.4 + p.potential * 0.4 + ageFactor;
    };

    // AWARDS CALCULATION HELPERS
    const calculateRegularSeasonAwards = (players: Player[], teams: Team[], year: number): SeasonAwards => {
        const getTeam = (id: string) => teams.find(t => t.id === id);

        const createWinner = (p: Player): AwardWinner => {
            const team = getTeam(p?.teamId!);
            const s = p?.seasonStats;
            const gp = s?.gamesPlayed || 1;
            
            // Format stats summary with a fallback for players who didn't play
            const statsText = (s && s.gamesPlayed > 0) 
                ? `${(s.points / gp).toFixed(1)} PPG, ${(s.rebounds / gp).toFixed(1)} RPG, ${(s.assists / gp).toFixed(1)} APG`
                : (p?.careerStats && p.careerStats.length > 0)
                    ? "Stats Archived" // Handle case where stats were recently moved to career
                    : "No Stats (DNPs)";

            return {
                playerId: p?.id || 'err',
                playerName: p ? `${p.firstName} ${p.lastName}` : 'Unknown',
                teamId: team?.id || '',
                teamName: team?.name || 'FA',
                statsSummary: statsText,
                avatar: p?.faceId
            };
        };

        try {
            console.log("Starting award calculation for year", year);

            // Filter players with valid data AND games played
            // Filter players with valid data AND games played
            let activePlayers = players.filter(p =>
                p &&
                p.seasonStats &&
                typeof p.seasonStats.gamesPlayed === 'number' &&
                p.seasonStats.gamesPlayed > 0 &&
                p.attributes // Ensure attributes exist
            );

            console.log(`[Awards] Calculation for ${year}. Total Players: ${players.length}, Active (w/ stats): ${activePlayers.length}`);
            if (activePlayers.length > 0) {
                console.log(`[Awards] Sample Player Stats:`, activePlayers[0].seasonStats);
            } else {
                console.warn(`[Awards] NO ACTIVE PLAYERS FOUND! Dumping first player season stats:`, players[0]?.seasonStats);
            }

            // FALLBACK: If no games record (e.g. bug fix applied mid-season or corrupted stats),
            // use ALL players to ensure awards are generated and game can proceed.
            if (activePlayers.length === 0) {
                console.warn("No active players found for awards! Using fallback to all players.");
                activePlayers = [...players];
            }

            // MVP: PER/Score Formula
            // MVP: Weighted Efficiency + Team Success
            const getMvpScore = (p: Player) => {
                const s = p?.seasonStats;
                if (!s) return 0;
                const gp = s.gamesPlayed || 1;

                if (gp < 45) return 0; // Increased eligibility threshold

                const ppg = (s.points || 0) / gp;
                const rpg = (s.rebounds || 0) / gp;
                const apg = (s.assists || 0) / gp;
                const spg = (s.steals || 0) / gp;
                const bpg = (s.blocks || 0) / gp;
                const tpg = (s.turnovers || 0) / gp;

                // Weighted Score
                // Heavily favor scoring dominance (1.6) and playmaking (1.2)
                // Rebounds (0.6) are less valuable than points 1-to-1 for MVP narratives
                let score = (ppg * 1.6) + (rpg * 0.6) + (apg * 1.2) + (spg * 1.5) + (bpg * 1.5) - (tpg * 1.0);

                const team = getTeam(p.teamId!);
                const wins = team ? team.wins : 0;

                // Bonus for Team Success
                score += (wins * 0.6);

                return score;
            };

            const getRotyScore = (p: Player) => {
                const s = p?.seasonStats;
                if (!s) return 0;
                const gp = s.gamesPlayed || 0;

                // Even if they didn't play much, we want a score based on OVR for ranking
                const ppg = gp > 0 ? (s.points || 0) / gp : 0;
                const rpg = gp > 0 ? (s.rebounds || 0) / gp : 0;
                const apg = gp > 0 ? (s.assists || 0) / gp : 0;
                const spg = gp > 0 ? (s.steals || 0) / gp : 0;
                const bpg = gp > 0 ? (s.blocks || 0) / gp : 0;
                const tpg = gp > 0 ? (s.turnovers || 0) / gp : 0;

                // Base score from stats (weighted for rookies: emphasis on scoring/upside)
                let score = (ppg * 2.0) + (rpg * 0.8) + (apg * 1.5) + (spg * 1.2) + (bpg * 1.2) - (tpg * 1.5);
                
                // Add a tiny bonus for Overall to break ties for DNPs
                score += (p.overall * 0.01);

                const team = getTeam(p.teamId!);
                if (team) score += (team.wins * 0.4);

                return score;
            };

            const sortedMvp = [...activePlayers].sort((a, b) => getMvpScore(b) - getMvpScore(a));
            const mvp = sortedMvp.length > 0 ? createWinner(sortedMvp[0]) : createWinner(players[0]);

            // Rookie of the Year: Better detection (exclude players with prior-season experience)
            const rookies = activePlayers.filter(p => {
                // 1. Explicitly drafted before this season
                if (p.acquisition?.type === 'draft' && p.acquisition.year === year - 1) return true;
                // 2. Year 1 Fallback: No prior career stats and very young
                if ((!p.careerStats || p.careerStats.length === 0) && p.age <= 22) return true;
                return false;
            });
            const sortedRoty = [...rookies].sort((a, b) => getRotyScore(b) - getRotyScore(a));
            const roty = sortedRoty.length > 0 ? createWinner(sortedRoty[0]) : (rookies.length > 0 ? createWinner(rookies[0]) : mvp);

            // DPOY
            const getDpoyScore = (p: Player) => {
                const s = p.seasonStats;
                const gp = s.gamesPlayed || 1;
                if (gp < 40) return 0;
                const spg = (s.steals || 0) / gp;
                const bpg = (s.blocks || 0) / gp;
                const rpg = (s.rebounds || 0) / gp;

                const intDef = p.attributes?.interiorDefense || 0;
                const perDef = p.attributes?.perimeterDefense || 0;
                const attrBonus = (intDef + perDef) / 20;
                return (spg * 2.5) + (bpg * 2.5) + (rpg * 0.5) + attrBonus;
            };
            const sortedDpoy = [...activePlayers].sort((a, b) => getDpoyScore(b) - getDpoyScore(a));
            const dpoy = sortedDpoy.length > 0 ? createWinner(sortedDpoy[0]) : mvp;

            // MIP
            const getMipScore = (p: Player) => {
                if (!p.careerStats || p.careerStats.length === 0) return -100;
                const lastSeason = p.careerStats[p.careerStats.length - 1];
                if (!lastSeason || lastSeason.gamesPlayed < 10) return -100;

                const s = p.seasonStats;
                const gp = s.gamesPlayed || 1;
                const prevGp = lastSeason.gamesPlayed || 1;

                const ppgDiff = ((s.points || 0) / gp) - ((lastSeason.points || 0) / prevGp);
                const rpgDiff = ((s.rebounds || 0) / gp) - ((lastSeason.rebounds || 0) / prevGp);
                const apgDiff = ((s.assists || 0) / gp) - ((lastSeason.assists || 0) / prevGp);

                return (ppgDiff * 1.5) + rpgDiff + apgDiff;
            };
            const sortedMip = [...activePlayers].sort((a, b) => getMipScore(b) - getMipScore(a));
            const mip = sortedMip.length > 0 ? createWinner(sortedMip[0]) : mvp;

            // All-Stars
            const westPlayers = activePlayers.filter(p => getTeam(p.teamId!)?.conference === 'West');
            const eastPlayers = activePlayers.filter(p => getTeam(p.teamId!)?.conference === 'East');

            const allStars = {
                west: westPlayers.sort((a, b) => getMvpScore(b) - getMvpScore(a)).slice(0, 12).map(createWinner),
                east: eastPlayers.sort((a, b) => getMvpScore(b) - getMvpScore(a)).slice(0, 12).map(createWinner)
            };

            // COY (Coach of the Year) - Simple logic: Best record coach
            const sortedTeamsList = [...teams].sort((a, b) => b.wins - a.wins);
            const bestTeam = sortedTeamsList[0];
            const bestCoach = gameState.coaches?.find((c: any) => c.teamId === bestTeam.id) || gameState.coaches?.[0];
            const coy: AwardWinner = {
                playerId: bestCoach?.id || 'err',
                playerName: bestCoach ? `${bestCoach.firstName} ${bestCoach.lastName}` : 'Unknown',
                teamId: bestTeam.id,
                teamName: bestTeam.name,
                statsSummary: `${bestTeam.wins}-${bestTeam.losses} Record`,
            };

            return {
                year,
                mvp,
                roty,
                dpoy,
                mip,
                coy,
                allStars
            };

        } catch (e) {
            console.error("CRITICAL AWARDS CALC ERROR:", e);
            const fallbackWinner: AwardWinner = {
                playerId: 'error',
                playerName: 'Error',
                teamId: '',
                teamName: 'Recalculating...',
                statsSummary: 'Detailed stats unavailable',
            };
            return {
                year,
                mvp: fallbackWinner,
                roty: fallbackWinner,
                dpoy: fallbackWinner,
                mip: fallbackWinner,
                allStars: { west: [], east: [] }
            };
        }
    };

    const calculateFinalsMvp = (players: Player[], games: MatchResult[], championId: string, playoffs: PlayoffSeries[]): AwardWinner => {
        // Find Finals games
        // We can identify playoffs games from recent games or by filtering.
        // A safe way is to find games where winner == championId AND round 4 series involved.
        // But simplest: find active players on winning team, aggregate stats from games that happened during 'playoffs' phase or just last N games.
        // Better: Filter `games` where `homeTeamId` or `awayTeamId` was the champion AND it was a Finals games.
        // We don't strictly tag games as 'Finals' in MatchResult, but we can search for the last ~4-7 games of the champion.

        const championTeamGames = games.filter(g => (g.homeTeamId === championId || g.awayTeamId === championId)).slice(-7); // Last 7 games involving champ

        const roster = players.filter(p => p.teamId === championId);

        let bestPlayer = roster[0];
        let maxScore = -1;

        roster.forEach(p => {
            let score = 0;
            let gps = 0;
            championTeamGames.forEach(g => {
                const stats = g.boxScore.homeStats[p.id] || g.boxScore.awayStats[p.id];
                if (stats) {
                    gps++;
                    score += stats.points + stats.rebounds * 1.2 + stats.assists * 1.5 + stats.steals * 2 + stats.blocks * 2;
                }
            });

            if (gps > 0 && score > maxScore) {
                maxScore = score;
                bestPlayer = p;
            }
        });

        // get Stats Summary for FINALS only
        let pts = 0, rebs = 0, asts = 0, gps = 0;
        championTeamGames.forEach(g => {
            const stats = g.boxScore.homeStats[bestPlayer.id] || g.boxScore.awayStats[bestPlayer.id];
            if (stats) {
                gps++;
                pts += stats.points;
                rebs += stats.rebounds;
                asts += stats.assists;
            }
        });

        return {
            playerId: bestPlayer.id,
            playerName: `${bestPlayer.firstName} ${bestPlayer.lastName} `,
            teamId: championId,
            teamName: 'Champion', // Context knows
            statsSummary: gps > 0 ? `${(pts / gps).toFixed(1)} PPG, ${(rebs / gps).toFixed(1)} RPG` : 'N/A'
        };
    };

    const processPick = (prevState: GameState, specificPlayerId?: string): GameState => {

        if (prevState.draftOrder.length === 0) return prevState;

        const currentPickTeamId = prevState.draftOrder[0];
        const team = prevState.teams.find(t => t.id === currentPickTeamId);
        if (!team) return prevState;

        let player: Player | undefined;

        if (specificPlayerId) {
            player = prevState.draftClass.find(p => p.id === specificPlayerId);
        } else {
            // AI Logic: Philosophy-Driven + Position-Need-Aware Draft
            const teamRoster = prevState.players.filter(p => p.teamId === currentPickTeamId);
            const gm = prevState.aiGms.find(g => g.id === team.gmId);
            const teamPoints = prevState.scoutingReports[currentPickTeamId] || {};

            // Calculate positional depth (how many players at each position)
            const posDepth: Record<string, number> = { PG: 0, SG: 0, SF: 0, PF: 0, C: 0 };
            teamRoster.forEach(p => { if (posDepth[p.position] !== undefined) posDepth[p.position]++; });

            const getAiPerceivedValue = (p: Player) => {
                const report = teamPoints[p.id];
                const isRevealed = report?.isPotentialRevealed;
                
                // GM Drafting skill effect
                // Drafting skill 100 -> multiplier 0 (no noise)
                // Drafting skill 0 -> multiplier 1 (max noise)
                const draftingSkill = gm?.skills.drafting ?? 50;
                const draftNoiseMultiplier = Math.max(0, (100 - draftingSkill) / 100);
                
                // Base noise for unrevealed players, scaled by drafting skill
                let noise = 0;
                if (!isRevealed) {
                    const randomNoise = (p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 31) - 15;
                    noise = randomNoise + (Math.random() * 20 - 10) * draftNoiseMultiplier; 
                }
                
                const perceivedPotential = Math.max(0, Math.min(99, (p.potential || 70) + noise));
                const currentOvr = calculateOverall(p);
                const ageFactor = Math.max(0, 30 - p.age) * 2;

                // Positional need bonus/penalty
                const posCount = posDepth[p.position] || 0;
                const posBonus = posCount === 0 ? 18 : posCount === 1 ? 6 : posCount >= 3 ? -12 : 0;

                let value: number;

                if (gm?.philosophy === 'Win Now') {
                    // Weight current OVR heavily; slight penalty for very young/raw
                    value = currentOvr * 0.70 + perceivedPotential * 0.20 + ageFactor * 0.10;
                    if (p.age > 27) value *= 0.65; // Heavy penalty for old players in draft
                    if (p.age <= 19) value *= 0.80; // Slight penalty for very raw prospects
                } else if (gm?.philosophy === 'Youth') {
                    // Bet on potential; love young players
                    value = currentOvr * 0.20 + perceivedPotential * 0.65 + ageFactor * 0.15;
                    if (p.age <= 19) value *= 1.35; // Big bonus for the youngest prospects
                    if (p.age >= 24) value *= 0.75; // Penalty for older draft picks
                } else if (gm?.philosophy === 'Financial') {
                    // Find cheap future stars: high OVR relative to youth = great value contract
                    const valueRatio = currentOvr / Math.max(1, p.age - 17);
                    value = valueRatio * 6 + perceivedPotential * 0.30 + ageFactor * 0.10;
                } else {
                    // Balanced: current formula
                    value = currentOvr * 0.4 + perceivedPotential * 0.4 + ageFactor;
                }

                return value + posBonus;
            };

            const sortedDraftClass = [...prevState.draftClass].sort((a, b) => getAiPerceivedValue(b) - getAiPerceivedValue(a));
            player = sortedDraftClass[0];
        }

        if (!player) {
            // SAFEGUARD: If somehow no player is found, we MUST still shift the draft order to prevent infinite loops
            console.error("CRITICAL DRAFT ERROR: No player available for pick. Skipping slot.");
            return {
                ...prevState,
                draftOrder: prevState.draftOrder.slice(1)
            };
        }

        // Move player to main pool, assign team

        // Calculate Pick Info
        // Use draftResults.length + 1 for accurate pick number
        const pickNumber = prevState.draftResults.length + 1;
        const round = pickNumber <= 31 ? 1 : 2; // 31 teams now
        const pickInRound = pickNumber <= 31 ? pickNumber : pickNumber - 31;

        const updatedPlayer = {
            ...player,
            teamId: team.id,
            acquisition: {
                type: 'draft' as const,
                year: prevState.date.getFullYear(),
                details: `Round ${round}, Pick ${pickInRound} `
            }
        };

        // Rookie Contract (Simplified: 2yr / $5M)
        const rookieContract: Contract = {
            id: generateUUID(),
            playerId: updatedPlayer.id,
            teamId: team.id,
            amount: 5000000,
            yearsLeft: 2,
            startYear: prevState.date.getFullYear(),
            role: 'Prospect'
        };

        const updatedTeams = prevState.teams.map(t => {
            if (t.id === team.id) {
                return { ...t, rosterIds: [...t.rosterIds, player!.id], salaryCapSpace: t.salaryCapSpace - 5000000, cash: t.cash - 5000000 };
            }
            return t;
        });

        return {
            ...prevState,
            players: [...prevState.players, updatedPlayer],
            draftClass: prevState.draftClass.filter(p => p.id !== player!.id),
            draftOrder: prevState.draftOrder.slice(1),
            teams: updatedTeams,
            contracts: [...prevState.contracts, rookieContract],
            draftResults: [
                ...prevState.draftResults,
                {
                    pick: pickNumber,
                    round: round,
                    teamId: team.id,
                    playerId: player!.id,
                    playerName: `${player!.firstName} ${player!.lastName}`
                }
            ]
        };
    };

    const handleDraftPick = (playerId: string) => {
        setGameState(prev => processPick(prev, playerId));
    };

    const simulateNextPick = () => {
        setGameState(prev => processPick(prev));
    };

    const simulateToUserPick = () => {
        setGameState(prev => {
            let currentState = { ...prev };
            // Loop until empty or user turn
            let safety = 0;
            while (currentState.draftOrder.length > 0 && currentState.draftOrder[0] !== currentState.userTeamId && safety < 70) {
                currentState = processPick(currentState);
                safety++;
            }
            return currentState;
        });
    };

    const endDraft = () => {
        setGameState(prev => {
            const updatedState = {
                ...prev,
                draftHistory: {
                    ...prev.draftHistory,
                    [prev.date.getFullYear()]: prev.draftResults
                },
                offseasonTasks: {
                    ...prev.offseasonTasks,
                    draft: true
                },
                seasonPhase: 'draft_summary' as const,
                view: 'draft_summary' as const
            };
            return updatedState;
        });
    };

    const startRetirementPhase = () => {
        setGameState(prev => ({
            ...prev,
            seasonPhase: 'retirement_summary' as const
        }));
    };



    const completeOffseasonTask = (taskName: keyof GameState['offseasonTasks']) => {
        setGameState(prev => ({
            ...prev,
            offseasonTasks: {
                ...prev.offseasonTasks,
                [taskName]: true
            },
            view: 'offseason_menu',
            seasonPhase: 'offseason'
        }));
    };

    const continueFromRetirements = () => {
        completeOffseasonTask('retirements');
    };

    const processAiGMFiring = () => {
        setGameState(prev => {
            const { updatedGms, newsItems } = processGMDismissals(prev.teams, prev.aiGms, prev.userTeamId, prev.players);
            
            // Sync teams with new GMs
            const updatedTeams = prev.teams.map(team => {
                const gm = updatedGms.find(g => g.teamId === team.id);
                if (gm && gm.id !== team.gmId) {
                    return { ...team, gmId: gm.id };
                }
                return team;
            });

            // Create News Entries
            const newMessages = newsItems.map(text => ({
                id: generateUUID(),
                date: prev.date,
                title: 'Front Office Shakeup',
                text,
                type: 'news' as const,
                read: false
            }));

            return {
                ...prev,
                aiGms: updatedGms,
                teams: updatedTeams,
                messages: [...prev.messages, ...newMessages]
            };
        });
    };

    const endCoachFreeAgency = () => {
        setGameState(prev => {
            const updatedTeams = prev.teams.map(t => ({ ...t }));
            const updatedCoaches = prev.coaches.map(c => ({ ...c }));
            const teamsNeedingCoach = updatedTeams.filter(t => !t.coachId);
            const freeAgentCoaches = updatedCoaches.filter(c => !c.teamId);

            teamsNeedingCoach.forEach(team => {
                if (freeAgentCoaches.length === 0) {
                    // Generate a new coach if pool is empty
                    const newCoach = generateCoach(team.id);
                    updatedCoaches.push(newCoach);
                    team.coachId = newCoach.id;
                    team.tactics = getTacticsForStyle(newCoach.style);
                    console.log(`[CoachFA] Generated new coach ${newCoach.firstName} ${newCoach.lastName} for ${team.name}`);
                    return;
                }

                // Style-matched coach hiring based on GM philosophy + team roster
                const teamGm = prev.aiGms.find(g => g.id === team.gmId);
                const teamRosterForCoach = prev.players.filter(p => p.teamId === team.id);

                // Determine if the team skews offensive or defensive
                const avgOvr = teamRosterForCoach.length > 0
                    ? teamRosterForCoach.reduce((s, p) => s + calculateOverall(p), 0) / teamRosterForCoach.length
                    : 70;

                // Sort free agents: philosophy drives which style to prefer
                freeAgentCoaches.sort((a, b) => {
                    let aScore = a.rating.offense + a.rating.defense;
                    let bScore = b.rating.offense + b.rating.defense;

                    if (teamGm?.philosophy === 'Win Now') {
                        // Win Now: prefer the coach whose specialty matches roster
                        // If roster is offensively strong, prefer offensive coach; else defensive
                        const offensiveRoster = avgOvr >= 78; // Rough heuristic
                        if (offensiveRoster) {
                            aScore = a.rating.offense * 1.5 + a.rating.defense;
                            bScore = b.rating.offense * 1.5 + b.rating.defense;
                        } else {
                            aScore = a.rating.offense + a.rating.defense * 1.5;
                            bScore = b.rating.offense + b.rating.defense * 1.5;
                        }
                    } else if (teamGm?.philosophy === 'Youth') {
                        // Youth GMs prefer development-friendly coaches (balanced, not too demanding)
                        aScore = (a.rating.offense + a.rating.defense) * 0.9; // No overweighting
                        bScore = (b.rating.offense + b.rating.defense) * 0.9;
                    } else if (teamGm?.philosophy === 'Financial') {
                        // Financial GMs pick cheapest coach with acceptable rating (≥55 combined)
                        const aTotal = a.rating.offense + a.rating.defense;
                        const bTotal = b.rating.offense + b.rating.defense;
                        if (aTotal >= 110 && bTotal >= 110) {
                            // Both acceptable — pick cheaper
                            aScore = -a.contract.salary;
                            bScore = -b.contract.salary;
                        }
                    }
                    // Balanced: keep combined rating sort (default)
                    return bScore - aScore;
                });

                // Pick the best available coach with some randomness
                const pickIndex = Math.floor(Math.random() * Math.min(3, freeAgentCoaches.length));
                const hired = freeAgentCoaches.splice(pickIndex, 1)[0];

                // Update coach
                const coachIdx = updatedCoaches.findIndex(c => c.id === hired.id);
                if (coachIdx !== -1) {
                    updatedCoaches[coachIdx] = {
                        ...hired,
                        teamId: team.id,
                        contract: { salary: hired.contract.salary, yearsRemaining: 2 + Math.floor(Math.random() * 3) }
                    };
                }

                team.coachId = hired.id;
                team.tactics = getTacticsForStyle(hired.style);
                console.log(`[CoachFA] AI Team ${team.name} hired ${hired.firstName} ${hired.lastName}`);
            });

            // Generate fresh free agents to replenish pool (keep at least 10 free agents)
            const remainingFreeAgents = updatedCoaches.filter(c => !c.teamId).length;
            const toGenerate = Math.max(0, 10 - remainingFreeAgents);
            for (let i = 0; i < toGenerate; i++) {
                updatedCoaches.push(generateCoach(null));
            }


            const { updatedGms, newsItems } = processGMDismissals(updatedTeams, prev.aiGms, prev.userTeamId, prev.players);
            
            // Sync teams with new GMs
            const finalTeams = updatedTeams.map(team => {
                const gm = updatedGms.find(g => g.teamId === team.id);
                if (gm && gm.id !== team.gmId) {
                    return { ...team, gmId: gm.id };
                }
                return team;
            });

            // Create News Entries
            const newMessages = newsItems.map(text => ({
                id: generateUUID(),
                date: prev.date,
                title: 'Front Office Shakeup',
                text,
                type: 'news' as const,
                read: false
            }));

            return {
                ...prev,
                coaches: updatedCoaches,
                teams: finalTeams,
                aiGms: updatedGms,
                messages: [...prev.messages, ...newMessages],
                offseasonTasks: {
                    ...prev.offseasonTasks,
                    coaching: true
                },
                seasonPhase: 'resigning' as const,
                view: 'resigning'
            };
        });
    };


    const endResigning = () => {
        setGameState(prev => {
            // 1. AI Resigning Logic
            let updatedTeams = prev.teams.map(t => ({ ...t, rosterIds: [...t.rosterIds] }));
            let updatedPlayers = prev.players.map(p => ({ ...p }));
            let updatedContracts = [...prev.contracts]; // Use spread to ensure new array
            const aiTeams = updatedTeams.filter(t => t.id !== prev.userTeamId);

            aiTeams.forEach(team => {
                // Find expiring players for this team who are now Free Agents (but previously belonged to team)
                const expiringPlayers = updatedPlayers.filter(p => {
                    if (p.teamId) return false;
                    const lastStats = p.careerStats?.[p.careerStats.length - 1];
                    return lastStats && lastStats.teamId === team.id;
                });

                expiringPlayers.sort((a, b) => calculateOverall(b) - calculateOverall(a));

                expiringPlayers.forEach(player => {
                    const ovr = calculateOverall(player);
                    const isStar = ovr >= 85;
                    const isStarter = ovr >= 78;
                    const isYoung = player.age < 24 && ovr >= 70;

                    // NEW: Intent Logic - Players who "Want Out" (low morale or poor team success) may refuse
                    const teamSuccess = team.wins / (Math.max(1, team.wins + team.losses));
                    const happiness = player.morale || 80;

                    let intent: 'RE-SIGN' | 'TEST_MARKET' | 'WANT_OUT' | 'DEMAND_EXIT' = 'RE-SIGN';
                    if (happiness < 40) intent = 'DEMAND_EXIT';
                    else if (happiness < 60 || teamSuccess < 0.4) intent = 'WANT_OUT';
                    else if (isStar) intent = 'TEST_MARKET';

                    let shouldSign = false;

                    if (intent === 'DEMAND_EXIT') {
                        // 98% chance to refuse
                        if (Math.random() > 0.98) shouldSign = true;
                    } else if (intent === 'WANT_OUT') {
                        // 85% chance to refuse
                        if (Math.random() > 0.85) shouldSign = true;
                    } else if (intent === 'TEST_MARKET') {
                        // Stars hit market 50% of the time if not unhappy
                        if (Math.random() > 0.50) shouldSign = true;
                    } else {
                        // Standard Decision Logic (Role players / Happy starters)
                        if (isStar || (isStarter && team.rosterIds.length < 15)) {
                            shouldSign = true;
                        }
                        if (isYoung && Math.random() > 0.3) shouldSign = true;
                    }

                    if (shouldSign) {
                        const contractNeeds = generateContract(player, prev.date.getFullYear(), prev.salaryCap);
                        
                        // AI GM Negotiation Skill: High skill = better home discount
                        const gm = prev.aiGms.find(g => g.id === team.gmId);
                        const negotiationSkill = gm?.skills.negotiation || 50;
                        const discountFactor = 1.0 - (negotiationSkill / 1000); // 0.90 (100 skill) to 1.0 (0 skill) range
                        
                        contractNeeds.amount = Math.floor(contractNeeds.amount * discountFactor);

                        // Bird Rights check implicitly allowed by checking Cash ONLY
                        if (team.cash >= contractNeeds.amount) {
                            const faIndex = updatedPlayers.findIndex(p => p.id === player.id);
                            if (faIndex !== -1) {
                                updatedPlayers[faIndex] = { ...updatedPlayers[faIndex], teamId: team.id };
                                team.rosterIds.push(player.id);

                                updatedContracts.push({
                                    ...contractNeeds,
                                    id: generateUUID(),
                                    teamId: team.id
                                });

                                team.salaryCapSpace -= contractNeeds.amount;
                                team.cash -= contractNeeds.amount;

                                console.log(`AI Team ${team.abbreviation} re-signed ${player.lastName} (${ovr} OVR) for $${(contractNeeds.amount / 1000000).toFixed(1)}M`);
                            }
                        }
                    }
                });
            });

            return {
                ...prev,
                teams: updatedTeams,
                players: updatedPlayers,
                contracts: updatedContracts,
                date: new Date(prev.date.getFullYear(), 6, 1), // July 1st
                activeOffers: [], // Initialize for Free Agency
                freeAgencyDay: 1,
                offseasonTasks: {
                    ...prev.offseasonTasks,
                    resigning: true
                },
                view: 'offseason_menu',
                seasonPhase: 'offseason'
            };
        });
    };

    const endFreeAgency = () => {
        setGameState(prev => {
            let nextState = { ...prev };

            // 1. Force Fill Logic
            // Iterate until all teams have e.g. 13 players
            let filled = false;
            let safety = 0;
            while (!filled && safety < 10) {
                // Check if any team is < 13
                const needsFill = nextState.teams.some(t => t.id !== prev.userTeamId && t.rosterIds.length < 13);
                if (!needsFill) {
                    filled = true;
                } else {
                    nextState = processAiFreeAgencyRound(nextState, true); // Force Fill round
                }
                safety++;
            }

            console.log("Free Agency Ended. AI Rosters Filled.");

            return {
                ...nextState,
                players: nextState.players,
                offseasonTasks: {
                    ...prev.offseasonTasks,
                    freeAgency: true,
                    training: false,
                    trainingResults: false,
                    paySalaries: false
                },
                view: 'offseason_menu',
                seasonPhase: 'offseason',
                date: new Date(prev.date.getFullYear(), 9, 1),
                isTrainingCampComplete: false, // Reset for new season
                trainingSettings: {}, // Reset selections
                messages: [
                    ...prev.messages,
                    {
                        id: Date.now().toString(),
                        date: prev.date,
                        title: 'Pre-Season Started',
                        text: 'The new season is approaching. Prepare your team in Training Camp.',
                        type: 'info',
                        read: false
                    }
                ]
            };
        });
    };

    // --- AI FREE AGENCY LOGIC ---
    const processAiFreeAgencyRound = (currentState: GameState, forceFill: boolean = false): GameState => {
        let updatedPlayers = [...currentState.players];
        let updatedContracts = [...currentState.contracts];
        let updatedTeams = currentState.teams.map(t => ({ ...t, rosterIds: [...t.rosterIds] }));
        let activity = false;

        // Shuffle teams to give random priority each round
        const shuffledTeams = [...updatedTeams].sort(() => Math.random() - 0.5);

        shuffledTeams.forEach(team => {
            if (team.id === currentState.userTeamId) return; // Skip User

            // 1. Check Needs
            const currentRosterCount = team.rosterIds.length;
            if (currentRosterCount >= 15) return; // Full

            // 2. Determine Budget
            const capSpace = calculateTeamCapSpace(team, updatedContracts, currentState.salaryCap);
            if (capSpace <= 0 && !forceFill) return; // No money, unless forced (min contracts)

            // 3. Calculate positional needs
            const posDepth: Record<string, number> = { PG: 0, SG: 0, SF: 0, PF: 0, C: 0 };
            team.rosterIds.forEach(rid => {
                const rp = updatedPlayers.find(p => p.id === rid);
                if (rp && posDepth[rp.position] !== undefined) posDepth[rp.position]++;
            });
            const neededPositions = Object.entries(posDepth)
                .filter(([, count]) => count < 2)
                .map(([pos]) => pos);
            const overstackedPositions = Object.entries(posDepth)
                .filter(([, count]) => count >= 3)
                .map(([pos]) => pos);

            const gm = updatedTeams.find(t => t.id === team.id) ?
                currentState.aiGms.find(g => g.id === team.gmId) : undefined;
            const teamRoster = updatedPlayers.filter(p => p.teamId === team.id);
            const direction = getTeamDirection(team, teamRoster);

            // 4. Filter and sort available FAs by direction + needs
            const availableFAs = updatedPlayers.filter(p => !p.teamId);
            if (availableFAs.length === 0) return;

            let targetPlayer: Player | null = null;
            let offerAmount = 0;
            let targetYears = 1;
            let targetRole: 'Starter' | 'Rotation' | 'Bench' = 'Bench';

            if (forceFill) {
                // Minimum contract fill — prefer needed positions
                const sorted = [...availableFAs].sort((a, b) => {
                    const aNeed = neededPositions.includes(a.position) ? 1 : 0;
                    const bNeed = neededPositions.includes(b.position) ? 1 : 0;
                    return bNeed - aNeed || calculateOverall(b) - calculateOverall(a);
                });
                targetPlayer = sorted[0];
                offerAmount = 1000000;
            } else {
                // Direction-based candidate filtering
                let candidates = [...availableFAs];

                if (direction === 'Rebuilding' || direction === 'Young_Developing') {
                    // NEVER sign 30+ aging stars — they block the rebuild
                    // Prioritize: youth (age ≤ 26) + high potential
                    candidates = candidates.filter(p => p.age <= 27 || (p.potential || 0) >= 87);
                    candidates.sort((a, b) => {
                        // Score = potential + youth bonus + position need
                        const aScore = (a.potential || 0) + Math.max(0, 25 - a.age) * 1.5 +
                            (neededPositions.includes(a.position) ? 20 : 0) -
                            (overstackedPositions.includes(a.position) ? 15 : 0);
                        const bScore = (b.potential || 0) + Math.max(0, 25 - b.age) * 1.5 +
                            (neededPositions.includes(b.position) ? 20 : 0) -
                            (overstackedPositions.includes(b.position) ? 15 : 0);
                        return bScore - aScore;
                    });
                } else {
                    // Contender / Playoff: target proven OVR at needed positions
                    candidates.sort((a, b) => {
                        const aOvr = calculateOverall(a);
                        const bOvr = calculateOverall(b);
                        const aScore = aOvr +
                            (neededPositions.includes(a.position) ? 25 : 0) -
                            (overstackedPositions.includes(a.position) ? 20 : 0);
                        const bScore = bOvr +
                            (neededPositions.includes(b.position) ? 25 : 0) -
                            (overstackedPositions.includes(b.position) ? 20 : 0);
                        return bScore - aScore;
                    });
                }

                // Find best candidate that fits budget
                for (const player of candidates) {
                    const { amount: ask, years } = calculateContractAmount(player, currentState.salaryCap);
                    const negotiationSkill = gm?.skills.negotiation || 50;
                    const discountFactor = 1.05 - (negotiationSkill / 500);
                    const adjustedOffer = Math.floor(ask * discountFactor);

                    if (capSpace >= adjustedOffer) {
                        targetPlayer = player;
                        offerAmount = adjustedOffer;
                        targetYears = years;
                        targetRole = calculateOverall(player) >= 80 ? 'Starter' :
                                    calculateOverall(player) >= 73 ? 'Rotation' : 'Bench';
                        break;
                    }
                }
            }

            if (targetPlayer) {
                // SIGN PLAYER
                const pIndex = updatedPlayers.findIndex(p => p.id === targetPlayer!.id);
                if (pIndex !== -1) {
                    updatedPlayers[pIndex] = { ...updatedPlayers[pIndex], teamId: team.id };

                    // Add to Team Roster
                    const tIndex = updatedTeams.findIndex(t => t.id === team.id);
                    if (tIndex !== -1) {
                        updatedTeams[tIndex].rosterIds.push(targetPlayer.id);
                    }

                    // Create Contract
                    updatedContracts.push({
                        id: generateUUID(),
                        playerId: targetPlayer.id,
                        teamId: team.id,
                        amount: offerAmount,
                        yearsLeft: targetYears,
                        startYear: currentState.date.getFullYear(),
                        role: targetRole
                    });

                    activity = true;
                }
            }
        });

        return {
            ...currentState,
            players: updatedPlayers,
            teams: updatedTeams,
            contracts: updatedContracts
        };
    };

    // Compatibility Alias
    const signFreeAgent = (playerId: string) => {
        // Default to Min/1yr/Bench if using the old simple sign button
        signPlayerWithContract(playerId, { amount: 1100000, years: 1, role: 'Bench' });
    };

    const releasePlayer = (playerId: string) => {
        setGameState(prev => {
            const player = prev.players.find(p => p.id === playerId);
            if (!player) return prev;

            const teamId = player.teamId;
            const team = prev.teams.find(t => t.id === teamId);

            // 1. Update Player to Free Agent
            const updatedPlayers = prev.players.map(p =>
                p.id === playerId ? { ...p, teamId: null, minutes: 0, isStarter: false, rotationIndex: undefined } : p
            );

            // 2. Remove Contract
            // Use FILTER to remove it completely (Amnesty/Void style as requested "cut players go to free agents")
            const updatedContracts = prev.contracts.filter(c => c.playerId !== playerId);

            // 3. Update Team Roster
            const updatedTeams = prev.teams.map(t => {
                if (t.id === teamId) {
                    return {
                        ...t,
                        rosterIds: t.rosterIds.filter(id => id !== playerId)
                    };
                }
                return t;
            });

            console.log(`[Release] Released ${player.firstName} ${player.lastName} from ${team?.abbreviation} `);

            return {
                ...prev,
                players: updatedPlayers,
                contracts: updatedContracts,
                teams: updatedTeams
            };
        });
    };


    const sellPlayer = (playerId: string) => {
        setGameState(prev => {
            const player = prev.players.find(p => p.id === playerId);
            if (!player || !player.teamId) return prev;

            const contract = prev.contracts.find(c => c.playerId === playerId);
            if (!contract) return prev;

            const teamId = player.teamId;
            const cashFromSale = contract.amount;

            // 1. Update Player to Free Agent
            const updatedPlayers = prev.players.map(p =>
                p.id === playerId ? { ...p, teamId: null, minutes: 0, isStarter: false, rotationIndex: undefined } : p
            );

            // 2. Remove Contract
            const updatedContracts = prev.contracts.filter(c => c.playerId !== playerId);

            // 3. Update Team (Add Cash + Remove Roster Entry)
            const updatedTeams = prev.teams.map(t => {
                if (t.id === teamId) {
                    return {
                        ...t,
                        cash: t.cash + cashFromSale,
                        rosterIds: (t.rosterIds || []).filter(id => id !== playerId)
                    };
                }
                return t;
            });

            console.log(`[Liquidation] Sold ${player.firstName} ${player.lastName} for ${cashFromSale.toLocaleString()} cash.`);

            return {
                ...prev,
                players: updatedPlayers,
                contracts: updatedContracts,
                teams: updatedTeams
            };
        });
    };

    const sellPlayerToTeam = (playerId: string, targetTeamId: string): { success: boolean, message: string } => {
        let result = { success: false, message: 'Unknown error' };

        setGameState(prev => {
            const player = prev.players.find(p => p.id === playerId);
            if (!player || !player.teamId) {
                result = { success: false, message: 'Player not found or not on a team.' };
                return prev;
            }

            const sellerTeam = prev.teams.find(t => t.id === player.teamId);
            const buyerTeam = prev.teams.find(t => t.id === targetTeamId);
            const contract = prev.contracts.find(c => c.playerId === playerId);

            if (!sellerTeam || !buyerTeam || !contract) {
                result = { success: false, message: 'Transaction data missing.' };
                return prev;
            }

            const price = contract.amount;

            // Check Buyer Financials
            if (buyerTeam.cash < price) {
                result = { success: false, message: `${buyerTeam.city} doesn't have enough cash to buy this player.` };
                return prev;
            }

            const buyerPayroll = prev.contracts.filter(c => c.teamId === targetTeamId).reduce((sum, c) => sum + c.amount, 0);
            if (buyerPayroll + price > prev.salaryCap) {
                result = { success: false, message: `${buyerTeam.city} doesn't have enough Salary Cap space.` };
                return prev;
            }

            // 1. Update Player (Move to new team)
            const updatedPlayers = prev.players.map(p =>
                p.id === playerId ? { ...p, teamId: targetTeamId, minutes: 0, isStarter: false, rotationIndex: undefined } : p
            );

            // 2. Update Contract (Assign to new team)
            const updatedContracts = prev.contracts.map(c =>
                c.playerId === playerId ? { ...c, teamId: targetTeamId } : c
            );

            // 3. Update Teams (Transfer Cash)
            const updatedTeams = prev.teams.map(t => {
                if (t.id === sellerTeam.id) {
                    return {
                        ...t,
                        cash: t.cash + price,
                        rosterIds: (t.rosterIds || []).filter(id => id !== playerId)
                    };
                }
                if (t.id === buyerTeam.id) {
                    return {
                        ...t,
                        cash: t.cash - price,
                        rosterIds: [...(t.rosterIds || []), playerId]
                    };
                }
                return t;
            });

            // 4. Record Trade History
            const newTrade: CompletedTrade = {
                id: Math.random().toString(36).substr(2, 9),
                date: new Date(prev.date),
                team1Id: sellerTeam.id,
                team2Id: buyerTeam.id,
                team1Assets: [player.id],
                team2Assets: [`cash_${price}`],
                team1Items: [{ type: 'player', id: player.id, description: `${player.firstName} ${player.lastName}` }],
                team2Items: [{ type: 'cash', id: `cash_${price}`, description: `$${(price / 1e6).toFixed(1)}M Cash` }]
            };

            console.log(`[Liquidation] Sold ${player.firstName} ${player.lastName} to ${buyerTeam.abbreviation} for $${(price / 1e6).toFixed(1)}M.`);
            result = { success: true, message: `Successfully sold ${player.firstName} ${player.lastName} to ${buyerTeam.city} for $${(price / 1e6).toFixed(1)}M.` };

            return {
                ...prev,
                players: updatedPlayers,
                contracts: updatedContracts,
                teams: updatedTeams,
                tradeHistory: [newTrade, ...(prev.tradeHistory || [])]
            };
        });

        return result;
    };

    const buildRotation = (roster: Player[]): RotationViewData => {
        const sorted = [...roster].sort((a, b) => (a.rotationIndex ?? 999) - (b.rotationIndex ?? 999));
        const starters = sorted.filter(p => p.isStarter).slice(0, 5);
        const activeStarters = starters.length === 5 ? starters : sorted.slice(0, 5);
        const bench = roster.filter(p => !activeStarters.find(s => s.id === p.id));

        return {
            startingLineup: activeStarters.map(p => p.id),
            bench: bench.map(p => p.id),
            rotationPlan: sorted.map(p => ({
                playerId: p.id,
                minutes: p.minutes || 0,
                isStarter: activeStarters.some(s => s.id === p.id),
                rotationIndex: p.rotationIndex ?? 999
            }))
        };
    };

    const mapTeamsForSimulation = (teams: Team[]) => teams.map(t => ({ ...t }));

    const checkAndUpdateRecords = (
        prevLeagueRecords: GameRecord[],
        prevTeamRecords: Record<string, GameRecord[]>,
        results: MatchResult[],
        date: Date,
        teams: Team[]
    ) => {
        let leagueRecords = [...prevLeagueRecords];
        let teamRecords = { ...prevTeamRecords };

        results.forEach(game => {
            const homeTeam = teams.find(t => t.id === game.homeTeamId);
            const awayTeam = teams.find(t => t.id === game.awayTeamId);
            
            const allStats = [
                ...Object.values(game.boxScore.homeStats).map(s => ({ ...s, teamId: game.homeTeamId, teamName: homeTeam?.name || 'Unknown', oppName: awayTeam?.name || 'Unknown' })),
                ...Object.values(game.boxScore.awayStats).map(s => ({ ...s, teamId: game.awayTeamId, teamName: awayTeam?.name || 'Unknown', oppName: homeTeam?.name || 'Unknown' }))
            ];

            allStats.forEach(stat => {
                const categories = [
                    { id: 'Points', val: stat.points },
                    { id: 'Rebounds', val: stat.rebounds },
                    { id: 'Assists', val: stat.assists },
                    { id: 'Steals', val: stat.steals },
                    { id: 'Blocks', val: stat.blocks },
                    { id: 'Threes', val: stat.threeMade }
                ];

                categories.forEach(cat => {
                    if (cat.val <= 0) return; // Ignore zero stats

                    // League Record
                    const leagueIdx = leagueRecords.findIndex(r => r.category === cat.id);
                    if (leagueIdx === -1 || cat.val > leagueRecords[leagueIdx].value) {
                        const newRec: GameRecord = {
                            category: cat.id,
                            value: cat.val,
                            playerId: stat.playerId,
                            playerName: stat.name,
                            teamId: stat.teamId,
                            teamName: stat.teamName,
                            year: date.getFullYear(),
                            date: new Date(date),
                            opponentName: stat.oppName
                        };
                        if (leagueIdx === -1) leagueRecords.push(newRec);
                        else leagueRecords[leagueIdx] = newRec;
                    }

                    // Team Record
                    if (!teamRecords[stat.teamId]) teamRecords[stat.teamId] = [];
                    const teamIdx = teamRecords[stat.teamId].findIndex(r => r.category === cat.id);
                    if (teamIdx === -1 || cat.val > teamRecords[stat.teamId][teamIdx].value) {
                        const newRec: GameRecord = {
                            category: cat.id,
                            value: cat.val,
                            playerId: stat.playerId,
                            playerName: stat.name,
                            teamId: stat.teamId,
                            teamName: stat.teamName,
                            year: date.getFullYear(),
                            date: new Date(date),
                            opponentName: stat.oppName
                        };
                        if (teamIdx === -1) teamRecords[stat.teamId].push(newRec);
                        else teamRecords[stat.teamId][teamIdx] = newRec;
                    }
                });
            });
        });

        return { leagueRecords, teamRecords };
    };

    const updateCumulativeTotals = (
        prevLeagueLeaders: Record<string, CumulativeRecord[]>,
        prevTeamLeaders: Record<string, Record<string, CumulativeRecord[]>>,
        results: MatchResult[]
    ) => {
        let leagueLeaders = { ...prevLeagueLeaders };
        let teamLeaders = { ...prevTeamLeaders };

        results.forEach(game => {
            const allStats = [
                ...Object.values(game.boxScore.homeStats).map(s => ({ ...s, teamId: game.homeTeamId })),
                ...Object.values(game.boxScore.awayStats).map(s => ({ ...s, teamId: game.awayTeamId }))
            ];

            allStats.forEach(stat => {
                const categories = [
                    { id: 'Points', val: stat.points },
                    { id: 'Rebounds', val: stat.rebounds },
                    { id: 'Assists', val: stat.assists },
                    { id: 'Steals', val: stat.steals },
                    { id: 'Blocks', val: stat.blocks },
                    { id: 'Threes', val: stat.threeMade }
                ];

                categories.forEach(cat => {
                    if (cat.val <= 0) return;

                    // League Totals
                    if (!leagueLeaders[cat.id]) leagueLeaders[cat.id] = [];
                    const lIdx = leagueLeaders[cat.id].findIndex(r => r.playerId === stat.playerId);
                    if (lIdx !== -1) {
                        leagueLeaders[cat.id][lIdx].total += cat.val;
                        leagueLeaders[cat.id][lIdx].playerName = stat.name; // Keep name fresh
                    } else {
                        leagueLeaders[cat.id].push({
                            playerId: stat.playerId,
                            playerName: stat.name,
                            total: cat.val,
                            category: cat.id
                        });
                    }
                    // Sort and trim
                    leagueLeaders[cat.id].sort((a, b) => b.total - a.total);
                    if (leagueLeaders[cat.id].length > 50) leagueLeaders[cat.id] = leagueLeaders[cat.id].slice(0, 50);

                    // Team Totals
                    if (!teamLeaders[stat.teamId]) teamLeaders[stat.teamId] = {};
                    if (!teamLeaders[stat.teamId][cat.id]) teamLeaders[stat.teamId][cat.id] = [];
                    const tIdx = teamLeaders[stat.teamId][cat.id].findIndex(r => r.playerId === stat.playerId);
                    if (tIdx !== -1) {
                        teamLeaders[stat.teamId][cat.id][tIdx].total += cat.val;
                        teamLeaders[stat.teamId][cat.id][tIdx].playerName = stat.name;
                    } else {
                        teamLeaders[stat.teamId][cat.id].push({
                            playerId: stat.playerId,
                            playerName: stat.name,
                            total: cat.val,
                            category: cat.id,
                            teamId: stat.teamId
                        });
                    }
                    // Sort and trim
                    teamLeaders[stat.teamId][cat.id].sort((a, b) => b.total - a.total);
                    if (teamLeaders[stat.teamId][cat.id].length > 50) teamLeaders[stat.teamId][cat.id] = teamLeaders[stat.teamId][cat.id].slice(0, 50);
                });
            });
        });

        return { leagueLeaders, teamLeaders };
    };

    const simulateDay = (prev: GameState): GameState => {
        const nextDate = new Date(prev.date.getTime() + 86400000);
        let nextDayMatchups: { homeId: string, awayId: string }[] = [];
        let shouldShowMidSeasonModal = false;

        // 1. HEALING LOGIC
        // Create a healed version of players first
        const healedPlayers = prev.players.map(p => {
            if (p.injury && new Date(prev.date) >= new Date(p.injury.returnDate)) {
                return { ...p, injury: undefined };
            }
            return p;
        });

        // 3. MORALE UPDATE (Daily) - Before Games
        // Apply TOXIC morale effect to all teams
        const toxicUpdatedPlayers = healedPlayers.map(p => ({ ...p })); // Clone first

        mapTeamsForSimulation(prev.teams).forEach(t => {
            const teamRoster = toxicUpdatedPlayers.filter(p => p.teamId === t.id);
            const updatedTeamRoster = applyTeamDynamics(teamRoster, t);

            // Update the main array
            updatedTeamRoster.forEach(ur => {
                const idx = toxicUpdatedPlayers.findIndex(p => p.id === ur.id);
                if (idx !== -1) toxicUpdatedPlayers[idx] = ur;
            });
        });

        // Use these players for the day's matches
        const dayPlayers = toxicUpdatedPlayers;
        const activePlayers = dayPlayers.filter(p => !p.injury);

        // Initialize local working copies to avoid mutating prev
        let currentTeams = [...prev.teams];
        let currentPlayers = [...toxicUpdatedPlayers];
        let currentContracts = [...prev.contracts];
        let currentCoaches = [...prev.coaches];
        let currentTradeHistory = [...(prev.tradeHistory || [])];
        let currentNews: NewsStory[] = [];
        let results: MatchResult[] = [];

        // SEASON PHASE 1: REGULAR SEASON
        if (prev.seasonPhase === 'regular_season') {
            const gamesPlayed = prev.seasonGamesPlayed;

            // End of Regular Season - Only transition if we have COMPLETED the required games (38 Euro / 82 NBA)
            const regularSeasonGames = prev.leagueType === 'EURO' ? 38 : 82;
            if (gamesPlayed >= regularSeasonGames && (!prev.dailyMatchups || prev.dailyMatchups.length === 0)) {
                // ... award logic ...
                const currentYear = prev.date.getFullYear();
                const awards = calculateRegularSeasonAwards(currentPlayers, currentTeams, currentYear);

                // Trigger Playoffs Transition
                const isEuro = prev.leagueType === 'EURO';
                const confA = isEuro ? 'EuroLeague' : 'West';
                const confB = isEuro ? 'EuroCup' : 'East';

                const confATeams = currentTeams.filter(t => t.conference === confA).sort((a, b) => b.wins - a.wins);
                const confBTeams = currentTeams.filter(t => t.conference === confB).sort((a, b) => b.wins - a.wins);

                const createSeries = (conf: string, teams: typeof confATeams): PlayoffSeries[] => {
                    const series: PlayoffSeries[] = [];
                    const matchups = [[0, 7], [1, 6], [2, 5], [3, 4]];

                    matchups.forEach((m, idx) => {
                        const home = teams[m[0]];
                        const away = teams[m[1]];
                        series.push({
                            id: `${conf}_1_${idx + 1}`,
                            round: 1,
                            conference: conf as any,
                            homeTeamId: home ? home.id : 'error',
                            awayTeamId: away ? away.id : 'error',
                            homeWins: 0,
                            awayWins: 0
                        });
                    });
                    return series;
                };

                const seriesA = createSeries(confA, confATeams);
                const seriesB = createSeries(confB, confBTeams);

                return {
                    ...prev,
                    seasonPhase: 'playoffs_r1',
                    playoffs: [...seriesA, ...seriesB],
                    date: nextDate,
                    awardsHistory: [...prev.awardsHistory, awards],
                    players: currentPlayers,
                    teams: currentTeams,
                    dailyMatchups: [],
                    pendingUserResult: null
                };
            }

            // --- AI ROSTER MANAGEMENT (Mid-Season Signings & Cuts) ---
            // Occurs periodically (e.g., every 5 days) to avoid excessive processing
            if (prev.seasonGamesPlayed % 5 === 0) {
                const freeAgents = currentPlayers.filter(p => !p.teamId);
                const sortedFAs = [...freeAgents].sort((a, b) => calculateOverall(b) - calculateOverall(a));

                currentTeams.forEach(team => {
                    if (team.id === prev.userTeamId) return;

                    const teamRoster = currentPlayers.filter(p => p.teamId === team.id);
                    const needsPlayer = teamRoster.length < 13;
                    const canUpgrade = teamRoster.length < 15 && sortedFAs.length > 0 && calculateOverall(sortedFAs[0]) > 70;

                    if (needsPlayer || (canUpgrade && Math.random() < 0.1)) {
                        const targetPlayer = sortedFAs.find(fa => {
                            // Can they afford them? (Using a simple 1-2M check for FA)
                            return team.cash > 2000000;
                        });

                        if (targetPlayer) {
                            // Find player to cut if roster is full (15)
                            if (teamRoster.length >= 15) {
                                // Logic: Cut least used player. If multiple, lower OVR.
                                const sortedByUsage = [...teamRoster].sort((a, b) => {
                                    const gamesA = a.seasonStats?.gamesPlayed || 0;
                                    const gamesB = b.seasonStats?.gamesPlayed || 0;
                                    if (gamesA !== gamesB) return gamesA - gamesB;
                                    return calculateOverall(a) - calculateOverall(b);
                                });
                                
                                const playerToCut = sortedByUsage[0];
                                console.log(`[AI Management] ${team.city} cutting ${playerToCut.firstName} ${playerToCut.lastName} (Usage: ${playerToCut.seasonStats?.gamesPlayed || 0})`);
                                
                                // Apply Cut
                                currentPlayers = currentPlayers.map(p => 
                                    p.id === playerToCut.id ? { ...p, teamId: null, minutes: 0, isStarter: false, rotationIndex: undefined } : p
                                );
                                currentContracts = currentContracts.filter(c => c.playerId !== playerToCut.id);
                                
                                // Update team rosterIds
                                team.rosterIds = team.rosterIds.filter(id => id !== playerToCut.id);
                            }

                            // Apply Sign
                            console.log(`[AI Management] ${team.city} signing ${targetPlayer.firstName} ${targetPlayer.lastName} (OVR: ${calculateOverall(targetPlayer)})`);
                            currentPlayers = currentPlayers.map(p => 
                                p.id === targetPlayer.id ? { ...p, teamId: team.id } : p
                            );
                            
                            const newContract: Contract = {
                                id: generateUUID(),
                                playerId: targetPlayer.id,
                                teamId: team.id,
                                amount: 1000000 + Math.floor(Math.random() * 1000000),
                                yearsLeft: 1,
                                startYear: prev.date.getFullYear(),
                                role: 'Bench'
                            };
                            currentContracts.push(newContract);
                            team.rosterIds.push(targetPlayer.id);
                            team.cash -= 1000000; // Simplified signing bonus/cost

                            // Remove from local FA pool to avoid double-signing in same iteration
                            const faIdx = sortedFAs.findIndex(f => f.id === targetPlayer.id);
                            if (faIdx > -1) sortedFAs.splice(faIdx, 1);
                        }
                    }
                });
            }

            // --- AI TRADING LOGIC (Restored & Improved) ---
            if (prev.seasonGamesPlayed < 40) {
                const seasonStart = new Date(prev.date.getFullYear() - (prev.date.getMonth() < 6 ? 1 : 0), 9, 1);

                const tradeProposal = simulateDailyTrades(
                    currentTeams,
                    currentPlayers,
                    currentContracts,
                    prev.date.getFullYear(),
                    prev.salaryCap,
                    currentTradeHistory,
                    prev.date,
                    seasonStart,
                    prev.userTeamId
                );

                if (tradeProposal) {
                    const t1 = currentTeams.find(t => t.id === tradeProposal.proposerId)!;
                    const t2 = currentTeams.find(t => t.id === tradeProposal.targetTeamId)!;

                    const p1Ids = tradeProposal.proposerAssets.players.map(p => p.id);
                    const p2Ids = tradeProposal.targetAssets.players.map(p => p.id);
                    const pick1Ids = tradeProposal.proposerAssets.picks.map(p => p.id);
                    const pick2Ids = tradeProposal.targetAssets.picks.map(p => p.id);

                    // Update Teams
                    currentTeams = currentTeams.map(t => {
                        let updatedT = { ...t };
                        if (t.id === t1.id) {
                            updatedT.rosterIds = t.rosterIds.filter(id => !p1Ids.includes(id)).concat(p2Ids);
                            updatedT.draftPicks = (t.draftPicks || []).filter(pk => !pick1Ids.includes(pk.id)).concat(tradeProposal.targetAssets.picks);
                        }
                        if (t.id === t2.id) {
                            updatedT.rosterIds = t.rosterIds.filter(id => !p2Ids.includes(id)).concat(p1Ids);
                            updatedT.draftPicks = (t.draftPicks || []).filter(pk => !pick2Ids.includes(pk.id)).concat(tradeProposal.proposerAssets.picks);
                        }
                        return updatedT;
                    });

                    // Update Players
                    currentPlayers = currentPlayers.map(p => {
                        if (p1Ids.includes(p.id)) return { ...p, teamId: t2.id };
                        if (p2Ids.includes(p.id)) return { ...p, teamId: t1.id };
                        return p;
                    });

                    // Update Contracts
                    currentContracts = currentContracts.map(c => {
                        if (p1Ids.includes(c.playerId)) return { ...c, teamId: t2.id };
                        if (p2Ids.includes(c.playerId)) return { ...c, teamId: t1.id };
                        return c;
                    });

                    const createItems = (playersArr: Player[], picksArr: DraftPick[], teamId: string) => {
                        const teamBaseline = calculateTeamBaseline(currentPlayers.filter(p => p.teamId === teamId));
                        return [
                            ...playersArr.map(p => ({
                                type: 'player' as const, id: p.id, description: `${p.firstName} ${p.lastName}`, subText: getStarString(calculateStars(calculateOverall(p), teamBaseline)), color: '#22c55e'
                            })),
                        ...picksArr.map(pk => {
                            const originalTeam = currentTeams.find(t => t.id === pk.originalTeamId);
                            const owner = currentTeams.find(t => t.id === teamId);
                            return {
                                type: 'pick' as const,
                                id: pk.id,
                                description: `${pk.year} | ${pk.round === 1 ? '1st' : '2nd'} Round | ${owner?.abbreviation || 'TBD'} | ${originalTeam?.abbreviation || pk.originalTeamName || 'Unknown'}®`,
                                subText: `Original: ${pk.originalTeamName}`,
                                color: '#eab308',
                                originalTeamId: pk.originalTeamId
                            };
                        })
                        ];
                    };

                    const t1Items = createItems(tradeProposal.proposerAssets.players, tradeProposal.proposerAssets.picks, t1.id);
                    const t2Items = createItems(tradeProposal.targetAssets.players, tradeProposal.targetAssets.picks, t2.id);

                    const tradeRecord: CompletedTrade = {
                        id: generateUUID(),
                        date: nextDate,
                        team1Id: t1.id,
                        team2Id: t2.id,
                        team1Assets: t1Items.map(i => i.description),
                        team2Assets: t2Items.map(i => i.description),
                        team1Items: t1Items,
                        team2Items: t2Items
                    };

                    currentTradeHistory.push(tradeRecord);
                    currentNews.push({
                        id: generateUUID(),
                        date: nextDate,
                        headline: "League Trade Executed",
                        content: `${t1.abbreviation} and ${t2.abbreviation} have agreed to a deal involving ${t1Items.map(i => i.description).join(', ')}.`,
                        type: 'TRANSACTION',
                        relatedTeamId: t1.id,
                        priority: 3
                    });
                }
            }

            // O4: Mid-Season GM Firing (Check exactly at 40 games played)
            if (prev.seasonGamesPlayed === 40) {
                const { updatedGms, newsItems } = processGMDismissals(currentTeams, prev.aiGms, prev.userTeamId, currentPlayers, true);
                // Update teams with new GMs if fired
                currentTeams = currentTeams.map(team => {
                    const gm = updatedGms.find(g => g.teamId === team.id);
                    if (gm && gm.id !== team.gmId) {
                        return { ...team, gmId: gm.id };
                    }
                    return team;
                });
                
                newsItems.forEach(n => {
                    currentNews.push({
                        id: generateUUID(),
                        date: nextDate,
                        headline: "GM Fired Mid-Season!",
                        content: n,
                        type: 'GENERAL',
                        priority: 5
                    });
                });
                
                // We must update the global aiGms array, but we are inside simulateDay which returns GameState.
                // We will assign this back to the returned state.
                prev.aiGms = updatedGms; 

                // Process in-season progression for all players exactly at 40 games
                currentPlayers = currentPlayers.map(p => {
                    const teamCoach = currentCoaches.find(c => c.teamId === p.teamId);
                    return calculateInSeasonProgression(p, teamCoach?.rating.talentDevelopment);
                });

                shouldShowMidSeasonModal = true;
            }

            // --- AI IN-SEASON ROSTER MANAGEMENT ---
            if (prev.seasonGamesPlayed % 7 === 0) { // Check weekly
                const bestFAs = [...currentPlayers]
                    .filter(p => !p.teamId)
                    .sort((a, b) => calculateOverall(b) - calculateOverall(a));

                currentTeams.forEach(team => {
                    if (team.id === prev.userTeamId) return;

                    const roster = currentPlayers.filter(p => p.teamId === team.id);
                    const payroll = currentContracts.filter(c => c.teamId === team.id).reduce((sum, c) => sum + c.amount, 0);
                    const capSpace = prev.salaryCap - payroll;

                    // 1. Fill Roster if < 14 players
                    if (roster.length < 14 && bestFAs.length > 0 && capSpace > 2000000) {
                        const target = bestFAs[0];
                        if (calculateOverall(target) > 70) {
                            bestFAs.shift();
                            currentPlayers = currentPlayers.map(p => p.id === target.id ? { ...p, teamId: team.id } : p);
                            currentContracts.push({
                                id: generateUUID(),
                                playerId: target.id,
                                teamId: team.id,
                                amount: 1500000,
                                yearsLeft: 1,
                                startYear: prev.date.getFullYear(),
                                role: 'Rotation'
                            });
                            team.rosterIds.push(target.id);
                            currentNews.push({
                                id: generateUUID(),
                                date: nextDate,
                                headline: `${team.abbreviation} sign ${target.lastName}`,
                                content: `The ${team.name} have signed free agent ${target.firstName} ${target.lastName} to a 1-year deal to bolster their bench.`,
                                type: 'TRANSACTION',
                                relatedTeamId: team.id,
                                priority: 2
                            });
                        }
                    }

                    // 2. Cut/Replace low performers if roster is full (15)
                    if (roster.length >= 15 && bestFAs.length > 0) {
                        const worstPlayer = [...roster].sort((a, b) => calculateOverall(a) - calculateOverall(b))[0];
                        const bestFA = bestFAs[0];
                        
                        if (calculateOverall(bestFA) > calculateOverall(worstPlayer) + 8) {
                            // Cut worst, sign best
                            currentPlayers = currentPlayers.map(p => p.id === worstPlayer.id ? { ...p, teamId: null } : p);
                            currentContracts = currentContracts.filter(c => c.playerId !== worstPlayer.id);
                            team.rosterIds = team.rosterIds.filter(id => id !== worstPlayer.id);

                            bestFAs.shift();
                            currentPlayers = currentPlayers.map(p => p.id === bestFA.id ? { ...p, teamId: team.id } : p);
                            currentContracts.push({
                                id: generateUUID(),
                                playerId: bestFA.id,
                                teamId: team.id,
                                amount: 1000000,
                                yearsLeft: 1,
                                startYear: prev.date.getFullYear(),
                                role: 'Rotation'
                            });
                            team.rosterIds.push(bestFA.id);

                            currentNews.push({
                                id: generateUUID(),
                                date: nextDate,
                                headline: `${team.abbreviation} shuffle roster`,
                                content: `The ${team.name} have waived ${worstPlayer.lastName} and signed ${bestFA.firstName} ${bestFA.lastName}.`,
                                type: 'TRANSACTION',
                                relatedTeamId: team.id,
                                priority: 2
                            });
                        }
                    }
                });
            }

            // --- AI COACH EVALUATION (Every ~20 games) ---
            if (prev.seasonGamesPlayed > 0 && prev.seasonGamesPlayed % 20 === 0) {
                const recentCutoff = new Date(prev.date.getTime() - 30 * 86400000);
                const recentTradesByTeam: Record<string, number> = {};
                currentTradeHistory.forEach(trade => {
                    if (new Date(trade.date) >= recentCutoff) {
                        recentTradesByTeam[trade.team1Id] = (recentTradesByTeam[trade.team1Id] || 0) + 1;
                        recentTradesByTeam[trade.team2Id] = (recentTradesByTeam[trade.team2Id] || 0) + 1;
                    }
                });

                currentTeams.forEach(team => {
                    if (team.id === prev.userTeamId) return; // Don't fire user's coach
                    const coach = currentCoaches.find(c => c.id === team.coachId && c.teamId === team.id);
                    if (!coach) return;

                    const recentTrades = recentTradesByTeam[team.id] || 0;
                    if (shouldFireCoach(team, coach, prev.seasonGamesPlayed, recentTrades)) {
                        // Fire the coach
                        const fireResult = fireCoach(team, currentCoaches, currentTeams);
                        currentCoaches = fireResult.updatedCoaches;
                        currentTeams = fireResult.updatedTeams;

                        // Hire a replacement
                        const firedTeam = currentTeams.find(t => t.id === team.id)!;
                        const hireResult = hireCoach(firedTeam, currentCoaches, currentTeams);
                        currentCoaches = hireResult.updatedCoaches;
                        currentTeams = hireResult.updatedTeams;

                        const newCoach = currentCoaches.find(c => c.teamId === team.id);
                        currentNews.push({
                            id: generateUUID(),
                            date: nextDate,
                            headline: `${team.name} fire coach ${coach.lastName}`,
                            content: `The ${team.name} have parted ways with head coach ${coach.firstName} ${coach.lastName} after a disappointing ${team.wins}-${team.losses} record.${newCoach ? ` ${newCoach.firstName} ${newCoach.lastName} has been hired as the new head coach.` : ''}`,
                            type: 'TRANSACTION',
                            relatedTeamId: team.id,
                            priority: 4
                        });
                    }
                });
            }




            // Use pre-generated daily matchups
            prev.dailyMatchups.forEach(matchup => {
                const home = currentTeams.find(t => t.id === matchup.homeId)!;
                const away = currentTeams.find(t => t.id === matchup.awayId)!;

                let result: MatchResult;

                // Check if this is the user's game and if they played it
                const isUserGame = home.id === prev.userTeamId || away.id === prev.userTeamId;
                if (isUserGame && prev.pendingUserResult) {
                    result = prev.pendingUserResult;
                } else {
                    // Sim non-user game
                    const hRoster = currentPlayers.filter(p => p.teamId === home.id);
                    const aRoster = currentPlayers.filter(p => p.teamId === away.id);
                    const hCoach = prev.coaches.find(c => c.teamId === home.id);
                    const aCoach = prev.coaches.find(c => c.teamId === away.id);

                    result = simulateMatch({
                        homeTeam: home,
                        awayTeam: away,
                        homeRoster: hRoster,
                        awayRoster: aRoster,
                        homeCoach: hCoach,
                        awayCoach: aCoach,
                        date: prev.date,
                        userTeamId: prev.userTeamId,
                        leagueType: prev.leagueType
                    });
                }
                results.push(result);

                if (result.homeScore > result.awayScore + 15 || result.awayScore > result.homeScore + 15) {
                    currentNews.push({
                        id: generateUUID(),
                        date: nextDate,
                        headline: `Blowout: ${result.winnerId === home.id ? home.name : away.name} dominate!`,
                        content: `The ${(result.winnerId === home.id ? home.name : away.name)} won by a large margin against ${(result.winnerId === home.id ? away.name : home.name)}.`,
                        type: 'GAME',
                        relatedTeamId: result.winnerId,
                        priority: 2
                    });
                }
                // --- NEWS GENERATION START ---
                const gameStory = NewsEngine.generateGameNews(result, home, away, currentPlayers.filter(p => !p.injury));
                if (gameStory) currentNews.push(gameStory);

                result.injuries.forEach(inj => {
                    const player = currentPlayers.find(p => p.id === inj.playerId);
                    const team = player ? (player.teamId === home.id ? home : away) : null;
                    if (player && team) {
                        const injuryStory = NewsEngine.generateInjuryNews(player, team, inj.type, 14, nextDate);
                        currentNews.push(injuryStory);
                    }
                });
                // --- NEWS GENERATION END ---

                // --- PLAYER STATEMENTS ---
                const notablePlayers = [...Object.values(result.boxScore.homeStats), ...Object.values(result.boxScore.awayStats)]
                    .filter(s => s.minutes > 0)
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 3); // Top 3 scorers

                notablePlayers.forEach(ns => {
                    const p = currentPlayers.find(ap => ap.id === ns.playerId);
                    const team = p?.teamId === home.id ? home : away;
                    if (p && team) {
                        const statement = NewsEngine.generatePlayerStatement(p, team, result, nextDate);
                        if (statement) currentNews.push(statement);
                    }
                });

                // --- DYNAMIC STORY GENERATION ---
                const allGamesForContext = [...prev.games, ...results];
                const dynamicStories = NewsEngine.generateDailyStories(currentTeams, currentPlayers, allGamesForContext, nextDate);
                currentNews.push(...dynamicStories);

                // UPDATE MORALE POST-GAME
                const winnerId = result.winnerId;
                const matchPlayers = [
                    ...Object.values(result.boxScore.homeStats).map(s => ({ id: s.playerId, minutes: s.minutes, teamId: result.homeTeamId })),
                    ...Object.values(result.boxScore.awayStats).map(s => ({ id: s.playerId, minutes: s.minutes, teamId: result.awayTeamId }))
                ];

                matchPlayers.forEach(mp => {
                    const playerIndex = currentPlayers.findIndex(p => p.id === mp.id);
                    if (playerIndex !== -1) {
                        const player = currentPlayers[playerIndex];
                        const team = currentTeams.find(t => t.id === mp.teamId)!;
                        const won = mp.teamId === winnerId;
                        const opponentId = mp.teamId === result.homeTeamId ? result.awayTeamId : result.homeTeamId;
                        const updated = updatePlayerMorale(player, team, won, mp.minutes, opponentId, prev.salaryCap);
                        currentPlayers[playerIndex] = updated;
                    }
                });
            });

            // --- SOCIAL MEDIA PULSE ---
            const newSocialPosts = generateDailyPosts(results, currentTeams, currentPlayers);
            const updatedSocialPosts = [...newSocialPosts, ...(prev.socialMediaPosts || [])].slice(0, 30);

            // Compute totalGamesPlayed FIRST so it can be used for next-day scheduling
            const userTeamRecord = currentTeams.find(t => t.id === prev.userTeamId);
            const totalGamesPlayed = prev.seasonGamesPlayed + 1;

            // Matchup generation for next day
            let nextDayMatchups: { homeId: string, awayId: string }[] = [];

            if (prev.leagueType === 'EURO') {
                // Euro: use pre-generated schedule — advance to next match day
                const nextRoundIdx = totalGamesPlayed; // this is now the NEXT round index
                if (nextRoundIdx < (prev.euroSchedule?.length || 0)) {
                    nextDayMatchups = prev.euroSchedule[nextRoundIdx];
                }
                // If no more rounds, leave empty (season over)
            } else {
                // NBA: use pre-generated schedule indexed by day
                if (prev.nbaSchedule && prev.nbaSchedule.length > 0) {
                    const nextDayIdx = totalGamesPlayed;
                    if (nextDayIdx < prev.nbaSchedule.length) {
                        nextDayMatchups = prev.nbaSchedule[nextDayIdx];
                    }
                } else {
                    // Fallback for old saves: random day
                    const activeTeams = currentTeams.filter(t => (t.wins + t.losses) < 82);
                    const shuffled = [...activeTeams].sort(() => Math.random() - 0.5);
                    for (let i = 0; i < shuffled.length; i += 2) {
                        if (i + 1 < shuffled.length) {
                            nextDayMatchups.push({ homeId: shuffled[i].id, awayId: shuffled[i + 1].id });
                        }
                    }
                }
            }

            // 3. DAILY CONTRACT/MORALE CHECKS (Prove-It Deals)
            currentPlayers = currentPlayers.map(p => {
                const { player: checkedPlayer, news } = checkProveItDemands(p, nextDate);
                if (news) {
                    currentNews.push({
                        id: generateUUID(),
                        date: nextDate,
                        headline: news.headline,
                        content: news.content,
                        type: 'RUMOR',
                        priority: 5,
                        relatedPlayerId: p.id,
                        relatedTeamId: p.teamId || undefined
                    });
                }
                return checkedPlayer;
            });

            // 5. DAILY AI TRADES (Post-Game Execution) - Already handled above

            // Duplicate AI trade logic removed (handled at start of function)

            // --- APPLY GAME RESULTS TO TEAMS ---
            // Fix for 0-0 Bug: We must update team records based on the days results
            currentTeams = currentTeams.map(team => {
                const teamResults = results.filter(r => r.homeTeamId === team.id || r.awayTeamId === team.id);
                if (teamResults.length === 0) return team;

                let newWins = team.wins;
                let newLosses = team.losses;

                teamResults.forEach(r => {
                    if (r.winnerId === team.id) newWins++;
                    else newLosses++;
                });

                return { ...team, wins: newWins, losses: newLosses };
            });

            // --- AGGREGATE PLAYER STATS ---
            // Fix for Missing Stats Bug: Update player season stats from box scores
            results.forEach(game => {
                const allStats = [
                    ...Object.values(game.boxScore.homeStats),
                    ...Object.values(game.boxScore.awayStats)
                ];

                allStats.forEach(stat => {
                    if (stat.minutes === 0) return;
                    const pIdx = currentPlayers.findIndex(p => p.id === stat.playerId);
                    if (pIdx !== -1) {
                        const p = currentPlayers[pIdx];
                        const current = p.seasonStats || {
                            gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                            steals: 0, blocks: 0, turnovers: 0, fouls: 0,
                            offensiveRebounds: 0, defensiveRebounds: 0,
                            fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
                            ftMade: 0, ftAttempted: 0, plusMinus: 0,
                            rimMade: 0, rimAttempted: 0, midRangeMade: 0, midRangeAttempted: 0,
                            rimAssisted: 0, midRangeAssisted: 0, threePointAssisted: 0
                        };

                        currentPlayers[pIdx] = {
                            ...p,
                            seasonStats: {
                                ...current,
                                gamesPlayed: current.gamesPlayed + 1,
                                minutes: current.minutes + stat.minutes,
                                points: current.points + stat.points,
                                rebounds: current.rebounds + stat.rebounds,
                                assists: current.assists + stat.assists,
                                steals: current.steals + stat.steals,
                                blocks: current.blocks + stat.blocks,
                                turnovers: current.turnovers + stat.turnovers,
                                fouls: current.fouls + stat.personalFouls,
                                offensiveRebounds: current.offensiveRebounds + stat.offensiveRebounds,
                                defensiveRebounds: current.defensiveRebounds + stat.defensiveRebounds,
                                fgMade: current.fgMade + stat.fgMade,
                                fgAttempted: current.fgAttempted + stat.fgAttempted,
                                threeMade: current.threeMade + stat.threeMade,
                                threeAttempted: current.threeAttempted + stat.threeAttempted,
                                ftMade: current.ftMade + stat.ftMade,
                                ftAttempted: current.ftAttempted + stat.ftAttempted,
                                plusMinus: current.plusMinus + stat.plusMinus,
                                rimMade: (current.rimMade || 0) + stat.rimMade,
                                rimAttempted: (current.rimAttempted || 0) + stat.rimAttempted,
                                midRangeMade: (current.midRangeMade || 0) + stat.midRangeMade,
                                midRangeAttempted: (current.midRangeAttempted || 0) + stat.midRangeAttempted,
                                rimAssisted: (current.rimAssisted || 0) + stat.rimAssisted,
                                midRangeAssisted: (current.midRangeAssisted || 0) + stat.midRangeAssisted,
                                threePointAssisted: (current.threePointAssisted || 0) + stat.threePointAssisted
                            }
                        };
                    }
                });
            });

            // totalGamesPlayed and userTeamRecord already computed above (before matchup generation)

            // Update Records
            const { leagueRecords, teamRecords } = checkAndUpdateRecords(
                prev.leagueRecords || [],
                prev.teamRecords || {},
                results,
                nextDate,
                currentTeams
            );

            const isRegularSeason = prev.seasonPhase === 'regular_season';
            const { leagueLeaders, teamLeaders } = isRegularSeason
                ? updateCumulativeTotals(
                    prev.leagueAllTimeLeaders || {},
                    prev.teamAllTimeLeaders || {},
                    results
                )
                : { leagueLeaders: prev.leagueAllTimeLeaders, teamLeaders: prev.teamAllTimeLeaders };

            return {
                ...prev,
                teams: currentTeams,
                players: currentPlayers,
                contracts: currentContracts,
                coaches: currentCoaches,
                tradeHistory: currentTradeHistory,
                games: [...prev.games, ...results],
                date: nextDate,
                news: [...currentNews, ...prev.news].slice(0, 100),
                dailyMatchups: nextDayMatchups,
                seasonGamesPlayed: totalGamesPlayed,
                pendingUserResult: null,
                socialMediaPosts: updatedSocialPosts,
                leagueRecords,
                teamRecords,
                leagueAllTimeLeaders: leagueLeaders,
                teamAllTimeLeaders: teamLeaders,
                showMidSeasonProgressionModal: shouldShowMidSeasonModal ? true : prev.showMidSeasonProgressionModal,
                isSimulating: nextDayMatchups.length > 0 && prev.isSimulating,
            };
        }
        else if (prev.seasonPhase.startsWith('playoffs')) {
            console.log(`[SimDay] Simulating Playoff Phase: ${prev.seasonPhase} `);

            // RECOVERY: If playoffs array is empty but we are in playoffs, regenerate Round 1
            if (prev.playoffs.length === 0) {
                console.warn("[SimDay] Playoffs array empty in playoff phase! Regenerating Round 1...");
                const westTeams = prev.teams.filter(t => t.conference === 'West').sort((a, b) => b.wins - a.wins);
                const eastTeams = prev.teams.filter(t => t.conference === 'East').sort((a, b) => b.wins - a.wins);

                const createSeries = (round: number, conf: 'West' | 'East', seeds: number[]): PlayoffSeries[] => {
                    const series: PlayoffSeries[] = [];
                    const matchups = [[0, 7], [1, 6], [2, 5], [3, 4]];

                    matchups.forEach((m, idx) => {
                        const home = (conf === 'West' ? westTeams : eastTeams)[m[0]];
                        const away = (conf === 'West' ? westTeams : eastTeams)[m[1]];
                        series.push({
                            id: `${conf}_1_${idx + 1}`,
                            round: 1,
                            conference: conf,
                            homeTeamId: home ? home.id : 'error', // Safety
                            awayTeamId: away ? away.id : 'error',
                            homeWins: 0,
                            awayWins: 0
                        });
                    });
                    return series;
                };

                const westSeries = createSeries(1, 'West', []);
                const eastSeries = createSeries(1, 'East', []);
                return {
                    ...prev,
                    seasonPhase: 'playoffs_r1', // Force correct phase
                    playoffs: [...westSeries, ...eastSeries],
                    date: prev.date // Don't advance date yet, just fix state
                };
            }

            const newGames: MatchResult[] = [];
            // DEEP CLONE playoffs to avoid mutating prev state (which causes double-sim in StrictMode)
            let updatedPlayoffs = prev.playoffs.map(s => ({ ...s }));
            const currentRound = Math.max(...updatedPlayoffs.map(s => s.round), 1); // Default to 1
            const activeSeries = updatedPlayoffs.filter(s => s.round === currentRound);

            // USER REQUEST: "Simulate 1 game for all the pairs"
            // Start of Refactor: Select ALL unfinished series
            const unfinishedSeries = activeSeries.filter(s => !s.winnerId);
            const seriesList = unfinishedSeries;

            // Note: date advancement is global, so all games happen on 'nextDate'.
            // This is effectively a "Round-Robin Step" simulation.

            seriesList.forEach(series => {
                // Check if this series has a pending user result
                const userResult = prev.pendingUserResult;
                const isUserSeries = (series.homeTeamId === prev.userTeamId || series.awayTeamId === prev.userTeamId) &&
                    userResult &&
                    (userResult.homeTeamId === series.homeTeamId || userResult.awayTeamId === series.homeTeamId);

                if (isUserSeries && userResult) {
                    console.log("[SimDay] Using Pending User Result for Playoff Series", series.id);
                    newGames.push(userResult);
                    if (userResult.winnerId === series.homeTeamId) {
                        series.homeWins++;
                    } else {
                        series.awayWins++;
                    }
                } else {
                    const gameNum = series.homeWins + series.awayWins;
                    const isHomeCourt = [0, 1, 4, 6].includes(gameNum);

                    const homeTeam = prev.teams.find(t => t.id === (isHomeCourt ? series.homeTeamId : series.awayTeamId))!;
                    const awayTeam = prev.teams.find(t => t.id === (isHomeCourt ? series.awayTeamId : series.homeTeamId))!;

                    const homeRoster = activePlayers.filter(p => p.teamId === homeTeam.id);
                    const awayRoster = activePlayers.filter(p => p.teamId === awayTeam.id);

                    const result = simulateMatch({
                        homeTeam,
                        awayTeam,
                        homeRoster,
                        awayRoster,
                        date: nextDate,
                        userTeamId: prev.userTeamId
                    });
                    newGames.push(result);

                    if (result.winnerId === series.homeTeamId) {
                        series.homeWins++;
                    } else {
                        series.awayWins++;
                    }
                }

                const winsNeeded = prev.leagueType === 'EURO' ? (series.round === 1 ? 3 : 1) : 4;

                if (series.homeWins >= winsNeeded && !series.winnerId) {
                    series.winnerId = series.homeTeamId;
                }
                if (series.awayWins >= winsNeeded && !series.winnerId) {
                    series.winnerId = series.awayTeamId;
                }

                console.log(`[DebugSim] Series ${series.id} Updated. Home: ${series.homeWins}, Away: ${series.awayWins}`);
            });

            // If a round JUST finished, generate next round immediately?
            // The user wants granular control, so maybe we let them see the "Winner" state first.
            // But we need to check strictly if round is complete to generate next round logic.
            // The existing logic did this automatically. Let's keep it but it will only trigger when the LAST series finishes.

            const roundComplete = activeSeries.every(s => s.winnerId);

            if (!roundComplete) {
                // Update players with injuries from today's games
                const playoffUpdatedPlayers = healedPlayers.map(p => {
                    const injuryGame = newGames.find(g => g.injuries.some(i => i.playerId === p.id));
                    if (injuryGame) {
                        const injury = injuryGame.injuries.find(i => i.playerId === p.id);
                        return { ...p, injury };
                    }
                    return p;
                });

                // --- AGGREGATE PLAYOFF STATS from today's games ---
                newGames.forEach(game => {
                    const allStats = [
                        ...Object.values(game.boxScore.homeStats),
                        ...Object.values(game.boxScore.awayStats)
                    ];
                    allStats.forEach(stat => {
                        if (stat.minutes === 0) return;
                        const pIdx = playoffUpdatedPlayers.findIndex(p => p.id === stat.playerId);
                        if (pIdx !== -1) {
                            const p = playoffUpdatedPlayers[pIdx];
                            const cur = p.playoffStats || {
                                gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                                steals: 0, blocks: 0, turnovers: 0, fouls: 0, plusMinus: 0,
                                offensiveRebounds: 0, defensiveRebounds: 0,
                                fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
                                ftMade: 0, ftAttempted: 0,
                                rimMade: 0, rimAttempted: 0, rimAssisted: 0,
                                midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
                                threePointAssisted: 0
                            };
                            playoffUpdatedPlayers[pIdx] = {
                                ...p,
                                playoffStats: {
                                    ...cur,
                                    gamesPlayed: cur.gamesPlayed + 1,
                                    minutes: cur.minutes + stat.minutes,
                                    points: cur.points + stat.points,
                                    rebounds: cur.rebounds + stat.rebounds,
                                    assists: cur.assists + stat.assists,
                                    steals: cur.steals + stat.steals,
                                    blocks: cur.blocks + stat.blocks,
                                    turnovers: cur.turnovers + (stat.turnovers || 0),
                                    fouls: cur.fouls + (stat.personalFouls || 0),
                                    plusMinus: cur.plusMinus + (stat.plusMinus || 0),
                                    offensiveRebounds: cur.offensiveRebounds + (stat.offensiveRebounds || 0),
                                    defensiveRebounds: cur.defensiveRebounds + (stat.defensiveRebounds || 0),
                                    fgMade: cur.fgMade + (stat.fgMade || 0),
                                    fgAttempted: cur.fgAttempted + (stat.fgAttempted || 0),
                                    threeMade: cur.threeMade + (stat.threeMade || 0),
                                    threeAttempted: cur.threeAttempted + (stat.threeAttempted || 0),
                                    ftMade: cur.ftMade + (stat.ftMade || 0),
                                    ftAttempted: cur.ftAttempted + (stat.ftAttempted || 0),
                                    rimMade: cur.rimMade + (stat.rimMade || 0),
                                    rimAttempted: cur.rimAttempted + (stat.rimAttempted || 0),
                                    rimAssisted: cur.rimAssisted + (stat.rimAssisted || 0),
                                    midRangeMade: cur.midRangeMade + (stat.midRangeMade || 0),
                                    midRangeAttempted: cur.midRangeAttempted + (stat.midRangeAttempted || 0),
                                    midRangeAssisted: cur.midRangeAssisted + (stat.midRangeAssisted || 0),
                                    threePointAssisted: cur.threePointAssisted + (stat.threePointAssisted || 0),
                                }
                            };
                        }
                    });
                });

                return {
                    ...prev,
                    date: nextDate,
                    games: [...prev.games, ...newGames],
                    playoffs: updatedPlayoffs,
                    players: playoffUpdatedPlayers,
                    pendingUserResult: null,
                    dailyMatchups: []
                };

            }

            // ... (existing round completion logic matches safely)
            if (roundComplete) {
                // FINALS OVER check
                const isFinalRound = prev.leagueType === 'EURO' ? currentRound === 3 : currentRound === 4;

                if (isFinalRound) {
                    const finishedSeasonYear = prev.date.getFullYear();

                    // Identify Champions (plural for Euro mode)
                    const finalSeriesList = updatedPlayoffs.filter(s => s.round === currentRound && s.winnerId);
                    if (finalSeriesList.length === 0) return prev;

                    // For awardsHistory, we might just pick the EuroLeague champion or handle it differently.
                    // Let's pick the first winner for the 'champion' slot, or better, we can maybe store both?
                    // User didn't ask to change the awards structure, so I'll just use the first one for the main 'champion' field.
                    const championId = finalSeriesList[0].winnerId;
                    if (!championId) return prev;

                    const championTeam = prev.teams.find(t => t.id === championId)!;
                    const finalsMvp = calculateFinalsMvp(prev.players, prev.games, championId, prev.playoffs);

                    // Update History
                    const updatedAwardsHistory = [...prev.awardsHistory];
                    const historyIndex = updatedAwardsHistory.findIndex(h => h.year === finishedSeasonYear);
                    const championInfo = { teamId: championTeam.id, teamName: championTeam.name };

                    if (historyIndex !== -1) {
                        updatedAwardsHistory[historyIndex] = { ...updatedAwardsHistory[historyIndex], champion: championInfo, finalsMvp: finalsMvp };
                    } else {
                        const regularSeasonAwards = calculateRegularSeasonAwards(prev.players, prev.teams, finishedSeasonYear);
                        updatedAwardsHistory.push({ ...regularSeasonAwards, champion: championInfo, finalsMvp: finalsMvp });
                    }

                    // Offseason processing...
                    let archivedPlayers: Player[] = prev.players.map(p => {
                        const newCareerStat: CareerStat = { ...p.seasonStats, season: finishedSeasonYear, teamId: p.teamId || 'FA', overall: p.overall };
                        const newCareerStats: CareerStat[] = [...(p.careerStats || []), newCareerStat];
                        if (p.playoffStats && p.playoffStats.gamesPlayed > 0) {
                            newCareerStats.push({ ...p.playoffStats, season: finishedSeasonYear, teamId: p.teamId || 'FA', overall: p.overall, isPlayoffs: true });
                        }
                        return checkTradeRequests({
                            ...p, careerStats: newCareerStats,
                            seasonStats: {
                                gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                                turnovers: 0, offensiveRebounds: 0, defensiveRebounds: 0, fouls: 0,
                                fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0, plusMinus: 0,
                                rimMade: 0, rimAttempted: 0, rimAssisted: 0,
                                midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
                                threePointAssisted: 0
                            },
                            playoffStats: undefined, injury: undefined
                        });
                    });

                    let aiUpdatedPlayers = [...archivedPlayers];
                    let aiUpdatedContracts = [...prev.contracts];
                    const aiTeamsInDebt = mapTeamsForSimulation(prev.teams).filter(t => t.id !== prev.userTeamId && t.cash < -50000000);

                    aiTeamsInDebt.forEach(team => {
                        const teamRoster = aiUpdatedPlayers.filter(p => p.teamId === team.id);
                        const teamContracts = aiUpdatedContracts.filter(c => c.teamId === team.id);
                        const candidates = teamRoster
                            .filter(p => {
                                const c = teamContracts.find(con => con.playerId === p.id);
                                return c && c.amount > prev.salaryCap * 0.10 && p.overall < 80;
                            })
                            .sort((a, b) => {
                                const aSalary = teamContracts.find(c => c.playerId === a.id)?.amount || 0;
                                const bSalary = teamContracts.find(c => c.playerId === b.id)?.amount || 0;
                                return (bSalary / b.overall) - (aSalary / a.overall);
                            });
                        if (candidates.length > 0) {
                            const toCut = candidates[0];
                            aiUpdatedPlayers = aiUpdatedPlayers.map(p => p.id === toCut.id ? { ...p, teamId: null, minutes: 0, isStarter: false } : p);
                            aiUpdatedContracts = aiUpdatedContracts.filter(c => c.playerId !== toCut.id);
                        }
                    });

                    const finalSalaryCap = prev.salaryCap;
                    const activePlayoffs = updatedPlayoffs;
                    const teamReportsMap: Record<string, any> = {};

                    mapTeamsForSimulation(prev.teams).forEach(t => {
                        const teamContracts = aiUpdatedContracts.filter(c => c.teamId === t.id);
                        teamReportsMap[t.id] = calculateAnnualFinancials(t, teamContracts, prev.salaryCap, LUXURY_TAX_THRESHOLD, t.consecutiveTaxYears || 0);
                    });

                    const leagueFinancials = calculateLeagueFinancials(prev.teams, prev.salaryCap, teamReportsMap);
                    const distributionPerTeam = leagueFinancials.payoutPerTeam;

                    const updatedTeams = mapTeamsForSimulation(prev.teams).map(t => {
                        const report = teamReportsMap[t.id];
                        let result: SeasonResult = 'MISSED_PLAYOFFS';
                        const teamInPlayoffs = activePlayoffs.some(s => s.homeTeamId === t.id || s.awayTeamId === t.id);

                        if (!teamInPlayoffs) {
                            const sortedTeams = [...prev.teams].sort((a, b) => a.wins - b.wins);
                            const rank = sortedTeams.findIndex(st => st.id === t.id);
                            if (rank < 5) result = 'BOTTOM_5';
                        } else {
                            const wonFinals = finalSeriesList.some(s => s.winnerId === t.id);
                            const inFinals = finalSeriesList.some(s => s.homeTeamId === t.id || s.awayTeamId === t.id);
                            const inSemis = activePlayoffs.some(s => s.round === currentRound - 1 && (s.homeTeamId === t.id || s.awayTeamId === t.id));

                            if (wonFinals) result = 'CHAMPION';
                            else if (inFinals) result = 'FINALS_LOSS';
                            else if (inSemis) result = 'CONF_FINALS_LOSS';
                            else result = 'PLAYOFFS_EARLY_EXIT';
                        }

                        // 2. Evaluate Performance (Fan Interest / Owner Patience)
                        const roster = aiUpdatedPlayers.filter(p => p.teamId === t.id);
                        const teamContracts = aiUpdatedContracts.filter(c => c.teamId === t.id);
                        const expectation = calculateExpectation(t, roster, prev.teams, teamContracts);

                        // We use the old evaluator primarily for Fan Interest/Patience updates
                        // We ignore its returned 'newCash'
                        const annualRevenue = report.totalRevenue;
                        const performanceUpdate = evaluateSeasonPerformance(t, result, expectation, teamContracts, annualRevenue);

                        // 3. Apply New Financials
                        // NOTE: Payroll is now paid UPFRONT at season start. 
                        // So at season end, we only add Revenue and subtract Tax.
                        // We do NOT subtract Payroll again here.

                        let cashChange = report.totalRevenue; // Start with Revenue
                        let redistributionReceived = 0;

                        // Deduct Tax if applicable
                        if (report.isTaxPayer) {
                            cashChange -= report.luxuryTaxPaid;
                        } else if (report.payroll <= prev.salaryCap) {
                            // Add Redistribution only if under Cap
                            cashChange += distributionPerTeam;
                            redistributionReceived = distributionPerTeam;
                        }

                        const newCash = t.cash + cashChange;

                        // Update Repeater Tax Status for next year
                        const nextConsecutiveTaxYears = report.isTaxPayer ? (t.consecutiveTaxYears || 0) + 1 : 0;
                        if (report.isTaxPayer && nextConsecutiveTaxYears > 1) {
                            console.log(`[Financials] ${t.city} Hit with Repeater Tax! Consecutive Years: ${nextConsecutiveTaxYears}`);
                        }

                        // --- NEW FINANCIAL FIX: Pick for Cash Bailout ---
                        // If a team is in extreme debt (-$100M+), they automatically "sell" their highest 1st round pick to the "League Office" (voided) for $15M.
                        let bailoutBonus = 0;
                        let updatedPicks = t.draftPicks || [];
                        if (newCash < -100000000) {
                            const firstRounderIdx = updatedPicks.findIndex(p => p.round === 1 && p.year === prev.date.getFullYear() + 1);
                            if (firstRounderIdx > -1) {
                                console.log(`[Bailout] ${t.city} sold their 1st round pick for $15M relief.`);
                                updatedPicks = updatedPicks.filter((_, idx) => idx !== firstRounderIdx);
                                bailoutBonus = 15000000;
                            }
                        }

                        return {
                            ...t,
                            consecutiveTaxYears: nextConsecutiveTaxYears,
                            cash: newCash + bailoutBonus,
                            draftPicks: updatedPicks,
                            // Update Fans/Owner based on success, not just financials
                            fanInterest: performanceUpdate.newFanInterest,
                            ownerPatience: performanceUpdate.newOwnerPatience,
                            debt: (newCash + bailoutBonus < 0) ? Math.abs(newCash + bailoutBonus) : 0,
                            // Note: Debt handling is simple here - if negative cash, it becomes debt.
                            // Ideally we might zero out cash if negative, but 'cash' field can be negative to represent debt or use separate field.
                            // Let's stick to: Cash can be negative, Debt display handles formatting.

                            salaryCapSpace: calculateTeamCapSpace(t, aiUpdatedContracts, finalSalaryCap),
                            financials: {
                                totalIncome: 0,
                                totalExpenses: 0,
                                dailyIncome: 0,
                                dailyExpenses: 0,
                                seasonHistory: [
                                    ...(t.financials?.seasonHistory || []),
                                    {
                                        year: finishedSeasonYear,
                                        profit: cashChange + bailoutBonus,
                                        revenue: report.totalRevenue + redistributionReceived + bailoutBonus,
                                        payroll: report.payroll,
                                        luxuryTax: report.luxuryTaxPaid
                                    }
                                ]
                            }
                        };
                    });

                    // --- CONSOLIDATED OFFSEASON INITIALIZATION ---
                    // This logic handles aging, contract expiry, retirements, and draft class generation IN ONE GO.
                    
                    // 1. Age everyone and Handle Contracts
                    const updatedContracts: Contract[] = [];
                    const playersWithNewAge = aiUpdatedPlayers.map(p => ({ ...p, age: p.age + 1 }));
                    const teamsWithDraftOrder = [...updatedTeams];

                    prev.contracts.forEach(c => {
                        const player = playersWithNewAge.find(p => p.id === c.playerId);
                        if (c.yearsLeft > 1) {
                            updatedContracts.push({ ...c, yearsLeft: c.yearsLeft - 1 });
                        } else {
                            // Expired - release to free agency
                            if (player) {
                                player.teamId = null;
                                if (!player.acquisition) player.acquisition = { type: 'free_agent', year: finishedSeasonYear };
                                player.acquisition.previousTeamId = c.teamId;

                                const team = teamsWithDraftOrder.find(t => t.id === c.teamId);
                                if (team) {
                                    team.rosterIds = team.rosterIds.filter(id => id !== player.id);
                                    team.salaryCapSpace += c.amount;
                                }
                            }
                        }
                    });

                    // UPDATE AI TEAM STRATEGIES — Re-evaluate each team's direction based on season results
                    const currentSeasonYear = prev.date.getFullYear();
                    teamsWithDraftOrder.forEach((team, idx) => {
                        if (team.id === prev.userTeamId) return; // Don't auto-update user's team
                        const teamRoster = playersWithNewAge.filter(p => p.teamId === team.id);
                        teamsWithDraftOrder[idx] = updateTeamStrategy(team, teamRoster, currentSeasonYear) as typeof teamsWithDraftOrder[0];
                    });

                    // Coach Contract Decrement
                    const updatedCoaches = prev.coaches.map(coach => {
                        if (coach.contract.yearsRemaining > 1) {
                            return { ...coach, contract: { ...coach.contract, yearsRemaining: coach.contract.yearsRemaining - 1 } };
                        } else if (coach.contract.yearsRemaining === 1) {
                            const team = teamsWithDraftOrder.find(t => t.id === coach.teamId);
                            if (team) team.coachId = undefined;
                            return { ...coach, teamId: null, contract: { ...coach.contract, yearsRemaining: 0 } };
                        }
                        return coach;
                    });

                    // 2. RETIREMENT CALCULATION
                    const retiredPlayers: RetiredPlayer[] = [];
                    const retiredIds: string[] = [];
                    const activePlayersAfterRetirement = playersWithNewAge.filter(p => {
                        let shouldRetire = false;
                        if (p.age >= 40) shouldRetire = true;
                        else if (p.age >= 33) {
                            let retireChance = (p.age - 32) * 0.1;
                            if (calculateOverall(p) < 75) retireChance += 0.2;
                            if (Math.random() < retireChance) shouldRetire = true;
                        }

                        if (shouldRetire) {
                            retiredIds.push(p.id);
                            retiredPlayers.push({
                                ...p,
                                ageAtRetirement: p.age,
                                exitYear: finishedSeasonYear,
                                isHallOfFame: checkHallOfFameEligibility(p, updatedAwardsHistory)
                            });
                            return false;
                        }
                        return true;
                    });

                    const finalTeams = teamsWithDraftOrder.map(t => ({
                        ...t,
                        rosterIds: t.rosterIds.filter(id => !retiredIds.includes(id))
                    }));

                    const finalContracts = updatedContracts.filter(c => !retiredIds.includes(c.playerId));

                    // 3. GENERATE DRAFT CLASS
                    const draftClass: Player[] = [];
                    while (draftClass.length < 80) {
                        const tier = Math.random() > 0.8 ? 'star' : (Math.random() > 0.5 ? 'starter' : 'prospect');
                        draftClass.push(generatePlayer(undefined, tier));
                    }

                    // 4. SET DRAFT ORDER (Based on regular season record)
                    const sortedTeamsForDraft = [...finalTeams].sort((a, b) => {
                        const winsA = a.wins || 0;
                        const winsB = b.wins || 0;
                        return winsA - winsB; // Lowest wins = Highest pick
                    });

                    let draftOrder: string[] = [];
                    // Simple 2 rounds
                    [1, 2].forEach(round => {
                        sortedTeamsForDraft.forEach(t => {
                            draftOrder.push(t.id);
                        });
                    });

                    // 5. SCOUTING POINTS
                    const scoutingPoints: Record<string, number> = {};
                    finalTeams.forEach(t => {
                        scoutingPoints[t.id] = (t.wins || 0) < 30 ? 40 : 25;
                    });

                    return {
                        ...prev,
                        players: activePlayersAfterRetirement,
                        contracts: finalContracts,
                        coaches: updatedCoaches,
                        games: [...prev.games, ...newGames],
                        playoffs: updatedPlayoffs,
                        seasonPhase: 'offseason',
                        view: 'offseason_menu',
                        showAwardsModal: 'finals',
                        offseasonTasks: prev.leagueType === 'EURO' ? {
                            retirements: false,
                            scouting: false,
                            coaching: false,
                            draft: false,
                            resigning: false,
                            freeAgency: false,
                            localTalent: false,
                            financials: false,
                            training: false,
                            trainingResults: false,
                            paySalaries: false
                        } : {
                            retirements: false,
                            scouting: false,
                            coaching: false,
                            draft: false,
                            resigning: false,
                            freeAgency: false,
                            training: false,
                            trainingResults: false,
                            paySalaries: false,
                            localTalent: false,
                            financials: false
                        },
                        salaryCap: finalSalaryCap,
                        teams: finalTeams,
                        awardsHistory: updatedAwardsHistory,
                        retiredPlayersHistory: [
                            ...(prev.retiredPlayersHistory || []),
                            { year: finishedSeasonYear, players: retiredPlayers }
                        ],
                        draftClass,
                        draftOrder,
                        scoutingPoints,
                        scoutingReports: {},
                        dailyMatchups: [],
                        pendingUserResult: null
                    };
                } else {
                    // Next Round Logic
                    const getWinner = (id: string) => {
                        const s = updatedPlayoffs.find(s => s.id === id);
                        if (!s || !s.winnerId) {
                            console.error(`[SimDay] Error: Could not find winner for series ${id}`);
                            return 'error_team_id';
                        }
                        return s.winnerId;
                    };
                    const nextRoundSeries: PlayoffSeries[] = [];
                    const conferences = prev.leagueType === 'EURO' ? ['EuroLeague', 'EuroCup'] : ['West', 'East'];

                    if (currentRound === 1) {
                        conferences.forEach(conf => {
                            nextRoundSeries.push({
                                id: `${conf}_2_1`, round: 2, conference: conf as any,
                                homeTeamId: getWinner(`${conf}_1_1`), awayTeamId: getWinner(`${conf}_1_4`), // 1v8 vs 4v5
                                homeWins: 0, awayWins: 0
                            });
                            nextRoundSeries.push({
                                id: `${conf}_2_2`, round: 2, conference: conf as any,
                                homeTeamId: getWinner(`${conf}_1_2`), awayTeamId: getWinner(`${conf}_1_3`), // 2v7 vs 3v6
                                homeWins: 0, awayWins: 0
                            });
                        });
                    } else if (currentRound === 2) {
                        conferences.forEach(conf => {
                            nextRoundSeries.push({
                                id: `${conf}_3_1`, round: 3, conference: conf as any,
                                homeTeamId: getWinner(`${conf}_2_1`), awayTeamId: getWinner(`${conf}_2_2`),
                                homeWins: 0, awayWins: 0
                            });
                        });
                    } else if (currentRound === 3) {
                        if (prev.leagueType === 'EURO') {
                            // Euro leagues finish after Round 3
                            // No Round 4 added, updatedPlayoffs will just be as is
                        } else {
                            nextRoundSeries.push({
                                id: `Finals_4_1`, round: 4, conference: 'Finals',
                                homeTeamId: getWinner('West_3_1'), awayTeamId: getWinner('East_3_1'),
                                homeWins: 0, awayWins: 0
                            });
                        }
                    }
                    updatedPlayoffs = [...updatedPlayoffs, ...nextRoundSeries];
                    
                    if (currentRound === 3 && prev.leagueType === 'EURO') {
                        // Special handling: Go to offseason after Euro Round 3
                        // Wait, simulateDay usually returns a state.
                        // I should handle the phase transition here too if possible, 
                        // but simulateDay's return structure is complex.
                    }
                }
            }

            // Update Players with Injuries from Playoffs
            const playoffUpdatedPlayers = healedPlayers.map(p => {
                // Find any game this player might have been injured in
                // Iterate newGames
                const injuryGame = newGames.find(g => g.injuries.some(i => i.playerId === p.id));
                if (injuryGame) {
                    const injury = injuryGame.injuries.find(i => i.playerId === p.id);
                    return { ...p, injury };
                }
                return p;
            });

            return {
                ...prev,
                date: nextDate,
                games: [...prev.games, ...newGames], // Correctly append games instead of overwriting
                playoffs: updatedPlayoffs,
                players: playoffUpdatedPlayers,
                pendingUserResult: null, // Reset after processing
                dailyMatchups: nextDayMatchups, // Update for next day
            };
        }

        return {
            ...prev,
            date: nextDate,
            players: healedPlayers,
            pendingUserResult: null
        };
    };


    // GM Mode Helper to check goals


    const startMerchCampaign = (campaign: MerchCampaign) => {
        const userTeam = gameState.teams.find(t => t.id === gameState.userTeamId);
        if (userTeam) {
            if (userTeam.cash < campaign.cost) {
                alert("Insufficient funds for this campaign.");
                return;
            }

            const newActiveCampaign: ActiveMerchCampaign = {
                ...campaign,
                id: `${campaign.id}_${Date.now()}`, // Unique ID for this instance
                gamesRemaining: campaign.durationInGames,
                revenueGenerated: 0,
                startDate: gameState.date.toLocaleDateString()
            };

            setGameState(prev => ({
                ...prev,
                teams: prev.teams.map(t =>
                    t.id === userTeam.id
                        ? { ...t, cash: t.cash - campaign.cost }
                        : t
                ),
                activeMerchCampaigns: [...(prev.activeMerchCampaigns || []), newActiveCampaign]
            }));
        }
    };




    const simulateYouthLeague = useCallback(() => {
        setGameState(prev => {
            const newPool = prev.localTalentPool.map(player => {
                const ovr = calculateOverall(player);
                
                // Slow Growth during season
                const growthRate = player.growthTrend === 'generational' ? 0.35 : 
                                  player.growthTrend === 'rapid' ? 0.18 : 
                                  player.growthTrend === 'steady' ? 0.08 : 0.02;
                
                const newAttrs = { ...player.attributes };
                Object.keys(newAttrs).forEach(key => {
                    if (Math.random() < growthRate) {
                        (newAttrs as any)[key] = Math.min(99, (newAttrs as any)[key] + (Math.random() * 0.4));
                    }
                });

                const newGame = {
                    pts: (ovr / 4) + (Math.random() * 12),
                    reb: (ovr / 10) + (Math.random() * 6),
                    ast: (ovr / 12) + (Math.random() * 5),
                    fgp: 35 + (Math.random() * 25),
                    date: new Date(prev.date)
                };

                const newLast10 = [newGame, ...player.youthStats?.last10 || []].slice(0, 10);
                const performance = (newGame.pts + newGame.reb + newGame.ast);
                const newHype = Math.min(100, Math.max(0, player.hype + (performance > 25 ? 0.8 : -0.3)));

                return {
                    ...player,
                    attributes: newAttrs,
                    hype: newHype,
                    youthStats: {
                        last10: newLast10,
                        seasonAvg: {
                            pts: newLast10.reduce((s, g) => s + g.pts, 0) / newLast10.length,
                            reb: newLast10.reduce((s, g) => s + g.reb, 0) / newLast10.length,
                            ast: newLast10.reduce((s, g) => s + g.ast, 0) / newLast10.length
                        }
                    }
                };
            });

            if (newPool.length < 30) {
                const needed = 30 - newPool.length;
                const additions = generateLocalTalentPool(needed);
                return { ...prev, localTalentPool: [...newPool, ...additions] };
            }

            return { ...prev, localTalentPool: newPool };
        });
    }, []);

    const advanceDay = async () => {
        // If in Free Agency, redirect relative to context
        // But usually advanceDay handles Regular/Playoffs
        // We will create a button for Free Agency specifically or hook it here
        if (gameState.seasonPhase === 'free_agency') {
            advanceFreeAgencyDay();
            return;
        }

        setGameState(prev => {
            // Process Merch Campaigns immediately before sim
            let merchRevenue = 0;
            let updatedCampaigns = prev.activeMerchCampaigns || [];
            const messages: Message[] = [];

            const userTeam = prev.teams.find(t => t.id === prev.userTeamId);
            if (userTeam) {
                const merchResult = processMerchCampaigns(userTeam, updatedCampaigns);
                merchRevenue = merchResult.dailyRevenue;
                updatedCampaigns = merchResult.updatedCampaigns;

                merchResult.messages.forEach(msg => {
                    messages.push({
                        id: generateUUID(),
                        date: prev.date,
                        title: 'Merch Campaign Update',
                        text: msg,
                        type: 'success',
                        read: false
                    });
                });
            }

            // Update user team cash with revenue immediately (simplification)
            let updatedTeams = prev.teams;
            if (merchRevenue > 0) {
                updatedTeams = prev.teams.map(t =>
                    t.id === prev.userTeamId
                        ? { ...t, cash: t.cash + merchRevenue }
                        : t
                );
            }

            return {
                ...prev,
                teams: updatedTeams,
                activeMerchCampaigns: updatedCampaigns,
                messages: [...messages, ...prev.messages],
                isProcessing: true
            };
        });

        setTimeout(() => {
            setGameState(prev => {
                let currentState = prev;
                let loopCount = 0;
                const maxLoops = 14; // Failsafe (NBA teams play every 2-4 days usually)

                while (loopCount < maxLoops) {
                    const dayBefore = currentState.seasonGamesPlayed;

                    currentState = simulateDay(currentState);
                    loopCount++;

                    const _maxGames = currentState.leagueType === 'EURO' ? 38 : 82;

                    // Stop if a round was advanced, or season ended
                    if (currentState.seasonGamesPlayed > dayBefore || currentState.seasonPhase !== 'regular_season' || currentState.seasonGamesPlayed >= _maxGames) {
                        break;
                    }
                }

                return {
                    ...currentState,
                    isProcessing: false
                };
            });
        }, 100);
    };

    const simulateToTradeDeadline = () => {
        setSimTarget('deadline');
    };

    const runAutoPlayoffs = () => {
        console.log("[Debug] runAutoPlayoffs invoked. Setting target to playoffs_end");
        setGameState(prev => ({ ...prev })); // Force re-render
        setTimeout(() => setSimTarget('playoffs_end'), 10);
    };

    const simulateRound = () => {
        // 1. AUTO-REPAIR: Check if we are in playoffs but missing data
        let currentPlayoffs = gameState.playoffs;
        let currentPhase = gameState.seasonPhase;

        // If playoffs are empty, REGENERATE immediately
        if (currentPhase.includes('playoffs') && (!currentPlayoffs || currentPlayoffs.length === 0)) {
            console.warn("[SimRound] Empty Playoffs detected. Regenerating...");

            const conferences = gameState.leagueType === 'EURO' ? ['EuroLeague', 'EuroCup'] : ['West', 'East'];
            
            const createSeries = (round: number, conf: string): PlayoffSeries[] => {
                const confTeams = gameState.teams.filter(t => t.conference === conf).sort((a, b) => b.wins - a.wins);
                const series: PlayoffSeries[] = [];
                const matchups = [[0, 7], [1, 6], [2, 5], [3, 4]];

                matchups.forEach((m, idx) => {
                    const home = confTeams[m[0]];
                    const away = confTeams[m[1]];
                    if (home && away) {
                        series.push({
                            id: `${conf}_1_${idx + 1}`,
                            round: 1,
                            conference: conf as any,
                            homeTeamId: home.id,
                            awayTeamId: away.id,
                            homeWins: 0,
                            awayWins: 0
                        });
                    }
                });
                return series;
            };

            const allSeries: PlayoffSeries[] = [];
            conferences.forEach(c => allSeries.push(...createSeries(1, c)));
            currentPlayoffs = allSeries;
            currentPhase = 'playoffs_r1'; // Force granularity

            // Commit the repair immediately so the loop sees it
            setGameState(prev => ({
                ...prev,
                seasonPhase: 'playoffs_r1', // Force correct type
                playoffs: currentPlayoffs
            }));
            return; // Exit and let state update propagate
        }
        // 2. BACK COMPATIBILITY: Update 'playoffs' -> 'playoffs_rX'
        else if ((currentPhase as string) === 'playoffs') {
            const maxRound = Math.max(...currentPlayoffs.map(s => s.round), 1);
            const newPhase = maxRound === 4 ? 'playoffs_finals' : `playoffs_r${maxRound}`;
            console.log(`[SimRound] upgrading phase 'playoffs' to '${newPhase}'`);

            // Update logic only without triggering sim yet
            setGameState(prev => ({ ...prev, seasonPhase: newPhase as any }));
            return;
        }

        // 3. SYNCHRONOUS SIMULATION (wrapped in async)
        if (!confirm("Simulate rest of the round instantly?")) return;

        setGameState(prev => ({ ...prev, isProcessing: true }));

        setTimeout(() => {
            setGameState(prev => {
                console.log("Starting Sync Sim...");
                let stateGames = [...prev.games];
                const stateTeams = [...prev.teams];
                const statePlayers = [...prev.players];
                let date = new Date(prev.date);
                let currentPlayoffs = prev.playoffs.map(s => ({ ...s }));
                let currentPhase = prev.seasonPhase;

                // RE-IDENTIFY ROUND
                const roundToSim = Math.max(...currentPlayoffs.map(s => s.round), 1);
                const activeSeries = currentPlayoffs.filter(s => s.round === roundToSim);
                console.log(`[SimRound - Sync] Processing Round ${roundToSim}. Active Series: ${activeSeries.length}`);

                activeSeries.forEach(series => {
                    if (series.winnerId) return;

                    let homeWins = series.homeWins;
                    let awayWins = series.awayWins;
                    const homeTeam = stateTeams.find(t => t.id === series.homeTeamId);
                    const awayTeam = stateTeams.find(t => t.id === series.awayTeamId);

                    if (!homeTeam || !awayTeam) return;

                    const winsNeeded = prev.leagueType === 'EURO' ? (series.round === 1 ? 3 : 1) : 4;

                    while (homeWins < winsNeeded && awayWins < winsNeeded) {
                        const gameNum = homeWins + awayWins;
                        const isHomeCourt = [0, 1, 4, 6].includes(gameNum);

                        // Advance date slightly per game
                        date.setDate(date.getDate() + 1);

                        const p1 = isHomeCourt ? homeTeam : awayTeam;
                        const p2 = isHomeCourt ? awayTeam : homeTeam;

                        const p1Roster = statePlayers.filter(p => p.teamId === p1.id);
                        const p2Roster = statePlayers.filter(p => p.teamId === p2.id);

                        // Simulate Match
                        const result = simulateMatch({
                            homeTeam: p1,
                            awayTeam: p2,
                            homeRoster: p1Roster,
                            awayRoster: p2Roster,
                            date: new Date(date),
                            userTeamId: gameState.userTeamId
                        });
                        stateGames.push(result);

                        if (result.winnerId === series.homeTeamId) homeWins++;
                        else awayWins++;

                        // --- AGGREGATE PLAYOFF STATS ---
                        const gamePlayers = [
                            ...Object.values(result.boxScore.homeStats),
                            ...Object.values(result.boxScore.awayStats)
                        ];

                        gamePlayers.forEach(stat => {
                            if (stat.minutes === 0) return;
                            const pIndex = statePlayers.findIndex(p => p.id === stat.playerId);
                            if (pIndex !== -1) {
                                const p = statePlayers[pIndex];
                                const currentStats = p.playoffStats || {
                                    gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                                    steals: 0, blocks: 0, turnovers: 0, fouls: 0, plusMinus: 0,
                                    fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
                                    ftMade: 0, ftAttempted: 0, offensiveRebounds: 0, defensiveRebounds: 0,
                                    rimMade: 0, rimAttempted: 0, rimAssisted: 0,
                                    midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
                                    threePointAssisted: 0
                                };

                                statePlayers[pIndex] = {
                                    ...p,
                                    playoffStats: {
                                        ...currentStats,
                                        gamesPlayed: (currentStats.gamesPlayed || 0) + 1,
                                        minutes: (currentStats.minutes || 0) + stat.minutes,
                                        points: (currentStats.points || 0) + stat.points,
                                        rebounds: (currentStats.rebounds || 0) + stat.rebounds,
                                        assists: (currentStats.assists || 0) + stat.assists,
                                        steals: (currentStats.steals || 0) + stat.steals,
                                        blocks: (currentStats.blocks || 0) + stat.blocks,
                                        turnovers: (currentStats.turnovers || 0) + (stat.turnovers || 0),
                                        fgMade: (currentStats.fgMade || 0) + (stat.fgMade || 0),
                                        fgAttempted: (currentStats.fgAttempted || 0) + (stat.fgAttempted || 0),
                                        threeMade: (currentStats.threeMade || 0) + (stat.threeMade || 0),
                                        threeAttempted: (currentStats.threeAttempted || 0) + (stat.threeAttempted || 0),
                                        ftMade: (currentStats.ftMade || 0) + (stat.ftMade || 0),
                                        ftAttempted: (currentStats.ftAttempted || 0) + (stat.ftAttempted || 0),
                                        offensiveRebounds: (currentStats.offensiveRebounds || 0) + (stat.offensiveRebounds || 0),
                                        defensiveRebounds: (currentStats.defensiveRebounds || 0) + (stat.defensiveRebounds || 0),
                                        fouls: (currentStats.fouls || 0) + (stat.personalFouls || 0),
                                        rimMade: (currentStats.rimMade || 0) + (stat.rimMade || 0),
                                        rimAttempted: (currentStats.rimAttempted || 0) + (stat.rimAttempted || 0),
                                        midRangeMade: (currentStats.midRangeMade || 0) + (stat.midRangeMade || 0),
                                        midRangeAttempted: (currentStats.midRangeAttempted || 0) + (stat.midRangeAttempted || 0),
                                        rimAssisted: (currentStats.rimAssisted || 0) + (stat.rimAssisted || 0),
                                        midRangeAssisted: (currentStats.midRangeAssisted || 0) + (stat.midRangeAssisted || 0),
                                        threePointAssisted: (currentStats.threePointAssisted || 0) + (stat.threePointAssisted || 0)
                                    }
                                };
                            }
                        });
                    }

                    series.homeWins = homeWins;
                    series.awayWins = awayWins;
                    series.winnerId = homeWins >= winsNeeded ? series.homeTeamId : series.awayTeamId;
                });

                // 4. GENERATE NEXT ROUND
                let nextPhase = currentPhase;
                const getWinner = (id: string) => currentPlayoffs.find(s => s.id === id)?.winnerId!;
                const nextRoundSeries: PlayoffSeries[] = [];
                const conferences = prev.leagueType === 'EURO' ? ['EuroLeague', 'EuroCup'] : ['West', 'East'];

                if (roundToSim === 1) {
                    nextPhase = 'playoffs_r2';
                    conferences.forEach(conf => {
                        nextRoundSeries.push({
                            id: `${conf}_2_1`, round: 2, conference: conf as any,
                            homeTeamId: getWinner(`${conf}_1_1`), awayTeamId: getWinner(`${conf}_1_4`),
                            homeWins: 0, awayWins: 0
                        });
                        nextRoundSeries.push({
                            id: `${conf}_2_2`, round: 2, conference: conf as any,
                            homeTeamId: getWinner(`${conf}_1_2`), awayTeamId: getWinner(`${conf}_1_3`),
                            homeWins: 0, awayWins: 0
                        });
                    });
                } else if (roundToSim === 2) {
                    nextPhase = 'playoffs_r3';
                    conferences.forEach(conf => {
                        nextRoundSeries.push({
                            id: `${conf}_3_1`, round: 3, conference: conf as any,
                            homeTeamId: getWinner(`${conf}_2_1`), awayTeamId: getWinner(`${conf}_2_2`),
                            homeWins: 0, awayWins: 0
                        });
                    });
                } else if (roundToSim === 3) {
                    if (prev.leagueType === 'EURO') {
                        nextPhase = 'offseason';
                    } else {
                        nextPhase = 'playoffs_finals';
                        nextRoundSeries.push({
                            id: `Finals_4_1`, round: 4, conference: 'Finals',
                            homeTeamId: getWinner(`West_3_1`),
                            awayTeamId: getWinner(`East_3_1`),
                            homeWins: 0, awayWins: 0
                        });
                    }
                } else if (roundToSim === 4) {
                    // --- REPLICATED END OF FINALS LOGIC FOR SYNC SIM ---
                    const finishedSeasonYear = date.getFullYear();
                    const finalsSeries = currentPlayoffs.find(s => s.round === 4 && s.winnerId);
                    
                    if (finalsSeries && finalsSeries.winnerId) {
                        const championId = finalsSeries.winnerId;
                        const championTeam = stateTeams.find(t => t.id === championId)!;
                        const finalsMvp = calculateFinalsMvp(statePlayers, stateGames, championId, currentPlayoffs);

                        const updatedAwardsHistory = [...prev.awardsHistory];
                        const historyIndex = updatedAwardsHistory.findIndex(h => h.year === finishedSeasonYear);
                        const championInfo = { teamId: championTeam.id, teamName: championTeam.name };

                        if (historyIndex !== -1) {
                            updatedAwardsHistory[historyIndex] = { ...updatedAwardsHistory[historyIndex], champion: championInfo, finalsMvp };
                        } else {
                            const regularSeasonAwards = calculateRegularSeasonAwards(statePlayers, stateTeams, finishedSeasonYear);
                            updatedAwardsHistory.push({ ...regularSeasonAwards, champion: championInfo, finalsMvp });
                        }

                        // Aging & Contracts
                        let archivedPlayers: Player[] = statePlayers.map(p => {
                            const newCareerStat = { ...p.seasonStats, season: finishedSeasonYear, teamId: p.teamId || 'FA', overall: p.overall };
                            const newCareerStats = [...(p.careerStats || []), newCareerStat];
                            if (p.playoffStats && p.playoffStats.gamesPlayed > 0) {
                                newCareerStats.push({ ...p.playoffStats, season: finishedSeasonYear, teamId: p.teamId || 'FA', overall: p.overall, isPlayoffs: true });
                            }
                            return checkTradeRequests({
                                ...p,
                                careerStats: newCareerStats,
                                seasonStats: {
                                    gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
                                    turnovers: 0, offensiveRebounds: 0, defensiveRebounds: 0, fouls: 0,
                                    fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0, ftMade: 0, ftAttempted: 0, plusMinus: 0,
                                    rimMade: 0, rimAttempted: 0, rimAssisted: 0,
                                    midRangeMade: 0, midRangeAttempted: 0, midRangeAssisted: 0,
                                    threePointAssisted: 0
                                },
                                playoffStats: undefined,
                                injury: undefined
                            });
                        });

                        // Financials
                        const aiUpdatedContracts = [...prev.contracts];
                        const teamReportsMap: Record<string, any> = {};
                        stateTeams.forEach(t => {
                            const teamContracts = aiUpdatedContracts.filter(c => c.teamId === t.id);
                            teamReportsMap[t.id] = calculateAnnualFinancials(t, teamContracts, prev.salaryCap, LUXURY_TAX_THRESHOLD, t.consecutiveTaxYears || 0);
                        });

                        const leagueFinancials = calculateLeagueFinancials(stateTeams, prev.salaryCap, teamReportsMap);
                        const finalSalaryCap = leagueFinancials.newSalaryCap;
                        const distributionPerTeam = leagueFinancials.payoutPerTeam;

                        const updatedTeams = stateTeams.map(t => {
                            const report = teamReportsMap[t.id];
                            let result: SeasonResult = 'MISSED_PLAYOFFS';
                            const teamInPlayoffs = currentPlayoffs.some(s => s.homeTeamId === t.id || s.awayTeamId === t.id);
                            if (!teamInPlayoffs) {
                                const sortedTeams = [...stateTeams].sort((a, b) => a.wins - b.wins);
                                if (sortedTeams.findIndex(st => st.id === t.id) < 5) result = 'BOTTOM_5';
                            } else {
                                if (finalsSeries.winnerId === t.id) result = 'CHAMPION';
                                else if (finalsSeries.homeTeamId === t.id || finalsSeries.awayTeamId === t.id) result = 'FINALS_LOSS';
                                else result = 'PLAYOFFS_EARLY_EXIT';
                            }

                            const roster = archivedPlayers.filter(p => p.teamId === t.id);
                            const teamContracts = aiUpdatedContracts.filter(c => c.teamId === t.id);
                            const expectation = calculateExpectation(t, roster, stateTeams, teamContracts);
                            const performanceUpdate = evaluateSeasonPerformance(t, result, expectation, teamContracts, report.totalRevenue);

                            let cashChange = report.totalRevenue;
                            if (report.isTaxPayer) cashChange -= report.luxuryTaxPaid;
                            else if (report.payroll <= prev.salaryCap) cashChange += distributionPerTeam;

                            const newCash = t.cash + cashChange;
                            return {
                                ...t,
                                consecutiveTaxYears: report.isTaxPayer ? (t.consecutiveTaxYears || 0) + 1 : 0,
                                cash: newCash,
                                fanInterest: performanceUpdate.newFanInterest,
                                ownerPatience: performanceUpdate.newOwnerPatience,
                                debt: newCash < 0 ? Math.abs(newCash) : 0,
                                salaryCapSpace: calculateTeamCapSpace(t, aiUpdatedContracts, finalSalaryCap),
                                financials: {
                                    totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0,
                                    seasonHistory: [...(t.financials?.seasonHistory || []), { year: finishedSeasonYear, profit: cashChange, revenue: report.totalRevenue, payroll: report.payroll, luxuryTax: report.luxuryTaxPaid }]
                                }
                            };
                        });

                        // Retirement & Draft Class
                        const retiredPlayers: RetiredPlayer[] = [];
                        const retiredIds: string[] = [];
                        const playersAfterRetirement = archivedPlayers.filter(p => {
                            const newAgeP = { ...p, age: p.age + 1 };
                            let shouldRetire = newAgeP.age >= 40 || (newAgeP.age >= 33 && Math.random() < (newAgeP.age - 32) * 0.1);
                            if (shouldRetire) {
                                retiredIds.push(p.id);
                                retiredPlayers.push({ ...newAgeP, ageAtRetirement: newAgeP.age, exitYear: finishedSeasonYear, isHallOfFame: checkHallOfFameEligibility(newAgeP, updatedAwardsHistory) });
                                return false;
                            }
                            return true;
                        }).map(p => ({ ...p, age: p.age + 1 }));

                        const draftClass: Player[] = [];
                        while (draftClass.length < 80) draftClass.push(generatePlayer(undefined, Math.random() > 0.8 ? 'star' : 'prospect'));

                        const finalTeams = updatedTeams.map(t => ({ ...t, rosterIds: t.rosterIds.filter(id => !retiredIds.includes(id)) }));

                        return {
                            ...prev,
                            players: playersAfterRetirement,
                            contracts: prev.contracts.filter(c => !retiredIds.includes(c.playerId)),
                            teams: finalTeams,
                            games: stateGames,
                            playoffs: currentPlayoffs,
                            seasonPhase: 'offseason',
                            view: 'offseason_menu',
                            showAwardsModal: 'finals',
                            awardsHistory: updatedAwardsHistory,
                            retiredPlayersHistory: [...(prev.retiredPlayersHistory || []), { year: finishedSeasonYear, players: retiredPlayers }],
                            draftClass,
                            draftOrder: [...finalTeams].sort((a, b) => a.wins - b.wins).map(t => t.id).concat([...finalTeams].sort((a, b) => a.wins - b.wins).map(t => t.id)),
                            offseasonTasks: { retirements: false, scouting: false, coaching: false, draft: false, resigning: false, freeAgency: false, localTalent: false, financials: false, training: false, trainingResults: false, paySalaries: false },
                            date: date,
                            isProcessing: false
                        };
                    }
                    nextPhase = 'offseason';
                }

                return {
                    ...prev,
                    seasonPhase: nextPhase as any,
                    playoffs: [...currentPlayoffs, ...nextRoundSeries],
                    games: stateGames,
                    date: date,
                    isProcessing: false
                };
            });
        }, 100);
        setSimTarget('none');
        setTargetRound(null);
    };

    // Ref-based toggle for immediate interruption
    const simTargetRef = useRef<'none' | 'deadline' | 'playoffs' | 'playoffs_end' | 'round'>(simTarget);
    useEffect(() => {
        simTargetRef.current = simTarget;
    }, [simTarget]);


    // ASYNC SIMULATION LOOP
    React.useEffect(() => {
        if (simTarget === 'none') {
            return;
        }

        const runSimStep = () => {
            // IMMEDIATE STOP CHECK VIA REF (Bypasses closure staleness)
            if (simTargetRef.current === 'none') {
                return;
            }

            setGameState(prev => {
                // Double check target in state just in case
                if (simTargetRef.current === 'none') return prev;

                // STOP CONDITIONS — use simTargetRef.current to avoid stale closure
                const currentTarget = simTargetRef.current;

                if (currentTarget === 'deadline') {
                    // Stop at trade deadline (half-season: 19 for Euro, 40 for NBA)
                    const deadlineGame = prev.leagueType === 'EURO' ? 19 : 40;
                    if (prev.seasonGamesPlayed >= deadlineGame || prev.seasonPhase !== 'regular_season') {
                        setSimTarget('none');
                        return prev;
                    }
                } else if (currentTarget === 'playoffs') {
                    // Stop when all match-days are done (38 for Euro, 82 for NBA)
                    const seasonLen = prev.leagueType === 'EURO' ? 38 : 82;
                    if (prev.seasonGamesPlayed >= seasonLen || prev.seasonPhase !== 'regular_season') {
                        setSimTarget('none');
                        return prev;
                    }
                } else if (currentTarget === 'playoffs_end') {
                    // Stop if we are NO LONGER in playoffs (e.g. reached Draft, Offseason, etc)
                    if (!prev.seasonPhase.startsWith('playoffs')) {
                        setSimTarget('none');
                        return prev;
                    }
                }

                // FAILSAFE: If not in a playable phase, stop sim
                if (prev.seasonPhase === 'offseason' || prev.seasonPhase === 'pre_season' || prev.seasonPhase === 'draft' || prev.seasonPhase === 'resigning' || prev.seasonPhase === 'free_agency') {
                    setSimTarget('none');
                    return prev;
                }

                try {
                    console.log(`[SimLoop] Simulating Day... Target: ${simTarget}, Phase: ${prev.seasonPhase}`);
                    return simulateDay(prev);
                } catch (e) {
                    console.error("[SimLoop] CRASH in simulateDay:", e);
                    setSimTarget('none');
                    return prev;
                }
            });

            // Schedule next step only if we haven't stopped
            if ((simTargetRef.current as string) !== 'none') {
                timer = setTimeout(runSimStep, 50); // Reduced delay for faster UI, but still async
            }
        };

        const safeRunSimStep = () => {
            try {
                runSimStep();
            } catch (e) {
                console.error("Simulation Loop Crashed:", e);
                setSimTarget('none');
            }
        };

        let timer = setTimeout(safeRunSimStep, 50);

        return () => clearTimeout(timer);
    }, [simTarget, gameState.date, gameState.seasonPhase]);


    const updateTeamHierarchy = (teamId: string, hierarchy: Record<string, number>) => {
        setGameState(prev => ({
            ...prev,
            teams: prev.teams.map(t => t.id === teamId ? { ...t, hierarchy } : t)
        }));
    };

    const updateRotation = (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[]) => {
        setGameState(prev => ({
            ...prev,
            players: prev.players.map(p => {
                const update = updates.find(u => u.id === p.id);
                if (update) {
                    return { ...p, minutes: update.minutes, isStarter: update.isStarter, rotationIndex: update.rotationIndex };
                }
                return p;
            })
        }));
    };

    const finishExpansionDraft = (selectedPlayerIds: string[]) => {
        setGameState(prev => {
            let updatedPlayers = [...prev.players];
            let updatedTeams = prev.teams.map(t => ({ ...t, rosterIds: [...t.rosterIds] }));
            const userTeamId = prev.userTeamId;

            // 1. Process Selected Players (Join User Team)
            selectedPlayerIds.forEach(id => {
                const pIndex = updatedPlayers.findIndex(p => p.id === id);
                if (pIndex !== -1) {
                    updatedPlayers[pIndex] = { ...updatedPlayers[pIndex], teamId: userTeamId };
                }
            });

            // 2. Process Unselected Players (Return to Original Team via Contract)
            // CRITICAL FIX: Ensure they go back to original teams
            const poolIds = prev.expansionPool.map(p => p.id);
            const unselectedIds = poolIds.filter(id => !selectedPlayerIds.includes(id));

            console.log(`[Expansion] Returning ${unselectedIds.length} players to original teams...`);

            unselectedIds.forEach(id => {
                const pIndex = updatedPlayers.findIndex(p => p.id === id);
                if (pIndex !== -1) {
                    const contract = prev.contracts.find(c => c.playerId === id);
                    if (contract) {
                        // Restore Team ID
                        updatedPlayers[pIndex] = { ...updatedPlayers[pIndex], teamId: contract.teamId };

                        // Restore to Roster
                        const originalTeam = updatedTeams.find(t => t.id === contract.teamId);
                        if (originalTeam) {
                            if (!originalTeam.rosterIds.includes(id)) {
                                originalTeam.rosterIds.push(id);
                            }
                        }
                    } else {
                        // If no contract, remain Free Agent (teamId: null)
                        console.warn(`[Expansion] Player ${updatedPlayers[pIndex].lastName} has no contract. Remaining Free Agent.`);
                    }
                }
            });

            // 3. Update Contracts for Selected Players (Now belong to User)
            const updatedContracts = prev.contracts.map(c => {
                if (selectedPlayerIds.includes(c.playerId)) {
                    return { ...c, teamId: userTeamId };
                }
                return c;
            });

            // 4. Update User Roster
            const userTeam = updatedTeams.find(t => t.id === userTeamId);
            if (userTeam) {
                // Add only new IDs to avoid duplicates
                selectedPlayerIds.forEach(id => {
                    if (!userTeam.rosterIds.includes(id)) {
                        userTeam.rosterIds.push(id);
                    }
                });
            }

            // Recalculate Caps
            updatedTeams = updatedTeams.map(t => {
                const cap = calculateTeamCapSpace(t, updatedContracts, 140000000);
                return { ...t, salaryCapSpace: cap };
            });

            return {
                ...prev,
                players: updatedPlayers,
                teams: updatedTeams,
                contracts: updatedContracts,
                expansionPool: [], // Clear pool
                seasonPhase: 'regular_season' // Move to Start of Season
            };
        });
    };

    const updateCoachSettings = (teamId: string, settings: TeamStrategy) => {
        setGameState(prev => ({
            ...prev,
            teams: prev.teams.map(t =>
                t.id === teamId ? { ...t, tactics: settings } : t
            )
        }));
    };



    const spendScoutingPoints = (prospectId: string, points: number) => {
        setGameState(prev => {
            const currentPoints = prev.scoutingPoints[prev.userTeamId] || 0;
            if (currentPoints < points) return prev;

            // Update Report
            const teamReports = prev.scoutingReports[prev.userTeamId] || {};
            const currentReport = teamReports[prospectId] || { points: 0, isPotentialRevealed: false };

            const newTotal = currentReport.points + points;
            const newIsRevealed = newTotal >= 30; // Threshold to reveal

            return {
                ...prev,
                scoutingPoints: {
                    ...prev.scoutingPoints,
                    [prev.userTeamId]: currentPoints - points
                },
                scoutingReports: {
                    ...prev.scoutingReports,
                    [prev.userTeamId]: {
                        ...teamReports,
                        [prospectId]: { points: newTotal, isPotentialRevealed: newIsRevealed }
                    }
                }
            };
        });
    };

    const endScoutingPhase = () => {
        completeOffseasonTask('coaching');
        processAiGMFiring();
    };

    const updateRotationSchedule = (teamId: string, schedule: RotationSegment[]) => {
        setGameState(prev => ({
            ...prev,
            teams: prev.teams.map(t =>
                t.id === teamId ? { ...t, rotationSchedule: schedule } : t
            )
        }));
    };

    // --- SAVE / LOAD SYSTEM ---
    // --- SAVE / LOAD SYSTEM ---
    const saveGame = async (slotId: number, silent: boolean = false) => {
        try {
            const currentState = gameStateRef.current;
            const userTeam = currentState.teams.find(t => t.id === currentState.userTeamId);
            const teamName = userTeam ? `${userTeam.city} ${userTeam.name}` : 'Unknown Team';

            const metadata: SaveMeta = {
                teamName,
                date: formatDate(currentState.date),
                seasonPh: currentState.seasonPhase.replace('_', ' ').toUpperCase(),
                timestamp: Date.now()
            };

            // Save basic metadata to localStorage for quick access (keep it light)
            localStorage.setItem(`save_meta_${slotId}`, JSON.stringify(metadata));
            // Mark slot as occupied
            localStorage.setItem(`save_slot_${slotId}`, 'true');

            // Save full Game State to IndexedDB
            await saveToDB(slotId, currentState, metadata);

        } catch (error) {
            console.error("Save Failed:", error);
            alert("Save Failed: " + (error instanceof Error ? error.message : String(error)));
        }
    };

    const loadGame = async (slotId: number): Promise<boolean> => {
        try {
            // Load from IndexedDB
            const record = await loadFromDB(slotId);

            if (!record || !record.data) {
                console.error("No save data found in IndexedDB for slot", slotId);
                return false;
            }

            const loadedState: GameState = record.data;

            // Reconstruct Date objects (JSON/IDB serialization of Date varies, usually comes back as String or Date object depending on IDB wrapper, but pure IDB clones structured data. However, let's be safe if it was JSONified before or during transition)
            // Actually, Structured Clone algorithm in IDB supports Date objects natively! 
            // BUT, if we passed it as a plain JS object that *was* JSON.stringified somewhere, it would be a string. 
            // My saveToDB takes `data: any`. If `gameState` has Date objects, IDB stores them as Dates.
            // So `loadedState.date` should be a Date object if IDB works as expected.
            // valid sanity check:
            if (typeof loadedState.date === 'string') {
                loadedState.date = new Date(loadedState.date);
            }

            // Reconstruct Trade Dates
            if (loadedState.tradeHistory) {
                loadedState.tradeHistory = loadedState.tradeHistory.map((t: any) => ({
                    ...t,
                    date: new Date(t.date)
                }));
            }

            // Reconstruct News Dates
            if (loadedState.news) {
                loadedState.news = loadedState.news.map((n: any) => ({
                    ...n,
                    date: new Date(n.date)
                }));
            }

            // Reconstruct Transactions Dates
            if (loadedState.transactions) {
                loadedState.transactions = loadedState.transactions.map((t: any) => ({
                    ...t,
                    date: new Date(t.date)
                }));
            }

            // Reconstruct Messages Dates
            if (loadedState.messages) {
                loadedState.messages = loadedState.messages.map((m: any) => ({
                    ...m,
                    date: new Date(m.date)
                }));
            }

            // Reconstruct Games Dates
            if (loadedState.games) {
                loadedState.games = loadedState.games.map((g: any) => ({
                    ...g,
                    date: new Date(g.date)
                }));
            }

            // Ensure settings exist
            if (!loadedState.settings) {
                loadedState.settings = { difficulty: 'Medium', showLoveForTheGame: true };
            }
            if (!loadedState.settings.difficulty) loadedState.settings.difficulty = 'Medium';

            // Polyfill Financial Data if missing (same as before)
            if (loadedState.teams) {
                loadedState.teams = loadedState.teams.map((t: any) => {
                    if (t.cash !== undefined) return t;
                    const defaultTeam = NBA_TEAMS.find(def => def.id === t.id);
                    return {
                        ...t,
                        cash: defaultTeam?.cash || 200000000,
                        debt: defaultTeam?.debt || 0,
                        fanInterest: defaultTeam?.fanInterest || 1.0,
                        ownerPatience: defaultTeam?.ownerPatience || 60,
                        marketSize: defaultTeam?.marketSize || 'Medium',
                        financials: t.financials || { totalIncome: 0, totalExpenses: 0, dailyIncome: 0, dailyExpenses: 0, seasonHistory: [] }
                    };
                });
            }

            // MIGRATION: Backfill Dual Positions (Secondary Position)
            if (loadedState.players) {
                loadedState.players.forEach(p => {
                    if (!p.secondaryPosition && p.tendencies) {
                        p.secondaryPosition = calculateSecondaryPosition(p);
                    }
                    if (!p.secondaryPosition && !p.tendencies) {
                        // Fallback for ANCIENT saves without tendencies (v0.1)
                        // Create default tendencies temporarily just to calc position
                        const tempP = { ...p, tendencies: { shooting: 50, passing: 50, inside: 50, outside: 50, defensiveAggression: 50, foulTendency: 50 } };
                        p.secondaryPosition = calculateSecondaryPosition(tempP);
                    }
                });
            }

            // MIGRATION: Always regenerate schedules on load to fix stale/wrong schedules from old saves
            if (loadedState.seasonPhase === 'regular_season') {
                if (loadedState.leagueType === 'EURO') {
                    // Always rebuild Euro schedule (old saves had wrong interleaved version)
                    const elTeams = (loadedState.teams || []).filter((t: any) => t.conference === 'EuroLeague');
                    const ecTeams = (loadedState.teams || []).filter((t: any) => t.conference === 'EuroCup');
                    const elRounds = generateEuroSchedule(elTeams);
                    const ecRounds = generateEuroSchedule(ecTeams);
                    const totalRounds = Math.max(elRounds.length, ecRounds.length);
                    const rebuilt: { homeId: string; awayId: string }[][] = [];
                    for (let i = 0; i < totalRounds; i++) {
                        rebuilt.push([...(elRounds[i] || []), ...(ecRounds[i] || [])]);
                    }
                    loadedState.euroSchedule = rebuilt;
                    const nextRound = loadedState.seasonGamesPlayed || 0;
                    loadedState.dailyMatchups = nextRound < rebuilt.length ? rebuilt[nextRound] : [];
                    console.log(`[LoadGame] Rebuilt Euro schedule: ${rebuilt.length} rounds, at round ${nextRound}.`);
                } else {
                    // Always rebuild NBA schedule to fix the circle method bug
                    const rebuilt = generate82GameSchedule(loadedState.teams || []);
                    loadedState.nbaSchedule = rebuilt;
                    const nextRound = loadedState.seasonGamesPlayed || 0;
                    loadedState.dailyMatchups = nextRound < rebuilt.length ? rebuilt[nextRound] : [];
                    console.log(`[LoadGame] Rebuilt NBA schedule: ${rebuilt.length} rounds, at round ${nextRound}.`);
                }
            }

            setGameState({
                ...loadedState,
                leagueType: loadedState.leagueType || 'NBA',
                competitionType: loadedState.competitionType || 'NBA',
                currentSaveSlot: slotId
            });

            console.log(`Game Loaded from Slot ${slotId}`);
            return true;
        } catch (error) {
            console.error("Load Failed:", error);
            return false;
        }
    };

    const deleteSave = async (slotId: number) => {
        localStorage.removeItem(`save_slot_${slotId}`);
        localStorage.removeItem(`save_meta_${slotId}`);
        await deleteFromDB(slotId);
    };


    const acceptTradeOffer = () => {
        if (!gameState.tradeOffer) return;

        // Handle SimulatedTradeProposal (contains asset objects) vs TradeProposal (ids)
        if ('proposerAssets' in gameState.tradeOffer) {
            // SimulatedTradeProposal
            const offer = gameState.tradeOffer as any; // Type assertion since types are mixed in union or complex
            const { proposerId, targetAssets, proposerAssets } = offer;

            // Extract IDs
            const userPlayerIds = targetAssets.players.map((p: any) => p.id);
            const userPickIds = targetAssets.picks.map((p: any) => p.id);
            const aiPlayerIds = proposerAssets.players.map((p: any) => p.id);
            const aiPickIds = proposerAssets.picks.map((p: any) => p.id);

            executeTrade(userPlayerIds, userPickIds, aiPlayerIds, aiPickIds, proposerId);
        } else {
            // Standard TradeProposal (already has IDs)
            // Assuming TradeProposal has userPlayerIds etc. based on previous context, 
            // but 'models/TradeProposal' only had IDs.
            const offer = gameState.tradeOffer;
            executeTrade(offer.userPlayerIds, offer.userPickIds, offer.aiPlayerIds, offer.aiPickIds, offer.aiTeamId);
        }

        setGameState(prev => ({ ...prev, tradeOffer: null }));
    };

    const rejectTradeOffer = () => {
        setGameState(prev => ({ ...prev, tradeOffer: null }));
    };


    // Debug / Verification Helpers
    // @ts-ignore
    window.gameHelpers = {
        gameState,
        triggerDraft,
        endDraft,
        endResigning,
        signFreeAgent,
        endFreeAgency,
        startRegularSeason,
        paySalaries,
        startPlayoffs, spendScoutingPoints, // Not available in this context
        // endScoutingPhase, // Not available in this context
        updateRotation,
        updateTeamHierarchy,
        setGameState
    };

    const updateTrainingFocus = (playerId: string, focus: TrainingFocus) => {
        setGameState(prev => ({
            ...prev,
            trainingSettings: {
                ...prev.trainingSettings,
                [playerId]: focus
            }
        }));
    };

    const signPlayerWithContract = (playerId: string, offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => {
        setGameState(prev => {
            const playerIndex = prev.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1) return prev;

            const player = prev.players[playerIndex];
            const team = prev.teams.find(t => t.id === prev.userTeamId);
            if (!team) return prev;

            const trueCapSpace = calculateTeamCapSpace(team, prev.contracts, prev.salaryCap);

            // Logic for signing (simplified for restoration)
            const VET_MINIMUM = 1100000;
            const isOwnPlayer = player.teamId === team.id || player.acquisition?.previousTeamId === team.id;
            const canExceedCap = isOwnPlayer || offer.amount <= VET_MINIMUM;

            // Strict check if not exception
            if (trueCapSpace < offer.amount && !canExceedCap) {
                alert(`Cannot sign! Cap Space: ${trueCapSpace < 0 ? '-' : ''}$${Math.abs(trueCapSpace / 1000000).toFixed(1)}M vs Offer: $${(offer.amount / 1000000).toFixed(1)}M`);
                return prev;
            }

            const newContract: Contract = {
                id: generateUUID(),
                playerId: player.id,
                teamId: prev.userTeamId,
                amount: offer.amount,
                yearsLeft: offer.years,
                startYear: prev.date.getFullYear(),
                role: offer.role
            };

            const updatedPlayers = [...prev.players];
            updatedPlayers[playerIndex] = { ...player, teamId: prev.userTeamId };

            const updatedTeams = prev.teams.map(t => {
                if (t.id === prev.userTeamId) {
                    return {
                        ...t,
                        rosterIds: [...t.rosterIds, player.id],
                        salaryCapSpace: t.salaryCapSpace - offer.amount,
                        cash: t.cash - offer.amount
                    };
                }
                return t;
            });

            return {
                ...prev,
                players: updatedPlayers,
                teams: updatedTeams,
                contracts: [...prev.contracts, newContract]
            };
        });
    };

    const advanceFreeAgencyDay = () => {
        setGameState(prev => {
            const currentDay = prev.freeAgencyDay || 1;
            const { newState, result } = simulateFreeAgencyDay(prev, currentDay + 1);

            // Create news stories from result
            const newNews: NewsStory[] = result.news.map(n => ({
                id: Date.now().toString() + Math.random(),
                date: prev.date,
                title: 'Free Agency News',
                headline: 'Free Agency Update',
                type: 'TRANSACTION',
                priority: 3,
                content: n,
                imageUrl: '/news/signing.jpg',
                teamId: undefined
            }));

            // Identify User Offer Updates for the Recap
            // We compare 'prev.activeOffers' with 'newState.activeOffers'
            // OR we can just check what changed in 'newState.activeOffers' vs 'prev'
            // But simulateFreeAgencyDay modifies the objects.

            // Better: filtering newState.activeOffers for items that are:
            // 1. Belonging to User
            // 2. Status is 'accepted' or 'rejected'
            // 3. Status Changed THIS turn?
            // Since we advance day by day, any 'accepted' or 'rejected' offer that wasn't previously in that state is new.
            // Or simpler: The 'dayOffered' logic in simulateFreeAgencyDay isn't enough.

            // Let's use the 'result' object which we can expand if needed, or just look for user offers in the result's "offersMade" (only shows NEW offers).

            // Actually, simulateFreeAgencyDay returns 'activeOffers' in newState with updated statuses.
            // Let's filter the ones that are FINALIZED (accepted/rejected) and were PENDING in 'prev'.

            const prevPendingIds = (prev.activeOffers || []).filter(o => o.status === 'pending').map(o => o.id);
            const userOffersExpressed = (newState.activeOffers || []).filter(o =>
                o.teamId === prev.userTeamId &&
                ['accepted', 'rejected', 'outbid'].includes(o.status) &&
                prevPendingIds.includes(o.id)
            );

            return {
                ...newState,
                news: [...newNews, ...prev.news],
                lastFreeAgencyResult: {
                    offersUpdated: userOffersExpressed,
                    leagueNews: result.news,
                    day: currentDay + 1
                }
            };
        });
    };

    const placeOffer = (playerId: string, amount: number, years: number) => {
        setGameState(prev => {
            const newOffer: FreeAgencyOffer = {
                id: Date.now().toString(),
                playerId,
                teamId: prev.userTeamId,
                amount,
                years,
                dayOffered: prev.freeAgencyDay,
                isUserOffer: true,
                status: 'pending'
            };

            return {
                ...prev,
                activeOffers: [...(prev.activeOffers || []), newOffer]
            };
        });
    };

    const placeCoachOffer = (coachId: string, amount: number, years: number) => {
        setGameState(prev => {
            const newOffer: FreeAgencyOffer = {
                id: Date.now().toString(),
                playerId: coachId, // Reusing ID field
                teamId: prev.userTeamId,
                amount,
                years,
                dayOffered: prev.freeAgencyDay,
                isUserOffer: true,
                status: 'pending'
            };

            return {
                ...prev,
                activeCoachOffers: [...(prev.activeCoachOffers || []), newOffer]
            };
        });
    };

    const userHireCoach = (coachId: string) => {
        setGameState(prev => {
            const coach = prev.coaches.find(c => c.id === coachId);
            const team = prev.teams.find(t => t.id === prev.userTeamId);
            if (!coach || !team) return prev;

            const existingCoach = prev.coaches.find(c => c.teamId === team.id);
            if (existingCoach) return prev;

            const updatedCoaches = prev.coaches.map(c =>
                c.id === coachId ? { ...c, teamId: team.id } : c
            );

            const updatedTeams = prev.teams.map(t =>
                t.id === team.id ? { ...t, coachId: coach.id } : t
            );

            return {
                ...prev,
                coaches: updatedCoaches,
                teams: updatedTeams,
                messages: [
                    {
                        id: Date.now().toString(),
                        date: prev.date,
                        title: 'New Coach Hired',
                        text: `You have successfully hired ${coach.firstName} ${coach.lastName} as your new head coach.`,
                        type: 'success',
                        read: false
                    },
                    ...prev.messages
                ]
            };
        });
    };

    const userFireCoach = (teamId: string) => {
        setGameState(prev => {
            const team = prev.teams.find(t => t.id === teamId);
            const coach = prev.coaches.find(c => c.id === team?.coachId && c.teamId === team?.id);

            if (!team || !coach) return prev;

            const updatedCoaches = prev.coaches.map(c =>
                c.id === coach.id ? { ...c, teamId: null } : c
            );

            const updatedTeams = prev.teams.map(t =>
                t.id === team.id ? { ...t, coachId: undefined } : t
            );

            return {
                ...prev,
                coaches: updatedCoaches,
                teams: updatedTeams,
                messages: [
                    {
                        id: Date.now().toString(),
                        date: prev.date,
                        title: 'Coach Fired',
                        text: `You have fired head coach ${coach.firstName} ${coach.lastName}. Find a replacement in Free Agency.`,
                        type: 'warning',
                        read: false
                    },
                    ...prev.messages
                ]
            };
            return prev;
        });
    };

    const negotiateContract = (playerId: string, offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }): { decision: 'ACCEPTED' | 'REJECTED' | 'INSULTED', feedback: string } => {
        const player = gameState.players.find(p => p.id === playerId);
        if (!player) return { decision: 'REJECTED', feedback: 'Unknown player' };

        const market = calculateContractAmount(player, gameState.salaryCap);
        const acceptableAmount = calculateAdjustedDemand(player, market.amount, market.years, offer.role, offer.years, false);
        const ratio = offer.amount / acceptableAmount;

        // GM Perk: Charisma (deal_2)
        let threshold = 0.95;

        if (ratio >= threshold) return { decision: 'ACCEPTED', feedback: 'I am happy to accept your offer!' };
        else if (ratio >= 0.85) return { decision: 'REJECTED', feedback: 'We are close, but I need a bit more security or a better role.' };
        else if (ratio >= 0.70) return { decision: 'REJECTED', feedback: 'That offer is quite low. You need to do better.' };
        else return { decision: 'INSULTED', feedback: 'This is disrespectful. Get out of my face.' };
    };

    const runTrainingCamp = () => {
        setGameState(prev => {
            if (prev.isTrainingCampComplete) return prev; // Prevent multiple runs

            const reports: ProgressionResult[] = [];
            const updatedPlayers = prev.players.map(p => {
                let focus: TrainingFocus = TrainingFocus.BALANCED;
                const isUserPlayer = p.teamId === prev.userTeamId;

                if (isUserPlayer) {
                    // Check if user set a focus. If undefined or NONE, use NATURAL (Natural Progression).
                    const userFocus = prev.trainingSettings[p.id];
                    if (!userFocus || userFocus === TrainingFocus.NONE) {
                        focus = TrainingFocus.NATURAL;
                    } else {
                        focus = userFocus;
                    }
                } else {
                    // AI Logic
                    if (p.age < 24) focus = TrainingFocus.PHYSICAL; // Develop body
                    else if (p.age > 30) focus = TrainingFocus.FUNDAMENTALS; // Slow decline
                    else if (p.position === 'PG' || p.position === 'SG') focus = TrainingFocus.SHOOTING;
                    else if (p.position === 'C') focus = TrainingFocus.DEFENSE;
                    else focus = TrainingFocus.BALANCED;
                }
                
                const teamCoach = prev.coaches.find(c => c.teamId === p.teamId);

                const { updatedPlayer, report } = calculateProgression(p, focus, teamCoach?.rating.talentDevelopment);
                reports.push(report);
                return updatedPlayer;
            });

            // Notify User
            // If significant changes for user team, add a message
            const userReports = reports.filter(r => prev.teams.find(t => t.id === prev.userTeamId)?.rosterIds.includes(r.playerId));
            if (userReports.length > 0) {
                // We rely on the View to show details, but we can add a notification toast
            }

            return {
                ...prev,
                players: updatedPlayers,
                trainingReport: reports,
                offseasonTasks: {
                    ...prev.offseasonTasks,
                    training: true
                },
                view: 'training_results',
                messages: [
                    {
                        id: Date.now().toString(),
                        date: prev.date,
                        title: 'Training Camp Complete',
                        text: 'Players have completed training camp. Check the Progression Report to see who improved.',
                        type: 'info',
                        read: false
                    },
                    ...prev.messages
                ],
                isTrainingCampComplete: true
            };
        });
    };

    return (
        <GameContext.Provider value={{
            ...gameState,
            isSimulating: simTarget !== 'none',
            startNewGame,
            advanceDay,
            simTarget,
            stopSimulation,
            startRegularSeason,
            paySalaries,
            simulateToTradeDeadline,
            simulateToPlayoffs,
            executeTrade,
            finishExpansionDraft,
            triggerDraft,
            handleDraftPick,
            simulateNextPick,
            simulateToUserPick,
            endDraft,
            startRetirementPhase,
            continueFromRetirements,
            endCoachFreeAgency,
            endResigning,
            signFreeAgent,
            signPlayerWithContract,
            releasePlayer,
            endFreeAgency,
            completeOffseasonTask,
            negotiateContract,
            updateRotation,
            updateTeamHierarchy,
            updateCoachSettings,
            updateRotationSchedule,
            acceptTradeOffer,
            rejectTradeOffer,
            liveGameData: liveGame,
            startLiveGameFn: startLiveGame,
            endLiveGameFn: completeLiveGame,
            startMerchCampaign,
            saveGame,
            loadGame,
            deleteSave,
            userHireCoach,
            userFireCoach,
            setView,

            simSpeed,
            setSimSpeed,
            addNewsStory,
            spendScoutingPoints,
            endScoutingPhase,
            simulateRound,
            updatePlayerAttribute,
            setGameState,
            updateTrainingFocus,
            runTrainingCamp,
            generateDailyMatchups,
            setHasSeenNewsTutorial,
            startPlayoffs,
            simulatePlayoffs,
            placeOffer,
            placeCoachOffer,
            advanceFreeAgencyDay,
            sellPlayer,
            sellPlayerToTeam,
            // UI
            selectedPlayerId,
            setSelectedPlayerId,
            selectedTeamId,
            setSelectedTeamId,
            selectedGame,
            setSelectedGame,
            shopPlayerId,
            setShopPlayerId,
            initialAiPlayerId,
            setInitialAiPlayerId,
            prefilledTrade,
            setPrefilledTrade,
            completeLiveGame,
            showingAwards,
            setShowingAwards,
            showSaveLoad,
            setShowSaveLoad,
            showExitModal,
            setShowExitModal,
            showPayrollModal,
            setShowPayrollModal,
            modalMessage,
            setModalMessage,
            currentNegotiation,
            year: gameState.date.getFullYear(),
            setLeagueType,
            leagueType: gameState.leagueType,
            setCompetitionType,
            competitionType: gameState.competitionType,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export { GameContext };
