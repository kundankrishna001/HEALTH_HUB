import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiMoon, FiShield } from 'react-icons/fi';
import { navigation } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="card sidebar-shell">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <FiActivity size={24} />
        </div>
        <div>
          <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Health Hub</div>
          <div className="muted" style={{ fontSize: 12 }}>Assistant SaaS</div>
        </div>
      </div>
      <div className="auth-chip" style={{ width: 'fit-content' }}>
        <FiShield />
        <span>Wellness workspace</span>
      </div>
      <nav className="sidebar-nav">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app'}
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer stack">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Signed in as</div>
            <div style={{ fontWeight: 800 }}>{user?.name ?? 'Demo User'}</div>
          </div>
          <div className="icon-pill">
            <FiMoon />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
          <FiActivity />
          <span>{user?.email ?? 'Local session active'}</span>
        </div>
      </div>
    </aside>
  );
}
