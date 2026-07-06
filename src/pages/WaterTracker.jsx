import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { filterByProfile, getActiveProfileId, getActiveProfileLabel, getWaterGoal } from '../utils/profileScope';

dayjs.extend(isToday);

export default function WaterTracker() {
  const { state, logWater } = useApp();
  const profileId = getActiveProfileId(state);
  const profileWater = useMemo(() => filterByProfile(state?.water, profileId), [state?.water, profileId]);
  const todayWater = useMemo(() => profileWater.filter((item) => dayjs(item.createdAt).isToday()), [profileWater]);
  const total = todayWater.reduce((sum, item) => sum + item.amountMl, 0);
  const goal = getWaterGoal(state, profileId);
  const percent = Math.min(100, Math.round((total / goal) * 100));

  return (
    <div className="page-grid">
      <PageHeader
        title="Water Tracker"
        subtitle="Track hydration with quick add buttons and a progress ring."
        actions={[<Badge key="profile" tone="primary">{getActiveProfileLabel(state)}</Badge>]}
      />
      <div className="grid-2">
        <SectionCard title="Today’s intake">
          <ProgressRing value={percent} label={`${total} ml / ${goal} ml`} />
        </SectionCard>
        <SectionCard title="Quick add">
          <p className="muted" style={{ marginTop: 0 }}>
            Daily goal for {getActiveProfileLabel(state)}: {(goal / 1000).toFixed(1)}L
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[200, 250, 500, 750].map((amount) => (
              <PrimaryButton
                key={amount}
                variant="ghost"
                onClick={async () => {
                  try {
                    await logWater(amount);
                    toast.success(`Added ${amount} ml`);
                  } catch (error) {
                    toast.error(error?.message || 'Could not log water');
                  }
                }}
              >
                +{amount} ml
              </PrimaryButton>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
