import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import { NBA_TEAMS } from '../../data/teams';

interface TeamSelectionViewProps {
    onSelectTeam: (teamId: string) => void;
    onCreateTeam: () => void;
}

export const TeamSelectionView: React.FC<TeamSelectionViewProps> = ({ onSelectTeam, onCreateTeam }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const westernTeams = NBA_TEAMS.filter(t => t.conference === 'West');
    const easternTeams = NBA_TEAMS.filter(t => t.conference === 'East');

    const handleConfirm = () => {
        if (selectedId) {
            onSelectTeam(selectedId);
        }
    };

    const TeamCard = ({ team }: { team: Team }) => {
        const isSelected = selectedId === team.id;
        return (
            <div
                onClick={() => setSelectedId(team.id)}
                style={{
                    padding: '10px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? '#fff3e0' : 'white',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                }}
            >
                <div style={{ fontWeight: 'bold', color: '#555' }}>{team.city}</div>
                <div style={{ fontSize: '1.2rem', color: isSelected ? 'var(--primary)' : '#333' }}>{team.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{team.abbreviation}</div>
            </div>
        );
    };

    const CreateTeamCard = () => (
        <div
            onClick={onCreateTeam}
            style={{
                padding: '10px',
                border: '2px dashed var(--primary)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'rgba(230, 126, 34, 0.1)',
                transition: 'all 0.2s',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '80px'
            }}
        >
            <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>+ Create a Team</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Expansion Franchise</div>
        </div>
    );

    // Explicit white background for this view to avoid dark mode issues with the cards
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center', background: '#f5f5f5', minHeight: '100vh' }}>
            <h1 style={{ color: '#333' }}>Select Your Team</h1>
            <p style={{ marginBottom: '30px', color: '#666' }}>Choose the franchise you want to lead to glory, or create your own.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                <div>
                    <h2 style={{ borderBottom: '2px solid #e74c3c', display: 'inline-block', marginBottom: '20px', color: '#333' }}>Western Conference</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                        {westernTeams.map(team => <TeamCard key={team.id} team={team} />)}
                    </div>
                </div>

                <div>
                    <h2 style={{ borderBottom: '2px solid #2980b9', display: 'inline-block', marginBottom: '20px', color: '#333' }}>Eastern Conference</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                        <CreateTeamCard />
                        {easternTeams.map(team => <TeamCard key={team.id} team={team} />)}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px', position: 'sticky', bottom: '20px' }}>
                <button
                    onClick={handleConfirm}
                    disabled={!selectedId}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        background: selectedId ? 'var(--primary)' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: selectedId ? 'pointer' : 'not-allowed',
                        boxShadow: selectedId ? '0 4px 15px rgba(255, 107, 0, 0.3)' : 'none'
                    }}
                >
                    Start Career
                </button>
            </div>
        </div>
    );
};
