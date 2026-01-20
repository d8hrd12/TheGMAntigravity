import React from 'react';

interface PayrollConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    payrollAmount: number;
    currentCash: number;
}

export const PayrollConfirmationModal: React.FC<PayrollConfirmationModalProps> = ({ onConfirm, onCancel, payrollAmount, currentCash }) => {

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const remainingCash = currentCash - payrollAmount;
    const isDeficit = remainingCash < 0;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', zIndex: 3000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'var(--surface)', padding: '30px', borderRadius: '16px',
                width: '90%', maxWidth: '500px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                color: 'var(--text)',
                textAlign: 'center'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem' }}>Season Payment Required</h2>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.5' }}>
                    Before starting the regular season, you must pay all player contracts upfront for the year.
                </p>

                <div style={{
                    background: 'var(--surface-active)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Payroll:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e74c3c' }}>
                            {formatMoney(payrollAmount)}
                        </span>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border)' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Current Funds:</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {formatMoney(currentCash)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Remaining:</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: isDeficit ? '#e74c3c' : '#2ecc71' }}>
                            {formatMoney(remainingCash)}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '12px 24px',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isDeficit}
                        style={{
                            padding: '12px 30px',
                            background: isDeficit ? '#555' : 'var(--primary)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '8px',
                            cursor: isDeficit ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: isDeficit ? 'none' : '0 4px 15px rgba(231, 76, 60, 0.3)' // Using primary color which is orange usually, but specifically using button color here
                        }}
                    >
                        {isDeficit ? 'Insufficient Funds' : 'Pay & Start Season'}
                    </button>
                </div>
            </div>
        </div>
    );
};
