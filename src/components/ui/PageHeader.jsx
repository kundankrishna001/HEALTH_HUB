import React from 'react';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="section-title">
      <div>
        <h1 style={{ margin: 0, fontSize: '1.6rem' }}>{title}</h1>
        {subtitle ? <p className="muted" style={{ margin: '6px 0 0' }}>{subtitle}</p> : null}
      </div>
      {actions ? <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div> : null}
    </div>
  );
}
