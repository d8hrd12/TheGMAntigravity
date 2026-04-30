import React from 'react';

interface StarRatingProps {
    stars: number; // 0.5 to 5.0
    size?: number; // width in px
    color?: string; // solid color
    emptyColor?: string;
    vertical?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
    stars, 
    size = 14, 
    color = '#f1c40f', // classic gold
    emptyColor = 'rgba(0, 0, 0, 0.1)',
    vertical = false
}) => {
    // Generate a unique ID for the gradients to avoid collisions if multiple are rendered
    const uniqueId = React.useMemo(() => Math.random().toString(36).substring(7), []);

    const renderStar = (index: number) => {
        const fillPercentage = Math.max(0, Math.min(100, (stars - index) * 100));
        const gradientId = `starGrad-${uniqueId}-${index}`;

        return (
            <svg 
                key={index} 
                width={size} 
                height={size} 
                viewBox="0 0 24 24" 
                style={{ display: 'block' }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${fillPercentage}%`} stopColor={color} />
                        <stop offset={`${fillPercentage}%`} stopColor={emptyColor} />
                    </linearGradient>
                </defs>
                <path 
                    fill={`url(#${gradientId})`} 
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                />
            </svg>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: '2px', alignItems: 'center' }}>
            {[0, 1, 2, 3, 4].map(i => renderStar(i))}
        </div>
    );
};
