import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, CalendarDays, Sparkles } from 'lucide-react';
import { StudyPlanService } from '../../services/studyPlan.service.js';
import CalendarView from '../../components/study-planner/CalendarView.jsx';
import LoadingSkeleton from '../../components/study-planner/LoadingSkeleton.jsx';

const RevisionCalendarPage = () => {
  const { id } = useParams(); // planId
  const [loading, setLoading] = useState(true);
  const [revisionEntries, setRevisionEntries] = useState([]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const result = await StudyPlanService.getRevisionCalendar(id);
        setRevisionEntries(result?.data || []);
      } catch (err) {
        toast.error('Failed to load revision calendar.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton type="calendar" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Breadcrumb */}
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-4 flex-wrap gap-4">
        <Link
          to={`/study-planner/plan/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Plan Details
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-xs text-brand-purple-light font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} /> Revision Log
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center gap-2">
          <CalendarDays className="text-brand-gold" /> Revision Calendar
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl">
          Visual track of mock test schedules and final chapter revisions. Standard rounds are color-coded (Purple for Round 1, Gold for final Round 2).
        </p>
      </div>

      {/* Calendar Grid component */}
      <CalendarView calendarEntries={revisionEntries} />
    </div>
  );
};

export default RevisionCalendarPage;
