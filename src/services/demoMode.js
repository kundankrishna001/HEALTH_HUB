import { storage } from './storage';

import { getToken } from './tokenStore';

export const DEMO_TOKEN = 'demo-local-session';
export const DEMO_STATE_KEY = 'demo-state';

export const DEMO_USER = {
  id: 'demo',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'member'
};

export function isDemoToken(token) {
  return token === DEMO_TOKEN;
}

export function isDemoSession(user) {
  if (isDemoToken(getToken())) return true;
  return user?.email === DEMO_USER.email;
}

export function createDemoState() {
  return {
    user: {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      role: DEMO_USER.role,
      phone: '',
      age: '32',
      heightCm: '175',
      weightKg: '72',
      goal: 'Balanced wellness',
      conditions: [],
      preferences: [],
      language: 'English',
      theme: 'light'
    },
    family: [],
    symptoms: [],
    meals: [],
    water: [],
    metrics: [],
    recipes: [],
    dietPlans: [],
    badges: [],
    settings: {
      notifications: true,
      darkMode: false,
      officeReminder: '13:00',
      dailyWaterGoal: 2800,
      activeProfileId: 'self',
      profileWaterGoals: {},
      goals: {
        weightTarget: 70,
        stepsTarget: 8000,
        sleepTarget: 8
      }
    }
  };
}

export function getDemoState() {
  const stored = storage.get(DEMO_STATE_KEY);
  if (stored) return stored;
  const initial = createDemoState();
  storage.set(DEMO_STATE_KEY, initial);
  return initial;
}

export function saveDemoState(state) {
  storage.set(DEMO_STATE_KEY, state);
}

export function clearDemoState() {
  storage.remove(DEMO_STATE_KEY);
}
