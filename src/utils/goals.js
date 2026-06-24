import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { filterByProfile, getActiveProfileId } from './profileScope';

dayjs.extend(isToday);

export function getGoals(state) {
  return {
    weightTarget: state?.settings?.goals?.weightTarget ?? 70,
    stepsTarget: state?.settings?.goals?.stepsTarget ?? 8000,
    sleepTarget: state?.settings?.goals?.sleepTarget ?? 8
  };
}

export function getLatestMetric(metrics = [], type) {
  return metrics.find((item) => item.type === type) || null;
}

export function getTodayMetric(metrics = [], type) {
  return metrics.find((item) => item.type === type && dayjs(item.createdAt).isToday()) || null;
}

export function getProfileMetrics(state) {
  const profileId = getActiveProfileId(state);
  return filterByProfile(state?.metrics || [], profileId);
}

export function getGoalProgress(state) {
  const goals = getGoals(state);
  const metrics = getProfileMetrics(state);
  const weight = getLatestMetric(metrics, 'weight');
  const steps = getTodayMetric(metrics, 'steps') || getLatestMetric(metrics, 'steps');
  const sleep = getTodayMetric(metrics, 'sleep') || getLatestMetric(metrics, 'sleep');

  const currentWeight = Number(state?.user?.weightKg) || Number(weight?.value) || null;

  return {
    weight: {
      current: currentWeight,
      target: goals.weightTarget,
      progress: currentWeight ? Math.min(100, Math.round((goals.weightTarget / currentWeight) * 100)) : 0
    },
    steps: {
      current: Number(steps?.value) || 0,
      target: goals.stepsTarget,
      progress: Math.min(100, Math.round(((Number(steps?.value) || 0) / goals.stepsTarget) * 100))
    },
    sleep: {
      current: Number(sleep?.value) || 0,
      target: goals.sleepTarget,
      progress: Math.min(100, Math.round(((Number(sleep?.value) || 0) / goals.sleepTarget) * 100))
    }
  };
}
