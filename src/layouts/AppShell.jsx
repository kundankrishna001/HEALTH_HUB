import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MobileNav from '../components/layout/MobileNav';
import useMediaQuery from '../hooks/useMediaQuery';

export default function AppShell() {
  const mobile = useMediaQuery('(max-width: 900px)');

  return (
    <div className="app-shell app-frame">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '280px 1fr', gap: 18, padding: 16 }}>
        {!mobile ? <Sidebar /> : null}
        <main style={{ display: 'grid', gap: 18, paddingBottom: mobile ? 90 : 0 }}>
          <Topbar />
          <Outlet />
        </main>
      </div>
      {mobile ? <MobileNav /> : null}
    </div>
  );
}
