import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import PrimaryButton from '../ui/PrimaryButton';

export default function PublicHeader({ active = 'home' }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const linkClass = (name) => `public-link${active === name ? ' active' : ''}`;

  return (
    <header className="public-nav">
      <div className="public-nav-inner">
        <Link to="/" className="public-brand">
          <span className="public-brand-mark"><FiActivity size={20} /></span>
          <span className="public-brand-text">Health Hub</span>
        </Link>
        <nav className="public-links">
          <Link to="/" className={linkClass('home')}>Home</Link>
          <Link to="/features" className={linkClass('features')}>Features</Link>
          <Link to="/about" className={linkClass('about')}>About</Link>
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
  );
}
