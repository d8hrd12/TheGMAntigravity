import React, { useState } from 'react';
import type { Team } from '../../models/Team';
import { NBA_TEAMS } from '../../data/teams';
import { EURO_TEAMS } from '../../data/euro/teams';
import { useGame } from '../../store/GameContext';

interface TeamSelectionViewProps {
    onSelectTeam: (teamId: string) => void;
    onCreateTeam: () => void;
}

export const TeamSelectionView: React.FC<TeamSelectionViewProps> = ({ onSelectTeam, onCreateTeam }) => {
    const { leagueType, competitionType } = useGame();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const teamsToDisplay = leagueType === 'EURO' 
        ? EURO_TEAMS.filter(t => t.conference === competitionType)
        : NBA_TEAMS;
    const westernTeams = teamsToDisplay.filter(t => t.conference === 'West' || t.conference === 'EuroLeague' || t.conference === 'EuroCup');
    const easternTeams = teamsToDisplay.filter(t => t.conference === 'East');

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
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}>
                        <img
                            src={team.logo}
                            alt=""
                            style={{
                                width: '90%', 
                                height: '90%',
                                objectFit: 'contain',
                                opacity: isSelected ? 0.3 : 0.06,
                                filter: isSelected ? 'none' : 'grayscale(100%) brightness(0.8)',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            }}
                        />
                    </div>
                )}

                <div style={{ position: 'relative', zIndex: 1, width: '100%', padding: '0 10px' }}>
                    <div style={{ fontWeight: 600, color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{team.city}</div>
                    <div style={{ 
                        fontSize: team.name.length > 22 ? '1.1rem' : team.name.length > 15 ? '1.3rem' : '1.6rem', 
                        fontWeight: 950, 
                        color: isSelected ? 'var(--primary)' : '#222', 
                        margin: '4px 0',
                        lineHeight: 1.1,
                        wordBreak: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {team.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 800, letterSpacing: '2px' }}>{team.abbreviation}</div>
                </div>
            </div>
        );
    };



    // Updated for Dark Theme compatibility to match Main Menu
    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px 100px 20px', // Increased bottom padding
            textAlign: 'center',
            background: 'var(--background, #1a1a1a)',
            minHeight: '100vh',
            color: 'var(--text, #ffffff)',
            position: 'relative' // Context for sticky
        }}>
            <h1 style={{ color: 'var(--text, #ffffff)', marginBottom: '10px' }}>Select Your Team</h1>
            <p style={{ marginBottom: '50px', color: 'var(--text-secondary, #888)' }}>Choose the franchise you want to lead to glory, or create your own.</p>

            <div style={{ display: 'grid', gridTemplateColumns: leagueType === 'EURO' ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                <div>
                    {leagueType === 'NBA' && <h2 style={{ borderBottom: '2px solid #e74c3c', display: 'inline-block', marginBottom: '20px', color: 'var(--text, #fff)' }}>Western Conference</h2>}
                    {leagueType === 'EURO' && <h2 style={{ borderBottom: '2px solid #EAB308', display: 'inline-block', marginBottom: '20px', color: 'var(--text, #fff)' }}>All Teams</h2>}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                        {westernTeams.map(team => <TeamCard key={team.id} team={team} />)}
                    </div>
                </div>

                {leagueType === 'NBA' && (
                    <div>
                        <h2 style={{ borderBottom: '2px solid #2980b9', display: 'inline-block', marginBottom: '20px', color: 'var(--text, #fff)' }}>Eastern Conference</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                            {easternTeams.map(team => <TeamCard key={team.id} team={team} />)}
                        </div>
                    </div>
                )}
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

            <div style={{
                marginTop: '20px',
                position: 'sticky',
                bottom: '20px',
                zIndex: 100,
                background: 'transparent',
                pointerEvents: 'none'
            }}>
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
                        transition: 'all 0.2s',
                        pointerEvents: 'auto'
                    }}
                >
                    Start Career
                </button>
            </div>
        </div>
    );
};
