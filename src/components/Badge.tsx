import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'custom';
  customBg?: string;
  customText?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', customBg, customText }) => {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    primary: { bg: 'var(--brand-light)', color: 'var(--brand-primary)', border: 'var(--gold-border)' },
    success: { bg: 'var(--success-bg)', color: 'var(--success-text)', border: 'var(--gold-border)' },
    warning: { bg: 'var(--warning-bg)', color: 'var(--warning-text)', border: 'rgba(197, 160, 89, 0.3)' },
    danger: { bg: 'var(--danger-bg)', color: 'var(--danger-text)', border: 'transparent' },
    neutral: { bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'var(--border-color)' },
    custom: { bg: customBg || 'transparent', color: customText || 'inherit', border: 'transparent' }
  };

  const current = styles[variant] || styles.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 9px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: current.bg,
        color: current.color,
        border: '1px solid ' + current.border,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em'
      }}
    >
      {children}
    </span>
  );
};
