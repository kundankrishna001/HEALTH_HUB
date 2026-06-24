import React, { forwardRef } from 'react';

const TextField = forwardRef(function TextField(
  { label, error, helperText, ...props },
  ref
) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        {...props}
        ref={ref}
        aria-invalid={Boolean(error)}
        style={error ? { borderColor: 'var(--danger)' } : undefined}
      />
      {helperText ? (
        <span className="muted" style={{ fontSize: 12 }}>
          {helperText}
        </span>
      ) : null}
      {error ? (
        <span style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</span>
      ) : null}
    </label>
  );
});

export default TextField;

