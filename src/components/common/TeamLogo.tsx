import React from 'react';
import { useGame } from '../../store/GameContext';

interface TeamLogoProps {
    teamId: string;
    size?: number;
    className?: string;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ teamId, size = 40, className }) => {
    const { teams } = useGame();
    const team = teams.find(t => t.id === teamId);

    if (!team) return null;

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: team.colors?.primary || '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: size * 0.4,
                fontWeight: 'bold',
                border: `2px solid ${team.colors?.secondary || '#ccc'}`
            }}
        >
            {team.abbreviation.substring(0, 2)}
        </div>
    );
};
