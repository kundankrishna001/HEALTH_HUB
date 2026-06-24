import React, { useMemo } from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { computeBadges, computePoints, computeStreak } from '../utils/achievements';

export default function Achievements() {
  const { state } = useApp();
  const points = useMemo(() => computePoints(state), [state]);
  const streak = useMemo(() => computeStreak(state?.meals, state?.water), [state?.meals, state?.water]);
  const badges = useMemo(() => computeBadges(state), [state]);
  const earnedCount = badges.filter((item) => item.earned).length;

  const leaderboard = useMemo(() => {
    const you = { name: state?.user?.name || 'You', points };
    const peers = [
      { name: 'Aarav Mehta', points: Math.max(points + 120, 980) },
      { name: 'Meera', points: Math.max(points - 80, 640) },
      { name: 'Aanya', points: Math.max(points - 220, 420) }
    ];
    return [you, ...peers].sort((a, b) => b.points - a.points);
  }, [state?.user?.name, points]);

  return (
    <div className="page-grid">
      <PageHeader title="Achievements" subtitle="Earn badges and points from real activity in the app." />
      <div className="grid-2">
        <SectionCard title="Progress">
          <div style={{ display: 'grid', gap: 10 }}>
            <Badge tone="primary">Points: {points}</Badge>
            <Badge tone="success">Daily streak: {streak} day{streak === 1 ? '' : 's'}</Badge>
            <Badge tone="warning">Badges earned: {earnedCount} / {badges.length}</Badge>
          </div>
        </SectionCard>
        <SectionCard title="Leaderboard">
          <ol>
            {leaderboard.map((entry) => (
              <li key={entry.name}>
                {entry.name} - {entry.points}
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <SectionCard title="Badge collection" subtitle="Unlock badges by logging meals, water, symptoms, and plans">
        <div className="grid-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="card card-pad"
              style={{
                opacity: badge.earned ? 1 : 0.55,
                background: badge.earned
                  ? 'color-mix(in srgb, var(--success) 10%, var(--surface-strong))'
                  : 'color-mix(in srgb, var(--surface-strong) 86%, transparent)'
              }}
            >
              <strong>{badge.title}</strong>
              <p className="muted" style={{ margin: '8px 0 0' }}>{badge.description}</p>
              <Badge tone={badge.earned ? 'success' : 'warning'}>
                {badge.earned ? 'Earned' : 'Locked'}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
