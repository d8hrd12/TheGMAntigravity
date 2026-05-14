import React from 'react';
import { useGame } from '../../store/GameContext';
import { getPotentialGrade } from '../../utils/playerUtils';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import { ensureColorVibrancy } from '../../utils/colorUtils';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars } from '../../utils/starUtils';
import { StarRating } from '../../components/StarRating';

interface DraftSummaryViewProps {
    onSelectPlayer: (playerId: string) => void;
    onSelectTeam: (teamId: string) => void;
    onContinue: () => void;
}

import { PageHeader } from '../ui/PageHeader';

export const DraftSummaryView: React.FC<DraftSummaryViewProps> = ({ onSelectPlayer, onSelectTeam, onContinue }) => {
    const { draftOrder, draftClass, teams, userTeamId, draftResults, players } = useGame();

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            minHeight: '100vh',
            background: 'var(--bg-main)'
        }}>
            <PageHeader 
                title={`Draft Class ${new Date().getFullYear()}`}
                subtitle="Draft Summary & Results"
                onBack={onContinue}
                backLabel="Continue"
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            >
                <button
                    onClick={onContinue}
                    className="btn-primary"
                    style={{
                        padding: '10px 20px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s',
                        background: 'var(--text-main)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer'
                    }}
                >
                    Offseason Menu <ArrowRight size={16} />
                </button>
            </PageHeader>

            <div style={{ padding: '20px' }}>

            <div style={{
                flex: 1,
                borderRadius: '20px',
                padding: '10px'
            }}>
                {draftResults.length === 0 ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-card-hover)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        No picks made in this draft.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {draftResults.sort((a, b) => a.pick - b.pick).map((result) => {
                            const team = teams.find(t => t.id === result.teamId);
                            const isUserPick = result.teamId === userTeamId;
                            // Try finding player in players (post-draft) or draftClass (pre-draft/bug case)
                            const player = players.find(p => p.id === result.playerId) || draftClass.find(p => p.id === result.playerId);

                            const teamColor = team?.colors?.primary || '#333';

                            return (
                                <div
                                    key={result.pick}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '50px 1.4fr 1.6fr 24px', // Fixed Grid Layout
                                        alignItems: 'center',
                                        background: isUserPick ? 'linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--primary-rgb), 0.05))' : '#fff',
                                        borderRadius: '16px',
                                        padding: '10px 12px', // Reduced side padding slightly
                                        border: isUserPick ? '1px solid var(--text-main)' : '1px solid #f0f0f0',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                        transition: 'transform 0.2s',
                                        animation: 'fadeIn 0.3s ease-out',
                                        gap: '0' // Gap handled by padding/borders
                                    }}
                                >
                                    {/* Pick Number Badge */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%', // Fill grid cell
                                    }}>
                                        <span style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            color: isUserPick ? 'var(--text-main)' : '#333',
                                            lineHeight: 1,
                                            fontFeatureSettings: '"tnum" on, "lnum" on'
                                        }}>
                                            {result.pick}
                                        </span>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', color: '#999', marginTop: '2px', letterSpacing: '0.5px' }}>
                                            PICK
                                        </span>
                                    </div>

                                    {/* Team Logo/Name */}
                                    <div
                                        onClick={() => onSelectTeam(result.teamId)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            padding: '0 10px',
                                            borderRight: '1px solid #eee', // Always in same place due to Grid
                                            height: '100%', // Full height for border
                                            overflow: 'hidden' // Contain text
                                        }}
                                    >
                                        {team && team.logo ? (
                                            <img
                                                src={team.logo}
                                                alt={team.abbreviation}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    objectFit: 'contain',
                                                    flexShrink: 0, // Prevent squash
                                                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                background: '#eee',
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                color: '#777',
                                                fontSize: '0.8rem'
                                            }}>
                                                {team ? team.abbreviation.substring(0, 2) : '??'}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                                            <div style={{
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                color: '#111',
                                                lineHeight: '1.2',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                width: '100%'
                                            }}>
                                                {team ? team.city : 'Unknown'}
                                            </div>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: '#666',
                                                fontWeight: 500,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                width: '100%'
                                            }}>
                                                {team ? team.name : 'Team'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Player Info */}
                                    <div
                                        onClick={() => onSelectPlayer(result.playerId)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            paddingLeft: '14px',
                                            overflow: 'hidden'
                                        }}
                                    >

                                        <div style={{ overflow: 'hidden', width: '100%' }}>
                                            <div style={{
                                                fontWeight: 700,
                                                fontSize: '0.95rem',
                                                color: '#111',
                                                letterSpacing: '-0.3px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {result.playerName}
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', color: '#555', marginTop: '2px', fontWeight: 500, alignItems: 'center' }}>
                                                {player && (
                                                    <>
                                                        <span style={{
                                                            background: '#e0e0e5',
                                                            padding: '1px 5px',
                                                            borderRadius: '4px',
                                                            color: '#222',
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                            flexShrink: 0
                                                        }}>
                                                            {player.position}
                                                        </span>
                                                        <StarRating stars={calculateStars(calculateOverall(player), 75)} size={10} />
                                                        <span style={{
                                                            fontFeatureSettings: '"tnum" on',
                                                            color: '#666',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            {(player.height / 100).toFixed(2)}m • {player.age}yo
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Arrow */}
                                    <div style={{ color: '#ccc', display: 'flex', justifyContent: 'flex-end' }}>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};
