import React from 'react';

export default function Badge({ children, tone = 'default' }) {
  const colors = {
    default: 'color-mix(in srgb, var(--muted) 12%, transparent)',
    success: 'color-mix(in srgb, var(--success) 16%, transparent)',
    warning: 'color-mix(in srgb, var(--warning) 18%, transparent)',
    danger: 'color-mix(in srgb, var(--danger) 16%, transparent)',
    primary: 'color-mix(in srgb, var(--primary) 16%, transparent)'
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 999,
        background: colors[tone] || colors.default,
        color: 'var(--text)',
        fontSize: 12,
        fontWeight: 700
      }}
    >
      {children}
    </span>
  );
}
