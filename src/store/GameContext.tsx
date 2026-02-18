import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
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
import type { SocialMediaPost } from '../models/SocialMediaPost';

import { LiveGameEngine } from '../features/simulation/LiveGameEngine';
import { simulateMatchII as simulateMatch } from '../features/simulation/MatchEngineII';
import { generateDailyPosts } from '../socialMediaUtils';
import type { MatchResult, TeamRotationData, PlayerStats, MerchCampaign, ActiveMerchCampaign } from '../features/simulation/SimulationTypes';

import type { TeamStrategy } from '../features/simulation/TacticsTypes';
// import { runProgression } from '../features/simulation/progressionSystem'; // Removed
import { generateUUID } from '../utils/uuid';
import { generateContract, calculateContractAmount, calculateTeamCapSpace, calculateAdjustedDemand } from '../utils/contractUtils';
import { simulateDailyTrades, generateAiTradeProposalForUser, type TradeProposal } from '../features/trade/TradeSimulation';
import { updatePlayerMorale, applyTeamDynamics, checkTradeRequests, checkProveItDemands } from '../features/simulation/MoraleSystem';
// TradeProposalModal import removed (unused and caused potential cycle)
import { optimizeRotation } from '../utils/rotationUtils';
import { formatDate } from '../utils/dateUtils';

import { calculateOverall, checkHallOfFameEligibility, calculateFairSalary, calculateSecondaryPosition } from '../utils/playerUtils';
import { NBA_TEAMS } from '../data/teams';
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
import { saveToDB, loadFromDB, deleteFromDB, type SaveMeta } from '../utils/storage';
import { TrainingFocus, type ProgressionResult } from '../models/Training';
import { calculateProgression } from '../features/training/TrainingLogic';
import { importNbaPlayers } from '../features/league/CsvImporter';
import { applyRealWorldTrades } from '../data/tradeUpdates';


// ... (imports)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
// Re-define PlayoffSeries since I might have deleted it or it was there before
export interface PlayoffSeries {
    id: string;
    round: number;
    conference: 'West' | 'East' | 'Finals';
    homeTeamId: string;
    awayTeamId: string;
    homeWins: number;
    awayWins: number;
    winnerId?: string;
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
    type: 'info' | 'success' | 'warning' | 'error';
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

export interface GameState {
    players: Player[];
    teams: Team[];
    news: NewsStory[];
    coaches: Coach[];
    userTeamId: string;
    contracts: Contract[];
    games: MatchResult[];
    date: Date;
    isInitialized: boolean;
    draftClass: Player[];
    draftOrder: string[];
    draftResults: DraftResult[]; // Results of current/recent draft
    draftHistory: Record<number, DraftResult[]>; // Historical results by year
    seasonPhase: 'regular_season' | 'playoffs_r1' | 'playoffs_r2' | 'playoffs_r3' | 'playoffs_finals' | 'offseason' | 'pre_season' | 'draft' | 'draft_summary' | 'resigning' | 'free_agency' | 'retirement_summary' | 'expansion_draft' | 'scouting' | 'coach_free_agency';
    expansionPool: Player[];
    playoffs: PlayoffSeries[];
    salaryCap: number;
    transactions: { date: Date; type: string; description: string }[];
    messages: Message[];
    isSimulating: boolean;
    tradeHistory: CompletedTrade[];
    tradeOffer: TradeProposal | null;
    awardsHistory: SeasonAwards[];
    retiredPlayersHistory: { year: number; players: RetiredPlayer[] }[];
    scoutingPoints: Record<string, number>; // teamId -> points remaining
    isPotentialRevealed: boolean;
    scoutingReports: Record<string, Record<string, { points: number, isPotentialRevealed: boolean }>>; // teamId -> (prospectId -> {points, revealed})
    settings: {
        difficulty: 'Easy' | 'Medium' | 'Hard';
        showLoveForTheGame: boolean;
    };
    currentSaveSlot: number | null;
    // Training
    trainingSettings: Record<string, TrainingFocus>; // PlayerID -> Focus
    trainingReport: ProgressionResult[] | null; // Results from the last camp
    isTrainingCampComplete: boolean;
    dailyMatchups: { homeId: string, awayId: string }[];
    pendingUserResult: MatchResult | null;

    tutorialFlags: {
        hasSeenNewsTutorial: boolean;
    };
    isProcessing: boolean;

    socialMediaPosts: SocialMediaPost[];
    activeMerchCampaigns: ActiveMerchCampaign[];
    seasonGamesPlayed: number; // 0 to 82
    isFirstSeasonPaid: boolean;
    lastFreeAgencyResult?: {
        offersUpdated: FreeAgencyOffer[];
        leagueNews: string[];
        day: number;
    };
    activeOffers: FreeAgencyOffer[];
    freeAgencyDay: number;
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

