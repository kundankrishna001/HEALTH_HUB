import dayjs from 'dayjs';
import { apiRequest } from './httpClient';
import { calculateBMI, bmiCategory } from '../utils/calculations';
import { SELF_PROFILE_ID } from '../utils/profileScope';

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const sanitizeState = (state) => ({
  user: state?.user || {},
  family: state?.family || [],
  symptoms: state?.symptoms || [],
  meals: state?.meals || [],
  water: state?.water || [],
  metrics: state?.metrics || [],
  recipes: state?.recipes || [],
  dietPlans: state?.dietPlans || [],
  badges: state?.badges || [],
  settings: state?.settings || {}
});

export async function getState() {
  const payload = await apiRequest('/state');
  return sanitizeState(payload.state);
}

export async function updateState(updater) {
  const current = await getState();
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  const payload = await apiRequest('/state', {
    method: 'PUT',
    body: JSON.stringify(next)
  });
  return sanitizeState(payload.state);
}

export async function saveProfile(profile) {
  const bmi = calculateBMI(profile.heightCm, profile.weightKg);
  return updateState((state) => ({
    ...state,
    user: {
      ...state.user,
      ...profile,
      conditions: normalizeList(profile.conditions),
      preferences: normalizeList(profile.preferences),
      bmi,
      bmiCategory: bmiCategory(bmi)
    }
  }));
}

export async function logMeal(meal) {
  return updateState((state) => ({
    ...state,
    meals: [{
      id: crypto.randomUUID(),
      profileId: state.settings?.activeProfileId || SELF_PROFILE_ID,
      ...meal,
      name: meal.name || meal.meal,
      createdAt: dayjs().toISOString()
    }, ...state.meals]
  }));
}

export async function logWater(amountMl) {
  return updateState((state) => ({
    ...state,
    water: [{
      id: crypto.randomUUID(),
      profileId: state.settings?.activeProfileId || SELF_PROFILE_ID,
      amountMl,
      createdAt: dayjs().toISOString()
    }, ...state.water]
  }));
}

export async function saveSymptom(entry) {
  return updateState((state) => ({
    ...state,
    symptoms: [{ id: crypto.randomUUID(), ...entry, createdAt: dayjs().toISOString() }, ...state.symptoms]
  }));
}

export async function saveRecipe(recipe) {
  return updateState((state) => ({
    ...state,
    recipes: [{ id: crypto.randomUUID(), ...recipe, createdAt: dayjs().toISOString() }, ...state.recipes]
  }));
}

export async function saveMetric(metric) {
  return updateState((state) => ({
    ...state,
    metrics: [{
      id: crypto.randomUUID(),
      profileId: state.settings?.activeProfileId || SELF_PROFILE_ID,
      ...metric,
      createdAt: dayjs().toISOString()
    }, ...state.metrics]
  }));
}

export async function saveDietPlan(plan) {
  return updateState((state) => ({
    ...state,
    dietPlans: [
      {
        id: crypto.randomUUID(),
        title: plan.title || 'Weekly diet plan',
        source: plan.source || 'manual',
        days: plan.days || [],
        createdAt: dayjs().toISOString()
      },
      ...state.dietPlans
    ]
  }));
}

export async function deleteDietPlan(planId) {
  return updateState((state) => ({
    ...state,
    dietPlans: state.dietPlans.filter((item) => item.id !== planId)
  }));
}

export async function toggleRecipeFavorite(recipeId) {
  return updateState((state) => ({
    ...state,
    recipes: state.recipes.map((recipe) =>
      recipe.id === recipeId ? { ...recipe, favorite: !recipe.favorite } : recipe
    )
  }));
}

export async function deleteRecipe(recipeId) {
  return updateState((state) => ({
    ...state,
    recipes: state.recipes.filter((item) => item.id !== recipeId)
  }));
}

export async function saveFamilyMember(member) {
  const memberId = crypto.randomUUID();
  const dailyWaterGoal = member.dailyWaterGoal ? Number(member.dailyWaterGoal) : null;

  return updateState((state) => ({
    ...state,
    family: [
      {
        id: memberId,
        name: member.name || 'Family member',
        relation: member.relation || 'Family',
        age: member.age || '',
        weightKg: member.weightKg || '',
        heightCm: member.heightCm || '',
        dailyWaterGoal: dailyWaterGoal || '',
        conditions: normalizeList(member.conditions)
      },
      ...state.family
    ],
    settings: dailyWaterGoal
      ? {
          ...state.settings,
          profileWaterGoals: {
            ...state.settings?.profileWaterGoals,
            [memberId]: dailyWaterGoal
          }
        }
      : state.settings
  }));
}

export async function deleteFamilyMember(memberId) {
  return updateState((state) => ({
    ...state,
    family: state.family.filter((item) => item.id !== memberId),
    settings: {
      ...state.settings,
      activeProfileId: state.settings?.activeProfileId === memberId ? SELF_PROFILE_ID : state.settings?.activeProfileId
    }
  }));
}

export async function setActiveProfile(profileId) {
  return updateState((state) => ({
    ...state,
    settings: {
      ...state.settings,
      activeProfileId: profileId || SELF_PROFILE_ID
    }
  }));
}

export async function setGoals(goals) {
  return updateState((state) => ({
    ...state,
    settings: {
      ...state.settings,
      goals: { ...state.settings?.goals, ...goals }
    }
  }));
}

export async function setProfileWaterGoal(profileId, amountMl) {
  return updateState((state) => ({
    ...state,
    settings: {
      ...state.settings,
      profileWaterGoals: {
        ...state.settings?.profileWaterGoals,
        [profileId]: Number(amountMl)
      },
      ...(profileId === SELF_PROFILE_ID ? { dailyWaterGoal: Number(amountMl) } : {})
    }
  }));
}
