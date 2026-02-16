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
                    position: 'relative', // Context for absolute watermark
                    padding: '20px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: '#ffffff', // Explicit white as requested
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    overflow: 'hidden', // Clip watermark
                    height: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
            >
                {/* Watermark Logo */}
                {team.logo && (
                    <img
                        src={team.logo}
                        alt=""
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '120%', // Oversized
                            height: '120%',
                            objectFit: 'contain',
                            opacity: isSelected ? 0.15 : 0.05,
                            filter: isSelected ? 'none' : 'grayscale(100%)',
                            pointerEvents: 'none',
                            zIndex: 0
                        }}
                    />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#666', fontSize: '0.9rem' }}>{team.city}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : '#222', margin: '5px 0' }}>{team.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{team.abbreviation}</div>
                </div>
            </div>
        );
    };



    // Updated for Dark Theme compatibility to match Main Menu
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center', background: 'var(--background, #1a1a1a)', minHeight: '100vh', color: 'var(--text, #ffffff)' }}>
            <h1 style={{ color: 'var(--text, #ffffff)', marginBottom: '10px' }}>Select Your Team</h1>
            <p style={{ marginBottom: '50px', color: 'var(--text-secondary, #888)' }}>Choose the franchise you want to lead to glory, or create your own.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                <div>
                    <h2 style={{ borderBottom: '2px solid #e74c3c', display: 'inline-block', marginBottom: '20px', color: 'var(--text, #fff)' }}>Western Conference</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                        {westernTeams.map(team => <TeamCard key={team.id} team={team} />)}
                    </div>
                </div>

                <div>
                    <h2 style={{ borderBottom: '2px solid #2980b9', display: 'inline-block', marginBottom: '20px', color: 'var(--text, #fff)' }}>Eastern Conference</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                        {easternTeams.map(team => <TeamCard key={team.id} team={team} />)}
                    </div>
                </div>
            </div>

            {/* Expansion Franchise Section */}
            <div style={{ marginTop: '60px', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
                <div
                    onClick={onCreateTeam}
                    style={{
                        padding: '30px 60px',
                        background: 'linear-gradient(135deg, #FF5F1F 0%, #E64A19 100%)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(255, 95, 31, 0.3)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        maxWidth: '500px',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 95, 31, 0.5)'}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 95, 31, 0.3)';
                    }}
                >
                    <div style={{
                        color: 'white',
                        fontSize: '1.8rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        letterSpacing: '1px',
                        marginBottom: '5px'
                    }}>
                        Start Expansion Franchise
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 500 }}>
                        Create a new legacy from scratch
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px', position: 'sticky', bottom: '20px' }}>
                <button
                    onClick={handleConfirm}
                    disabled={!selectedId}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        background: selectedId ? 'var(--primary)' : '#444',
                        color: selectedId ? 'white' : '#888',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: selectedId ? 'pointer' : 'not-allowed',
                        boxShadow: selectedId ? '0 4px 15px rgba(255, 107, 0, 0.3)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    Start Career
                </button>
            </div>
        </div>
    );
};
