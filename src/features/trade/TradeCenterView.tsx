import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
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
    onSelectTeam: (teamId: string) => void; // New prop for team navigation
    onBack: () => void;
    initialTab?: 'new' | 'block' | 'log' | 'freeAgents' | 'injuries';
    onSignFreeAgent: (playerId: string) => void;
    gmProfile?: any;
    draftOrder?: string[];
    seasonPhase?: string;
}

import { PageHeader } from '../ui/PageHeader';

// ...

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
    onSelectTeam,
    onBack,
    initialTab = 'new',
    onSignFreeAgent,
    gmProfile,
    draftOrder,
    seasonPhase
}) => {
    const [activeTab, setActiveTab] = useState<'new' | 'block' | 'log' | 'freeAgents' | 'injuries'>(initialTab);
    const [showTradeDropdown, setShowTradeDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowTradeDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTitle = () => {
        switch (activeTab) {
            case 'new': return 'Trade Center';
            case 'block': return 'Trading Block';
            case 'freeAgents': return 'Free Agency';
            case 'injuries': return 'Injury Report';
            case 'log': return 'Trade History';
            default: return 'Trade Center';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 0 20px' }}>
                <PageHeader
                    title={getTitle()}
                    onBack={onBack}
                >
                    {/* Top Toggle Bar - Custom Segmented Control with Dropdown */}
                    <div style={{
                        display: 'flex',
                        background: 'var(--surface)',
                        padding: '4px',
                        borderRadius: '8px',
                        position: 'relative',
                        border: '1px solid var(--border)',
                        gap: '2px',
                        width: 'fit-content',
                        margin: '0 auto'
                    }}>
                        {/* Trade Dropdown Group */}
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                onClick={() => setShowTradeDropdown(!showTradeDropdown)}
                                style={{
                                    padding: '8px 16px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: (activeTab === 'new' || activeTab === 'block') ? '#fff' : 'var(--text-secondary)',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                {(activeTab === 'new' || activeTab === 'block') && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'var(--primary)',
                                        borderRadius: '6px',
                                        zIndex: -1,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                    }} />
                                )}
                                Trade <ChevronDown size={14} />
                            </button>

                            {/* Dropdown Menu */}
                            {showTradeDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '120%',
                                    left: 0,
                                    minWidth: '160px',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    padding: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    zIndex: 100
                                }}>
                                    <button
                                        onClick={() => { setActiveTab('new'); setShowTradeDropdown(false); }}
                                        style={{
                                            padding: '10px 12px',
                                            textAlign: 'left',
                                            background: activeTab === 'new' ? 'var(--surface-active)' : 'transparent',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: activeTab === 'new' ? '#fff' : 'var(--text-secondary)',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Propose Trade
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('block'); setShowTradeDropdown(false); }}
                                        style={{
                                            padding: '10px 12px',
                                            textAlign: 'left',
                                            background: activeTab === 'block' ? 'var(--surface-active)' : 'transparent',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: activeTab === 'block' ? '#fff' : 'var(--text-secondary)',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Trading Block
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Standard Tabs */}
                        {['freeAgents', 'injuries', 'log'].map((tab) => {
                            const isActive = activeTab === tab;
                            const labels: Record<string, string> = {
                                'freeAgents': 'Free Agents',
                                'injuries': 'Injuries',
                                'log': 'History'
                            };
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: isActive ? '#fff' : 'var(--text-secondary)',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'var(--primary)',
                                            borderRadius: '8px',
                                            zIndex: -1,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }} />
                                    )}
                                    {labels[tab]}
                                </button>
                            );
                        })}
                    </div>
                </PageHeader>
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
                        onSelectPlayer={onSelectPlayer}
                        onSelectTeam={onSelectTeam}
                    />
                )}
            </div>
        </div >
    );
};
