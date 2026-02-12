import React from 'react';
import type { SimulatedTradeProposal } from './TradeSimulation';
import type { Team } from '../../models/Team';

interface TradeProposalModalProps {
    offer: SimulatedTradeProposal;
    teams: Team[];
    onAccept: () => void;
    onReject: () => void;
    onLookInto: () => void;
}

export const TradeProposalModal: React.FC<TradeProposalModalProps> = ({ offer, teams, onAccept, onReject, onLookInto }) => {
    const proposer = teams.find(t => t.id === offer.proposerId);

    // User is the target in this context (AI proposes to User)
    // So "User Gets" = proposerAssets
    // "User Gives" = targetAssets

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div className="glass-panel" style={{ width: '600px', padding: '30px', border: '1px solid var(--primary)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>Incoming Trade Offer</h2>

                <div style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.2rem' }}>
                    The <strong>{proposer?.name}</strong> propose a trade:
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' }}>
                    {/* YOU GET */}
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                        <h3 style={{ color: '#2ecc71', borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>You Receive</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {offer.proposerAssets.players.map((p: any) => (
                                <li key={p.id} style={{ marginBottom: '5px' }}>{p.firstName} {p.lastName} <span style={{ fontSize: '0.8em', color: '#888' }}>({p.position})</span></li>
                            ))}
                            {offer.proposerAssets.picks.map((p: any) => (
                                <li key={p.id} style={{ marginBottom: '5px' }}>{p.year} {p.originalTeamName} R{p.round}</li>
                            ))}
                        </ul>
                    </div>

                    {/* ARROW */}
                    <div style={{ display: 'flex', alignItems: 'center', color: '#888' }}>
                        &#8644;
                    </div>

                    {/* YOU GIVE */}
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                        <h3 style={{ color: '#e74c3c', borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>You Give</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {offer.targetAssets.players.map((p: any) => (
                                <li key={p.id} style={{ marginBottom: '5px' }}>{p.firstName} {p.lastName} <span style={{ fontSize: '0.8em', color: '#888' }}>({p.position})</span></li>
                            ))}
                            {offer.targetAssets.picks.map((p: any) => (
                                <li key={p.id} style={{ marginBottom: '5px' }}>{p.year} {p.originalTeamName} R{p.round}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button
                        onClick={onAccept}
                        className="btn-primary"
                        style={{ flex: 1, background: '#2ecc71' }}
                    >
                        Agree
                    </button>
                    <button
                        onClick={onLookInto}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                    >
                        Look Into
                    </button>
                    <button
                        onClick={onReject}
                        className="btn-danger"
                        style={{ flex: 1, background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Nope
                    </button>
                </div>
            </div>
        </div>
    );
};
