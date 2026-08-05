/**
 * NextGen CMA — Register Page
 * Student self-registration with real-time validation.
 */

import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Phone, Lock } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/layouts/AuthLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const RegisterPage = () => {
  const { register: authRegister, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const targetRedirect = location.state?.redirectTo || location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const password = watch('password');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(targetRedirect, { replace: true });
  }, [isAuthenticated, navigate, targetRedirect]);

  const onSubmit = async (data) => {
    try {
      await authRegister({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Account created! Welcome to NextGen CMA 🎓');
      navigate(targetRedirect, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of CMA aspirants on the NextGen platform."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Full Name */}
        <Input
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          leftIcon={<User size={15} />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
          })}
        />

        {/* Email */}
        <Input
          id="email"
          label="Email Address"
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

        {/* Phone */}
        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="9876543210"
          leftIcon={<Phone size={15} />}
          error={errors.phone?.message}
          hint="10-digit Indian mobile number"
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: 'Enter a valid 10-digit Indian mobile number',
            },
          })}
        />

        {/* Password */}
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Min 8 characters"
          leftIcon={<Lock size={15} />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
              message: 'Must include uppercase, lowercase, a number, and a special character (@$!%*?&#)',
            },
          })}
        />

        {/* Confirm Password */}
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          leftIcon={<Lock size={15} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          })}
        />

        {/* Password strength hint */}
        <p className="text-xs text-zinc-600 leading-relaxed -mt-2">
          Use at least 8 characters with uppercase, lowercase, a number, and a special character (@$!%*?&#).
        </p>

        {/* Submit */}
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
          leftIcon={<UserPlus size={16} />}
        >
          Create Account
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-zinc-600 text-xs">Already a member?</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        <Link to="/login" className="block">
          <Button variant="outline" className="w-full">
            Sign In Instead
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
