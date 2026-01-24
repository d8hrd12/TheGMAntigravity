import React, { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';
import { calculateContractAmount, calculateAdjustedDemand } from '../../utils/contractUtils';
import type { Player } from '../../models/Player';
import { calculateOverall } from '../../utils/playerUtils';

interface ResigningViewProps {
    onSelectPlayer?: (id: string) => void;
    onShowMessage?: (title: string, msg: string, type: 'error' | 'info' | 'success') => void;
}

export const ResigningView: React.FC<ResigningViewProps> = ({ onSelectPlayer, onShowMessage }) => {
    const { players, userTeamId, endResigning, signPlayerWithContract, teams, salaryCap } = useGame();

    const userTeam = teams.find(t => t.id === userTeamId);

    // Filter FAs who were on user team last year
    const expiringPlayers = players.filter(p => {
        if (p.teamId) return false;
        const lastSeason = p.careerStats?.[p.careerStats.length - 1];
        return lastSeason && lastSeason.teamId === userTeamId;
    });

    const [actionedPlayers, setActionedPlayers] = useState<string[]>([]);
    const [negotiatingPlayer, setNegotiatingPlayer] = useState<Player | null>(null);

    // Negotiation State
    const [offerAmount, setOfferAmount] = useState<number>(0);
    const [offerYears, setOfferYears] = useState<number>(1);
    const [offerRole, setOfferRole] = useState<'Star' | 'Starter' | 'Rotation' | 'Bench' | 'Prospect'>('Rotation');
    const [playerResponse, setPlayerResponse] = useState<string | null>(null);
    const [askingDetails, setAskingDetails] = useState<{ amount: number; years: number; explanation: string } | null>(null);

    // Reset when selecting a new player
    useEffect(() => {
        if (negotiatingPlayer) {
            const market = calculateContractAmount(negotiatingPlayer, salaryCap);
            setAskingDetails(market);
            setOfferAmount(market.amount);
            setOfferYears(market.years);

            // Set default role expectation based on explanation or OVR
            const ovr = calculateOverall(negotiatingPlayer);
            if (ovr >= 85) setOfferRole('Star');
            else if (ovr >= 78) setOfferRole('Starter');
            else if (ovr >= 74) setOfferRole('Rotation');
            else if (ovr >= 70) setOfferRole('Bench');
            else setOfferRole('Prospect');

            setPlayerResponse(null);
        }
    }, [negotiatingPlayer, salaryCap]);


    const handleRelease = (playerId: string) => {
        // Just mark them as ignored locally so they disappear from list
        setActionedPlayers(prev => [...prev, playerId]);
        if (negotiatingPlayer?.id === playerId) setNegotiatingPlayer(null);
    };



    const handleSubmitOffer = () => {
        if (!negotiatingPlayer || !askingDetails) return;

        const market = askingDetails;
        const acceptableAmount = calculateAdjustedDemand(negotiatingPlayer, market.amount, market.years, offerRole, offerYears, true);

        // Years Check - Flexibility
        // Allow +/- 1 year if the money is right
        // But if money is low, strict on years.

        // Amount Check - Flexibility (Buffer)
        // Ensure offer is at least 95% of acceptable amount (5% wiggle room/stone cold fix)
        // Also if total value is very high, user can get away with slightly less AAV

        let decision = 'REJECTED';
        const ratio = offerAmount / acceptableAmount;

        if (ratio >= 0.95) {
            decision = 'ACCEPTED';
        } else if (ratio >= 0.85) {
            // Close... maybe check years?
            if (offerYears > market.years) {
                // Paying less per year but more years... might accept security
                decision = 'ACCEPTED'; // Simplified logic
            } else {
                setPlayerResponse(`We are close, but I need at least $${(acceptableAmount / 1000000).toFixed(2)}M for that role.`);
                return;
            }
        }

        if (decision === 'ACCEPTED') {
            // Deal
            signPlayerWithContract(negotiatingPlayer.id, {
                amount: offerAmount,
                years: offerYears,
                role: offerRole
            });

            setActionedPlayers(prev => [...prev, negotiatingPlayer.id]);
            setNegotiatingPlayer(null);
            onShowMessage?.("Deal Accepted", `${negotiatingPlayer.firstName} ${negotiatingPlayer.lastName} has re-signed with the team!`, "success");
        } else {
            // Refusal messages
            const diff = acceptableAmount - offerAmount;
            if (diff < 1000000) {
                setPlayerResponse(`We are close, but considering the role of ${offerRole}, I need about $${(acceptableAmount / 1000000).toFixed(2)}M.`);
            } else {
                setPlayerResponse(`That offer is too low. Market value is around $${(market.amount / 1000000).toFixed(2)}M.`);
            }
        }
    };

    const visiblePlayers = expiringPlayers.filter(p => !actionedPlayers.includes(p.id));

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>Re-sign Players</h1>
                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)' }}>
                        Negotiate with expiring contracts before they hit Free Agency.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71' }}></div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Available Cash:</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                ${((userTeam?.cash || 0) / 1000000).toFixed(1)}M
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: (userTeam?.salaryCapSpace || 0) > 0 ? '#3498db' : '#e74c3c' }}></div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cap Space:</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: (userTeam?.salaryCapSpace || 0) > 0 ? '#3498db' : '#e74c3c' }}>
                                ${((userTeam?.salaryCapSpace || 0) / 1000000).toFixed(1)}M
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={endResigning}
                    className="btn-primary"
                    style={{ padding: '12px 24px' }}
                >
                    Finish & Go into Free Agency
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* List Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {visiblePlayers.length === 0 && !negotiatingPlayer && <p>No players left to resign.</p>}

                    {visiblePlayers.map(player => {
                        const ovr = calculateOverall(player);
                        return (
                            <div
                                key={player.id}
                                onClick={() => setNegotiatingPlayer(player)}
                                style={{
                                    padding: '15px',
                                    background: negotiatingPlayer?.id === player.id ? 'var(--primary-light)' : 'var(--surface)',
                                    border: negotiatingPlayer?.id === player.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    borderRadius: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>{player.firstName} {player.lastName}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{player.position} • {ovr} OVR • Age {player.age}</div>
                                {player.careerStats && player.careerStats.length > 0 && (() => {
                                    const lastS = player.careerStats[player.careerStats.length - 1];
                                    const gp = lastS.gamesPlayed || 1;
                                    const fgp = lastS.fgAttempted ? (lastS.fgMade / lastS.fgAttempted * 100).toFixed(0) : '0';
                                    const tp = lastS.threeAttempted ? (lastS.threeMade / lastS.threeAttempted * 100).toFixed(0) : '0';
                                    return (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{(lastS.points / gp).toFixed(1)} PTS</span> /
                                            <span> {(lastS.rebounds / gp).toFixed(1)} REB</span> /
                                            <span> {(lastS.assists / gp).toFixed(1)} AST</span> —
                                            <span style={{ marginLeft: '4px' }}>{fgp}% FG / {tp}% 3P</span>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>

                {/* Negotiation Column */}
                <div>
                    {negotiatingPlayer ? (
                        <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <h2 style={{ marginTop: 0 }}>Negotiation Table</h2>
                            <h3
                                onClick={() => onSelectPlayer?.(negotiatingPlayer.id)}
                                style={{ color: 'var(--primary)', marginBottom: '10px', cursor: 'pointer', display: 'inline-block' }}
                            >
                                {negotiatingPlayer.firstName} {negotiatingPlayer.lastName}
                            </h3>

                            {negotiatingPlayer.careerStats && negotiatingPlayer.careerStats.length > 0 && (() => {
                                const lastS = negotiatingPlayer.careerStats[negotiatingPlayer.careerStats.length - 1];
                                const gp = lastS.gamesPlayed || 1;
                                const fgp = lastS.fgAttempted ? (lastS.fgMade / lastS.fgAttempted * 100).toFixed(1) : '0.0';
                                const tp = lastS.threeAttempted ? (lastS.threeMade / lastS.threeAttempted * 100).toFixed(1) : '0.0';
                                const ftp = lastS.ftAttempted ? (lastS.ftMade / lastS.ftAttempted * 100).toFixed(1) : '0.0';

                                return (
                                    <div style={{
                                        background: 'var(--background)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        marginBottom: '20px',
                                        border: '1px solid var(--border)',
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', gap: '5px', marginBottom: '10px' }}>
                                            {[
                                                { label: 'PPG', val: (lastS.points / gp).toFixed(1) },
                                                { label: 'RPG', val: (lastS.rebounds / gp).toFixed(1) },
                                                { label: 'APG', val: (lastS.assists / gp).toFixed(1) },
                                                { label: 'GP', val: lastS.gamesPlayed }
                                            ].map(s => (
                                                <div key={s.label}>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{s.label}</div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>{s.val}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>FG%</div>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{fgp}%</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>3P%</div>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{tp}%</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>FT%</div>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{ftp}%</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', background: 'var(--background)', padding: '10px', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Asking Salary</div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        ${askingDetails ? (calculateAdjustedDemand(negotiatingPlayer, askingDetails.amount, askingDetails.years, offerRole, offerYears, true) / 1000000).toFixed(2) : '0.00'}M
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Preferred Length</div>
                                    <div style={{ fontWeight: 'bold' }}>{askingDetails?.years || 1} Years</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px', padding: '10px', background: 'rgba(var(--success-rgb), 0.1)', borderRadius: '8px', border: '1px solid var(--success)', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Home Discount Applied: 10%</span>
                                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    Players accept less to stay with their current team. If they hit Free Agency, they will expect the full market value.
                                </div>
                            </div>

                            {playerResponse && (
                                <div style={{
                                    padding: '15px',
                                    background: '#fff3e0',
                                    color: '#e65100',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    fontStyle: 'italic'
                                }}>
                                    "{playerResponse}"
                                </div>
                            )}

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Offer Amount: ${(offerAmount / 1000000).toFixed(2)}M</label>
                                <input
                                    type="range"
                                    min="700000"
                                    max="60000000"
                                    step="500000"
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Offer Years: {offerYears}</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {[1, 2, 3, 4, 5].map(y => (
                                        <button
                                            key={y}
                                            onClick={() => setOfferYears(y)}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                background: offerYears === y ? 'var(--primary)' : 'var(--background)',
                                                color: offerYears === y ? 'white' : 'var(--text)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Offer Role: <span style={{ color: 'var(--primary)' }}>{offerRole}</span></label>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {['Star', 'Starter', 'Rotation', 'Bench', 'Prospect'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setOfferRole(r as any)}
                                            style={{
                                                flex: 1,
                                                padding: '8px', // Smaller padding
                                                fontSize: '0.8rem',
                                                background: offerRole === r ? 'var(--primary)' : 'var(--background)',
                                                color: offerRole === r ? 'white' : 'var(--text)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    * Promising a larger role can help lower salary demands.
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px', padding: '10px', background: 'var(--background)', borderRadius: '8px', fontSize: '0.8rem' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Agent's Note:</div>
                                "{askingDetails?.explanation || 'No notes.'}"
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleRelease(negotiatingPlayer.id)}
                                    className="btn-secondary"
                                    style={{ flex: 1, borderColor: 'var(--error)', color: 'var(--error)' }}
                                >
                                    Renounce Rights
                                </button>
                                <button
                                    onClick={handleSubmitOffer}
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Submit Offer
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            Select a player to start negotiating.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
