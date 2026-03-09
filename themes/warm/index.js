'use strict';

const { formatDate, esc } = require('../_shared/helpers');

exports.pdfRenderOptions = { mediaType: 'print' };

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
            <span class="job-title">${esc(job.position)}</span>
            <span class="job-at"> at </span>
            <span class="job-company">${esc(job.name)}</span>
            ${job.location ? `<span class="job-loc"> · ${esc(job.location)}</span>` : ''}
          </div>
          <span class="job-dates">${formatDate(job.startDate)} – ${end}</span>
        </div>
        ${job.summary ? `<p class="job-summary">${esc(job.summary)}</p>` : ''}
        ${highlights ? `<ul class="job-hl">${highlights}</ul>` : ''}
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map(edu => `
    <div class="edu">
      <div class="edu-header">
        <div>
          <span class="edu-degree">${esc(edu.studyType)}${edu.area ? ` in ${esc(edu.area)}` : ''}</span>
          <span class="edu-school"> · ${esc(edu.institution)}${edu.location ? `, ${esc(edu.location)}` : ''}</span>
        </div>
        <span class="edu-dates">${esc(edu.startDate)} – ${esc(edu.endDate)}</span>
      </div>
      ${edu.summary ? `<p class="edu-summary">${esc(edu.summary)}</p>` : ''}
    </div>`).join('');

  const skillsHtml = (resume.skills || []).map(skill => `
    <div class="skill-item">
      <div class="skill-name">${esc(skill.name)}</div>
      <div class="skill-kw">${(skill.keywords || []).map(esc).join(' · ')}</div>
    </div>`).join('');

  const langHtml = (resume.languages || []).map(lang => `
    <div class="lang-item">
      <span class="lang-name">${esc(lang.language)}</span>
      <span class="lang-fluency">${esc(lang.fluency)}</span>
      ${lang.summary ? `<div class="lang-detail">${esc(lang.summary)}</div>` : ''}
    </div>`).join('');

  const interestHtml = (resume.interests || []).map(i => `
    <div class="interest-item">
      <span class="interest-name">${esc(i.name)}</span>
      ${i.summary ? `<span class="interest-desc"> — ${esc(i.summary)}</span>` : ''}
    </div>`).join('');

  const referencesHtml = (resume.references || []).map(ref => `
    <div class="ref-item">
      <span class="ref-name">${esc(ref.name)}</span>
      <span class="ref-role">${esc(ref.reference)}</span>
    </div>`).join('');

  const projectsHtml = (resume.projects || []).map(proj => `
    <div class="proj-item">
      <div class="proj-header">
        <span class="proj-name">${esc(proj.name)}${proj.url ? ` <a href="${esc(proj.url)}" target="_blank" rel="noopener noreferrer">↗</a>` : ''}</span>
        <span class="proj-dates">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</span>
      </div>
      ${proj.summary ? `<p class="proj-summary">${esc(proj.summary)}</p>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.name)} — Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #fefcf8;
      --text: #2c2420;
      --text2: #4a3f38;
      --muted: #8a7e76;
      --accent: #b85c38;
      --rule: #d9cfc5;
      --rule-light: #ebe5dd;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 9.5pt;
      color: var(--text);
      background: var(--bg);
      line-height: 1.55;
      max-width: 700px;
      margin: 0 auto;
      padding: 56px 48px;
    }

    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── HEADER ── */
    .header {
      text-align: center;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--rule);
    }

    .header h1 {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 28pt;
      font-weight: 400;
      line-height: 1.1;
      margin-bottom: 4px;
      color: var(--text);
    }

    .label {
      font-size: 9.5pt;
      color: var(--muted);
      margin-bottom: 10px;
    }

    .contact {
      font-size: 8.5pt;
      color: var(--muted);
    }

    .contact a { color: var(--accent); }
    .contact .sep { margin: 0 6px; color: var(--rule); }

    .summary {
      margin-top: 14px;
      font-size: 9.5pt;
      color: var(--text2);
      line-height: 1.6;
      font-style: italic;
      max-width: 580px;
      margin-left: auto;
      margin-right: auto;
    }

    /* ── SECTION ── */
    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 13pt;
      font-weight: 400;
      color: var(--accent);
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--rule-light);
    }

    /* ── WORK ── */
    .job {
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--rule-light);
    }
    .job:last-child { border-bottom: none; padding-bottom: 0; }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 4px;
    }

    .job-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
      font-size: 11pt;
    }

    .job-at { color: var(--muted); font-size: 9pt; }
    .job-company { font-size: 9.5pt; }
    .job-loc { font-size: 8.5pt; color: var(--muted); }

    .job-dates {
      font-size: 8.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .job-summary {
      font-size: 9pt;
      color: var(--text2);
      line-height: 1.5;
      margin-bottom: 4px;
    }

    .job-hl {
      font-size: 8.5pt;
      color: var(--text2);
      padding-left: 18px;
      line-height: 1.45;
    }

    .job-hl li { margin-bottom: 2px; }

    /* ── EDUCATION ── */
    .edu {
      margin-bottom: 10px;
    }

    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 3px;
    }

    .edu-degree {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
      font-size: 10.5pt;
    }

    .edu-school {
      font-size: 9pt;
      color: var(--muted);
    }

    .edu-dates {
      font-size: 8.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .edu-summary {
      font-size: 8.5pt;
      color: var(--text2);
      line-height: 1.45;
    }

    /* ── SKILLS (2-column grid) ── */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 24px;
    }

    .skill-item {}

    .skill-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
      font-size: 10pt;
      color: var(--text);
    }

    .skill-kw {
      font-size: 8.5pt;
      color: var(--muted);
      line-height: 1.4;
    }

    /* ── LANGUAGES ── */
    .lang-item {
      margin-bottom: 6px;
      font-size: 9.5pt;
    }

    .lang-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
    }

    .lang-fluency { color: var(--muted); margin-left: 4px; }

    .lang-detail {
      font-size: 8pt;
      color: var(--muted);
      font-style: italic;
      padding-left: 16px;
      margin-top: 1px;
    }

    /* ── INTERESTS ── */
    .interest-item {
      margin-bottom: 5px;
      font-size: 9.5pt;
    }

    .interest-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
    }

    .interest-desc { color: var(--text2); font-size: 9pt; }

    /* ── REFERENCES ── */
    .ref-item {
      margin-bottom: 6px;
      font-size: 9.5pt;
    }

    .ref-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
    }

    .ref-role {
      color: var(--muted);
      display: block;
      font-size: 8.5pt;
      margin-top: 1px;
    }

    /* ── PROJECTS ── */
    .proj-item { margin-bottom: 10px; }

    .proj-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 3px;
    }

    .proj-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
      font-size: 10pt;
    }

    .proj-name a { font-size: 8.5pt; }

    .proj-dates {
      font-size: 8.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .proj-summary {
      font-size: 8.5pt;
      color: var(--text2);
      line-height: 1.45;
    }

    /* ── FOOTER ── */
    .footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid var(--rule);
      text-align: center;
      font-size: 8pt;
      color: var(--muted);
      letter-spacing: 0.5px;
    }

    /* ── SCREEN ── */
    @media screen {
      body {
        font-size: 15px;
        max-width: 860px;
        padding: 56px 48px;
        line-height: 1.6;
      }

      .header h1 { font-size: 42px; }
      .label { font-size: 15px; }
      .contact { font-size: 13px; }
      .summary { font-size: 15px; }

      .section { margin-bottom: 28px; }
      .section-title { font-size: 20px; margin-bottom: 14px; padding-bottom: 6px; }

      .job { margin-bottom: 20px; padding-bottom: 18px; }
      .job-title { font-size: 17px; }
      .job-at { font-size: 14px; }
      .job-company { font-size: 15px; }
      .job-loc { font-size: 13px; }
      .job-dates { font-size: 13px; }
      .job-summary { font-size: 14px; }
      .job-hl { font-size: 13px; }

      .edu { margin-bottom: 16px; }
      .edu-degree { font-size: 16px; }
      .edu-school { font-size: 14px; }
      .edu-dates { font-size: 13px; }
      .edu-summary { font-size: 13px; }

      .skill-name { font-size: 15px; }
      .skill-kw { font-size: 13px; }

      .lang-item { font-size: 15px; }
      .lang-detail { font-size: 13px; }

      .interest-item { font-size: 15px; }
      .interest-desc { font-size: 14px; }

      .ref-item { font-size: 15px; }
      .ref-role { font-size: 13px; }

      .proj-name { font-size: 15px; }
      .proj-dates { font-size: 13px; }
      .proj-summary { font-size: 13px; }
    }

    @media screen and (max-width: 600px) {
      body { padding: 24px 16px; }
      .header h1 { font-size: 28px; }
      .skills-grid { grid-template-columns: 1fr; }
    }

    /* ── PRINT ── */
    @page { margin: 2cm; }

    @media print {
      body {
        max-width: 100%;
        padding: 0;
        font-size: 9pt;
        line-height: 1.45;
        background: white;
        orphans: 3;
        widows: 3;
      }

      .header h1 { font-size: 22pt; }
      .header { margin-bottom: 18px; padding-bottom: 14px; }
      .section { margin-bottom: 14px; }
      .section-title { break-after: avoid; }
      .job { break-inside: avoid; }
      .edu { break-inside: avoid; }
      .proj-item { break-inside: avoid; }
      .ref-item { break-inside: avoid; }
      .dl-pdf { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${esc(b.name)}</h1>
    ${b.label ? `<div class="label">${esc(b.label)}</div>` : ''}
    <div class="contact">
      ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
      ${b.phone ? `<span class="sep">·</span><a href="tel:${esc(b.phone.replace(/\\s/g, ''))}">${esc(b.phone)}</a>` : ''}
      ${b.location && b.location.city ? `<span class="sep">·</span>${esc(b.location.city)}, ${esc(b.location.region || b.location.country)}` : ''}
      ${github ? `<span class="sep">·</span><a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
      ${linkedin ? `<span class="sep">·</span><a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
    </div>
    ${b.summary ? `<p class="summary">${esc(b.summary)}</p>` : ''}
  </div>

  ${resume.work && resume.work.length ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${workHtml}
  </div>` : ''}

  ${resume.education && resume.education.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${eduHtml}
  </div>` : ''}

  ${resume.skills && resume.skills.length ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-grid">${skillsHtml}</div>
  </div>` : ''}

  ${resume.languages && resume.languages.length ? `
  <div class="section">
    <div class="section-title">Languages</div>
    ${langHtml}
  </div>` : ''}

  ${resume.interests && resume.interests.length ? `
  <div class="section">
    <div class="section-title">Interests</div>
    ${interestHtml}
  </div>` : ''}

  ${resume.references && resume.references.length ? `
  <div class="section">
    <div class="section-title">References</div>
    ${referencesHtml}
  </div>` : ''}

  ${resume.projects && resume.projects.length ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projectsHtml}
  </div>` : ''}

  <div class="footer">${esc(b.name)} · ${b.location ? `${esc(b.location.city)}, ${esc(b.location.region || b.location.country)}` : ''}</div>
</body>
</html>`;
};
