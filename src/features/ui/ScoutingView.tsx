import React, { useState } from 'react';
import { useGame } from '../../store/GameContext';
import { getPotentialGrade, calculateOverall } from '../../utils/playerUtils';
import { getPlayerTradeValue } from '../trade/TradeLogic';

const ScoutingView: React.FC = () => {
    // Helper to check if a specific attribute should be visible
    // Deterministic random based on prospect ID, attribute name, and points spent.
    const isAttributeVisible = (prospectId: string, attributeName: string, points: number) => {
        if (points >= 10) return true; // Full reveal
        if (points <= 0) return false;

        // Simple hash function
        let hash = 0;
        const combined = prospectId + attributeName;
        for (let i = 0; i < combined.length; i++) {
            hash = ((hash << 5) - hash) + combined.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }

        // Use hash to determine threshold (0-9)
        const threshold = Math.abs(hash) % 10;
        return points > threshold;
    };

    const {
        draftClass,
        scoutingPoints,
        scoutingReports,
        userTeamId,
        spendScoutingPoints,
        endScoutingPhase,
        teams,
        draftOrder
    } = useGame();

    // Safety Checks: Ensure critical data exists to prevent crashes
    if (!scoutingPoints || !scoutingReports || !draftClass) {
        console.error("ScoutingView: Missing data", { scoutingPoints, scoutingReports, draftClass });
        return (
            <div style={{ padding: '40px', color: '#e74c3c', textAlign: 'center' }}>
                <h2>Scouting Data Unavailable</h2>
                <p>There was an issue initializing the scouting phase. Please check the console for details.</p>
                <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', borderRadius: '5px' }}>Reload Game</button>
            </div>
        );
    }

    const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
    const [filterPos, setFilterPos] = useState<string>('All');

    // Memoized Projections (calculate once per render is fine for now)
    const projections = React.useMemo(() => {
        // Sort by public trade value to simulate consensus
        const sorted = [...draftClass].sort((a, b) => getPlayerTradeValue(b, null, [], []) - getPlayerTradeValue(a, null, [], []));
        const map = new Map<string, string>();
        sorted.forEach((p, idx) => {
            let label = 'Undrafted';
            const rank = idx + 1;
            if (rank <= 3) label = 'Top 3';
            else if (rank <= 10) label = 'Lottery';
            else if (rank <= 20) label = 'Mid 1st Round';
            else if (rank <= 30) label = 'Late 1st Round';
            else if (rank <= 60) label = 'Second Round';
            map.set(p.id, label);
        });
        return map;
    }, [draftClass]);

    // User Picks - Helper to sort and show top upcoming
    const userTeam = teams.find(t => t.id === userTeamId);

    // Sort picks by year then round.
    const myPicks = userTeam?.draftPicks
        ? [...userTeam.draftPicks].sort((a, b) => (a.year - b.year) || (a.round - b.round)).slice(0, 4)
        : [];

    const userPoints = scoutingPoints[userTeamId || ''] || 0;
    const userReport = scoutingReports[userTeamId || ''] || {};

    const selectedProspect = draftClass.find(p => p.id === selectedProspectId);

    // Helper to access report safely
    const getReport = (pid: string) => userReport[pid] || { points: 0, isPotentialRevealed: false };

    const pointsSpent = selectedProspectId ? getReport(selectedProspectId).points : 0;
    const isRevealed = selectedProspectId ? getReport(selectedProspectId).isPotentialRevealed : false;

    const handleSpend = (amount: number) => {
        if (selectedProspectId && userPoints >= amount) {
            spendScoutingPoints(selectedProspectId, amount);
        }
    };

    // Helper to determine what is visible
    const getVisibility = (prospectId: string) => {
        const report = getReport(prospectId);
        const spent = report.points;
        const revealed = report.isPotentialRevealed;

        return {
            showTruePotential: revealed,
            showExactStats: revealed,
            showGrade: revealed, // Only show letter grade if revealed (lucky or 10 pts)
            showAttributes: spent >= 5, // Unused by renderAttributes now, but kept for consistency
            getAttrVisible: (attrName: string) => isAttributeVisible(prospectId, attrName, spent),
            spent
        };
    };

    // Responsive Logic
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const showList = !isMobile || (isMobile && !selectedProspectId);
    const showDetail = !isMobile || (isMobile && selectedProspectId);

    return (
        <div style={{ padding: '20px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', color: '#333' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, color: 'white', fontSize: isMobile ? '1.5em' : '2em' }}>Scouting Phase</h1>
                    <p style={{ margin: '5px 0', opacity: 0.8, color: '#ddd', fontSize: isMobile ? '0.8em' : '1em' }}>
                        {isMobile ? '5% chance/pt to reveal Potential!' : 'Assign points to reveal prospect details. 5% chance per point to reveal Potential!'}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        fontSize: isMobile ? '1.2em' : '1.5em',
                        fontWeight: 'bold',
                        color: '#ff6b00',
                        background: 'rgba(255, 107, 0, 0.1)',
                        padding: isMobile ? '5px 10px' : '10px 20px',
                        borderRadius: '8px'
                    }}>
                        Pts: {userPoints}
                    </div>
                    {!isMobile && (
                        <button
                            onClick={endScoutingPhase}
                            style={{
                                marginTop: '10px',
                                padding: '10px 20px',
                                background: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '1em',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Finish Scouting
                        </button>
                    )}
                </div>
            </header>

            {/* User Picks & Filter Bar */}
            <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px' }}>
                <div style={{ fontSize: '0.9em', color: '#eee' }}>
                    <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Your Picks (Current Draft):</span>
                    {(() => {
                        if (!draftOrder || draftOrder.length === 0) return <span>None</span>;
                        const myIndices = draftOrder.map((id, idx) => id === userTeamId ? idx : -1).filter(idx => idx !== -1);

                        if (myIndices.length === 0) return <span>None</span>;

                        const roundLength = teams.length; // Assumes consistent round length based on team count

                        return myIndices.map((idx) => {
                            const pickNum = idx + 1;
                            const round = idx < roundLength ? 1 : 2;
                            const pickInRound = idx < roundLength ? pickNum : (pickNum - roundLength);

                            return (
                                <span key={idx} style={{ marginRight: '10px', padding: '2px 6px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                                    R{round} Pick {pickInRound}
                                </span>
                            );
                        });
                    })()}
                </div>

                <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', maxWidth: '100%' }}>
                    {['All', 'PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                        <button
                            key={pos}
                            onClick={() => setFilterPos(pos)}
                            style={{
                                padding: '5px 10px',
                                borderRadius: '15px',
                                border: 'none',
                                background: filterPos === pos ? '#ff6b00' : '#ddd',
                                color: filterPos === pos ? 'white' : '#555',
                                cursor: 'pointer',
                                fontSize: '0.85em',
                                fontWeight: 'bold'
                            }}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0, flexDirection: isMobile ? 'column' : 'row' }}>
                {/* Prospect List */}
                {showList && (
                    <div style={{ flex: 1, overflowY: 'auto', background: 'white', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginTop: 0 }}>Prospects</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {draftClass.filter(p => filterPos === 'All' || p.position === filterPos).map(p => {
                                const visibility = getVisibility(p.id);
                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedProspectId(p.id)}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            background: selectedProspectId === p.id ? 'rgba(255, 107, 0, 0.05)' : '#f8f9fa',
                                            border: selectedProspectId === p.id ? '1px solid #ff6b00' : '1px solid #eee',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#333' }}>{p.firstName} {p.lastName}</div>
                                            <div style={{ fontSize: '0.85em', color: '#666' }}>
                                                {p.position} • {p.archetype} • {p.age} yrs
                                            </div>
                                            <div style={{ fontSize: '0.8em', color: '#ff6b00', fontWeight: 'bold', marginTop: '2px' }}>
                                                Projected: {projections.get(p.id)}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1em', color: visibility.showTruePotential ? '#2c3e50' : '#888' }}>
                                                {visibility.showTruePotential
                                                    ? getPotentialGrade(p.potential)
                                                    : (visibility.showGrade ? getPotentialGrade(p.potential || 70) : '??')}
                                                {!visibility.showTruePotential && <span style={{ fontSize: '0.6em', verticalAlign: 'top', marginLeft: '2px' }}>{visibility.showGrade ? 'EST' : ''}</span>}
                                            </div>
                                            {visibility.spent > 0 && (
                                                <div style={{ fontSize: '0.75em', color: '#ff6b00' }}>
                                                    {visibility.spent} pts
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {isMobile && (
                            <button
                                onClick={endScoutingPhase}
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    padding: '15px',
                                    background: '#2ecc71',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1em',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Finish Scouting
                            </button>
                        )}
                    </div>
                )}

                {/* Detail Panel */}
                {showDetail && (
                    <div style={{ flex: 2, background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
                        {isMobile && (
                            <button
                                onClick={() => setSelectedProspectId(null)}
                                style={{
                                    marginBottom: '15px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    fontSize: '1em',
                                    padding: 0
                                }}
                            >
                                ← Back to List
                            </button>
                        )}

                        {selectedProspect ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <h2 style={{ margin: 0, color: '#333' }}>{selectedProspect.firstName} {selectedProspect.lastName}</h2>
                                        <div style={{ fontSize: '1.1em', marginTop: '5px', color: '#555' }}>
                                            {selectedProspect.position} • {selectedProspect.archetype}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.9em', color: '#888' }}>Projected Potential</div>
                                        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#2c3e50' }}>
                                            {getVisibility(selectedProspect.id).showTruePotential
                                                ? getPotentialGrade(selectedProspect.potential)
                                                : (getVisibility(selectedProspect.id).showGrade ? getPotentialGrade(selectedProspect.potential || 70) : '??')
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Scouting Actions */}
                                <div style={{ background: '#f0f4f8', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '15px' : '0', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Scouting Report</div>
                                        <div style={{ fontSize: '0.9em', color: '#555' }}>
                                            Status: {pointsSpent >= 10 ? <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Fully Scouted</span> : `${pointsSpent} / 10 points`}
                                        </div>
                                    </div>

                                    {pointsSpent < 10 && (
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
                                            <button
                                                disabled={userPoints < 1}
                                                onClick={() => handleSpend(1)}
                                                style={{ flex: isMobile ? 1 : 'initial', padding: '12px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: userPoints < 1 ? 'not-allowed' : 'pointer' }}
                                            >
                                                +1 Pt
                                            </button>
                                            <button
                                                disabled={userPoints < Math.min(5, 10 - pointsSpent)}
                                                onClick={() => handleSpend(Math.min(5, 10 - pointsSpent))}
                                                style={{ flex: isMobile ? 1 : 'initial', padding: '12px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: userPoints < Math.min(5, 10 - pointsSpent) ? 'not-allowed' : 'pointer' }}
                                            >
                                                +5 Pts
                                            </button>
                                            <button
                                                disabled={userPoints < (10 - pointsSpent)}
                                                onClick={() => handleSpend(10 - pointsSpent)}
                                                style={{ flex: isMobile ? 1 : 'initial', padding: '12px', background: '#ff6b00', color: 'white', border: 'none', borderRadius: '4px', cursor: userPoints < (10 - pointsSpent) ? 'not-allowed' : 'pointer' }}
                                            >
                                                Max
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Attributes Display */}
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                                    <div>
                                        <h4 style={{ borderBottom: '2px solid #ff6b00', paddingBottom: '5px' }}>Offense</h4>
                                        {renderAttributes(selectedProspect, getVisibility(selectedProspect.id).getAttrVisible, 'offense')}
                                    </div>
                                    <div>
                                        <h4 style={{ borderBottom: '2px solid #3498db', paddingBottom: '5px' }}>Defense & Physical</h4>
                                        {renderAttributes(selectedProspect, getVisibility(selectedProspect.id).getAttrVisible, 'defense')}
                                    </div>
                                </div>

                            </>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                Select a prospect to view scouting report
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for rendering attributes (masked or revealed)
const renderAttributes = (player: any, getAttrVisible: (key: string) => boolean, category: 'offense' | 'defense') => {
    const offenseKeys = ['insideShot', 'midRangeShot', 'threePointShot', 'passing', 'ballHandling', 'offensiveRebound'];
    const defenseKeys = ['interiorDefense', 'perimeterDefense', 'steal', 'block', 'defensiveRebound', 'speed', 'stamina', 'iq'];

    const keys = category === 'offense' ? offenseKeys : defenseKeys;

    return (
        <div style={{ display: 'grid', gap: '8px' }}>
            {keys.map(key => {
                const val = player.attributes[key];
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const isVisible = getAttrVisible(key);

                return (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em' }}>
                        <span style={{ color: 'black', fontWeight: '600' }}>{label}</span>
                        <span style={{ fontWeight: 'bold', color: isVisible ? getRatingColor(val) : '#ccc' }}>
                            {isVisible ? val : '??'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const getRatingColor = (rating: number) => {
    if (rating >= 85) return '#27ae60'; // Green
    if (rating >= 70) return '#2980b9'; // Blue
    if (rating >= 50) return '#f39c12'; // Orange
    return '#c0392b'; // Red
};

export default ScoutingView;
