import React from 'react';
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
  Lock,
  MessageSquare,
  Share2,
  User,
  Star,
  Clock,
  Calendar,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
        await api.post('/admin/logout');
      } else {
        await api.post('/auth/logout');
      }
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleItemClick = (item) => {
    if (item.to === '/') {
      sessionStorage.setItem('viewing_website', 'true');
    }
  };

  // Define sidebar navigation items based on role
  let navItems = [];
  let comingSoonItems = [];

  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    navItems = [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Students', to: '/admin/students', icon: Users },
      { label: 'Mentors', to: '/admin/mentors', icon: GraduationCap },
      { label: 'CMS Summary', to: '/admin/cms', icon: FileText },
      { label: 'Services', to: '/admin/services', icon: Sliders },
      { label: 'Contact Messages', to: '/admin/contact-messages', icon: MessageSquare },
      { label: 'Social Links', to: '/admin/social-links', icon: Share2 },
      { label: 'Activity Logs', to: '/admin/activity-logs', icon: Shield },
      { label: 'View Website', to: '/', icon: Globe },
    ];
    comingSoonItems = [
      { label: 'Reports', icon: Lock },
      { label: 'Settings', icon: Lock },
    ];
  } else if (user?.role === 'MENTOR') {
    navItems = [
      { label: 'Dashboard', to: '/mentorship/dashboard', icon: LayoutDashboard },
      { label: 'Sessions', to: '/mentorship/dashboard?tab=sessions', icon: Clock },
      { label: 'Students', to: '/mentorship/dashboard?tab=reviews', icon: Users },
      { label: 'Reviews', to: '/mentorship/dashboard?tab=reviews', icon: Star },
      { label: 'Availability', to: '/mentorship/dashboard?tab=availability', icon: Calendar },
      { label: 'Calendar', to: '/mentorship/dashboard?tab=calendar', icon: CalendarCheck },
      { label: 'Profile', to: '/profile', icon: User },
      { label: 'Contact Us', to: '/contact', icon: HelpCircle },
      { label: 'View Website', to: '/', icon: Globe },
    ];
    comingSoonItems = [
      { label: 'Settings', icon: Lock },
    ];
  } else {
    // STUDENT Role
    navItems = [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Study Planner', to: '/study-planner', icon: ClipboardList },
      { label: 'Accountability', to: '/accountability', icon: CalendarCheck },
      { label: 'Mentorship', to: '/mentorship/mentors', icon: GraduationCap },
      { label: 'Performance', to: '/mentorship/reviews', icon: Star },
      { label: 'Profile', to: '/profile', icon: User },
      { label: 'Contact Us', to: '/contact', icon: HelpCircle },
      { label: 'View Website', to: '/', icon: Globe },
    ];
    comingSoonItems = [
      { label: 'Notifications', icon: Lock },
      { label: 'Settings', icon: Lock },
    ];
  }

  const handleComingSoonClick = () => {
    toast.success('Coming soon: This premium module is currently being finalized!');
  };

  const isActive = (item) => {
    if (item.to === '/dashboard' || item.to === '/admin/dashboard' || item.to === '/mentorship/dashboard') {
      return location.pathname === item.to && !location.search;
    }
    const [path, tabQuery] = item.to.split('?');
    if (tabQuery) {
      return location.pathname === path && location.search.includes(tabQuery);
    }
    return location.pathname.startsWith(item.to) && item.to !== '/';
  };

  return (
    <aside
      className={`bg-zinc-950/80 border-r border-brand-border/60 h-screen flex flex-col justify-between transition-all duration-300 relative z-30 backdrop-blur-xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Logo block */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border/60">
          {!isCollapsed ? (
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold-dark via-brand-gold to-brand-gold flex items-center justify-center shadow-gold-glow">
                <span className="text-black font-black text-sm">N</span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">
                NextGen <span className="text-brand-gold">CMA</span>
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold-dark via-brand-gold to-brand-gold flex items-center justify-center mx-auto shadow-gold-glow">
              <span className="text-black font-black text-sm">N</span>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md border border-brand-border bg-zinc-900 hover:text-white text-zinc-400 absolute -right-3 top-5 shadow-md hover:scale-105 transition-all"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item, idx) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.to}
                onClick={() => handleItemClick(item)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-brand-gold/15 to-transparent text-brand-gold border-l-2 border-brand-gold shadow-[inset_4px_0_12px_rgba(212,163,89,0.05)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Icon size={16} className={active ? 'text-brand-gold' : 'text-zinc-400'} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Divider */}
          {comingSoonItems.length > 0 && (
            <div className="py-2">
              <div className="h-px bg-brand-border/40" />
            </div>
          )}

          {/* Coming Soon Section */}
          {comingSoonItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={handleComingSoonClick}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-650 hover:text-zinc-450 transition-all duration-200 group text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon size={14} className="text-zinc-705 group-hover:text-zinc-505" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[8px] bg-zinc-900 border border-brand-border/40 text-zinc-500 px-1.5 py-0.5 rounded-full uppercase tracking-normal">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-brand-border/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-left"
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
