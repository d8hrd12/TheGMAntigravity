import { GameProvider, useGame } from './store/GameContext';
import { formatDate } from './utils/dateUtils';
import { useState, useEffect, useRef } from 'react';
import type { Player } from './models/Player'; // Added Import
import { LeagueView } from './features/league/LeagueView';
import { AwardsPopup } from './features/awards/AwardsPopup';
import type { SeasonAwards } from './models/Awards';
import { TeamStatsView } from './features/stats/TeamStatsView';
import { MainMenu } from './features/menu/MainMenu';
import { DraftView } from './features/draft/DraftView';
import ScoutingView from './features/ui/ScoutingView';
import { TradeView } from './features/trade/TradeView';
import { ExpansionDraftView } from './features/draft/ExpansionDraftView';
import { DraftSummaryView } from './features/draft/DraftSummaryView'; // New View
import { TradeFinderView } from './features/trade/TradeFinderView'; // Import
import { MessageModal } from './features/ui/MessageModal';
import { TradeCenterView } from './features/trade/TradeCenterView';
import { Dashboard } from './features/dashboard/Dashboard';

import { LeagueLeaders } from './features/stats/LeagueLeaders';
import { NewsTicker } from './features/ui/NewsTicker';
import { GameResultsView } from './features/simulation/GameResultsView';
import { BoxScoreView } from './features/simulation/BoxScoreView';
import { simulateMatch } from './features/simulation/MatchEngine';
import type { MatchResult } from './features/simulation/SimulationTypes';
import type { TradeProposal } from './models/TradeProposal';

import { PlayerDetailView } from './features/player/PlayerDetailView';
import { PlayoffView } from './features/league/PlayoffView';
import { RotationView } from './features/team/RotationView';
import { calculateOverall } from './utils/playerUtils';
import { ensureColorVibrancy } from './utils/colorUtils';
import { TeamSelectionView } from './features/ui/TeamSelectionView';
import { FreeAgencyView } from './features/free_agency/FreeAgencyView';
import { NegotiationView } from './features/negotiation/NegotiationView';
import { CoachSettingsView } from './features/team/CoachSettingsView';
import { TeamManagementView } from './features/team/TeamManagementView';
import { TeamFinancialsView } from './features/team/TeamFinancialsView';
import { TradesSummaryView } from './features/trade/TradesSummaryView';
import { TradeProposalModal } from './features/trade/TradeProposalModal';
import { simulateDailyTrades, generateAiTradeProposalForUser } from './features/trade/TradeSimulation';
import type { SimulatedTradeProposal } from './features/trade/TradeSimulation';
import { ResigningView } from './features/free_agency/ResigningView';
import { SaveLoadView } from './features/ui/SaveLoadView';
import { RetiredPlayersSummaryView } from './features/history/RetiredPlayersSummaryView';
import { TeamHistoryView } from './features/team/TeamHistoryView';
import { HistoryView } from './features/history/HistoryView';
import { SaveExitModal } from './features/ui/SaveExitModal';
import { PayrollConfirmationModal } from './features/ui/PayrollConfirmationModal';
import { LeagueHistoryView } from './features/history/LeagueHistoryView';
import { TrainingView } from './features/training/TrainingView';
import { NewsFeedView } from './features/news/NewsFeedView';
import { PulseFeed } from './features/news/PulseFeed';
import { LiveGameView } from './features/simulation/LiveGameView';
import { LayoutDashboard, Users, Calendar, Trophy, Settings, ChevronRight, BarChart2, Coins, ArrowRight, Save, LogOut, Check, X, Smartphone, Smile, Frown, ArrowLeftRight, Wallet, Dribbble, Play } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';

