import React, { useMemo, useState } from 'react';
import { useGame, type PlayInMatchup } from '../../store/GameContext';
import { PageHeader } from '../ui/PageHeader';
import { Trophy, Play, ChevronRight, Zap, Target, Shield } from 'lucide-react';
import { calculateOverall } from '../../utils/playerUtils';
import type { MatchResult } from '../simulation/SimulationTypes';
import { simulateMatchV3 as simulateMatch } from '../simulation/v3/MatchEngineV3';

const EuroPlayInView: React.FC = () => {
    const { setGameState, euroPlayIn, teams, players, userTeamId, competitionType, date } = useGame();

    const [isSimulating, setIsSimulating] = useState(false);

    if (!euroPlayIn) return <div>Error: Play-In data not found.</div>;

    const elMatchups = euroPlayIn.matchups.filter((m: PlayInMatchup) => m.conference === 'EuroLeague');
    const ecMatchups = euroPlayIn.matchups.filter((m: PlayInMatchup) => m.conference === 'EuroCup');

    const getTeam = (id: string) => teams.find((t: any) => t.id === id);
    const getTeamOvr = (id: string) => {
        const teamPlayers = players.filter((p: any) => p.teamId === id);
        if (teamPlayers.length === 0) return 0;
        return Math.round(teamPlayers.reduce((sum: number, p: any) => sum + calculateOverall(p), 0) / teamPlayers.length);
    };

    const simulateGame = (matchupId: string) => {
        setIsSimulating(true);
        setTimeout(() => {
            setGameState(prev => {
                if (!prev.euroPlayIn) return prev;
                const newMatchups = [...prev.euroPlayIn.matchups];
                const mIdx = newMatchups.findIndex(m => m.id === matchupId);
                if (mIdx === -1 || newMatchups[mIdx].played) return prev;

                const m = newMatchups[mIdx];
                const home = prev.teams.find(t => t.id === m.homeTeamId)!;
                const away = prev.teams.find(t => t.id === m.awayTeamId)!;
                const homeRoster = prev.players.filter(p => p.teamId === home.id);
                const awayRoster = prev.players.filter(p => p.teamId === away.id);

                const result = simulateMatch({
                    homeTeam: home,
                    awayTeam: away,
                    homeRoster: homeRoster,
                    awayRoster: awayRoster,
                    date: date,
                    leagueType: 'EURO',
                    isPlayoffs: true
                });
                
                newMatchups[mIdx] = {
                    ...m,
                    played: true,
                    winnerId: result.winnerId,
                    loserId: result.winnerId === m.homeTeamId ? m.awayTeamId : m.homeTeamId,
                    result: result
                };

                // Logic for advancing rounds
                const conf = m.conference;
                const confMatchups = newMatchups.filter((match: PlayInMatchup) => match.conference === conf);
                const g78 = confMatchups.find((match: PlayInMatchup) => match.type === '7vs8');
                const g910 = confMatchups.find((match: PlayInMatchup) => match.type === '9vs10');

                // If both Round 1 games played, create the final Play-In game
                if (g78?.played && g910?.played && !confMatchups.some((match: PlayInMatchup) => match.type === 'Loser78vsWinner910')) {
                    newMatchups.push({
                        id: `playin_${conf}_final`,
                        type: 'Loser78vsWinner910',
                        conference: conf,
                        homeTeamId: g78.loserId!,
                        awayTeamId: g910.winnerId!,
                        played: false
                    });
                }

                return {
                    ...prev,
                    euroPlayIn: {
                        ...prev.euroPlayIn!,
                        matchups: newMatchups
                    }
                };
            });
            setIsSimulating(false);
        }, 800);
    };

    const simulateAll = () => {
        // Simulates all currently available unplayed games
        const unplayed = euroPlayIn.matchups.filter((m: PlayInMatchup) => !m.played);
        if (unplayed.length === 0) return;
        
        unplayed.forEach((m: PlayInMatchup) => simulateGame(m.id));
    };

    const startPlayoffs = () => {
        setGameState(prev => {
            if (!prev.euroPlayIn) return prev;

            const conferences: ('EuroLeague' | 'EuroCup')[] = ['EuroLeague', 'EuroCup'];
            const allSeries: any[] = [];

            conferences.forEach(conf => {
                const locked = prev.euroPlayIn!.seedsLocked[conf]; // Seeds 1-6
                const confMatchups = prev.euroPlayIn!.matchups.filter((m: PlayInMatchup) => m.conference === conf);
                
                const s7winner = confMatchups.find((m: PlayInMatchup) => m.type === '7vs8')?.winnerId;
                const s8winner = confMatchups.find((m: PlayInMatchup) => m.type === 'Loser78vsWinner910')?.winnerId;

                if (!s7winner || !s8winner) return;

                const playoffTeams = [...locked, s7winner, s8winner];
                
                // standard 1-8, 2-7, 3-6, 4-5 matchups
                const matchups = [[0, 7], [1, 6], [2, 5], [3, 4]];
                matchups.forEach((m, idx) => {
                    allSeries.push({
                        id: `${conf}_1_${idx + 1}`,
                        round: 1,
                        conference: conf,
                        homeTeamId: playoffTeams[m[0]],
                        awayTeamId: playoffTeams[m[1]],
                        homeWins: 0,
                        awayWins: 0
                    });
                });
            });

            return {
                ...prev,
                seasonPhase: 'playoffs_r1',
                playoffs: allSeries,
                view: 'playoffs'
            };
        });
    };

    const allGamesPlayed = euroPlayIn.matchups.filter((m: PlayInMatchup) => m.conference === 'EuroLeague').length >= 3 &&
                          euroPlayIn.matchups.filter((m: PlayInMatchup) => m.conference === 'EuroCup').length >= 3 &&
                          euroPlayIn.matchups.every((m: PlayInMatchup) => m.played);

    const MatchupCard = ({ matchup }: { matchup: PlayInMatchup }) => {
        const home = getTeam(matchup.homeTeamId);
        const away = getTeam(matchup.awayTeamId);
        const isUserMatch = matchup.homeTeamId === userTeamId || matchup.awayTeamId === userTeamId;

        return (
            <div style={{ 
                background: 'var(--bg-card)', 
                borderRadius: '16px', 
                padding: '10px', 
                border: isUserMatch ? '2px solid var(--team-primary)' : '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {isUserMatch && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--team-primary)', color: '#fff', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '0 0 0 8px', fontWeight: 900 }}>
                        YOUR GAME
                    </div>
                )}
                
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={12} />
                    {matchup.type === '7vs8' ? '7TH SEED BATTLE' : matchup.type === '9vs10' ? 'ELIMINATION GAME' : 'FINAL SEED DECIDER'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    {/* AWAY */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        {away?.logo ? (
                            <div style={{ width: '40px', height: '40px', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-color)' }}>
                                <img src={away.logo} alt={away.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                        ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: away?.colors?.primary || 'var(--team-primary)', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 900 }}>
                                {away?.name[0]}
                            </div>
                        )}
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>{away?.abbreviation}</div>
                        <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>OVR: {getTeamOvr(matchup.awayTeamId)}</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {matchup.played ? (
                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>
                                {matchup.result?.awayScore} - {matchup.result?.homeScore}
                            </div>
                        ) : (
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-muted)' }}>VS</div>
                        )}
                    </div>

                    {/* HOME */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        {home?.logo ? (
                            <div style={{ width: '40px', height: '40px', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-color)' }}>
                                <img src={home.logo} alt={home.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                        ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: home?.colors?.primary || 'var(--team-primary)', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 900 }}>
                                {home?.name[0]}
                            </div>
                        )}
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>{home?.abbreviation}</div>
                        <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>OVR: {getTeamOvr(matchup.homeTeamId)}</div>
                    </div>
                </div>

                {!matchup.played && (
                    <button 
                        onClick={() => simulateGame(matchup.id)}
                        disabled={isSimulating}
                        style={{
                            width: '100%',
                            marginTop: '16px',
                            padding: '10px',
                            borderRadius: '10px',
                            background: isUserMatch ? 'var(--team-primary)' : 'var(--bg-card-hover)',
                            color: isUserMatch ? '#fff' : 'var(--text-main)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Zap size={14} /> SIMULATE GAME
                    </button>
                )}
                {matchup.played && (
                    <div style={{ 
                        marginTop: '16px', 
                        padding: '8px', 
                        borderRadius: '8px', 
                        background: 'rgba(46, 204, 113, 0.1)', 
                        color: '#2ecc71', 
                        fontSize: '0.65rem', 
                        fontWeight: 800, 
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                    }}>
                        <Shield size={12} /> {getTeam(matchup.winnerId!)?.name.toUpperCase()} ADVANCES
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: '8px', maxWidth: '1200px', margin: '0 auto' }}>
            <PageHeader 
                title="EURO PLAY-IN TOURNAMENT" 
                onBack={() => setGameState(prev => ({ ...prev, view: 'dashboard' }))}
                teamColor={teams.find(t => t.id === userTeamId)?.colors?.primary}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '24px' }}>
                {/* EUROLEAGUE SECTION */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#f39c12' }}>
                        <Trophy size={16} />
                        <h2 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>EUROLEAGUE</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {elMatchups.map((m: PlayInMatchup) => <MatchupCard key={m.id} matchup={m} />)}
                        {elMatchups.length < 3 && (
                            <div style={{ padding: '24px', borderRadius: '16px', border: '2px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                Awaiting Round 1 Results...
                            </div>
                        )}
                    </div>
                </section>

                {/* EUROCUP SECTION */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#3498db' }}>
                        <Trophy size={16} />
                        <h2 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>EUROCUP</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {ecMatchups.map((m: PlayInMatchup) => <MatchupCard key={m.id} matchup={m} />)}
                        {ecMatchups.length < 3 && (
                            <div style={{ padding: '24px', borderRadius: '16px', border: '2px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                Awaiting Round 1 Results...
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <div style={{ 
                marginTop: '40px', 
                padding: '24px', 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>POST-SEASON PROGRESS</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {allGamesPlayed ? 'All Play-In spots decided. Ready for Playoffs.' : 'Simulate games to determine the final 8 seeds.'}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {!allGamesPlayed && (
                        <button 
                            onClick={simulateAll}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            SIMULATE ALL
                        </button>
                    )}
                    {allGamesPlayed && (
                        <button 
                            onClick={startPlayoffs}
                            style={{
                                padding: '12px 32px',
                                borderRadius: '12px',
                                background: 'var(--team-primary)',
                                color: '#fff',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                        >
                            START PLAYOFFS <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default EuroPlayInView;
