import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import PublicHeader from '../components/layout/PublicHeader';
import PrimaryButton from '../components/ui/PrimaryButton';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="public-page">
      <PublicHeader active="home" />

      <main className="public-hero">
        <h1 className="public-title">Smart wellness guidance, built for daily life</h1>
        <p className="public-subtitle">
          Track meals and hydration, check symptoms, and generate a practical diet plan—powered by a resilient backend with database fallback.
        </p>

        <section className="public-card">
          <div className="public-card-head">
            <div className="public-card-title">Get started in 30 seconds</div>
            <div className="public-card-caption">Jump into the modules and see your dashboard.</div>
          </div>

          <div className="public-feature-grid">
            <div className="public-feature">
              <span className="public-feature-icon"><FiActivity /></span>
              <div className="public-feature-title">Symptom Checker</div>
              <div className="public-feature-text">Analyze symptoms and generate a diet plan.</div>
            </div>
            <div className="public-feature">
              <span className="public-feature-icon"><FiCheckCircle /></span>
              <div className="public-feature-title">Food Checker</div>
              <div className="public-feature-text">Safety, quantities, interactions, alternatives.</div>
            </div>
          </div>

          <div className="public-cta-row">
            <PrimaryButton
              style={{ width: '100%' }}
              onClick={() => navigate('/features')}
            >
              Explore Features <FiArrowRight style={{ display: 'inline', marginLeft: 8 }} />
            </PrimaryButton>
            <PrimaryButton
              variant="ghost"
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              Try Demo
            </PrimaryButton>
          </div>

          <button type="button" className="public-text-link" onClick={() => navigate('/about')}>
            Learn more about the project
          </button>
        </section>
      </main>
    </div>
  );
}
