
import React from 'react';
import { useGame } from '../../store/GameContext';
import { CheckCircle, Circle, Trophy, Search, Users, FileText, BarChart2, Calendar, DollarSign, ArrowRight, Zap, TrendingUp, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { SalaryPaymentModal } from '../ui/SalaryPaymentModal';
import { PageHeader } from '../ui/PageHeader';


export const EuroOffseasonMenuView: React.FC = () => {
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
            id: 'resigning', 
            label: 'Contract Renewals', 
            description: 'Negotiate with your expiring stars.',
            icon: <FileText size={24} />,
            view: 'euro_resigning',
            phase: 'resigning'
        },
        { 
            id: 'freeAgency', 
            label: 'Elite Free Agency', 
            description: 'Sign the best available European and Global talent.',
            icon: <DollarSign size={24} />,
            view: 'euro_free_agency',
            phase: 'free_agency'
        },
        { 
            id: 'localTalent', 
            label: 'Local Talent Scouting', 
            description: 'Discover the next generation of home-grown stars.',
            icon: <Users size={24} />,
            view: 'euro_local_talent',
            phase: 'scouting',
            skippable: true
        },
        { 
            id: 'financials', 
            label: 'Tickets & Merch Pricing', 
            description: 'Set your prices and launch seasonal ticket sales.',
            icon: <TrendingUp size={24} />,
            view: 'euro_financials',
            phase: 'offseason'
        },
        { 
            id: 'training', 
            label: 'Summer Training Camp', 
            description: 'Develop your players skills over the summer.',
            icon: <Zap size={24} />,
            view: 'training',
            phase: 'training'
        },
        { 
            id: 'trainingResults', 
            label: 'Training Report', 
            description: 'See how much your players improved.',
            icon: <CheckCircle size={24} />,
            view: 'training_results',
            phase: 'training'
        },
        { 
            id: 'paySalaries', 
            label: 'Financial Obligations', 
            description: 'Disburse the payroll for the upcoming season.',
            icon: <DollarSign size={24} />,
            view: 'offseason_menu',
            phase: 'offseason'
        },
        { 
            id: 'startSeason', 
            label: 'Begin Euro Season', 
            description: 'Finalize your roster and start the new year.',
            icon: <Calendar size={24} />,
            view: 'dashboard',
            phase: 'regular_season'
        }
    ];

    const isTaskCompleted = (id: string) => offseasonTasks?.[id as keyof typeof offseasonTasks];

    const isTaskLocked = (index: number) => {
        const task = tasks[index];
        
        const anyLaterTaskDone = tasks.slice(index + 1).some(t => isTaskCompleted(t.id));
        if (anyLaterTaskDone) return true;

        if (index === 0) return false;
        const prevTask = tasks[index - 1];
        
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

        if (task.id === 'localTalent') {
            // Allow navigating to local talent
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
            background: 'linear-gradient(135deg, rgba(var(--team-primary-rgb), 0.05) 0%, transparent 100%)'
        }}>
            <PageHeader
                title={`Offseason ${currentYear}`}
                subtitle="Euro Management Center"
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
                                background: completed ? 'rgba(46, 204, 113, 0.05)' : (locked ? 'rgba(255,255,255,0.01)' : 'var(--bg-card)'),
                                border: completed ? '1px solid #2ecc71' : (locked ? '1px solid var(--bg-card-hover)' : '1px solid var(--border-color)'),
                                borderRadius: '20px',
                                padding: '20px 24px',
                                cursor: locked ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                                transition: 'all 0.3s ease',
                                opacity: locked ? 0.4 : 1,
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: active ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            {/* Status Indicator */}
                            <div style={{ color: completed ? '#2ecc71' : (locked ? 'var(--text-dim)' : 'var(--team-primary)') }}>
                                {completed ? <CheckCircle size={30} /> : (locked ? <Circle size={30} opacity={0.3} /> : <Circle size={30} />)}
                            </div>

                            {/* Icon */}
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '14px',
                                background: locked ? 'rgba(255,255,255,0.03)' : 'rgba(var(--team-primary-rgb), 0.1)',
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
                                    fontSize: '1.2rem', 
                                    fontWeight: 800,
                                    color: locked ? 'var(--text-dim)' : 'var(--text-main)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {task.label}
                                    {active && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--team-primary)' }} />}
                                </h3>
                                <p style={{ 
                                    margin: '2px 0 0 0', 
                                    color: 'var(--text-dim)',
                                    fontSize: '0.9rem'
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
                                    fontSize: '0.65rem',
                                    fontWeight: 900,
                                    color: 'var(--text-muted)',
                                    background: 'var(--bg-card-hover)',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    textTransform: 'uppercase'
                                }}>
                                    Optional
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
