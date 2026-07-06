import React from 'react';
import { projectFeatures } from '../../data/features';

export default function FeatureGrid() {
  return (
    <div className="public-features-grid">
      {projectFeatures.map(({ title, description, icon: Icon }) => (
        <article key={title} className="public-feature">
          <span className="public-feature-icon"><Icon /></span>
          <div className="public-feature-title">{title}</div>
          <div className="public-feature-text">{description}</div>
        </article>
      ))}
    </div>
  );
}
