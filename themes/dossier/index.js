'use strict';
module.exports = require('../_shared/render').createTheme({
  slug: 'dossier', name: 'Dossier', number: '03', accent: '#356776',
  description: 'Une lecture chronologique : dates en marge, texte aligné et repères bleu pétrole.',
  character: 'Chronologique · Dates en marge · Bleu pétrole',
}, require('node:path').join(__dirname, 'style.css'));
