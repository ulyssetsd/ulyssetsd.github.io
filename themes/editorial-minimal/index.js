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

exports.pdfRenderOptions = {
  mediaType: 'print',
};

exports.render = function (resume) {
  const b = resume.basics || {};
  const github = (b.profiles || []).find(p => p.network === 'GitHub');
  const linkedin = (b.profiles || []).find(p => p.network === 'LinkedIn');

  const workHtml = (resume.work || []).map(job => {
    const end = job.endDate ? formatDate(job.endDate) : 'Present';
    const highlights = (job.highlights || []).map(h => `<li>${esc(h)}</li>`).join('');
    return `
      <div class="job">
        <div class="job-header">
          <div>
            <span class="job-position">${esc(job.position)}</span>
            <span class="job-sep"> · </span>
            <span class="job-company">${esc(job.name)}</span>
            ${job.location ? `<span class="job-sep"> · </span><span class="job-location">${esc(job.location)}</span>` : ''}
          </div>
          <span class="job-dates">${formatDate(job.startDate)} – ${end}</span>
        </div>
        ${job.summary ? `<p class="job-summary">${esc(job.summary)}</p>` : ''}
        ${highlights ? `<ul class="job-highlights">${highlights}</ul>` : ''}
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map(edu => `
    <div class="edu-item">
      <div class="edu-header">
        <div>
          <span class="edu-degree">${esc(edu.studyType)}${edu.area ? ` in ${esc(edu.area)}` : ''}</span>
          <span class="job-sep"> · </span>
          <span class="edu-school">${esc(edu.institution)}</span>
          ${edu.location ? `<span class="job-sep"> · </span><span class="edu-loc">${esc(edu.location)}</span>` : ''}
        </div>
        <span class="edu-dates">${esc(edu.startDate)} – ${esc(edu.endDate)}</span>
      </div>
      ${edu.summary ? `<p class="edu-summary">${esc(edu.summary)}</p>` : ''}
    </div>`).join('');

  const skillsHtml = (resume.skills || []).map(skill => `
    <div class="skill-row">
      <span class="skill-name">${esc(skill.name)}</span>
      <span class="skill-keywords">${(skill.keywords || []).map(esc).join(' · ')}</span>
    </div>`).join('');

  const langHtml = (resume.languages || []).map(lang => `
    <div class="lang-row">
      <span class="lang-name">${esc(lang.language)}</span>
      <div class="lang-right">
        <span class="lang-level">${esc(lang.fluency)}</span>
        ${lang.summary ? `<span class="lang-detail">${esc(lang.summary)}</span>` : ''}
      </div>
    </div>`).join('');

  const interestHtml = (resume.interests || []).map(i => `
    <div class="interest-item">
      <span class="interest-name">${esc(i.name)}</span>
      ${i.summary ? `<p class="interest-summary">${esc(i.summary)}</p>` : ''}
    </div>`).join('');

  const referencesHtml = (resume.references || []).map(ref => `
    <div class="ref-item">
      <span class="ref-name">${esc(ref.name)}</span>
      <span class="ref-role">${esc(ref.reference)}</span>
    </div>`).join('');

  const projectsHtml = (resume.projects || []).map(proj => `
    <div class="project-item">
      <div class="project-header">
        <div>
          <span class="project-name">${esc(proj.name)}</span>
          ${proj.url ? `<a href="${esc(proj.url)}" class="project-link" target="_blank" rel="noopener noreferrer"> ↗</a>` : ''}
        </div>
        <span class="project-dates">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</span>
      </div>
      ${proj.summary ? `<p class="project-summary">${esc(proj.summary)}</p>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.name)} — Resume</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: #2563eb;
      --text: #111111;
      --text-2: #333333;
      --muted: #888888;
      --rule: #dddddd;
    }

    body {
      font-family: Arial, 'Liberation Sans', sans-serif;
      font-size: 9.5pt;
      color: var(--text);
      background: white;
      line-height: 1.5;
      max-width: 680px;
      margin: 0 auto;
      padding: 48px;
    }

    a { color: var(--accent); text-decoration: none; }

    /* ── HEADER ─────────────────────────────── */
    .header {
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 22pt;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1.1;
      margin-bottom: 3px;
    }

    .header .label {
      font-size: 9.5pt;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .header-links {
      font-size: 8.5pt;
      color: var(--muted);
      margin-bottom: 10px;
    }

    .header-links a { color: var(--accent); }
    .header-links span { margin: 0 6px; color: var(--rule); }

    .header .summary {
      font-size: 9pt;
      color: var(--text-2);
      line-height: 1.5;
      border-left: 2px solid var(--accent);
      padding-left: 12px;
      font-style: italic;
    }

    /* ── SECTION ─────────────────────────────── */
    .section {
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      color: var(--accent);
      margin-bottom: 8px;
      padding-bottom: 3px;
      border-bottom: 2px solid var(--accent);
      display: inline-block;
    }

    /* ── JOB ─────────────────────────────── */
    .job { margin-bottom: 14px; }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 4px;
    }

    .job-position {
      font-weight: 700;
      font-size: 9.5pt;
    }

    .job-company {
      font-size: 9.5pt;
      font-style: italic;
    }
    .job-location {
      font-size: 9pt;
      color: var(--muted);
    }

    .job-sep { color: var(--muted); }

    .job-dates {
      font-size: 8.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .job-summary {
      font-size: 9pt;
      color: var(--text-2);
      margin: 2px 0 4px;
      line-height: 1.45;
    }

    .job-highlights {
      font-size: 9pt;
      color: var(--text-2);
      padding-left: 18px;
      line-height: 1.4;
    }

    .job-highlights li { margin-bottom: 2px; }

    /* ── EDUCATION ─────────────────────────────── */
    .edu-item { margin-bottom: 10px; }

    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 3px;
    }

    .edu-degree {
      font-weight: 700;
      font-size: 9.5pt;
    }

    .edu-school {
      font-style: italic;
    }

    .edu-loc {
      font-size: 9.5pt;
      color: var(--muted);
    }

    .edu-dates {
      font-size: 8.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .edu-summary {
      font-size: 9pt;
      color: var(--text-2);
      padding-left: 0;
      margin-top: 2px;
      line-height: 1.4;
    }

    /* ── SKILLS ─────────────────────────────── */
    .skill-row {
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
      font-size: 9pt;
      align-items: baseline;
    }

    .skill-name {
      font-weight: 700;
      min-width: 150px;
      flex-shrink: 0;
      color: var(--text);
    }

    .skill-keywords {
      color: var(--muted);
    }

    /* ── LANGUAGES ─────────────────────────────── */
    .lang-row {
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
      font-size: 9pt;
      align-items: flex-start;
    }

    .lang-name {
      font-weight: 700;
      min-width: 130px;
      flex-shrink: 0;
      padding-top: 1px;
    }

    .lang-right {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .lang-level { color: var(--muted); }

    .lang-detail {
      font-size: 8pt;
      color: var(--muted);
      font-style: italic;
    }

    /* ── INTERESTS ─────────────────────────────── */
    .interest-item {
      margin-bottom: 5px;
    }

    .interest-name {
      font-weight: 700;
      font-size: 9pt;
    }

    .interest-summary {
      font-size: 8.5pt;
      color: var(--muted);
      margin-top: 1px;
      line-height: 1.4;
    }

    /* ── REFERENCES ─────────────────────────────── */
    .ref-item {
      display: flex;
      gap: 10px;
      margin-bottom: 3px;
      font-size: 9pt;
      align-items: baseline;
    }

    .ref-name {
      font-weight: 700;
      min-width: 150px;
      flex-shrink: 0;
    }

    .ref-role {
      color: var(--muted);
    }

    /* ── PROJECTS ─────────────────────────────── */
    .project-item { margin-bottom: 8px; }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 4px;
    }

    .project-name {
      font-weight: 700;
      font-size: 9.5pt;
    }

    .project-link {
      font-size: 8.5pt;
      color: var(--accent);
    }

    .project-dates {
      font-size: 8.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .project-summary {
      font-size: 9pt;
      color: var(--text-2);
      line-height: 1.4;
    }

    /* ── SCREEN ─────────────────────────────── */
    @media screen {
      body {
        font-size: 15px;
        max-width: 860px;
        padding: 48px;
        line-height: 1.6;
      }

      .header { margin-bottom: 28px; }
      .header h1 { font-size: 36px; margin-bottom: 6px; }
      .header .label { font-size: 15px; margin-bottom: 12px; }
      .header-links { font-size: 14px; margin-bottom: 16px; }
      .header .summary { font-size: 14px; padding-left: 16px; }

      .section { margin-bottom: 28px; }
      .section-title { font-size: 11px; margin-bottom: 14px; padding-bottom: 5px; }

      .job { margin-bottom: 22px; }
      .job-position { font-size: 15px; }
      .job-company { font-size: 15px; }
      .job-location { font-size: 14px; }
      .job-dates { font-size: 13px; }
      .job-summary { font-size: 14px; margin: 4px 0 8px; }
      .job-highlights { font-size: 14px; padding-left: 22px; }
      .job-highlights li { margin-bottom: 4px; }

      .edu-item { margin-bottom: 16px; }
      .edu-degree { font-size: 15px; }
      .edu-dates { font-size: 13px; }
      .edu-summary { font-size: 14px; }

      .skill-row { font-size: 14px; margin-bottom: 6px; gap: 16px; }
      .skill-name { min-width: 180px; }

      .lang-row { font-size: 14px; margin-bottom: 6px; gap: 16px; }
      .lang-name { min-width: 160px; }
      .lang-detail { font-size: 13px; }

      .interest-name { font-size: 14px; }
      .interest-summary { font-size: 13px; }

      .ref-item { font-size: 14px; margin-bottom: 6px; gap: 16px; }
      .ref-name { min-width: 180px; }

      .project-item { margin-bottom: 14px; }
      .project-name { font-size: 15px; }
      .project-dates { font-size: 13px; }
      .project-summary { font-size: 14px; }
    }

    /* ── PRINT ─────────────────────────────── */
    @page {
      margin: 2cm;
    }

    @media print {
      body {
        max-width: 100%;
        padding: 0;
        font-size: 9pt;
        line-height: 1.45;
        orphans: 3;
        widows: 3;
      }

      .header { margin-bottom: 16px; }
      .header h1 { font-size: 18pt; }
      .section { margin-bottom: 12px; }
      .section-title { break-after: avoid; }
      .job { margin-bottom: 12px; }
      .job-header { break-after: avoid; }
      .edu-item { break-inside: avoid; }
      .project-item { break-inside: avoid; }
      .ref-item { break-inside: avoid; }
      .dl-pdf { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${esc(b.name)}</h1>
    ${b.label ? `<div class="label">${esc(b.label)}</div>` : ''}
    <div class="header-links">
      ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
      ${b.phone ? `<span>·</span><a href="tel:${esc(b.phone.replace(/\s/g, ''))}">${esc(b.phone)}</a>` : ''}
      ${github ? `<span>·</span><a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">github.com/${esc(github.username)}</a>` : ''}
      ${linkedin ? `<span>·</span><a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/${esc(linkedin.username)}</a>` : ''}
      <span class="dl-pdf">·</span><a class="dl-pdf" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View PDF</a>
    </div>
    ${b.summary ? `<p class="summary">${esc(b.summary)}</p>` : ''}
  </div>

  ${resume.work && resume.work.length ? `
  <div class="section">
    <h2 class="section-title">Experience</h2>
    ${workHtml}
  </div>` : ''}

  ${resume.education && resume.education.length ? `
  <div class="section">
    <h2 class="section-title">Education</h2>
    ${eduHtml}
  </div>` : ''}

  ${resume.skills && resume.skills.length ? `
  <div class="section">
    <h2 class="section-title">Skills</h2>
    ${skillsHtml}
  </div>` : ''}

  ${resume.languages && resume.languages.length ? `
  <div class="section">
    <h2 class="section-title">Languages</h2>
    ${langHtml}
  </div>` : ''}

  ${resume.interests && resume.interests.length ? `
  <div class="section">
    <h2 class="section-title">Interests</h2>
    ${interestHtml}
  </div>` : ''}

  ${resume.references && resume.references.length ? `
  <div class="section">
    <h2 class="section-title">References</h2>
    ${referencesHtml}
  </div>` : ''}

  ${resume.projects && resume.projects.length ? `
  <div class="section">
    <h2 class="section-title">Projects</h2>
    ${projectsHtml}
  </div>` : ''}
</body>
</html>`;
};
