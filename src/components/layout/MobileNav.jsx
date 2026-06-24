import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { navigation } from '../../data/navigation';

const primaryTabs = [
  navigation.find((item) => item.to === '/app'),
  navigation.find((item) => item.to === '/app/symptoms'),
  navigation.find((item) => item.to === '/app/nutrition'),
  navigation.find((item) => item.to === '/app/water')
].filter(Boolean);

export default function MobileNav() {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      {primaryTabs.slice(0, 2).map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/app'}
          className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}

      <button
        type="button"
        className="bottom-nav-fab"
        aria-label="Quick log"
        onClick={() => navigate('/app/nutrition')}
      >
        <FiPlus size={22} />
      </button>

      {primaryTabs.slice(2, 4).map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/app'}
          className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
