import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import api from '../../services/api.js';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Bookmark,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BarChart,
  ClipboardList
} from 'lucide-react';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';

const StudentDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/admin/students/${id}`);
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load student details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSkeleton type="logs" count={5} />
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-brand-gold mb-3" size={32} />
          <h2 className="text-white font-bold font-display">Student profile not found</h2>
          <Link to="/admin/students" className="text-brand-purple hover:underline text-xs mt-2 block">
            Return to directory
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { profile, studyPlannerSummary = [], accountabilitySummary = {}, mentorshipSummary = {} } = data;
  const isDeactivated = profile.status === 'DEACTIVATED';

  return (
    <AdminLayout>
      <div className="space-y-6 text-xs">
        {/* Back Link */}
        <Link to="/admin/students" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to student directory</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold font-bold">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-black text-white font-display uppercase tracking-wider">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-400">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-zinc-600" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-zinc-600" />
                  {profile.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-bold uppercase tracking-wider">
              Level: {profile.cmaLevel || 'Not Configured'}
            </span>
            <span className={`px-2.5 py-1 rounded border font-bold uppercase tracking-wider ${
              isDeactivated
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {profile.status}
            </span>
          </div>
        </div>

        {/* Reports Submodules Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Study Planner Summary */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 pb-1 border-b border-brand-border/40">
              <ClipboardList size={14} className="text-brand-purple" />
              Study Strategy Portfolios
            </h3>
            {studyPlannerSummary.length === 0 ? (
              <p className="text-zinc-500 py-3">No active study plans configured.</p>
            ) : (
              <div className="space-y-3">
                {studyPlannerSummary.map((plan) => (
                  <div key={plan.id} className="bg-white/5 p-3.5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white uppercase">{plan.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-brand-gold/15 text-brand-gold font-bold text-[9px] uppercase">
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Target Exam: {plan.targetExam} • Created: {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {plan.subjects?.map((sub) => (
                        <span key={sub.id} className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[9px] text-zinc-300 uppercase">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accountability Progress Summary */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 pb-1 border-b border-brand-border/40">
              <BarChart size={14} className="text-brand-gold" />
              Accountability Check-in logs
            </h3>
            {/* Habits tracker lists */}
            <div className="space-y-3">
              <span className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block">
                Active Habits Tracked
              </span>
              {accountabilitySummary.habits?.length === 0 ? (
                <p className="text-zinc-500">No habit tracker configured.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {accountabilitySummary.habits?.map((h) => (
                    <span key={h.id} className="px-2 py-1 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-medium">
                      {h.name} ({h.frequency})
                    </span>
                  ))}
                </div>
              )}

              <span className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] block pt-2">
                Recent Daily Check-ins
              </span>
              {accountabilitySummary.dailyCheckins?.length === 0 ? (
                <p className="text-zinc-500">No recent daily check-ins recorded.</p>
              ) : (
                <div className="space-y-2">
                  {accountabilitySummary.dailyCheckins?.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg">
                      <span className="text-zinc-300 font-semibold">{new Date(log.date).toLocaleDateString()}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        log.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mentorship Booking & Doubts Reports */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Booked Sessions */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 pb-1 border-b border-brand-border/40">
              <Calendar size={14} className="text-brand-purple" />
              Mentorship Booking History
            </h3>
            {mentorshipSummary.bookings?.length === 0 ? (
              <p className="text-zinc-500">No sessions booked yet.</p>
            ) : (
              <div className="space-y-2">
                {mentorshipSummary.bookings?.map((b) => (
                  <div key={b.id} className="bg-white/5 p-2.5 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">Mentor: {b.mentor?.fullName}</p>
                      <span className="text-[9px] text-zinc-400">
                        {new Date(b.scheduledAt).toLocaleString()}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] uppercase font-bold rounded">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Academic Doubt logs */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 pb-1 border-b border-brand-border/40">
              <HelpCircle size={14} className="text-brand-gold" />
              Doubt Support Questions
            </h3>
            {mentorshipSummary.doubts?.length === 0 ? (
              <p className="text-zinc-500">No doubts submitted.</p>
            ) : (
              <div className="space-y-2">
                {mentorshipSummary.doubts?.map((d) => (
                  <div key={d.id} className="bg-white/5 p-2.5 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white max-w-[200px] truncate">{d.title}</p>
                      <span className="text-[9px] text-zinc-400">Subject: {d.subject}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-wide ${
                      d.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentDetails;
