import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Edit2,
  Check,
  X,
  Camera,
  LogOut,
  Shield,
  Lock
} from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import MentorProfileView from '../components/profile/MentorProfileView.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();

  // If user is a MENTOR, redirect rendering completely to the MentorProfileView component
  if (user?.role === 'MENTOR') {
    return <MentorProfileView />;
  }

  // Student profile state & forms
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage || '');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      cmaLevel: user?.cmaLevel || '',
      targetAttempt: user?.targetAttempt || '',
      profileImage: user?.profileImage || '',
    },
  });

  // Password reset sub-form for student settings
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: errorsPass, isSubmitting: isSubmittingPass },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        cmaLevel: data.cmaLevel || null,
        targetAttempt: data.targetAttempt || null,
        profileImage: data.profileImage || null,
      };

      await updateProfile(payload);
      setIsEditing(false);
      toast.success('Profile details updated successfully');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update profile details.';
      toast.error(msg);
    }
  };

  const handlePasswordSubmit = async (data) => {
    try {
      await updateProfile({ password: data.newPassword });
      toast.success('Account password updated successfully');
      resetPass();
    } catch (err) {
      toast.error('Failed to change password');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setValue('profileImage', reader.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      phone: user?.phone || '',
      cmaLevel: user?.cmaLevel || '',
      targetAttempt: user?.targetAttempt || '',
      profileImage: user?.profileImage || '',
    });
    setAvatarPreview(user?.profileImage || '');
    setIsEditing(false);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1618005198143-d36674c1f8a1?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=150&q=80',
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-left">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-gold/[0.03] blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-800 border-2 border-brand-gold overflow-hidden flex items-center justify-center text-brand-gold font-bold shadow-gold-glow">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={36} />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-display text-white">
                {user?.name}
              </h1>
              {user?.role === 'ADMIN' && (
                <span className="px-2 py-0.5 rounded bg-brand-purple/20 border border-brand-purple/50 text-[10px] text-brand-purple-light font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Shield size={10} /> Admin
                </span>
              )}
            </div>
            <p className="text-zinc-500 text-sm mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-brand-border text-xs text-zinc-300">
                Level: {user?.cmaLevel || 'Not Configured'}
              </span>
              {user?.targetAttempt && (
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-brand-border text-xs text-zinc-300">
                  Target: {user.targetAttempt}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit2 size={14} />}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                leftIcon={<X size={14} />}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
                leftIcon={<Check size={14} />}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column — Profile Info Form */}
        <div className="md:col-span-2 space-y-6">
          <Card accentColor={isEditing ? 'gold' : 'none'} padding="default">
            <h2 className="text-base font-bold font-display text-white mb-6 border-b border-brand-border/60 pb-3 flex items-center gap-2">
              <User size={18} className="text-brand-gold" /> Personal Details
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                id="name"
                label="Full Name"
                disabled={!isEditing}
                leftIcon={<User size={15} />}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                      <Mail size={15} />
                    </span>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-brand-dark/30 border border-brand-border/40 rounded-lg pl-10 pr-4 py-3 text-zinc-500 cursor-not-allowed outline-none font-sans text-sm"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-650 mt-1 block">
                    Account email is used for verification and logins.
                  </span>
                </div>

                <Input
                  id="phone"
                  label="Phone Number"
                  disabled={!isEditing}
                  leftIcon={<Phone size={15} />}
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Enter a valid Indian mobile number',
                    },
                  })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cmaLevel" className="form-label">
                    CMA Level
                  </label>
                  <select
                    id="cmaLevel"
                    disabled={!isEditing}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    {...register('cmaLevel')}
                  >
                    <option value="" disabled className="bg-brand-card text-zinc-500">
                      Select CMA Level
                    </option>
                    <option value="FOUNDATION" className="bg-brand-card text-white">
                      Foundation
                    </option>
                    <option value="INTER" className="bg-brand-card text-white">
                      Intermediate
                    </option>
                    <option value="FINAL" className="bg-brand-card text-white">
                      Final
                    </option>
                  </select>
                </div>

                <Input
                  id="targetAttempt"
                  label="Target Attempt"
                  disabled={!isEditing}
                  placeholder="e.g. Dec 2026"
                  leftIcon={<Calendar size={15} />}
                  error={errors.targetAttempt?.message}
                  {...register('targetAttempt')}
                />
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-brand-border/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="form-label">Choose Abstract Avatar or Upload Photo</label>
                    <label className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-brand-border hover:border-brand-gold/60 text-xs font-semibold text-zinc-300 rounded-xl cursor-pointer transition-all">
                      <Camera size={14} className="text-brand-gold" />
                      <span>Upload from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {avatarPresets.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarPreview(url);
                          setValue('profileImage', url, { shouldDirty: true });
                        }}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 active:scale-95 ${
                          avatarPreview === url ? 'border-brand-gold scale-105' : 'border-brand-border'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Right column — Side Actions & Settings */}
        <div className="space-y-6">
          {/* Change Password settings block */}
          <Card>
            <h3 className="text-xs font-bold font-display text-white mb-4 tracking-wider uppercase">
              Update Password
            </h3>
            
            <form onSubmit={handleSubmitPass(handlePasswordSubmit)} className="space-y-4">
              <Input
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={15} />}
                error={errorsPass.newPassword?.message}
                {...registerPass('newPassword', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              <Button
                type="submit"
                variant="gold"
                size="sm"
                className="w-full"
                isLoading={isSubmittingPass}
              >
                Change Password
              </Button>
            </form>
          </Card>

          {/* Account Control Card */}
          <Card>
            <h3 className="text-xs font-bold font-display text-white mb-4 tracking-wider uppercase">
              Account Control
            </h3>
            <div className="space-y-3">
              {user?.role === 'ADMIN' && (
                <a href="/admin/dashboard" className="block w-full text-center">
                  <Button variant="purple" className="w-full" leftIcon={<Shield size={16} />}>
                    Admin Console
                  </Button>
                </a>
              )}

              <Button
                variant="danger"
                className="w-full"
                onClick={logout}
                leftIcon={<LogOut size={16} />}
              >
                Log Out Session
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
