import React, { useState, useMemo, useEffect } from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import { calculateOverall } from '../../utils/playerUtils';

interface NegotiationViewProps {
    player: Player;
    team: Team;
    onNegotiate: (offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => { decision: 'ACCEPTED' | 'REJECTED' | 'INSULTED'; feedback: string; };
    onSign: (offer: { amount: number; years: number; role: 'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect' }) => void;
    onCancel: () => void;
    onSelectPlayer?: (playerId: string) => void;
    salaryCap: number;
}

export const NegotiationView: React.FC<NegotiationViewProps> = ({ player, team, onNegotiate, onSign, onCancel, onSelectPlayer, salaryCap }) => {
    // Calculate base market value once
    const asking = useMemo(() => calculateContractAmount(player, salaryCap), [player, salaryCap]);

    // Initial State defaults
    const [salary, setSalary] = useState(asking.amount);
    const [years, setYears] = useState(asking.years);
    const [role, setRole] = useState<'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect'>('Rotation');

    // Feedback State
    const [feedback, setFeedback] = useState<string | null>(null);
    const [lastDecision, setLastDecision] = useState<'ACCEPTED' | 'REJECTED' | 'INSULTED' | null>(null);

    // Set initial role based on OVR
    useEffect(() => {
        const ovr = calculateOverall(player);
        if (ovr >= 85) setRole('Star');
        else if (ovr >= 78) setRole('Starter');
        else if (ovr >= 74) setRole('Rotation');
        else if (ovr >= 70) setRole('Bench');
        else setRole('Prospect');
    }, [player]);

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const handleOffer = () => {
        const result = onNegotiate({ amount: salary, years, role });
        setFeedback(result.feedback);
        setLastDecision(result.decision);
    };

    const handleSign = () => {
        onSign({ amount: salary, years, role });
    };

    const roles: ('Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect')[] = ['Star', 'Starter', 'Rotation', 'Bench', 'Prospect'];

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'var(--text)' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h2 style={{ margin: 0 }}>Contract Negotiation</h2>
                <div
                    onClick={() => onSelectPlayer && onSelectPlayer(player.id)}
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'var(--primary)',
                        marginTop: '10px',
                        cursor: onSelectPlayer ? 'pointer' : 'default',
                        textDecoration: onSelectPlayer ? 'underline' : 'none'
                    }}
                >
                    {player.firstName} {player.lastName}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {player.position} • Age: {player.age}
                </div>

                {/* Asking Price Display */}
                <div style={{ marginTop: '15px', padding: '10px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)', display: 'inline-block' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Asking For</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2ecc71' }}>
                        {formatMoney(calculateAdjustedDemand(player, asking.amount, asking.years, role, years, false))} / {years} Yr{years > 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Negotiation Card */}
            <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>

                {/* Salary Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Salary per Year</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="range"
                            min="1000000"
                            max="60000000"
                            step="500000"
                            value={salary}
                            onChange={(e) => setSalary(Number(e.target.value))}
                            style={{ flex: 1 }}
                        />
                        <div style={{ width: '120px', textAlign: 'right', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                            {formatMoney(salary)}
                        </div>
                    </div>
                    {salary >= team.salaryCapSpace && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '5px' }}>Max Cap Space Reached</div>}
                </div>

                {/* Years Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Contract Length</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3, 4, 5].map(y => (
                            <button
                                key={y}
                                onClick={() => setYears(y)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: years === y ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: years === y ? 'var(--primary-glow)' : 'var(--surface-glass)',
                                    color: years === y ? 'var(--primary)' : 'var(--text)',
                                    fontWeight: years === y ? 'bold' : 'normal',
                                    cursor: 'pointer'
                                }}
                            >
                                {y} Year{y > 1 ? 's' : ''}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Role Input */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Offered Role</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {roles.map(r => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: role === r ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: role === r ? 'var(--primary)' : 'var(--surface-glass)',
                                    color: role === r ? 'white' : 'var(--text)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        * Offering a larger role can help lower salary demands.
                    </div>
                </div>

                {/* Feedback Area */}
                {feedback && (
                    <div style={{
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        background: lastDecision === 'ACCEPTED' ? 'rgba(46, 204, 113, 0.2)' : lastDecision === 'INSULTED' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                        border: `1px solid ${lastDecision === 'ACCEPTED' ? 'var(--success)' : lastDecision === 'INSULTED' ? 'var(--danger)' : 'var(--text-secondary)'}`,
                        color: 'var(--text)',
                        fontStyle: 'italic'
                    }}>
                        "{feedback}"
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onCancel}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        Cancel
                    </button>

                    {lastDecision === 'ACCEPTED' ? (
                        <button
                            onClick={handleSign}
                            className="btn-primary"
                            style={{ flex: 2, padding: '12px', fontSize: '1rem' }}>
                            Sign Contract!
                        </button>
                    ) : (
                        <button
                            onClick={handleOffer}
                            disabled={lastDecision === 'INSULTED'}
                            className="btn-primary"
                            style={{
                                flex: 2,
                                padding: '12px',
                                fontSize: '1rem',
                                opacity: lastDecision === 'INSULTED' ? 0.5 : 1,
                                cursor: lastDecision === 'INSULTED' ? 'not-allowed' : 'pointer'
                            }}>
                            Make Offer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
