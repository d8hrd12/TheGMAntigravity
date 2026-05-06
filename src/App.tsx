import { GameProvider, useGame } from './store/GameContext';
import { formatDate } from './utils/dateUtils';
import { useState, useEffect, useRef, useMemo } from 'react';
import type { Player } from './models/Player'; 
import { LeagueView } from './features/league/LeagueView';
import { AwardsPopup } from './features/awards/AwardsPopup';
import type { SeasonAwards } from './models/Awards';
import { TeamStatsView } from './features/stats/TeamStatsView';
import { MainMenu } from './features/menu/MainMenu';
import { TradeView } from './features/trade/TradeView';
import { ExpansionDraftView } from './features/draft/ExpansionDraftView';
import { DraftSummaryView } from './features/draft/DraftSummaryView'; 
import { TradeFinderView } from './features/trade/TradeFinderView'; 
import { MessageModal } from './features/ui/MessageModal';
import { TradeCenterView } from './features/trade/TradeCenterView';
import { Dashboard } from './features/dashboard/Dashboard';
import { LeagueLeaders } from './features/stats/LeagueLeaders';
import { NewsTicker } from './features/ui/NewsTicker';
import { GameResultsView } from './features/simulation/GameResultsView';
import { BoxScoreView } from './features/simulation/BoxScoreView';
import { LiveGameView } from './features/simulation/LiveGameView';
import { simulateMatch } from './features/simulation/MatchEngine';
import type { MatchResult } from './features/simulation/SimulationTypes';
import type { TradeProposal } from './models/TradeProposal';
import { PlayerDetailView } from './features/player/PlayerDetailView';
import { PlayoffView } from './features/league/PlayoffView';
import { RotationView } from './features/team/RotationView';
import { calculateOverall } from './utils/playerUtils';
import { ensureColorVibrancy } from './utils/colorUtils';
import { 
  ChevronLeft, Menu, X, Star, Users, Trophy, Newspaper, UserCircle, Globe,
  Home, ArrowLeftRight, Settings, Play, LayoutDashboard, BarChart2, Dribbble, 
  Wallet, Calendar, ChevronRight, Coins, ArrowRight, Save, LogOut, Check, 
  Smartphone, Smile, Frown, Gamepad2, Cpu, Rocket, Layout, Briefcase, 
  DollarSign, Activity 
} from 'lucide-react';
import { TeamHistoryView } from './features/team/TeamHistoryView';
import { LeagueHistoryView } from './features/info/LeagueHistoryView';
import { NewsFeedView } from './features/news/NewsFeedView';
import { TeamSelectionView } from './features/ui/TeamSelectionView';
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
import { HistoryView } from './features/history/HistoryView';
import { SaveExitModal } from './features/ui/SaveExitModal';
import { PayrollConfirmationModal } from './features/ui/PayrollConfirmationModal';
import { TransactionsView } from './features/info/TransactionsView';
import { PlayerLeagueListView } from './features/info/PlayerLeagueListView';
import { AllTimeLeadersView } from './features/info/AllTimeLeadersView';
import ScoutingView from './features/ui/ScoutingView';
import { TeamRecordsView } from './features/info/TeamRecordsView';
import { DraftView } from './features/draft/DraftView';
import { FreeAgencyView } from './features/free_agency/FreeAgencyView';
import { TrainingView } from './features/training/TrainingView';
import { OffseasonMenuView } from './features/offseason/OffseasonMenuView';
import { TrainingReportView } from './features/training/TrainingReportView';
import { GMProfile } from './components/team/GMProfile';
import { GMListView } from './features/league/GMListView';
import { App as CapApp } from '@capacitor/app';