// Helper to lighten color
const lightenColor = (col: string, amt: number) => {
  // Handle RGB/RGBA strings
  if (col.startsWith('rgb')) {
    const values = col.match(/\d+/g);
    if (values) {
      let r = parseInt(values[0]);
      let g = parseInt(values[1]);
      let b = parseInt(values[2]);

      r = Math.max(0, Math.min(255, r + amt));
      g = Math.max(0, Math.min(255, g + amt));
      b = Math.max(0, Math.min(255, b + amt));

      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
  }

  let usePound = false;
  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}







function AppContent() {
  const { isInitialized, isFirstSeasonPaid, teams, players, executeTrade, draftClass, draftOrder, handleDraftPick, simulateNextPick, simulateToUserPick, endDraft, signFreeAgent, negotiateContract, signPlayerWithContract, endFreeAgency, games, seasonPhase, contracts, updateRotation, updateCoachSettings, updateRotationSchedule, acceptTradeOffer, rejectTradeOffer, tradeOffer, userTeamId, isSimulating, isProcessing, date, tradeHistory, salaryCap, awardsHistory, retiredPlayersHistory, stopSimulation, advanceDay, currentSaveSlot, saveGame, startRegularSeason, startPlayoffs, news, liveGameData, startLiveGameFn, endLiveGameFn, tutorialFlags, setHasSeenNewsTutorial, simTarget, setGameState, paySalaries, isTrainingCampComplete } = useGame();

  // Unified Navigation State
  interface NavState {
    view: 'dashboard' | 'standings' | 'trade' | 'stats' | 'leaders' | 'results' | 'playoffs' | 'rotation' | 'transactions' | 'strategy' | 'financials' | 'team_management' | 'team_history' | 'league_history' | 'match' | 'scouting' | 'training';
    selectedPlayerId: string | null;
    selectedGame: MatchResult | null;

    initialAiPlayerId: string | undefined;
    currentNegotiation: string | null;
    shopPlayerId: string | null;
  }

  const [navState, setNavState] = useState<NavState>({
    view: 'dashboard',
    selectedPlayerId: null,
    selectedGame: null,
    initialAiPlayerId: undefined,
    currentNegotiation: null,
    shopPlayerId: null
  });

  // Destructure for easy access in render
  const { view, selectedPlayerId, selectedGame, initialAiPlayerId, currentNegotiation, shopPlayerId } = navState;

  // Compatibility Setters (Helpers)
  const setView = (v: NavState['view']) => setNavState(prev => ({ ...prev, view: v }));
  const setSelectedPlayerId = (id: string | null) => setNavState(prev => ({ ...prev, selectedPlayerId: id }));
  const setSelectedGame = (g: MatchResult | null) => setNavState(prev => ({ ...prev, selectedGame: g }));
  const setInitialAiPlayerId = (id: string | undefined) => setNavState(prev => ({ ...prev, initialAiPlayerId: id }));
  const setCurrentNegotiation = (id: string | null) => setNavState(prev => ({ ...prev, currentNegotiation: id }));
  const setShopPlayerId = (id: string | null) => setNavState(prev => ({ ...prev, shopPlayerId: id }));

  const [viewTeamId, setViewTeamId] = useState<string | null>(null); // State for Navigation (Still separate as it doesn't affect History deeply yet?)
  const [showSaveLoad, setShowSaveLoad] = useState<'save' | 'load' | null>(null);
  const [prefilledTrade, setPrefilledTrade] = useState<TradeProposal | undefined>(undefined);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<{ title: string, msg: string, type: 'error' | 'info' | 'success' } | null>(null);
  const [showNews, setShowNews] = useState(false);

  const [showingAwards, setShowingAwards] = useState<SeasonAwards | null>(null);
  const isBackNavigating = useRef(false);
  const prevAwardsLength = useRef(awardsHistory.length);
  const prevLastAward = useRef<SeasonAwards | undefined>(awardsHistory[awardsHistory.length - 1]);

  // Watch for new awards or updates (Champion)
  useEffect(() => {
    const currentLast = awardsHistory[awardsHistory.length - 1];

    if (awardsHistory.length > prevAwardsLength.current) {
      // New awards generated (Regular Season End)
      setShowingAwards(currentLast);
    } else if (currentLast && prevLastAward.current &&
      currentLast.year === prevLastAward.current.year &&
      !prevLastAward.current.champion && currentLast.champion) {
      // Champion added (Playoffs End)
      setShowingAwards(currentLast);
    }

    prevAwardsLength.current = awardsHistory.length;
    prevLastAward.current = currentLast;
  }, [awardsHistory]);

  // --- Dynamic Theme Branding ---
  useEffect(() => {
    if (!userTeamId) {
      // Reset to defaults if no team selected
      document.documentElement.style.setProperty('--primary', '#FF5F1F');
      document.documentElement.style.setProperty('--accent', '#FF5F1F');
      document.documentElement.style.setProperty('--primary-glow', 'rgba(255, 95, 31, 0.4)');
      return;
    }

    const team = teams.find(t => t.id === userTeamId);
    if (team && team.colors) {
      const primary = ensureColorVibrancy(team.colors.primary);
      const secondary = ensureColorVibrancy(team.colors.secondary);

      document.documentElement.style.setProperty('--primary', primary);
      document.documentElement.style.setProperty('--accent', secondary);

      // Calculate a subtle glow based on primary color
      const glow = primary.startsWith('#')
        ? `rgba(${parseInt(primary.slice(1, 3), 16)}, ${parseInt(primary.slice(3, 5), 16)}, ${parseInt(primary.slice(5, 7), 16)}, 0.4)`
        : 'rgba(59, 130, 246, 0.4)';
      document.documentElement.style.setProperty('--primary-glow', glow);
    }
  }, [userTeamId, teams]);

  // --- View Synchronization with Phase ---
  useEffect(() => {
    // Automatically switch view based on phase to prevent render loops
    if (seasonPhase === 'scouting' && view !== 'scouting') {
      setView('scouting');
    } else if (seasonPhase !== 'scouting' && view === 'scouting') {
      setView('dashboard');
    }

    // Auto-redirect to Training when in Pre-Season
    if (seasonPhase === 'pre_season' && !isTrainingCampComplete && view !== 'training') {
      setView('training');
    }
    // Draft view handling is tricky as it has its own logic, but let's ensure we don't block manual navigation
    // Actually, Dashboard usually handles the "Start Draft" button.
    // If we want auto-redirect:
    // if (seasonPhase === 'draft' && view !== 'dashboard' && view !== 'draft') {
    //    // Do nothing? 
    // }
  }, [seasonPhase, view]);

  // Initial History State
  useEffect(() => {
    const initialState: NavState = {
      view: 'dashboard',
      selectedPlayerId: null,
      selectedGame: null,
      initialAiPlayerId: undefined,
      currentNegotiation: null,
      shopPlayerId: null
    };
    // Ensure we have a base state
    if (!window.history.state) {
      window.history.replaceState(initialState, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        isBackNavigating.current = true;
        // Atomic update from history state
        setNavState(prev => ({
          ...prev,
          view: event.state.view || 'dashboard',
          selectedPlayerId: event.state.selectedPlayerId || null,
          selectedGame: event.state.selectedGame || null,
          initialAiPlayerId: event.state.initialAiPlayerId || undefined,
          currentNegotiation: event.state.currentNegotiation || null
        }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // --- Android Back Button Handling ---
  useEffect(() => {
    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      console.warn("DEBUG: Android Back Button Pressed", { canGoBack, view });

      // If we are not at the dashboard, or we are in a sub-view of the dashboard (like selectedPlayerId)
      // we try to navigate back.
      if (view !== 'dashboard' || selectedPlayerId || selectedGame || currentNegotiation) {
        window.history.back();
      } else {
        // At dashboard root. We could show an exit modal or just let it close.
        CapApp.exitApp();
      }
    });

    return () => {
      backListener.then(l => l.remove());
    };
  }, [view, selectedPlayerId, selectedGame, currentNegotiation]);

  // Debug Phase Transitions
  useEffect(() => {
    console.warn("DEBUG: App seasonPhase changed to:", seasonPhase);
  }, [seasonPhase]);

  // Sync State changes TO History (Push State)
  useEffect(() => {
    if (isBackNavigating.current) {
      isBackNavigating.current = false;
      return;
    }

    const currentState = {
      view,
      selectedPlayerId,
      selectedGame,
      initialAiPlayerId,
      currentNegotiation
    };

    const stateStr = JSON.stringify(currentState);
    const historyStr = JSON.stringify(window.history.state);

    if (stateStr !== historyStr) {
      window.history.pushState(currentState, '');
    }

  }, [navState]); // Depend on the whole object!


  const startTradeForPlayer = (playerId: string) => {
    setInitialAiPlayerId(playerId);
    setSelectedPlayerId(null);
    setView('trade');
  };

  const userTeam = teams.find(t => t.id === userTeamId);
  const gamesPlayed = userTeam ? (userTeam.wins + userTeam.losses) : 0;
  const isTradeDeadlinePassed = gamesPlayed > 40;

  // Global Back Handler
  const handleBack = () => {
    // Now just trigger native back, which fires popstate, which updates state.
    // Check if we can go back?
    // If we are at root, we might not want to?
    // If state is dashboard and everything null, we are at root.
    if (view === 'dashboard' && !selectedPlayerId && !selectedGame && !currentNegotiation) {
      // We are at root. Do nothing or let system handle exit?
      // User said "gesture control not to close the app", but typically back at root closes app.
      // OR user meant "don't close app when I just want to go back from a deep view".
      // Assuming standard behavior: back() is correct.
      // If history is strictly managed, back() works.
    }
    window.history.back();
  };

  // Render logic moved to renderContent causing duplicate block removal
  // This block was previously the Player Detail View early return. 
  // It is now handled inside renderContent().


  const renderContent = () => {
    if (selectedPlayerId) {
      let player = players.find(p => p.id === selectedPlayerId) || draftClass.find(p => p.id === selectedPlayerId);

      // Search retired players if not found
      if (!player && retiredPlayersHistory) {
        for (const history of retiredPlayersHistory) {
          const retired = history.players.find(p => p.id === selectedPlayerId);
          if (retired) {
            player = retired;
            break;
          }
        }
      }

      if (player) {
        return <PlayerDetailView
          player={player}
          team={teams.find(t => t.id === player.teamId)}
          teams={teams}
          contract={contracts.find(c => c.playerId === player.id)}
          onBack={() => setSelectedPlayerId(null)}
          isUserTeam={player.teamId === userTeamId || (userTeam?.rosterIds.includes(player.id) ?? false)}
          onTradeFor={startTradeForPlayer}
          onShop={() => setShopPlayerId(player.id)}
          onTeamClick={(id) => {
            setViewTeamId(id);
            setView('stats');
            setSelectedPlayerId(null);
          }}
        />
      }
    }



    if (selectedGame) {
      return <BoxScoreView
        match={selectedGame}
        homeTeam={teams.find(t => t.id === selectedGame.homeTeamId)}
        awayTeam={teams.find(t => t.id === selectedGame.awayTeamId)}
        onBack={() => setSelectedGame(null)}
        onSelectPlayer={setSelectedPlayerId}
      />
    } else if (seasonPhase === 'scouting') {
      // NOTE: Redirect handled in useEffect
    }

    if (seasonPhase === 'draft') {
      // NOTE: Redirect logic commented out or handled elsewhere
    }

    if (seasonPhase === 'expansion_draft') {
      return <ExpansionDraftView />;
    }

    if (seasonPhase === 'draft_summary') {
      return <DraftSummaryView
        onSelectPlayer={setSelectedPlayerId}
        onSelectTeam={(id) => {
          setViewTeamId(id);
          setView('stats');
        }}
      />;
    }

    // Default Phase Views (Draft, etc)
    // 1. Explicit View Checks (Navigation overrides Phase)


    if (view === 'standings') {
      return <LeagueView
        teams={teams}
        players={players}
        awardsHistory={awardsHistory}
        onBack={() => setView('dashboard')}
        onSelectPlayer={setSelectedPlayerId}
        onSelectTeam={(id) => {
          setViewTeamId(id);
          setView('stats');
        }}

      />
    }

    if (view === 'playoffs') {
      return (
        <PlayoffView onNavigate={setView} onBack={() => setView('dashboard')} />
      );
    }

    if (view === 'scouting') {
      return <ScoutingView />;
    }

    if (view === 'stats') {
      return <TeamStatsView
        key={viewTeamId || 'stats'}
        players={players}
        teams={teams}
        userTeamId={userTeamId}
        initialTeamId={viewTeamId || undefined}
        onBack={() => {
          setView('dashboard');
        }}
        onSelectPlayer={setSelectedPlayerId}
        onViewHistory={() => setView('team_history')}
        onShowLeagueHistory={() => setView('league_history')}
      />
    }

    if (view === 'results') {
      return <GameResultsView games={games} teams={teams} onBack={() => setView('dashboard')} onSelectGame={setSelectedGame} />
    }

    if (view === 'trade' || view === 'transactions') {
      const userTeam = teams.find(t => t.id === userTeamId);
      if (!userTeam) return <div>Loading...</div>;

      return <TradeCenterView
        userTeam={teams.find(t => t.id === userTeamId)!}
        teams={teams}
        players={players}
        contracts={contracts}
        salaryCap={salaryCap}
        currentYear={date.getFullYear()}
        tradeHistory={tradeHistory}
        initialAiPlayerId={shopPlayerId || initialAiPlayerId}
        initialProposal={prefilledTrade}
        initialTab={view === 'transactions' ? 'log' : 'new'}
        draftOrder={draftOrder}
        seasonPhase={seasonPhase}
        onBack={() => { setView('dashboard'); setInitialAiPlayerId(undefined); }}
        onSelectPlayer={(id) => setSelectedPlayerId(id)}
        onSelectTeam={(teamId) => {
          setViewTeamId(teamId);
          setView('stats');
        }}
        onExecuteTrade={(userP: string[], userPick: string[], aiP: string[], aiPick: string[], aiTeamId: string) => {
          const success = executeTrade(userP, userPick, aiP, aiPick, aiTeamId);
          if (success) {
            setPrefilledTrade(undefined);
            setInitialAiPlayerId(undefined);
            setView('dashboard');
          }
          return success;
        }}
        onSignFreeAgent={(playerId) => {
          // Default MID-SEASON signing logic: 1 Year / Min Salary
          signPlayerWithContract(playerId, { amount: 1000000, years: 1, role: 'Bench' });
        }}
      />;
    }

    if (view === 'rotation') {
      const userTeam = teams.find(t => t.id === userTeamId);
      if (!userTeam) return null; // Should not happen

      return <RotationView
        players={players}
        team={userTeam}
        onBack={() => setView('dashboard')}
        onSelectPlayer={setSelectedPlayerId}
        onSave={(updates) => {
          updateRotation(updates);
          setView('dashboard');
        }}
      />
    }

    if (view === 'team_management') {
      const userTeam = teams.find(t => t.id === userTeamId);
      if (!userTeam) return null;

      return <TeamManagementView
        players={players}
        team={userTeam}
        onBack={() => setView('dashboard')}
        onSelectPlayer={setSelectedPlayerId}
        onSaveRotation={(updates) => {
          updateRotation(updates);
        }}
        onSaveStrategy={(settings) => {
          updateCoachSettings(userTeamId, settings);
        }}
        onSaveSchedule={(schedule) => {
          updateRotationSchedule(userTeamId, schedule);
        }}
      />
    }

    if (view === 'strategy') {
      const userTeam = teams.find(t => t.id === userTeamId);
      if (!userTeam) return null;

      return <CoachSettingsView
        team={userTeam}
        onBack={() => setView('dashboard')}
        onSave={(settings) => {
          updateCoachSettings(userTeamId, settings);
          setView('dashboard');
        }}
      />
    }

    if (view === 'financials') {
      return <TeamFinancialsView onBack={() => setView('dashboard')} onSelectPlayer={setSelectedPlayerId} />;
    }

    // 2. Phase-Specific Views (Acts as Dashboard for that phase)
    if ((seasonPhase as any) === 'draft') {
      return <DraftView
        draftClass={draftClass}
        draftOrder={draftOrder}
        teams={teams}
        userTeamId={userTeamId}
        onPick={handleDraftPick}
        onSimulateNext={simulateNextPick}
        onSimulateToUser={simulateToUserPick}
        onFinish={endDraft}
        onSelectPlayer={setSelectedPlayerId}
      />
    }

    if (seasonPhase === 'retirement_summary') {
      return <RetiredPlayersSummaryView onSelectPlayer={setSelectedPlayerId} />;
    }

    if (seasonPhase === 'resigning') {
      return <ResigningView
        onSelectPlayer={setSelectedPlayerId}
        onShowMessage={(title, msg, type) => setModalMessage({ title, msg, type })}
      />
    }

    if (seasonPhase === 'free_agency') {
      if (currentNegotiation) {
        const player = players.find(p => p.id === currentNegotiation);
        const team = teams.find(t => t.id === userTeamId);
        if (player && team) {
          return <NegotiationView
            player={player}
            team={team}
            onNegotiate={(offer) => negotiateContract(player.id, offer)}
            onSign={(offer) => {
              signPlayerWithContract(player.id, offer);
              setCurrentNegotiation(null);
            }}
            onCancel={() => setCurrentNegotiation(null)}
            onSelectPlayer={(id) => setSelectedPlayerId(id)}
            salaryCap={salaryCap}
          />
        }
      }

      return <FreeAgencyView
        players={players}
        team={teams.find(t => t.id === userTeamId) || teams[0]}
        onSign={(playerId) => setCurrentNegotiation(playerId)}
        onFinish={endFreeAgency}
        onSelectPlayer={(playerId) => setSelectedPlayerId(playerId)}
      />;
    }

    if (view === 'training') {
      return <TrainingView onBack={() => setView('dashboard')} onSelectPlayer={setSelectedPlayerId} />;
    }

    if (view === 'team_history') {
      const team = teams.find(t => t.id === userTeamId);
      if (!team) return <div>Error: Team not found</div>;
      return <TeamHistoryView team={team} onBack={() => setView('stats')} />;
    }

    if (view === 'league_history') {
      return <LeagueHistoryView onBack={() => setView('stats')} />;
    }

    if (view === ('dev_tools' as any)) {
      return (
        <div style={{ padding: '20px', color: 'white' }}>
          <h2>Developer Tools</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => {
              setGameState(prev => ({ ...prev, seasonPhase: 'resigning' }));
              setView('dashboard');
            }}>Force Phase: Resigning</button>
            <button onClick={() => {
              setGameState(prev => ({ ...prev, seasonPhase: 'free_agency', freeAgencyDay: 1 }));
              setView('dashboard');
            }}>Force Phase: Free Agency (Day 1)</button>
            <button onClick={() => {
              setGameState(prev => ({ ...prev, seasonPhase: 'regular_season' }));
              setView('dashboard');
            }}>Force Phase: Regular Season</button>
          </div>
        </div>
      );
    }




    // Live Game Overlay
    if (liveGameData) {
      return (
        <LiveGameView
          homeTeam={liveGameData.home}
          awayTeam={liveGameData.away}
          homeRoster={players.filter(p => p.teamId === liveGameData.home.id)}
          awayRoster={players.filter(p => p.teamId === liveGameData.away.id)}
          onGameEnd={endLiveGameFn}
          userTeamId={userTeamId}
          date={liveGameData.date}
        />
      );
    }

    // Default: Dashboard or Main Menu if not initialized
    if (!isInitialized) {
      return <MainMenu />;
    }

    // Default Dashboard view
    if (view === 'dashboard') {
      return (
        <>
          {showNews && <NewsFeedView teams={teams} news={news} onClose={() => setShowNews(false)} onTradeForPlayer={startTradeForPlayer} />}
          <NewsTicker
            teams={teams}
            players={players}
            news={news}
            onClick={() => setShowNews(true)}
            showTutorial={!tutorialFlags.hasSeenNewsTutorial}
            onTutorialClose={setHasSeenNewsTutorial}
          />

          <Dashboard
            onSelectGame={setSelectedGame}
            onShowResults={() => setView('results')}
            onSelectPlayer={setSelectedPlayerId}
            onEnterPlayoffs={() => {
              startPlayoffs();
              setView('playoffs');
            }}
            onStartSeasonTrigger={() => {
              setShowPayrollModal(true);
            }}
            onStartTrainingTrigger={() => {
              setGameState(prev => ({ ...prev, trainingReport: null, isTrainingCampComplete: false }));
              setView('training');
            }}
            onSaveExitTrigger={() => setShowExitModal(true)}
            onShowMessage={(t, m, y) => setModalMessage({ title: t, msg: m, type: y })}
            onSaveTrigger={async () => {
              if (currentSaveSlot) {
                await saveGame(currentSaveSlot);
                setModalMessage({ title: 'Success', msg: 'Game saved successfully!', type: 'success' });
              } else {
                setModalMessage({ title: 'Error', msg: 'No active save slot found.', type: 'error' });
              }
            }}
            onViewStandings={() => setView('standings')}
            onViewFinancials={() => setView('financials')}
          />
        </>
      );
    }

    // Fallback for any other view not explicitly handled above, should ideally not be reached
    return (
      <div style={{ padding: '20px' }}>
        <h2>Unknown View: {view}</h2>
        <button onClick={() => setView('dashboard')}>Go to Dashboard</button>
      </div>
    );
  };

  return (
    <>
      <div className="safe-area-top-bar" />
      <div className={`app-container ${view === 'dashboard' ? 'with-ticker' : ''}`}>

        {renderContent()}
        {tradeOffer && (
          <TradeProposalModal
            offer={tradeOffer as any}
            teams={teams}
            onAccept={acceptTradeOffer}
            onReject={rejectTradeOffer}
            onLookInto={() => {
              setPrefilledTrade(tradeOffer);
              rejectTradeOffer(); // Close modal (clears offer from context)
              setView('trade');
            }}
          />
        )}
        {shopPlayerId && <TradeFinderView
          shopPlayerId={shopPlayerId}
          onClose={() => setShopPlayerId(null)}
          onAccept={(offer) => {
            // "See Deal" flow
            setPrefilledTrade(offer);
            setShopPlayerId(null);
            setSelectedPlayerId(null); // Fix: Clear player selection so Back button doesn't reopen Player Detail
            setView('trade');
          }}
          onSelectPlayer={setSelectedPlayerId}
        />
        }
      </div>

      {showSaveLoad && (
        <SaveLoadView mode={showSaveLoad} onClose={() => setShowSaveLoad(null)} />
      )}

      {isInitialized && (
        <nav className="nav-glass" style={{
          position: 'fixed',
          bottom: 20, /* Floating effect */
          left: '5%',
          width: '90%',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
          zIndex: 1000,
          border: '1.5px solid var(--primary)', /* Highlight border */
          boxShadow: '0 4px 15px rgba(0,0,0,0.3), 0 0 10px var(--primary-glow)', /* Premium depth with team glow */
        }}>
          <button onClick={() => { setView('dashboard'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: view === 'dashboard' ? 'var(--primary)' : '#666', gap: '4px' }}>
            <LayoutDashboard size={24} />
            <span style={{ fontSize: '10px', fontWeight: 500 }}>Home</span>
          </button>

          <button onClick={() => { setView('stats'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: view === 'stats' ? 'var(--primary)' : '#666', gap: '4px' }}>
            <BarChart2 size={24} />
            <span style={{ fontSize: '10px', fontWeight: 500 }}>My Team</span>
          </button>

          <button onClick={() => { setView('standings'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: view === 'standings' ? 'var(--primary)' : '#666', gap: '4px' }}>
            <Trophy size={24} />
            <span style={{ fontSize: '10px', fontWeight: 500 }}>League</span>
          </button>

          {String(seasonPhase).startsWith('playoffs') && (
            <button onClick={() => { setView('playoffs'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: view === 'playoffs' ? 'var(--primary)' : '#666', gap: '4px' }}>
              <Trophy size={24} />
              <span style={{ fontSize: '10px', fontWeight: 500 }}>Playoffs</span>
            </button>
          )}

          {(seasonPhase === 'regular_season' || seasonPhase === 'pre_season' || seasonPhase === 'free_agency' || seasonPhase === 'draft') && (
            <button onClick={() => { setView('trade'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: (view === 'trade' || view === 'transactions') ? 'var(--primary)' : '#666', gap: '4px' }}>
              <ArrowLeftRight size={24} />
              <span style={{ fontSize: '10px', fontWeight: 500 }}>Players Market</span>
            </button>
          )}

          {(seasonPhase === 'regular_season' || seasonPhase === 'pre_season' || seasonPhase === 'free_agency' || String(seasonPhase).startsWith('playoffs') || seasonPhase === 'resigning' || seasonPhase === 'draft') && (
            <>
              <button onClick={() => { setView('team_management'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: (view === 'team_management' || view === 'rotation' || view === 'strategy') ? 'var(--primary)' : '#666', gap: '4px' }}>
                <Dribbble size={24} />
                <span style={{ fontSize: '10px', fontWeight: 500 }}>OnCourt</span>
              </button>

              <button onClick={() => { setView('financials'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: view === 'financials' ? 'var(--primary)' : '#666', gap: '4px' }}>
                <Wallet size={24} />
                <span style={{ fontSize: '10px', fontWeight: 500 }}>Money</span>
              </button>
            </>
          )}


        </nav>
      )}
      {(isSimulating || simTarget !== 'none') && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 20000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="loader" style={{ width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <h3 style={{ marginTop: '20px', color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>Simulating Season...</h3>
          {/* Show User Record */}
          {teams.find(t => t.id === userTeamId) && (
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', margin: '15px 0' }}>
              {teams.find(t => t.id === userTeamId)!.wins} - {teams.find(t => t.id === userTeamId)!.losses}
            </div>
          )}
          <p style={{ color: '#ccc', fontSize: '1.1rem' }}>{seasonPhase === 'regular_season' ? 'Simulating Games...' : 'Playoffs In Progress'}</p>
          <button
            onClick={() => {
              console.log("Stop Multi-Day Sim Clicked");
              stopSimulation();
            }}
            style={{
              marginTop: '25px',
              padding: '10px 24px',
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)', // Red glow
              pointerEvents: 'auto',
              zIndex: 20001,
              transition: 'transform 0.2s, background 0.2s'
            }}
          >
            <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '2px' }} />
            Stop Simulation
          </button>
        </div>
      )}
      {isProcessing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div className="loader" style={{ width: '60px', height: '60px', border: '5px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <h2 style={{ color: 'white', marginTop: '30px', letterSpacing: '2px', fontWeight: '800' }}>SIMULATING</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Please wait while we calculate the results...</p>
        </div>
      )}
      {showingAwards && (
        <AwardsPopup
          awards={showingAwards}
          onClose={() => setShowingAwards(null)}
        />
      )}

      {showExitModal && (
        <SaveExitModal
          onClose={() => setShowExitModal(false)}
          onSaveAndExit={async (slotId) => {
            await saveGame(slotId);
            window.location.reload();
          }}
        />
      )}
      {showPayrollModal && (
        <PayrollConfirmationModal
          payrollAmount={contracts.filter(c => c.teamId === userTeamId).reduce((sum, c) => sum + c.amount, 0)}
          currentCash={teams.find(t => t.id === userTeamId)?.cash || 0}
          onConfirm={() => {
            if (isFirstSeasonPaid) {
              startRegularSeason(); // Will handle logic to set isFirstSeasonPaid = false
              setShowPayrollModal(false);
            } else {
              if (paySalaries()) {
                startRegularSeason();
                setShowPayrollModal(false);
              } else {
                setModalMessage({ title: 'Error', msg: 'Insufficient funds.', type: 'error' });
              }
            }
          }}
          onCancel={() => setShowPayrollModal(false)}
          isFirstSeasonFree={isFirstSeasonPaid}
        />
      )}

      {modalMessage && (
        <MessageModal
          title={modalMessage.title}
          message={modalMessage.msg}
          type={modalMessage.type}
          onClose={() => setModalMessage(null)}
        />
      )}
    </>
  );
};




function App() {
  console.log('App rendering');
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
export default App
