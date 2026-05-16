import React from 'react';
import type { Player } from '../../models/Player';
import type { Team } from '../../models/Team';
import { Activity, Zap, UserPlus, Settings, AlertTriangle, CheckCircle, Clock, TrendingUp, Trophy } from 'lucide-react';

interface InjuryInterruptModalProps {
  interrupt: { player: Player; type: 'injury' | 'recovery' };
  team?: Team;
  onManualAdjust: () => void;
  onAIOptimize: () => void;
  onDismiss: () => void;
}

export const InjuryInterruptModal: React.FC<InjuryInterruptModalProps> = ({
  interrupt,
  team,
  onManualAdjust,
  onAIOptimize,
  onDismiss
}) => {
  const { player, type } = interrupt;
  const isInjury = type === 'injury';

  const accentColor = isInjury ? '#ff3b30' : '#34c759';
  const accentGradient = isInjury 
    ? 'linear-gradient(135deg, #ff3b30 0%, #ff7b30 100%)' 
    : 'linear-gradient(135deg, #34c759 0%, #30d158 100%)';

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.4s ease-out'
    }}>
      <div className="modal-content" style={{
        background: '#0a0a0c',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        borderRadius: '12px',
        width: '100%',
        maxWidth: '540px',
        padding: '0',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 100px rgba(0,0,0,0.2)',
        animation: 'modalEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Top Accent Bar */}
        <div style={{ height: '6px', background: accentGradient, width: '100%' }} />

        <div style={{ padding: '40px' }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: isInjury ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: accentColor,
              border: `1px solid ${isInjury ? 'rgba(255, 59, 48, 0.2)' : 'rgba(52, 199, 89, 0.2)'}`,
              boxShadow: `0 10px 20px ${isInjury ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)'}`,
              animation: 'pulse 2s infinite ease-in-out'
            }}>
              {isInjury ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
            </div>
            
            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              fontFamily: "'SF Transrobotics', sans-serif",
              color: 'white',
              lineHeight: 1
            }}>
              {isInjury ? 'Sidelined' : 'Cleared to Play'}
            </h2>
            
            <div style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 500
            }}>
              {player.firstName} <span style={{ color: 'white', fontWeight: 800 }}>{player.lastName}</span>
            </div>
          </div>

          {/* Context Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.5 }}>
                <Clock size={14} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: isInjury ? '#ff3b30' : '#34c759' }}>
                {isInjury ? (player.injury?.type || 'Injured') : 'Active'}
              </div>
              {isInjury && (
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>
                  {player.injury?.gamesRemaining ?? player.injury?.duration ?? 'Unknown'} games out
                </div>
              )}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.5 }}>
                <Trophy size={14} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Record</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                {team ? `${team.wins}-${team.losses}` : '--'}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>
                Currently in mid-season form
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div style={{
            background: isInjury ? 'rgba(255, 59, 48, 0.05)' : 'rgba(52, 199, 89, 0.05)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px',
            border: `1px dashed ${isInjury ? 'rgba(255, 59, 48, 0.2)' : 'rgba(52, 199, 89, 0.2)'}`,
            lineHeight: 1.5,
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.9)'
          }}>
            {isInjury ? (
              <>
                <strong style={{ color: '#ff3b30' }}>Simulation Halted.</strong> {player.lastName}'s absence leaves <span style={{ color: 'white', fontWeight: 700 }}>{player.minutes} minutes</span> unassigned.
                A valid 5-man rotation must be established to proceed.
              </>
            ) : (
              <>
                <strong style={{ color: '#34c759' }}>Roster Restored.</strong> {player.lastName} is back from {player.injuryHistory?.[0]?.type || 'injury'}. 
                You can re-integrate them into the rotation now or continue with the current lineup.
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={onAIOptimize}
              className="btn-premium"
              style={{ 
                width: '100%', 
                background: accentGradient,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '18px',
                fontSize: '0.9rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: `0 10px 20px ${isInjury ? 'rgba(255, 59, 48, 0.2)' : 'rgba(52, 199, 89, 0.2)'}`,
                transition: 'all 0.2s ease',
                fontFamily: "'SF Transrobotics', sans-serif"
              }}
            >
              <Zap size={20} fill="currentColor" />
              AUTO-OPTIMIZE ROTATION
            </button>

            <button 
              onClick={onManualAdjust}
              style={{ 
                width: '100%', 
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <Settings size={18} />
              Manual Adjustment
            </button>
            
            <button 
              onClick={onDismiss}
              style={{ 
                width: '100%', 
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                marginTop: '8px',
                padding: '8px',
                transition: 'color 0.2s'
              }}
            >
              Skip & Continue Simulation
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEntrance {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .btn-premium:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .btn-premium:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
