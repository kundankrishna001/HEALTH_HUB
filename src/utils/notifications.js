import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { filterByProfile, getActiveProfileId, getWaterGoal } from './profileScope';

dayjs.extend(isToday);

export function buildNotifications(state = {}) {
  const items = [];
  const profileId = getActiveProfileId(state);
  const waterToday = filterByProfile(state.water, profileId).filter((w) => dayjs(w.createdAt).isToday());
  const mealsToday = filterByProfile(state.meals, profileId).filter((m) => dayjs(m.createdAt).isToday());
  const goal = getWaterGoal(state, profileId);
  const waterTotal = waterToday.reduce((sum, w) => sum + (w.amountMl || 0), 0);

  if (waterToday.length === 0) {
    items.push({
      id: 'water-start',
      tone: 'warning',
      title: 'Start hydrating',
      message: 'You have not logged water yet today.',
      to: '/app/water'
    });
  } else if (waterTotal < goal) {
    items.push({
      id: 'water-goal',
      tone: 'primary',
      title: 'Water goal in progress',
      message: `${waterTotal} / ${goal} ml logged today.`,
      to: '/app/water'
    });
  }

  if (mealsToday.length === 0) {
    items.push({
      id: 'meal-log',
      tone: 'warning',
      title: 'Log your first meal',
      message: 'Track breakfast or lunch to improve your nutrition score.',
      to: '/app/nutrition'
    });
  }

  const reminder = state.settings?.officeReminder;
  if (reminder && state.settings?.notifications !== false) {
    const [hour, minute] = reminder.split(':').map(Number);
    const now = dayjs();
    const target = now.hour(hour).minute(minute).second(0);
    if (now.isAfter(target) && mealsToday.length < 2) {
      items.push({
        id: 'office-reminder',
        tone: 'success',
        title: 'Office meal reminder',
        message: `Reminder set for ${reminder}. Consider a balanced lunch.`,
        to: '/app/nutrition'
      });
    }
  }

  const recentSymptom = state.symptoms?.[0];
  if (recentSymptom && dayjs(recentSymptom.createdAt).isToday() && !(state.dietPlans || []).length) {
    items.push({
      id: 'symptom-plan',
      tone: 'primary',
      title: 'Symptom follow-up',
      message: 'Generate or save a diet plan based on today’s symptom check.',
      to: '/app/symptoms'
    });
  }

  if (!items.length) {
    items.push({
      id: 'all-good',
      tone: 'success',
      title: 'You are on track',
      message: 'No urgent reminders right now. Keep up the good habits.',
      to: '/app'
    });
  }

  return items;
}
