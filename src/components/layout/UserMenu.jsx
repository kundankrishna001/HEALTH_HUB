import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiSettings, FiUser, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const go = (to) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <div className="user-menu" ref={rootRef}>
      <button type="button" className="user-menu-trigger" onClick={() => setOpen((value) => !value)}>
        <span className="user-avatar">{initials(user?.name)}</span>
        <span className="user-menu-name hidden-mobile">{user?.name || 'User'}</span>
        <FiChevronDown className="hidden-mobile" style={{ color: 'var(--muted)' }} />
      </button>

      {open ? (
        <div className="user-menu-panel">
          <div className="user-menu-head">
            <span className="user-avatar user-avatar-lg">{initials(user?.name)}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
              <div className="muted" style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'Signed in'}</div>
            </div>
          </div>

          <button type="button" className="user-menu-item" onClick={() => go('/app/profile')}>
            <FiUser /> <span>Profile</span>
          </button>
          <button type="button" className="user-menu-item" onClick={() => go('/app/settings')}>
            <FiSettings /> <span>Settings</span>
          </button>
          <button type="button" className="user-menu-item" onClick={() => go('/app/help')}>
            <FiHelpCircle /> <span>Help</span>
          </button>

          <div className="user-menu-divider" />

          <button
            type="button"
            className="user-menu-item danger"
            onClick={async () => {
              await logout();
              navigate('/login', { replace: true });
            }}
          >
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
