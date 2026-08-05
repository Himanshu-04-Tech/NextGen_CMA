/**
 * NextGen CMA — Admin Login Page
 * Dedicated admin login UI matching the brand palette.
 * After validation, redirects to the Admin Dashboard.
 */

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ShieldAlert, Shield, Lock, ArrowLeft } from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/layouts/AuthLayout.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const AdminLoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await login({ identifier: data.email, password: data.password });
      if (res?.data?.user?.role !== 'ADMIN') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      toast.success('Admin Session Initiated');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Authentication failed. Please verify credentials.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      title="Console Access"
      subtitle="Authorized Personnel Only. Please identify yourself."
    >
      {/* Admin indicator banner */}
      <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
        <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-zinc-400 leading-relaxed">
          <strong className="text-red-300">Security Warning:</strong> All access attempts are monitored and logged. Unauthorized usage will be prosecuted.
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Email */}
        <Input
          id="email"
          label="Admin Email"
          type="email"
          placeholder="admin@nextgencma.com"
          leftIcon={<Shield size={15} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />

        {/* Password */}
        <Input
          id="password"
          label="Secure Key"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={15} />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Security key is required',
          })}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="purple" // Branded Purple for Admin Actions
          size="lg"
          isLoading={isSubmitting}
          className="w-full mt-2"
          leftIcon={<Shield size={16} />}
        >
          Authenticate Admin
        </Button>

        {/* Return link */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors duration-200 mt-2"
        >
          <ArrowLeft size={12} />
          Return to Student Login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default AdminLoginPage;
