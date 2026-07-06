import React from 'react';

export function ChipSelect({ label, helperText, error, options, value, onChange, multiple = false }) {
  const selected = multiple ? (Array.isArray(value) ? value : []) : value;

  const toggle = (option) => {
    if (multiple) {
      const list = Array.isArray(value) ? value : [];
      if (list.includes(option)) {
        onChange(list.filter((item) => item !== option));
      } else {
        onChange([...list, option]);
      }
      return;
    }
    onChange(option);
  };

  const isActive = (option) => (multiple ? selected.includes(option) : selected === option);

  return (
    <div className="field" style={{ display: 'grid', gap: 8 }}>
      {label ? <span>{label}</span> : null}
      {helperText ? (
        <span className="muted" style={{ fontSize: 12, marginTop: -4 }}>
          {helperText}
        </span>
      ) : null}
      <div className="chip-rail" style={{ flexWrap: 'wrap', overflow: 'visible' }}>
        {options.map((option) => {
          const valueKey = typeof option === 'string' ? option : option.value;
          const labelText = typeof option === 'string' ? option : option.label;
          return (
            <button
              key={valueKey}
              type="button"
              className={`chip-rail-item${isActive(valueKey) ? ' active' : ''}`}
              onClick={() => toggle(valueKey)}
            >
              {labelText}
            </button>
          );
        })}
      </div>
      {error ? <span style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</span> : null}
    </div>
  );
}
