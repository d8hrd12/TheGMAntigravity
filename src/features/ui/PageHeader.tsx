import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    onBack: () => void;
    children?: React.ReactNode; 
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, children }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                position: 'relative',
                minHeight: '40px'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '0',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        position: 'absolute',
                        left: 0,
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s'
                    }}
                >
                    <ArrowLeft size={18} />
                </button>
                <h2 style={{
                    margin: 0,
                    color: 'var(--text-main)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    textAlign: 'center'
                }}>
                    {title}
                </h2>
            </div>

            {children && (
                <div style={{ marginTop: '20px' }}>{children}</div>
            )}
        </div>
    );
};
