import React from 'react';
import { useGame } from '../../store/GameContext';
import { calculateOverall } from '../../utils/playerUtils';

interface RosterPreviewProps {
    onSelectPlayer: (id: string) => void;
}

export const RosterPreview: React.FC<RosterPreviewProps> = ({ onSelectPlayer }) => {
    const { players, userTeamId, contracts, teams } = useGame();
    const userTeam = teams.find(t => t.id === userTeamId);

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' }).format(amount);
    };

    const teamPlayers = players.filter(p => p.teamId === userTeamId);

    // Limit to 5
    const topPlayers = teamPlayers
        .sort((a, b) => b.overall - a.overall)
        .slice(0, 5);

    return (
        <div style={{
            paddingBottom: '0',
            background: 'var(--surface-glass)',
            padding: '20px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
            isolation: 'isolate'
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.18)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        }}>
            {/* Watermark Logo - 200% Scale */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200%',
                height: '200%',
                opacity: 0.1,
                backgroundImage: userTeam?.logo ? `url(${userTeam.logo})` : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none',
                zIndex: -1
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Team Leaders</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    View All
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topPlayers.map((player) => {
                    const stats = player.seasonStats;
                    const contract = contracts.find(c => c.playerId === player.id);

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
                                    {contract ? (
                                        <span style={{ color: contract.yearsLeft === 1 ? '#e74c3c' : 'var(--text-secondary)' }}>
                                            {formatMoney(contract.amount)}/yr • {contract.yearsLeft === 1 ? 'Expiring' : `${contract.yearsLeft} yrs`}
                                        </span>
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
};
