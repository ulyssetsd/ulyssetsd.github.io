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

function asciiBar(pct) {
  const filled = Math.round(pct / 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` ${pct}%`;
}

exports.pdfRenderOptions = { mediaType: 'print' };

exports.render = function (resume) {
  const b = resume.basics || {};
  const github = (b.profiles || []).find(p => p.network === 'GitHub');
  const linkedin = (b.profiles || []).find(p => p.network === 'LinkedIn');

  const workHtml = (resume.work || []).map((job, i, arr) => {
    const end = job.endDate ? formatDate(job.endDate) : 'Present';
    const connector = i < arr.length - 1 ? '├──' : '└──';
    const pipe = i < arr.length - 1 ? '│' : ' ';
    const highlights = (job.highlights || []).map(h =>
      `<div class="hl-line"><span class="pipe">${pipe}</span>  <span class="hl-marker">▸</span> <span class="hl-text">${esc(h)}</span></div>`
    ).join('');
    return `
      <div class="job">
        <div class="job-header">
          <span class="tree-conn">${connector}</span>
          <span class="job-position">${esc(job.position)}</span>
          <span class="job-at"> @ </span>
          <span class="job-company">${esc(job.name)}</span>
          ${job.location ? `<span class="job-loc"> [${esc(job.location)}]</span>` : ''}
        </div>
        <div class="job-meta"><span class="pipe">${pipe}</span>  <span class="date-range">${formatDate(job.startDate)} → ${end}</span></div>
        ${job.summary ? `<div class="job-desc"><span class="pipe">${pipe}</span>  ${esc(job.summary)}</div>` : ''}
        ${highlights}
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map((edu, i, arr) => {
    const connector = i < arr.length - 1 ? '├──' : '└──';
    return `
      <div class="edu-item">
        <span class="tree-conn">${connector}</span>
        <span class="edu-degree">${esc(edu.studyType)}${edu.area ? ` in ${esc(edu.area)}` : ''}</span>
        <span class="job-at"> @ </span>
        <span class="edu-school">${esc(edu.institution)}</span>
        <span class="date-range"> (${esc(edu.startDate)} – ${esc(edu.endDate)})</span>
        ${edu.summary ? `<div class="edu-summary">${edu.location ? `[${esc(edu.location)}] ` : ''}${esc(edu.summary)}</div>` : ''}
      </div>`;
  }).join('');

  const skillsHtml = (resume.skills || []).map(skill => {
    const pct = skillPercent(skill.level);
    return `
      <div class="skill-row">
        <span class="skill-name">${esc(skill.name)}</span>
        <span class="skill-bar">${asciiBar(pct)}</span>
        <div class="skill-kw">${(skill.keywords || []).map(k => `<span class="kw-tag">${esc(k)}</span>`).join(' ')}</div>
      </div>`;
  }).join('');

  const langHtml = (resume.languages || []).map(lang => `
    <div class="lang-row">
      <span class="lang-name">${esc(lang.language)}</span>
      <span class="lang-fluency">${esc(lang.fluency)}</span>
      ${lang.summary ? `<span class="lang-detail">// ${esc(lang.summary)}</span>` : ''}
    </div>`).join('');

  const interestHtml = (resume.interests || []).map(i => `
    <div class="interest-item">
      <span class="prompt-caret">▸</span> <span class="interest-name">${esc(i.name)}</span>
      ${i.summary ? `<span class="interest-desc"> — ${esc(i.summary)}</span>` : ''}
    </div>`).join('');

  const referencesHtml = (resume.references || []).map(ref => `
    <div class="ref-item">
      <span class="prompt-caret">▸</span> <span class="ref-name">${esc(ref.name)}</span>
      <span class="ref-role"> — ${esc(ref.reference)}</span>
    </div>`).join('');

  const projectsHtml = (resume.projects || []).map(proj => `
    <div class="proj-item">
      <span class="proj-name">${esc(proj.name)}</span>
      ${proj.url ? `<a href="${esc(proj.url)}" class="proj-link" target="_blank" rel="noopener noreferrer">[↗ repo]</a>` : ''}
      <span class="date-range">${formatDate(proj.startDate)} → ${formatDate(proj.endDate)}</span>
      ${proj.summary ? `<div class="proj-desc">${esc(proj.summary)}</div>` : ''}
      ${proj.keywords ? `<div class="proj-kw">${(proj.keywords || []).map(k => `<span class="kw-tag">${esc(k)}</span>`).join(' ')}</div>` : ''}
    </div>`).join('');

  // Compute stats
  const yearsExp = new Date().getFullYear() - 2015;
  const totalCompanies = (resume.work || []).filter(w => w.position && !w.position.toLowerCase().includes('volunteer') && !w.position.toLowerCase().includes('child')).length;
  const allKeywords = new Set();
  (resume.skills || []).forEach(s => (s.keywords || []).forEach(k => allKeywords.add(k)));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.name)} — Terminal Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d1117;
      --bg2: #161b22;
      --green: #00ff41;
      --cyan: #00d4ff;
      --amber: #ffb700;
      --red: #ff6b6b;
      --text: #c9d1d9;
      --muted: #6e7681;
      --border: #30363d;
    }

    body {
      font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace;
      font-size: 13px;
      color: var(--text);
      background: var(--bg);
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 32px;
      position: relative;
    }

    /* Scanline effect */
    body::after {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 65, 0.015) 2px,
        rgba(0, 255, 65, 0.015) 4px
      );
      pointer-events: none;
      z-index: 9999;
    }

    a { color: var(--cyan); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── HEADER ─────────────────────────────── */
    .header {
      margin-bottom: 32px;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 24px;
      background: var(--bg2);
    }

    .header-top {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 6px;
    }

    .prompt { color: var(--green); }
    .cursor {
      display: inline-block;
      width: 8px;
      height: 16px;
      background: var(--green);
      animation: blink 1s step-end infinite;
      vertical-align: text-bottom;
      margin-left: 2px;
    }
    @keyframes blink { 50% { opacity: 0; } }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--green);
      display: inline;
    }

    .header .label {
      font-size: 12px;
      color: var(--muted);
      margin: 6px 0 12px;
    }

    .header-links {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
      font-size: 12px;
      margin-bottom: 14px;
    }

    .header-links a::before { content: '→ '; color: var(--muted); }

    .header .summary {
      font-size: 12px;
      color: var(--text);
      border-left: 2px solid var(--green);
      padding-left: 12px;
      margin-top: 12px;
      font-style: italic;
      opacity: 0.85;
    }

    .stats-row {
      display: flex;
      gap: 24px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed var(--border);
      font-size: 11px;
    }
    .stat-item { color: var(--muted); }
    .stat-val { color: var(--amber); font-weight: 700; }

    /* ── SECTION ─────────────────────────────── */
    .section {
      margin-bottom: 28px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--amber);
      margin-bottom: 14px;
    }
    .section-title .cmd { color: var(--green); }
    .section-title .arg { color: var(--cyan); }

    /* ── WORK ─────────────────────────────── */
    .job { margin-bottom: 14px; font-size: 12px; }

    .job-header {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0;
    }

    .tree-conn { color: var(--muted); margin-right: 8px; }
    .pipe { color: var(--muted); }
    .job-position { color: var(--cyan); font-weight: 700; }
    .job-at { color: var(--muted); }
    .job-company { color: var(--green); }
    .job-loc { color: var(--muted); font-size: 11px; }

    .job-meta {
      font-size: 11px;
      margin: 2px 0;
      padding-left: 28px;
    }
    .date-range { color: var(--amber); }

    .job-desc {
      font-size: 11px;
      color: var(--text);
      padding-left: 28px;
      margin: 3px 0;
      opacity: 0.8;
    }

    .hl-line {
      font-size: 11px;
      padding-left: 28px;
      margin: 1px 0;
    }
    .hl-marker { color: var(--green); }
    .hl-text { color: var(--text); opacity: 0.75; }

    /* ── EDUCATION ─────────────────────────────── */
    .edu-item {
      margin-bottom: 8px;
      font-size: 12px;
    }
    .edu-degree { color: var(--cyan); font-weight: 700; }
    .edu-school { color: var(--green); }
    .edu-summary {
      font-size: 11px;
      color: var(--text);
      opacity: 0.7;
      padding-left: 28px;
      margin-top: 2px;
    }

    /* ── SKILLS ─────────────────────────────── */
    .skill-row {
      margin-bottom: 10px;
      font-size: 12px;
    }
    .skill-name {
      color: var(--cyan);
      font-weight: 700;
      display: inline-block;
      min-width: 200px;
    }
    .skill-bar {
      color: var(--green);
      font-size: 11px;
    }
    .skill-kw {
      padding-left: 16px;
      margin-top: 2px;
    }
    .kw-tag {
      display: inline-block;
      font-size: 10px;
      padding: 1px 6px;
      border: 1px solid var(--border);
      border-radius: 3px;
      color: var(--muted);
      margin: 1px 2px;
    }

    /* ── LANGUAGES ─────────────────────────────── */
    .lang-row {
      margin-bottom: 5px;
      font-size: 12px;
    }
    .lang-name { color: var(--cyan); font-weight: 700; min-width: 160px; display: inline-block; }
    .lang-fluency { color: var(--green); }
    .lang-detail { color: var(--muted); font-size: 11px; display: block; padding-left: 16px; }

    /* ── INTERESTS ─────────────────────────────── */
    .interest-item { margin-bottom: 5px; font-size: 12px; }
    .interest-name { color: var(--cyan); font-weight: 700; }
    .interest-desc { color: var(--text); opacity: 0.7; font-size: 11px; }

    /* ── REFERENCES ─────────────────────────────── */
    .ref-item { margin-bottom: 4px; font-size: 12px; }
    .ref-name { color: var(--cyan); font-weight: 700; }
    .ref-role { color: var(--muted); font-size: 11px; }

    .prompt-caret { color: var(--green); }

    /* ── PROJECTS ─────────────────────────────── */
    .proj-item {
      margin-bottom: 10px;
      font-size: 12px;
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--bg2);
    }
    .proj-name { color: var(--cyan); font-weight: 700; }
    .proj-link { color: var(--green); font-size: 11px; margin-left: 8px; }
    .proj-desc { color: var(--text); opacity: 0.7; font-size: 11px; margin-top: 4px; }
    .proj-kw { margin-top: 4px; }

    .dl-pdf {
      font-size: 11px;
    }
    .dl-pdf::before { content: '→ '; color: var(--muted); }

    /* ── SCREEN ─────────────────────────────── */
    @media screen and (max-width: 600px) {
      body { padding: 20px 12px; font-size: 11px; }
      .header { padding: 16px; }
      .header h1 { font-size: 18px; }
      .skill-name { min-width: 120px; }
    }

    /* ── PRINT ─────────────────────────────── */
    @page { margin: 1.5cm; }

    @media print {
      :root {
        --bg: #ffffff;
        --bg2: #f6f8fa;
        --green: #116329;
        --cyan: #0550ae;
        --amber: #953800;
        --text: #1f2328;
        --muted: #656d76;
        --border: #d0d7de;
      }

      body {
        background: white;
        max-width: 100%;
        padding: 0;
        font-size: 9pt;
        line-height: 1.45;
      }

      body::after { display: none; }

      .cursor { display: none; }

      .header { border-color: var(--border); }
      .section-title { break-after: avoid; }
      .job { break-inside: avoid; }
      .edu-item { break-inside: avoid; }
      .proj-item { break-inside: avoid; }
      .dl-pdf { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-top">
      <span class="prompt">❯</span>
      <h1>${esc(b.name)}</h1>
      <span class="cursor"></span>
    </div>
    ${b.label ? `<div class="label">// ${esc(b.label)}</div>` : ''}
    <div class="header-links">
      ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
      ${b.phone ? `<a href="tel:${esc(b.phone.replace(/\\s/g, ''))}">${esc(b.phone)}</a>` : ''}
      ${github ? `<a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">github/${esc(github.username)}</a>` : ''}
      ${linkedin ? `<a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">linkedin/${esc(linkedin.username)}</a>` : ''}
      <a class="dl-pdf" href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume.pdf</a>
    </div>
    ${b.summary ? `<p class="summary">${esc(b.summary)}</p>` : ''}
    <div class="stats-row">
      <span class="stat-item"><span class="stat-val">${yearsExp}+</span> yrs exp</span>
      <span class="stat-item"><span class="stat-val">${totalCompanies}</span> companies</span>
      <span class="stat-item"><span class="stat-val">${allKeywords.size}+</span> technologies</span>
    </div>
  </div>

  ${resume.work && resume.work.length ? `
  <div class="section">
    <div class="section-title"><span class="cmd">$</span> <span class="arg">cat</span> experience.log</div>
    ${workHtml}
  </div>` : ''}

  ${resume.education && resume.education.length ? `
  <div class="section">
    <div class="section-title"><span class="cmd">$</span> <span class="arg">cat</span> education.log</div>
    ${eduHtml}
  </div>` : ''}

  ${resume.skills && resume.skills.length ? `
  <div class="section">
    <div class="section-title"><span class="cmd">$</span> <span class="arg">ls</span> -la ./skills/</div>
    ${skillsHtml}
  </div>` : ''}

  ${resume.languages && resume.languages.length ? `
  <div class="section">
    <div class="section-title"><span class="cmd">$</span> <span class="arg">echo</span> $LANGUAGES</div>
    ${langHtml}
  </div>` : ''}

  ${resume.interests && resume.interests.length ? `
  <div class="section">
    <div class="section-title"><span class="cmd">$</span> <span class="arg">cat</span> interests.md</div>
    ${interestHtml}
  </div>` : ''}

  ${resume.references && resume.references.length ? `
  <div class="section">
    <div class="section-title"><span class="cmd">$</span> <span class="arg">cat</span> references.txt</div>
    ${referencesHtml}
  </div>` : ''}

  ${resume.projects && resume.projects.length ? `
  <div class="section">
    <div class="section-title"><span class="cmd">$</span> <span class="arg">ls</span> ~/projects/</div>
    ${projectsHtml}
  </div>` : ''}
</body>
</html>`;
};
