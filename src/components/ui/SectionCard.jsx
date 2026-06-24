import React from 'react';

export default function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="card card-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="section-title">
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {subtitle ? <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </section>
  );
}
