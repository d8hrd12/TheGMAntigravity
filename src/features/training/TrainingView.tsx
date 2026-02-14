import React from 'react';
import { useGame } from '../../store/GameContext';
import { TrainingFocus } from '../../models/Training';
import { calculateOverall } from '../../utils/playerUtils';
import { BackButton } from '../ui/BackButton';
import { TrainingResultsModal } from './TrainingResultsModal';

export const TrainingView: React.FC<{ onBack?: () => void, onSelectPlayer: (id: string) => void }> = ({ onBack, onSelectPlayer }) => {
    const { players, userTeamId, trainingSettings, updateTrainingFocus, teams, runTrainingCamp, trainingReport, isTrainingCampComplete, startRegularSeason } = useGame();
    const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'ovr', direction: 'desc' });
    const [showResults, setShowResults] = React.useState(false);
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    const userRoster = players.filter(p => p.teamId === userTeamId);

    // Count how many players have a valid focus selected
    const selectedCount = userRoster.filter(p => {
        const focus = trainingSettings[p.id];
        return focus && focus !== TrainingFocus.NONE;
    }).length;

    const handleFocusChange = (playerId: string, newFocus: TrainingFocus) => {
        const currentFocus = trainingSettings[playerId] || TrainingFocus.NONE;

        // If we are activating a new player (going from NONE to something else)
        if (currentFocus === TrainingFocus.NONE && newFocus !== TrainingFocus.NONE) {
            if (selectedCount >= 5) {
                alert("You can only train up to 5 players per season. Change another player to 'None' first.");
                return;
            }
        }

        updateTrainingFocus(playerId, newFocus);
    };

    const sortedRoster = React.useMemo(() => {
        const sorted = [...userRoster];
        sorted.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (sortConfig.key) {
                case 'name':
                    aVal = a.lastName;
                    bVal = b.lastName;
                    break;
                case 'age':
                    aVal = a.age;
                    bVal = b.age;
                    break;
                case 'ovr':
                    aVal = calculateOverall(a);
                    bVal = calculateOverall(b);
                    break;
                case 'pot':
                    aVal = a.potential;
                    bVal = b.potential;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [userRoster, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getRecommendation = (player: any) => {
        if (player.age < 24) return 'Physical';
        if (player.age > 30) return 'Fundamentals';
        return 'Balanced';
    };

    const getPotentialLetter = (potential: number) => {
        if (potential >= 90) return 'A';
        if (potential >= 80) return 'B';
        if (potential >= 70) return 'C';
        if (potential >= 60) return 'D';
        return 'F';
    };

    const getRatingColor = (value: number) => {
        if (value >= 85) return '#2ecc71';
        if (value >= 75) return '#3498db';
        if (value >= 65) return '#f1c40f';
        return '#e74c3c';
    };

    const HeaderCell = ({ label, sortKey, align = 'left' }: { label: string, sortKey: string, align?: 'left' | 'center' }) => (
        <th
            style={{ padding: '12px 4px', cursor: 'pointer', userSelect: 'none', textAlign: align, color: sortConfig.key === sortKey ? 'var(--text)' : 'var(--text-secondary)', fontSize: '0.85rem' }}
            onClick={() => requestSort(sortKey)}
        >
            {label} {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
        </th>
    );

    const handleRunCamp = () => {
        if (selectedCount === 0) {
            alert("Please set a training focus for at least one player.");
            return;
        }
        runTrainingCamp();
        setShowConfirmation(false);
        setShowResults(true);
    };

    return (
        <div style={{ padding: '16px', minHeight: '100vh', paddingBottom: '80px', maxWidth: '100vw', overflowX: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {onBack && <BackButton onClick={onBack} />}
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Training Camp</h2>
            </div>

            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                Select up to <strong>5 players</strong> to participate in Training Camp. Only selected players will improve.
            </p>

            {/* Run Camp Button - Only visible in Pre-Season */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={isTrainingCampComplete}
                    className="btn-primary"
                    style={{
                        background: isTrainingCampComplete
                            ? 'var(--surface-hover)'
                            : 'linear-gradient(135deg, var(--primary), var(--accent))',
                        padding: '12px 20px',
                        fontSize: '0.95rem',
                        width: '100%',
                        maxWidth: '300px',
                        boxShadow: isTrainingCampComplete ? 'none' : '0 4px 15px var(--primary-glow)',
                        cursor: isTrainingCampComplete ? 'not-allowed' : 'pointer',
                        opacity: isTrainingCampComplete ? 0.6 : 1
                    }}
                >
                    {isTrainingCampComplete ? 'Training Complete' : `Run Training Camp (${selectedCount}/5)`}
                </button>
                {isTrainingCampComplete && (
                    <div style={{ display: 'inline-flex', gap: '10px', marginLeft: '10px' }}>
                        <button
                            onClick={() => setShowResults(true)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            View Results
                        </button>
                        <button
                            onClick={() => {
                                if (onBack) onBack();
                            }}
                            className="btn-primary"
                            style={{
                                background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                                padding: '12px 24px',
                                boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)',
                                cursor: 'pointer',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700
                            }}
                        >
                            Finish Training &gt;
                        </button>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '100%' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                            <HeaderCell label="Player" sortKey="name" />
                            <HeaderCell label="Age" sortKey="age" align="center" />
                            <HeaderCell label="OVR" sortKey="ovr" align="center" />
                            <HeaderCell label="POT" sortKey="pot" align="center" />
                            <th style={{ padding: '12px 4px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Focus</th>
                            <th style={{ padding: '12px 4px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rec.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRoster.map((player, index) => {
                            const currentFocus = trainingSettings[player.id] || TrainingFocus.BALANCED;

                            return (
                                <tr
                                    key={player.id}
                                    style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                                    }}
                                >
                                    <td
                                        style={{ padding: '10px 4px', cursor: 'pointer' }}
                                        onClick={() => onSelectPlayer(player.id)}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{player.firstName.charAt(0)}. {player.lastName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{player.position}</div>
                                    </td>
                                    <td style={{ padding: '10px 4px', textAlign: 'center' }}>{player.age}</td>
                                    <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                        <span style={{ fontWeight: 700, color: getRatingColor(calculateOverall(player)) }}>{calculateOverall(player)}</span>
                                    </td>
                                    <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                        <span style={{ fontWeight: 700, color: getPotentialLetter(player.potential) === 'A' ? '#e67e22' : '#bdc3c7' }}>
                                            {getPotentialLetter(player.potential)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 4px', textAlign: 'center' }}>
                                        <select
                                            value={trainingSettings[player.id] || TrainingFocus.NONE}
                                            onChange={(e) => handleFocusChange(player.id, e.target.value as TrainingFocus)}
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={isTrainingCampComplete}
                                            style={{
                                                padding: '6px',
                                                borderRadius: '4px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(0,0,0,0.3)',
                                                color: 'var(--text)',
                                                width: '100%',
                                                fontSize: '0.8rem',
                                                minWidth: '85px',
                                                maxWidth: '95px',
                                                opacity: (trainingSettings[player.id] && trainingSettings[player.id] !== TrainingFocus.NONE) ? 1 : 0.7
                                            }}
                                        >
                                            {Object.values(TrainingFocus).map(focus => (
                                                <option key={focus} value={focus}>{focus}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ padding: '10px 4px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                                        {getRecommendation(player)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {
                showConfirmation && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <div className="glass-panel" style={{ background: '#222', maxWidth: '400px', width: '100%', padding: '24px' }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: '#fff' }}>Run Training Camp?</h3>
                            <p style={{ margin: '0 0 24px', color: '#bbb', lineHeight: '1.5' }}>
                                This will simulate player progression based on assigned focus. This happens once per season.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #444', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRunCamp}
                                    className="btn-primary"
                                    style={{ padding: '10px 24px' }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Training Results Modal */}
            {
                showResults && trainingReport && (
                    <TrainingResultsModal
                        results={trainingReport.filter(r => players.find(p => p.id === r.playerId)?.teamId === userTeamId)}
                        onClose={() => setShowResults(false)}
                    />
                )
            }
        </div >
    );
};
