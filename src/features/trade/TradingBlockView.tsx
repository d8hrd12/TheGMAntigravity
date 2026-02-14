import React from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Contract } from '../../models/Contract';
import { getTeamState, type TeamState } from './TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';
import { ArrowRight, TrendingUp, TrendingDown, Minus, Trophy, ShoppingBag, User } from 'lucide-react';

interface TradingBlockViewProps {
    userTeamId: string;
    teams: Team[];
    players: Player[];
    contracts: Contract[];
    onSelectTeam: (teamId: string) => void;
    onSelectPlayer: (playerId: string) => void;
    onTradeForPlayer: (playerId: string) => void;
}

export const TradingBlockView: React.FC<TradingBlockViewProps> = ({
    userTeamId,
    teams,
    players,
    contracts,
    onSelectTeam,
    onSelectPlayer,
    onTradeForPlayer
}) => {

    const analyzeTeam = (team: Team) => {
        const roster = players.filter(p => p.teamId === team.id);
        const state = getTeamState(team);
        const needs: string[] = [];
        const assets: Player[] = [];

        // --- Refined Asset Logic ---

        // 1. Identify "Surplus" players (3rd stringers with decent rating)
        const depthChart: Record<string, Player[]> = { 'PG': [], 'SG': [], 'SF': [], 'PF': [], 'C': [] };
        roster.forEach(p => { if (depthChart[p.position]) depthChart[p.position].push(p); });

        // Sort depth chart by overall
        Object.keys(depthChart).forEach(pos => {
            depthChart[pos].sort((a, b) => calculateOverall(b) - calculateOverall(a));
            // If depth > 2, the 3rd+ best player is potential trade bait if they are > 70 OVR
            if (depthChart[pos].length > 2) {
                const surplus = depthChart[pos].slice(2).filter(p => calculateOverall(p) > 70);
                assets.push(...surplus);
            }
        });

        // 2. Strategy Specific
        if (state === 'Contender') {
            needs.push('Veterans', 'Bench Defense');
            // Willing to trade: Young prospects not in rotation, Picks (implied)
            const youngBench = roster.filter(p => p.age < 24 && calculateOverall(p) < 78 && !assets.includes(p)).slice(0, 2);
            assets.push(...youngBench);
        } else if (state === 'Rebuilding') {
            needs.push('Draft Picks', 'Young Talent');
            // Willing to trade: Veterans (>27)
            const vets = roster.filter(p => p.age > 26 && calculateOverall(p) > 74).sort((a, b) => calculateOverall(b) - calculateOverall(a)).slice(0, 3);
            vets.forEach(v => { if (!assets.includes(v)) assets.push(v); });
        } else if (state === 'Retooling') {
            needs.push('Best Available');
            // Willing to trade: Expiring contracts, unhappy players
            const unhappy = roster.filter(p => p.morale < 40).slice(0, 2);
            unhappy.forEach(u => { if (!assets.includes(u)) assets.push(u); });
        } else {
            // Playoff Team
            needs.push('Upgrade at Starter');
            // Trade: Rotation pieces for upgrade
        }

        // Deduplicate and limit assets
        const uniqueAssets = Array.from(new Set(assets)).slice(0, 4);

        return { state, needs, assets: uniqueAssets };
    };

    // Group Teams Logic remains same
    const groupedTeams: Record<string, Team[]> = { 'Contender': [], 'PlayoffTeam': [], 'Retooling': [], 'Rebuilding': [] };
    teams.filter(t => t.id !== userTeamId && t.id !== '31').forEach(team => {
        const state = getTeamState(team);
        if (groupedTeams[state]) groupedTeams[state].push(team);
        else groupedTeams['Retooling'].push(team);
    });

    const renderTeamCard = (team: Team) => {
        const { needs, assets, state } = analyzeTeam(team);

        return (
            <div key={team.id} className="glass-panel" style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: team.colors?.primary || '#333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 'bold', fontSize: '1.1rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        overflow: 'hidden'
                    }}>
                        {team.logo ? (
                            <img src={team.logo} alt={team.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            team.abbreviation.substring(0, 2)
                        )}
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{team.city} {team.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {team.wins}-{team.losses} • {state}
                        </div>
                    </div>
                </div>

                {/* Needs Tag */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {needs.slice(0, 3).map((need, i) => (
                        <span key={i} style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)'
                        }}>
                            {need}
                        </span>
                    ))}
                </div>

                {/* Trading Block Assets - Interactive List */}
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        On The Block
                    </div>
                    {assets.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {assets.map(p => (
                                <div key={p.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.9rem',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    background: 'rgba(255,255,255,0.03)',
                                    transition: 'background 0.2s'
                                }}>
                                    <div
                                        onClick={() => onSelectPlayer(p.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                                    >
                                        <div style={{
                                            fontWeight: 'bold',
                                            color: calculateOverall(p) > 85 ? '#e74c3c' : calculateOverall(p) > 80 ? '#f39c12' : '#2ecc71',
                                            fontSize: '0.85rem',
                                            minWidth: '24px',
                                            textAlign: 'center'
                                        }}>
                                            {calculateOverall(p)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{p.firstName.charAt(0)}. {p.lastName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.position} • {p.age}yo</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onTradeForPlayer(p.id)}
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <ShoppingBag size={12} />
                                        Trade
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#666', textAlign: 'center', padding: '10px' }}>No specific players listed.</div>
                    )}
                </div>

                {/* Full Team Trade Action */}
                <button
                    onClick={() => onSelectTeam(team.id)}
                    style={{
                        marginTop: 'auto',
                        width: '100%',
                        padding: '10px',
                        background: 'transparent',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        transition: 'background 0.2s'
                    }}
                >
                    View Full Roster <ArrowRight size={14} />
                </button>
            </div>
        );
    };

    const CategorySection = ({ title, dataKey, icon: Icon, color }: { title: string, dataKey: string, icon: any, color: string }) => {
        const categoryTeams = groupedTeams[dataKey] || [];
        if (categoryTeams.length === 0) return null;

        return (
            <div style={{ marginBottom: '40px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '15px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: `${color}20` }}>
                        <Icon size={24} color={color} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {dataKey === 'Contender' ? 'Looking to buy veterans for a championship push.' :
                                dataKey === 'Rebuilding' ? 'Looking to sell veterans for draft capital.' :
                                    'Looking for opportunistic upgrades.'}
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px',
                }}>
                    {categoryTeams.length > 0 ? categoryTeams.map(renderTeamCard) : <div style={{ padding: '20px', color: '#666' }}>No teams in this category.</div>}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            padding: '20px',
            height: '100%',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, var(--background) 0%, rgba(0,0,0,0.2) 100%)'
        }}>

            <CategorySection
                title="Championship Contenders"
                dataKey="Contender"
                icon={Trophy}
                color="#f1c40f" // Gold
            />

            <CategorySection
                title="Playoff Hopefuls"
                dataKey="PlayoffTeam"
                icon={TrendingUp}
                color="#2ecc71" // Green
            />

            <CategorySection
                title="Retooling / Stuck in Middle"
                dataKey="Retooling"
                icon={Minus}
                color="#3498db" // Blue
            />

            <CategorySection
                title="Rebuilders (Fire Sale)"
                dataKey="Rebuilding"
                icon={TrendingDown}
                color="#e74c3c" // Red
            />
        </div>
    );
};
