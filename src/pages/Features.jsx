import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import PublicHeader from '../components/layout/PublicHeader';
import FeatureGrid from '../components/ui/FeatureGrid';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export default function Features() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="public-page">
      <PublicHeader active="features" />
      <main className="public-features-page">
        <h1 className="public-title">All features</h1>
        <p className="public-subtitle">
          Everything in Health Hub — symptom checks, meal planning, tracking, family profiles, and more.
        </p>
        <FeatureGrid />
        <div className="public-features-cta">
          <PrimaryButton onClick={() => navigate(user ? '/app' : '/login')}>
            {user ? 'Open app' : 'Sign in to use features'}
            <FiArrowRight style={{ display: 'inline', marginLeft: 8 }} />
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={() => navigate('/login')}>
            Try demo
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
