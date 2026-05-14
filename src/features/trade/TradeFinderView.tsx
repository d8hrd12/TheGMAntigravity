import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { generateTradeOffers, generateTransferOffers } from './TradeLogic';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import type { TradeProposal } from '../../models/TradeProposal';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
import { ChevronRight, DollarSign, RefreshCw, X, Coins } from 'lucide-react';

interface TradeFinderViewProps {
    shopPlayerId: string;
    onClose: () => void;
    onAccept: (offer: TradeProposal) => void;
    onSelectPlayer?: (playerId: string) => void;
}

import { PageHeader } from '../ui/PageHeader';

export const TradeFinderView: React.FC<TradeFinderViewProps> = ({ shopPlayerId, onClose, onAccept, onSelectPlayer }) => {
    const { teams, players, contracts, salaryCap, date, draftClass, userTeamId, leagueType } = useGame(); 

    const [offers, setOffers] = useState<TradeProposal[]>([]);
    const [loading, setLoading] = useState(true);

    const shopPlayer = players.find(p => p.id === shopPlayerId);
    const userTeam = teams.find(t => t.id === userTeamId);

    useEffect(() => {
        if (!shopPlayer || !userTeam) return;

        const timer = setTimeout(() => {
            let generatedOffers: TradeProposal[] = [];
            if (leagueType === 'EURO') {
                generatedOffers = generateTransferOffers(
                    userTeam,
                    shopPlayerId,
                    teams,
                    players,
                    contracts,
                    date.getFullYear()
                );
            } else {
                generatedOffers = generateTradeOffers(
                    userTeam,
                    shopPlayerId,
                    teams,
                    players,
                    contracts,
                    [], // picks - though we could pass them if needed
                    salaryCap,
                    date.getFullYear()
                );
            }
            setOffers(generatedOffers);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [shopPlayerId, leagueType]);

    const getTeam = (id: string) => teams.find(t => t.id === id);

    if (!shopPlayer || !userTeam) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'var(--bg-main)', zIndex: 3000,
            display: 'flex', flexDirection: 'column',
            padding: '0'
        }}>
            <PageHeader 
                title={leagueType === 'EURO' ? 'Transfer Finder' : 'Trade Finder'}
                subtitle={`Shopping ${shopPlayer.firstName} ${shopPlayer.lastName}`}
                onBack={onClose}
                teamColor={userTeam?.colors?.primary}
            />

            <div style={{
                flex: 1,
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '20px'
            }}>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                    {loading ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <RefreshCw className="spin" size={32} style={{ marginBottom: '15px' }} />
                            <p>{leagueType === 'EURO' ? 'Contacting European Clubs...' : 'Querying League GMs...'}</p>
                        </div>
                    ) : offers.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
                            <p>No teams made an offer for {shopPlayer.lastName}.</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Try waiting closer to the deadline or lowering your expectations.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {offers.map((offer, idx) => {
                                const aiTeam = getTeam(offer.aiTeamId);
                                const salaryIn = offer.aiPlayerIds.reduce((sum, id) => {
                                    const c = contracts.find(c => c.playerId === id);
                                    return sum + (c?.amount || 0);
                                }, 0);

                                return (
                                    <div key={idx} style={{
                                        background: 'var(--bg-card-hover)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {aiTeam?.city} {aiTeam?.name}
                                                </div>
                                                 <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                                                     Valid Offer
                                                 </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            {/* Incoming Assets */}
                                            {leagueType === 'EURO' ? (
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>THEY OFFER</div>
                                                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                         €{new Intl.NumberFormat('de-DE').format(offer.transferFee || 0)}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transfer Fee (Immediate Cash)</div>
                                                </div>
                                            ) : (
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>THEY OFFER</div>
                                                    {offer.aiPlayerIds.map(pid => {
                                                        const p = players.find(x => x.id === pid);
                                                        if (!p) return null;
                                                        const ovr = calculateOverall(p);
                                                        const aiTeamPlayers = players.filter(x => x.teamId === offer.aiTeamId);
                                                        const aiTeamBaseline = calculateTeamBaseline(aiTeamPlayers);
                                                        return (
                                                            <div key={p.id} onClick={() => onSelectPlayer && onSelectPlayer(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', cursor: 'pointer' }}>
                                                                <div style={{ fontWeight: 'bold' }}>{p.firstName} {p.lastName}</div>
                                                                <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    {p.position} • {p.age}yo • <StarRating stars={calculateStars(ovr, aiTeamBaseline)} size={12} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {offer.aiPickIds.map(pid => {
                                                        const pick = teams.flatMap(t => t.draftPicks).find(p => p.id === pid);
                                                        if (!pick) return <div key={pid} style={{ fontSize: '0.8rem', color: '#666' }}>Draft Pick (Unknown)</div>;
                                                        return (
                                                            <div key={pid} style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <span>{pick.year} Rd {pick.round}</span>
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> (via {pick.originalTeamName || 'UNK'}) </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div style={{ color: 'var(--text-muted)' }}>
                                                <ChevronRight />
                                            </div>

                                            {/* Outgoing */}
                                            <div style={{ flex: 1, textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>YOU SEND</div>
                                                <div style={{ fontWeight: 'bold' }}>{shopPlayer.firstName} {shopPlayer.lastName}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                                            <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                {leagueType === 'EURO' ? (
                                                    <>
                                                        <Coins size={14} color="#f1c40f" />
                                                        <span>Market Value Buyout</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DollarSign size={14} />
                                                        Incoming Salary: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(salaryIn)}
                                                    </>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => onAccept(offer)}
                                                className="btn-primary"
                                                style={{ padding: '8px 20px', borderRadius: '8px' }}
                                            >
                                                {leagueType === 'EURO' ? 'Accept Transfer' : 'View Trade'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
