import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateExpectation } from '../finance/FinancialEngine';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Trash2, Users, Briefcase, Building2, AlertTriangle } from 'lucide-react';

import { BackButton } from '../ui/BackButton';

interface TeamFinancialsViewProps {
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
}

export const TeamFinancialsView: React.FC<TeamFinancialsViewProps> = ({ onBack, onSelectPlayer }) => {
    const { teams, userTeamId, contracts, salaryCap, releasePlayer, players, seasonPhase } = useGame();
    const team = teams.find(t => t.id === userTeamId);
    const [playerToCut, setPlayerToCut] = useState<{ id: string, name: string } | null>(null);

    if (!team) return null;

    const isPreSeason = seasonPhase === 'pre_season' || seasonPhase === 'offseason' || seasonPhase === 'draft' || seasonPhase === 'resigning' || seasonPhase === 'free_agency';
    const paymentStatusLabel = isPreSeason ? 'Payment Due' : 'Paid Upfront';
    const paymentStatusColor = isPreSeason ? '#f1c40f' : '#2ecc71';


    // Financial calculations
    const teamContracts = contracts.filter(c => c.teamId === team.id);
    const teamRoster = players.filter(p => p.teamId === team.id);
    const totalPayroll = teamContracts.reduce((sum, c) => sum + c.amount, 0);
    const luxuryTaxThreshold = 170000000; // Hardcoded

    // Live Expectation Calculation
    const expectation = calculateExpectation(team, teamRoster, teams, teamContracts);

    const capSpace = salaryCap - totalPayroll;
    const isOverCap = capSpace < 0;

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            notation: 'compact',
            compactDisplay: 'short'
        }).format(amount);
    };

    // Sort contracts
    const sortedContracts = [...teamContracts].sort((a, b) => b.amount - a.amount);

    const handleCut = (playerId: string, name: string) => {
        setPlayerToCut({ id: playerId, name });
    };

    // Helper for Patience Color
    const getPatienceColor = (patience: number) => {
        if (patience > 70) return '#2ecc71'; // Green
        if (patience > 40) return '#f1c40f'; // Yellow
        if (patience > 20) return '#e67e22'; // Orange
        return '#e74c3c'; // Red
    };

    return (
        <div style={{
            height: '100%',
            padding: '20px',
            paddingBottom: '120px',
            overflowY: 'auto',
            color: 'var(--text)',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <BackButton onClick={onBack} />
                <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Financial Overview</h1>
            </div>

            {/* Cash Balance Card */}
            <div style={{
                background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                padding: '24px',
                borderRadius: '24px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(46, 204, 113, 0.3)',
                position: 'relative'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.9 }}>
                            <Wallet size={18} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Cash Balance</span>
                        </div>
                        <div style={{
                            fontSize: '2.8rem',
                            fontWeight: 800,
                            letterSpacing: '-1px',
                            color: 'white',
                            lineHeight: '1.2'
                        }}>
                            {formatMoney(Number(team.cash) || 0)}
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '5px' }}>
                            Start: $350M • {isPreSeason ? 'Salaries Due Soon' : 'Salaries Paid Upfront'}
                        </div>
                    </div>

                    {/* Debt Indicator */}
                    {(team.debt || 0) > 0 && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '12px', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.9, color: '#ffadad' }}>Debt</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>-{formatMoney(team.debt)}</div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '16px' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Guaranteed Income</div>
                        <div style={{ fontSize: '1.0rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TrendingUp size={14} /> {formatMoney(salaryCap * 0.85)} (85% Cap)
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Variable Income</div>
                        <div style={{ fontSize: '1.0rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <DollarSign size={14} /> {formatMoney((salaryCap * 0.35) * (team.fanInterest || 1.0))} (Est.)
                        </div>
                    </div>
                </div>
            </div>

            {/* Organization Status Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Owner Patience */}
                <div style={{
                    background: 'var(--surface-glass)',
                    padding: '16px',
                    borderRadius: '20px',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                        <Briefcase size={16} />
                        <span style={{ fontSize: '0.85rem' }}>Owner Patience</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: getPatienceColor(team.ownerPatience || 0) }}>
                        {Math.round(team.ownerPatience || 0)}%
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${team.ownerPatience || 0}%`,
                            background: getPatienceColor(team.ownerPatience || 0),
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                {/* Fan Interest */}
                <div style={{
                    background: 'var(--surface-glass)',
                    padding: '16px',
                    borderRadius: '20px',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                        <Users size={16} />
                        <span style={{ fontSize: '0.85rem' }}>Fan Interest</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                        {(team.fanInterest || 1.0).toFixed(2)}x
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Revenue Multiplier
                    </div>
                </div>
            </div>

            {/* Market & Expectations */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
            }}>
                <div style={{
                    background: 'var(--surface-glass)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        <Building2 size={16} />
                        <span style={{ fontSize: '0.8rem' }}>Market Size</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{team.marketSize || 'Medium'}</div>
                </div>

                <div style={{
                    background: 'var(--surface-glass)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Expert Expectation</div>
                    <div style={{ fontSize: '1.0rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {expectation.replace(/_/g, ' ')}
                    </div>
                </div>
            </div>

            {/* Salary Cap Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{
                    background: 'var(--surface-glass)',
                    padding: '16px',
                    borderRadius: '20px',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Active Payroll ({isPreSeason ? 'Pending' : 'Paid'})</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                        {formatMoney(totalPayroll)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                        Cap: {formatMoney(salaryCap)}
                    </div>
                </div>
                <div style={{
                    background: 'var(--surface-glass)',
                    padding: '16px',
                    borderRadius: '20px',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Cap Space</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isOverCap ? '#e74c3c' : '#2ecc71' }}>
                        {formatMoney(capSpace)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                        {isOverCap ? 'Over Limit' : 'Available'}
                    </div>
                </div>
            </div>

            {/* Payroll Table */}
            <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Payroll Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sortedContracts.map((contract, index) => {
                        const player = useGame().players.find(p => p.id === contract.playerId);
                        if (!player) return null;

                        return (
                            <div
                                key={contract.id}
                                onClick={() => onSelectPlayer(player.id)}
                                style={{
                                    background: 'var(--surface)',
                                    padding: '15px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-active)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'var(--surface-active)',
                                        color: 'var(--text-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '700', fontSize: '0.8rem',
                                        border: '1px solid var(--border)'
                                    }}>
                                        {player.position}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{player.firstName} {player.lastName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            <span style={{ color: 'var(--text)' }}>#{typeof player.rotationIndex === 'number' ? player.rotationIndex + 1 : '-'} in Rot</span>
                                            <span style={{ margin: '0 6px', opacity: 0.3 }}>|</span>
                                            {contract.yearsLeft} Yrs
                                            <span style={{ margin: '0 6px', opacity: 0.3 }}>|</span>
                                            <span style={{ color: paymentStatusColor }}>{paymentStatusLabel}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                            {formatMoney(contract.amount)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCut(contract.playerId, `${player.firstName} ${player.lastName}`);
                                        }}
                                        style={{
                                            background: 'rgba(231, 76, 60, 0.1)',
                                            color: '#e74c3c',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {
                playerToCut && (
                    <ConfirmationModal
                        title="Release Player"
                        message={`Are you sure you want to cut ${playerToCut.name}? Their salary will be removed from your cap immediately.`}
                        confirmText="Cut Player"
                        cancelText="Keep Player"
                        isDestructive={true}
                        onConfirm={() => {
                            releasePlayer(playerToCut.id);
                            setPlayerToCut(null);
                        }}
                        onCancel={() => setPlayerToCut(null)}
                    />
                )
            }
        </div >
    );
};
