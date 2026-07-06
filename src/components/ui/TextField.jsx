import React, { forwardRef } from 'react';

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    });
  };
}

const TextField = forwardRef(function TextField(
  { label, error, helperText, ...props },
  ref
) {
  const { ref: fieldRef, ...inputProps } = props;

  return (
    <label className="field">
      <span>{label}</span>
      <input
        {...inputProps}
        ref={mergeRefs(ref, fieldRef)}
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
