import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import TextField from '../components/ui/TextField';
import DataTable from '../components/ui/DataTable';
import { useApp } from '../context/AppContext';
import { filterByProfile, getActiveProfileId, getActiveProfileLabel } from '../utils/profileScope';
import Badge from '../components/ui/Badge';
import ShoppingListExport from '../components/ui/ShoppingListExport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const coerceNumber = (value) => {
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) ? n : 0;
};

export default function Nutrition() {
  const { state, logMeal, exportPdf, generateWeeklyPlan, saveDietPlan } = useApp();
  const profileId = getActiveProfileId(state);
  const profileMeals = useMemo(() => filterByProfile(state?.meals, profileId), [state?.meals, profileId]);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [preference, setPreference] = useState('');
  const [weekPlan, setWeekPlan] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);

  const planRows = useMemo(() => weekPlan.map((item, index) => ({ id: index, ...item })), [weekPlan]);

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    try {
      const plan = await generateWeeklyPlan(preference);
      setWeekPlan(Array.isArray(plan) ? plan : []);
      if (!plan?.length) toast.info('No plan returned, try a different keyword');
      else toast.success('7-day meal plan generated');
    } catch (error) {
      toast.error(error?.message || 'Could not generate meal plan');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!weekPlan.length) return;
    await saveDietPlan({ title: preference ? `${preference} week plan` : 'Weekly meal plan', source: 'nutrition', days: weekPlan });
    toast.success('Meal plan saved to your library');
  };

  const chartData = useMemo(() => {
    const meals = profileMeals || [];
    const days = Array.from({ length: 7 }).map((_, idx) => dayjs().subtract(6 - idx, 'day'));
    const labels = days.map((d) => d.format('ddd'));
    const totalsByDay = new Map(days.map((d) => [d.format('YYYY-MM-DD'), 0]));

    for (const meal of meals) {
      const key = dayjs(meal.createdAt).format('YYYY-MM-DD');
      if (!totalsByDay.has(key)) continue;
      totalsByDay.set(key, totalsByDay.get(key) + coerceNumber(meal.calories));
    }

    const points = days.map((d) => totalsByDay.get(d.format('YYYY-MM-DD')) || 0);

    return {
      labels,
      datasets: [{
        label: 'Calories',
        data: points,
        borderColor: 'var(--primary)',
        backgroundColor: 'color-mix(in srgb, var(--primary) 14%, transparent)',
        fill: true,
        tension: 0.4
      }]
    };
  }, [profileMeals]);

  return (
    <div className="page-grid">
      <PageHeader
        title="Nutrition Tracker"
        subtitle="Meal logging, metrics, charts, weekly reports, and PDF export."
        actions={[<Badge key="profile" tone="primary">{getActiveProfileLabel(state)}</Badge>]}
      />
      <div className="grid-2">
        <SectionCard title="Log a meal">
          <div className="grid-2">
            <TextField
              label="Meal"
              placeholder="Breakfast"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
            />
            <TextField
              label="Calories"
              placeholder="420"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <PrimaryButton
            style={{ marginTop: 14 }}
            onClick={async () => {
              const cal = coerceNumber(calories);
              if (!mealName.trim()) {
                toast.error('Enter a meal name');
                return;
              }
              if (!cal) {
                toast.error('Enter calories greater than 0');
                return;
              }
              try {
                await logMeal({ name: mealName.trim(), meal: mealName.trim(), calories: cal });
                setMealName('');
                setCalories('');
                toast.success('Meal logged');
              } catch (error) {
                toast.error(error?.message || 'Could not save meal');
              }
            }}
          >
            Save meal
          </PrimaryButton>
        </SectionCard>
        <SectionCard title="Weekly trend">
          <div style={{ height: 260 }}>
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </SectionCard>
      </div>
      <SectionCard
        title="Weekly meal plan generator"
        subtitle="Generate a balanced 7-day meal chart instantly"
        action={
          <PrimaryButton onClick={handleGeneratePlan} disabled={planLoading}>
            {planLoading ? 'Generating…' : 'Generate 7-day plan'}
          </PrimaryButton>
        }
      >
        <div className="grid-2" style={{ alignItems: 'end' }}>
          <TextField
            label="Preference (optional)"
            placeholder="e.g. vegan, keto, high-protein"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
          />
          {weekPlan.length ? (
            <PrimaryButton variant="ghost" onClick={handleSavePlan}>Save plan</PrimaryButton>
          ) : null}
        </div>

        {weekPlan.length ? (
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            <DataTable
              searchable
              placeholder="Search meals, calories…"
              columns={[
                { key: 'day', label: 'Day' },
                { key: 'breakfast', label: 'Breakfast' },
                { key: 'lunch', label: 'Lunch' },
                { key: 'dinner', label: 'Dinner' },
                { key: 'calories', label: 'Calories' }
              ]}
              rows={planRows}
            />
            <ShoppingListExport planDays={weekPlan} planTitle={preference ? `${preference} week plan` : 'Weekly meal plan'} />
          </div>
        ) : (
          <p className="muted" style={{ marginTop: 14 }}>Click generate to build a full week of meals with a shopping list.</p>
        )}
      </SectionCard>

      <SectionCard title="Recent meals" subtitle="Optimized local persistence with immediate feedback">
        <div className="grid-3">
          {(profileMeals || []).slice(0, 6).map((meal) => (
            <div key={meal.id} className="card card-pad">
              <strong>{meal.name || meal.meal}</strong>
              <p className="muted">{meal.calories} calories</p>
            </div>
          ))}
        </div>
        <PrimaryButton style={{ marginTop: 14 }} onClick={() => exportPdf('Nutrition Report', ['Weekly nutrition summary', `Meals logged: ${(profileMeals || []).length}`])}>
          Export PDF
        </PrimaryButton>
      </SectionCard>
    </div>
  );
}
