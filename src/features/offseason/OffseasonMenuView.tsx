
import React from 'react';
import { useGame } from '../../store/GameContext';
import { CheckCircle, Circle, Trophy, Search, Users, FileText, BarChart2, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SalaryPaymentModal } from '../ui/SalaryPaymentModal';
import { PageHeader } from '../ui/PageHeader';


export const OffseasonMenuView: React.FC = () => {
    const { 
        offseasonTasks, 
        seasonPhase, 
        setView, 
        setGameState,
        date,
        userTeamId,
        teams,
        paySalaries,
        startRegularSeason,
        endCoachFreeAgency,
        setModalMessage,
        contracts
    } = useGame();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

    const userTeam = teams.find(t => t.id === userTeamId);
    const currentYear = date.getFullYear();

    const payrollAmount = contracts
        .filter(c => c.teamId === userTeamId && c.yearsLeft > 0)
        .reduce((sum, c) => sum + c.amount, 0);

    const tasks = [
        { 
            id: 'retirements', 
            label: 'Retirement Ceremony', 
            description: 'Celebrate the legends hanging up their jerseys.',
            icon: <Trophy size={24} />,
            view: 'retirement',
            phase: 'retirement_summary'
        },
        { 
            id: 'scouting', 
            label: 'Draft Scouting', 
            description: 'Analyze the incoming draft class potential.',
            icon: <Search size={24} />,
            view: 'scouting',
            phase: 'scouting',
            skippable: true
        },
        { 
            id: 'draft', 
            label: 'NBA Draft Night', 
            description: 'Select the future stars for your franchise.',
            icon: <Users size={24} />,
            view: 'draft',
            phase: 'draft'
        },
        { 
            id: 'resigning', 
            label: 'Contract Resigning', 
            description: 'Negotiate with your expiring players.',
            icon: <FileText size={24} />,
            view: 'resigning',
            phase: 'resigning'
        },
        { 
            id: 'freeAgency', 
            label: 'Free Agency', 
            description: 'Sign the best available talent in the league.',
            icon: <DollarSign size={24} />,
            view: 'free_agency',
            phase: 'free_agency'
        },
        { 
            id: 'training', 
            label: 'Training Camp', 
            description: 'Develop your players skills over the summer.',
            icon: <BarChart2 size={24} />,
            view: 'training',
            phase: 'training'
        },
        { 
            id: 'trainingResults', 
            label: 'Training Results', 
            description: 'See how much your players improved.',
            icon: <CheckCircle size={24} />,
            view: 'training_results', // We might need a specific view for this
            phase: 'training'
        },
        { 
            id: 'paySalaries', 
            label: 'Pay Team Salaries', 
            description: 'Disburse the payroll for the upcoming season.',
            icon: <DollarSign size={24} />,
            view: 'offseason_menu',
            phase: 'offseason'
        },
        { 
            id: 'startSeason', 
            label: 'Begin Next Season', 
            description: 'Finalize your roster and start the new year.',
            icon: <Calendar size={24} />,
            view: 'dashboard',
            phase: 'regular_season'
        }
    ];

    const isTaskCompleted = (id: string) => offseasonTasks?.[id as keyof typeof offseasonTasks];

    const isTaskLocked = (index: number) => {
        const task = tasks[index];
        
        // Cannot go back to earlier tasks once progressed
        const anyLaterTaskDone = tasks.slice(index + 1).some(t => isTaskCompleted(t.id));
        if (anyLaterTaskDone) return true;

        if (index === 0) return false;
        const prevTask = tasks[index - 1];
        
        // Scouting is skippable
        if (prevTask.id === 'scouting') {
            const beforeScouting = tasks[index - 2];
            return !isTaskCompleted(beforeScouting.id);
        }

        // Training Results is skippable if Training is done
        if (prevTask.id === 'trainingResults') {
            return !isTaskCompleted('training');
        }

        return !isTaskCompleted(prevTask.id);
    };

    const handleTaskClick = (task: any, index: number) => {
        if (isTaskLocked(index)) return;

        if (task.id === 'paySalaries') {
            if (isTaskCompleted('paySalaries')) return;
            setIsPaymentModalOpen(true);
            return;
        }

        if (task.id === 'startSeason') {
            if (!isTaskCompleted('paySalaries')) {
                setModalMessage({
                    title: "PAYROLL PENDING",
                    msg: "You must pay your player salaries before starting the next season.",
                    type: "info"
                });
                return;
            }
            startRegularSeason();
            return;
        }

        if (task.id === 'resigning') {
            endCoachFreeAgency();
            // fall through to setGameState
        }

        setGameState(prev => ({
            ...prev,
            view: task.view,
            seasonPhase: task.phase
        }));
    };

    return (
        <div style={{ 
            padding: '40px 20px', 
            maxWidth: '1000px', 
            margin: '0 auto',
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, rgba(var(--team-primary-rgb), 0.1), transparent 60%)'
        }}>
            <PageHeader
                title={`Offseason ${currentYear}`}
                subtitle="Franchise Operations Center"
                teamColor={userTeam?.colors?.primary}
            />

            <div style={{ display: 'grid', gap: '16px' }}>
                {tasks.map((task, index) => {
                    const completed = isTaskCompleted(task.id);
                    const locked = isTaskLocked(index);
                    const active = !completed && !locked;

                    return (
                        <motion.div
                            key={task.id}
                            whileHover={!locked ? { scale: 1.01, x: 10 } : {}}
                            whileTap={!locked ? { scale: 0.99 } : {}}
                            onClick={() => handleTaskClick(task, index)}
                            style={{
                                background: completed ? 'rgba(46, 204, 113, 0.05)' : (locked ? 'rgba(255,255,255,0.02)' : 'var(--bg-card)'),
                                border: completed ? '1px solid #2ecc71' : (locked ? '1px solid var(--bg-card-hover)' : '1px solid var(--border-color)'),
                                borderRadius: '20px',
                                padding: '24px',
                                cursor: locked ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                                transition: 'all 0.3s ease',
                                opacity: locked ? 0.5 : 1,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Status Indicator */}
                            <div style={{ color: completed ? '#2ecc71' : (locked ? 'var(--text-dim)' : 'var(--team-primary)') }}>
                                {completed ? <CheckCircle size={32} /> : (locked ? <Circle size={32} opacity={0.3} /> : <Circle size={32} />)}
                            </div>

                            {/* Icon */}
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: locked ? 'var(--bg-card-hover)' : 'rgba(var(--team-primary-rgb), 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: locked ? 'var(--text-dim)' : 'var(--team-primary)',
                                flexShrink: 0
                            }}>
                                {task.icon}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ 
                                    margin: 0, 
                                    fontSize: '1.25rem', 
                                    fontWeight: 800,
                                    color: locked ? 'var(--text-dim)' : 'var(--text-main)'
                                }}>
                                    {task.label}
                                </h3>
                                <p style={{ 
                                    margin: '4px 0 0 0', 
                                    color: 'var(--text-dim)',
                                    fontSize: '0.95rem'
                                }}>
                                    {task.description}
                                </p>
                            </div>

                            {!locked && !completed && (
                                <div style={{ color: 'var(--team-primary)' }}>
                                    <ArrowRight size={24} />
                                </div>
                            )}

                            {task.skippable && !completed && !locked && (
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    color: 'var(--text-dim)',
                                    background: 'var(--bg-card-hover)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    textTransform: 'uppercase'
                                }}>
                                    Skippable
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <SalaryPaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPay={() => {
                    const success = paySalaries();
                    if (success) {
                        setIsPaymentModalOpen(false);
                    } else {
                        // Usually handled by modal button being disabled, but for safety
                        setModalMessage({
                            title: "INSUFFICIENT FUNDS",
                            msg: "Your franchise does not have enough cash to cover this year's player salaries.",
                            type: "error"
                        });
                    }
                }}
                payrollAmount={payrollAmount}
                currentCash={userTeam?.cash || 0}
            />
        </div>
    );
};
