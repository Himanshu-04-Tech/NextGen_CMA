import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from '../navigation/Sidebar.jsx';
import { User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-screen overflow-hidden bg-brand-dark text-white flex">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-purple/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-brand-gold/[0.02] blur-[100px]" />
      </div>

      {/* Dynamic Collapsible Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        
        {/* Topbar Utility */}
        <header className="h-16 border-b border-brand-border/60 bg-zinc-950/20 backdrop-blur-md flex items-center justify-between px-6 md:px-8">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              NextGen CMA Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Indicator */}
            <button className="p-2 rounded-lg text-zinc-400 hover:text-white transition-colors relative hover:bg-white/5">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-gold" />
            </button>

            {/* Profile Avatar / Indicator */}
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-brand-border bg-black/40 hover:bg-white/5 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-brand-gold/50 overflow-hidden flex items-center justify-center">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={12} className="text-brand-gold" />
                )}
              </div>
              <span className="text-xs text-zinc-300 font-semibold">{user?.name}</span>
            </Link>
          </div>
        </header>

        {/* Content container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
