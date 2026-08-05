/**
 * NextGen CMA — Reset Password Page
 * Validates the 6-digit OTP code and updates the password.
 */

import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { KeyRound, Mail, Lock, Check, ShieldCheck } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/layouts/AuthLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Try to grab pre-filled email from routing state
  const defaultEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: defaultEmail,
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      toast.success('Security password updated successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Verification failed. Please check the code.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Complete password recovery using the code sent to your inbox."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Email */}
        <Input
          id="email"
          label="Verification Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />

        {/* OTP Code */}
        <Input
          id="otp"
          label="Verification Code (OTP)"
          type="text"
          placeholder="123456"
          maxLength={6}
          leftIcon={<ShieldCheck size={15} />}
          error={errors.otp?.message}
          hint="6-digit verification code"
          {...register('otp', {
            required: 'Verification code is required',
            pattern: {
              value: /^\d{6}$/,
              message: 'OTP must be exactly 6 digits',
            },
          })}
        />

        {/* New Password */}
        <Input
          id="newPassword"
          label="New Password"
          type="password"
          placeholder="Min 8 characters"
          leftIcon={<Lock size={15} />}
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
              message: 'Must include uppercase, lowercase, a number, and a special character (@$!%*?&#)',
            },
          })}
        />

        {/* Confirm New Password */}
        <Input
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Repeat new password"
          leftIcon={<Lock size={15} />}
          error={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword', {
            required: 'Please confirm your new password',
            validate: (val) => val === newPassword || 'Passwords do not match',
          })}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
          leftIcon={<Check size={16} />}
        >
          Update Password
        </Button>

        {/* Back Link */}
        <div className="text-center mt-2">
          <Link
            to="/login"
            className="text-xs text-zinc-500 hover:text-white transition-colors duration-200"
          >
            Cancel and Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
