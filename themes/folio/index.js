'use strict';
module.exports = require('../_shared/render').createTheme({
  slug: 'folio', name: 'Folio', number: '01', accent: '#315b83',
  description: 'Un esprit éditorial : grands titres à empattements, texte généreux et bleu encre.',
  character: 'Éditorial · Empattements · Bleu encre',
}, require('node:path').join(__dirname, 'style.css'));
