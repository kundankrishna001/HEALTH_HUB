import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { navigationGroups } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';

const MobileMenuContext = createContext(null);

export function MobileMenuProvider({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const value = {
    open,
    openMenu: () => setOpen(true),
    closeMenu: () => setOpen(false),
    toggleMenu: () => setOpen((current) => !current)
  };

  return (
    <MobileMenuContext.Provider value={value}>
      {children}
      {open ? <MobileMenuDrawer onClose={() => setOpen(false)} /> : null}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export function MobileMenuButton({ label = 'Menu' }) {
  const menu = useMobileMenu();
  if (!menu) return null;

  return (
    <button
      type="button"
      className="mobile-menu-trigger"
      aria-label="Open navigation menu"
      onClick={menu.openMenu}
    >
      <FiMenu size={20} />
      {label ? <span>{label}</span> : null}
    </button>
  );
}

function MobileMenuDrawer({ onClose }) {
  const { user } = useAuth();

  return (
    <div className="mobile-menu-root" role="presentation">
      <button type="button" className="mobile-menu-backdrop" aria-label="Close menu" onClick={onClose} />
      <aside className="mobile-menu-panel" aria-label="App navigation">
        <div className="mobile-menu-head">
          <div>
            <div className="mobile-menu-kicker">Health Hub</div>
            <strong>{user?.name || 'Guest'}</strong>
            <div className="muted" style={{ fontSize: 13 }}>{user?.email || 'Signed in'}</div>
          </div>
          <button type="button" className="icon-pill" aria-label="Close menu" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="mobile-menu-scroll">
          {navigationGroups.map((group) => (
            <section key={group.title} className="mobile-menu-group">
              <h3>{group.title}</h3>
              <div className="mobile-menu-links">
                {group.items.map(({ label, to, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/app'}
                    className={({ isActive }) => `mobile-menu-link${isActive ? ' active' : ''}`}
                    onClick={onClose}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}
