import React, { useMemo } from 'react';
import { useGame } from '../../store/GameContext';
import { ChevronLeft, Trophy } from 'lucide-react';
import type { Player } from '../../models/Player';
import { PageHeader } from '../ui/PageHeader';
import { StarRating } from '../../components/StarRating';
import { calculateOverall } from '../../utils/playerUtils';
import { calculateStars, calculateTeamBaseline } from '../../utils/starUtils';

interface SeasonLeadersViewProps {
    onBack: () => void;
    onSelectPlayer: (id: string) => void;
}

interface LeaderEntry {
    player: Player;
    value: number;
    formattedValue: string;
    teamAbbrev: string;
}

export const SeasonLeadersView: React.FC<SeasonLeadersViewProps> = ({ onBack, onSelectPlayer }) => {
    const { players, teams, seasonGamesPlayed, leagueType } = useGame();
    const [selectedLeague, setSelectedLeague] = React.useState<'EuroLeague' | 'EuroCup'>(leagueType === 'EURO' ? 'EuroLeague' : 'EuroLeague');

    // Filter teams and players for the current league
    const leaguePlayers = useMemo(() => {
        if (leagueType === 'NBA') {
            // For NBA, just show all players with teams
            return players.filter(p => p.teamId);
        } else {
            // For EURO, filter by conference (EuroLeague or EuroCup)
            const leagueTeamIds = new Set(teams.filter(t => t.conference === selectedLeague).map(t => t.id));
            return players.filter(p => p.teamId && leagueTeamIds.has(p.teamId));
        }
    }, [players, teams, leagueType, selectedLeague]);

    const teamBaseline = useMemo(() => {
        // Just a fast average for display purposes
        return calculateTeamBaseline(players);
    }, [players]);

    const getTeamAbbrev = (teamId: string | null) => {
        if (!teamId) return 'FA';
        const team = teams.find(t => t.id === teamId);
        return team ? team.abbreviation : 'UNK';
    };

    // Calculate leaders for a specific metric
    const getLeaders = (
        metricCalc: (p: Player) => number,
        format: (val: number) => string,
        qualifier?: (p: Player) => boolean
    ): LeaderEntry[] => {
        let eligible = leaguePlayers.filter(p => p.seasonStats && p.seasonStats.gamesPlayed > 0);
        
        // Apply minimum qualifiers (e.g., minimum attempts for percentages)
        if (qualifier) {
            eligible = eligible.filter(qualifier);
        } else {
            // General qualifier: Must have played at least 30% of the season so far (min 1 game)
            const minGames = Math.max(1, Math.floor(seasonGamesPlayed * 0.3));
            eligible = eligible.filter(p => (p.seasonStats?.gamesPlayed || 0) >= minGames);
        }

        const calculated = eligible.map(p => ({
            player: p,
            value: metricCalc(p),
            teamAbbrev: getTeamAbbrev(p.teamId),
            formattedValue: ''
        }));

        const sorted = calculated.sort((a, b) => b.value - a.value).slice(0, 5);
        
        return sorted.map(s => ({
            ...s,
            formattedValue: format(s.value)
        }));
    };

    // Categories
    const categories = useMemo(() => {
        const minGames = Math.max(1, Math.floor(seasonGamesPlayed * 0.3));
        const gpQual = (p: Player) => (p.seasonStats?.gamesPlayed || 0) >= minGames;

        return [
            {
                title: "POINTS PER GAME",
                leaders: getLeaders(
                    p => (p.seasonStats!.points / p.seasonStats!.gamesPlayed),
                    v => v.toFixed(1)
                )
            },
            {
                title: "REBOUNDS PER GAME",
                leaders: getLeaders(
                    p => (p.seasonStats!.rebounds / p.seasonStats!.gamesPlayed),
                    v => v.toFixed(1)
                )
            },
            {
                title: "ASSISTS PER GAME",
                leaders: getLeaders(
                    p => (p.seasonStats!.assists / p.seasonStats!.gamesPlayed),
                    v => v.toFixed(1)
                )
            },
            {
                title: "STEALS PER GAME",
                leaders: getLeaders(
                    p => (p.seasonStats!.steals / p.seasonStats!.gamesPlayed),
                    v => v.toFixed(1)
                )
            },
            {
                title: "BLOCKS PER GAME",
                leaders: getLeaders(
                    p => (p.seasonStats!.blocks / p.seasonStats!.gamesPlayed),
                    v => v.toFixed(1)
                )
            },
            {
                title: "FIELD GOAL %",
                leaders: getLeaders(
                    p => (p.seasonStats!.fgMade / p.seasonStats!.fgAttempted) * 100,
                    v => `${v.toFixed(1)}%`,
                    p => gpQual(p) && (p.seasonStats!.fgAttempted / p.seasonStats!.gamesPlayed) >= 5
                )
            },
            {
                title: "3-POINT %",
                leaders: getLeaders(
                    p => (p.seasonStats!.threeMade / p.seasonStats!.threeAttempted) * 100,
                    v => `${v.toFixed(1)}%`,
                    p => gpQual(p) && (p.seasonStats!.threeAttempted / p.seasonStats!.gamesPlayed) >= 2
                )
            },
            {
                title: "FREE THROW %",
                leaders: getLeaders(
                    p => (p.seasonStats!.ftMade / p.seasonStats!.ftAttempted) * 100,
                    v => `${v.toFixed(1)}%`,
                    p => gpQual(p) && (p.seasonStats!.ftAttempted / p.seasonStats!.gamesPlayed) >= 2
                )
            },
            {
                title: "EFFICIENCY (PIR)",
                leaders: getLeaders(
                    p => {
                        const s = p.seasonStats!;
                        const missedFg = s.fgAttempted - s.fgMade;
                        const missedFt = s.ftAttempted - s.ftMade;
                        const pirTotal = (s.points + s.rebounds + s.assists + s.steals + s.blocks) 
                                        - (missedFg + missedFt + s.turnovers + (s.fouls || 0));
                        return pirTotal / s.gamesPlayed;
                    },
                    v => v.toFixed(1)
                )
            },
            {
                title: "MINUTES PER GAME",
                leaders: getLeaders(
                    p => (p.seasonStats!.minutes / p.seasonStats!.gamesPlayed),
                    v => v.toFixed(1)
                )
            }
        ];
    }, [leaguePlayers, seasonGamesPlayed]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', sans-serif" }}>
            <PageHeader
                title="SEASON LEADERS"
                onBack={onBack}
            >
                {leagueType === 'EURO' && (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        {/* League Toggle */}
                        <div style={{ 
                            display: 'flex', 
                            background: 'rgba(0,0,0,0.2)', 
                            padding: '4px', 
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            {(['EuroLeague', 'EuroCup'] as const).map(league => (
                                <button
                                    key={league}
                                    onClick={() => setSelectedLeague(league)}
                                    style={{
                                        padding: '8px 24px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        background: selectedLeague === league ? 'var(--team-primary)' : 'transparent',
                                        color: selectedLeague === league ? '#fff' : 'var(--text-dim)',
                                        fontSize: '0.8rem',
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: selectedLeague === league ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none'
                                    }}
                                >
                                    {league}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </PageHeader>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '20px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {categories.map((category, i) => (
                        <div key={i} className="modern-card animate-fade" style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                            <div style={{ 
                                padding: '12px 16px', 
                                background: 'linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), transparent)',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Trophy size={14} color="var(--team-primary)" />
                                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.05em' }}>
                                    {category.title}
                                </h3>
                            </div>
                            
                            <div style={{ padding: '8px' }}>
                                {category.leaders.map((leader, index) => {
                                    const isFirst = index === 0;
                                    const ovr = calculateOverall(leader.player);
                                    const stars = calculateStars(ovr, teamBaseline);
                                    
                                    return (
                                        <div 
                                            key={leader.player.id}
                                            onClick={() => onSelectPlayer(leader.player.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '10px 12px',
                                                gap: '12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                background: isFirst ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                                                border: isFirst ? '1px solid rgba(var(--primary-rgb), 0.2)' : '1px solid transparent',
                                                marginBottom: '4px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = isFirst ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent'}
                                        >
                                            <div style={{ 
                                                width: '24px', 
                                                fontSize: isFirst ? '1rem' : '0.85rem', 
                                                fontWeight: 900, 
                                                color: isFirst ? 'var(--team-primary)' : 'var(--text-muted)',
                                                textAlign: 'center'
                                            }}>
                                                {index + 1}
                                            </div>
                                            
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: isFirst ? '0.9rem' : '0.8rem', fontWeight: isFirst ? 800 : 700, color: 'var(--text-main)' }}>
                                                        {leader.player.firstName[0]}. {leader.player.lastName}
                                                    </span>
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>
                                                        {leader.teamAbbrev}
                                                    </span>
                                                </div>
                                                <StarRating stars={stars} size={10} />
                                            </div>
                                            
                                            <div style={{ 
                                                fontSize: isFirst ? '1.1rem' : '0.95rem', 
                                                fontWeight: 900, 
                                                color: isFirst ? 'var(--text-main)' : 'var(--text-dim)'
                                            }}>
                                                {leader.formattedValue}
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {category.leaders.length === 0 && (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Not enough games played yet
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
