import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, TrendingUp, Sparkles, BarChart3 } from 'lucide-react';
import { AccountabilityService } from '../../services/accountability.service.js';
import StatisticsCards from '../../components/accountability/StatisticsCards.jsx';
import ProgressChart from '../../components/accountability/ProgressChart.jsx';
import CalendarHeatmap from '../../components/accountability/CalendarHeatmap.jsx';
import WeeklySummary from '../../components/accountability/WeeklySummary.jsx';
import LoadingSkeleton from '../../components/accountability/LoadingSkeleton.jsx';

const ProgressAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await AccountabilityService.getAnalytics();
        setAnalytics(result?.data);
      } catch (err) {
        toast.error('Failed to load analytical metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Back button */}
      <div className="border-b border-brand-border/40 pb-4">
        <Link
          to="/accountability"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center gap-2">
          <BarChart3 className="text-brand-gold" /> Study Consistency Analytics
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl">
          Complete comparison of planned study targets against actual daily check-ins.
        </p>
      </div>

      {/* Overview Cards */}
      <StatisticsCards overallStats={analytics.overallStats} />

      {/* Grid: 7-Day comparison vs Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <WeeklySummary comparisonData={analytics.comparisonData} />
        <div className="lg:col-span-2">
          <CalendarHeatmap heatmapData={analytics.heatmapData} />
        </div>
      </div>

      {/* Detailed hours comparison trend chart */}
      <ProgressChart comparisonData={analytics.comparisonData} />
    </div>
  );
};

export default ProgressAnalytics;
