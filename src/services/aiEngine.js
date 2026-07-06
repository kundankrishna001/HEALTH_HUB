import { bmiCategory } from '../utils/calculations';
import { apiRequest } from './httpClient';

async function fetchFallback(type, query = '', profile = {}) {
  try {
    const res = await apiRequest('/ai-fallback', {
      method: 'POST',
      body: JSON.stringify({ type, query, profile })
    });
    return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  } catch (err) {
    console.error(`Fallback failed for ${type}:`, err);
    return null;
  }
}

export async function detectSymptoms(symptomsString, profile) {
  try {
    throw new Error('AI Engine simulated failure');
  } catch {
    const fallback = await fetchFallback('symptoms', symptomsString, profile);
    return fallback || {
      condition: 'Unknown',
      severity: 'Low',
      duration: 'Not specified',
      foods: [],
      avoid: [],
      hydration: '',
      remedies: [],
      mealTiming: '',
      doctor: '',
      bmiStatus: bmiCategory(null)
    };
  }
}

export async function generateWeeklyPlan(query = '', profile = {}) {
  try {
    throw new Error('AI Engine simulated failure');
  } catch {
    const fallback = await fetchFallback('weeklyPlan', query, profile);
    return fallback || [];
  }
}

export async function generateRecipe(keyword, servings = 4, profile = {}) {
  const query = keyword ? `${keyword}|servings:${servings}` : `servings:${servings}`;
  try {
    throw new Error('AI Engine simulated failure');
  } catch {
    const fallback = await fetchFallback('recipe', query, profile);
    return fallback || null;
  }
}

export async function checkFood(foodString, profile, meds = []) {
  const medsList = Array.isArray(meds) ? meds.filter(Boolean) : [];
  const query = medsList.length ? `${foodString}|meds:${medsList.join(',')}` : foodString;
  try {
    throw new Error('AI Engine simulated failure');
  } catch {
    const fallback = await fetchFallback('checkFood', query, profile);
    return fallback || {
      safe: false,
      quantity: '',
      interactions: '',
      explanation: '',
      alternatives: [],
      benefits: []
    };
  }
}

export async function scanFoodFromText(text, profile) {
  try {
    throw new Error('AI Engine simulated failure');
  } catch {
    const fallback = await fetchFallback('scanFood', text, profile);
    return fallback || {
      item: text || 'Unknown Item',
      calories: null,
      nutrition: '',
      diseaseSafe: '',
      healthier: ''
    };
  }
}
