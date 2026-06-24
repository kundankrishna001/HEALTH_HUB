import React from 'react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="card card-pad" style={{ textAlign: 'center', paddingBlock: 32 }}>
      <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
      <p className="muted" style={{ maxWidth: 560, margin: '10px auto 0' }}>{description}</p>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}
