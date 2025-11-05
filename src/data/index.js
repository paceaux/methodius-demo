const samples = require("../../samples");



/**
 * takes a map of samples and creates a map of ngram objects
 *
 * @param {Map<string, string>} sampleMap collection of samples
 * @param {NGrammer} NGrammer the ngrammer instance
 * @returns {Map<string,NGrammer>} a map of ngram objects
 */
function generateNgramsFromSamples(sampleMap, NGrammer) {
  const ngrams = new Map();
  sampleMap.forEach((sample, language) => {
    const ngrammer = new NGrammer(sample);
    ngrams.set(language, ngrammer);
  });
  return ngrams;
}

function sortSamplesByName(set) {
  const sortedArray = [...set]
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0
    });
  const sortedSet = new Set([...sortedArray]);
  return sortedSet;
}

function createMapFromSet(set, sampleName) {
  const sortedSet = sortSamplesByName(set);
  const map = new Map();
  sortedSet.forEach(sample => {
      map.set(sample.name, sample[sampleName]);
  });
  return map;
}
// create a map of samples with their languages
const sampleMap = createMapFromSet(samples, 'udhrPreamble');

module.exports = {
  generateNgramsFromSamples,
  sampleMap,
}