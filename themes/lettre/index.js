'use strict';
module.exports = require('../_shared/render').createTheme({
  slug: 'lettre', name: 'Lettre', number: '04', accent: '#354d72',
  description: 'Une composition classique : en-tête centré, titres italiques et une colonne de lecture calme.',
  character: 'Classique · Centré · Bleu ardoise',
}, require('node:path').join(__dirname, 'style.css'));
