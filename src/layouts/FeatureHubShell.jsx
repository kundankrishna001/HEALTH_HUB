import React from 'react';

import SectionCard from '../components/ui/SectionCard';
import Badge from '../components/ui/Badge';

export default function FeatureHubShell({
  mode = 'food', // 'food' | 'medical'
  title,
  subtitle,
  children
}) {
  const isMedical = mode === 'medical';

  return (
    <div className="page-grid">
      <div
        className="hero-panel"
        style={{
          padding: 22,
          background: isMedical
            ? "radial-gradient(circle at top right, rgba(37,99,235,0.16), transparent 22%), radial-gradient(circle at left center, rgba(220,38,38,0.10), transparent 20%), var(--surface)"
            : "radial-gradient(circle at top right, rgba(37,99,235,0.12), transparent 22%), radial-gradient(circle at left center, rgba(20,184,166,0.15), transparent 20%), var(--surface)"
        }}
      >
        <div className="hero-panel-grid" style={{ gridTemplateColumns: 'minmax(0,1.35fr) minmax(280px,0.9fr)' }}>
          <div>
            <div className="auth-chip" style={{ width: 'fit-content', marginBottom: 12 }}>
              {isMedical ? 'MEDICAL' : 'FOOD'} HUB
              <span style={{ marginLeft: 6 }}>
                <Badge tone={isMedical ? 'danger' : 'primary'} style={{ padding: '2px 8px' }}>
                  {isMedical ? 'Clinical' : 'Nutrition'} ready
                </Badge>
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 3.6vw, 3rem)', letterSpacing: '-0.04em' }}>{title}</h2>
            {subtitle ? <p className="muted" style={{ maxWidth: 720, lineHeight: 1.75, marginTop: 10 }}>{subtitle}</p> : null}
          </div>

          <div className="stack">
            <div className="hero-stat">
              <span>Organized</span>
              <strong>{isMedical ? 'Medical loops' : 'Food loops'}</strong>
              <div className="muted">Separate flows for clarity and speed</div>
            </div>
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="hero-stat">
                <span>Focus</span>
                <strong>{isMedical ? 'Symptoms & safety' : 'Meals & tracking'}</strong>
                <div className="muted">Action-first UX</div>
              </div>
              <div className="hero-stat">
                <span>Outputs</span>
                <strong>{isMedical ? 'Guidance & warnings' : 'Recipes & nutrition'}</strong>
                <div className="muted">Export-friendly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionCard title={isMedical ? 'Medical features' : 'Food features'} subtitle="Everything in this section follows the same UI pattern">
        {children}
      </SectionCard>
    </div>
  );
}

