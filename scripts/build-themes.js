'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const puppeteer = require('puppeteer');
const themes = require('../themes/catalog');
const resume = require('../resume.json');
const { esc, fontCSS } = require('../themes/_shared/render');

const output = path.join(__dirname, '../public/themes');

function previewHTML(html, theme) {
  const styles = `<style>
    .variant-tools { position:sticky;top:0;z-index:2;background:#fff;color:#243443;border-bottom:1px solid #dce1e6;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;font:12px/1.5 'Inter',sans-serif; }
    .variant-tools nav { display:flex;flex-wrap:wrap;gap:14px; }
    .variant-tools a { color:#334d68; }
    .variant-tools a[aria-current] { font-weight:700;text-decoration:underline;text-underline-offset:4px; }
    .variant-tools .pdf-link { font-weight:600;white-space:nowrap; }
    @media(max-width:650px) { .variant-tools { position:static;flex-wrap:wrap;padding:12px 18px; } .variant-tools nav { order:3;flex-basis:100%; } }
    @media print { .variant-tools { display:none; } }
  </style>`;
  const bar = `<aside class="variant-tools" lang="fr" aria-label="Choisir une présentation">
    <a href="../index.html">← Les quatre thèmes</a>
    <nav aria-label="Thèmes">${themes.map(t => `<a href="../${t.metadata.slug}/index.html"${t === theme ? ' aria-current="page"' : ''}>${esc(t.metadata.name)}</a>`).join('')}</nav>
    <a href="resume.pdf" class="pdf-link">Télécharger le PDF ↓</a>
  </aside>`;
  return html.replace('</head>', styles + '</head>').replace(/(<body[^>]*>)/, '$1' + bar);
}

function galleryHTML() {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Quatre thèmes — ${esc(resume.basics.name)}</title><style>${fontCSS()}
    *{box-sizing:border-box}body{margin:0;background:#f6f7f9;color:#243344;font:14px/1.6 'Inter',sans-serif}
    main{max-width:1440px;margin:auto;padding:50px 44px 70px}a{color:inherit;text-underline-offset:4px}a:focus-visible{outline:2px solid #254fba;outline-offset:5px}
    .top{display:flex;justify-content:space-between;gap:20px;font-size:12px;color:#526273;margin-bottom:50px}.top a{text-decoration:none}
    h1{font:400 clamp(36px,4.5vw,62px)/1.1 'Source Serif 4',serif;letter-spacing:-.04em;margin:0 0 20px;max-width:780px}
    .intro{max-width:660px;margin:0;color:#526273;font-size:15px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin-top:46px}
    article{min-width:0}.caption{display:flex;align-items:baseline;gap:10px;margin-bottom:16px}.number{font-size:11px;color:#647486}h2{font-size:20px;font-weight:500;letter-spacing:-.04em;margin:0}
    .cover{display:block;border:1px solid #dde2e8;background:white;overflow:hidden;aspect-ratio:210/297;border-top:3px solid var(--accent)}.cover img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
    .character{font-size:11px;color:var(--accent);margin:18px 0 8px;font-weight:500}.description{color:#526273;font-size:13px;min-height:64px;margin:0}
    .actions{display:flex;gap:17px;font-size:12px;margin-top:18px}.actions a{font-weight:600}footer{margin-top:48px;padding-top:20px;border-top:1px solid #dce1e7;font-size:12px;color:#526273}
    @media(max-width:1100px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:40px 24px}.cover{max-height:540px}.description{min-height:0}}
    @media(max-width:600px){main{padding:28px 22px 45px}.top{margin-bottom:35px}.grid{grid-template-columns:1fr;gap:42px;margin-top:34px}.cover{max-height:600px}.intro{font-size:14px}}
    </style></head><body><main>
      <div class="top"><span>${esc(resume.basics.name)}</span><a href="../index.html">CV actuel ↗</a></div>
      <h1>Quatre façons de lire<br>le même parcours.</h1>
      <p class="intro">Même contenu intégral, quatre approches typographiques. Explore chaque version à l’écran ou télécharge son PDF.</p>
      <div class="grid">${themes.map(({metadata:m}) => `<article style="--accent:${m.accent}">
        <div class="caption"><span class="number">${m.number}</span><h2>${esc(m.name)}</h2></div>
        <a class="cover" href="${m.slug}/index.html"><img src="${m.slug}/preview.png" alt="Aperçu du CV avec le thème ${esc(m.name)}" width="980" height="1386"></a>
        <p class="character">${esc(m.character)}</p><p class="description">${esc(m.description)}</p>
        <div class="actions"><a href="${m.slug}/index.html">Voir la version web ↗</a><a href="${m.slug}/resume.pdf">PDF ↓</a></div>
      </article>`).join('')}</div>
      <footer>Les expériences, projets, technologies et références sont présents dans les quatre versions.</footer>
    </main></body></html>`;
}

async function build() {
  await fs.mkdir(output, {recursive:true});
  const browser = await puppeteer.launch({
    ...(process.env.PUPPETEER_EXECUTABLE_PATH ? {executablePath:process.env.PUPPETEER_EXECUTABLE_PATH} : {}),
    args: process.env.RESUME_PUPPETEER_NO_SANDBOX ? ['--no-sandbox'] : [],
  });
  try {
    const page = await browser.newPage();
    for(const theme of themes) {
      const folder = path.join(output, theme.metadata.slug);
      await fs.mkdir(folder, {recursive:true});
      const html = theme.render(resume);
      await fs.writeFile(path.join(folder, 'index.html'), previewHTML(html, theme));
      await page.emulateMediaType('screen');
      await page.setViewport({width:980,height:1386,deviceScaleFactor:1});
      await page.setContent(html, {waitUntil:'load'});
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({path:path.join(folder, 'preview.png')});
      await page.emulateMediaType('print');
      await page.evaluate(() => document.fonts.ready);
      const {mediaType, ...options} = theme.pdfRenderOptions;
      await page.pdf({...options, path:path.join(folder, 'resume.pdf')});
      console.log(`${theme.metadata.name}: HTML, PDF and preview generated`);
    }
    await fs.writeFile(path.join(output, 'index.html'), galleryHTML());
  } finally {
    await browser.close();
  }
}

build().catch(error => { console.error(error); process.exitCode = 1; });
