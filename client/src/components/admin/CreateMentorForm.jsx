import React, { useState, useEffect } from 'react';
import { Mail, Phone, Lock, BookOpen, GraduationCap, Briefcase, Image, User } from 'lucide-react';

const CreateMentorForm = ({ onSubmit, initialData = null, isSubmitting = false }) => {
  const isEditMode = !!initialData;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState(5);
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState(null);

  // Populate data if editing
  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || '');
      setEmail(initialData.user?.email || '');
      setPhone(initialData.user?.phone || '');
      setSpecialization(initialData.specialization || '');
      setQualification(initialData.qualification || '');
      setExperience(initialData.experience || 5);
      setProfileImage(initialData.profileImage || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError('Full name is required');
    if (!email.trim()) return setError('Email address is required');
    if (!phone.trim()) return setError('Phone number is required');
    if (!isEditMode && !password) return setError('Password is required to create a new account');
    if (!specialization.trim()) return setError('Specialization field is required');
    if (!qualification.trim()) return setError('Qualification details are required');

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      qualification: qualification.trim(),
      experience: Number(experience),
      profileImage: profileImage.trim() || null,
    };

    if (!isEditMode) {
      payload.password = password;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="E.g., CA Harish Sharma"
              className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
            />
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mentor@nextgencma.com"
              className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
            />
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Phone */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wider block">Phone Number (10 digits)</label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="7654321098"
              maxLength={10}
              className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
            />
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        {/* Password (only in create mode) */}
        {!isEditMode && (
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
              />
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Specialization */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wider block">Specialization / Expertise</label>
          <div className="relative">
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="E.g., Business Laws & Ethics"
              className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
            />
            <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        {/* Qualification */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wider block">Qualifications</label>
          <div className="relative">
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="E.g., CA, CS, LL.B"
              className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
            />
            <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Experience slider */}
        <div className="space-y-2 bg-white/5 border border-brand-border rounded-xl p-3">
          <div className="flex justify-between items-center text-[10px]">
            <label className="font-bold text-zinc-400 uppercase tracking-wider">Years of Experience</label>
            <span className="font-black text-brand-gold font-display leading-none">{experience} Years</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-gold"
          />
        </div>

        {/* Profile Image url */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-400 uppercase tracking-wider block">Profile Photo URL (Optional)</label>
          <div className="relative">
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://images.unsplash.com/...photo"
              className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
            />
            <Image size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-2.5 text-[11px] font-semibold bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-black font-black font-display tracking-wider uppercase hover:scale-[1.01] active:scale-100 disabled:opacity-55 shadow-gold-glow transition-all"
        >
          {isSubmitting ? 'Saving Account...' : isEditMode ? 'Update Mentor Profile' : 'Register Mentor Profile'}
        </button>
      </div>
    </form>
  );
};

export default CreateMentorForm;
