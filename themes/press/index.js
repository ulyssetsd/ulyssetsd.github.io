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
        <div class="job-row">
          <div class="job-date-col">
            <span class="job-dates">${formatDate(job.startDate)}<br>– ${end}</span>
          </div>
          <div class="job-content-col">
            <div class="job-title">${esc(job.position)}</div>
            <div class="job-company">${esc(job.name)}${job.location ? `, ${esc(job.location)}` : ''}</div>
            ${job.summary ? `<p class="job-summary">${esc(job.summary)}</p>` : ''}
            ${highlights ? `<ul class="job-highlights">${highlights}</ul>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map(edu => `
    <div class="edu-item">
      <div class="edu-row">
        <div class="edu-date-col">
          <span class="edu-dates">${esc(edu.startDate)} – ${esc(edu.endDate)}</span>
        </div>
        <div class="edu-content-col">
          <div class="edu-degree">${esc(edu.studyType)}${edu.area ? ` in ${esc(edu.area)}` : ''}</div>
          <div class="edu-school">${esc(edu.institution)}${edu.location ? `, ${esc(edu.location)}` : ''}</div>
          ${edu.summary ? `<p class="edu-summary">${esc(edu.summary)}</p>` : ''}
        </div>
      </div>
    </div>`).join('');

  const skillsHtml = (resume.skills || []).map(skill => `
    <div class="skill-block">
      <span class="skill-name">${esc(skill.name)}</span>
      <span class="skill-kw">${(skill.keywords || []).map(esc).join(' · ')}</span>
    </div>`).join('');

  const langHtml = (resume.languages || []).map(lang => `
    <div class="lang-item">
      <span class="lang-name">${esc(lang.language)}</span> — <span class="lang-fluency">${esc(lang.fluency)}</span>
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
      <span class="proj-name">${esc(proj.name)}</span>
      ${proj.url ? `<a href="${esc(proj.url)}" class="proj-link" target="_blank" rel="noopener noreferrer">↗</a>` : ''}
      <span class="proj-dates">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</span>
      ${proj.summary ? `<p class="proj-summary">${esc(proj.summary)}</p>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.name)} — Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #faf9f6;
      --text: #1a1a1a;
      --text2: #3a3a3a;
      --muted: #8a8a8a;
      --accent: #c0392b;
      --rule: #d4d0c8;
      --rule-light: #e8e5de;
    }

    body {
      font-family: 'Source Serif 4', 'Georgia', 'Times New Roman', serif;
      font-size: 10pt;
      color: var(--text);
      background: var(--bg);
      line-height: 1.65;
      max-width: 720px;
      margin: 0 auto;
      padding: 60px 48px;
      font-feature-settings: 'liga' 1, 'kern' 1;
    }

    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── HEADER / MASTHEAD ─────────────────────────────── */
    .masthead {
      text-align: center;
      margin-bottom: 36px;
      padding-bottom: 24px;
    }

    .masthead h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 42pt;
      font-weight: 900;
      letter-spacing: -1px;
      line-height: 1;
      margin-bottom: 4px;
      color: var(--text);
    }

    .masthead .rule-thin {
      width: 100%;
      height: 1px;
      background: var(--text);
      margin: 12px 0;
    }

    .masthead .label {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 11pt;
      font-style: italic;
      color: var(--muted);
      margin-bottom: 8px;
      letter-spacing: 0.3px;
    }

    .masthead .contact-line {
      font-size: 9pt;
      color: var(--muted);
      letter-spacing: 0.5px;
    }
    .masthead .contact-line a { color: var(--accent); }
    .masthead .sep { margin: 0 8px; color: var(--rule); }

    .masthead .rule-double {
      margin-top: 16px;
      border: none;
      border-top: 3px double var(--text);
    }

    /* Pull-quote summary */
    .pull-quote {
      position: relative;
      margin: 24px auto 0;
      max-width: 580px;
      padding: 0 32px;
      font-style: italic;
      font-size: 10.5pt;
      color: var(--text2);
      line-height: 1.7;
      text-align: center;
    }
    .pull-quote::before {
      content: '\\201C';
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 60pt;
      font-style: normal;
      color: var(--accent);
      position: absolute;
      top: -20px;
      left: -4px;
      line-height: 1;
      opacity: 0.4;
    }
    .pull-quote::after {
      content: '\\201D';
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 60pt;
      font-style: normal;
      color: var(--accent);
      position: absolute;
      bottom: -40px;
      right: -4px;
      line-height: 1;
      opacity: 0.4;
    }

    .dl-pdf {
      display: inline-block;
      font-size: 8.5pt;
      color: var(--accent);
      margin-top: 16px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* ── SECTION ─────────────────────────────── */
    .section {
      margin-bottom: 28px;
    }

    .section-heading {
      text-align: center;
      margin-bottom: 18px;
    }

    .section-heading h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 4px;
      color: var(--text);
      display: inline-block;
      padding: 0 16px;
      position: relative;
    }

    /* Diamond ornament */
    .ornament {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 16px;
    }
    .ornament::before,
    .ornament::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }
    .ornament .diamond {
      width: 8px;
      height: 8px;
      background: var(--accent);
      transform: rotate(45deg);
      margin: 0 12px;
      flex-shrink: 0;
    }

    /* ── WORK ─────────────────────────────── */
    .job {
      margin-bottom: 18px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--rule-light);
    }
    .job:last-child { border-bottom: none; padding-bottom: 0; }

    .job-row {
      display: flex;
      gap: 20px;
    }

    .job-date-col {
      flex-shrink: 0;
      width: 85px;
      padding-top: 3px;
    }
    .job-dates {
      font-size: 8.5pt;
      color: var(--muted);
      line-height: 1.4;
      text-align: right;
      display: block;
    }

    .job-content-col { flex: 1; min-width: 0; }

    .job-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-size: 11pt;
      margin-bottom: 1px;
    }
    .job-company {
      font-style: italic;
      font-size: 9.5pt;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .job-summary {
      font-size: 9.5pt;
      color: var(--text2);
      line-height: 1.55;
      margin-bottom: 6px;
    }
    .job-highlights {
      font-size: 9pt;
      color: var(--text2);
      padding-left: 18px;
      line-height: 1.5;
    }
    .job-highlights li { margin-bottom: 3px; }

    /* ── EDUCATION ─────────────────────────────── */
    .edu-item {
      margin-bottom: 12px;
    }
    .edu-row {
      display: flex;
      gap: 20px;
    }
    .edu-date-col {
      flex-shrink: 0;
      width: 85px;
      padding-top: 3px;
    }
    .edu-dates {
      font-size: 8.5pt;
      color: var(--muted);
      text-align: right;
      display: block;
    }
    .edu-content-col { flex: 1; min-width: 0; }
    .edu-degree {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-size: 10.5pt;
    }
    .edu-school {
      font-style: italic;
      font-size: 9.5pt;
      color: var(--muted);
      margin-bottom: 4px;
    }
    .edu-summary {
      font-size: 9pt;
      color: var(--text2);
      line-height: 1.5;
    }

    /* ── SKILLS (multi-column) ─────────────────────────────── */
    .skills-grid {
      column-count: 2;
      column-gap: 32px;
    }
    .skill-block {
      break-inside: avoid;
      margin-bottom: 8px;
    }
    .skill-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-size: 10pt;
    }
    .skill-kw {
      font-size: 9pt;
      color: var(--muted);
      display: block;
      padding-left: 0;
      line-height: 1.4;
    }

    /* ── LANGUAGES ─────────────────────────────── */
    .lang-item { margin-bottom: 6px; font-size: 9.5pt; }
    .lang-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
    }
    .lang-fluency { color: var(--text2); }
    .lang-detail {
      font-size: 8.5pt;
      color: var(--muted);
      font-style: italic;
      margin-top: 1px;
      padding-left: 16px;
    }

    /* ── INTERESTS ─────────────────────────────── */
    .interest-item { margin-bottom: 5px; font-size: 9.5pt; }
    .interest-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
    }
    .interest-desc { color: var(--text2); font-size: 9pt; }

    /* ── REFERENCES ─────────────────────────────── */
    .ref-item {
      margin-bottom: 6px;
      font-size: 9.5pt;
    }
    .ref-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
    }
    .ref-role {
      color: var(--muted);
      font-size: 9pt;
      display: block;
      margin-top: 1px;
    }

    /* ── PROJECTS (multi-column) ─────────────────────────────── */
    .projects-grid {
      column-count: 2;
      column-gap: 32px;
    }
    .proj-item {
      break-inside: avoid;
      margin-bottom: 10px;
    }
    .proj-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-size: 10pt;
    }
    .proj-link {
      color: var(--accent);
      font-size: 9pt;
      margin-left: 4px;
    }
    .proj-dates {
      font-size: 8.5pt;
      color: var(--muted);
      display: block;
    }
    .proj-summary {
      font-size: 9pt;
      color: var(--text2);
      line-height: 1.5;
      margin-top: 3px;
    }

    /* ── FOOTER ─────────────────────────────── */
    .footer-rule {
      margin-top: 32px;
      border: none;
      border-top: 3px double var(--text);
    }
    .footer {
      text-align: center;
      font-size: 8pt;
      color: var(--muted);
      margin-top: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* ── SCREEN ─────────────────────────────── */
    @media screen {
      body {
        font-size: 15px;
        max-width: 860px;
        padding: 60px 48px;
      }
      .masthead h1 { font-size: 56px; }
      .masthead .label { font-size: 16px; }
      .masthead .contact-line { font-size: 13px; }
      .pull-quote { font-size: 16px; padding: 0 40px; }
      .pull-quote::before { font-size: 80px; top: -24px; }
      .pull-quote::after { font-size: 80px; bottom: -50px; }

      .section-heading h2 { font-size: 12px; }

      .job-title { font-size: 16px; }
      .job-company { font-size: 14px; }
      .job-dates { font-size: 13px; }
      .job-summary { font-size: 14px; }
      .job-highlights { font-size: 13px; }
      .job-date-col { width: 110px; }

      .edu-degree { font-size: 15px; }
      .edu-school { font-size: 14px; }
      .edu-dates { font-size: 13px; }
      .edu-summary { font-size: 13px; }
      .edu-date-col { width: 110px; }

      .skill-name { font-size: 15px; }
      .skill-kw { font-size: 13px; }

      .lang-item { font-size: 14px; }
      .lang-detail { font-size: 13px; }

      .interest-item { font-size: 14px; }
      .interest-desc { font-size: 13px; }

      .ref-item { font-size: 14px; }
      .ref-role { font-size: 13px; }

      .proj-name { font-size: 15px; }
      .proj-dates { font-size: 13px; }
      .proj-summary { font-size: 13px; }
    }

    @media screen and (max-width: 600px) {
      body { padding: 24px 16px; }
      .masthead h1 { font-size: 32px; }
      .skills-grid, .projects-grid { column-count: 1; }
      .job-row, .edu-row { flex-direction: column; gap: 4px; }
      .job-date-col, .edu-date-col { width: auto; }
      .job-dates, .edu-dates { text-align: left; }
    }

    /* ── PRINT ─────────────────────────────── */
    @page { margin: 2cm; }

    @media print {
      body {
        max-width: 100%;
        padding: 0;
        font-size: 9.5pt;
        line-height: 1.5;
        orphans: 3;
        widows: 3;
      }

      .masthead h1 { font-size: 28pt; }
      .masthead { margin-bottom: 20px; padding-bottom: 16px; }
      .pull-quote { margin-top: 16px; }

      .section { margin-bottom: 16px; }
      .section-heading { break-after: avoid; }
      .ornament { break-after: avoid; }
      .job { break-inside: avoid; }
      .edu-item { break-inside: avoid; }
      .proj-item { break-inside: avoid; }
      .ref-item { break-inside: avoid; }
      .dl-pdf { display: none; }
    }
  </style>
</head>
<body>
  <div class="masthead">
    <h1>${esc(b.name)}</h1>
    <div class="rule-thin"></div>
    ${b.label ? `<div class="label">${esc(b.label)}</div>` : ''}
    <div class="contact-line">
      ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
      ${b.phone ? `<span class="sep">|</span><a href="tel:${esc(b.phone.replace(/\\s/g, ''))}">${esc(b.phone)}</a>` : ''}
      ${b.location && b.location.city ? `<span class="sep">|</span>${esc(b.location.city)}, ${esc(b.location.region || b.location.country)}` : ''}
      ${github ? `<span class="sep">|</span><a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
      ${linkedin ? `<span class="sep">|</span><a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
    </div>
    <hr class="rule-double">
    ${b.summary ? `<div class="pull-quote">${esc(b.summary)}</div>` : ''}
    <a class="dl-pdf" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a>
  </div>

  ${resume.work && resume.work.length ? `
  <div class="section">
    <div class="ornament"><span class="diamond"></span></div>
    <div class="section-heading"><h2>Experience</h2></div>
    ${workHtml}
  </div>` : ''}

  ${resume.education && resume.education.length ? `
  <div class="section">
    <div class="ornament"><span class="diamond"></span></div>
    <div class="section-heading"><h2>Education</h2></div>
    ${eduHtml}
  </div>` : ''}

  ${resume.skills && resume.skills.length ? `
  <div class="section">
    <div class="ornament"><span class="diamond"></span></div>
    <div class="section-heading"><h2>Skills</h2></div>
    <div class="skills-grid">${skillsHtml}</div>
  </div>` : ''}

  ${resume.languages && resume.languages.length ? `
  <div class="section">
    <div class="ornament"><span class="diamond"></span></div>
    <div class="section-heading"><h2>Languages</h2></div>
    ${langHtml}
  </div>` : ''}

  ${resume.interests && resume.interests.length ? `
  <div class="section">
    <div class="ornament"><span class="diamond"></span></div>
    <div class="section-heading"><h2>Interests</h2></div>
    ${interestHtml}
  </div>` : ''}

  ${resume.references && resume.references.length ? `
  <div class="section">
    <div class="ornament"><span class="diamond"></span></div>
    <div class="section-heading"><h2>References</h2></div>
    ${referencesHtml}
  </div>` : ''}

  ${resume.projects && resume.projects.length ? `
  <div class="section">
    <div class="ornament"><span class="diamond"></span></div>
    <div class="section-heading"><h2>Projects</h2></div>
    <div class="projects-grid">${projectsHtml}</div>
  </div>` : ''}

  <hr class="footer-rule">
  <div class="footer">${esc(b.name)} &middot; ${b.location ? `${esc(b.location.city)}, ${esc(b.location.region || b.location.country)}` : ''}</div>
</body>
</html>`;
};
