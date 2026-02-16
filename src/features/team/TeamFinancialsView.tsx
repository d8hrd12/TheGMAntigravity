import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateExpectation, AVAILABLE_MERCH_CAMPAIGNS } from '../finance/FinancialEngine';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Trash2, Users, Briefcase, Building2, AlertTriangle, Info, X, ShoppingBag, Activity } from 'lucide-react';

import { BackButton } from '../ui/BackButton';
import { PageHeader } from '../ui/PageHeader';
import { SegmentedControl } from '../../components/ui/SegmentedControl';

interface TeamFinancialsViewProps {
    onBack: () => void;
    onSelectPlayer: (playerId: string) => void;
}

export const TeamFinancialsView: React.FC<TeamFinancialsViewProps> = ({ onBack, onSelectPlayer }) => {
    const { teams, userTeamId, contracts, salaryCap, releasePlayer, players, seasonPhase, activeMerchCampaigns, startMerchCampaign } = useGame();
    const [viewMode, setViewMode] = useState<'my_team' | 'league' | 'merch'>('my_team');
    // ... existing logic for user team ...
    const team = teams.find(t => t.id === userTeamId);
    const [playerToCut, setPlayerToCut] = useState<{ id: string, name: string } | null>(null);
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
    const [showRules, setShowRules] = useState(false);

    // Helpers
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            notation: 'compact',
            compactDisplay: 'short'
        }).format(amount);
    };

    if (!team) return null;

    // ... existing logic vars ...
    const isPreSeason = seasonPhase === 'pre_season' || seasonPhase === 'offseason' || seasonPhase === 'draft' || seasonPhase === 'resigning' || seasonPhase === 'free_agency';
    const paymentStatusLabel = isPreSeason ? 'Payment Due' : 'Paid Upfront';
    const paymentStatusColor = isPreSeason ? '#f1c40f' : '#2ecc71';

    // My Team Data
    const teamContracts = contracts.filter(c => c.teamId === team.id);
    const teamRoster = players.filter(p => p.teamId === team.id);
    const totalPayroll = teamContracts.reduce((sum, c) => sum + c.amount, 0);
    const capSpace = salaryCap - totalPayroll;
    const isOverCap = capSpace < 0;
    const sortedContracts = [...teamContracts].sort((a, b) => b.amount - a.amount);
    const expectation = calculateExpectation(team, teamRoster, teams, teamContracts);
    const handleCut = (playerId: string, name: string) => { setPlayerToCut({ id: playerId, name }); };
    const getPatienceColor = (patience: number) => {
        if (patience > 70) return '#2ecc71';
        if (patience > 40) return '#f1c40f';
        if (patience > 20) return '#e67e22';
        return '#e74c3c';
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
            <PageHeader
                title="Financials"
                onBack={onBack}
            />

            {/* Info Button and Tab Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                {/* Tab Switcher */}
                <div style={{ flex: 1, marginRight: '15px' }}>
                    <SegmentedControl
                        value={viewMode}
                        onChange={(val) => setViewMode(val as any)}
                        options={[
                            { value: 'my_team', label: 'My Team' },
                            { value: 'league', label: 'League Contracts' },
                            { value: 'merch', label: 'Merchandise' }
                        ]}
                    />
                </div>

                {/* Info Button */}
                <button
                    onClick={() => setShowRules(true)}
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '8px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Info size={20} />
                </button>
            </div>

            {viewMode === 'merch' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Active Campaigns */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={20} color="#2ecc71" /> Active Campaigns
                        </h3>
                        {activeMerchCampaigns && activeMerchCampaigns.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                {activeMerchCampaigns.map(campaign => (
                                    <div key={campaign.id} style={{
                                        background: 'var(--surface-glass)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '16px',
                                        padding: '16px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div style={{ fontWeight: 600 }}>{campaign.name}</div>
                                            <div style={{ fontWeight: 700, color: '#2ecc71' }}>+{formatMoney(campaign.revenueGenerated)}</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                            {campaign.gamesRemaining} games remaining
                                        </div>
                                        <div style={{ height: '6px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${((campaign.durationInGames - campaign.gamesRemaining) / campaign.durationInGames) * 100}%`,
                                                background: '#3498db'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', background: 'var(--surface)', borderRadius: '16px', color: 'var(--text-secondary)' }}>
                                No active campaigns. Start one below!
                            </div>
                        )}
                    </div>

                    {/* Available Campaigns */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingBag size={20} color="#3498db" /> Available Opportunities
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {AVAILABLE_MERCH_CAMPAIGNS.map(campaign => {
                                const isAffordable = team.cash >= campaign.cost;
                                const isInterestMet = (team.fanInterest || 1) >= (campaign.minFanInterest / 50); // Normalized? No, minFanInterest is 0-100? Wait, previous code used 0-60 etc. My FanInterest is multiplier 0.5-2.0.
                                // Wait, the definition used integer "40", "60". Let's assume FanInterest is stored as multiplier but displayed/calculated consistently.
                                // In `FinancialEngine`, I used `team.fanInterest / 50` which implies team.fanInterest is like "50".
                                // BUT in TeamFinancialsView, it shows `(team.fanInterest || 1.0).toFixed(2)x`.
                                // Let's check `teams.ts`. It has `fanInterest: 1.1` etc. or `80`?
                                // In `teams.ts` (viewed earlier), it was numbers like 1.5, 0.9.
                                // AvailableCampaigns has `minFanInterest` like 30, 40, 60.
                                // I need to fix this comparison. Let's assume FanInterest 1.0 = 50 "Points".
                                // Or maybe I should just treat the campaign requirements as "Base 1.0 = 50".
                                // Let's adapt: FanInterest * 50 to get the "Score".

                                const fanScore = (team.fanInterest || 0.5) * 50;
                                const canRun = isAffordable && fanScore >= campaign.minFanInterest;

                                return (
                                    <div key={campaign.id} style={{
                                        background: 'var(--surface-glass)',
                                        border: canRun ? '1px solid var(--border)' : '1px solid var(--border)',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        opacity: canRun ? 1 : 0.6
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '2px' }}>{campaign.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{campaign.description}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{formatMoney(campaign.cost)}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                            <span style={{ background: 'var(--surface)', padding: '4px 8px', borderRadius: '6px' }}>
                                                Duration: {campaign.durationInGames} Games
                                            </span>
                                            <span style={{ background: 'var(--surface)', padding: '4px 8px', borderRadius: '6px', color: campaign.riskFactor > 0.2 ? '#e74c3c' : '#2ecc71' }}>
                                                Risk: {campaign.riskFactor > 0.3 ? 'High' : campaign.riskFactor > 0.1 ? 'Medium' : 'Low'}
                                            </span>
                                            <span style={{ background: 'var(--surface)', padding: '4px 8px', borderRadius: '6px' }}>
                                                ROI: {(campaign.baseRoi * 100 - 100).toFixed(0)}%
                                            </span>
                                            <span style={{ background: 'var(--surface)', padding: '4px 8px', borderRadius: '6px', color: '#2ecc71', fontWeight: 600 }}>
                                                Est. Profit: +{formatMoney(campaign.cost * (campaign.baseRoi - 1))}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => startMerchCampaign(campaign)}
                                            disabled={!canRun}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: canRun ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' : 'var(--surface-active)',
                                                color: canRun ? 'white' : 'var(--text-disabled)',
                                                fontWeight: 700,
                                                cursor: canRun ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            {!isAffordable ? 'Insufficient Funds' : fanScore < campaign.minFanInterest ? 'Fan Interest Too Low' : 'Launch Campaign'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : viewMode === 'my_team' ? (
                <>
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

                    {/* FINANCIAL RULES INFO MODAL */}
                    {showRules && (
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}>
                            <div style={{
                                background: 'var(--surface)',
                                borderRadius: '24px',
                                maxWidth: '500px',
                                width: '100%',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                padding: '24px',
                                border: '1px solid var(--border)',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => setShowRules(false)}
                                    style={{
                                        position: 'absolute', top: '16px', right: '16px',
                                        background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%',
                                        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: 'var(--text)'
                                    }}
                                >
                                    <X size={18} />
                                </button>

                                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Info style={{ color: 'var(--primary)' }} /> League Financial Rules
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ background: 'var(--surface-glass)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div style={{ fontWeight: 700, marginBottom: '6px', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <TrendingUp size={18} /> Dynamic Salary Cap
                                        </div>
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)', margin: 0 }}>
                                            The Salary Cap is no longer fixed! It recalculates every season based on total League Revenue (~48% of Basketball Related Income).
                                            <br /><br />
                                            <b style={{ color: 'var(--text)' }}>Strategy:</b> If the league is booming, the cap rises, allowing you to sign more stars. If revenue drops, the cap shrinks, forcing tough trades.
                                        </p>
                                    </div>

                                    <div style={{ background: 'var(--surface-glass)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div style={{ fontWeight: 700, marginBottom: '6px', color: '#3498db', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={18} /> Revenue Sharing
                                        </div>
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)', margin: 0 }}>
                                            Small markets are protected. A portion of all Luxury Tax payments is redistributed to teams that stay <b>under the Salary Cap</b>.
                                            <br /><br />
                                            <b style={{ color: 'var(--text)' }}>Payout:</b> Can amount to $10M-$30M per season for eligible teams, boosting your cash reserves.
                                        </p>
                                    </div>

                                    <div style={{ background: 'var(--surface-glass)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div style={{ fontWeight: 700, marginBottom: '6px', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <AlertTriangle size={18} /> Luxury Tax & Apron
                                        </div>
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)', margin: 0 }}>
                                            Exceeding the tax threshold triggers a progressive tax bill defined by the owner.
                                            <br /><br />
                                            <b style={{ color: '#e74c3c' }}>Repeater Tax:</b> Staying above the tax line for 3+ consecutive years triggers a massive multiplier penalty. Avoid this unless you are winning chips!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                // LEAGUE VIEW
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {teams.map(t => {
                        const tContracts = contracts.filter(c => c.teamId === t.id);
                        const tPayroll = tContracts.reduce((sum, c) => sum + c.amount, 0);
                        const tSpace = salaryCap - tPayroll;
                        const tIsOver = tSpace < 0;
                        const isExpanded = expandedTeamId === t.id;

                        return (
                            <div key={t.id} style={{
                                background: 'var(--surface-glass)',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                overflow: 'hidden'
                            }}>
                                <div
                                    onClick={() => setExpandedTeamId(isExpanded ? null : t.id)}
                                    style={{
                                        padding: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: isExpanded ? 'var(--surface-active)' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            background: t.colors?.primary || '#555',
                                            width: '40px', height: '40px',
                                            borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontWeight: 'bold'
                                        }}>
                                            {t.city.substring(0, 1)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{t.city} {t.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {tContracts.length} Contracts
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '24px', textAlign: 'right' }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cash</div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {formatMoney(t.cash)}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Space</div>
                                            <div style={{
                                                fontWeight: 700,
                                                color: tIsOver ? '#e74c3c' : '#2ecc71'
                                            }}>
                                                {formatMoney(tSpace)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)' }}>
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            padding: '12px 0', borderBottom: '1px dashed var(--border)',
                                            fontSize: '0.85rem', color: 'var(--text-secondary)'
                                        }}>
                                            <span>Used Cap: <b>{formatMoney(tPayroll)}</b></span>
                                            <span>Cap Limit: <b>{formatMoney(salaryCap)}</b></span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                            {tContracts
                                                .sort((a, b) => b.amount - a.amount)
                                                .map(c => {
                                                    const p = players.find(pl => pl.id === c.playerId);
                                                    if (!p) return null;
                                                    return (
                                                        <div key={c.id}
                                                            onClick={() => onSelectPlayer(p.id)}
                                                            style={{
                                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                padding: '8px', background: 'var(--surface)', borderRadius: '8px',
                                                                cursor: 'pointer'
                                                            }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, width: '25px', textAlign: 'center', background: 'var(--surface-active)', borderRadius: '4px' }}>{p.position}</span>
                                                                <span style={{ fontWeight: 500 }}>{p.firstName} {p.lastName}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.yearsLeft}y</span>
                                                                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{formatMoney(c.amount)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div >
    );
};
