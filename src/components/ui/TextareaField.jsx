import React, { forwardRef } from 'react';

const TextareaField = forwardRef(function TextareaField(
  { label, error, helperText, ...props },
  ref
) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        {...props}
        ref={ref}
        aria-invalid={Boolean(error)}
        style={{ minHeight: 96, resize: 'vertical', ...(error ? { borderColor: 'var(--danger)' } : null) }}
      />
      {helperText ? <span className="muted" style={{ fontSize: 12 }}>{helperText}</span> : null}
      {error ? <span style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</span> : null}
    </label>
  );
});

export default TextareaField;
