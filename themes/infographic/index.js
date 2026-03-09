'use strict';

const { formatDate, esc } = require('../_shared/helpers');

function skillPercent(level) {
  switch ((level || '').toLowerCase()) {
    case 'expert': return 95;
    case 'advanced': return 80;
    case 'intermediate': return 60;
    case 'beginner': return 35;
    default: return 50;
  }
}

function langPercent(fluency) {
  const f = (fluency || '').toLowerCase();
  if (f.includes('native')) return 100;
  if (f.includes('c2') || f.includes('fluent')) return 90;
  if (f.includes('c1') || f.includes('proficient')) return 80;
  if (f.includes('b2')) return 65;
  if (f.includes('b1')) return 50;
  if (f.includes('basic') || f.includes('a2') || f.includes('a1')) return 30;
  return 50;
}

/* Inline SVG icons */
const icons = {
  briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  graduation: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  folder: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  phone: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mappin: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
};

const colors = {
  teal: '#0ea5e9',
  coral: '#f43f5e',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  emerald: '#10b981',
  blue: '#3b82f6',
};

exports.pdfRenderOptions = { mediaType: 'print' };

exports.render = function (resume) {
  const b = resume.basics || {};
  const github = (b.profiles || []).find(p => p.network === 'GitHub');
  const linkedin = (b.profiles || []).find(p => p.network === 'LinkedIn');

  // Stats
  const yearsExp = new Date().getFullYear() - 2015;
  const totalCompanies = (resume.work || []).length;
  const allKeywords = new Set();
  (resume.skills || []).forEach(s => (s.keywords || []).forEach(k => allKeywords.add(k)));

  // Color cycle for timeline dots
  const dotColors = [colors.teal, colors.coral, colors.violet, colors.amber, colors.emerald, colors.blue];

  const workHtml = (resume.work || []).map((job, i) => {
    const end = job.endDate ? formatDate(job.endDate) : 'Present';
    const dotColor = dotColors[i % dotColors.length];
    const highlights = (job.highlights || []).map(h => `<li>${esc(h)}</li>`).join('');
    return `
      <div class="tl-item">
        <div class="tl-dot" style="background:${dotColor};box-shadow:0 0 0 4px ${dotColor}22;"></div>
        <div class="tl-content">
          <div class="tl-header">
            <div class="tl-title">${esc(job.position)}</div>
            <div class="tl-date">${formatDate(job.startDate)} – ${end}</div>
          </div>
          <div class="tl-company">${esc(job.name)}${job.location ? ` · ${esc(job.location)}` : ''}</div>
          ${job.summary ? `<p class="tl-summary">${esc(job.summary)}</p>` : ''}
          ${highlights ? `<ul class="tl-highlights">${highlights}</ul>` : ''}
        </div>
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map(edu => `
    <div class="edu-card">
      <div class="edu-degree">${esc(edu.studyType)}${edu.area ? ` — ${esc(edu.area)}` : ''}</div>
      <div class="edu-school">${esc(edu.institution)}</div>
      <div class="edu-dates">${esc(edu.startDate)} – ${esc(edu.endDate)}</div>
      ${edu.location ? `<div class="edu-loc">${esc(edu.location)}</div>` : ''}
      ${edu.summary ? `<p class="edu-summary">${esc(edu.summary)}</p>` : ''}
    </div>`).join('');

  const skillsHtml = (resume.skills || []).map((skill, i) => {
    const pct = skillPercent(skill.level);
    const barColor = dotColors[i % dotColors.length];
    return `
      <div class="skill-card">
        <div class="skill-header">
          <span class="skill-name">${esc(skill.name)}</span>
          <span class="skill-level">${esc(skill.level)}</span>
        </div>
        <div class="skill-bar-bg">
          <div class="skill-bar-fill" style="width:${pct}%;background:${barColor};"></div>
        </div>
        <div class="skill-kw">${(skill.keywords || []).map(k => `<span class="kw-pill" style="border-color:${barColor};color:${barColor};">${esc(k)}</span>`).join('')}</div>
      </div>`;
  }).join('');

  const langHtml = (resume.languages || []).map((lang, i) => {
    const pct = langPercent(lang.fluency);
    const circumference = 2 * Math.PI * 28;
    const offset = circumference - (pct / 100) * circumference;
    const ringColor = dotColors[i % dotColors.length];
    return `
      <div class="lang-card">
        <svg class="lang-ring" viewBox="0 0 64 64" width="64" height="64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" stroke-width="4"/>
          <circle cx="32" cy="32" r="28" fill="none" stroke="${ringColor}" stroke-width="4"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  stroke-linecap="round" transform="rotate(-90 32 32)"/>
          <text x="32" y="36" text-anchor="middle" font-size="13" font-weight="700" fill="${ringColor}">${pct}%</text>
        </svg>
        <div class="lang-info">
          <div class="lang-name">${esc(lang.language)}</div>
          <div class="lang-fluency">${esc(lang.fluency)}</div>
          ${lang.summary ? `<div class="lang-detail">${esc(lang.summary)}</div>` : ''}
        </div>
      </div>`;
  }).join('');

  const interestHtml = (resume.interests || []).map(i => `
    <div class="interest-chip">
      <span class="interest-name">${esc(i.name)}</span>
      ${i.summary ? `<span class="interest-desc">${esc(i.summary)}</span>` : ''}
    </div>`).join('');

  const referencesHtml = (resume.references || []).map(ref => `
    <div class="ref-card">
      <div class="ref-name">${esc(ref.name)}</div>
      <div class="ref-role">${esc(ref.reference)}</div>
    </div>`).join('');

  const projectsHtml = (resume.projects || []).map(proj => `
    <div class="proj-card">
      <div class="proj-header">
        <span class="proj-name">${esc(proj.name)}</span>
        ${proj.url ? `<a href="${esc(proj.url)}" class="proj-link" target="_blank" rel="noopener noreferrer">↗</a>` : ''}
      </div>
      <div class="proj-dates">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</div>
      ${proj.summary ? `<p class="proj-summary">${esc(proj.summary)}</p>` : ''}
      ${proj.keywords ? `<div class="proj-kw">${(proj.keywords || []).map(k => `<span class="kw-pill-sm">${esc(k)}</span>`).join('')}</div>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.name)} — Infographic Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --teal: ${colors.teal};
      --coral: ${colors.coral};
      --amber: ${colors.amber};
      --violet: ${colors.violet};
      --emerald: ${colors.emerald};
      --text: #1e293b;
      --text2: #475569;
      --muted: #94a3b8;
      --bg: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      color: var(--text);
      background: var(--bg);
      line-height: 1.55;
      margin: 0;
      padding: 0;
    }

    a { color: var(--teal); text-decoration: none; }

    .page {
      display: grid;
      grid-template-columns: 300px 1fr;
      min-height: 100vh;
    }

    /* ── SIDEBAR ─────────────────────────────── */
    .sidebar {
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      padding: 36px 24px;
    }

    .sb-name {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .sb-label {
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .sb-contact {
      margin-bottom: 24px;
      font-size: 12px;
    }

    .sb-contact-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #cbd5e1;
    }
    .sb-contact-row svg { color: var(--teal); flex-shrink: 0; }
    .sb-contact-row a { color: #cbd5e1; }

    .sb-section {
      margin-bottom: 24px;
    }

    .sb-section-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--teal);
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    /* Sidebar skills */
    .sb-skill {
      margin-bottom: 10px;
    }
    .sb-skill-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 3px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .sb-skill-pct { color: var(--muted); font-weight: 400; }
    .sb-skill-bar-bg {
      height: 5px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    .sb-skill-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 1s ease;
    }
    .sb-skill-kw {
      font-size: 10px;
      color: var(--muted);
      margin-top: 2px;
    }

    /* Sidebar languages */
    .sb-lang { margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }

    .lang-ring { flex-shrink: 0; }

    .lang-info { font-size: 12px; }
    .lang-name { font-weight: 700; color: #e2e8f0; }
    .lang-fluency { color: var(--muted); font-size: 11px; }
    .lang-detail { color: var(--muted); font-size: 10px; margin-top: 1px; }

    /* Sidebar interests */
    .sb-interest {
      margin-bottom: 8px;
      font-size: 12px;
    }
    .interest-name {
      font-weight: 600;
      color: #e2e8f0;
    }
    .interest-desc {
      display: block;
      font-size: 10px;
      color: var(--muted);
      margin-top: 1px;
    }

    .dl-pdf {
      display: inline-block;
      margin-top: 16px;
      font-size: 11px;
      color: var(--teal);
      border: 1px solid var(--teal);
      padding: 4px 12px;
      border-radius: 4px;
    }

    /* ── MAIN CONTENT ─────────────────────────────── */
    .main {
      padding: 36px 40px;
      max-width: 780px;
    }

    /* Stats bar */
    .stats-bar {
      display: flex;
      gap: 0;
      margin-bottom: 28px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .stat-box {
      flex: 1;
      padding: 16px 20px;
      background: var(--card);
      text-align: center;
      border-right: 1px solid var(--border);
    }
    .stat-box:last-child { border-right: none; }
    .stat-val {
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
    }
    .stat-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--muted);
      margin-top: 4px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
    }
    .section-header svg { color: var(--teal); }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }
    .section { margin-bottom: 32px; }

    /* ── TIMELINE ─────────────────────────────── */
    .timeline {
      position: relative;
      padding-left: 28px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: var(--border);
    }

    .tl-item {
      position: relative;
      margin-bottom: 22px;
    }
    .tl-dot {
      position: absolute;
      left: -25px;
      top: 5px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .tl-content {
      background: var(--card);
      border-radius: 8px;
      padding: 14px 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid var(--border);
    }

    .tl-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 2px;
    }
    .tl-title { font-weight: 700; font-size: 14px; }
    .tl-date { font-size: 11px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
    .tl-company { font-size: 12px; color: var(--text2); margin-bottom: 6px; }
    .tl-summary { font-size: 12px; color: var(--text2); line-height: 1.5; margin-bottom: 6px; }
    .tl-highlights {
      font-size: 12px;
      color: var(--text2);
      padding-left: 16px;
      line-height: 1.5;
    }
    .tl-highlights li { margin-bottom: 2px; }

    /* ── EDUCATION ─────────────────────────────── */
    .edu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .edu-card {
      background: var(--card);
      border-radius: 8px;
      padding: 14px 16px;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .edu-degree { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
    .edu-school { font-size: 12px; color: var(--text2); }
    .edu-dates { font-size: 11px; color: var(--muted); }
    .edu-loc { font-size: 11px; color: var(--muted); }
    .edu-summary { font-size: 11px; color: var(--text2); margin-top: 6px; line-height: 1.4; }

    /* ── REFERENCES ─────────────────────────────── */
    .ref-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .ref-card {
      background: var(--card);
      border-radius: 8px;
      padding: 12px 16px;
      border: 1px solid var(--border);
    }
    .ref-name { font-weight: 700; font-size: 13px; }
    .ref-role { font-size: 11px; color: var(--muted); margin-top: 2px; }

    /* ── PROJECTS ─────────────────────────────── */
    .proj-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }
    .proj-card {
      background: var(--card);
      border-radius: 8px;
      padding: 14px 16px;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .proj-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    .proj-name { font-weight: 700; font-size: 13px; }
    .proj-link { color: var(--teal); font-size: 14px; }
    .proj-dates { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .proj-summary { font-size: 11px; color: var(--text2); margin-top: 6px; line-height: 1.4; }
    .proj-kw { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px; }
    .kw-pill-sm {
      font-size: 9px;
      padding: 1px 6px;
      border-radius: 3px;
      background: #f1f5f9;
      color: var(--text2);
    }

    .kw-pill {
      display: inline-block;
      font-size: 10px;
      padding: 2px 8px;
      border: 1px solid;
      border-radius: 12px;
      margin: 2px 2px;
      background: transparent;
    }

    /* Skill bar in main (for print fallback) */
    .skill-card { margin-bottom: 12px; }
    .skill-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px; }
    .skill-name { font-weight: 700; font-size: 13px; }
    .skill-level { font-size: 11px; color: var(--muted); }
    .skill-bar-bg { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .skill-bar-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
    .skill-kw { margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px; }

    .interest-chip { margin-bottom: 8px; }

    /* ── RESPONSIVE ─────────────────────────────── */
    @media screen and (max-width: 768px) {
      .page {
        grid-template-columns: 1fr;
      }
      .sidebar {
        padding: 24px 20px;
      }
      .main {
        padding: 24px 20px;
      }
    }

    /* ── PRINT ─────────────────────────────── */
    @page { margin: 1.5cm; }

    @media print {
      body { background: white; font-size: 9pt; }

      .page {
        display: block;
      }

      .sidebar {
        background: #1e293b;
        padding: 20px;
        margin-bottom: 16px;
        border-radius: 0;
        page-break-inside: avoid;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .main {
        padding: 0;
        max-width: 100%;
      }

      .stats-bar { box-shadow: none; border: 1px solid var(--border); }

      .timeline::before { background: #cbd5e1; }

      .tl-content { box-shadow: none; }
      .tl-item { break-inside: avoid; }

      .edu-card, .ref-card, .proj-card { box-shadow: none; break-inside: avoid; }

      .section-header { break-after: avoid; }

      .sb-skill-bar-fill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .skill-bar-fill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .tl-dot { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

      .dl-pdf { display: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <aside class="sidebar">
      <div class="sb-name">${esc(b.name)}</div>
      ${b.label ? `<div class="sb-label">${esc(b.label)}</div>` : ''}

      <div class="sb-contact">
        ${b.email ? `<div class="sb-contact-row">${icons.mail} <a href="mailto:${esc(b.email)}">${esc(b.email)}</a></div>` : ''}
        ${b.phone ? `<div class="sb-contact-row">${icons.phone} <a href="tel:${esc(b.phone.replace(/\\s/g, ''))}">${esc(b.phone)}</a></div>` : ''}
        ${b.location && b.location.city ? `<div class="sb-contact-row">${icons.mappin} ${esc(b.location.city)}, ${esc(b.location.region || b.location.country)}</div>` : ''}
        ${github ? `<div class="sb-contact-row">${icons.code} <a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">github/${esc(github.username)}</a></div>` : ''}
        ${linkedin ? `<div class="sb-contact-row">${icons.users} <a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">linkedin/${esc(linkedin.username)}</a></div>` : ''}
      </div>

      ${b.summary ? `
      <div class="sb-section">
        <div class="sb-section-title">About</div>
        <p style="font-size:12px;color:#cbd5e1;line-height:1.5;">${esc(b.summary)}</p>
      </div>` : ''}

      ${resume.skills && resume.skills.length ? `
      <div class="sb-section">
        <div class="sb-section-title">Skills</div>
        ${(resume.skills || []).map((skill, i) => {
          const pct = skillPercent(skill.level);
          const barColor = dotColors[i % dotColors.length];
          return `<div class="sb-skill">
            <div class="sb-skill-header"><span>${esc(skill.name)}</span><span class="sb-skill-pct">${pct}%</span></div>
            <div class="sb-skill-bar-bg"><div class="sb-skill-bar-fill" style="width:${pct}%;background:${barColor};"></div></div>
            <div class="sb-skill-kw">${(skill.keywords || []).map(esc).join(' · ')}</div>
          </div>`;
        }).join('')}
      </div>` : ''}

      ${resume.languages && resume.languages.length ? `
      <div class="sb-section">
        <div class="sb-section-title">Languages</div>
        ${langHtml}
      </div>` : ''}

      ${resume.interests && resume.interests.length ? `
      <div class="sb-section">
        <div class="sb-section-title">Interests</div>
        ${(resume.interests || []).map(i => `
          <div class="sb-interest">
            <span class="interest-name">${esc(i.name)}</span>
            ${i.summary ? `<span class="interest-desc">${esc(i.summary)}</span>` : ''}
          </div>`).join('')}
      </div>` : ''}

      <a class="dl-pdf" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a>
    </aside>

    <main class="main">
      <div class="stats-bar">
        <div class="stat-box"><div class="stat-val" style="color:var(--teal)">${yearsExp}+</div><div class="stat-label">Years Experience</div></div>
        <div class="stat-box"><div class="stat-val" style="color:var(--coral)">${totalCompanies}</div><div class="stat-label">Positions</div></div>
        <div class="stat-box"><div class="stat-val" style="color:var(--violet)">${allKeywords.size}+</div><div class="stat-label">Technologies</div></div>
      </div>

      ${resume.work && resume.work.length ? `
      <div class="section">
        <div class="section-header">${icons.briefcase} <h2 class="section-title">Experience</h2></div>
        <div class="timeline">${workHtml}</div>
      </div>` : ''}

      ${resume.education && resume.education.length ? `
      <div class="section">
        <div class="section-header">${icons.graduation} <h2 class="section-title">Education</h2></div>
        <div class="edu-grid">${eduHtml}</div>
      </div>` : ''}

      ${resume.references && resume.references.length ? `
      <div class="section">
        <div class="section-header">${icons.users} <h2 class="section-title">References</h2></div>
        <div class="ref-grid">${referencesHtml}</div>
      </div>` : ''}

      ${resume.projects && resume.projects.length ? `
      <div class="section">
        <div class="section-header">${icons.folder} <h2 class="section-title">Projects</h2></div>
        <div class="proj-grid">${projectsHtml}</div>
      </div>` : ''}
    </main>
  </div>
</body>
</html>`;
};
