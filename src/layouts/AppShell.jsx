import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MobileNav from '../components/layout/MobileNav';
import LoadingScreen from '../components/ui/LoadingScreen';
import PrimaryButton from '../components/ui/PrimaryButton';
import useMediaQuery from '../hooks/useMediaQuery';
import { useApp } from '../context/AppContext';

export default function AppShell() {
  const mobile = useMediaQuery('(max-width: 900px)');
  const { loading, loadError, refresh } = useApp();

  if (loading) {
    return <LoadingScreen />;
  }

  if (loadError) {
    return (
      <div className="app-shell app-frame">
        <div className="container" style={{ padding: 24 }}>
          <div className="card card-pad" style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center' }}>
            <h2 style={{ marginTop: 0 }}>Could not load your data</h2>
            <p className="muted">{loadError}</p>
            <PrimaryButton onClick={() => refresh().catch(() => {})}>Try again</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

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
