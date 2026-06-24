import React from 'react';

export default function StatCard({ label, value, detail, icon: Icon, tone = 'var(--primary)' }) {
  return (
    <div className="card card-pad quick-action-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', marginTop: 8 }}>{value}</div>
          {detail ? <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>{detail}</div> : null}
        </div>
        {Icon ? (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            display: 'grid',
            placeItems: 'center',
            background: `color-mix(in srgb, ${tone} 18%, transparent)`,
            color: tone,
            flexShrink: 0
          }}>
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
