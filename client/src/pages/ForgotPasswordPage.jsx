/**
 * NextGen CMA — Forgot Password Page
 * Requests the registered email address to trigger a 6-digit OTP code.
 * Switches to a success instructions screen upon API confirmation.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { KeyRound, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/layouts/AuthLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast.success('OTP sent successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle={`We've dispatched a secure 6-digit OTP to ${submittedEmail}.`}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shadow-gold-glow animate-bounce">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-2">
            <p className="text-zinc-300 text-sm leading-relaxed">
              Didn't get the email? Remember to inspect your spam folder. 
              The validation token is valid for 15 minutes.
            </p>
          </div>

          <Button
            variant="gold"
            className="w-full mt-2"
            onClick={() => navigate('/reset-password', { state: { email: submittedEmail } })}
          >
            Enter Verification Code
          </Button>

          <button
            onClick={() => setIsSuccess(false)}
            className="text-xs text-zinc-500 hover:text-white transition-colors duration-200"
          >
            Resend Email or Try Different Address
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Input your registered email to request a validation code."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Email */}
        <Input
          id="email"
          label="Registered Email"
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

        {/* Submit */}
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
          leftIcon={<Send size={15} />}
        >
          Send One-Time Password
        </Button>

        {/* Back Link */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors duration-200 mt-2"
        >
          <ArrowLeft size={12} />
          Back to Sign In
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
