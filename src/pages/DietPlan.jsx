import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import TextField from '../components/ui/TextField';
import ShoppingListExport from '../components/ui/ShoppingListExport';
import CombinedShoppingListExport from '../components/ui/CombinedShoppingListExport';
import { useApp } from '../context/AppContext';

export default function DietPlan() {
  const { state, generateWeeklyPlan, saveDietPlan, deleteDietPlan } = useApp();
  const [plan, setPlan] = useState([]);
  const [planTitle, setPlanTitle] = useState('My weekly plan');
  const [selectedSavedId, setSelectedSavedId] = useState('');

  const [loading, setLoading] = useState(false);

  const rows = useMemo(() => plan.map((item, index) => ({ id: index, ...item })), [plan]);
  const savedPlans = state?.dietPlans || [];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const next = await generateWeeklyPlan();
      setPlan(Array.isArray(next) ? next : []);
      setSelectedSavedId('');
      if (!next?.length) toast.error('No plan returned. Try again.');
      else toast.success('7-day plan generated');
    } catch (error) {
      toast.error(error?.message || 'Could not generate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan.length) return;
    try {
      await saveDietPlan({ title: planTitle, source: 'weekly-generator', days: plan });
      toast.success('Diet plan saved');
    } catch (error) {
      toast.error(error?.message || 'Could not save plan');
    }
  };

  const handleLoadSaved = (planId) => {
    const saved = savedPlans.find((item) => item.id === planId);
    if (!saved) return;
    setPlan(saved.days || []);
    setPlanTitle(saved.title || 'My weekly plan');
    setSelectedSavedId(planId);
    toast.info('Saved plan loaded');
  };

  const handleDeleteSaved = async (planId) => {
    try {
      await deleteDietPlan(planId);
      if (selectedSavedId === planId) {
        setSelectedSavedId('');
        setPlan([]);
      }
      toast.success('Plan removed');
    } catch (error) {
      toast.error(error?.message || 'Could not delete plan');
    }
  };

  return (
    <div className="page-grid">
      <PageHeader
        title="Diet Plan"
        subtitle="Generate a 7-day plan, save it, and reload saved plans anytime."
        actions={savedPlans.length ? [<Badge key="saved" tone="success">{savedPlans.length} saved</Badge>] : null}
      />

      {savedPlans.length ? (
        <SectionCard title="Combined shopping list" subtitle="All items from every saved plan, deduplicated">
          <CombinedShoppingListExport dietPlans={savedPlans} title="All saved plans shopping list" />
        </SectionCard>
      ) : null}

      {savedPlans.length ? (
        <SectionCard title="Saved plans" subtitle="Tap a plan to load it again">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {savedPlans.map((saved) => (
              <div key={saved.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{saved.title}</strong>
                  <div className="muted" style={{ fontSize: '0.9rem', marginTop: 4 }}>{saved.days?.length || 0} days · {dayjs(saved.createdAt).format('MMM D, YYYY')}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <PrimaryButton variant="ghost" onClick={() => handleLoadSaved(saved.id)} style={{ flex: 1 }}>Load</PrimaryButton>
                  <PrimaryButton variant="ghost" onClick={() => handleDeleteSaved(saved.id)} style={{ flex: 1 }}>Delete</PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Weekly generator"
        subtitle="Produces a balanced plan instantly"
        action={<PrimaryButton onClick={handleGenerate} disabled={loading}>{loading ? 'Generating…' : 'Generate 7-day plan'}</PrimaryButton>}
      >
        {plan.length ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="grid-2" style={{ alignItems: 'end' }}>
              <TextField label="Plan name" value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} />
              <PrimaryButton onClick={handleSave}>Save this plan</PrimaryButton>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {plan.map((day) => (
                <div key={day.day} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong style={{ fontSize: '1.1rem' }}>{day.day}</strong>
                    <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{day.calories} cal</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--primary)' }}>B:</strong> {day.breakfast}</div>
                    <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--success)' }}>L:</strong> {day.lunch}</div>
                    <div style={{ fontSize: '0.9rem' }}><strong style={{ color: 'var(--warning)' }}>D:</strong> {day.dinner}</div>
                  </div>
                </div>
              ))}
            </div>
            <DataTable
              searchable
              placeholder="Search meals, calories, or badges"
              columns={[
                { key: 'day', label: 'Day' },
                { key: 'breakfast', label: 'Breakfast' },
                { key: 'lunch', label: 'Lunch' },
                { key: 'dinner', label: 'Dinner' },
                { key: 'calories', label: 'Calories' },
                { key: 'badges', label: 'Condition badges', render: (row) => (Array.isArray(row.badges) ? row.badges.join(' · ') : '—') }
              ]}
              rows={rows}
            />
            <ShoppingListExport planDays={plan} planTitle={planTitle} />
          </div>
        ) : (
          <p className="muted">Click generate to build your week, then save it for later.</p>
        )}
      </SectionCard>
    </div>
  );
}
