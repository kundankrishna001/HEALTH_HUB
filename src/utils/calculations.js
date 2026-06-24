export const calculateBMI = (heightCm, weightKg) => {
  const heightM = Number(heightCm) / 100;
  const weight = Number(weightKg);
  if (!heightM || !weight) return null;
  const bmi = weight / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const bmiCategory = (bmi) => {
  if (bmi == null) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
