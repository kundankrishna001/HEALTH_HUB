import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiDroplet, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import SectionCard from '../components/ui/SectionCard';
import Badge from '../components/ui/Badge';
import ProgressRing from '../components/ui/ProgressRing';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useApp } from '../context/AppContext';
import { calculateBMI, bmiCategory } from '../utils/calculations';
import { buildActivityFeed, computeStreak } from '../utils/achievements';
import { filterByProfile, getActiveProfileId, getActiveProfileLabel, getWaterGoal } from '../utils/profileScope';
import { getGoalProgress } from '../utils/goals';

dayjs.extend(isToday);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const coerceNumber = (value) => {
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) ? n : 0;
};

const toDayKey = (iso) => dayjs(iso).format('YYYY-MM-DD');

const quickActions = [
  { title: 'Log water', value: 'Hit your hydration goal today', to: '/app/water', when: (ctx) => ctx.waterLogged === 0 },
  { title: 'Log a meal', value: 'Add breakfast/lunch/dinner calories', to: '/app/nutrition', when: (ctx) => ctx.mealsLogged === 0 },
  { title: 'Check symptoms', value: 'Generate diet plan from symptoms', to: '/app/symptoms', when: (ctx) => ctx.todaysSymptoms === 0 },
  { title: 'Meals', value: (ctx) => `${ctx.mealsLogged} logged today`, to: '/app/nutrition', when: (ctx) => ctx.mealsLogged > 0 },
  { title: 'Water', value: (ctx) => `${ctx.waterLogged} entries today`, to: '/app/water', when: (ctx) => ctx.waterLogged > 0 },
  { title: 'Symptoms', value: (ctx) => `${ctx.todaysSymptoms} noted today`, to: '/app/symptoms', when: (ctx) => ctx.todaysSymptoms > 0 },
  { title: 'Saved plans', value: (ctx) => `${ctx.savedPlans} diet plans`, to: '/app/diet-plan', when: (ctx) => ctx.savedPlans > 0 },
  { title: 'Recipes', value: (ctx) => `${ctx.savedRecipes} saved recipes`, to: '/app/recipes', when: (ctx) => ctx.savedRecipes > 0 }
];

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const profileId = getActiveProfileId(state);
  const activeProfile = getActiveProfileLabel(state);
  const bmi = state?.user?.bmi ?? calculateBMI(state?.user?.heightCm, state?.user?.weightKg);
  const waterGoal = getWaterGoal(state, profileId);
  const goalProgress = useMemo(() => getGoalProgress(state), [state]);

  const profileMeals = useMemo(() => filterByProfile(state?.meals, profileId), [state?.meals, profileId]);
  const profileWater = useMemo(() => filterByProfile(state?.water, profileId), [state?.water, profileId]);

  const todaysWater = useMemo(() => profileWater.filter((w) => dayjs(w.createdAt).isToday()) || [], [profileWater]);
  const todaysMeals = useMemo(() => profileMeals.filter((m) => dayjs(m.createdAt).isToday()) || [], [profileMeals]);

  const chartData = useMemo(() => {
    const allMeals = profileMeals || [];
    if (!allMeals.length) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Calories',
            data: [],
            borderColor: 'var(--secondary)',
            backgroundColor: 'color-mix(in srgb, var(--secondary) 14%, transparent)',
            fill: true,
            tension: 0.4
          }
        ]
      };
    }

    const days = Array.from({ length: 7 }).map((_, idx) => dayjs().subtract(6 - idx, 'day'));
    const labels = days.map((d) => d.format('ddd'));
    const totalsByDay = new Map(days.map((d) => [d.format('YYYY-MM-DD'), 0]));

    for (const meal of allMeals) {
      const key = toDayKey(meal.createdAt);
      if (!totalsByDay.has(key)) continue;
      totalsByDay.set(key, totalsByDay.get(key) + coerceNumber(meal.calories));
    }

    const points = days.map((d) => totalsByDay.get(d.format('YYYY-MM-DD')) || 0);
    return {
      labels,
      datasets: [
        {
          label: 'Calories',
          data: points,
          borderColor: 'var(--secondary)',
          backgroundColor: 'color-mix(in srgb, var(--secondary) 14%, transparent)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [profileMeals]);

  const waterTotalMl = useMemo(() => todaysWater.reduce((sum, item) => sum + (item.amountMl || 0), 0), [todaysWater]);
  const hydrationPct = Math.min(100, Math.round((waterTotalMl / waterGoal) * 100));
  const mealsCount = todaysMeals.length;
  const nutritionScore = Math.min(100, 50 + mealsCount * 10);
  const wellnessScore = Math.min(100, Math.round(hydrationPct * 0.4 + nutritionScore * 0.6));
  const streakDays = useMemo(() => computeStreak(profileMeals, profileWater), [profileMeals, profileWater]);
  const activityFeed = useMemo(
    () => buildActivityFeed({ ...state, meals: profileMeals, water: profileWater }, 6),
    [state, profileMeals, profileWater]
  );

  const topTasks = useMemo(() => {
    const ctx = {
      waterLogged: todaysWater.length,
      mealsLogged: todaysMeals.length,
      todaysSymptoms: state?.symptoms?.filter((s) => dayjs(s.createdAt).isToday()).length || 0,
      savedPlans: state?.dietPlans?.length || 0,
      savedRecipes: state?.recipes?.length || 0
    };

    return quickActions
      .filter((action) => action.when(ctx))
      .slice(0, 6)
      .map((action) => ({
        title: action.title,
        value: typeof action.value === 'function' ? action.value(ctx) : action.value,
        to: action.to
      }));
  }, [todaysWater, todaysMeals, state?.symptoms, state?.dietPlans, state?.recipes]);

  return (
    <div className="page-grid">
      <PageHeader
        title="Dashboard"
        subtitle="A premium control room for daily nutrition, symptoms, family, and reports."
        actions={[
          <Badge key="profile" tone="primary">{activeProfile}</Badge>,
          <Badge key="score" tone="primary">Wellness score {wellnessScore}</Badge>,
          <Badge key="mode" tone="success">Live mode</Badge>
        ]}
      />

      <section className="tile tile-flame" style={{ minHeight: 180 }}>
        <span className="tile-glyph" aria-hidden="true">🔥</span>
        <div>
          <div className="tile-title">Wellness score</div>
          <div className="tile-value" style={{ marginTop: 10 }}>{wellnessScore}<span style={{ fontSize: '1.1rem', opacity: 0.8 }}> / 100</span></div>
        </div>
        <div className="tile-caption" style={{ maxWidth: 460 }}>
          {streakDays >= 1
            ? `You're on a ${streakDays}-day streak. Keep logging meals and water to climb higher.`
            : 'Start logging meals and water today to build your wellness streak.'}
        </div>
      </section>

      <div className="grid-2">
        <button type="button" className="tile tile-blue quick-action-card" style={{ textAlign: 'left' }} onClick={() => navigate('/app/water')}>
          <span className="tile-glyph" aria-hidden="true">💧</span>
          <div className="tile-title">Hydration</div>
          <div className="tile-value">{hydrationPct}%</div>
          <div className="tile-caption">{(waterTotalMl / 1000).toFixed(1)}L of {(waterGoal / 1000).toFixed(1)}L goal today</div>
        </button>
        <button type="button" className="tile tile-violet quick-action-card" style={{ textAlign: 'left' }} onClick={() => navigate('/app/nutrition')}>
          <span className="tile-glyph" aria-hidden="true">🍽️</span>
          <div className="tile-title">Nutrition</div>
          <div className="tile-value">{nutritionScore}</div>
          <div className="tile-caption">{mealsCount} meal{mealsCount === 1 ? '' : 's'} logged today</div>
        </button>
      </div>

      <div className="grid-4">
        <StatCard label="BMI" value={bmi ?? '--'} detail={bmiCategory(bmi)} icon={FiTarget} />
        <StatCard
          label="Water today"
          value={waterTotalMl > 0 ? `${(waterTotalMl / 1000).toFixed(1)}L` : '--'}
          detail={`Goal ${(waterGoal / 1000).toFixed(1)}L`}
          icon={FiDroplet}
        />
        <StatCard
          label="Nutrition score"
          value={nutritionScore > 50 ? nutritionScore : '--'}
          detail="Derived from meals count"
          icon={FiTrendingUp}
        />
        <StatCard
          label="Saved content"
          value={`${(state?.recipes?.length || 0) + (state?.dietPlans?.length || 0)}`}
          detail="Recipes and diet plans"
          icon={FiActivity}
        />
      </div>

      <SectionCard title="Health goals" subtitle="Weight, steps, and sleep tracked alongside nutrition">
        <div className="grid-3">
          <div className="card card-pad" style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <ProgressRing value={goalProgress.weight.progress} label={`${goalProgress.weight.current ?? '--'} kg`} size={100} />
            <strong>Weight target {goalProgress.weight.target} kg</strong>
          </div>
          <div className="card card-pad" style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <ProgressRing value={goalProgress.steps.progress} label={`${goalProgress.steps.current} steps`} size={100} />
            <strong>Steps target {goalProgress.steps.target}</strong>
          </div>
          <div className="card card-pad" style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
            <ProgressRing value={goalProgress.sleep.progress} label={`${goalProgress.sleep.current} hr`} size={100} />
            <strong>Sleep target {goalProgress.sleep.target} hr</strong>
          </div>
        </div>
        <PrimaryButton variant="ghost" style={{ marginTop: 14 }} onClick={() => navigate('/app/metrics')}>
          Log metrics & edit goals
        </PrimaryButton>
      </SectionCard>

      <div className="grid-2">
        <SectionCard title="Weekly calories" subtitle="Trend line for recent meals">
          <div style={{ height: '100%', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </SectionCard>
        <SectionCard title="Wellness progress" subtitle="Today's health routine completion">
          <div style={{ height: '100%', minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing value={wellnessScore} label="Daily completion" size={140} />
          </div>
        </SectionCard>
      </div>

      <div className="grid-2">
        <SectionCard title="Today at a glance" subtitle="Tap a card to jump to the right module">
          <div className="grid-3">
            {topTasks.map(({ title, value, to }) => (
              <button
                key={title}
                type="button"
                className="card card-pad quick-action-card"
                style={{ background: 'color-mix(in srgb, var(--surface-strong) 86%, transparent)', textAlign: 'left' }}
                onClick={() => navigate(to)}
              >
                <div className="muted">{title}</div>
                <div style={{ fontWeight: 800, marginTop: 6 }}>{value}</div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" subtitle="Latest meals, water, symptoms, and saves">
          {activityFeed.length ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {activityFeed.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  type="button"
                  className="activity-item quick-action-card"
                  style={{ textAlign: 'left', width: '100%' }}
                  onClick={() => navigate(item.to)}
                >
                  <div className="muted" style={{ fontSize: 12, textTransform: 'capitalize' }}>
                    {item.type} · {dayjs(item.createdAt).format('MMM D, h:mm A')}
                  </div>
                  <strong>{item.title}</strong>
                  <span className="muted">{item.detail}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="muted">Log meals, water, or symptoms to see your activity feed here.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
