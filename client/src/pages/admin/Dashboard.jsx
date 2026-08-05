import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatsCard from '../../components/admin/StatsCard.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import api from '../../services/api.js';
import {
  Users,
  GraduationCap,
  ClipboardList,
  CalendarCheck,
  HelpCircle,
  FileSpreadsheet,
  AlertTriangle,
  Zap,
  Activity,
  UserCheck,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <LoadingSkeleton type="stats" />
          <LoadingSkeleton type="table" count={5} />
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats || {};
  const recentActivity = data?.recentActivity || [];
  const recentStudents = data?.recentStudents || [];
  const recentMentors = data?.recentMentors || [];
  const systemStatus = data?.systemStatus || {};

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Title Block */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-white font-display uppercase tracking-wider">
              Governance Dashboard
            </h1>
            <p className="text-xs text-zinc-400">
              System performance metrics and action centers.
            </p>
          </div>
          <Link
            to="/admin/mentors/create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black text-xs font-black font-display uppercase hover:scale-[1.02] shadow-gold-glow transition-all"
          >
            <Plus size={14} />
            Create Mentor
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents || 0}
            icon={Users}
            trend={stats.growthRate}
            description="Active accounts registered"
          />
          <StatsCard
            title="Total Mentors"
            value={stats.totalMentors || 0}
            icon={GraduationCap}
            description="Assigned academic advisers"
          />
          <StatsCard
            title="Active Study Plans"
            value={stats.activeStudyPlans || 0}
            icon={ClipboardList}
            description="Student strategy schedules"
          />
          <StatsCard
            title="Today Check-ins"
            value={stats.todayCheckins || 0}
            icon={CalendarCheck}
            description="Daily habit checks completed"
          />
          <StatsCard
            title="Booked Sessions"
            value={stats.totalBookings || 0}
            icon={CalendarCheck}
            description="Rescheduled & upcoming events"
          />
          <StatsCard
            title="Pending Doubts"
            value={stats.pendingDoubts || 0}
            icon={HelpCircle}
            description="Open questions needing reply"
          />
          <StatsCard
            title="Completed Evaluations"
            value={stats.completedReviews || 0}
            icon={FileSpreadsheet}
            description="Mentor feedback reports"
          />
          <StatsCard
            title="API Uptime"
            value={`${Math.floor((systemStatus.serverUptime || 0) / 60)}m`}
            icon={Zap}
            description="Governance engine state"
          />
        </div>

        {/* Recent Data Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Audit Logs */}
          <div className="lg:col-span-2 space-y-3 bg-brand-dark/40 border border-brand-border rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Activity size={14} className="text-brand-purple" />
              Recent Operations Log
            </h3>
            <div className="divide-y divide-brand-border/40 text-xs">
              {recentActivity.length === 0 ? (
                <div className="text-zinc-500 py-4 text-center">No recent activity logged</div>
              ) : (
                recentActivity.map((log) => (
                  <div key={log.id} className="py-3 flex justify-between gap-4">
                    <div>
                      <p className="text-zinc-300 font-bold">{log.description}</p>
                      <span className="text-[9px] text-zinc-500 uppercase font-black">
                        {log.action} • {log.targetTable}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 self-center shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Status Panel */}
          <div className="space-y-4 bg-brand-dark/40 border border-brand-border rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Zap size={14} className="text-brand-gold" />
              System Governance Health
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Service Health:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                  {systemStatus.apiStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Database Link:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                  {systemStatus.databaseStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Node Version:</span>
                <span className="text-zinc-300 font-bold">v18.16.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent users tables */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Students */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <UserCheck size={14} className="text-brand-purple" />
              Newly Registered Students
            </h3>
            <div className="divide-y divide-brand-border/40 text-xs">
              {recentStudents.map((s) => (
                <div key={s.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white leading-tight">{s.name}</h4>
                    <span className="text-[9px] text-zinc-500">{s.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-brand-purple/10 border border-brand-purple/20 text-brand-purple uppercase">
                    {s.cmaLevel || 'Not Set'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mentors */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <GraduationCap size={14} className="text-brand-gold" />
              Newly Onboarded Mentors
            </h3>
            <div className="divide-y divide-brand-border/40 text-xs">
              {recentMentors.map((m) => (
                <div key={m.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white leading-tight">{m.fullName}</h4>
                    <span className="text-[10px] text-zinc-500">{m.specialization}</span>
                  </div>
                  <span className="text-brand-gold font-bold">{m.rating || 'N/A'} ★</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
