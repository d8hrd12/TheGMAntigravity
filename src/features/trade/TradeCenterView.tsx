import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { TradeView } from './TradeView';
import { TradesSummaryView } from './TradesSummaryView';
import { TradingBlockView } from './TradingBlockView';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Contract } from '../../models/Contract';
import type { CompletedTrade } from '../../store/GameContext';

import { MidSeasonFreeAgents } from './MidSeasonFreeAgents';
import { InjuryReportView } from '../team/InjuryReportView';
import { PageHeader } from '../ui/PageHeader';

interface TradeCenterViewProps {
    userTeam: Team;
    teams: Team[];
    players: Player[];
    contracts: Contract[];
    salaryCap: number;
    currentYear: number;
    tradeHistory: CompletedTrade[];
    initialAiPlayerId?: string;
    initialProposal?: any;
    onExecuteTrade: (userPlayerIds: string[], userPickIds: string[], aiPlayerIds: string[], aiPickIds: string[], aiTeamId: string, transferFee?: number) => boolean;
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
    onBack: () => void;
    initialTab?: 'new' | 'block' | 'log' | 'freeAgents' | 'injuries';
    onSignFreeAgent: (playerId: string) => void;
    gmProfile?: any;
    draftOrder?: string[];
    seasonPhase?: string;
    seasonGamesPlayed?: number;
    leagueType?: 'NBA' | 'EURO';
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
    onSelectTeam,
    onBack,
    initialTab = 'new',
    onSignFreeAgent,
    gmProfile,
    draftOrder,
    seasonPhase,
    seasonGamesPlayed,
    leagueType
}) => {
    const [activeTab, setActiveTab] = useState<'new' | 'block' | 'log' | 'freeAgents' | 'injuries'>(initialTab);
    const [showTradeDropdown, setShowTradeDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        <div style={{ minHeight: '100%', paddingBottom: '140px', background: 'var(--bg-main)' }}>
            <div style={{ padding: '20px 20px 0 20px' }}>
                <PageHeader
                    title={getTitle()}
                    onBack={onBack}
                />
                
                {/* Top Toggle Bar */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-card)',
                    padding: '6px',
                    borderRadius: '12px',
                    position: 'relative',
                    border: '1px solid var(--border-color)',
                    gap: '4px',
                    flexWrap: 'wrap',
                    margin: '16px auto',
                    boxShadow: 'var(--shadow-sm)',
                    justifyContent: 'center'
                }}>
                    {/* Trade Dropdown Group */}
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <button
                            onClick={() => setShowTradeDropdown(!showTradeDropdown)}
                            style={{
                                padding: '8px 16px',
                                background: (activeTab === 'new' || activeTab === 'block') ? 'var(--primary)' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                color: (activeTab === 'new' || activeTab === 'block') ? '#ffffff' : 'var(--text-dim)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                            }}
                        >
                            Trade <ChevronDown size={14} />
                        </button>

                        {/* Dropdown Menu */}
                        {showTradeDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '120%',
                                left: 0,
                                minWidth: '180px',
                                background: '#ffffff',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '6px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 100
                            }}>
                                <button
                                    onClick={() => { setActiveTab('new'); setShowTradeDropdown(false); }}
                                    style={{
                                        padding: '10px 14px',
                                        textAlign: 'left',
                                        background: activeTab === 'new' ? 'var(--bg-card-hover)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'var(--text-main)',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Propose Trade
                                </button>
                                <button
                                    onClick={() => { setActiveTab('block'); setShowTradeDropdown(false); }}
                                    style={{
                                        padding: '10px 14px',
                                        textAlign: 'left',
                                        background: activeTab === 'block' ? 'var(--bg-card-hover)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'var(--text-main)',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
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
                                    background: isActive ? 'var(--primary)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: isActive ? '#ffffff' : 'var(--text-dim)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {labels[tab]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ width: '100%', color: 'var(--text-main)' }}>
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
                        seasonGamesPlayed={seasonGamesPlayed}
                        leagueType={leagueType}
                    />
                )}
                {activeTab === 'block' && (
                    <TradingBlockView
                        userTeamId={userTeam.id}
                        teams={teams}
                        players={players}
                        contracts={contracts}
                        onSelectTeam={(teamId) => {
                            onSelectTeam(teamId);
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
