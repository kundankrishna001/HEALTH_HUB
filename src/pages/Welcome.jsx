import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiCheckCircle, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PrimaryButton from '../components/ui/PrimaryButton';

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="public-page">
      <header className="public-nav">
        <div className="public-nav-inner">
          <div className="public-brand">
            <span className="public-brand-mark"><FiActivity size={20} /></span>
            <span className="public-brand-text">Health Hub</span>
          </div>
          <nav className="public-links">
            <Link to="/" className="public-link active">Home</Link>
            <Link to={user ? '/app' : '/login'} className="public-link">Features</Link>
            <Link to="/about" className="public-link">About</Link>
          </nav>
          <div className="public-actions">
            <button type="button" onClick={toggleTheme} className="icon-pill" aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <Link to={user ? '/app' : '/login'} style={{ display: 'inline-flex' }}>
              <PrimaryButton style={{ padding: '10px 16px' }}>
                {user ? 'Open App' : 'Sign in'} <FiArrowRight style={{ display: 'inline', marginLeft: 8 }} />
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </header>

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
              onClick={() => navigate(user ? '/app' : '/login')}
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
