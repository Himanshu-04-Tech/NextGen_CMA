import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldAlert, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import logoImg from '../../images/logo.jpeg';

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return toast.error('Please fill in all credentials');
    }

    setLoading(true);
    try {
      await adminLogin({ email: email.trim(), password });
      toast.success('Access granted. Welcome to Admin Panel');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Unauthorized role or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center px-4 relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-purple/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-gold/[0.03] rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-sm bg-black/40 backdrop-blur-md border border-brand-border rounded-2xl p-8 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <img
            src={logoImg}
            alt="NextGen CMA Logo"
            className="w-14 h-14 rounded-full object-cover mx-auto shadow-gold-glow border-2 border-brand-gold/40"
          />
          <h2 className="text-lg font-black text-white font-display uppercase tracking-wider">
            Governance Console
          </h2>
          <p className="text-[10px] text-zinc-400">
            NextGen CMA Administrative Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email input */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-400 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nextgencma.com"
                required
                className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
              />
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-400 uppercase tracking-widest block">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-purple"
              />
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-black font-black font-display tracking-widest uppercase hover:scale-[1.01] transition-all disabled:opacity-55 shadow-gold-glow"
          >
            {loading ? 'Authenticating...' : 'Enter System'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
