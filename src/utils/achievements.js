import dayjs from 'dayjs';

const toDayKey = (iso) => dayjs(iso).format('YYYY-MM-DD');

export function computeStreak(meals = [], water = []) {
  const activeDays = new Set([...meals, ...water].map((item) => toDayKey(item.createdAt)));
  let streak = 0;
  for (let i = 0; i < 60; i += 1) {
    const day = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    if (activeDays.has(day)) streak += 1;
    else break;
  }
  return streak;
}

export function computePoints(state = {}) {
  const meals = state.meals?.length || 0;
  const water = state.water?.length || 0;
  const symptoms = state.symptoms?.length || 0;
  const recipes = state.recipes?.length || 0;
  const plans = state.dietPlans?.length || 0;
  const streak = computeStreak(state.meals, state.water);
  return meals * 15 + water * 5 + symptoms * 20 + recipes * 25 + plans * 40 + streak * 10;
}

const badgeDefs = [
  {
    id: 'first-meal',
    title: 'First Bite',
    description: 'Log your first meal',
    check: (s) => (s.meals?.length || 0) >= 1
  },
  {
    id: 'hydration-hero',
    title: 'Hydration Hero',
    description: 'Log water 5 times',
    check: (s) => (s.water?.length || 0) >= 5
  },
  {
    id: 'symptom-sleuth',
    title: 'Symptom Sleuth',
    description: 'Run a symptom check',
    check: (s) => (s.symptoms?.length || 0) >= 1
  },
  {
    id: 'chef-mode',
    title: 'Chef Mode',
    description: 'Save a generated recipe',
    check: (s) => (s.recipes?.length || 0) >= 1
  },
  {
    id: 'planner',
    title: 'Meal Planner',
    description: 'Save a weekly diet plan',
    check: (s) => (s.dietPlans?.length || 0) >= 1
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    check: (s) => computeStreak(s.meals, s.water) >= 7
  },
  {
    id: 'nutrition-ninja',
    title: 'Nutrition Ninja',
    description: 'Log 10 meals total',
    check: (s) => (s.meals?.length || 0) >= 10
  },
  {
    id: 'family-first',
    title: 'Family First',
    description: 'Add a family member',
    check: (s) => (s.family?.length || 0) >= 1
  }
];

export function computeBadges(state = {}) {
  return badgeDefs.map((def) => ({
    id: def.id,
    title: def.title,
    description: def.description,
    earned: def.check(state)
  }));
}

export function buildActivityFeed(state = {}, limit = 8) {
  const items = [
    ...(state.meals || []).map((m) => ({
      id: m.id,
      type: 'meal',
      title: m.name || 'Meal logged',
      detail: `${m.calories || 0} cal`,
      createdAt: m.createdAt,
      to: '/app/nutrition'
    })),
    ...(state.water || []).map((w) => ({
      id: w.id,
      type: 'water',
      title: 'Water logged',
      detail: `${w.amountMl} ml`,
      createdAt: w.createdAt,
      to: '/app/water'
    })),
    ...(state.symptoms || []).map((s) => ({
      id: s.id,
      type: 'symptom',
      title: s.result?.condition || 'Symptom check',
      detail: s.result?.severity ? `Severity: ${s.result.severity}` : 'Analyzed',
      createdAt: s.createdAt,
      to: '/app/symptoms'
    })),
    ...(state.recipes || []).map((r) => ({
      id: r.id,
      type: 'recipe',
      title: r.name || 'Recipe saved',
      detail: r.favorite ? 'Favorite' : 'Saved',
      createdAt: r.createdAt,
      to: '/app/recipes'
    })),
    ...(state.dietPlans || []).map((p) => ({
      id: p.id,
      type: 'plan',
      title: p.title || 'Diet plan saved',
      detail: `${p.days?.length || 0} days`,
      createdAt: p.createdAt,
      to: '/app/diet-plan'
    }))
  ];

  return items
    .filter((item) => item.createdAt)
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, limit);
}
