import dayjs from 'dayjs';

const match = (query, ...parts) => {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return parts.filter(Boolean).join(' ').toLowerCase().includes(q);
};

export function searchAppState(state = {}, query = '') {
  const q = query.trim();
  if (!q) return [];

  const results = [];

  for (const meal of state.meals || []) {
    if (match(q, meal.name, meal.notes, String(meal.calories))) {
      results.push({
        id: meal.id,
        type: 'Meal',
        title: meal.name || 'Meal',
        subtitle: `${meal.calories || 0} cal · ${dayjs(meal.createdAt).format('MMM D')}`,
        to: '/app/nutrition'
      });
    }
  }

  for (const symptom of state.symptoms || []) {
    if (match(q, symptom.input, symptom.result?.condition, symptom.result?.severity)) {
      results.push({
        id: symptom.id,
        type: 'Symptom',
        title: symptom.result?.condition || 'Symptom check',
        subtitle: symptom.input?.slice(0, 60) || dayjs(symptom.createdAt).format('MMM D'),
        to: '/app/symptoms'
      });
    }
  }

  for (const recipe of state.recipes || []) {
    if (match(q, recipe.name, ...(recipe.ingredients || []))) {
      results.push({
        id: recipe.id,
        type: 'Recipe',
        title: recipe.name || 'Recipe',
        subtitle: recipe.favorite ? 'Favorite recipe' : 'Saved recipe',
        to: '/app/recipes'
      });
    }
  }

  for (const plan of state.dietPlans || []) {
    if (match(q, plan.title, plan.source)) {
      results.push({
        id: plan.id,
        type: 'Plan',
        title: plan.title || 'Diet plan',
        subtitle: `${plan.days?.length || 0} days · ${dayjs(plan.createdAt).format('MMM D')}`,
        to: '/app/diet-plan'
      });
    }
  }

  return results.slice(0, 8);
}
