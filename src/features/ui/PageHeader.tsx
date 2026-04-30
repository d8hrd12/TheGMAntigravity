import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    onBack: () => void;
    children?: React.ReactNode; 
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, children }) => {
    return (
        <div style={{ marginBottom: '30px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
            }}>
                <button
                    onClick={onBack}
                    className="btn-pixel"
                    style={{
                        padding: '8px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 0px #00a8b3'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{
                    margin: 0,
                    color: 'var(--primary)',
                    fontSize: '1.2rem',
                    textShadow: 'var(--neon-glow)'
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
