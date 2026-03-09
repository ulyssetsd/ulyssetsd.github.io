'use strict';

function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const parts = dateStr.split('-');
  const year = parts[0];
  if (!parts[1]) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1]) - 1]} ${year}`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { formatDate, esc };
