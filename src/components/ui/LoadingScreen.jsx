import React from 'react';

export default function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div className="card card-pad" style={{ minWidth: 280, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Loading Health Hub</div>
        <p className="muted">Preparing your workspace and saved preferences.</p>
      </div>
    </div>
  );
}
