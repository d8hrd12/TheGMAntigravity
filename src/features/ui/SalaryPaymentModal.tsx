import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Wallet, CreditCard, X } from 'lucide-react';

interface SalaryPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPay: () => void;
    payrollAmount: number;
    currentCash: number;
}

export const SalaryPaymentModal: React.FC<SalaryPaymentModalProps> = ({ isOpen, onClose, onPay, payrollAmount, currentCash }) => {
    if (!isOpen) return null;

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const remainingCash = currentCash - payrollAmount;
    const canAfford = currentCash >= payrollAmount;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', zIndex: 10000,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '20px',
                backdropFilter: 'blur(10px)'
            }}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    style={{
                        background: 'var(--bg-card)',
                        borderRadius: '24px',
                        width: '100%',
                        maxWidth: '450px',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header Gradient */}
                    <div style={{
                        height: '6px',
                        background: 'linear-gradient(90deg, var(--team-primary), #2ecc71)',
                        width: '100%'
                    }} />

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'var(--bg-card-hover)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        <X size={18} />
                    </button>

                    <div style={{ padding: '32px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '20px',
                                background: 'rgba(var(--team-primary-rgb), 0.1)',
                                color: 'var(--team-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px auto'
                            }}>
                                <DollarSign size={32} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>TEAM PAYROLL</h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '4px' }}>Disburse player salaries for the season</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Payroll Amount */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{ color: '#e74c3c' }}><CreditCard size={20} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>Amount to Pay</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{formatMoney(payrollAmount)}</div>
                                </div>
                            </div>

                            {/* Current Cash */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{ color: '#2ecc71' }}><Wallet size={20} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>Current Funds</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{formatMoney(currentCash)}</div>
                                </div>
                            </div>

                            {/* Projected Balance */}
                            <div style={{
                                background: 'rgba(var(--team-primary-rgb), 0.05)',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px dashed var(--team-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{ color: 'var(--team-primary)' }}><DollarSign size={20} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>Projected Remaining</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: canAfford ? '#2ecc71' : '#e74c3c' }}>{formatMoney(remainingCash)}</div>
                                </div>
                            </div>
                        </div>

                        {!canAfford && (
                            <div style={{ 
                                marginTop: '24px', 
                                padding: '12px', 
                                background: 'rgba(231, 76, 60, 0.1)', 
                                border: '1px solid #e74c3c', 
                                borderRadius: '12px',
                                color: '#e74c3c',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                textAlign: 'center'
                            }}>
                                INSUFFICIENT CREDITS TO COVER PAYROLL
                            </div>
                        )}

                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '16px',
                                    background: 'var(--bg-card-hover)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                CANCEL
                            </button>
                            <button 
                                onClick={onPay}
                                disabled={!canAfford}
                                style={{
                                    flex: 2,
                                    padding: '16px',
                                    borderRadius: '16px',
                                    background: canAfford ? 'var(--team-primary)' : '#555',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    cursor: canAfford ? 'pointer' : 'not-allowed',
                                    boxShadow: canAfford ? '0 10px 20px -5px rgba(var(--team-primary-rgb), 0.4)' : 'none'
                                }}
                            >
                                PAY SALARIES
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
