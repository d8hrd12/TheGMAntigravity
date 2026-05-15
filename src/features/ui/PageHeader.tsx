import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    onBack: () => void;
    children?: React.ReactNode; 
    teamColor?: string;
    backLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack, children, teamColor, backLabel }) => {
    return (
        <div style={{ 
            padding: 'calc(24px + env(safe-area-inset-top)) 20px 24px 20px', 
            marginBottom: '10px',
            borderBottom: '1px solid #f0f0f0',
            background: '#ffffff',
            width: '100%',
            position: 'relative',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        width: backLabel ? 'auto' : '48px',
                        height: '48px',
                        padding: backLabel ? '0 16px' : '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        border: '1px solid #eeeeee',
                        background: '#ffffff',
                        color: '#111111',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        zIndex: 1
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9f9f9';
                        e.currentTarget.style.borderColor = '#dddddd';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#eeeeee';
                    }}
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                    {backLabel && <span style={{ marginLeft: '8px', fontWeight: 600 }}>{backLabel}</span>}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', textAlign: 'left', zIndex: 1 }}>
                    <h1 style={{
                        margin: 0,
                        color: '#111111',
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                    }}>
                        {title}
                    </h1>
                    {subtitle && (
                        <h2 style={{
                            margin: 0,
                            color: 'var(--text-dim)',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            letterSpacing: '-0.01em',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                        }}>
                            {subtitle}
                        </h2>
                    )}
                </div>
            </div>

            {children && (
                <div style={{ marginTop: '24px', maxWidth: '1200px', margin: '24px auto 0' }}>{children}</div>
            )}
        </div>
    );
};
