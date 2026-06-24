import React from 'react';

export default function TextareaField({ label, error, helperText, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        {...props}
        aria-invalid={Boolean(error)}
        style={{ minHeight: 120, resize: 'vertical', ...(error ? { borderColor: 'var(--danger)' } : null) }}
      />
      {helperText ? <span className="muted" style={{ fontSize: 12 }}>{helperText}</span> : null}
      {error ? <span style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
}
