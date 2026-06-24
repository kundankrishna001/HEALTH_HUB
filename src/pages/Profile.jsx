import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import TextField from '../components/ui/TextField';
import TextareaField from '../components/ui/TextareaField';
import Badge from '../components/ui/Badge';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useApp } from '../context/AppContext';
import { bmiCategory, calculateBMI } from '../utils/calculations';

const schema = yup.object({
  name: yup.string().required(),
  age: yup.number().min(1).required(),
  heightCm: yup.number().min(50).required(),
  weightKg: yup.number().min(10).required(),
  goal: yup.string().required()
});

export default function Profile() {
  const { state, updateProfile } = useApp();
  const bmi = useMemo(() => calculateBMI(state?.user?.heightCm, state?.user?.weightKg), [state]);
  const defaults = useMemo(
    () => ({
      ...state?.user,
      conditions: Array.isArray(state?.user?.conditions) ? state.user.conditions.join(', ') : state?.user?.conditions ?? '',
      preferences: Array.isArray(state?.user?.preferences) ? state.user.preferences.join(', ') : state?.user?.preferences ?? ''
    }),
    [state?.user]
  );
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaults
  });

  useEffect(() => {
    if (state?.user) reset(defaults);
  }, [defaults, reset, state?.user]);

  const onSubmit = async (values) => {
    await updateProfile(values);
    toast.success('Profile saved');
  };

  const liveBmi = calculateBMI(watch('heightCm'), watch('weightKg'));

  return (
    <div className="page-grid">
      <PageHeader title="Profile" subtitle="Basic info, health info, and preferences with auto BMI calculation." />
      <div className="grid-2">
        <SectionCard title="Profile setup" subtitle="Keep the health engine accurate">
          <form onSubmit={handleSubmit(onSubmit)} className="grid-2" style={{ gap: 14 }}>
            <TextField label="Full name" {...register('name')} error={errors.name?.message} />
            <TextField label="Email" {...register('email')} error={errors.email?.message} />
            <TextField label="Age" type="number" {...register('age')} error={errors.age?.message} />
            <TextField label="Phone" {...register('phone')} error={errors.phone?.message} />
            <TextField label="Height (cm)" type="number" {...register('heightCm')} error={errors.heightCm?.message} />
            <TextField label="Weight (kg)" type="number" {...register('weightKg')} error={errors.weightKg?.message} />
            <TextareaField label="Conditions" {...register('conditions')} helperText="Comma-separated conditions are fine." />
            <TextareaField label="Preferences" {...register('preferences')} helperText="Enter food style, restrictions, and goals." />
            <TextareaField label="Goal" {...register('goal')} error={errors.goal?.message} />
            <div style={{ gridColumn: '1 / -1' }}>
              <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save profile'}</PrimaryButton>
            </div>
          </form>
        </SectionCard>
        <SectionCard title="BMI insight" subtitle="Auto-calculated from your profile">
          <div style={{ display: 'grid', gap: 12 }}>
            <Badge tone="primary">BMI: {liveBmi ?? bmi ?? '--'}</Badge>
            <Badge tone="success">Category: {bmiCategory(liveBmi ?? bmi)}</Badge>
            <p className="muted">
              This value updates instantly when height or weight changes and is used by meal, symptom, and food advice.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
