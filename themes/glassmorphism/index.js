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

exports.pdfRenderOptions = { mediaType: 'print' };

exports.render = function (resume) {
  const b = resume.basics || {};
  const github = (b.profiles || []).find(p => p.network === 'GitHub');
  const linkedin = (b.profiles || []).find(p => p.network === 'LinkedIn');

  const workHtml = (resume.work || []).map((job, i) => {
    const end = job.endDate ? formatDate(job.endDate) : 'Present';
    const highlights = (job.highlights || []).map(h => `<li>${esc(h)}</li>`).join('');
    return `
      <div class="glass-card fade-up" style="animation-delay:${0.1 * i}s">
        <div class="tl-marker">
          <div class="tl-dot"></div>
          ${i < (resume.work || []).length - 1 ? '<div class="tl-line"></div>' : ''}
        </div>
        <div class="tl-body">
          <div class="job-header">
            <div>
              <div class="job-position">${esc(job.position)}</div>
              <div class="job-company">${esc(job.name)}${job.location ? ` · ${esc(job.location)}` : ''}</div>
            </div>
            <span class="job-dates">${formatDate(job.startDate)} – ${end}</span>
          </div>
          ${job.summary ? `<p class="job-summary">${esc(job.summary)}</p>` : ''}
          ${highlights ? `<ul class="job-highlights">${highlights}</ul>` : ''}
        </div>
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map((edu, i) => `
    <div class="glass-card fade-up" style="animation-delay:${0.1 * i}s">
      <div class="edu-degree">${esc(edu.studyType)}${edu.area ? ` — ${esc(edu.area)}` : ''}</div>
      <div class="edu-school">${esc(edu.institution)}${edu.location ? ` · ${esc(edu.location)}` : ''}</div>
      <div class="edu-dates">${esc(edu.startDate)} – ${esc(edu.endDate)}</div>
      ${edu.summary ? `<p class="edu-summary">${esc(edu.summary)}</p>` : ''}
    </div>`).join('');

  const skillsHtml = (resume.skills || []).map((skill, i) => {
    const pct = skillPercent(skill.level);
    return `
      <div class="skill-item fade-up" style="animation-delay:${0.05 * i}s">
        <div class="skill-header">
          <span class="skill-name">${esc(skill.name)}</span>
          <span class="skill-pct">${pct}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-fill" style="width:${pct}%;"></div>
        </div>
        <div class="skill-tags">
          ${(skill.keywords || []).map(k => `<span class="glass-pill">${esc(k)}</span>`).join('')}
        </div>
      </div>`;
  }).join('');

  const langHtml = (resume.languages || []).map(lang => `
    <div class="lang-item">
      <span class="lang-name">${esc(lang.language)}</span>
      <span class="lang-fluency">${esc(lang.fluency)}</span>
      ${lang.summary ? `<div class="lang-detail">${esc(lang.summary)}</div>` : ''}
    </div>`).join('');

  const interestHtml = (resume.interests || []).map(i => `
    <div class="interest-item">
      <span class="interest-name">${esc(i.name)}</span>
      ${i.summary ? `<span class="interest-desc">${esc(i.summary)}</span>` : ''}
    </div>`).join('');

  const referencesHtml = (resume.references || []).map(ref => `
    <div class="ref-item">
      <span class="ref-name">${esc(ref.name)}</span>
      <span class="ref-role">${esc(ref.reference)}</span>
    </div>`).join('');

  const projectsHtml = (resume.projects || []).map((proj, i) => `
    <div class="glass-card fade-up" style="animation-delay:${0.1 * i}s">
      <div class="proj-header">
        <span class="proj-name">${esc(proj.name)}</span>
        ${proj.url ? `<a href="${esc(proj.url)}" class="proj-link" target="_blank" rel="noopener noreferrer">↗</a>` : ''}
      </div>
      <div class="proj-dates">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</div>
      ${proj.summary ? `<p class="proj-summary">${esc(proj.summary)}</p>` : ''}
      ${proj.keywords ? `<div class="proj-tags">${(proj.keywords || []).map(k => `<span class="glass-pill">${esc(k)}</span>`).join('')}</div>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.name)} — Glassmorphism Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --glass-bg: rgba(255, 255, 255, 0.12);
      --glass-border: rgba(255, 255, 255, 0.2);
      --glass-shadow: rgba(0, 0, 0, 0.1);
      --text: #ffffff;
      --text2: rgba(255, 255, 255, 0.8);
      --text3: rgba(255, 255, 255, 0.55);
      --accent: #a78bfa;
      --accent2: #67e8f9;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%);
      background-attachment: fixed;
      padding: 40px 20px;
    }

    /* Floating orbs */
    body::before, body::after {
      content: '';
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      pointer-events: none;
      z-index: 0;
    }
    body::before {
      width: 500px; height: 500px;
      background: #7c3aed;
      top: -100px; left: -100px;
      animation: float1 20s ease-in-out infinite;
    }
    body::after {
      width: 400px; height: 400px;
      background: #06b6d4;
      bottom: -100px; right: -100px;
      animation: float2 25s ease-in-out infinite;
    }

    @keyframes float1 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(100px, 80px); }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-80px, -60px); }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-up {
      animation: fadeUp 0.6s ease forwards;
      opacity: 0;
    }

    .container {
      max-width: 860px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    a { color: var(--accent2); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── GLASS CARD ─────────────────────────────── */
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 16px;
      box-shadow: 0 8px 32px var(--glass-shadow);
    }

    /* ── HEADER ─────────────────────────────── */
    .header {
      text-align: center;
      margin-bottom: 36px;
      padding: 40px 32px;
    }

    .header h1 {
      font-size: 42px;
      font-weight: 800;
      letter-spacing: -1px;
      background: linear-gradient(135deg, #ffffff, #a78bfa, #67e8f9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    .header .label {
      font-size: 14px;
      color: var(--text3);
      margin-bottom: 16px;
      font-weight: 500;
    }

    .header-links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px 20px;
      font-size: 13px;
      margin-bottom: 18px;
    }
    .header-links a { color: var(--accent2); }

    .header .summary {
      font-size: 14px;
      color: var(--text2);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
      font-style: italic;
    }

    .dl-pdf {
      display: inline-block;
      margin-top: 14px;
      font-size: 12px;
      padding: 6px 16px;
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      color: var(--accent2);
      backdrop-filter: blur(10px);
    }

    /* ── SECTION ─────────────────────────────── */
    .section {
      margin-bottom: 36px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--accent);
      margin-bottom: 18px;
      text-align: center;
    }

    /* ── EXPERIENCE TIMELINE ─────────────────── */
    .glass-card.fade-up {
      display: flex;
      gap: 16px;
    }

    .tl-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 20px;
      padding-top: 6px;
    }
    .tl-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      box-shadow: 0 0 12px rgba(167, 139, 250, 0.5);
      flex-shrink: 0;
    }
    .tl-line {
      width: 2px;
      flex: 1;
      background: linear-gradient(180deg, var(--accent), transparent);
      margin-top: 4px;
      border-radius: 1px;
    }
    .tl-body { flex: 1; min-width: 0; }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 6px;
    }
    .job-position { font-weight: 700; font-size: 15px; }
    .job-company { font-size: 12px; color: var(--text3); }
    .job-dates { font-size: 11px; color: var(--text3); white-space: nowrap; flex-shrink: 0; padding-top: 3px; }
    .job-summary { font-size: 12px; color: var(--text2); margin-bottom: 6px; line-height: 1.5; }
    .job-highlights {
      font-size: 12px;
      color: var(--text2);
      padding-left: 16px;
      line-height: 1.5;
    }
    .job-highlights li { margin-bottom: 2px; }

    /* ── EDUCATION ─────────────────────────────── */
    .edu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
    .edu-grid .glass-card { margin-bottom: 0; display: block; }
    .edu-degree { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
    .edu-school { font-size: 12px; color: var(--text2); }
    .edu-dates { font-size: 11px; color: var(--text3); }
    .edu-summary { font-size: 11px; color: var(--text2); margin-top: 8px; line-height: 1.4; }

    /* ── SKILLS ─────────────────────────────── */
    .skills-container {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 24px;
    }
    .skill-item { margin-bottom: 16px; }
    .skill-item:last-child { margin-bottom: 0; }
    .skill-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .skill-name { font-weight: 700; font-size: 13px; }
    .skill-pct { font-size: 12px; color: var(--accent); font-weight: 600; }
    .skill-bar {
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    .skill-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      border-radius: 3px;
      transition: width 1.2s ease;
    }
    .skill-tags { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px; }

    .glass-pill {
      display: inline-block;
      font-size: 10px;
      padding: 3px 10px;
      border-radius: 20px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      color: var(--text2);
      backdrop-filter: blur(4px);
    }

    /* ── LANGUAGES ─────────────────────────────── */
    .lang-container {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 24px;
    }
    .lang-item { margin-bottom: 10px; }
    .lang-item:last-child { margin-bottom: 0; }
    .lang-name { font-weight: 700; font-size: 13px; display: inline-block; min-width: 140px; }
    .lang-fluency { font-size: 12px; color: var(--accent2); }
    .lang-detail { font-size: 11px; color: var(--text3); margin-top: 2px; padding-left: 140px; }

    /* ── INTERESTS ─────────────────────────────── */
    .interests-container {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .interest-item { flex: 1; min-width: 200px; }
    .interest-name { font-weight: 700; font-size: 13px; display: block; }
    .interest-desc { font-size: 11px; color: var(--text3); display: block; margin-top: 3px; }

    /* ── REFERENCES ─────────────────────────────── */
    .refs-container {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 24px;
    }
    .ref-item { margin-bottom: 8px; }
    .ref-item:last-child { margin-bottom: 0; }
    .ref-name { font-weight: 700; font-size: 13px; }
    .ref-role { font-size: 12px; color: var(--text3); margin-left: 8px; }

    /* ── PROJECTS ─────────────────────────────── */
    .proj-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
    .proj-grid .glass-card { margin-bottom: 0; display: block; }
    .proj-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    .proj-name { font-weight: 700; font-size: 14px; }
    .proj-link { color: var(--accent2); font-size: 16px; }
    .proj-dates { font-size: 11px; color: var(--text3); margin-top: 2px; }
    .proj-summary { font-size: 11px; color: var(--text2); margin-top: 6px; line-height: 1.4; }
    .proj-tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }

    /* ── RESPONSIVE ─────────────────────────────── */
    @media screen and (max-width: 600px) {
      body { padding: 20px 12px; }
      .header { padding: 24px 16px; }
      .header h1 { font-size: 28px; }
      .glass-card { padding: 14px 16px; }
      .lang-detail { padding-left: 0; }
    }

    /* ── PRINT ─────────────────────────────── */
    @page { margin: 1.5cm; }

    @media print {
      :root {
        --glass-bg: #f8f9fa;
        --glass-border: #dee2e6;
        --glass-shadow: transparent;
        --text: #1a1a1a;
        --text2: #444444;
        --text3: #777777;
        --accent: #6d28d9;
        --accent2: #0891b2;
      }

      body {
        background: white;
        padding: 0;
        font-size: 9pt;
        line-height: 1.45;
      }

      body::before, body::after { display: none; }

      .container { max-width: 100%; }

      .fade-up { animation: none; opacity: 1; }

      .glass-card, .skills-container, .lang-container, .interests-container, .refs-container {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        background: var(--glass-bg);
        border-color: var(--glass-border);
        box-shadow: none;
      }

      .header {
        margin-bottom: 16px;
        padding: 20px;
      }
      .header h1 {
        font-size: 22pt;
        background: none;
        -webkit-text-fill-color: var(--text);
        color: var(--text);
      }

      .tl-dot { box-shadow: none; }

      .skill-fill {
        background: var(--accent);
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .glass-pill {
        backdrop-filter: none;
        background: #e9ecef;
        border-color: #dee2e6;
        color: var(--text2);
      }

      .section { margin-bottom: 16px; }
      .section-title { break-after: avoid; }
      .glass-card { break-inside: avoid; }
      .dl-pdf { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header glass-card fade-up">
      <h1>${esc(b.name)}</h1>
      ${b.label ? `<div class="label">${esc(b.label)}</div>` : ''}
      <div class="header-links">
        ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
        ${b.phone ? `<a href="tel:${esc(b.phone.replace(/\\s/g, ''))}">${esc(b.phone)}</a>` : ''}
        ${github ? `<a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
        ${linkedin ? `<a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
      </div>
      ${b.summary ? `<p class="summary">${esc(b.summary)}</p>` : ''}
      <a class="dl-pdf" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View PDF</a>
    </div>

    ${resume.work && resume.work.length ? `
    <div class="section">
      <h2 class="section-title">Experience</h2>
      ${workHtml}
    </div>` : ''}

    ${resume.education && resume.education.length ? `
    <div class="section">
      <h2 class="section-title">Education</h2>
      <div class="edu-grid">${eduHtml}</div>
    </div>` : ''}

    ${resume.skills && resume.skills.length ? `
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-container fade-up">${skillsHtml}</div>
    </div>` : ''}

    ${resume.languages && resume.languages.length ? `
    <div class="section">
      <h2 class="section-title">Languages</h2>
      <div class="lang-container fade-up">${langHtml}</div>
    </div>` : ''}

    ${resume.interests && resume.interests.length ? `
    <div class="section">
      <h2 class="section-title">Interests</h2>
      <div class="interests-container fade-up">${interestHtml}</div>
    </div>` : ''}

    ${resume.references && resume.references.length ? `
    <div class="section">
      <h2 class="section-title">References</h2>
      <div class="refs-container fade-up">${referencesHtml}</div>
    </div>` : ''}

    ${resume.projects && resume.projects.length ? `
    <div class="section">
      <h2 class="section-title">Projects</h2>
      <div class="proj-grid">${projectsHtml}</div>
    </div>` : ''}
  </div>
</body>
</html>`;
};
