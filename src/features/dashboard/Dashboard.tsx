import React from 'react';
import { useGame } from '../../store/GameContext';
import { HeroSection } from './HeroSection';
import { SimControls } from './SimControls';
import { MatchupCard } from './MatchupCard';
import { TeamLeaders } from './TeamLeaders';
import { RosterPreview } from './RosterPreview';
import { RecentGames } from './RecentGames';
import { Header } from '../ui/Header';
import { PulseFeed } from '../news/PulseFeed';
import { FranchiseHub } from './FranchiseHub';
import { TeamMoraleDashboard } from './TeamMoraleDashboard';
import type { MatchResult } from '../simulation/SimulationTypes';
import { TrendingUp, Wallet, Home, Users, Trophy, DollarSign, Smartphone, Save } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { motion } from 'framer-motion';

interface DashboardProps {
    onSelectGame: (game: MatchResult) => void;
    onShowResults: () => void;
    onSelectPlayer: (playerId: string) => void;
    onEnterPlayoffs: () => void;
    onSaveExitTrigger: () => void;
    onStartSeasonTrigger: () => void;
    onStartTrainingTrigger: () => void;
    onSaveTrigger: () => void;
    onShowMessage: (title: string, msg: string, type: 'error' | 'info' | 'success') => void;
    onViewStandings?: () => void;
    onViewFinancials?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    onSelectGame,
    onShowResults,
    onSelectPlayer,
    onEnterPlayoffs,
    onSaveExitTrigger,
    onStartSeasonTrigger,
    onStartTrainingTrigger,
    onSaveTrigger,
    onShowMessage,
    onViewStandings,
    onViewFinancials
}) => {
    const {
        seasonPhase,
        seasonGamesPlayed,
        userTeamId,
        players,
        socialMediaPosts,
        teams,
        salaryCap,
        contracts
    } = useGame();

    const userTeam = teams.find(t => t.id === userTeamId);
    const isSeasonComplete = seasonPhase === 'regular_season' && seasonGamesPlayed >= 82;

    const gameLabel = isSeasonComplete
        ? "Season Complete"
        : (seasonPhase === 'regular_season'
            ? `Game ${Math.min(seasonGamesPlayed + 1, 82)}/82`
            : seasonPhase.charAt(0).toUpperCase() + seasonPhase.slice(1).replace('_', ' '));
    // Dynamic Standings Position
    const getStandingsPosition = () => {
        if (!userTeam) return "N/A";
        const conferenceTeams = teams.filter(t => t.conference === userTeam.conference);
        const sorted = [...conferenceTeams].sort((a, b) => {
            const winPctA = a.wins / (a.wins + a.losses || 1);
            const winPctB = b.wins / (b.wins + b.losses || 1);
            if (winPctB !== winPctA) return winPctB - winPctA;
            return b.wins - a.wins;
        });
        const rank = sorted.findIndex(t => t.id === userTeamId) + 1;
        const j = rank % 10, k = rank % 100;
        if (j === 1 && k !== 11) return rank + "st";
        if (j === 2 && k !== 12) return rank + "nd";
        if (j === 3 && k !== 13) return rank + "rd";
        return rank + "th";
    };

    // Cap Room Calculation
    const getCapRoom = () => {
        if (!userTeam) return "$0M";
        const teamContracts = contracts.filter(c => c.teamId === userTeamId && c.yearsLeft > 0);
        const totalSalary = teamContracts.reduce((sum, c) => sum + c.amount, 0);
        const room = salaryCap - totalSalary;
        return `$${Math.round(room / 1000000)}M`;
    };

    const handleStartSeason = () => {
        const rosterCount = players.filter(p => p.teamId === userTeamId).length;
        if (rosterCount > 13) {
            onShowMessage('Roster Limit Exceeded', `You have ${rosterCount} players. Max is 13. Please release players before starting the season.`, 'error');
            return;
        }
        onStartSeasonTrigger();
    };

    const MiniStat = ({ title, value, subValue, icon: Icon, onClick }: any) => (
        <DashboardCard
            variant="white"
            title={title}
            icon={<Icon size={14} />}
            style={{ flex: 1, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
        >
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1A1A1A' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{subValue}</div>
        </DashboardCard>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: '#121212',
            backgroundImage: 'radial-gradient(circle at top left, rgba(var(--primary-rgb), 0.1), transparent), radial-gradient(circle at bottom right, rgba(255,255,255,0.05), transparent)',
            color: 'white',
            paddingBottom: '120px'
        }}>
            {/* Header Area */}
            <div style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <span style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '-0.2px' }}>{userTeam?.abbreviation} • <span style={{ opacity: 0.6 }}>{gameLabel}</span></span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onSaveTrigger} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 18px', color: 'white', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <Save size={16} /> Save
                    </button>
                    <button onClick={onSaveExitTrigger} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 18px', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                        Exit
                    </button>
                </div>
            </div>

            <main style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>

                {/* 1. Hero Card */}
                <HeroSection
                    onEnterPlayoffs={onEnterPlayoffs}
                    onStartSeasonTrigger={handleStartSeason}
                    onStartTrainingTrigger={onStartTrainingTrigger}
                />

                {/* 2. Sim Controls */}
                <SimControls />

                {/* 3. Matchup / Next Up */}
                <MatchupCard />

                {/* 4. Mini Stats Grid */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <DashboardCard
                        variant="glass"
                        title="Standings"
                        icon={<TrendingUp size={14} />}
                        style={{ flex: 1, cursor: onViewStandings ? 'pointer' : 'default' }}
                        onClick={onViewStandings}
                    >
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>{getStandingsPosition()}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{userTeam?.conference || 'League'} Rank</div>
                    </DashboardCard>

                    <DashboardCard
                        variant="glass"
                        title="Cap Space"
                        icon={<DollarSign size={14} />}
                        style={{ flex: 1, cursor: onViewFinancials ? 'pointer' : 'default' }}
                        onClick={onViewFinancials}
                    >
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>{getCapRoom()}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>Available Room</div>
                    </DashboardCard>
                </div>

                {/* 5. Recent Games / Form */}
                <RecentGames onSelectGame={onSelectGame} />

                {/* 6. Leaders */}
                <TeamLeaders onSelectPlayer={onSelectPlayer} />

                {/* 7. Chemistry */}
                <TeamMoraleDashboard players={players} teamId={userTeamId || ''} onSelectPlayer={onSelectPlayer} />

                {/* 8. Pulse */}
                <DashboardCard title="League Pulse" icon={<Smartphone size={16} />} variant="glass">
                    <PulseFeed posts={socialMediaPosts} onSelectPlayer={onSelectPlayer} />
                </DashboardCard>

            </main>
        </div>
    );
};
