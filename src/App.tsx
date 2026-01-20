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
import { TradeFinderView } from './features/trade/TradeFinderView'; // Import
import { MessageModal } from './features/ui/MessageModal';
import { TradeCenterView } from './features/trade/TradeCenterView';

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
import { GMOverview } from './features/gm/GMOverview';
import { GMSkillTree } from './features/gm/GMSkillTree';
import { NewsFeedView } from './features/news/NewsFeedView';
import { PulseFeed } from './features/news/PulseFeed';
import { LiveGameView } from './features/simulation/LiveGameView';
import { LayoutDashboard, Users, Calendar, Trophy, Settings, ChevronRight, BarChart2, Coins, ArrowRight, Save, LogOut, Check, X, Smartphone, Smile, Frown, ArrowLeftRight, Wallet, Dribbble, Play } from 'lucide-react';

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

function Dashboard({ onSelectGame, onShowResults, onSelectPlayer, onEnterPlayoffs, onSaveExitTrigger, onStartSeasonTrigger, onStartTrainingTrigger, onShowMessage }: {
  onSelectGame: (game: MatchResult) => void,
  onShowResults: () => void,
  onSelectPlayer: (playerId: string) => void,
  onEnterPlayoffs: () => void,
  onSaveExitTrigger: () => void,
  onStartSeasonTrigger: () => void,
  onStartTrainingTrigger: () => void,
  onShowMessage: (title: string, msg: string, type: 'error' | 'info' | 'success') => void
}) {
  const { teams, players, contracts, date, advanceDay, games, triggerDraft, seasonPhase, startRegularSeason, simulateToTradeDeadline, simulateToPlayoffs, userTeamId, awardsHistory, draftClass, retiredPlayersHistory, signPlayerWithContract, executeTrade, currentSaveSlot, startLiveGameFn, dailyMatchups, socialMediaPosts } = useGame();

  const userTeam = teams.find(t => t.id === userTeamId);
  const userMatchup = dailyMatchups.find(m => m.homeId === userTeamId || m.awayId === userTeamId);
  const opponentId = userMatchup ? (userMatchup.homeId === userTeamId ? userMatchup.awayId : userMatchup.homeId) : null;
  const opponent = teams.find(t => t.id === opponentId);

  const gamesPlayed = userTeam ? (userTeam.wins + userTeam.losses) : 0;
  const isTradeDeadlinePassed = gamesPlayed > 40;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' }).format(amount);
  };

  if (!userTeam) return null;

  const handleStartSeason = () => {
    // Check Roster Limits
    const rosterCount = players.filter(p => p.teamId === userTeam.id).length;
    if (rosterCount > 13) {
      onShowMessage('Roster Limit Exceeded', `You have ${rosterCount} players. Max is 13. Please release players before starting the season.`, 'error');
      return;
    }
    // Show Payment Modal via parent prop
    onStartSeasonTrigger();
  };

  // --- MORALE DASHBOARD COMPONENT ---
  const TeamMoraleDashboard = ({ players, teamId, onSelectPlayer }: { players: Player[], teamId: string, onSelectPlayer: (id: string) => void }) => {
    const roster = players.filter(p => p.teamId === teamId);
    if (roster.length === 0) return null;

    const avgMorale = roster.reduce((sum, p) => sum + (p.morale || 50), 0) / roster.length;

    // Major Influencers
    const happyInfluencers = roster
      .filter(p => (p.morale || 50) > 85)
      .sort((a, b) => b.morale - a.morale)
      .slice(0, 2);

    const sadInfluencers = roster
      .filter(p => (p.morale || 50) < 30)
      .sort((a, b) => a.morale - b.morale)
      .slice(0, 2);

    return (
      <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Team Morale Indicator */}
        <div className="glass-panel" style={{ width: '100%', padding: '15px', display: 'flex', alignItems: 'center', gap: '20px', boxSizing: 'border-box' }}>
          <div style={{
            position: 'relative', width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${avgMorale > 70 ? '#2ecc71' : avgMorale < 40 ? '#e74c3c' : '#f1c40f'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold'
          }}>
            {Math.round(avgMorale)}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Team Morale</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
              {avgMorale > 80 ? 'Excellent Chemistry' : avgMorale > 60 ? 'Stable Environment' : avgMorale > 40 ? 'Some Tension' : 'Toxic Locker Room'}
            </div>
          </div>
        </div>

        {/* Influencers */}
        {/* Influencers */}
        <div className="glass-panel" style={{ width: '100%', padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Positive Influence</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {happyInfluencers.length > 0 ? happyInfluencers.map(p => (
                <div key={p.id} onClick={() => onSelectPlayer(p.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '20px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                  <Smile size={14} color="#2ecc71" />
                  <span style={{ fontSize: '0.85rem' }}>{p.lastName}</span>
                </div>
              )) : <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>None</span>}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '0.75rem', color: '#e74c3c', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Negative Influence</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {sadInfluencers.length > 0 ? sadInfluencers.map(p => (
                <div key={p.id} onClick={() => onSelectPlayer(p.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(231, 76, 60, 0.1)', padding: '4px 8px', borderRadius: '20px', border: '1px solid rgba(231, 76, 60, 0.3)' }}>
                  <Frown size={14} color="#e74c3c" />
                  <span style={{ fontSize: '0.85rem' }}>{p.lastName}</span>
                </div>
              )) : <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>None</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- HELPER COMPONENTS ---

  const HeroSection = () => (
    <div style={{
      background: 'var(--surface-glass)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '20px',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: ensureColorVibrancy(userTeam.colors?.primary || '#FF5F1F'),
        filter: 'blur(100px)',
        opacity: 0.15,
        borderRadius: '50%',
        zIndex: 0
      }} />

      {/* Team Background Logo */}
      {/* Team Background Logo */}
      <img
        src={userTeam.logo || `https://a.espncdn.com/i/teamlogos/nba/500/${userTeam.abbreviation === 'UTA' ? 'utah' :
          userTeam.abbreviation === 'NOP' ? 'no' :
            userTeam.abbreviation.toLowerCase()
          }.png`}
        alt=""
        style={{
          position: 'absolute',
          right: '-5%',
          top: '50%',
          transform: 'translateY(-50%) rotate(-10deg)',
          height: '300px',
          width: '350px',
          objectFit: 'contain',
          opacity: 0.35,
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none'; // Fallback to nothing if fails
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* Save & Exit Button (Top Right Absolute) */}


        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            {seasonPhase.replace('_', ' ')} • {formatDate(date)}
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '2.8rem',
            lineHeight: '1.1',
            letterSpacing: '-1.5px',
            background: `linear-gradient(135deg, ${lightenColor(ensureColorVibrancy(userTeam.colors?.primary || '#000000'), 40)}, #ffffff)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.2))'
          }}>
            {userTeam.city}<br />{userTeam.name}
          </h1>
        </div>

        <div style={{
          textAlign: 'right',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          padding: '12px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontWeight: 800, lineHeight: 1, color: 'var(--text)', whiteSpace: 'nowrap', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {userTeam.wins}-{userTeam.losses}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {userTeam.wins > userTeam.losses ? 'Winning Record' : 'Rebuilding'}
          </div>
        </div>
      </div>



      {/* Primary Action Button - Context Aware */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', position: 'relative', zIndex: 2 }}>
        {seasonPhase === 'regular_season' && (
          <>
            <button
              onClick={() => advanceDay()}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: `linear-gradient(135deg, ${ensureColorVibrancy(userTeam.colors?.primary || '#3498db')}, ${ensureColorVibrancy(userTeam.colors?.secondary || '#3498db')})`,
                boxShadow: `0 8px 20px -4px ${ensureColorVibrancy(userTeam.colors?.primary || '#3498db')}80`
              }}
            >
              <LayoutDashboard size={20} />
              Simulate Day
            </button>
            <button
              onClick={() => startLiveGameFn('next')}
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 20px -4px rgba(230, 126, 34, 0.5)'
              }}
            >
              <Play size={20} /> {opponent ? `Play vs ${opponent.abbreviation}` : 'Play Next'}
            </button>

          </>
        )}
        {String(seasonPhase).startsWith('playoffs') && (
          <button
            onClick={onEnterPlayoffs}
            className="btn-primary"
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #f1c40f, #e67e22)',
              color: '#000'
            }}
          >
            <Trophy size={20} />
            Enter Playoffs
          </button>
        )}
        {seasonPhase === 'offseason' && (
          <button
            onClick={triggerDraft}
            className="btn-primary"
            style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}>
            Start Draft
          </button>
        )}
        {seasonPhase === 'pre_season' && (
          <>
            <button
              onClick={onStartTrainingTrigger}
              className="btn-primary"
              style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: '#e67e22' }}
            >
              Training Camp
            </button>
            <button
              onClick={handleStartSeason}
              className="btn-primary"
              style={{ flex: 1, padding: '16px', fontSize: '1.1rem', background: '#27ae60' }}>
              Start Regular Season
            </button>
          </>
        )}
      </div>
    </div>
  );

  const QuickActions = () => {
    if (seasonPhase !== 'regular_season') return null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {!isTradeDeadlinePassed && (
          <button
            onClick={simulateToTradeDeadline}
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text)',
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}
          >
            <ArrowLeftRight size={24} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sim to Deadline</span>
          </button>
        )}
        <button
          onClick={simulateToPlayoffs}
          style={{
            background: 'var(--surface-glass)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text)',
            cursor: 'pointer'
          }}
        >
          <Trophy size={24} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sim to Playoffs</span>
        </button>
      </div>
    );
  };

  const RecentGames = () => {
    // Filter for ONLY User Team games
    const userGames = games.filter(g => g.homeTeamId === userTeam?.id || g.awayTeamId === userTeam?.id);
    // Show last 10 games, reversed (newest first)
    const displayGames = userGames.slice(-10).reverse();

    if (games.length === 0) return (
      <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
        No games played yet.
      </div>
    );

    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Activity</h3>
          <button onClick={onShowResults} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer' }}>See All</button>
        </div>

        {/* Horizontal Scroll Container */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '10px',
          margin: '0 -20px',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}>
          {displayGames.map(game => {
            const home = teams.find(t => t.id === game.homeTeamId);
            const away = teams.find(t => t.id === game.awayTeamId);
            const isUserGame = game.homeTeamId === userTeam?.id || game.awayTeamId === userTeam?.id;

            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                style={{
                  minWidth: '160px',
                  background: (() => {
                    if (!isUserGame) return 'var(--surface-glass)';
                    const color = ensureColorVibrancy(userTeam.colors?.primary || '#3498db');
                    // Handle RGB
                    if (color.startsWith('rgb')) {
                      return `linear-gradient(180deg, ${color.replace(')', ', 0.12)')}, var(--surface-glass))`;
                    }
                    // Handle Hex
                    return `linear-gradient(180deg, ${color}20, var(--surface-glass))`;
                  })(),
                  border: (() => {
                    if (!isUserGame) return '1px solid var(--border)';
                    const color = userTeam.colors?.primary || '#3498db';
                    // Handle RGB
                    if (color.startsWith('rgb')) {
                      return `1px solid ${color.replace(')', ', 0.37)')}`;
                    }
                    // Handle Hex
                    return `1px solid ${color}60`;
                  })(),
                  padding: '16px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, opacity: game.winnerId === game.awayTeamId ? 1 : 0.7 }}>
                  <span>{away?.abbreviation}</span>
                  <span>{game.awayScore}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, opacity: game.winnerId === game.homeTeamId ? 1 : 0.7 }}>
                  <span>{home?.abbreviation}</span>
                  <span>{game.homeScore}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  const RosterPreview = () => (
    <div style={{ paddingBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Team Leaders</h3>
        <div style={{ fontSize: '0.8rem', color: userTeam.salaryCapSpace > 0 ? '#2ecc71' : '#e74c3c' }}>
          Cap: {formatMoney(userTeam.salaryCapSpace)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {players.filter(p => p.teamId === userTeam?.id)
          .sort((a, b) => b.overall - a.overall) // Sort by OVR for the preview
          .slice(0, 5) // Just show top 5
          .map((player) => {
            const stats = player.seasonStats;
            return (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player.id)}
                style={{
                  background: 'var(--surface-glass)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)'
                }}>
                  {player.position}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{player.firstName} {player.lastName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--text)' }}>
                      {stats.gamesPlayed > 0 ? (stats.points / stats.gamesPlayed).toFixed(1) : '0.0'} PPG
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>•</span>
                    <span style={{ color: 'var(--text)' }}>
                      {stats.gamesPlayed > 0 ? (stats.rebounds / stats.gamesPlayed).toFixed(1) : '0.0'} RPG
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>•</span>
                    <span style={{ color: 'var(--text)' }}>
                      {stats.gamesPlayed > 0 ? (stats.assists / stats.gamesPlayed).toFixed(1) : '0.0'} APG
                    </span>
                  </div>
                  {/* Contract Info Line */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {contracts.find(c => c.playerId === player.id) ? (
                      (() => {
                        const c = contracts.find(c => c.playerId === player.id)!;
                        return (
                          <span style={{ color: c.yearsLeft === 1 ? '#e74c3c' : 'var(--text-secondary)' }}>
                            {formatMoney(c.amount)}/yr • {c.yearsLeft === 1 ? 'Expiring' : `${c.yearsLeft} yrs`}
                          </span>
                        );
                      })()
                    ) : (
                      <span style={{ color: '#e74c3c' }}>No Contract</span>
                    )}
                  </div>
                </div>

                {/* Morale Face */}
                <div style={{ marginRight: '8px', width: '24px', height: '24px' }}>
                  {player.morale >= 75 ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  ) : player.morale >= 45 ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="8" y1="15" x2="16" y2="15" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  )}
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  {calculateOverall(player)}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  );

  const Header = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px', marginBottom: '10px' }}>
      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentSaveSlot ? '#2ecc71' : '#e74c3c' }} />
        {currentSaveSlot ? `Slot ${currentSaveSlot} • ${date.getFullYear()}` : 'Unsaved Career'}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSaveExitTrigger();
        }}
        style={{
          background: 'var(--surface-active)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          padding: '8px 16px',
          borderRadius: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        <LogOut size={16} color="var(--text-secondary)" />
        Save & Exit
      </button>
    </div>
  );

  return (
    <div className="responsive-container">
      <Header />
      <HeroSection />
      <div className="dashboard-grid">
        <div style={{ minWidth: 0 }}>
          <QuickActions />
          <RecentGames />
          <RosterPreview />
          <TeamMoraleDashboard players={players} teamId={userTeam.id} onSelectPlayer={onSelectPlayer} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          <div style={{ background: 'var(--surface-glass)', borderRadius: '16px', border: '1px solid var(--border)', padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="var(--primary)" />
              League Pulse
            </h3>
            <PulseFeed posts={socialMediaPosts} onSelectPlayer={onSelectPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
}





function AppContent() {
  const { isInitialized, teams, players, executeTrade, draftClass, draftOrder, handleDraftPick, simulateNextPick, simulateToUserPick, endDraft, signFreeAgent, negotiateContract, signPlayerWithContract, endFreeAgency, games, seasonPhase, contracts, updateRotation, updateCoachSettings, updateRotationSchedule, acceptTradeOffer, rejectTradeOffer, tradeOffer, userTeamId, isSimulating, isProcessing, date, tradeHistory, salaryCap, awardsHistory, retiredPlayersHistory, stopSimulation, advanceDay, currentSaveSlot, saveGame, startRegularSeason, news, liveGameData, startLiveGameFn, endLiveGameFn, tutorialFlags, setHasSeenNewsTutorial, gmProfile } = useGame();





  // Unified Navigation State
  interface NavState {
    view: 'dashboard' | 'standings' | 'trade' | 'stats' | 'leaders' | 'results' | 'playoffs' | 'rotation' | 'transactions' | 'strategy' | 'financials' | 'team_management' | 'team_history' | 'league_history' | 'match' | 'scouting' | 'training' | 'gm_overview' | 'gm_skill_tree';
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

    // Default Phase Views (Draft, etc)
    if (seasonPhase === 'draft') {
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
    }

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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>&larr; Back</button>
          </div>
          <PlayoffView />
        </div>
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
        userTeam={userTeam}
        teams={teams}
        players={players}
        contracts={contracts}
        salaryCap={salaryCap}
        currentYear={date.getFullYear()}
        tradeHistory={tradeHistory || []}
        initialAiPlayerId={initialAiPlayerId}
        initialProposal={prefilledTrade}
        initialTab={view === 'transactions' ? 'log' : 'new'}
        onBack={() => { setView('dashboard'); setInitialAiPlayerId(undefined); }}
        onSelectPlayer={setSelectedPlayerId}
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
        gmProfile={gmProfile}
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

    if (view === 'gm_overview') {
      return (
        <div style={{ paddingBottom: '80px', minHeight: '100%', background: 'var(--background)' }}>
          <GMOverview />
          <div style={{ position: 'fixed', bottom: '80px', right: '20px' }}>
            <button
              onClick={() => setView('gm_skill_tree')}
              className="btn-primary"
              style={{ borderRadius: '50px', padding: '15px 30px' }}
            >
              Skill Tree
            </button>
          </div>
          {/* <Navbar /> */}
        </div>
      );
    }

    if (view === 'gm_skill_tree') {
      return (
        <div style={{ paddingBottom: '80px', minHeight: '100%', background: 'var(--background)' }}>
          <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setView('gm_overview')} style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer' }}>
              &larr; Back
            </button>
          </div>
          <GMSkillTree />
          {/* <Navbar /> */}
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
          {showNews && <NewsFeedView news={news} onClose={() => setShowNews(false)} onTradeForPlayer={startTradeForPlayer} />}
          <NewsTicker
            players={players}
            news={news}
            onClick={() => setShowNews(true)}
            showTutorial={!tutorialFlags.hasSeenNewsTutorial}
            onTutorialClose={setHasSeenNewsTutorial}
          />
          <div style={{ marginTop: '40px' }}> {/* Spacing for fixed ticker */}
            {/* Content continues */}
          </div>
          <Dashboard
            onSelectGame={setSelectedGame}
            onShowResults={() => setView('results')}
            onSelectPlayer={setSelectedPlayerId}
            onEnterPlayoffs={() => {
              setView('playoffs');
              // Maybe trigger play-in logic? For now direct navigation
            }}
            onStartSeasonTrigger={() => setShowPayrollModal(true)}
            onStartTrainingTrigger={() => setView('training')}
            onSaveExitTrigger={() => setShowExitModal(true)}
            onShowMessage={(t, m, y) => setModalMessage({ title: t, msg: m, type: y })}
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
      <div className="app-container">



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
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
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

          {(seasonPhase === 'regular_season' || seasonPhase === 'pre_season' || seasonPhase === 'free_agency') && (
            <button onClick={() => { setView('trade'); setSelectedPlayerId(null); setInitialAiPlayerId(undefined); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: (view === 'trade' || view === 'transactions') ? 'var(--primary)' : '#666', gap: '4px' }}>
              <ArrowLeftRight size={24} />
              <span style={{ fontSize: '10px', fontWeight: 500 }}>Players</span>
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
      {isSimulating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="loader" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <h3 style={{ marginTop: '20px', color: '#fff' }}>Simulating Season...</h3>
          {/* Show User Record */}
          {teams.find(t => t.id === userTeamId) && (
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '10px 0' }}>
              {teams.find(t => t.id === userTeamId)!.wins} - {teams.find(t => t.id === userTeamId)!.losses}
            </div>
          )}
          <p style={{ color: '#aaa' }}>{seasonPhase === 'regular_season' ? 'Playing Games' : 'Playoffs In Progress'}</p>
          <button
            onClick={stopSimulation}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#e74c3c', // Red for stop
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>■</span> Stop
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
            startRegularSeason();
            setShowPayrollModal(false);
          }}
          onCancel={() => setShowPayrollModal(false)}
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
  )
}

function App() {
  console.log('App rendering');
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
export default App
