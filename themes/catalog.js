'use strict';
module.exports = ['folio', 'suisse', 'dossier', 'lettre'].map(slug => require(`./${slug}`));
