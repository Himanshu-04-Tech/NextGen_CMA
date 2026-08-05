import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Shield,
  ClipboardList,
  FileText,
  Sliders,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FolderLock,
  Lock,
  MessageSquare,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm('Confirm logging out of administrative console?')) return;
    try {
      await api.post('/admin/logout');
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Students', to: '/admin/students', icon: Users },
    { label: 'Mentors', to: '/admin/mentors', icon: GraduationCap },
    { label: 'Study Plans', to: '/study-planner', icon: ClipboardList },
    { label: 'Accountability', to: '/accountability', icon: CalendarCheck },
    { label: 'Mentorship', to: '/mentorship/mentors', icon: HelpCircle },
    { label: 'Services', to: '/services', icon: Sliders },
    { label: 'Contact Messages', to: '/admin/contact-messages', icon: MessageSquare },
    { label: 'Social Links', to: '/admin/social-links', icon: Share2 },
    { label: 'Homepage CMS', to: '/admin/cms', icon: FileText },
    { label: 'Activity Logs', to: '/admin/activity-logs', icon: Shield },
    { label: 'Settings', to: '/admin/settings', icon: Sliders },
  ];

  const comingSoonItems = [
    { label: 'Testimonials', icon: Lock },
    { label: 'Gallery', icon: Lock },
    { label: 'Blog', icon: Lock },
    { label: 'Payments', icon: Lock },
    { label: 'Notifications', icon: Lock },
  ];

  return (
    <aside
      className={`bg-black/90 border-r border-brand-border/60 min-h-screen flex flex-col justify-between transition-all duration-300 relative z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Logo block */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border/60">
          {!isCollapsed && (
            <Link to="/admin/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold-dark via-brand-gold to-brand-gold flex items-center justify-center shadow-gold-glow">
                <span className="text-black font-black text-sm">A</span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">
                Admin <span className="text-brand-gold">Panel</span>
              </span>
            </Link>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold-dark via-brand-gold to-brand-gold flex items-center justify-center mx-auto shadow-gold-glow">
              <span className="text-black font-black text-sm">A</span>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg border border-brand-border bg-zinc-900 hover:text-white text-zinc-400 absolute -right-3.5 top-4 shadow-lg hover:scale-105 transition-all"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-brand-purple/20 text-white border border-brand-purple/40 shadow-purple-glow/5'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title={item.label}
              >
                <Icon size={16} className={isActive ? 'text-brand-gold' : 'text-zinc-500'} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-brand-border/40 mt-4 px-3.5 pb-1">
            {!isCollapsed && (
              <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest block mb-2">
                Coming Soon
              </span>
            )}
          </div>

          {comingSoonItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 py-2 px-3.5 rounded-xl text-xs text-zinc-600 border border-transparent select-none"
                title={`${item.label} (Coming Soon)`}
              >
                <Icon size={14} className="text-zinc-700" />
                {!isCollapsed && (
                  <div className="flex justify-between items-center w-full">
                    <span>{item.label}</span>
                    <span className="text-[8px] bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500 font-bold tracking-wide border border-zinc-800 uppercase">
                      Soon
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-brand-border/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Logout admin console"
        >
          <LogOut size={16} className="text-zinc-500" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
