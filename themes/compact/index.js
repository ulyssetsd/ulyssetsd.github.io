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
          <span class="job-title">${esc(job.position)}, ${esc(job.name)}${job.location ? ` — ${esc(job.location)}` : ''}</span>
          <span class="job-dates">${formatDate(job.startDate)} – ${end}</span>
        </div>
        ${job.summary ? `<p class="job-summary">${esc(job.summary)}</p>` : ''}
        ${highlights ? `<ul class="job-hl">${highlights}</ul>` : ''}
      </div>`;
  }).join('');

  const eduHtml = (resume.education || []).map(edu => `
    <div class="edu">
      <div class="edu-header">
        <span class="edu-degree">${esc(edu.studyType)}${edu.area ? `, ${esc(edu.area)}` : ''} — ${esc(edu.institution)}${edu.location ? `, ${esc(edu.location)}` : ''}</span>
        <span class="edu-dates">${esc(edu.startDate)} – ${esc(edu.endDate)}</span>
      </div>
      ${edu.summary ? `<p class="edu-summary">${esc(edu.summary)}</p>` : ''}
    </div>`).join('');

  const skillsHtml = (resume.skills || []).map(skill =>
    `<span class="skill-item"><strong>${esc(skill.name)}</strong>: ${(skill.keywords || []).map(esc).join(', ')}</span>`
  ).join('<span class="skill-sep"> | </span>');

  const langHtml = (resume.languages || []).map(lang =>
    `<span class="lang-item"><strong>${esc(lang.language)}</strong> (${esc(lang.fluency)})</span>`
  ).join('<span class="skill-sep"> | </span>');

  const interestHtml = (resume.interests || []).map(i =>
    `<span class="interest-item"><strong>${esc(i.name)}</strong>${i.summary ? `: ${esc(i.summary)}` : ''}</span>`
  ).join('<span class="skill-sep"> | </span>');

  const referencesHtml = (resume.references || []).map(ref => `
    <div class="ref-item">
      <strong>${esc(ref.name)}</strong> — ${esc(ref.reference)}
    </div>`).join('');

  const projectsHtml = (resume.projects || []).map(proj => `
    <div class="proj">
      <span class="proj-name">${esc(proj.name)}${proj.url ? ` <a href="${esc(proj.url)}" target="_blank" rel="noopener noreferrer">↗</a>` : ''}</span>
      <span class="proj-dates">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</span>
      ${proj.summary ? `<span class="proj-desc"> — ${esc(proj.summary)}</span>` : ''}
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
      --text: #111;
      --text2: #333;
      --muted: #555;
      --rule: #bbb;
      --bg: #fff;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 8.5pt;
      color: var(--text);
      background: var(--bg);
      line-height: 1.35;
      max-width: 700px;
      margin: 0 auto;
      padding: 32px 40px;
    }

    a { color: var(--text); text-decoration: underline; }

    /* ── HEADER ── */
    .header {
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--text);
    }

    .header h1 {
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: -0.3px;
      line-height: 1;
      margin-bottom: 2px;
    }

    .label {
      font-size: 8.5pt;
      color: var(--muted);
      margin-bottom: 4px;
    }

    .contact {
      font-size: 7.5pt;
      color: var(--muted);
    }

    .contact a { color: var(--muted); }
    .contact .sep { margin: 0 4px; }

    .summary {
      font-size: 8pt;
      color: var(--text2);
      margin-top: 6px;
      line-height: 1.4;
    }

    /* ── SECTION ── */
    .section {
      margin-bottom: 8px;
    }

    .section-title {
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text);
      margin-bottom: 4px;
      padding-bottom: 2px;
      border-bottom: 1px solid var(--rule);
    }

    /* ── WORK ── */
    .job { margin-bottom: 6px; }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }

    .job-title {
      font-weight: 700;
      font-size: 8.5pt;
    }

    .job-dates {
      font-size: 7.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .job-summary {
      font-size: 8pt;
      color: var(--text2);
      margin-top: 1px;
      line-height: 1.35;
    }

    .job-hl {
      font-size: 7.5pt;
      color: var(--text2);
      padding-left: 14px;
      line-height: 1.3;
      margin-top: 1px;
    }

    .job-hl li { margin-bottom: 0; }

    /* ── EDUCATION ── */
    .edu { margin-bottom: 4px; }

    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }

    .edu-degree {
      font-weight: 700;
      font-size: 8.5pt;
    }

    .edu-dates {
      font-size: 7.5pt;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .edu-summary {
      font-size: 7.5pt;
      color: var(--text2);
      margin-top: 1px;
      line-height: 1.35;
    }

    /* ── SKILLS / LANG / INTERESTS (inline) ── */
    .inline-block {
      font-size: 8pt;
      line-height: 1.5;
      color: var(--text2);
    }

    .skill-sep { color: var(--rule); }

    /* ── REFERENCES ── */
    .ref-item {
      font-size: 8pt;
      color: var(--text2);
      margin-bottom: 2px;
    }

    /* ── PROJECTS ── */
    .proj {
      font-size: 8pt;
      margin-bottom: 3px;
    }

    .proj-name { font-weight: 700; }
    .proj-name a { font-size: 7.5pt; }

    .proj-dates {
      font-size: 7.5pt;
      color: var(--muted);
    }

    .proj-desc {
      color: var(--text2);
    }

    /* ── SCREEN ── */
    @media screen {
      body {
        font-size: 13px;
        max-width: 860px;
        padding: 40px 48px;
        line-height: 1.45;
      }

      .header { margin-bottom: 16px; padding-bottom: 12px; }
      .header h1 { font-size: 28px; }
      .label { font-size: 14px; }
      .contact { font-size: 12px; }
      .summary { font-size: 13px; }

      .section { margin-bottom: 16px; }
      .section-title { font-size: 10px; margin-bottom: 8px; padding-bottom: 4px; }

      .job { margin-bottom: 14px; }
      .job-title { font-size: 14px; }
      .job-dates { font-size: 12px; }
      .job-summary { font-size: 13px; }
      .job-hl { font-size: 12px; }

      .edu { margin-bottom: 10px; }
      .edu-degree { font-size: 14px; }
      .edu-dates { font-size: 12px; }
      .edu-summary { font-size: 12px; }

      .inline-block { font-size: 13px; }
      .ref-item { font-size: 13px; }
      .proj { font-size: 13px; }
      .proj-dates { font-size: 12px; }
    }

    /* ── PRINT ── */
    @page { margin: 1.5cm; }

    @media print {
      body {
        max-width: 100%;
        padding: 0;
        font-size: 8pt;
        line-height: 1.3;
        orphans: 3;
        widows: 3;
      }

      .header h1 { font-size: 16pt; }
      .section { margin-bottom: 6px; }
      .section-title { break-after: avoid; }
      .job { break-inside: avoid; margin-bottom: 5px; }
      .edu { break-inside: avoid; }
      .proj { break-inside: avoid; }
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
    <div class="inline-block">${skillsHtml}</div>
  </div>` : ''}

  ${resume.languages && resume.languages.length ? `
  <div class="section">
    <div class="section-title">Languages</div>
    <div class="inline-block">${langHtml}</div>
  </div>` : ''}

  ${resume.interests && resume.interests.length ? `
  <div class="section">
    <div class="section-title">Interests</div>
    <div class="inline-block">${interestHtml}</div>
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
</body>
</html>`;
};
