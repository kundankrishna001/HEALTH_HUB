import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMoon, FiSun, FiActivity } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout({ children }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="auth-shell" style={{ gridTemplateColumns: '1fr' }}>
      <main className="auth-panel">
        <div className="auth-stack">
          <div className="auth-topbar">
            <button type="button" className="auth-back" onClick={handleBack}>
              <FiArrowLeft />
              <span>Back</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" onClick={toggleTheme} className="icon-pill" aria-label="Toggle theme">
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
              </button>
              <Link to="/" className="auth-brand">
                <span className="auth-brand-mark"><FiActivity size={18} /></span>
                <span className="hidden-mobile">Health Hub</span>
              </Link>
            </div>
          </div>
          <div className="auth-card card">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
