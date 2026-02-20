/* ─────────────────────────────────────────────
   dateUtils.js  –  tiny date helpers
   replaces moment entirely
───────────────────────────────────────────── */

/**
 * Format a date string into a readable format
 * e.g.  "Mon, Feb 17 2026 at 14:30"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; // return raw if unparseable
  return d.toLocaleString('en-IN', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
  });
};

/**
 * Short date only: "Feb 17, 2026"
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Relative time: "2 hours ago", "3 days ago"
 */
export const fromNow = (dateStr) => {
  if (!dateStr) return '';
  const d     = new Date(dateStr);
  if (isNaN(d)) return '';
  const diff  = Date.now() - d.getTime();
  const abs   = Math.abs(diff);
  const mins  = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days  = Math.floor(abs / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days  < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDateShort(dateStr);
};

/**
 * Admin table format: "Nov 9, 2024 20:36"
 */
export const formatTableDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleString('en-IN', {
    month:  'short',
    day:    'numeric',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
};