function AppContent() {
  const gameData = useGame();
  console.log('[AppContent] Context retrieved successfully');
  const {
    view, setView,
    date, seasonPhase,
    teams, userTeamId,
    isInitialized,
    selectedPlayerId, setSelectedPlayerId,
    selectedGame, setSelectedGame,
    currentNegotiation,
    showingAwards, setShowingAwards,
    showSaveLoad, setShowSaveLoad,
    showExitModal, setShowExitModal,
    showPayrollModal, setShowPayrollModal,
    modalMessage, setModalMessage,
    saveGame, advanceDay, stopSimulation,
    isSimulating, simTarget,
    isProcessing,
    seasonGamesPlayed,
    liveGameData,
    isFirstSeasonPaid,
    paySalaries,
    startRegularSeason,
    contracts,
    tradeOffer, acceptTradeOffer, rejectTradeOffer,
    shopPlayerId, setShopPlayerId,
    setPrefilledTrade,
    setInitialAiPlayerId,
    players,
    updateRotation,
    executeTrade,
    salaryCap,
    initialAiPlayerId,
    prefilledTrade,
    coaches,
    completeLiveGame,
    games,
    news,
    tradeHistory,
    signFreeAgent,
    gmProfile,
    draftOrder,
    socialMediaPosts,
    awardsHistory,
    draftClass,
    handleDraftPick,
    simulateNextPick,
    simulateToUserPick,
    endDraft,
    retiredPlayersHistory,
    completeOffseasonTask,
    triggerDraft,
    continueFromRetirements,
    endCoachFreeAgency,
    endResigning,
    endFreeAgency,
    aiGms,
    showAwardsModal
  } = gameData;

  // Trigger awards popup when simulation sets showAwardsModal
  useEffect(() => {
    if (showAwardsModal && awardsHistory.length > 0) {
      setShowingAwards(awardsHistory[awardsHistory.length - 1]);
      // Clear the trigger immediately
      gameData.setGameState(prev => ({ ...prev, showAwardsModal: null }));
    }
  }, [showAwardsModal, awardsHistory]);
  
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedGmId, setSelectedGmId] = useState<string | null>(null);
  
  // Navigation History Stack
  const [history, setHistory] = useState<any[]>([]);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        return;
    }

    const currentEntry = { 
        view, 
        selectedPlayerId, 
        selectedTeamId, 
        selectedGame, 
        selectedGmId 
    };

    setHistory(prev => {
        const lastEntry = prev[prev.length - 1];
        if (lastEntry && 
            lastEntry.view === currentEntry.view && 
            lastEntry.selectedPlayerId === currentEntry.selectedPlayerId &&
            lastEntry.selectedTeamId === currentEntry.selectedTeamId &&
            lastEntry.selectedGame?.id === currentEntry.selectedGame?.id &&
            lastEntry.selectedGmId === currentEntry.selectedGmId) {
            return prev;
        }
        return [...prev, currentEntry];
    });
  }, [view, selectedPlayerId, selectedTeamId, selectedGame, selectedGmId]);

  const handleBack = () => {
    if (history.length <= 1) {
        if (selectedPlayerId) setSelectedPlayerId(null);
        else if (selectedTeamId) setSelectedTeamId(null);
        else if (selectedGame) setSelectedGame(null);
        else if (view !== 'dashboard') setView('dashboard');
        return;
    }

    isNavigatingRef.current = true;
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const prevEntry = newHistory[newHistory.length - 1];
    
    setHistory(newHistory);
    setView(prevEntry.view);
    setSelectedPlayerId(prevEntry.selectedPlayerId);
    setSelectedTeamId(prevEntry.selectedTeamId);
    setSelectedGame(prevEntry.selectedGame);
    setSelectedGmId(prevEntry.selectedGmId);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCache = useRef<Record<string, number>>({});

  useEffect(() => {
    const stateKey = `${view}-${selectedPlayerId || ''}-${selectedGame?.id || ''}-${currentNegotiation || ''}`;
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollCache.current[stateKey] || 0;
    }
  }, [view, selectedPlayerId, selectedGame, currentNegotiation]);

  // SWIPE GESTURE HANDLER
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);

      // Only trigger if:
      // 1. Swipe is to the right (deltaX > 100)
      // 2. Swipe is mostly horizontal (deltaY < 50)
      // 3. Swipe starts from the left edge (touchStartX < 60) - avoids conflict with tables
      if (deltaX > 100 && deltaY < 50 && touchStartX < 60) {
        handleBack();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [view, selectedPlayerId, selectedTeamId, selectedGame]);

  const userTeam = teams.find(t => t.id === userTeamId);

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const navCategories = [
    { 
      id: 'league', 
      label: 'League', 
      icon: <Globe size={20} />,
      items: [
        { id: 'standings', label: 'Standings' },
        { id: 'playoffs', label: 'Playoffs' },
        { id: 'league_history', label: 'History' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'league_gms', label: 'GMs' },
        { id: 'league_all_time', label: 'All-Time Leaders' },
      ]
    },
    { 
      id: 'team', 
      label: 'Team', 
      icon: <Trophy size={20} />,
      items: [
        { id: 'team_roster', label: 'Roster' },
        { id: 'team_stats', label: 'Stats' },
        { id: 'team_history', label: 'History' },
        { id: 'financials', label: 'Finances' },
        { id: 'team_records', label: 'Records' },
        { id: 'team_all_time', label: 'All-Time Leaders' },
      ]
    },
    { 
      id: 'players', 
      label: 'Players', 
      icon: <Users size={20} />,
      items: [
        { id: 'trade', label: 'Market' },
        { id: 'player_list', label: 'Player List' },
        { id: 'player_stats', label: 'Player Stats' },
        { id: 'player_history', label: 'Players Records' },
      ]
    },
    { 
      id: 'news_menu', 
      label: 'News', 
      icon: <Newspaper size={20} />,
      items: [
        { id: 'news', label: 'League News' },
      ]
    },
  ];

  const lastFive = useMemo(() => {
    return games
      .filter(g => g.homeScore !== undefined && (g.homeTeamId === userTeamId || g.awayTeamId === userTeamId))
      .sort((a, b) => b.id.localeCompare(a.id)) 
      .slice(0, 5)
      .map(g => {
        const isHome = g.homeTeamId === userTeamId;
        const userScore = isHome ? g.homeScore! : g.awayScore!;
        const oppScore = isHome ? g.awayScore! : g.homeScore!;
        return userScore > oppScore ? 'W' : 'L';
      }).reverse();
  }, [games, userTeamId]);

  const renderContent = () => {
    if (!isInitialized) return <MainMenu />;
    
    if (liveGameData) {
        const homeTeam = teams.find(t => t.id === liveGameData.home.id);
        const awayTeam = teams.find(t => t.id === liveGameData.away.id);
        if (homeTeam && awayTeam) {
            const homeRoster = players.filter(p => p.teamId === liveGameData.home.id);
            const awayRoster = players.filter(p => p.teamId === liveGameData.away.id);
            const homeCoach = coaches.find(c => c.teamId === liveGameData.home.id);
            const awayCoach = coaches.find(c => c.teamId === liveGameData.away.id);
            return <LiveGameView 
                homeTeam={homeTeam} 
                awayTeam={awayTeam} 
                homeRoster={homeRoster} 
                awayRoster={awayRoster} 
                homeCoach={homeCoach} 
                awayCoach={awayCoach} 
                onGameEnd={completeLiveGame} 
                userTeamId={userTeamId} 
                date={date} 
            />;
        }
    }

    if (selectedPlayerId) {
        let player = players.find(p => p.id === selectedPlayerId);
        
        // Check retired players if not found in active
        if (!player) {
            console.log(`[App] Player ${selectedPlayerId} not found in active roster. Searching retirement history...`);
            (retiredPlayersHistory || []).forEach(history => {
                const found = history.players.find(p => p.id === selectedPlayerId);
                if (found) {
                    player = found;
                }
            });
        }

        if (player) {
            const isRetired = !players.find(p => p.id === player!.id);
            console.log(`[App] Opening detail view for ${player.firstName} ${player.lastName} (Retired: ${isRetired})`);
            const team = teams.find(t => t.id === player!.teamId);
            const contract = contracts.find(c => c.playerId === player!.id);
            return <PlayerDetailView 
                player={player} 
                team={team} 
                teams={teams} 
                contract={contract} 
                onBack={() => setSelectedPlayerId(null)} 
                isUserTeam={!isRetired && player.teamId === userTeamId}
                onShop={() => {
                    if (isRetired) return;
                    setShopPlayerId(player!.id);
                    setSelectedPlayerId(null);
                }}
                onTradeFor={(pid) => {
                    setInitialAiPlayerId(pid);
                    setSelectedPlayerId(null);
                    setView('trade');
                }}
            />;
        }
    }
    
    if (selectedGame) {
        const homeTeam = teams.find(t => t.id === selectedGame.homeTeamId);
        const awayTeam = teams.find(t => t.id === selectedGame.awayTeamId);
        return <BoxScoreView match={selectedGame} homeTeam={homeTeam} awayTeam={awayTeam} onBack={() => setSelectedGame(null)} onSelectPlayer={setSelectedPlayerId} />;
    }
    
    if (selectedTeamId) {
        const team = teams.find(t => t.id === selectedTeamId);
        if (team) {
            return <TeamStatsView 
                players={players} 
                teams={teams}
                userTeamId={userTeamId}
                initialTeamId={selectedTeamId}
                onBack={() => setSelectedTeamId(null)} 
                onSelectPlayer={setSelectedPlayerId} 
                onShowGm={setSelectedGmId}
            />;
        }
    }

    switch (view) {
      case 'league_gms':
        return <GMListView />;
      case 'dashboard': 
        return <Dashboard 
          onSelectGame={setSelectedGame} 
          onSelectPlayer={setSelectedPlayerId} 
          onSelectTeam={setSelectedTeamId}
        />;
      case 'standings': 
        return <LeagueView 
          teams={teams} 
          players={players} 
          awardsHistory={awardsHistory} 
          onBack={() => setView('dashboard')} 
          onSelectPlayer={setSelectedPlayerId} 
          onSelectTeam={setSelectedTeamId} 
        />;
      case 'league_history':
        return <LeagueHistoryView onBack={() => setView('dashboard')} />;
      case 'transactions':
        return <TransactionsView onBack={() => setView('dashboard')} />;
      case 'league_all_time':
        return <AllTimeLeadersView mode="league" onBack={() => setView('dashboard')} />;
      case 'team_roster': 
        return userTeam ? <RotationView 
          players={players.filter(p => p.teamId === userTeamId)} 
          team={userTeam} 
          onBack={() => setView('dashboard')} 
          onSave={updateRotation} 
          onSelectPlayer={setSelectedPlayerId} 
        /> : null;
      case 'team_stats':
        return userTeam ? <TeamStatsView 
          players={players} 
          teams={teams}
          userTeamId={userTeamId}
          initialTeamId={userTeamId}
          onBack={() => setView('dashboard')} 
          onSelectPlayer={setSelectedPlayerId} 
        /> : null;
      case 'team_history':
        return userTeam ? <TeamHistoryView 
          team={userTeam} 
          onBack={() => setView('dashboard')} 
          onSelectPlayer={setSelectedPlayerId} 
        /> : null;
      case 'team_records':
        return <TeamRecordsView onBack={() => setView('dashboard')} />;
      case 'team_all_time':
        return <AllTimeLeadersView mode="team" teamId={userTeamId} onBack={() => setView('dashboard')} />;
      case 'player_list':
        return <PlayerLeagueListView onBack={() => setView('dashboard')} onSelectPlayer={setSelectedPlayerId} initialMode="list" />;
      case 'player_stats':
        return <PlayerLeagueListView onBack={() => setView('dashboard')} onSelectPlayer={setSelectedPlayerId} initialMode="stats" />;
      case 'player_history':
        return <PlayerLeagueListView onBack={() => setView('dashboard')} onSelectPlayer={setSelectedPlayerId} initialMode="history" />;
      case 'trade': 
        return userTeam ? <TradeCenterView 
          userTeam={userTeam} 
          teams={teams} 
          players={players} 
          contracts={contracts} 
          currentYear={date.getFullYear()} 
          salaryCap={salaryCap} 
          initialAiPlayerId={initialAiPlayerId} 
          initialProposal={prefilledTrade} 
          tradeHistory={tradeHistory}
          onExecuteTrade={executeTrade} 
          onSignFreeAgent={signFreeAgent}
          onSelectPlayer={setSelectedPlayerId}
          onSelectTeam={setSelectedTeamId}
          onBack={() => setView('dashboard')} 
          gmProfile={gmProfile}
          draftOrder={draftOrder}
          seasonPhase={seasonPhase}
          seasonGamesPlayed={seasonGamesPlayed}
        /> : null;
      case 'financials': 
        return <TeamFinancialsView 
          onBack={() => setView('dashboard')} 
          onSelectPlayer={setSelectedPlayerId} 
        />;
      case 'news':
        return <NewsFeedView 
            news={news} 
            teams={teams} 
            onClose={() => setView('dashboard')} 
            onSelectPlayer={setSelectedPlayerId} 
            onSelectTeam={setSelectedTeamId} 
        />;
      case 'playoffs':
        return <PlayoffView onBack={() => setView('dashboard')} onNavigate={(v: string) => setView(v)} />;
      case 'offseason_menu':
        return <OffseasonMenuView />;
      case 'retirement':
        return <RetiredPlayersSummaryView onSelectPlayer={setSelectedPlayerId} />;
      case 'scouting':
        return <ScoutingView />;
      case 'draft':
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
        />;
      case 'draft_summary':
        return <DraftSummaryView 
            onSelectPlayer={setSelectedPlayerId} 
            onSelectTeam={setSelectedTeamId} 
            onContinue={() => completeOffseasonTask('draft')} 
        />;
      case 'resigning':
        return <ResigningView 
          onSelectPlayer={setSelectedPlayerId}
          onShowMessage={(title: string, msg: string, type: 'error' | 'info' | 'success') => setModalMessage({ title, msg, type })} 
        />;
      case 'free_agency':
        return <FreeAgencyView 
          onBack={() => setView('offseason_menu')} 
          onComplete={() => completeOffseasonTask('freeAgency')} 
          onSelectPlayer={setSelectedPlayerId}
        />;
      case 'training':
        return <TrainingView onBack={() => setView('offseason_menu')} onSelectPlayer={setSelectedPlayerId} />;
      case 'training_results':
        return <TrainingReportView onBack={() => completeOffseasonTask('trainingResults')} />;
      default: 
        return <Dashboard 
          onSelectGame={setSelectedGame} 
          onSelectPlayer={setSelectedPlayerId} 
          onSelectTeam={setSelectedTeamId}
        />;
    }
  };

  if (!isInitialized) return <MainMenu />;

  const isNavLocked = view === 'draft' || view === 'draft_summary';

  return (
    <div className="app-layout" style={{ '--team-primary': userTeam?.colors?.primary || 'var(--primary)' } as any}>
      {/* SIDEBAR */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <aside className={`sidebar ${isSidebarOpen ? 'expanded' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--team-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Dribbble size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>THE GM 2026™</h2>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Manager v2.0</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: isNavLocked ? 0.5 : 1, pointerEvents: isNavLocked ? 'none' : 'auto' }}>
          <button 
            className={`nav-link ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          {navCategories.map(cat => (
            <div key={cat.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                className={`nav-link ${expandedCategory === cat.id ? 'expanded' : ''}`}
                onClick={() => {
                  if (cat.items.length === 0) {
                    setView(cat.id);
                    setIsSidebarOpen(false);
                  } else {
                    setExpandedCategory(expandedCategory === cat.id ? null : cat.id);
                  }
                }}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {cat.icon}
                  <span>{cat.label}</span>
                </div>
                {cat.items.length > 0 && (
                  <div style={{ transform: expandedCategory === cat.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                    <ChevronRight size={14} />
                  </div>
                )}
              </button>

              {expandedCategory === cat.id && cat.items.length > 0 && (
                <div style={{ paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px', marginBottom: '8px' }}>
                  {cat.items.map(subItem => (
                    <button
                      key={subItem.id}
                      className={`nav-sub-link ${view === subItem.id ? 'active' : ''}`}
                      onClick={() => {
                        setView(subItem.id);
                        setIsSidebarOpen(false);
                      }}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <button className="nav-link" onClick={() => { setShowSaveLoad('save'); setIsSidebarOpen(false); }}>
            <Save size={20} />
            <span>Save Game</span>
          </button>
          <button className="nav-link" style={{ color: 'var(--danger)' }} onClick={() => { setShowExitModal(true); setIsSidebarOpen(false); }}>
            <LogOut size={20} />
            <span>Exit Game</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {isInitialized && !liveGameData && (
          <header className="app-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: 'env(safe-area-inset-top, 10px) 20px 0 20px', minHeight: '60px', gap: '15px' }}>
            {/* Left: Menu */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              {!isNavLocked && (
                <button className="menu-trigger" onClick={() => {
                  setIsSidebarOpen(true);
                  setExpandedCategory(null);
                }}>
                  <Menu size={24} />
                </button>
              )}
            </div>

            {/* Center: Team Info */}
            <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
              {userTeam && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', maxWidth: '100%' }}>
                  <img src={userTeam.logo} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ 
                        fontWeight: '950', 
                        fontSize: '0.85rem', 
                        color: 'var(--text-main)', 
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.5px'
                      }}>
                        {userTeam.name.toUpperCase()}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--team-primary)',
                        background: 'rgba(var(--team-primary-rgb), 0.1)',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        marginLeft: '2px'
                      }}>
                        {date.getFullYear()}
                      </span>
                    </div>
                  </div>
                  {awardsHistory.some(h => h.champion?.teamId === userTeam.id) && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '2px',
                            background: 'linear-gradient(135deg, #FFD700, #DAA520)',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(218, 165, 32, 0.3)',
                            marginLeft: '4px',
                            flexShrink: 0
                        }}>
                            <Star size={10} fill="white" color="white" />
                            <span style={{ 
                                fontSize: '0.7rem', 
                                color: 'white', 
                                fontWeight: 900,
                                lineHeight: 1
                            }}>
                                {awardsHistory.filter(h => h.champion?.teamId === userTeam.id).length}
                            </span>
                        </div>
                    )}
                  </div>
                )}
              </div>

            {/* Awards Popup */}
            {showingAwards && <AwardsPopup awards={showingAwards} onClose={() => setShowingAwards(null)} />}

            {/* Right: Date/Status */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--team-primary)' }}>{userTeam?.wins ?? 0} - {userTeam?.losses ?? 0}</div>
                 <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{seasonPhase.replace('_', ' ')}</div>
              </div>
            </div>
          </header>
        )}

        <main 
          className="main-content" 
          ref={containerRef}
          onScroll={(e) => {
            const stateKey = `${view}-${selectedPlayerId || ''}-${selectedGame?.id || ''}-${currentNegotiation || ''}`;
            scrollCache.current[stateKey] = e.currentTarget.scrollTop;
          }}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: '0 10px'
          }}
        >
          <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* OVERLAYS */}
      {(isSimulating || simTarget !== 'none') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(15px)', zIndex: 20000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {userTeam && (
            <img src={userTeam.logo} alt="" style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }} />
          )}
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>
              {userTeam?.wins} - {userTeam?.losses}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 800, letterSpacing: '0.2em' }}>CURRENT RECORD</div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
            {lastFive.map((res, i) => (
              <div key={i} style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: res === 'W' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', 
                  color: res === 'W' ? '#2ecc71' : '#e74c3c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  border: `1px solid ${res === 'W' ? '#2ecc71' : '#e74c3c'}`
              }}>
                  {res}
              </div>
            ))}
          </div>

          <button onClick={stopSimulation} className="btn-modern" style={{ width: 'auto', padding: '12px 40px', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>CANCEL SIMULATION</button>
        </div>
      )}

      {isProcessing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '30px', height: '30px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      )}

      {tradeOffer && (
        <TradeProposalModal
          offer={tradeOffer as any}
          teams={teams}
          onAccept={acceptTradeOffer}
          onReject={rejectTradeOffer}
          onLookInto={() => {
            setPrefilledTrade(tradeOffer);
            rejectTradeOffer();
            setView('trade');
          }}
        />
      )}
      {shopPlayerId && (
        <TradeFinderView
          shopPlayerId={shopPlayerId}
          onClose={() => setShopPlayerId(null)}
          onAccept={(offer) => {
            setPrefilledTrade(offer);
            setShopPlayerId(null);
            setSelectedPlayerId(null);
            setView('trade');
          }}
          onSelectPlayer={setSelectedPlayerId}
        />
      )}

      {showingAwards && <AwardsPopup awards={showingAwards} onClose={() => setShowingAwards(null)} />}
      {showSaveLoad && <SaveLoadView mode={showSaveLoad} onClose={() => setShowSaveLoad(null)} />}
      {showExitModal && (
        <SaveExitModal 
          onClose={() => setShowExitModal(false)} 
          onSaveAndExit={async (slotId) => {
            await saveGame(slotId);
            window.location.reload();
          }}
        />
      )}
      {selectedGmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: '20px' }}>
            <GMProfile 
                gm={aiGms.find(g => g.id === selectedGmId) || aiGms[0]} 
                onClose={() => setSelectedGmId(null)} 
            />
        </div>
      )}
      {showPayrollModal && (
        <PayrollConfirmationModal 
          payrollAmount={contracts.filter(c => c.teamId === userTeamId).reduce((sum, c) => sum + c.amount, 0)}
          currentCash={teams.find(t => t.id === userTeamId)?.cash || 0}
          onConfirm={() => { 
            if (isFirstSeasonPaid) {
              startRegularSeason(); 
              setShowPayrollModal(false);
            } else {
              if (paySalaries()) {
                startRegularSeason();
                setShowPayrollModal(false);
              } else {
                setModalMessage({ title: 'ERROR', msg: 'INSUFFICIENT CREDITS.', type: 'error' });
              }
            }
          }} 
          onCancel={() => setShowPayrollModal(false)} 
          isFirstSeasonFree={isFirstSeasonPaid}
        />
      )}
      {modalMessage && <MessageModal title={modalMessage.title} message={modalMessage.msg} type={modalMessage.type} onClose={() => setModalMessage(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