    spendScoutingPoints: (prospectId: string, points: number) => void;
    addNewsStory: (story: NewsStory) => void;
    endScoutingPhase: () => void;
    updateRotation: (updates: { id: string, minutes: number, isStarter: boolean, rotationIndex?: number }[]) => void;
    simulateToTradeDeadline: () => void;
    simulateToPlayoffs: () => void;
    simulatePlayoffs: () => void;
    stopSimulation: () => void;
    simulateRound: () => void;
    saveGame: (slotId: number, silent?: boolean) => Promise<void>;
    loadGame: (slotId: number) => Promise<boolean>;

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
    // Training
    updateTrainingFocus: (playerId: string, focus: TrainingFocus) => void;
    runTrainingCamp: () => void;
    generateDailyMatchups: () => void;
    setHasSeenNewsTutorial: () => void;
    placeOffer: (playerId: string, amount: number, years: number) => void;
    advanceFreeAgencyDay: () => void;
    sellPlayer: (playerId: string) => void;
    sellPlayerToTeam: (playerId: string, targetTeamId: string) => { success: boolean, message: string };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
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
        date: new Date(2024, 9, 22), // Start of season (approx)
        isInitialized: false,
        draftClass: [],
        draftOrder: [],
        draftResults: [],
        draftHistory: {},
        seasonPhase: 'regular_season',
        playoffs: [],
        salaryCap: 140500000,
        transactions: [],
        messages: [],
        awardsHistory: [],
        retiredPlayersHistory: [],
        scoutingPoints: {}, // Changed from 0 to {}
        isPotentialRevealed: false,
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
        pendingUserResult: null,
        tutorialFlags: { hasSeenNewsTutorial: false },
        isProcessing: false,
        activeOffers: [],
        freeAgencyDay: 1,
        socialMediaPosts: [],
        activeMerchCampaigns: [],
        seasonGamesPlayed: 0,
        isFirstSeasonPaid: false
    });

    // Ref to hold the latest state, avoiding stale closures in async functions or event handlers
    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    // Constants
    const SALARY_CAP = 140000000;
    const LUXURY_TAX_THRESHOLD = 170000000;
    const MIN_ROSTER_SIZE = 8;
    const MAX_ROSTER_SIZE = 15;
    const [simTarget, setSimTarget] = useState<'none' | 'deadline' | 'playoffs' | 'playoffs_end' | 'round'>('none');
    console.log(`[Render] GameProvider Rendered. simTarget: ${simTarget}`);
    const [targetRound, setTargetRound] = useState<number | null>(null);
    const [simSpeed, setSimSpeed] = useState<number>(1000);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const generateDailyMatchups = () => {
        setGameState(prev => {
            const playingTeams = [...prev.teams];
            const matchups: { homeId: string, awayId: string }[] = [];

            // Shuffle for random pairings
            for (let i = playingTeams.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [playingTeams[i], playingTeams[j]] = [playingTeams[j], playingTeams[i]];
            }

            for (let i = 0; i < playingTeams.length; i += 2) {
                if (i + 1 < playingTeams.length) {
                    matchups.push({
                        homeId: playingTeams[i].id,
                        awayId: playingTeams[i + 1].id
                    });
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

    const endLiveGame = (result: MatchResult) => {
        setGameState(prev => ({
            ...prev,
            pendingUserResult: result
        }));
        setLiveGame(null);
    };

    // Auto-advance after manual game
    useEffect(() => {
        if (gameState.pendingUserResult) {
            advanceDay();
        }
    }, [gameState.pendingUserResult]);

    // Ensure dailyMatchups are initialized for existing saves
    useEffect(() => {
        if (gameState.isInitialized && gameState.seasonPhase === 'regular_season' && gameState.dailyMatchups.length === 0) {
            console.log("Initializing dailyMatchups for existing save...");
            generateDailyMatchups();
        }
    }, [gameState.isInitialized, gameState.seasonPhase, gameState.dailyMatchups]);

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

            // Generate future picks for the new team
            const futurePicks: DraftPick[] = [];
            const currentYear = gameState.date.getFullYear();
            for (let year = currentYear; year <= currentYear + 4; year++) {
                futurePicks.push({ id: generateUUID(), year, round: 1, originalTeamId: newTeamId });
                futurePicks.push({ id: generateUUID(), year, round: 2, originalTeamId: newTeamId });
            }
            newTeam.draftPicks = futurePicks;

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
            const teams: Team[] = JSON.parse(JSON.stringify(NBA_TEAMS));

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
            if (players.length === 0) {
                console.warn("CSV Import failed or empty. Falling back to Seeded Rosters.");
                const seeded = seedRealRosters(teams);
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

            const INITIAL_SALARY_CAP = 140000000;

            // 4. Update Team Budgets & Draft Picks
            teams.forEach(t => {
                // Same logic as before
                const teamContracts = contracts.filter(c => c.teamId === t.id);
                const totalSalary = teamContracts.reduce((sum, c) => sum + c.amount, 0);
                t.salaryCapSpace = INITIAL_SALARY_CAP - totalSalary;
                t.salaryCapSpace = INITIAL_SALARY_CAP - totalSalary;
                t.salaryCapSpace = INITIAL_SALARY_CAP - totalSalary;
                // HARD MODE RESPEC: Use the cash value from teams.ts if available, otherwise default to 100M?
                // actually teams.ts values are already loaded into `t` (t comes from NBA_TEAMS)
                // BUT we may want to ensure they aren't deducted twice if we restart?
                // No, t.cash is just the raw value from teams.ts.

                // If the user wants "Start with 80M" which INCLUDES salary payments?
                // "Start with 80M" usually means "You have 80M cash".
                // If we subtract salary (e.g. 150M), they go negative immediately.
                // The previous logic was "350M - Salary".
                // If Hard Mode says "Knicks Start with 80M", does it mean 80M - Salary? (Negative?)
                // Or 80M liquid cash?
                // User text: "Knicks... Start with $80M" ... "Start: $350M • Salaries Paid Upfront"
                // It seems the user wants the "Start" amount to be lower.
                // If we set t.cash = 80M, and then DON'T deduct salary, they have 80M liquid.
                // If we set t.cash = 80M and deduct salary (150M), they are bankrupt.
                // So we should NOT deduct salary if we trust the teams.ts values are the "Liquid Starting Cash".
                // Let's assume teams.ts values = Initial Cash Reserve.
                // We keep the logic "t.cash = t.cash" (do nothing to it).

                if (t.id === userTeamId) {
                    if (difficulty === 'Easy') t.cash += 20000000;
                    if (difficulty === 'Hard') t.cash -= 15000000;
                }

                t.rosterIds = players.filter(p => p.teamId === t.id).map(p => p.id);

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

            // 5. Free Agents (Optional: small pool)
            for (let i = 0; i < 20; i++) { updatedPlayers.push(generatePlayer(undefined, 'bench')); }

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
                date: new Date(2024, 9, 20), // Oct 20
                salaryCap: INITIAL_SALARY_CAP,
                coaches: initialCoaches, // Add coaches here
                news: [],
                isInitialized: true,
                isPotentialRevealed: false,
                awardsHistory: [],
                activeMerchCampaigns: [],
                draftClass: initialDraftClass, // Use the injected class if expansion, else empty
                draftOrder: [], // Will be set on init
                draftResults: [],
                draftHistory: {},
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
                dailyMatchups: [],
                pendingUserResult: null,
                tutorialFlags: { hasSeenNewsTutorial: false },
                isProcessing: false,
                socialMediaPosts: [],
                seasonGamesPlayed: 0,
                isFirstSeasonPaid: true, // First season is free, so we don't get blocked by the budget gate
                activeOffers: [],
                freeAgencyDay: 1
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
                userTeamId,
                contracts,
                games: [],
                date: new Date(2024, 9, 20), // Oct 20
                salaryCap: 140000000,
                coaches: initialCoaches, // Add coaches here
                news: [],
                isInitialized: true,
                isPotentialRevealed: false,
                awardsHistory: [],
                activeMerchCampaigns: [],
                draftClass: initialDraftClass,
                draftOrder: [],
                draftResults: [],
                draftHistory: {},
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
                dailyMatchups: [],
                pendingUserResult: null,
                tutorialFlags: { hasSeenNewsTutorial: false },
                isProcessing: false,
                socialMediaPosts: [],
                seasonGamesPlayed: 0,
                isFirstSeasonPaid: true,
                activeOffers: [],
                freeAgencyDay: 1
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
                isFirstSeasonPaid: true // Mark as paid so we don't ask again
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
                const nextSeasonDate = new Date(prev.date.getFullYear(), 9, 1);

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

                    return { ...t, draftPicks: currentPicks, history: newHistory, wins: 0, losses: 0, cash: t.cash - payroll };
                });

                // 4. Initial Matchups
                const initialMatchups: { homeId: string, awayId: string }[] = [];
                const playingTeamsList = [...finalTeams];
                for (let i = playingTeamsList.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [playingTeamsList[i], playingTeamsList[j]] = [playingTeamsList[j], playingTeamsList[i]];
                }
                for (let i = 0; i < playingTeamsList.length; i += 2) {
                    if (i + 1 < playingTeamsList.length) {
                        initialMatchups.push({ homeId: playingTeamsList[i].id, awayId: playingTeamsList[i + 1].id });
                    }
                }

                return {
                    ...prev,
                    players: updatedPlayers,
                    games: [],
                    teams: finalTeams,
                    contracts: updatedContracts,
                    date: nextSeasonDate,
                    seasonPhase: 'regular_season',
                    dailyMatchups: initialMatchups,
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
            // Check for regular season end (82 games)
            // We use 'regular_season' phase and check the games played.
            if (prev.seasonPhase !== 'regular_season' || prev.seasonGamesPlayed < 82) {
                console.warn("GameContext: startPlayoffs called prematurely or in wrong phase:", prev.seasonPhase, prev.seasonGamesPlayed);
                return prev;
            }

            console.log("GameContext: Starting Playoffs...");
            const currentYear = prev.date.getFullYear();
            const awards = calculateRegularSeasonAwards(prev.players, prev.teams, currentYear);

            const createSeries = (round: number, conf: 'East' | 'West'): PlayoffSeries[] => {
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
                            conference: conf,
                            homeTeamId: home.id,
                            awayTeamId: away.id,
                            homeWins: 0,
                            awayWins: 0
                        });
                    }
                });
                return series;
            };

            const westSeries = createSeries(1, 'West');
            const eastSeries = createSeries(1, 'East');

            return {
                ...prev,
                seasonPhase: 'playoffs_r1',
                playoffs: [...westSeries, ...eastSeries],
                date: new Date(prev.date.getTime() + 86400000),
                awardsHistory: [...prev.awardsHistory, awards],
                dailyMatchups: [],
                pendingUserResult: null
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
            alert(`Trade Deadline Passed. Trades are closed until the Draft.`);
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
            const t1Items: TradeAssetItem[] = [
                ...updatedPlayers.filter(p => userPlayerIds.includes(p.id)).map(p => ({
                    type: 'player' as const,
                    id: p.id,
                    description: `${p.firstName} ${p.lastName}`,
                    subText: `${calculateOverall(p)} OVR`,
                    color: '#22c55e' // Green for player
                })),
                ...prev.teams.find(t => t.id === userTeamId)!.draftPicks.filter(pk => userPickIds.includes(pk.id)).map(pk => ({
                    type: 'pick' as const,
                    id: pk.id,
                    description: `${pk.year} Round ${pk.round}`,
                    subText: `From ${pk.originalTeamName}`,
                    color: '#eab308', // Yellow/Gold for pick
                    originalTeamId: pk.originalTeamId
                }))
            ];

            const t2Items: TradeAssetItem[] = [
                ...updatedPlayers.filter(p => aiPlayerIds.includes(p.id)).map(p => ({
                    type: 'player' as const,
                    id: p.id,
                    description: `${p.firstName} ${p.lastName}`,
                    subText: `${calculateOverall(p)} OVR`,
                    color: '#22c55e'
                })),
                ...prev.teams.find(t => t.id === aiTeamId)!.draftPicks.filter(pk => aiPickIds.includes(pk.id)).map(pk => ({
                    type: 'pick' as const,
                    id: pk.id,
                    description: `${pk.year} Round ${pk.round}`,
                    subText: `From ${pk.originalTeamName}`,
                    color: '#eab308',
                    originalTeamId: pk.originalTeamId
                }))
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
            if (prev.seasonPhase !== 'offseason') {
                console.warn("GameContext: triggerDraft called but phase is not offseason:", prev.seasonPhase);
                return prev;
            }

            console.log("GameContext: Triggering Draft...");


            // 0. Handle Contract Expiry (Before Draft)
            const updatedContracts: Contract[] = [];
            const updatedPlayers = prev.players.map(p => ({ ...p, age: p.age + 1 }));
            const updatedTeams = [...prev.teams]; // Updates will happen to rosterIds

            // Simplified Contract Expiry
            prev.contracts.forEach(c => {
                const player = updatedPlayers.find(p => p.id === c.playerId);
                if (c.yearsLeft > 1) {
                    updatedContracts.push({ ...c, yearsLeft: c.yearsLeft - 1 });
                } else {
                    // Expired - release to free agency
                    if (player) {
                        player.teamId = null;
                        if (!player.acquisition) player.acquisition = { type: 'free_agent', year: prev.date.getFullYear() };
                        player.acquisition.previousTeamId = c.teamId;

                        const team = updatedTeams.find(t => t.id === c.teamId);
                        if (team) {
                            team.rosterIds = team.rosterIds.filter(id => id !== player.id);
                            team.salaryCapSpace += c.amount;
                        }
                    }
                }
            });

            // Coach Contract Decrement
            const updatedCoaches = prev.coaches.map(coach => {
                if (coach.contract.yearsRemaining > 1) {
                    return { ...coach, contract: { ...coach.contract, yearsRemaining: coach.contract.yearsRemaining - 1 } };
                } else if (coach.contract.yearsRemaining === 1) {
                    // Contract expired - release to free agency
                    const team = updatedTeams.find(t => t.id === coach.teamId);
                    if (team) {
                        team.coachId = undefined;
                    }
                    return { ...coach, teamId: null, contract: { ...coach.contract, yearsRemaining: 0 } };
                }
                return coach; // Already a free agent
            });

            // 1. Generate Draft Class
            const draftClass: Player[] = [];
            const draftYear = prev.date.getFullYear();

            // Distribution Logic
            // Distribution Logic (NERFED for Raw Prospects)
            const hasGenerational = Math.random() < 0.05; // Was 0.15
            const numAllStars = Math.floor(Math.random() * 2); // 0-1 (Was 2-4)
            const numStarters = 4 + Math.floor(Math.random() * 4); // 4-7 (Was 10-15)

            // Generate Generational
            if (hasGenerational) {
                const p = generatePlayer(undefined, 'star');
                p.potential = 96 + Math.floor(Math.random() * 4);
                p.loveForTheGame = 18 + Math.floor(Math.random() * 3);
                draftClass.push(p);
            }

            // Generate All-Stars
            for (let i = 0; i < numAllStars; i++) {
                draftClass.push(generatePlayer(undefined, 'star'));
            }

            // Generate Starters
            for (let i = 0; i < numStarters; i++) {
                draftClass.push(generatePlayer(undefined, 'starter'));
            }

            // Fill remainder (Mostly Prospects)
            const currentCount = draftClass.length;
            const remainder = 60 - currentCount;

            for (let i = 0; i < remainder; i++) {
                const tier = Math.random() > 0.8 ? 'bench' : 'prospect'; // 80% Prospects
                draftClass.push(generatePlayer(undefined, tier));
            }

            // Age reset
            draftClass.forEach(p => {
                p.age = 19 + Math.floor(Math.random() * 4);
            });

            // CUSTOM INJECTION: Season 2 (2026 Draft)
            // Use date from state
            if (prev.date.getFullYear() === 2026) {
                console.log("Injecting Custom Players for 2026 Draft");
                const customPlayers = [
                    { firstName: 'Giannis', lastName: 'Tsetselis', position: 'PF', height: 208, weight: 109 }, // 6'10", 240lbs
                    { firstName: 'Ilias', lastName: 'Kokpasoglou', position: 'C', height: 216, weight: 118 }, // 7'1", 260lbs
                    { firstName: 'Petros', lastName: 'Pantelias', position: 'PG', height: 191, weight: 86 }, // 6'3", 190lbs
                    { firstName: 'Lefteris', lastName: 'Sfinarolakis', position: 'SF', height: 201, weight: 100 }, // 6'7", 220lbs
                    { firstName: 'Vaggelis', lastName: 'Tselelpis', position: 'SF', height: 203, weight: 102 } // 6'8", 225lbs
                ];

                customPlayers.forEach((cp, idx) => {
                    // Generate base player
                    const p = generatePlayer(undefined, 'starter'); // Use 'starter' base (nerfed)
                    p.firstName = cp.firstName;
                    p.lastName = cp.lastName;
                    p.position = cp.position as any;
                    p.height = cp.height;
                    p.weight = cp.weight;
                    p.age = 19 + Math.floor(Math.random() * 2); // Young

                    // Potential: B+ (85) to A+ (99)
                    p.potential = 85 + Math.floor(Math.random() * 15);
                    if (p.potential > 99) p.potential = 99;

                    // Ensure current ability isn't higher than potential
                    // Start them decent (70-75) so they are draftable high
                    const currentOvr = 70 + Math.floor(Math.random() * 8);
                    // Adjust attributes to match OVR roughly (simplified)
                    // We can just trust the generator but boost potential

                    // Replace a random player in the draft class logic? Or just push to top?
                    // Let's unshift them to be at the start (high visibility)
                    // But array order doesn't dictate rank, sorting does.
                    // Generator usually makes random stats. Let's Ensure they are good.

                    draftClass.push(p);
                });
            }

            // 2. Set Draft Order (Reverse Standings)
            const sortedTeams = [...updatedTeams].sort((a, b) => {
                if ((a.losses || 0) !== (b.losses || 0)) return (b.losses || 0) - (a.losses || 0);
                return Math.random() - 0.5;
            });

            // Use draftYear declared above
            // const draftYear = prev.date.getFullYear();
            let order: string[] = [];

            // Round 1
            sortedTeams.forEach(originalTeam => {
                const owner = updatedTeams.find(t =>
                    t.draftPicks && t.draftPicks.some(dp => dp.year === draftYear && dp.round === 1 && dp.originalTeamId === originalTeam.id)
                );
                order.push(owner ? owner.id : originalTeam.id);
            });

            // CRITICAL SAFEGUARD: If User is somehow missing from Round 1 (impossible unless removed), force add
            if (!order.includes(prev.userTeamId)) {
                console.warn("User Team missing from draft order. Force adding.");
                order.push(prev.userTeamId);
            }

            // Round 2
            sortedTeams.forEach(originalTeam => {
                const owner = updatedTeams.find(t =>
                    t.draftPicks && t.draftPicks.some(dp => dp.year === draftYear && dp.round === 2 && dp.originalTeamId === originalTeam.id)
                );
                order.push(owner ? owner.id : originalTeam.id);
            });


            // 3. Initialize Scouting Points
            const scoutingPoints: Record<string, number> = {};
            const scoutingReports: Record<string, Record<string, { points: number, isPotentialRevealed: boolean }>> = {};

            const westTeams = updatedTeams.filter(t => t.conference === 'West').sort((a, b) => (b.wins || 0) - (a.wins || 0));
            const eastTeams = updatedTeams.filter(t => t.conference === 'East').sort((a, b) => (b.wins || 0) - (a.wins || 0));

            [...westTeams, ...eastTeams].forEach((team) => {
                const confTeams = team.conference === 'West' ? westTeams : eastTeams;
                const rank = confTeams.findIndex(t => t.id === team.id);
                const points = rank < 8 ? 20 : 35;
                scoutingPoints[team.id] = points;
                scoutingReports[team.id] = {};
            });

            console.log("GameContext: Draft Triggered. Transitioning to Scouting Phase.", { scoutingPoints });

            return {
                ...prev,
                players: updatedPlayers,
                teams: updatedTeams,
                contracts: updatedContracts,
                coaches: updatedCoaches,
                draftClass,
                draftOrder: order,
                scoutingPoints,
                scoutingReports,
                seasonPhase: 'scouting',
                draftResults: [] // Reset for new draft
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
            const gp = p?.seasonStats?.gamesPlayed || 1;
            return {
                playerId: p?.id || 'err',
                playerName: p ? `${p.firstName} ${p.lastName} ` : 'Unknown',
                teamId: team?.id || '',
                teamName: team?.name || 'FA',
                statsSummary: p?.seasonStats ? `${(p.seasonStats.points / gp).toFixed(1)} PPG, ${(p.seasonStats.rebounds / gp).toFixed(1)} RPG, ${(p.seasonStats.assists / gp).toFixed(1)} APG` : 'N/A',
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

            const sortedMvp = [...activePlayers].sort((a, b) => getMvpScore(b) - getMvpScore(a));
            const mvp = sortedMvp.length > 0 ? createWinner(sortedMvp[0]) : createWinner(players[0]);

            // Rookie of the Year
            const rookies = activePlayers.filter(p => (!p.careerStats || p.careerStats.length === 0));
            const sortedRoty = [...rookies].sort((a, b) => getMvpScore(b) - getMvpScore(a));
            const roty = sortedRoty.length > 0 ? createWinner(sortedRoty[0]) : mvp;

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

            return {
                year,
                mvp,
                roty,
                dpoy,
                mip,
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
            // AI Logic: Best Value Available (Based on Scouting)
            const teamPoints = prevState.scoutingReports[currentPickTeamId] || {};

            const getAiPerceivedValue = (p: Player) => {
                const report = teamPoints[p.id];
                const isRevealed = report?.isPotentialRevealed;

                // If revealed, AI knows true potential.
                // If not, AI sees a "fuzzy" potential (True potential +/- noise).
                // Use a deterministic noise based on player ID so it's consistent for this draft class but "wrong" for everyone who doesn't scout.
                const noise = isRevealed ? 0 : ((p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 31) - 15);

                const perceivedPotential = Math.max(0, Math.min(99, p.potential + noise));
                const ageFactor = Math.max(0, 30 - p.age) * 2;

                return calculateOverall(p) * 0.4 + perceivedPotential * 0.4 + ageFactor;
            };

            const sortedDraftClass = [...prevState.draftClass].sort((a, b) => getAiPerceivedValue(b) - getAiPerceivedValue(a));
            player = sortedDraftClass[0];
        }

        if (!player) return prevState;

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
            try {

                // RETIREMENT LOGIC
                // Happens after Draft, before Resigning
                let updatedPlayers = [...prev.players];
                const retiredPlayers: RetiredPlayer[] = [];
                const retiredIds: string[] = [];

                updatedPlayers = updatedPlayers.filter(p => {
                    let shouldRetire = false;

                    // 1. HARD CAP at 42
                    if (p.age >= 42) {
                        shouldRetire = true;
                    }
                    // 2. Normal Retirement Logic (Age 33+)
                    else if (p.age >= 33) {
                        let retireChance = 0;

                        if (p.age >= 38) retireChance = 0.5;
                        else if (p.age >= 35) retireChance = 0.2;
                        else retireChance = 0.05;

                        // Love for game modifier
                        if (p.loveForTheGame > 15) retireChance *= 0.5;
                        if (p.loveForTheGame < 8) retireChance *= 1.5;

                        // Performance modifier
                        const ovr = calculateOverall(p);
                        if (ovr < 70 && p.age > 32) retireChance += 0.3;

                        if (Math.random() < retireChance) {
                            shouldRetire = true;
                        }
                    }

                    if (shouldRetire) {
                        retiredIds.push(p.id);

                        const isHOF = checkHallOfFameEligibility(p, prev.awardsHistory);

                        retiredPlayers.push({
                            ...p,
                            exitYear: prev.date.getFullYear(),
                            ageAtRetirement: p.age,
                            isHallOfFame: isHOF
                        });
                        return false; // Remove from active
                    }
                    return true; // Keep
                });

                // Clean up rosterIds and contracts for retired players
                const updatedTeams = prev.teams.map(t => ({
                    ...t,
                    rosterIds: t.rosterIds.filter(id => !retiredIds.includes(id))
                }));

                const updatedContracts = prev.contracts.filter(c => !retiredIds.includes(c.playerId));

                // Per User: "Ad a page with all the players that retired this year... after the draft and before the resign phase"

                return {
                    ...prev,
                    players: updatedPlayers,
                    teams: updatedTeams,
                    contracts: updatedContracts,
                    retiredPlayersHistory: [
                        ...(prev.retiredPlayersHistory || []),
                        { year: prev.date.getFullYear(), players: retiredPlayers }
                    ],
                    draftHistory: {
                        ...prev.draftHistory,
                        [prev.date.getFullYear()]: prev.draftResults
                    },
                    seasonPhase: 'draft_summary', // Show Summary First
                };
            } catch (error) {
                console.error("End Draft Error:", error);
                alert("Critical Error Ending Draft. Check console.");
                return prev;
            }
        });
    };

    const startRetirementPhase = () => {
        setGameState(prev => ({
            ...prev,
            seasonPhase: 'retirement_summary'
        }));
    };



    const continueFromRetirements = () => {
        setGameState(prev => ({
            ...prev,
            seasonPhase: 'coach_free_agency'
        }));
    };

    const endCoachFreeAgency = () => {
        setGameState(prev => {
            let updatedCoaches = [...prev.coaches];
            let updatedTeams = prev.teams.map(t => ({ ...t }));

            // AI teams without a coach hire from the free agent pool
            const freeAgentCoaches = updatedCoaches.filter(c => !c.teamId);
            const teamsNeedingCoach = updatedTeams.filter(t => !t.coachId || !updatedCoaches.find(c => c.id === t.coachId && c.teamId === t.id));

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

                // Sort free agents by combined rating (offense + defense)
                freeAgentCoaches.sort((a, b) =>
                    (b.rating.offense + b.rating.defense) - (a.rating.offense + a.rating.defense)
                );

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

            return {
                ...prev,
                coaches: updatedCoaches,
                teams: updatedTeams,
                seasonPhase: 'resigning' as const
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
                        const contractNeeds = generateContract(player, prev.date.getFullYear());
                        // Discount for resigning (Home Team Discount)
                        contractNeeds.amount = Math.floor(contractNeeds.amount * 0.95);

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
                seasonPhase: 'free_agency',
                date: new Date(prev.date.getFullYear(), 6, 1), // July 1st
                activeOffers: [], // Initialize for Free Agency
                freeAgencyDay: 1 // Initialize for Free Agency
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
                seasonPhase: 'pre_season',
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

            // 3. Find Target
            // Filter available FAs
            const availableFAs = updatedPlayers.filter(p => !p.teamId).sort((a, b) => calculateOverall(b) - calculateOverall(a));

            if (availableFAs.length === 0) return;

            // Simple Logic: Take Best Available that fits budget
            // If forceFill, take Best Available regardless (Vet Min exception)

            let targetPlayer: Player | null = null;
            let offerAmount = 0;

            if (forceFill) {
                targetPlayer = availableFAs[0];
                offerAmount = 1000000; // Vet Min logic
            } else {
                // Try to sign a good player if we have space
                for (const player of availableFAs) {
                    // Logic for "Ask" - rough estimation
                    const ovr = calculateOverall(player);
                    let ask = 1000000;
                    if (ovr > 85) ask = 40000000;
                    else if (ovr > 80) ask = 25000000;
                    else if (ovr > 75) ask = 12000000;
                    else if (ovr > 70) ask = 5000000;

                    if (capSpace >= ask) {
                        targetPlayer = player;
                        offerAmount = ask;
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
                        yearsLeft: 1,
                        startYear: currentState.date.getFullYear(),
                        role: 'Bench'
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

    const simulateDay = (prev: GameState): GameState => {
        const nextDate = new Date(prev.date.getTime() + 86400000);
        let nextDayMatchups: { homeId: string, awayId: string }[] = [];

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
            const updatedTeamRoster = applyTeamDynamics(teamRoster);

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
        let currentTradeHistory = [...(prev.tradeHistory || [])];
        let currentNews: NewsStory[] = [];

        // SEASON PHASE 1: REGULAR SEASON
        if (prev.seasonPhase === 'regular_season') {
            const gamesPlayed = prev.seasonGamesPlayed;

            // End of Regular Season
            if (gamesPlayed >= 82) {
                // ... award logic ...
                const currentYear = prev.date.getFullYear();
                const awards = calculateRegularSeasonAwards(currentPlayers, currentTeams, currentYear);

                // Trigger Playoffs Transition
                const westTeams = currentTeams.filter(t => t.conference === 'West').sort((a, b) => b.wins - a.wins);
                const eastTeams = currentTeams.filter(t => t.conference === 'East').sort((a, b) => b.wins - a.wins);

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
                            homeTeamId: home ? home.id : 'error',
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
                    seasonPhase: 'playoffs_r1',
                    playoffs: [...westSeries, ...eastSeries],
                    date: nextDate,
                    awardsHistory: [...prev.awardsHistory, awards],
                    players: currentPlayers,
                    teams: currentTeams,
                    dailyMatchups: [],
                    pendingUserResult: null
                };
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

                    const createItems = (players: Player[], picks: DraftPick[]) => [
                        ...players.map(p => ({
                            type: 'player' as const, id: p.id, description: `${p.firstName} ${p.lastName}`, subText: `${calculateOverall(p)} OVR`, color: '#22c55e'
                        })),
                        ...picks.map(pk => ({
                            type: 'pick' as const, id: pk.id, description: `${pk.year} Round ${pk.round}`, subText: `From ${pk.originalTeamName}`, color: '#eab308', originalTeamId: pk.originalTeamId
                        }))
                    ];

                    const t1Items = createItems(tradeProposal.proposerAssets.players, tradeProposal.proposerAssets.picks);
                    const t2Items = createItems(tradeProposal.targetAssets.players, tradeProposal.targetAssets.picks);

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

            // --- AI COACH EVALUATION (Every ~20 games) ---
            let currentCoaches = [...prev.coaches];
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

            const results: MatchResult[] = [];



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
                        userTeamId: prev.userTeamId
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

            // After loop, generate NEXT day's matchups
            const playingTeamsForNextDay = [...currentTeams];
            for (let i = playingTeamsForNextDay.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [playingTeamsForNextDay[i], playingTeamsForNextDay[j]] = [playingTeamsForNextDay[j], playingTeamsForNextDay[i]];
            }
            for (let i = 0; i < playingTeamsForNextDay.length; i += 2) {
                if (i + 1 < playingTeamsForNextDay.length) {
                    nextDayMatchups.push({
                        homeId: playingTeamsForNextDay[i].id,
                        awayId: playingTeamsForNextDay[i + 1].id
                    });
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
                    const pIdx = currentPlayers.findIndex(p => p.id === stat.playerId);
                    if (pIdx !== -1) {
                        const p = currentPlayers[pIdx];
                        const current = p.seasonStats || {
                            gamesPlayed: 0, minutes: 0, points: 0, rebounds: 0, assists: 0,
                            steals: 0, blocks: 0, turnovers: 0, fouls: 0,
                            offensiveRebounds: 0, defensiveRebounds: 0,
                            fgMade: 0, fgAttempted: 0, threeMade: 0, threeAttempted: 0,
                            ftMade: 0, ftAttempted: 0, plusMinus: 0,
                            rimAttempted: 0, midRangeAttempted: 0, rimAssisted: 0, midRangeAssisted: 0, threePointAssisted: 0
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
                                rimAttempted: (current.rimAttempted || 0) + stat.rimAttempted,
                                midRangeAttempted: (current.midRangeAttempted || 0) + stat.midRangeAttempted,
                                rimAssisted: (current.rimAssisted || 0) + stat.rimAssisted,
                                midRangeAssisted: (current.midRangeAssisted || 0) + stat.midRangeAssisted,
                                threePointAssisted: (current.threePointAssisted || 0) + stat.threePointAssisted
                            }
                        };
                    }
                });
            });

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
                pendingUserResult: null,
                socialMediaPosts: updatedSocialPosts,
                seasonGamesPlayed: prev.seasonPhase === 'regular_season' && results.length > 0
                    ? (prev.seasonGamesPlayed ?? 0) + 1
                    : (prev.seasonGamesPlayed ?? 0)
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

                if (series.homeWins === 4 && !series.winnerId) {
                    series.winnerId = series.homeTeamId;
                }
                if (series.awayWins === 4 && !series.winnerId) {
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
                if (currentRound === 4) {
                    const finishedSeasonYear = prev.date.getFullYear(); // Corrected to match Reg Season year

                    // Identify Champion
                    const finalsSeries = updatedPlayoffs.find(s => s.round === 4 && s.winnerId);
                    if (!finalsSeries || !finalsSeries.winnerId) return prev; // Should not happen if roundComplete

                    const championId = finalsSeries.winnerId;
                    const championTeam = prev.teams.find(t => t.id === championId)!;

                    const finalsMvp = calculateFinalsMvp(prev.players, prev.games, championId, prev.playoffs);

                    // Update History
                    const updatedAwardsHistory = [...prev.awardsHistory];
                    const historyIndex = updatedAwardsHistory.findIndex(h => h.year === finishedSeasonYear);
                    const championInfo = { teamId: championTeam.id, teamName: championTeam.name };

                    if (historyIndex !== -1) {
                        updatedAwardsHistory[historyIndex] = {
                            ...updatedAwardsHistory[historyIndex],
                            champion: championInfo,
                            finalsMvp: finalsMvp
                        };
                    } else {
                        // Fallback: Calculate Regular Season Awards now if missing
                        console.warn(`[SimDay] Season History missing for year ${finishedSeasonYear} - Regenerating...`);
                        const regularSeasonAwards = calculateRegularSeasonAwards(prev.players, prev.teams, finishedSeasonYear);

                        updatedAwardsHistory.push({
                            ...regularSeasonAwards,
                            champion: championInfo,
                            finalsMvp: finalsMvp
                        });
                    }

                    // Offseason
                    let archivedPlayers: Player[] = prev.players.map(p => {
                        const newCareerStat: CareerStat = {
                            ...p.seasonStats,
                            season: finishedSeasonYear,
                            teamId: p.teamId || 'FA',
                            overall: p.overall // Store historical OVR
                        };

                        const newCareerStats: CareerStat[] = [...(p.careerStats || []), newCareerStat];

                        // ARCHIVE PLAYOFF STATS if they exist
                        if (p.playoffStats && p.playoffStats.gamesPlayed > 0) {
                            newCareerStats.push({
                                ...p.playoffStats,
                                season: finishedSeasonYear,
                                teamId: p.teamId || 'FA',
                                overall: p.overall, // Store historical OVR
                                isPlayoffs: true
                            });
                        }

                        const updatedPlayer = {
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
                            playoffStats: undefined, // Clear for next season
                            injury: undefined // Heal all injuries for offseason
                        };

                        // CHECK MORALE & TRADE REQUESTS (End of Season)
                        return checkTradeRequests(updatedPlayer);
                    });


                    // --- NEW FINANCIAL FIX: AI Emergency Cuts & Amnesty ---
                    // AI teams in deep debt (-$50M+) will waive their worst-value contracts.
                    let aiUpdatedPlayers = [...archivedPlayers];
                    let aiUpdatedContracts = [...prev.contracts];
                    const aiTeamsInDebt = mapTeamsForSimulation(prev.teams).filter(t => t.id !== prev.userTeamId && t.cash < -50000000);

                    aiTeamsInDebt.forEach(team => {
                        const teamRoster = aiUpdatedPlayers.filter(p => p.teamId === team.id);
                        const teamContracts = aiUpdatedContracts.filter(c => c.teamId === team.id);

                        // Find "Bad Value" players: (Salary > 10% of Cap) AND (OVR < 80)
                        const candidates = teamRoster
                            .filter(p => {
                                const c = teamContracts.find(con => con.playerId === p.id);
                                return c && c.amount > prev.salaryCap * 0.10 && p.overall < 80;
                            })
                            .sort((a, b) => {
                                // Sort by "Value Gap": Salary/OVR ratio
                                const aSalary = teamContracts.find(c => c.playerId === a.id)?.amount || 0;
                                const bSalary = teamContracts.find(c => c.playerId === b.id)?.amount || 0;
                                return (bSalary / b.overall) - (aSalary / a.overall);
                            });

                        if (candidates.length > 0) {
                            const toCut = candidates[0];
                            console.log(`[Financials] ${team.abbreviation} performs Emergency Cut on ${toCut.firstName} ${toCut.lastName} to save salary.`);

                            // 1. Update Player
                            aiUpdatedPlayers = aiUpdatedPlayers.map(p =>
                                p.id === toCut.id ? { ...p, teamId: null, minutes: 0, isStarter: false } : p
                            );

                            // 2. Remove Contract (Amnesty style)
                            aiUpdatedContracts = aiUpdatedContracts.filter(c => c.playerId !== toCut.id);
                        }
                    });

                    // archivedPlayers = runProgression(archivedPlayers); // Disabled for MSSI
                    const newSalaryCap = prev.salaryCap;


                    const activePlayoffs = updatedPlayoffs; // Use the latest state

                    // --- NEW FINANCIAL SYSTEM ---
                    // 1. Calculate Financial Reports for ALL teams first
                    const teamReportsMap: Record<string, any> = {};

                    mapTeamsForSimulation(prev.teams).forEach(t => {
                        const teamContracts = aiUpdatedContracts.filter(c => c.teamId === t.id);
                        teamReportsMap[t.id] = calculateAnnualFinancials(
                            t,
                            teamContracts,
                            prev.salaryCap,
                            LUXURY_TAX_THRESHOLD,
                            t.consecutiveTaxYears || 0
                        );
                    });

                    // 2. League-Wide Calculations (Dynamic Cap + Revenue Sharing)
                    const leagueFinancials = calculateLeagueFinancials(prev.teams, prev.salaryCap, teamReportsMap);

                    const finalSalaryCap = leagueFinancials.newSalaryCap;
                    const distributionPerTeam = leagueFinancials.payoutPerTeam; // Revenue Sharing

                    console.log(`[Financials] Dynamic Cap: $${(prev.salaryCap / 1e6).toFixed(1)}M -> $${(finalSalaryCap / 1e6).toFixed(1)}M`);
                    console.log(`[Financials] Revenue Sharing: $${(distributionPerTeam / 1e6).toFixed(1)}M distributed to ${leagueFinancials.eligibleTeamsCount} teams.`);

                    // 3. Update Teams (Apply reports + Sharing)
                    const updatedTeams = mapTeamsForSimulation(prev.teams).map(t => {
                        const report = teamReportsMap[t.id];
                        // 1. Determine Season Result (Legacy Logic kept for Fan Interest)
                        let result: SeasonResult = 'MISSED_PLAYOFFS';
                        const teamInPlayoffs = activePlayoffs.some(s => s.homeTeamId === t.id || s.awayTeamId === t.id);

                        if (!teamInPlayoffs) {
                            const sortedTeams = [...prev.teams].sort((a, b) => a.wins - b.wins);
                            const rank = sortedTeams.findIndex(st => st.id === t.id);
                            if (rank < 5) result = 'BOTTOM_5';
                        } else {
                            const finals = activePlayoffs.find(s => s.round === 4);
                            const confFinals = activePlayoffs.filter(s => s.round === 3);
                            const semiFinals = activePlayoffs.filter(s => s.round === 2);
                            if (finals?.winnerId === t.id) result = 'CHAMPION';
                            else if (finals?.homeTeamId === t.id || finals?.awayTeamId === t.id) result = 'FINALS_LOSS';
                            else if (confFinals.some(s => s.homeTeamId === t.id || s.awayTeamId === t.id)) result = 'CONF_FINALS_LOSS';
                            else if (semiFinals.some(s => s.homeTeamId === t.id || s.awayTeamId === t.id)) result = 'PLAYOFFS_EARLY_EXIT';
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

                    return {
                        ...prev,
                        players: aiUpdatedPlayers,
                        contracts: aiUpdatedContracts,
                        games: [...prev.games, ...newGames], // Correctly append games instead of overwriting
                        playoffs: updatedPlayoffs,
                        seasonPhase: 'offseason',
                        salaryCap: finalSalaryCap,
                        teams: updatedTeams,
                        awardsHistory: updatedAwardsHistory,
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

                    if (currentRound === 1) {
                        ['West', 'East'].forEach(conf => {
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
                        ['West', 'East'].forEach(conf => {
                            nextRoundSeries.push({
                                id: `${conf}_3_1`, round: 3, conference: conf as any,
                                homeTeamId: getWinner(`${conf}_2_1`), awayTeamId: getWinner(`${conf}_2_2`),
                                homeWins: 0, awayWins: 0
                            });
                        });
                    } else if (currentRound === 3) {
                        nextRoundSeries.push({
                            id: `Finals_4_1`, round: 4, conference: 'Finals',
                            homeTeamId: getWinner('West_3_1'), awayTeamId: getWinner('East_3_1'),
                            homeWins: 0, awayWins: 0
                        });
                    }
                    updatedPlayoffs = [...updatedPlayoffs, ...nextRoundSeries];
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
                const newState = simulateDay(prev);
                return {
                    ...newState,
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

            const westTeams = gameState.teams.filter(t => t.conference === 'West').sort((a, b) => b.wins - a.wins);
            const eastTeams = gameState.teams.filter(t => t.conference === 'East').sort((a, b) => b.wins - a.wins);

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
                        homeTeamId: home ? home.id : 'error',
                        awayTeamId: away ? away.id : 'error',
                        homeWins: 0,
                        awayWins: 0
                    });
                });
                return series;
            };

            const westSeries = createSeries(1, 'West', []);
            const eastSeries = createSeries(1, 'East', []);
            currentPlayoffs = [...westSeries, ...eastSeries];
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

                    while (homeWins < 4 && awayWins < 4) {
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
                    series.winnerId = homeWins === 4 ? series.homeTeamId : series.awayTeamId;
                });

                // 4. GENERATE NEXT ROUND
                let nextPhase = currentPhase;
                const getWinner = (id: string) => currentPlayoffs.find(s => s.id === id)?.winnerId!;
                const nextRoundSeries: PlayoffSeries[] = [];

                if (roundToSim === 1) {
                    nextPhase = 'playoffs_r2';
                    ['West', 'East'].forEach(conf => {
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
                    ['West', 'East'].forEach(conf => {
                        nextRoundSeries.push({
                            id: `${conf}_3_1`, round: 3, conference: conf as any,
                            homeTeamId: getWinner(`${conf}_2_1`), awayTeamId: getWinner(`${conf}_2_2`),
                            homeWins: 0, awayWins: 0
                        });
                    });
                } else if (roundToSim === 3) {
                    nextPhase = 'playoffs_finals';
                    nextRoundSeries.push({
                        id: `Finals_4_1`, round: 4, conference: 'Finals',
                        homeTeamId: getWinner(`West_3_1`),
                        awayTeamId: getWinner(`East_3_1`),
                        homeWins: 0, awayWins: 0
                    });
                } else if (roundToSim === 4) {
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

                // STOP CONDITIONS
                if (simTarget === 'deadline') {
                    const userTeam = prev.teams.find(t => t.id === prev.userTeamId) || prev.teams[0];
                    const gamesPlayed = userTeam.wins + userTeam.losses;
                    if (gamesPlayed >= 40 || prev.seasonPhase !== 'regular_season') {
                        setSimTarget('none');
                        // Stop simulation at deadline. No AI proposals to user.
                        return prev;
                    }
                } else if (simTarget === 'playoffs') {
                    if (prev.seasonPhase !== 'regular_season' && !prev.seasonPhase.startsWith('playoffs')) {
                        setSimTarget('none');
                        return prev;
                    }
                    if (prev.seasonPhase.startsWith('playoffs')) {
                        // Successfully reached playoffs
                        setSimTarget('none');
                        return prev;
                    }
                } else if (simTarget === 'playoffs_end') {
                    // Stop if we are NO LONGER in playoffs (e.g. reached Draft, Offseason, etc)
                    if (!prev.seasonPhase.startsWith('playoffs')) {
                        setSimTarget('none');
                        return prev;
                    }
                    // Otherwise continue simulating
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
        // Transition to Draft
        setGameState(prev => ({
            ...prev,
            seasonPhase: 'draft'
        }));
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

            setGameState({
                ...loadedState,
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
            const canExceedCap = (prev.seasonPhase === 'resigning' && isOwnPlayer) || offer.amount <= VET_MINIMUM;

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

                const { updatedPlayer, report } = calculateProgression(p, focus);
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
            negotiateContract,
            updateRotation,
            updateCoachSettings,
            updateRotationSchedule,
            acceptTradeOffer,
            rejectTradeOffer,
            liveGameData: liveGame,
            startLiveGameFn: startLiveGame,
            endLiveGameFn: endLiveGame,
            startMerchCampaign,
            saveGame,
            loadGame,
            deleteSave,

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
            advanceFreeAgencyDay,
            sellPlayer,
            sellPlayerToTeam
        }}>
            {children}
        </GameContext.Provider>
    );
};

export { GameContext };
