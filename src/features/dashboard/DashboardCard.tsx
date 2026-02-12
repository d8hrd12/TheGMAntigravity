import React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface DashboardCardProps extends Omit<HTMLMotionProps<"div">, "title"> {
    children: ReactNode;
    title?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    noPadding?: boolean;
    className?: string;
    style?: CSSProperties;
    variant?: 'white' | 'glass' | 'hero' | 'dark';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    children,
    title,
    icon,
    action,
    noPadding = false,
    className = "",
    style,
    variant = 'white',
    ...props
}) => {
    // Base styles based on variants from screenshot
    const getVariantStyles = (): CSSProperties => {
        switch (variant) {
            case 'hero':
                return {
                    background: 'linear-gradient(135deg, #1a365d 0%, #0d1a2d 100%)',
                    color: 'white',
                    borderRadius: '28px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                };
            case 'dark':
                return {
                    background: '#1F1F1F',
                    color: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                };
            case 'glass':
                return {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                };
            case 'white':
            default:
                return {
                    background: '#FFFFFF',
                    color: '#1A1A1A',
                    borderRadius: '28px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                };
        }
    };

    const headerColor = variant === 'white' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)';

    return (
        <motion.div
            className={`replica-card ${className}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                width: '100%',
                boxSizing: 'border-box',
                ...getVariantStyles(),
                ...style
            }}
            {...props}
        >
            {(title || icon || action) && (
                <div style={{
                    padding: '16px 24px 0 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {icon && <span style={{ color: variant === 'white' ? '#1A1A1A' : 'white', display: 'flex', opacity: 0.7 }}>{icon}</span>}
                        {title && (
                            <h3 style={{
                                margin: 0,
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                letterSpacing: '0.02em',
                                color: variant === 'white' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                                textTransform: 'uppercase',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            }}>
                                {title}
                            </h3>
                        )}
                    </div>
                    {action && <div style={{ fontSize: '0.8rem' }}>{action}</div>}
                </div>
            )}

            <div style={{
                padding: noPadding ? '0' : '16px 20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {children}
            </div>
        </motion.div>
    );
};
