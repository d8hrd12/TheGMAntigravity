import React from 'react';
import type { Team } from '../../models/Team';
import type { Player } from '../../models/Player';
import type { Contract } from '../../models/Contract';
import { getTeamState, getTradingBlock, getTeamDirection, type TeamState } from './TradeLogic';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';
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
        const direction = getTeamDirection(team, roster);
        const block = getTradingBlock(team, roster, direction);
        const state = getTeamState(team);

        return { 
            state, 
            needs: block.needs, 
            assets: block.assets 
        };
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
        const teamBaseline = calculateTeamBaseline(players.filter(p => p.teamId === team.id));

        return (
            <div key={team.id} style={{
                width: '100%',
                padding: '24px',
                borderRadius: '24px',
                border: '1px solid #eeeeee',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: '#f2f2f7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: team.colors?.primary || '#111111', 
                        fontWeight: 'bold', fontSize: '1.2rem',
                        overflow: 'hidden',
                        border: '1px solid #eeeeee'
                    }}>
                        {team.logo ? (
                            <img src={team.logo} alt={team.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                        ) : (
                            team.abbreviation.substring(0, 2)
                        )}
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#111111', letterSpacing: '-0.02em' }}>{team.city} {team.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#8e8e93', fontWeight: 600 }}>
                            {team.wins}-{team.losses} • {state}
                        </div>
                    </div>
                </div>

                {/* Needs Tag */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {needs.slice(0, 3).map((need, i) => (
                        <span key={i} style={{
                            fontSize: '0.7rem',
                            padding: '6px 12px',
                            borderRadius: '100px',
                            background: '#f2f2f7',
                            color: '#111111',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            {need}
                        </span>
                    ))}
                </div>

                {/* Trading Block Assets - Interactive List */}
                <div style={{ flex: 1, background: '#f9f9f9', borderRadius: '20px', padding: '16px', border: '1px solid #f2f2f7' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8e8e93', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        On The Block
                    </div>
                    {assets.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {assets.map(p => (
                                <div key={p.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.9rem',
                                    padding: '10px 12px',
                                    borderRadius: '14px',
                                    background: '#ffffff',
                                    border: '1px solid #eeeeee',
                                    transition: 'transform 0.2s'
                                }}>
                                    <div
                                        onClick={() => onSelectPlayer(p.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                                    >
                                        <div style={{
                                            minWidth: '24px',
                                            textAlign: 'center'
                                        }}>
                                            <StarRating stars={calculateStars(calculateOverall(p), teamBaseline)} size={10} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, color: '#111111' }}>{p.firstName.charAt(0)}. {p.lastName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#8e8e93', fontWeight: 600 }}>{p.position} • {p.age}yo</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onTradeForPlayer(p.id)}
                                        style={{
                                            background: '#111111',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '100px',
                                            padding: '6px 12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <ShoppingBag size={12} />
                                        Trade
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8e8e93', textAlign: 'center', padding: '20px' }}>No specific players listed.</div>
                    )}
                </div>

                {/* Full Team Trade Action */}
                <button
                    onClick={() => onSelectTeam(team.id)}
                    style={{
                        marginTop: 'auto',
                        width: '100%',
                        padding: '14px',
                        background: '#ffffff',
                        color: '#111111',
                        border: '1px solid #eeeeee',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f2f2f7';
                        e.currentTarget.style.borderColor = '#111111';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#eeeeee';
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
            <div style={{ marginBottom: '64px' }}>
                <div style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    marginBottom: '32px',
                    padding: '0 8px'
                }}>
                    <div style={{ 
                        padding: '12px', 
                        borderRadius: '16px', 
                        background: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Icon size={28} color={color} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#111111' }}>{title}</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '1rem', color: '#8e8e93', fontWeight: 500 }}>
                            {dataKey === 'Contender' ? 'Looking to buy veterans for a championship push.' :
                                dataKey === 'Rebuilding' ? 'Looking to sell veterans for draft capital.' :
                                    'Looking for opportunistic upgrades.'}
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '32px',
                }}>
                    {categoryTeams.length > 0 ? categoryTeams.map(renderTeamCard) : <div style={{ padding: '20px', color: '#8e8e93' }}>No teams in this category.</div>}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            padding: '40px',
            height: '100%',
            overflowY: 'auto',
            background: '#ffffff'
        }}>

            <CategorySection
                title="Championship Contenders"
                dataKey="Contender"
                icon={Trophy}
                color="#ff9500" // iOS Orange
            />

            <CategorySection
                title="Playoff Hopefuls"
                dataKey="PlayoffTeam"
                icon={TrendingUp}
                color="#34c759" // iOS Green
            />

            <CategorySection
                title="Retooling / Stuck in Middle"
                dataKey="Retooling"
                icon={Minus}
                color="#007aff" // iOS Blue
            />

            <CategorySection
                title="Rebuilders (Fire Sale)"
                dataKey="Rebuilding"
                icon={TrendingDown}
                color="#ff3b30" // iOS Red
            />
        </div>
    );
};
