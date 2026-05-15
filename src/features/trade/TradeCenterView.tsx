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
        <div style={{ minHeight: '100vh', background: '#ffffff', paddingBottom: '140px' }}>
            <div style={{ padding: '0' }}>
                <PageHeader
                    title={getTitle()}
                    subtitle={
                        activeTab === 'new' ? 'Propose player swaps & picks' :
                        activeTab === 'block' ? 'Players available for trade' :
                        activeTab === 'freeAgents' ? 'Sign mid-season talent' :
                        activeTab === 'injuries' ? 'League health & recovery' :
                        'Historical transaction logs'
                    }
                    onBack={onBack}
                    teamColor="#111111"
                />
                
                <div style={{ padding: '0 24px' }}>
                    <div style={{
                        display: 'flex',
                        background: '#f2f2f7',
                        padding: '6px',
                        borderRadius: '100px',
                        position: 'relative',
                        gap: '4px',
                        width: 'fit-content',
                        margin: '24px auto',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        justifyContent: 'center',
                        zIndex: 100
                    }}>
                        {/* Trade Dropdown Group */}
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                onClick={() => setShowTradeDropdown(!showTradeDropdown)}
                                style={{
                                    padding: '10px 20px',
                                    background: (activeTab === 'new' || activeTab === 'block') ? '#111111' : 'transparent',
                                    border: 'none',
                                    borderRadius: '100px',
                                    color: (activeTab === 'new' || activeTab === 'block') ? '#ffffff' : '#8e8e93',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                Trade <ChevronDown size={14} />
                            </button>

                            {/* Dropdown Menu */}
                            {showTradeDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '125%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    minWidth: '200px',
                                    background: '#ffffff',
                                    border: '1px solid #eeeeee',
                                    borderRadius: '24px',
                                    padding: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                                    zIndex: 200,
                                    animation: 'fadeInUp 0.2s ease-out'
                                }}>
                                    <button
                                        onClick={() => { setActiveTab('new'); setShowTradeDropdown(false); }}
                                        style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            background: activeTab === 'new' ? '#f2f2f7' : 'transparent',
                                            border: 'none',
                                            borderRadius: '16px',
                                            color: '#111111',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f2f2f7'}
                                        onMouseLeave={(e) => activeTab !== 'new' && (e.currentTarget.style.background = 'transparent')}
                                    >
                                        Propose Trade
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('block'); setShowTradeDropdown(false); }}
                                        style={{
                                            padding: '12px 16px',
                                            textAlign: 'left',
                                            background: activeTab === 'block' ? '#f2f2f7' : 'transparent',
                                            border: 'none',
                                            borderRadius: '16px',
                                            color: '#111111',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f2f2f7'}
                                        onMouseLeave={(e) => activeTab !== 'block' && (e.currentTarget.style.background = 'transparent')}
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
                                'freeAgents': 'Free Agency',
                                'injuries': 'Injuries',
                                'log': 'History'
                            };
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    style={{
                                        padding: '10px 20px',
                                        background: isActive ? '#111111' : 'transparent',
                                        border: 'none',
                                        borderRadius: '100px',
                                        color: isActive ? '#ffffff' : '#8e8e93',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {labels[tab]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ width: '100%', color: '#111111' }}>
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
                    <InjuryReportView onBack={() => setActiveTab('new')} />
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
        </div>
    );
};
