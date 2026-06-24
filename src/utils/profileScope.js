import dayjs from 'dayjs';

export const SELF_PROFILE_ID = 'self';

export function getActiveProfileId(state) {
  return state?.settings?.activeProfileId || SELF_PROFILE_ID;
}

export function getProfileOptions(state) {
  const options = [
    {
      id: SELF_PROFILE_ID,
      name: state?.user?.name || 'Me',
      relation: 'Primary'
    }
  ];

  for (const member of state?.family || []) {
    options.push({
      id: member.id,
      name: member.name,
      relation: member.relation || 'Family'
    });
  }

  return options;
}

export function getActiveProfileLabel(state) {
  const activeId = getActiveProfileId(state);
  return getProfileOptions(state).find((item) => item.id === activeId)?.name || 'Me';
}

export function filterByProfile(items = [], profileId) {
  return items.filter((item) => (item.profileId || SELF_PROFILE_ID) === profileId);
}

export function getWaterGoal(state, profileId = getActiveProfileId(state)) {
  const custom = state?.settings?.profileWaterGoals?.[profileId];
  if (custom) return custom;

  if (profileId === SELF_PROFILE_ID) {
    return state?.settings?.dailyWaterGoal || 2800;
  }

  const member = (state?.family || []).find((item) => item.id === profileId);
  if (member?.dailyWaterGoal) return Number(member.dailyWaterGoal);

  const age = Number(member?.age);
  if (age > 0 && age < 13) return 1800;
  if (age >= 13 && age < 18) return 2200;
  return 2400;
}

export function getTodayWaterTotal(state, profileId) {
  const today = dayjs().format('YYYY-MM-DD');
  return filterByProfile(state?.water, profileId)
    .filter((item) => dayjs(item.createdAt).format('YYYY-MM-DD') === today)
    .reduce((sum, item) => sum + (item.amountMl || 0), 0);
}

export function getMemberStats(state, profileId) {
  const meals = filterByProfile(state?.meals, profileId);
  const water = filterByProfile(state?.water, profileId);
  const metrics = filterByProfile(state?.metrics, profileId);

  return {
    mealsCount: meals.length,
    waterTotal: water.reduce((sum, item) => sum + (item.amountMl || 0), 0),
    todayWater: getTodayWaterTotal(state, profileId),
    waterGoal: getWaterGoal(state, profileId),
    latestWeight: metrics.find((item) => item.type === 'weight')?.value ?? null,
    latestSteps: metrics.find((item) => item.type === 'steps')?.value ?? null,
    latestSleep: metrics.find((item) => item.type === 'sleep')?.value ?? null
  };
}
