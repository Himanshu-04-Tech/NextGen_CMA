import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X, Calendar, Clock, Edit2, Trash2, Tag, AlertCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';

const TargetCard = ({ target, onUpdateStatus, onDeleteTarget, userRole }) => {
  const { id, topic, subjectName, description, date, startTime, endTime, status, priority, studyHours } = target;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTopic, setEditTopic] = useState(topic || '');
  const [editDescription, setEditDescription] = useState(description || '');
  const [editPriority, setEditPriority] = useState(priority || 'MEDIUM');
  const isScheduledDate = (d) => {
    if (!d) return false;
    const yr = new Date(d).getFullYear();
    return !isNaN(yr) && yr > 1970;
  };

  const [editDate, setEditDate] = useState(isScheduledDate(date) ? new Date(date).toISOString().split('T')[0] : '');
  const [editStartTime, setEditStartTime] = useState(startTime || '');
  const [editEndTime, setEditEndTime] = useState(endTime || '');
  const [editHours, setEditHours] = useState(studyHours || 2.0);
  const [editStatus, setEditStatus] = useState(status || 'PENDING');

  const formattedDate = isScheduledDate(date)
    ? new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : null;

  const formatTime12h = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    if (isNaN(h)) return t;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
  };

  const formattedTime = startTime
    ? `${formatTime12h(startTime)}${endTime ? ` – ${formatTime12h(endTime)}` : ''}`
    : null;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    onUpdateStatus(id, {
      topic: editTopic,
      description: editDescription,
      priority: editPriority,
      date: editDate || null,
      startTime: editStartTime || null,
      endTime: editEndTime || null,
      studyHours: parseFloat(editHours),
      status: editStatus
    });
    setIsEditing(false);
  };

  const priorityBadges = {
    HIGH: 'bg-red-500/10 text-red-400 border-red-500/30',
    MEDIUM: 'bg-brand-purple/10 text-brand-purple-light border-brand-purple/30',
    LOW: 'bg-zinc-800 text-zinc-400 border-zinc-700'
  };

  const statusColors = {
    PENDING: 'border-brand-border bg-black/20 text-zinc-300',
    IN_PROGRESS: 'border-brand-gold/30 bg-brand-gold/5 text-brand-gold',
    COMPLETED: 'border-green-500/20 bg-green-500/5 text-green-300',
    MISSED: 'border-red-500/20 bg-red-500/5 text-red-300',
    RESCHEDULED: 'border-brand-purple/20 bg-brand-purple/5 text-brand-purple-light'
  };

  const badgeColors = {
    PENDING: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    IN_PROGRESS: 'bg-brand-gold/10 text-brand-gold border-brand-gold/30',
    COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/30',
    MISSED: 'bg-red-500/10 text-red-400 border-red-500/30',
    RESCHEDULED: 'bg-brand-purple/10 text-brand-purple-light border-brand-purple/30'
  };

  const displayStatusLabel = {
    PENDING: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    MISSED: 'Missed',
    RESCHEDULED: 'Rescheduled'
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${statusColors[status] || statusColors.PENDING}`}>
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2 flex-wrap text-[10px]">
          {/* Status Badge */}
          <span className={`px-2 py-0.5 rounded font-bold uppercase border ${badgeColors[status] || badgeColors.PENDING}`}>
            {displayStatusLabel[status] || status}
          </span>

          {/* Priority Badge */}
          {priority && (
            <span className={`px-2 py-0.5 rounded font-bold uppercase border ${priorityBadges[priority] || priorityBadges.MEDIUM}`}>
              {priority} Priority
            </span>
          )}

          {/* Subject Badge */}
          {subjectName && (
            <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple-light border border-brand-purple/20 font-semibold truncate max-w-[180px]">
              {subjectName}
            </span>
          )}

          {/* Date Indicator (Target Date or No target date) */}
          {formattedDate ? (
            <span className="text-zinc-300 font-semibold flex items-center gap-1 bg-white/5 border border-brand-border/60 px-2 py-0.5 rounded">
              <Calendar size={10} className="text-brand-gold" /> {formattedDate}
            </span>
          ) : (
            <span className="text-amber-400/90 font-semibold flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              <AlertCircle size={10} /> No target date
            </span>
          )}

          {/* Time Indicator (Preferred Time or Time not scheduled) */}
          {formattedTime ? (
            <span className="text-zinc-300 font-semibold flex items-center gap-1 bg-white/5 border border-brand-border/60 px-2 py-0.5 rounded">
              <Clock size={10} className="text-brand-purple-light" /> {formattedTime}
            </span>
          ) : (
            <span className="text-zinc-500 font-semibold flex items-center gap-1 bg-zinc-900 border border-brand-border/40 px-2 py-0.5 rounded">
              <Clock size={10} /> Time not scheduled
            </span>
          )}

          {/* Duration */}
          {studyHours && (
            <span className="text-zinc-400 font-semibold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-brand-border/40">
              {studyHours} hrs
            </span>
          )}
        </div>

        {/* Topic Title & Description */}
        <div>
          <h4 className={`text-sm font-semibold tracking-wide leading-relaxed ${status === 'COMPLETED' ? 'line-through text-zinc-500' : 'text-white'}`}>
            {topic}
          </h4>
          {description && (
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* Target status action triggers */}
      <div className="shrink-0 flex items-center gap-2 flex-wrap justify-end">
        {userRole !== 'MENTOR' && (
          <>
            {status !== 'COMPLETED' ? (
              <button
                onClick={() => onUpdateStatus(id, { status: 'COMPLETED' })}
                className="px-2.5 py-1 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all text-xs font-bold flex items-center gap-1"
                title="Mark Completed"
              >
                <Check size={13} /> Complete
              </button>
            ) : (
              <button
                onClick={() => onUpdateStatus(id, { status: 'PENDING' })}
                className="px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-400 hover:bg-white/5 transition-all text-xs font-semibold"
                title="Reopen Topic"
              >
                Reopen
              </button>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg border border-brand-border text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
              title="Edit Schedule & Priority"
            >
              <Edit2 size={14} />
            </button>

            {onDeleteTarget && (
              <button
                onClick={() => onDeleteTarget(id)}
                className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                title="Delete Topic"
              >
                <Trash2 size={14} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 text-left overflow-y-auto">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 relative animate-fade-in shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold font-display text-white border-b border-brand-border/60 pb-2">
              Edit Topic Schedule & Preferences
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="form-label text-xs">Topic Title</label>
                <input
                  type="text"
                  required
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="form-input text-xs text-white"
                />
              </div>

              <div>
                <label className="form-label text-xs">Description / Notes (Optional)</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g. Focus on practical formula problems..."
                  className="form-input text-xs text-white h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="form-input text-xs text-white bg-black/40"
                  >
                    <option value="HIGH" className="bg-brand-dark">High Priority</option>
                    <option value="MEDIUM" className="bg-brand-dark">Medium Priority</option>
                    <option value="LOW" className="bg-brand-dark">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="form-input text-xs text-white bg-black/40"
                  >
                    <option value="PENDING" className="bg-brand-dark">Not Started</option>
                    <option value="IN_PROGRESS" className="bg-brand-dark">In Progress</option>
                    <option value="COMPLETED" className="bg-brand-dark">Completed</option>
                    <option value="MISSED" className="bg-brand-dark">Missed</option>
                    <option value="RESCHEDULED" className="bg-brand-dark">Rescheduled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Target Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="form-input text-xs text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">Leave empty for unscheduled</span>
                </div>
                <div>
                  <label className="form-label text-xs">Estimated Hours</label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                    className="form-input text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Preferred Start Time</label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="form-input text-xs text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Preferred End Time</label>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="form-input text-xs text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TargetCard;
