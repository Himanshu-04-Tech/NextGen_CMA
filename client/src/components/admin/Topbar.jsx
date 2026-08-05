import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Bell, ShieldCheck } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-brand-border/60 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Search mock or page indicators */}
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-brand-gold" />
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          EdTech System Governance Console
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Profile Card */}
        <div className="flex items-center gap-3 bg-white/5 border border-brand-border/50 py-1.5 px-3 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold font-bold shrink-0">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={15} />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <h4 className="text-xs font-bold text-white leading-tight">{user?.name}</h4>
            <span className="text-[9px] text-brand-gold uppercase tracking-widest font-black">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
