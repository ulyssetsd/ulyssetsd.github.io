'use strict';

const fs = require('node:fs');
const path = require('node:path');

const esc = value => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function date(value) {
  if (!value) return '';
  const [year, month] = value.split('-');
  return month
    ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1]} ${year}`
    : year;
}

function period(entry) {
  if (!entry.startDate) return '';
  return `${date(entry.startDate)} — ${entry.endDate ? date(entry.endDate) : 'Present'}`;
}

function technologies(keywords) {
  return keywords?.length
    ? `<p class="technologies"><span class="tech-label">Technologies</span> ${keywords.map(esc).join(' · ')}</p>`
    : '';
}

function details(entry) {
  return `${entry.description ? `<p class="description">${esc(entry.description)}</p>` : ''}
    ${entry.summary ? `<p class="summary">${esc(entry.summary)}</p>` : ''}
    ${entry.highlights?.length ? `<ul class="highlights">${entry.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    ${technologies(entry.keywords)}`;
}

function entryHtml(entry, kind) {
  const education = kind === 'education';
  const title = education ? entry.institution : entry.name || entry.organization;
  const subtitle = education
    ? [entry.studyType, entry.area].filter(Boolean).join(' in ')
    : entry.position;
  return `<article class="entry ${kind}-entry">
    <div class="entry-meta">
      ${period(entry) ? `<p class="dates">${esc(period(entry))}</p>` : ''}
      ${entry.location ? `<p class="location">${esc(entry.location)}</p>` : ''}
    </div>
    <div class="entry-main">
      <header class="entry-heading">
        <h3>${esc(title)}</h3>
        ${subtitle ? `<p class="role">${esc(subtitle)}</p>` : ''}
        ${kind === 'project' && entry.url ? `<a class="project-link" href="${esc(entry.url)}">View project ↗</a>` : ''}
      </header>
      ${details(entry)}
      ${education && entry.courses?.length ? `<p>${entry.courses.map(esc).join(' · ')}</p>` : ''}
    </div>
  </article>`;
}

function section(id, title, content) {
  return content ? `<section class="section ${id}-section" aria-labelledby="${id}">
    <h2 class="section-heading" id="${id}">${esc(title)}</h2>
    <div class="section-body">${content}</div>
  </section>` : '';
}

function fontCSS() {
  const fonts = path.join(__dirname, 'fonts');
  const notices = ['inter-OFL.txt', 'sourceserif4-OFL.txt'].map(f => fs.readFileSync(path.join(fonts, f), 'utf8')).join('\n');
  const faces = [
    ['Inter', 'inter.woff2', 'normal', '400 700'],
    ['Source Serif 4', 'source-serif-4.woff2', 'normal', '400 600'],
    ['Source Serif 4', 'source-serif-4-italic.woff2', 'italic', '400 600'],
  ];
  return `/* Bundled font notices and licenses:\n${notices}\n*/\n` + faces.map(([family, file, style, weight]) =>
    `@font-face { font-family: '${family}'; font-style: ${style}; font-weight: ${weight}; font-display: swap; src: url(data:font/woff2;base64,${fs.readFileSync(path.join(fonts, file)).toString('base64')}) format('woff2'); }`
  ).join('\n');
}

function renderBody(resume) {
  const b = resume.basics || {};
  const contacts = [
    b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : '',
    b.phone ? `<a href="tel:${esc(b.phone.replace(/\s/g, ''))}">${esc(b.phone)}</a>` : '',
    b.location?.city ? `<span>${esc([b.location.city, b.location.region].filter(Boolean).join(', '))}</span>` : '',
    ...(b.profiles || []).map(p => `<a href="${esc(p.url)}">${esc(p.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>`),
  ].filter(Boolean).map(item => `<li>${item}</li>`).join('');

  return `<main class="cv">
    <header class="masthead">
      <div class="identity"><h1>${esc(b.name)}</h1>${b.label ? `<p class="headline">${esc(b.label)}</p>` : ''}</div>
      <ul class="contacts" aria-label="Contact details">${contacts}</ul>
      ${b.summary ? `<p class="intro">${esc(b.summary)}</p>` : ''}
    </header>
    ${section('experience', 'Experience', (resume.work || []).map(e => entryHtml(e, 'work')).join(''))}
    ${section('skills', 'Skills', (resume.skills || []).map(s => `<div class="skill"><h3>${esc(s.name)}</h3><p>${(s.keywords || []).map(esc).join(' · ')}</p></div>`).join(''))}
    ${section('projects', 'Projects', (resume.projects || []).map(e => entryHtml(e, 'project')).join(''))}
    ${section('education', 'Education', (resume.education || []).map(e => entryHtml(e, 'education')).join(''))}
    ${section('volunteer', 'Volunteering', (resume.volunteer || []).map(e => entryHtml(e, 'volunteer')).join(''))}
    ${section('languages', 'Languages', (resume.languages || []).map(l => `<div class="detail-row"><h3>${esc(l.language)}</h3><p>${esc(l.fluency)}${l.summary ? `<br><span>${esc(l.summary)}</span>` : ''}</p></div>`).join(''))}
    ${section('interests', 'Interests', (resume.interests || []).map(i => `<div class="detail-row"><h3>${esc(i.name)}</h3>${i.summary ? `<p>${esc(i.summary)}</p>` : ''}</div>`).join(''))}
    ${section('references', 'References', (resume.references || []).map(r => `<div class="detail-row"><h3>${esc(r.name)}</h3><p>${esc(r.reference)}</p></div>`).join(''))}
  </main>`;
}

function createTheme(metadata, cssFile) {
  const css = [fontCSS(), fs.readFileSync(path.join(__dirname, 'base.css'), 'utf8'), fs.readFileSync(cssFile, 'utf8')].join('\n');
  return {
    metadata,
    pdfRenderOptions: {
      mediaType: 'print', format: 'A4', preferCSSPageSize: true, printBackground: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: '<div style="font:8px Arial,sans-serif;color:#647080;width:100%;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    },
    render(resume) {
      return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${esc(resume.basics?.name)} — ${esc(resume.basics?.label || 'Resume')}</title>
        <meta name="description" content="${esc(resume.basics?.summary)}"><style>${css}</style></head>
        <body class="theme-${metadata.slug}">${renderBody(resume)}</body></html>`;
    },
  };
}

module.exports = { createTheme, esc, fontCSS };
