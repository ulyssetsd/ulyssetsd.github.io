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
  format: 'A4',
  preferCSSPageSize: true,
  printBackground: true,
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
            <h3 class="job-position">${esc(job.position)}</h3>
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
          ${proj.url ? `<a href="${esc(proj.url)}" class="project-link" aria-label="View ${esc(proj.name)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ''}
        </div>
        ${proj.startDate ? `<span class="project-dates">${formatDate(proj.startDate)} – ${formatDate(proj.endDate)}</span>` : ''}
      </div>
      ${proj.summary ? `<p class="project-summary">${esc(proj.summary)}</p>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(b.name)} — ${esc(b.label || 'Resume')}</title>
  <meta name="description" content="${esc(b.summary)}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: #2563eb;
      --text: #111111;
      --text-2: #333333;
      --muted: #555555;
      --rule: #dddddd;
    }

    body {
      font-family: Arial, 'Liberation Sans', sans-serif;
      font-size: 15px;
      color: var(--text);
      background: white;
      line-height: 1.5;
      max-width: 900px;
      margin: 0 auto;
      padding: 48px;
      overflow-wrap: anywhere;
    }

    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

    .header { margin-bottom: 28px; }
    .header h1 {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .header .label { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
    .header-links { font-size: 13px; color: var(--muted); margin-bottom: 14px; }
    .header-links span { margin: 0 5px; }
    .header .summary { color: var(--text-2); max-width: 75ch; }

    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--accent);
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--rule);
    }

    .job { margin-bottom: 20px; }
    .job-header, .edu-header, .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 5px;
    }
    .job-header > div, .edu-header > div, .project-header > div { min-width: 0; }
    .job-position, .edu-degree, .project-name { font-size: 1em; font-weight: 700; }
    .job-company { font-weight: 600; }
    .job-location, .edu-loc, .job-sep { color: var(--muted); }
    .job-dates, .edu-dates, .project-dates {
      font-size: 0.9em;
      color: var(--muted);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .job-summary, .edu-summary, .project-summary { color: var(--text-2); margin-top: 3px; }
    .job-highlights { color: var(--text-2); padding-left: 19px; margin-top: 5px; }
    .job-highlights li { margin-bottom: 4px; }
    .edu-item, .project-item { margin-bottom: 10px; }
    .edu-school { font-weight: 600; }
    .project-link { font-size: 0.9em; margin-left: 6px; white-space: nowrap; }

    .skill-row, .lang-row, .ref-item {
      display: grid;
      grid-template-columns: 180px minmax(0, 1fr);
      gap: 12px;
      margin-bottom: 5px;
    }
    .skill-name, .lang-name, .interest-name, .ref-name { font-weight: 700; }
    .skill-keywords, .lang-level, .lang-detail, .interest-summary, .ref-role { color: var(--text-2); }
    .lang-detail::before { content: ' · '; }
    .interest-item { margin-bottom: 5px; }
    .interest-summary { margin-top: 2px; }

    @media screen and (max-width: 600px) {
      body { padding: 28px 20px; }
      .header h1 { font-size: 30px; }
      .header .label { font-size: 17px; }
      .header-links { line-height: 1.9; }
      .job-header, .edu-header, .project-header { flex-direction: column; gap: 2px; }
      .skill-row, .lang-row, .ref-item { grid-template-columns: 1fr; gap: 1px; margin-bottom: 10px; }
    }

    @page { size: A4; margin: 13mm 14mm; }

    @media print {
      body {
        max-width: none;
        padding: 0;
        font-size: 10pt;
        line-height: 1.32;
        orphans: 2;
        widows: 2;
      }
      .header { margin-bottom: 11pt; }
      .header h1 { font-size: 22pt; margin-bottom: 3pt; }
      .header .label { font-size: 12pt; margin-bottom: 5pt; }
      .header-links { font-size: 8.5pt; margin-bottom: 6pt; }
      .header .summary { max-width: none; }
      .section { margin-bottom: 10pt; }
      .section-title { font-size: 9pt; margin-bottom: 6pt; padding-bottom: 3pt; break-after: avoid; }
      .job { margin-bottom: 9pt; break-inside: avoid; }
      .job-header, .edu-header, .project-header { gap: 8pt; margin-bottom: 3pt; break-after: avoid; }
      .job-summary, .edu-summary, .project-summary { margin-top: 2pt; }
      .job-highlights { margin-top: 3pt; padding-left: 13pt; }
      .job-highlights li { margin-bottom: 2pt; }
      .edu-item, .project-item { margin-bottom: 5pt; break-inside: avoid; }
      .skill-row, .lang-row, .ref-item { grid-template-columns: 112pt minmax(0, 1fr); gap: 6pt; margin-bottom: 3pt; break-inside: avoid; }
      .interest-item { break-inside: avoid; }
      .interest-summary { display: inline; }
      .interest-summary::before { content: ' — '; }
      .dl-pdf { display: none; }
      a { color: inherit; }
    }
  </style>
</head>
<body>
<main>
  <header class="header">
    <h1>${esc(b.name)}</h1>
    ${b.label ? `<div class="label">${esc(b.label)}</div>` : ''}
    <div class="header-links">
      ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
      ${b.phone ? `<span>·</span><a href="tel:${esc(b.phone.replace(/\s/g, ''))}">${esc(b.phone)}</a>` : ''}
      ${b.location && b.location.city ? `<span>·</span>${esc([b.location.city, b.location.region].filter(Boolean).join(', '))}` : ''}
      ${github ? `<span>·</span><a href="${esc(github.url)}" target="_blank" rel="noopener noreferrer">github.com/${esc(github.username)}</a>` : ''}
      ${linkedin ? `<span>·</span><a href="${esc(linkedin.url)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/${esc(linkedin.username)}</a>` : ''}
      <span class="dl-pdf">·</span><a class="dl-pdf" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View PDF</a>
    </div>
    ${b.summary ? `<p class="summary">${esc(b.summary)}</p>` : ''}
  </header>

  ${resume.work && resume.work.length ? `
  <div class="section">
    <h2 class="section-title">Experience</h2>
    ${workHtml}
  </div>` : ''}

  ${resume.skills && resume.skills.length ? `
  <div class="section">
    <h2 class="section-title">Skills</h2>
    ${skillsHtml}
  </div>` : ''}

  ${resume.projects && resume.projects.length ? `
  <div class="section">
    <h2 class="section-title">Personal project</h2>
    ${projectsHtml}
  </div>` : ''}

  ${resume.education && resume.education.length ? `
  <div class="section">
    <h2 class="section-title">Education</h2>
    ${eduHtml}
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

</main>
</body>
</html>`;
};
