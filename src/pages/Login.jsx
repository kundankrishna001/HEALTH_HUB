import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required')
});

export default function Login() {
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success(rememberMe ? 'Welcome back, session saved.' : 'Welcome back.');
      navigate('/app');
    } catch (error) {
      toast.error(error?.message || 'Sign in failed');
    }
  };

  return (
    <div className="stack">
      <div className="stack" style={{ gap: 8, marginBottom: 6 }}>
        <h2 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Sign in to your account</h2>
        <p className="muted" style={{ margin: 0 }}>
          Continue to your dashboard, meal planner, symptom checker, and all connected health modules.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="stack">
        <TextField
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
          helperText="Use the email attached to your account."
        />
        <label className="field">
          <span>Password</span>
          <div style={{ position: 'relative' }}>
            <FiLock style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              autoComplete="current-password"
              {...register('password')}
              style={{ paddingLeft: 42, paddingRight: 46 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="btn-link"
              style={{
                position: 'absolute',
                right: 6,
                top: 6,
                padding: 8,
                borderRadius: 12,
                background: 'transparent',
                border: 'none'
              }}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password ? <span style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.password.message}</span> : null}
        </label>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 14 }}>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ width: 16, height: 16 }} />
            Remember me
          </label>
          <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Forgot password?
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <PrimaryButton type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </PrimaryButton>
          <PrimaryButton 
            type="button" 
            variant="ghost" 
            style={{ width: '100%', background: 'color-mix(in srgb, var(--primary) 10%, transparent)', color: 'var(--primary)', border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)' }}
            onClick={async () => {
              try {
                await loginDemo();
                toast.success('Logged in as Demo User');
                navigate('/app');
              } catch (error) {
                toast.error('Failed to log in as demo user');
              }
            }}
          >
            Try Demo
          </PrimaryButton>
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="muted">No account yet?</span>
        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 800 }}>
          Create account
        </Link>
      </div>
    </div>
  );
}
