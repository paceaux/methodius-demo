const NGrammer = require('methodius');
// const { generateNgramsFromSamples, sampleMap } = require('./sampleManager');
const { makeTableSets, makeNav } = require('./dom-templates');
const { LanguageNav, TableSet } = require('./lit-templates.ts');




// convert that map to ngram objects
// const ngrams = generateNgramsFromSamples(sampleMap, NGrammer);
// add it to the page
// makeTableSets(ngrams, document.querySelector('.js-tables'));
// makeNav(ngrams, document.querySelector('.js-nav'));
window.NGrammer = NGrammer;
