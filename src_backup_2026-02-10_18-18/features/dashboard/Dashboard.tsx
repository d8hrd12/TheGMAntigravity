import React from 'react';
import { useGame } from '../../store/GameContext';
import { HeroSection } from './HeroSection';
import { SimControls } from './SimControls';
import { MatchupCard } from './MatchupCard';
import { TeamLeaders } from './TeamLeaders'; // Replaced QuickStats
import { RosterPreview } from './RosterPreview';
import { RecentGames } from './RecentGames';
import { TeamMoraleDashboard } from './TeamMoraleDashboard';
import { Header } from '../ui/Header';
import { PulseFeed } from '../news/PulseFeed';
import { Smartphone } from 'lucide-react';
import type { MatchResult } from '../simulation/SimulationTypes';

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
    onShowMessage
}) => {
    const { players, userTeamId, socialMediaPosts } = useGame();

    return (
        <div className="responsive-container">
            <Header onSaveTrigger={onSaveTrigger} onSaveExitTrigger={onSaveExitTrigger} />
            <HeroSection
                onEnterPlayoffs={onEnterPlayoffs}
                onStartSeasonTrigger={onStartSeasonTrigger}
                onStartTrainingTrigger={onStartTrainingTrigger}
            />

            <SimControls />

            <div className="dashboard-grid">
                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <MatchupCard />
                        <TeamLeaders />
                    </div>
                    <RecentGames onSelectGame={onSelectGame} />
                    <RosterPreview onSelectPlayer={onSelectPlayer} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
                    {/* News/Pulse Feed */}
                    <div style={{ background: 'var(--surface-glass)', borderRadius: '16px', border: '1px solid var(--border)', padding: '16px' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Smartphone size={18} color="var(--primary)" />
                            League Pulse
                        </h3>
                        <PulseFeed posts={socialMediaPosts} onSelectPlayer={onSelectPlayer} />
                    </div>

                    <TeamMoraleDashboard players={players} teamId={userTeamId} onSelectPlayer={onSelectPlayer} />
                </div>
            </div>
        </div>
    );
};
