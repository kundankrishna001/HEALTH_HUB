import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import ProgressRing from '../components/ui/ProgressRing';
import CombinedShoppingListExport from '../components/ui/CombinedShoppingListExport';
import { useApp } from '../context/AppContext';
import {
  filterByProfile,
  getActiveProfileId,
  getActiveProfileLabel,
  getMemberStats,
  getProfileOptions,
  getTodayWaterTotal,
  getWaterGoal
} from '../utils/profileScope';

dayjs.extend(isToday);

export default function Family() {
  const { state, addFamilyMember, deleteFamilyMember, setActiveProfile, setProfileWaterGoal } = useApp();
  const [form, setForm] = useState({ name: '', relation: '', age: '', weightKg: '', dailyWaterGoal: '', conditions: '' });
  const [goalDrafts, setGoalDrafts] = useState({});
  const activeId = getActiveProfileId(state);
  const activeLabel = getActiveProfileLabel(state);
  const savedPlans = state?.dietPlans || [];

  const memberRows = useMemo(
    () => (state?.family || []).map((member) => ({ id: member.id, ...member })),
    [state?.family]
  );

  const dashboards = useMemo(() => {
    const profiles = getProfileOptions(state);
    return profiles.map((profile) => {
      const scopedMeals = filterByProfile(state?.meals, profile.id);
      const todayMeals = scopedMeals.filter((item) => dayjs(item.createdAt).isToday()).length;
      const todayWater = getTodayWaterTotal(state, profile.id);
      const waterGoal = getWaterGoal(state, profile.id);
      const stats = getMemberStats(state, profile.id);
      const hydrationPct = Math.min(100, Math.round((todayWater / waterGoal) * 100));

      return {
        ...profile,
        todayMeals,
        todayWater,
        waterGoal,
        hydrationPct,
        stats
      };
    });
  }, [state]);

  const handleAdd = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    await addFamilyMember(form);
    setForm({ name: '', relation: '', age: '', weightKg: '', dailyWaterGoal: '', conditions: '' });
    toast.success('Family member added');
  };

  const handleSaveWaterGoal = async (profileId) => {
    const value = Number(goalDrafts[profileId] ?? getWaterGoal(state, profileId));
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Enter a valid water goal in ml');
      return;
    }
    await setProfileWaterGoal(profileId, value);
    toast.success('Water goal updated');
  };

  return (
    <div className="page-grid">
      <PageHeader
        title="Family Mode"
        subtitle="Separate profiles, custom water goals, and a combined shopping list from saved plans."
        actions={[<Badge key="active" tone="primary">Viewing: {activeLabel}</Badge>]}
      />

      <SectionCard title="Active profile" subtitle="Switch who you are tracking for in the top bar or here">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {getProfileOptions(state).map((profile) => (
            <PrimaryButton
              key={profile.id}
              variant={activeId === profile.id ? 'solid' : 'ghost'}
              onClick={() => {
                setActiveProfile(profile.id);
                toast.info(`Switched to ${profile.name}`);
              }}
            >
              {profile.name}
            </PrimaryButton>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Family dashboards" subtitle="Today’s meals, hydration, and per-person water goals">
        <div className="grid-3">
          {dashboards.map((profile) => (
            <div key={profile.id} className="card card-pad" style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <strong>{profile.name}</strong>
                {activeId === profile.id ? <Badge tone="success">Active</Badge> : null}
              </div>
              <span className="muted">{profile.relation}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ProgressRing
                  value={profile.hydrationPct}
                  label={`${profile.todayWater} / ${profile.waterGoal} ml`}
                  size={96}
                />
              </div>
              <Badge tone="primary">{profile.todayMeals} meals today</Badge>
              {profile.stats.latestWeight ? <Badge tone="warning">Weight: {profile.stats.latestWeight} kg</Badge> : null}
              <TextField
                label="Daily water goal (ml)"
                type="number"
                value={goalDrafts[profile.id] ?? profile.waterGoal}
                onChange={(e) => setGoalDrafts({ ...goalDrafts, [profile.id]: e.target.value })}
              />
              <PrimaryButton variant="ghost" onClick={() => handleSaveWaterGoal(profile.id)}>
                Save water goal
              </PrimaryButton>
              <PrimaryButton variant="ghost" onClick={() => setActiveProfile(profile.id)}>
                Track as {profile.name}
              </PrimaryButton>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Combined family shopping list" subtitle="Merged from all saved diet plans">
        <CombinedShoppingListExport dietPlans={savedPlans} />
      </SectionCard>

      <div className="grid-2">
        <SectionCard title="Add family member">
          <div className="grid-2">
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Relation" value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} />
            <TextField label="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <TextField label="Weight (kg)" type="number" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} />
            <TextField
              label="Water goal (ml)"
              type="number"
              placeholder="Auto by age if blank"
              value={form.dailyWaterGoal}
              onChange={(e) => setForm({ ...form, dailyWaterGoal: e.target.value })}
            />
            <TextField label="Conditions" value={form.conditions} onChange={(e) => setForm({ ...form, conditions: e.target.value })} />
          </div>
          <PrimaryButton style={{ marginTop: 14 }} onClick={handleAdd}>Add member</PrimaryButton>
        </SectionCard>

        <SectionCard title="Family profiles">
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'relation', label: 'Relation' },
              { key: 'age', label: 'Age' },
              {
                key: 'waterGoal',
                label: 'Water goal',
                render: (row) => `${getWaterGoal(state, row.id)} ml`
              },
              { key: 'conditions', label: 'Conditions', render: (row) => (row.conditions || []).join(', ') || 'None' },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <PrimaryButton variant="ghost" onClick={() => setActiveProfile(row.id)}>Switch</PrimaryButton>
                    <PrimaryButton variant="ghost" onClick={async () => {
                      await deleteFamilyMember(row.id);
                      toast.success('Member removed');
                    }}>
                      Remove
                    </PrimaryButton>
                  </div>
                )
              }
            ]}
            rows={memberRows}
          />
        </SectionCard>
      </div>

      <SectionCard title="Shared meals" subtitle="Suggestions when multiple profiles are active">
        <div style={{ display: 'grid', gap: 10 }}>
          <Badge tone="primary">Common meal: Millet thali</Badge>
          <Badge tone="success">Child-friendly option: softer spices</Badge>
          <Badge tone="warning">Estimated cost: Rs 640 / day for {Math.max(1, (state?.family?.length || 0) + 1)} people</Badge>
          <Badge tone="primary">
            Profiles tracked: {getProfileOptions(state).length} ({activeLabel} active)
          </Badge>
          <Badge tone="success">
            Household water goals: {dashboards.reduce((sum, profile) => sum + profile.waterGoal, 0)} ml / day total
          </Badge>
        </div>
      </SectionCard>
    </div>
  );
}
