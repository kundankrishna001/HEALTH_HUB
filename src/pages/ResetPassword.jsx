import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock } from 'react-icons/fi';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import { resetPassword } from '../services/authService';

const schema = yup.object({
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password')
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ password }) => {
    if (!token) {
      toast.error('Reset link is invalid or missing a token.');
      return;
    }

    try {
      await resetPassword({ token, password });
      toast.success('Password updated. You can sign in now.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.message || 'Unable to reset password');
    }
  };

  return (
    <div className="stack">
      <div className="stack" style={{ gap: 8, marginBottom: 6 }}>
        <div className="auth-chip" style={{ width: 'fit-content' }}>
          <FiLock />
          <span>New password</span>
        </div>
        <h2 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Set a new password</h2>
        <p className="muted" style={{ margin: 0 }}>
          Choose a strong password for your Health Hub account.
        </p>
      </div>

      {!token ? (
        <p className="muted">
          This reset link is invalid. Request a new one from the{' '}
          <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            forgot password
          </Link>{' '}
          page.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="stack">
          <TextField
            label="New password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />
          <TextField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <PrimaryButton type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
            {isSubmitting ? 'Updating...' : 'Update password'}
          </PrimaryButton>
        </form>
      )}
    </div>
  );
}
