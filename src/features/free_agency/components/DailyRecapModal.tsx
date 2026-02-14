import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, Newspaper } from 'lucide-react';
import type { FreeAgencyOffer } from '../logic/FreeAgencyEngine';

interface DailyRecapModalProps {
    day: number;
    offersUpdated: FreeAgencyOffer[]; // Offers that changed status THIS turn
    leagueNews: string[];
    onClose: () => void;
}

export const DailyRecapModal: React.FC<DailyRecapModalProps> = ({ day, offersUpdated, leagueNews, onClose }) => {

    // Categorize
    const accepted = offersUpdated.filter(o => o.status === 'accepted');
    const rejected = offersUpdated.filter(o => o.status === 'rejected' || o.status === 'outbid');

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500
        }}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: '#1c1c1e', width: '95%', maxWidth: '550px',
                    borderRadius: '20px', padding: '0', overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column', maxHeight: '90vh'
                }}
            >
                {/* Header */}
                <div style={{ padding: '25px', background: '#2c2c2e', borderBottom: '1px solid #3a3a3c' }}>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>Day {day - 1} Recap</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#888' }}>Simulation results for the previous day.</p>
                </div>

                <div style={{ padding: '25px', maxHeight: '60vh', overflowY: 'auto' }}>

                    {/* 1. Accepted Offers */}
                    {accepted.length > 0 && (
                        <div style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: '#2ecc71', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <CheckCircle size={18} /> Accepted Offers
                            </h3>
                            {accepted.map(offer => (
                                <div key={offer.id} style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '12px', borderRadius: '10px', marginBottom: '8px', border: '1px solid rgba(46, 204, 113, 0.2)' }}>
                                    <div style={{ color: 'white', fontWeight: 600 }}>Player ID: {offer.playerId}</div>
                                    {/* Note: In a real app we'd map ID to Name here or pass enriched objects */}
                                    <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>
                                        Signed for ${offer.amount.toLocaleString()} / {offer.years}yrs
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 2. Rejected Offers */}
                    {rejected.length > 0 && (
                        <div style={{ marginBottom: '25px' }}>
                            <h3 style={{ color: '#e74c3c', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <XCircle size={18} /> Offers Rejected
                            </h3>
                            {rejected.map(offer => (
                                <div key={offer.id} style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '12px', borderRadius: '10px', marginBottom: '8px', border: '1px solid rgba(231, 76, 60, 0.2)' }}>
                                    <div style={{ color: 'white', fontWeight: 600 }}>Overview for Offer on Player {offer.playerId}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>
                                        Player chose another team or decided to wait.
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 3. League News */}
                    {leagueNews.length > 0 && (
                        <div>
                            <h3 style={{ color: '#3498db', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Newspaper size={18} /> League Transactions
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {leagueNews.slice(0, 10).map((news, idx) => (
                                    <div key={idx} style={{ fontSize: '0.9rem', color: '#ddd', paddingBottom: '8px', borderBottom: '1px solid #333' }}>
                                        {news}
                                    </div>
                                ))}
                                {leagueNews.length > 10 && <div style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>+ {leagueNews.length - 10} more...</div>}
                            </div>
                        </div>
                    )}

                    {accepted.length === 0 && rejected.length === 0 && leagueNews.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Quiet day in the league...</div>
                    )}
                </div>

                <div style={{ padding: '20px', background: '#2c2c2e', borderTop: '1px solid #3a3a3c' }}>
                    <button
                        onClick={onClose}
                        style={{ width: '100%', padding: '12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Continue
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
