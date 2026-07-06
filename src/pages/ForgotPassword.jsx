import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FiMail } from 'react-icons/fi';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required')
});

export default function ForgotPassword() {
  const { sendResetEmail } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      const response = await sendResetEmail(email);
      toast.success(response?.message || 'If an account exists, a reset link has been sent.');
      if (response?.resetLink) {
        toast.info('Development reset link copied to clipboard');
        await navigator.clipboard.writeText(response.resetLink);
      }
    } catch (error) {
      toast.error(error?.message || 'Unable to create reset link');
    }
  };

  return (
    <div className="stack">
      <div className="stack" style={{ gap: 8, marginBottom: 6 }}>
        <div className="auth-chip" style={{ width: 'fit-content' }}>
          <FiMail />
          <span>Reset access</span>
        </div>
        <h2 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Forgot your password?</h2>
        <p className="muted" style={{ margin: 0 }}>
          We’ll generate a secure reset link for your account.
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
        />
        <PrimaryButton type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </PrimaryButton>
      </form>
    </div>
  );
}
