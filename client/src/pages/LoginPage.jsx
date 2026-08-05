/**
 * NextGen CMA — Login Page
 * Supports login via Email or Phone + Password.
 * Includes Remember Me (persists identifier) and Forgot Password link.
 */

import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LogIn, AtSign, Lock } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/layouts/AuthLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.redirectTo || location.state?.from?.pathname || '/dashboard';

  const savedIdentifier = localStorage.getItem('nextgen_remember') || '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      identifier: savedIdentifier,
      rememberMe: !!savedIdentifier,
    },
  });

  const rememberMe = watch('rememberMe');

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    try {
      // Remember Me persistence
      if (data.rememberMe) {
        localStorage.setItem('nextgen_remember', data.identifier);
      } else {
        localStorage.removeItem('nextgen_remember');
      }

      await login({ identifier: data.identifier, password: data.password });
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your email or phone number to continue."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Identifier */}
        <Input
          id="identifier"
          label="Email or Phone"
          type="text"
          placeholder="you@example.com or 9876543210"
          leftIcon={<AtSign size={15} />}
          error={errors.identifier?.message}
          {...register('identifier', {
            required: 'Email or phone number is required',
            validate: (val) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const phoneRegex = /^[6-9]\d{9}$/;
              return emailRegex.test(val) || phoneRegex.test(val)
                ? true
                : 'Enter a valid email address or 10-digit phone number';
            },
          })}
        />

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="form-label mb-0">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            leftIcon={<Lock size={15} />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />
        </div>

        {/* Remember Me */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register('rememberMe')}
            />
            <div className="w-4 h-4 rounded border border-brand-border bg-black/40 peer-checked:bg-brand-gold peer-checked:border-brand-gold transition-all duration-200 flex items-center justify-center">
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-zinc-400 group-hover:text-white transition-colors duration-200">
            Remember me
          </span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
          leftIcon={<LogIn size={16} />}
        >
          Sign In
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-zinc-600 text-xs">New to NextGen?</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        <Link to="/register" className="block">
          <Button variant="outline" className="w-full">
            Create an Account
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
