const baseState = {
  user: {
    name: '',
    email: '',
    phone: '',
    age: '',
    heightCm: '',
    weightKg: '',
    goal: '',
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
  // No demo badges by default; badges should come from the live state.
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


export function createDefaultState(profile = {}) {
  return {
    ...baseState,
    user: {
      ...baseState.user,
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role || 'member'
    }
  };
}
