import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    onBack: () => void;
    children?: React.ReactNode; // For content below the header (filters, toggles, etc.)
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, children }) => {
    return (
        <div style={{ marginBottom: children ? '20px' : '15px' }}>
            {/* Header Row: Back Arrow + Title (Alone) */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: children ? '15px' : '0'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{
                    margin: 0,
                    color: '#fff',
                    fontSize: '1.4rem',
                    fontWeight: '700'
                }}>
                    {title}
                </h2>
            </div>

            {/* Optional content below header (filters, toggles, etc.) */}
            {children && (
                <div>{children}</div>
            )}
        </div>
    );
};
