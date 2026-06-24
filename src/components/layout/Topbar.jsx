import React from 'react';
import dayjs from 'dayjs';
import { FiChevronRight, FiMoon, FiSun } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FiZap } from 'react-icons/fi';
import GlobalSearch from './GlobalSearch';
import NotificationsPanel from './NotificationsPanel';
import ProfileSwitcher from './ProfileSwitcher';
import UserMenu from './UserMenu';
import QuickAdd from './QuickAdd';
import { navigation } from '../../data/navigation';
import { useApp } from '../../context/AppContext';
import { getActiveProfileId, getActiveProfileLabel, filterByProfile } from '../../utils/profileScope';
import { computeStreak } from '../../utils/achievements';

const routeLabels = Object.fromEntries(navigation.map((item) => [item.to.replace('/app', '') || '/', item.label]));

const greeting = () => {
  const hour = dayjs().hour();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { state } = useApp();
  const location = useLocation();
  const pageKey = location.pathname.replace('/app', '') || '/';
  const pageLabel = routeLabels[pageKey] || 'Dashboard';
  const activeProfile = getActiveProfileLabel(state);
  const profileId = getActiveProfileId(state);
  const isFamilyProfile = profileId !== 'self';
  const firstName = (user?.name || '').split(' ')[0];
  const streak = computeStreak(filterByProfile(state?.meals, profileId), filterByProfile(state?.water, profileId));

  return (
    <header className="card topbar-shell">
      <div style={{ minWidth: 0, flexShrink: 1 }}>
        <div className="muted" style={{ fontSize: 12, marginBottom: 6, whiteSpace: 'nowrap' }}>
          {greeting()}{firstName ? `, ${firstName}` : ''} · {dayjs().format('ddd, MMM D')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', minWidth: 0 }}>
          <strong style={{ fontSize: '1.15rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{pageLabel}</strong>
          <FiChevronRight style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <span className="muted hidden-mobile" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Health Hub</span>
          {streak > 0 ? (
            <span className="streak-chip" title={`${streak}-day active streak`}>
              <FiZap size={13} /> {streak}d
            </span>
          ) : null}
          {isFamilyProfile ? (
            <span className="profile-pill">Viewing: {activeProfile}</span>
          ) : null}
        </div>
      </div>
      <div className="topbar-meta">
        <GlobalSearch />
        <div className="topbar-icons">
          <QuickAdd />
          <button onClick={toggleTheme} className="icon-pill" aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <NotificationsPanel />
        </div>
        <ProfileSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}
