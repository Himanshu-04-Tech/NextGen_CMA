/**
 * NextGen CMA — Client Availability Formatter Utility
 * Formats recurring mentor availability slots into a human-readable string.
 * e.g. "Mon, Wed, Fri (4:00 PM - 7:00 PM)" or "Mon (9:00 AM - 12:00 PM), Wed (12:00 PM - 3:00 PM)"
 */

export function formatAvailabilitySlots(slots = []) {
  if (!slots || !Array.isArray(slots) || slots.length === 0) return null;

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = String(m).padStart(2, '0');
    return `${displayH}:${displayM} ${period}`;
  };

  const validSlots = slots.filter((s) => s.isAvailable !== false);
  if (validSlots.length === 0) return null;

  const sorted = [...validSlots].sort((a, b) => Number(a.dayOfWeek) - Number(b.dayOfWeek));

  const groups = {};
  for (const slot of sorted) {
    const timeRange = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
    if (!groups[timeRange]) {
      groups[timeRange] = [];
    }
    const dayNum = Number(slot.dayOfWeek);
    const dayName = DAYS[dayNum] !== undefined ? DAYS[dayNum] : `Day ${dayNum}`;
    if (!groups[timeRange].includes(dayName)) {
      groups[timeRange].push(dayName);
    }
  }

  const parts = [];
  for (const [timeRange, days] of Object.entries(groups)) {
    parts.push(`${days.join(', ')} (${timeRange})`);
  }

  return parts.join(', ');
}
