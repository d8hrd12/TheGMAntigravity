import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    onClick: () => void;
    style?: React.CSSProperties;
    className?: string; // Allow passing className if needed
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, style, className }) => {
    return (
        <button
            onClick={onClick}
            className={className}
            style={{
                background: 'var(--surface-glass)',
                border: '1px solid var(--border)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                cursor: 'pointer',
                flexShrink: 0, // Prevent shrinking in flex containers
                ...style
            }}
        >
            <ArrowLeft size={20} />
        </button>
    );
};
