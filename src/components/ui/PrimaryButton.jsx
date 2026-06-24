import React from 'react';

export default function PrimaryButton({ children, variant = 'solid', ...props }) {
  const style =
    variant === 'ghost'
      ? {
          background: 'color-mix(in srgb, var(--surface-strong) 85%, transparent)',
          border: '1px solid var(--border)',
          color: 'var(--text)'
        }
      : {
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          color: '#fff',
          border: 'none'
        };

  return (
    <button
      type={props.type ?? 'button'}
      {...props}
      style={{
        borderRadius: 999,
        padding: '12px 20px',
        fontWeight: 700,
        letterSpacing: '0.01em',
        cursor: 'pointer',
        boxShadow: variant === 'solid' ? '0 16px 34px color-mix(in srgb, var(--primary) 32%, transparent)' : 'none',
        transition: 'transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease, filter 160ms ease',
        ...style,
        ...props.style
      }}
      onMouseDown={(event) => (event.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={(event) => (event.currentTarget.style.transform = 'translateY(0)')}
      onMouseEnter={(event) => (event.currentTarget.style.filter = 'brightness(1.06)')}
      onMouseLeave={(event) => (event.currentTarget.style.filter = 'brightness(1)')}
    >
      {children}
    </button>
  );
}
