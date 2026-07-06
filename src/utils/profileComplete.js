export function isProfileComplete(user) {
  if (!user) return false;

  const age = Number(user.age);
  const heightCm = Number(user.heightCm);
  const weightKg = Number(user.weightKg);
  const goal = typeof user.goal === 'string' ? user.goal.trim() : '';

  return Boolean(
    user.name?.trim() &&
    goal &&
    Number.isFinite(age) &&
    age > 0 &&
    Number.isFinite(heightCm) &&
    heightCm >= 50 &&
    Number.isFinite(weightKg) &&
    weightKg >= 10
  );
}
