'use strict';
module.exports = require('../_shared/render').createTheme({
  slug: 'suisse', name: 'Suisse', number: '02', accent: '#254fba',
  description: 'Une grille franche, une typographie sans empattements et des rubriques dans la marge.',
  character: 'Graphique · Grille · Bleu cobalt',
}, require('node:path').join(__dirname, 'style.css'));
