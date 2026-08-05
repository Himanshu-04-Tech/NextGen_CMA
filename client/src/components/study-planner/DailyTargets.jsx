import { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import TargetCard from './TargetCard.jsx';

const DailyTargets = ({ targets, onUpdateStatus, onDeleteTarget, userRole }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [scheduleFilter, setScheduleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-asc');

  const isScheduledDate = (d) => {
    if (!d) return false;
    const yr = new Date(d).getFullYear();
    return !isNaN(yr) && yr > 1970;
  };

  // Filter & Search daily targets
  const filteredTargets = targets.filter((target) => {
    const topicText = `${target.topic} ${target.subjectName || ''} ${target.description || ''}`.toLowerCase();
    const matchesSearch = topicText.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || target.status === statusFilter;
    
    let matchesSchedule = true;
    if (scheduleFilter === 'SCHEDULED') {
      matchesSchedule = isScheduledDate(target.date);
    } else if (scheduleFilter === 'UNSCHEDULED') {
      matchesSchedule = !isScheduledDate(target.date);
    }

    return matchesSearch && matchesStatus && matchesSchedule;
  });

  // Sort daily targets
  const sortedTargets = [...filteredTargets].sort((a, b) => {
    if (sortBy === 'date-asc') {
      if (!isScheduledDate(a.date) && !isScheduledDate(b.date)) return 0;
      if (!isScheduledDate(a.date)) return 1;
      if (!isScheduledDate(b.date)) return -1;
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'date-desc') {
      if (!isScheduledDate(a.date) && !isScheduledDate(b.date)) return 0;
      if (!isScheduledDate(a.date)) return 1;
      if (!isScheduledDate(b.date)) return -1;
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'priority') {
      const pOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (pOrder[b.priority] || 2) - (pOrder[a.priority] || 2);
    } else if (sortBy === 'hours-desc') {
      return b.studyHours - a.studyHours;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search, Filter, Sort Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-brand-card/40 border border-brand-border p-4 rounded-xl">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search topic or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-brand-gold outline-none"
          />
        </div>

        {/* Schedule Filter */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Filter size={14} />
          </span>
          <select
            value={scheduleFilter}
            onChange={(e) => setScheduleFilter(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-brand-gold outline-none"
          >
            <option value="ALL">All Schedule Types</option>
            <option value="SCHEDULED">Scheduled Only</option>
            <option value="UNSCHEDULED">Unscheduled Only</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Filter size={14} />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-brand-gold outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="MISSED">Missed</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <ArrowUpDown size={14} />
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-brand-gold outline-none"
          >
            <option value="date-asc">Date: Earliest First</option>
            <option value="date-desc">Date: Latest First</option>
            <option value="priority">Priority: Highest First</option>
            <option value="hours-desc">Duration: Highest First</option>
          </select>
        </div>
      </div>

      {/* Target Cards Stack */}
      {sortedTargets.length > 0 ? (
        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
          {sortedTargets.map((target) => (
            <TargetCard
              key={target.id}
              target={target}
              onUpdateStatus={onUpdateStatus}
              onDeleteTarget={onDeleteTarget}
              userRole={userRole}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-brand-border rounded-xl">
          <p className="text-xs text-zinc-500 font-medium">No matching topics found.</p>
        </div>
      )}
    </div>
  );
};

export default DailyTargets;
