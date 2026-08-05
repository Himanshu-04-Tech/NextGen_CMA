import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Globe,
  Linkedin,
  Clock,
  BookOpen,
  Award,
  Video,
  Lock,
  Camera
} from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

const MentorProfileView = () => {
  const { user, updateProfile } = useAuth();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage || '');
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
  });

  const fetchMentorProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mentors/my-profile');
      const data = res.data.data;
      setMentorData(data);

      // Hydrate form values
      if (data) {
        reset({
          name: user?.name || '',
          phone: user?.phone || '',
          fullName: data.fullName || '',
          bio: data.bio || '',
          specialization: data.specialization || '',
          experience: data.experience || 0,
          qualification: data.qualification || '',
          subjects: data.subjects || '',
          teachingStyle: data.teachingStyle || '',
          languages: data.languages || '',
          meetingPlatforms: data.meetingPlatforms || 'GOOGLE_MEET',
          responseTime: data.responseTime || '< 2 hours',
          linkedinUrl: data.linkedinUrl || '',
          websiteUrl: data.websiteUrl || '',
          professionalEmail: data.professionalEmail || '',
          certificates: data.certificates || '',
          achievements: data.achievements || '',
          profileImage: data.profileImage || user?.profileImage || '',
        });
        setAvatarPreview(data.profileImage || user?.profileImage || '');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load mentor profile details.');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchMentorProfile();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      // 1. Update basic user credentials (name, phone)
      await updateProfile({
        name: data.name,
        phone: data.phone,
        profileImage: data.profileImage,
      });

      // 2. Update extended mentor profile fields
      if (mentorData) {
        const payload = {
          fullName: data.fullName,
          bio: data.bio,
          profileImage: data.profileImage,
          specialization: data.specialization,
          experience: parseInt(data.experience, 10),
          qualification: data.qualification,
          subjects: data.subjects || null,
          teachingStyle: data.teachingStyle || null,
          languages: data.languages || null,
          meetingPlatforms: data.meetingPlatforms || null,
          responseTime: data.responseTime || null,
          linkedinUrl: data.linkedinUrl || null,
          websiteUrl: data.websiteUrl || null,
          professionalEmail: data.professionalEmail || null,
          certificates: data.certificates || null,
          achievements: data.achievements || null,
        };

        await api.put(`/admin/mentors/${mentorData.id}`, payload);
      }

      setIsEditing(false);
      toast.success('Mentor profile details updated successfully');
      fetchMentorProfile();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update mentor profile.';
      toast.error(msg);
    }
  };

  // Change Password Form handler
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: errorsPass, isSubmitting: isSubmittingPass },
  } = useForm();

  const onChangePasswordSubmit = async (data) => {
    try {
      await updateProfile({ password: data.newPassword });
      toast.success('Password updated successfully');
      resetPass();
    } catch (err) {
      toast.error('Failed to change password');
    }
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1618005198143-d36674c1f8a1?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=150&q=80',
  ];

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center text-xs">Loading mentor profile view...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-850 border-2 border-brand-gold overflow-hidden flex items-center justify-center text-brand-gold font-bold shadow-gold-glow">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <User size={36} />
              )}
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold font-display text-white">{mentorData?.fullName || user?.name}</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/30 text-xs text-brand-purple-light">
                {mentorData?.specialization || 'Mentor Specialization'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-brand-border text-xs text-zinc-400">
                {mentorData?.experience || 0} Years Exp
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); reset(); }}>
                Cancel
              </Button>
              <Button variant="gold" size="sm" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
                Save Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: General Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <Card padding="default">
            <h2 className="text-base font-bold font-display text-white mb-6 border-b border-brand-border/60 pb-3 flex items-center gap-2">
              <Briefcase size={18} className="text-brand-gold" /> Mentor Details
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  id="name"
                  label="Display Name"
                  disabled={!isEditing}
                  leftIcon={<User size={15} />}
                  error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />
                <Input
                  id="phone"
                  label="Phone Number"
                  disabled={!isEditing}
                  leftIcon={<Phone size={15} />}
                  error={errors.phone?.message}
                  {...register('phone', { required: 'Phone is required' })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  id="fullName"
                  label="Professional Full Name"
                  disabled={!isEditing}
                  leftIcon={<User size={15} />}
                  error={errors.fullName?.message}
                  {...register('fullName', { required: 'Full name is required' })}
                />
                <Input
                  id="professionalEmail"
                  label="Professional Contact Email"
                  disabled={!isEditing}
                  leftIcon={<Mail size={15} />}
                  error={errors.professionalEmail?.message}
                  {...register('professionalEmail')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  id="specialization"
                  label="Specialization"
                  disabled={!isEditing}
                  leftIcon={<Briefcase size={15} />}
                  error={errors.specialization?.message}
                  {...register('specialization', { required: 'Specialization is required' })}
                />
                <Input
                  id="qualification"
                  label="Qualifications (e.g. CMA, CS)"
                  disabled={!isEditing}
                  leftIcon={<GraduationCap size={15} />}
                  error={errors.qualification?.message}
                  {...register('qualification', { required: 'Qualification is required' })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  id="experience"
                  label="Years of Experience"
                  type="number"
                  disabled={!isEditing}
                  leftIcon={<Clock size={15} />}
                  error={errors.experience?.message}
                  {...register('experience', { required: 'Experience is required' })}
                />
                <Input
                  id="responseTime"
                  label="Typical Response Time"
                  disabled={!isEditing}
                  leftIcon={<Clock size={15} />}
                  error={errors.responseTime?.message}
                  {...register('responseTime')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Meeting Platforms</label>
                  <select
                    disabled={!isEditing}
                    className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold text-xs"
                    {...register('meetingPlatforms')}
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="OFFLINE">Offline Call</option>
                  </select>
                </div>
                <Input
                  id="languages"
                  label="Spoken Languages"
                  placeholder="e.g. English, Hindi"
                  disabled={!isEditing}
                  leftIcon={<Globe size={15} />}
                  error={errors.languages?.message}
                  {...register('languages')}
                />
              </div>

              <Input
                id="subjects"
                label="Taught CMA Subjects"
                placeholder="e.g. Strategic Financial Management, Cost Auditing"
                disabled={!isEditing}
                leftIcon={<BookOpen size={15} />}
                error={errors.subjects?.message}
                {...register('subjects')}
              />

              <div className="space-y-2">
                <label className="form-label">Biography</label>
                <textarea
                  disabled={!isEditing}
                  rows={3}
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold text-xs"
                  {...register('bio', { required: 'Biography is required' })}
                />
                {errors.bio && <p className="text-xs text-red-400 mt-1">{errors.bio.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  id="certificates"
                  label="Certificates"
                  placeholder="Certificates links or names"
                  disabled={!isEditing}
                  leftIcon={<Award size={15} />}
                  error={errors.certificates?.message}
                  {...register('certificates')}
                />
                <Input
                  id="achievements"
                  label="Achievements"
                  placeholder="e.g. All India Rank, 10+ Years Teaching"
                  disabled={!isEditing}
                  leftIcon={<Award size={15} />}
                  error={errors.achievements?.message}
                  {...register('achievements')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  id="linkedinUrl"
                  label="LinkedIn URL"
                  disabled={!isEditing}
                  leftIcon={<Linkedin size={15} />}
                  error={errors.linkedinUrl?.message}
                  {...register('linkedinUrl')}
                />
                <Input
                  id="websiteUrl"
                  label="Website URL"
                  disabled={!isEditing}
                  leftIcon={<Globe size={15} />}
                  error={errors.websiteUrl?.message}
                  {...register('websiteUrl')}
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

        {/* Right Side: Account Settings & Password Reset */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-xs font-bold font-display text-white mb-4 tracking-wider uppercase">
              Update Account Password
            </h3>
            
            <form onSubmit={handleSubmitPass(onChangePasswordSubmit)} className="space-y-4">
              <Input
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={15} />}
                error={errorsPass.newPassword?.message}
                {...registerPass('newPassword', {
                  required: 'New password is required',
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

          <Card>
            <h3 className="text-xs font-bold font-display text-white mb-4 tracking-wider uppercase">
              Profile Summary metrics
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-brand-border/40">
                <span className="text-zinc-500 font-semibold">Total Rating:</span>
                <span className="text-brand-gold font-bold">{mentorData?.rating || 5.0} ★</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-brand-border/40">
                <span className="text-zinc-500 font-semibold">Availability slots:</span>
                <span className="text-white font-bold">{mentorData?.availabilities?.length || 0} Slots</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-zinc-500 font-semibold">Response Time:</span>
                <span className="text-brand-purple-light font-bold">{mentorData?.responseTime || '< 2 hours'}</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default MentorProfileView;
