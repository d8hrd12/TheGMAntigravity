import React from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlProps<T extends string> {
    options: {
        value: T;
        label: React.ReactNode;
    }[];
    value: T;
    onChange: (value: T) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const SegmentedControl = <T extends string>({ options, value, onChange, size = 'md' }: SegmentedControlProps<T>) => {
    return (
        <div style={{
            display: 'flex',
            background: 'var(--surface)',
            padding: '4px',
            borderRadius: '8px', // Squarish
            position: 'relative',
            border: '1px solid var(--border)',
            gap: '2px' // Tiny gap
        }}>
            {options.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        style={{
                            flex: 1,
                            position: 'relative',
                            padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
                            background: 'transparent',
                            border: 'none',
                            color: isActive ? '#fff' : 'var(--text-secondary)',
                            fontWeight: 600,
                            fontSize: size === 'sm' ? '0.8rem' : '0.9rem',
                            cursor: 'pointer',
                            zIndex: 1,
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="segmented-control-bg"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'var(--primary)', // Bright green or theme primary
                                    borderRadius: '6px',
                                    zIndex: -1,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
