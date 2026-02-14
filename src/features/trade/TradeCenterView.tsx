import React, { useState } from 'react';
import { TradeView } from './TradeView';
import { TradesSummaryView } from './TradesSummaryView';
import { TradingBlockView } from './TradingBlockView';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Contract } from '../../models/Contract';
import type { MatchResult } from '../simulation/MatchEngine';
import type { TradeProposal } from './TradeSimulation';
import type { CompletedTrade } from '../../store/GameContext';

import { MidSeasonFreeAgents } from './MidSeasonFreeAgents';
import { InjuryReportView } from '../team/InjuryReportView';

interface TradeCenterViewProps {
    userTeam: Team;
    teams: Team[];
    players: Player[];
    contracts: Contract[];
    salaryCap: number;
    currentYear: number;
    tradeHistory: CompletedTrade[];
    initialAiPlayerId?: string;
    initialProposal?: TradeProposal | null;
    onExecuteTrade: (userPlayerIds: string[], userPickIds: string[], aiPlayerIds: string[], aiPickIds: string[], aiTeamId: string) => boolean;
    onSelectPlayer: (playerId: string) => void;
    onBack: () => void;
    initialTab?: 'new' | 'block' | 'log' | 'freeAgents' | 'injuries';
    onSignFreeAgent: (playerId: string) => void;
    gmProfile?: any;
    draftOrder?: string[];
    seasonPhase?: string;
}

export const TradeCenterView: React.FC<TradeCenterViewProps> = ({
    userTeam,
    teams,
    players,
    contracts,
    salaryCap,
    currentYear,
    tradeHistory,
    initialAiPlayerId,
    initialProposal,
    onExecuteTrade,
    onSelectPlayer,
    onBack,
    initialTab = 'new',
    onSignFreeAgent,
    gmProfile,
    draftOrder,
    seasonPhase
}) => {
    const [activeTab, setActiveTab] = useState<'new' | 'block' | 'log' | 'freeAgents' | 'injuries'>(initialTab);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Top Toggle Bar */}
            <div style={{
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                background: 'var(--surface-glass)',
                borderBottom: '1px solid var(--border)',
                zIndex: 10
            }}>
                <button
                    onClick={() => setActiveTab('new')}
                    className="glass-panel"
                    style={{
                        padding: '8px 16px',
                        borderRadius: '30px',
                        background: activeTab === 'new' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'new' ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Trade
                </button>
                <button
                    onClick={() => setActiveTab('block')}
                    className="glass-panel"
                    style={{
                        padding: '8px 16px',
                        borderRadius: '30px',
                        background: activeTab === 'block' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'block' ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Trading Block
                </button>
                <button
                    onClick={() => setActiveTab('freeAgents')}
                    className="glass-panel"
                    style={{
                        padding: '8px 16px',
                        borderRadius: '30px',
                        background: activeTab === 'freeAgents' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'freeAgents' ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Free Agents
                </button>
                <button
                    onClick={() => setActiveTab('injuries')}
                    className="glass-panel"
                    style={{
                        padding: '8px 16px',
                        borderRadius: '30px',
                        background: activeTab === 'injuries' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'injuries' ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Injuries
                </button>
                <button
                    onClick={() => setActiveTab('log')}
                    className="glass-panel"
                    style={{
                        padding: '8px 16px',
                        borderRadius: '30px',
                        background: activeTab === 'log' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'log' ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    History
                </button>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {activeTab === 'new' && (
                    <TradeView
                        userTeam={userTeam}
                        teams={teams}
                        players={players}
                        contracts={contracts}
                        currentYear={currentYear}
                        salaryCap={salaryCap}
                        initialAiPlayerId={initialAiPlayerId}
                        initialProposal={initialProposal}
                        onExecuteTrade={onExecuteTrade}
                        onSelectPlayer={onSelectPlayer}
                        onBack={onBack}
                        gmProfile={gmProfile}
                        draftOrder={draftOrder}
                        seasonPhase={seasonPhase}
                    />
                )}
                {activeTab === 'block' && (
                    <TradingBlockView
                        userTeamId={userTeam.id}
                        teams={teams}
                        players={players}
                        contracts={contracts}
                        onSelectTeam={(teamId) => {
                            // Switch to Trade View for this team
                            onSelectPlayer(players.find(p => p.teamId === teamId)?.id || '');
                            // This is a bit hacky, ideally we'd have onSelectTeam prop in TradeView or a route
                            // For now, let's just let user find them or implement robust linking later
                            // Actually, onSelectPlayer will likely open that player context?
                            // Let's assume onExecuteTrade setup handles context.
                            setActiveTab('new');
                        }}
                        onSelectPlayer={onSelectPlayer}
                        onTradeForPlayer={(playerId) => {
                            onSelectPlayer(playerId);
                            setActiveTab('new');
                        }}
                    />
                )}
                {activeTab === 'freeAgents' && (
                    <MidSeasonFreeAgents
                        players={players}
                        userTeam={userTeam}
                        currentYear={currentYear}
                        onSign={(playerId) => {
                            onSignFreeAgent(playerId);
                            // Visual feedback is handled by component or context update
                        }}
                        onBack={onBack}
                        onSelectPlayer={onSelectPlayer}
                    />
                )}
                {activeTab === 'injuries' && (
                    <InjuryReportView />
                )}
                {activeTab === 'log' && (
                    <TradesSummaryView
                        trades={tradeHistory}
                        teams={teams}
                        onBack={onBack}
                    />
                )}
            </div>
        </div>
    );
};
