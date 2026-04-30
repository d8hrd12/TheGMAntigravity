import React from 'react';

interface DashboardCardProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  children, 
  footer, 
  action,
  noPadding = false,
  className = '', 
  style,
  variant = 'default'
}) => {
  return (
    <div 
      className={`modern-card animate-fade ${className}`} 
      style={style}
    >
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && <span style={{ color: variant === 'default' ? 'var(--text-dim)' : `var(--${variant})` }}>{icon}</span>}
          <h3 className="card-title">{title}</h3>
        </div>
        {action && <div className="card-action">{action}</div>}
      </div>
      
      <div className="card-body" style={{ padding: noPadding ? '0' : '8px' }}>
        {children}
      </div>

      {footer && (
        <div className="card-footer" style={{ marginTop: '20px' }}>
          {footer}
        </div>
      )}
    </div>
  );
};
