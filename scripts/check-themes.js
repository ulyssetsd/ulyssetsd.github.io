'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL, fileURLToPath} = require('node:url');
const puppeteer = require('puppeteer');
const themes = require('../themes/catalog');
const resume = require('../resume.json');

const normalize = s => String(s).replace(/\s+/g, ' ').trim();

async function check() {
  const browser = await puppeteer.launch({
    ...(process.env.PUPPETEER_EXECUTABLE_PATH ? {executablePath:process.env.PUPPETEER_EXECUTABLE_PATH} : {}),
    args: process.env.RESUME_PUPPETEER_NO_SANDBOX ? ['--no-sandbox'] : [],
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for(const {metadata} of themes) {
      const file = path.join(__dirname, '../public/themes', metadata.slug, 'index.html');
      await page.goto(pathToFileURL(file).href);
      await page.evaluate(() => document.fonts.ready);
      const body = normalize(await page.$eval('.cv', el => el.innerText));
      for(const field of ['name','label','email','phone','summary']) assert(body.includes(normalize(resume.basics[field])), `${metadata.slug}: missing ${field}`);
      const collections = {work:'.work-entry', projects:'.project-entry', education:'.education-entry'};
      for(const [key,selector] of Object.entries(collections)) {
        const cards = await page.$$eval(selector, entries => entries.map(e => e.innerText));
        assert.equal(cards.length, resume[key].length, `${metadata.slug}: ${key} count`);
        resume[key].forEach((entry,i) => {
          const text = normalize(cards[i]);
          for(const field of ['name','institution','position','studyType','area','location','description','summary']) if(entry[field]) assert(text.includes(normalize(entry[field])),`${metadata.slug}: ${entry.name || entry.institution} missing ${field}`);
          for(const field of ['highlights','keywords']) for(const value of entry[field] || []) assert(text.includes(normalize(value)),`${metadata.slug}: missing ${value}`);
        });
      }
      for(const key of ['skills','languages','interests','references']) for(const entry of resume[key]) {
        for(const field of ['name','language','fluency','summary','reference']) if(entry[field]) assert(body.includes(normalize(entry[field])),`${metadata.slug}: missing ${entry[field]}`);
        for(const keyword of entry.keywords || []) assert(body.includes(normalize(keyword)),`${metadata.slug}: missing ${keyword}`);
      }
      for(const width of [320,375,900,1440]) {
        await page.setViewport({width,height:1000});
        const overflow = await page.evaluate(() => ({
          width:document.documentElement.scrollWidth,
          elements:[...document.querySelectorAll('.cv *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => el.className),
        }));
        assert.equal(overflow.width,width,`${metadata.slug}: overflow at ${width}`);
        assert.deepEqual(overflow.elements,[],`${metadata.slug}: overflow at ${width}`);
      }
      const links = await page.$$eval('a[href]', nodes => nodes.map(a => a.href));
      for(const url of links.filter(u => u.startsWith('file:'))) assert(fs.existsSync(fileURLToPath(url)), `${metadata.slug}: broken local link ${url}`);
      console.log(`${metadata.name}: complete content, local links and four screen widths passed`);
    }
    await page.goto(pathToFileURL(path.join(__dirname,'../public/themes/index.html')).href);
    const links = await page.$$eval('a[href], img[src]', nodes => nodes.map(n => n.href || n.src));
    for(const url of links) assert(fs.existsSync(fileURLToPath(url)),`Gallery: missing ${url}`);
    for(const width of [375,1440]) {
      await page.setViewport({width,height:1000});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth),width,'Gallery overflow');
    }
    assert.deepEqual(errors,[],'Browser errors');
    console.log('Gallery links, images and responsive layout passed');
  } finally { await browser.close(); }
}

check().catch(error => { console.error(error); process.exitCode = 1; });
