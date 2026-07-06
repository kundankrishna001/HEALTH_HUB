export const GOAL_OPTIONS = [
  { value: 'Balanced wellness', label: 'Stay healthy', hint: 'Daily balanced habits' },
  { value: 'Lose weight', label: 'Lose weight', hint: 'Fat loss & cleaner eating' },
  { value: 'Build muscle', label: 'Build muscle', hint: 'Strength & protein focus' },
  { value: 'More energy', label: 'More energy', hint: 'Reduce fatigue' },
  { value: 'Better sleep', label: 'Better sleep', hint: 'Rest & recovery' },
  { value: 'Manage a health condition', label: 'Manage condition', hint: 'Diet for medical needs' }
];

export const PREFERENCE_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Keto',
  'Low carb',
  'High protein',
  'Gluten-free',
  'Dairy-free',
  'Halal',
  'No spicy food'
];

export const CONDITION_OPTIONS = [
  'Diabetes',
  'Hypertension',
  'PCOS',
  'Thyroid issues',
  'High cholesterol',
  'Asthma',
  'Heart condition',
  'None'
];

export function parseOptionList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}
