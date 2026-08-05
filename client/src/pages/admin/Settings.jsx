import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Sliders, KeyRound, Lock } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in all password fields');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setSaving(true);
    try {
      // Use existing update password or profile credentials API
      await api.put('/auth/profile', {
        oldPassword,
        newPassword,
      });
      toast.success('Governance password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto text-xs">
        {/* Title */}
        <div>
          <h1 className="text-xl font-black text-white font-display uppercase tracking-wider">
            Governance Console Settings
          </h1>
          <p className="text-xs text-zinc-400">
            Verify permission matrices, change credentials, and manage panel preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Permissions Matrix */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Sliders size={14} className="text-brand-gold" />
              Your Role Permissions
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-zinc-500 font-bold block mb-1">CURRENT ROLE:</span>
                <span className="px-2.5 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[9px] font-black uppercase tracking-wider">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block mb-1.5">ENABLED POLICIES:</span>
                <div className="flex flex-wrap gap-1.5">
                  {user?.permissions?.map((perm) => (
                    <span key={perm} className="px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple uppercase text-[8px] font-bold">
                      {perm}
                    </span>
                  )) || (
                    <span className="text-zinc-600 italic">Default platform viewer access</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="md:col-span-2 bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <KeyRound size={14} className="text-brand-purple" />
              Update Governance Password
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wider block">Current Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
                  />
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wider block">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
                  />
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-400 uppercase tracking-wider block">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
                  />
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black font-black uppercase font-display rounded-xl tracking-wider text-center shadow-gold-glow transition-all"
              >
                {saving ? 'Updating Password...' : 'Save Password Change'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
