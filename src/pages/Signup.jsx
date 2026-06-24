import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  name: yup.string().min(2, 'Enter your full name').required('Name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required')
});

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await signup(values);
      toast.success('Account created successfully');
      // New users must complete profile first
      navigate('/app/profile');
    } catch (error) {
      toast.error(error?.message || 'Account creation failed');
    }
  };

  return (
    <div className="stack">
      <div className="stack" style={{ gap: 8, marginBottom: 6 }}>
        <div className="auth-chip" style={{ width: 'fit-content' }}>
          <FiUser />
          <span>Create your profile</span>
        </div>
        <h2 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Create your account</h2>
        <p className="muted" style={{ margin: 0 }}>
          Set up your wellness workspace with secure access and reusable profile data.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="stack">
        <TextField
          label="Full name"
          placeholder="Aarav Mehta"
          autoComplete="name"
          {...register('name')}
          error={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <label className="field">
          <span>Password</span>
          <div style={{ position: 'relative' }}>
            <FiLock style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
            <input
              type="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              {...register('password')}
              style={{ paddingLeft: 42 }}
            />
          </div>
          {errors.password ? <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.password.message}</span> : null}
        </label>

        <div className="auth-chip" style={{ alignItems: 'flex-start' }}>
          <FiMail style={{ marginTop: 2 }} />
          <span style={{ fontSize: 13, lineHeight: 1.6 }}>
            Your account and app state are saved in MySQL.
          </span>
        </div>

        <PrimaryButton type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </PrimaryButton>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="muted">Already have an account?</span>
        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
