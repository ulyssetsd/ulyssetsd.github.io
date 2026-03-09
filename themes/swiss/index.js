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
        <div class="row">
          <div class="date-col">
            <span class="dates">${formatDate(job.startDate)}<br>– ${end}</span>
          </div>
          <div class="content-col">
            <div class="job-title">${esc(job.position)}</div>
            <div class="job-company">${esc(job.name)}${job.location ? `, ${esc(job.location)}` : ''}</div>
            ${job.summary ? `<p class="job-summary">${esc(job.summary)}</p>` : ''}
            ${highlights ? `<ul class="job-hl">${highlights}</ul>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map(edu => `
    <div class="edu">
      <div class="row">
        <div class="date-col">
          <span class="dates">${esc(edu.startDate)} – ${esc(edu.endDate)}</span>
        </div>
        <div class="content-col">
          <div class="edu-degree">${esc(edu.studyType)}${edu.area ? `, ${esc(edu.area)}` : ''}</div>
          <div class="edu-school">${esc(edu.institution)}${edu.location ? `, ${esc(edu.location)}` : ''}</div>
          ${edu.summary ? `<p class="edu-summary">${esc(edu.summary)}</p>` : ''}
        </div>
      </div>
    </div>`).join('');

  const skillsHtml = (resume.skills || []).map(skill => `
    <div class="skill-row">
      <span class="skill-name">${esc(skill.name)}</span>
      <span class="skill-kw">${(skill.keywords || []).map(esc).join(', ')}</span>
    </div>`).join('');

  const langHtml = (resume.languages || []).map(lang => `
    <div class="lang-row">
      <span class="lang-name">${esc(lang.language)}</span>
      <span class="lang-fluency">${esc(lang.fluency)}</span>
      ${lang.summary ? `<span class="lang-detail">${esc(lang.summary)}</span>` : ''}
    </div>`).join('');

  const interestHtml = (resume.interests || []).map(i => `
    <div class="interest-row">
      <span class="interest-name">${esc(i.name)}</span>
      ${i.summary ? `<span class="interest-desc">${esc(i.summary)}</span>` : ''}
    </div>`).join('');

  const referencesHtml = (resume.references || []).map(ref => `
    <div class="ref-row">
      <span class="ref-name">${esc(ref.name)}</span>
      <span class="ref-role">${esc(ref.reference)}</span>
    </div>`).join('');

  const projectsHtml = (resume.projects || []).map(proj => `
    <div class="proj">
      <div class="row">
        <div class="date-col">
          <span class="dates">${formatDate(proj.startDate)}<br>– ${formatDate(proj.endDate)}</span>
        </div>
        <div class="content-col">
          <span class="proj-name">${esc(proj.name)}${proj.url ? ` <a href="${esc(proj.url)}" target="_blank" rel="noopener noreferrer">↗</a>` : ''}</span>
          ${proj.summary ? `<p class="proj-summary">${esc(proj.summary)}</p>` : ''}
        </div>
      </div>
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
      --text: #000;
      --text2: #222;
      --muted: #666;
      --accent: #e50000;
      --rule: #000;
      --rule-light: #ccc;
      --bg: #fff;
    }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif;
      font-size: 9.5pt;
      color: var(--text);
      background: var(--bg);
      line-height: 1.45;
      max-width: 700px;
      margin: 0 auto;
      padding: 48px 40px;
    }

    a { color: var(--accent); text-decoration: none; }

    /* ── HEADER ── */
    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 32pt;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .label {
      font-size: 9pt;
      color: var(--muted);
      font-weight: 400;
      margin-bottom: 10px;
    }

    .header-rule {
      height: 3px;
      background: var(--accent);
      margin-bottom: 10px;
    }

    .contact {
      font-size: 8pt;
      color: var(--muted);
    }

    .contact a { color: var(--accent); }
    .contact .sep { margin: 0 6px; color: var(--rule-light); }

    .summary {
      margin-top: 12px;
      font-size: 9pt;
      color: var(--text2);
      line-height: 1.5;
    }

    /* ── SECTION ── */
    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--text);
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--rule);
    }

    /* ── DATE-CONTENT GRID ── */
    .row {
      display: flex;
      gap: 20px;
    }

    .date-col {
      flex-shrink: 0;
      width: 100px;
      padding-top: 2px;
    }

    .dates {
      font-size: 8pt;
      color: var(--muted);
      line-height: 1.4;
      display: block;
    }

    .content-col { flex: 1; min-width: 0; }

    /* ── WORK ── */
    .job {
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--rule-light);
    }
    .job:last-child { border-bottom: none; padding-bottom: 0; }

    .job-title {
      font-weight: 700;
      font-size: 10pt;
    }

    .job-company {
      font-size: 9pt;
      color: var(--muted);
      margin-bottom: 4px;
    }

    .job-summary {
      font-size: 9pt;
      color: var(--text2);
      line-height: 1.45;
      margin-bottom: 4px;
    }

    .job-hl {
      font-size: 8.5pt;
      color: var(--text2);
      padding-left: 16px;
      line-height: 1.4;
    }

    .job-hl li { margin-bottom: 2px; }

    /* ── EDUCATION ── */
    .edu {
      margin-bottom: 10px;
    }

    .edu-degree {
      font-weight: 700;
      font-size: 10pt;
    }

    .edu-school {
      font-size: 9pt;
      color: var(--muted);
      margin-bottom: 3px;
    }

    .edu-summary {
      font-size: 8.5pt;
      color: var(--text2);
      line-height: 1.4;
    }

    /* ── SKILLS ── */
    .skill-row {
      display: flex;
      gap: 12px;
      margin-bottom: 4px;
      font-size: 9pt;
      align-items: baseline;
    }

    .skill-name {
      font-weight: 700;
      min-width: 140px;
      flex-shrink: 0;
    }

    .skill-kw { color: var(--muted); }

    /* ── LANGUAGES ── */
    .lang-row {
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
      font-size: 9pt;
      align-items: baseline;
      flex-wrap: wrap;
    }

    .lang-name {
      font-weight: 700;
      min-width: 120px;
      flex-shrink: 0;
    }

    .lang-fluency { color: var(--muted); }

    .lang-detail {
      font-size: 8pt;
      color: var(--muted);
      font-style: italic;
      width: 100%;
      padding-left: 120px;
    }

    /* ── INTERESTS ── */
    .interest-row {
      margin-bottom: 4px;
      font-size: 9pt;
    }

    .interest-name { font-weight: 700; }
    .interest-desc { color: var(--muted); margin-left: 4px; }

    /* ── REFERENCES ── */
    .ref-row {
      display: flex;
      gap: 12px;
      margin-bottom: 4px;
      font-size: 9pt;
      align-items: baseline;
    }

    .ref-name {
      font-weight: 700;
      min-width: 140px;
      flex-shrink: 0;
    }

    .ref-role { color: var(--muted); }

    /* ── PROJECTS ── */
    .proj { margin-bottom: 10px; }

    .proj-name {
      font-weight: 700;
      font-size: 9.5pt;
    }

    .proj-name a { font-size: 8.5pt; }

    .proj-summary {
      font-size: 8.5pt;
      color: var(--text2);
      line-height: 1.4;
      margin-top: 2px;
    }

    /* ── FOOTER ── */
    .footer-rule {
      height: 3px;
      background: var(--accent);
      margin-top: 28px;
      margin-bottom: 8px;
    }

    .footer {
      font-size: 7.5pt;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* ── SCREEN ── */
    @media screen {
      body {
        font-size: 15px;
        max-width: 860px;
        padding: 56px 48px;
        line-height: 1.55;
      }

      .header h1 { font-size: 48px; }
      .label { font-size: 14px; }
      .contact { font-size: 13px; }
      .summary { font-size: 14px; }

      .section { margin-bottom: 28px; }
      .section-title { font-size: 16px; letter-spacing: 4px; margin-bottom: 14px; padding-bottom: 6px; }

      .date-col { width: 130px; }
      .dates { font-size: 13px; }

      .job { margin-bottom: 20px; padding-bottom: 18px; }
      .job-title { font-size: 16px; }
      .job-company { font-size: 14px; }
      .job-summary { font-size: 14px; }
      .job-hl { font-size: 13px; }

      .edu { margin-bottom: 16px; }
      .edu-degree { font-size: 16px; }
      .edu-school { font-size: 14px; }
      .edu-summary { font-size: 13px; }

      .skill-row { font-size: 14px; margin-bottom: 6px; gap: 16px; }
      .skill-name { min-width: 170px; }

      .lang-row { font-size: 14px; margin-bottom: 6px; }
      .lang-name { min-width: 150px; }
      .lang-detail { font-size: 13px; padding-left: 150px; }

      .interest-row { font-size: 14px; margin-bottom: 6px; }

      .ref-row { font-size: 14px; margin-bottom: 6px; gap: 16px; }
      .ref-name { min-width: 170px; }

      .proj { margin-bottom: 16px; }
      .proj-name { font-size: 15px; }
      .proj-summary { font-size: 13px; }
    }

    @media screen and (max-width: 600px) {
      body { padding: 24px 16px; }
      .header h1 { font-size: 28px; }
      .row { flex-direction: column; gap: 4px; }
      .date-col { width: auto; }
      .dates { display: inline; }
      .lang-detail { padding-left: 0; }
    }

    /* ── PRINT ── */
    @page { margin: 2cm; }

    @media print {
      body {
        max-width: 100%;
        padding: 0;
        font-size: 9pt;
        line-height: 1.4;
        orphans: 3;
        widows: 3;
      }

      .header h1 { font-size: 22pt; }
      .section { margin-bottom: 14px; }
      .section-title { break-after: avoid; }
      .job { break-inside: avoid; }
      .edu { break-inside: avoid; }
      .proj { break-inside: avoid; }
      .ref-row { break-inside: avoid; }
      .dl-pdf { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${esc(b.name)}</h1>
    ${b.label ? `<div class="label">${esc(b.label)}</div>` : ''}
    <div class="header-rule"></div>
    <div class="contact">
      ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
      ${b.phone ? `<span class="sep">|</span><a href="tel:${esc(b.phone.replace(/\\s/g, ''))}">${esc(b.phone)}</a>` : ''}
      ${b.location && b.location.city ? `<span class="sep">|</span>${esc(b.location.city)}, ${esc(b.location.region || b.location.country)}` : ''}
      ${github ? `<span class="sep">|</span><a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
      ${linkedin ? `<span class="sep">|</span><a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
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
    ${skillsHtml}
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

  <div class="footer-rule"></div>
  <div class="footer">${esc(b.name)} — ${b.location ? `${esc(b.location.city)}, ${esc(b.location.region || b.location.country)}` : ''}</div>
</body>
</html>`;
};
