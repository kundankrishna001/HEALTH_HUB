import { bmiCategory } from '../utils/calculations';
import { apiRequest } from './httpClient';

const toList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

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
    // Simulate AI failure and directly fallback to DB
    throw new Error('AI Engine simulated failure');
  } catch (error) {
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
  } catch (error) {
    const fallback = await fetchFallback('weeklyPlan', query, profile);
    return fallback || [];
  }
}

export async function generateRecipe(ingredients, type, profile) {
  try {
    throw new Error('AI Engine simulated failure');
  } catch (error) {
    const fallback = await fetchFallback('recipe', ingredients, profile);
    return fallback || null;
  }
}

export async function checkFood(foodString, profile) {
  try {
    throw new Error('AI Engine simulated failure');
  } catch (error) {
    const fallback = await fetchFallback('checkFood', foodString, profile);
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
  } catch (error) {
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

