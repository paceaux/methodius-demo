const { table } = require('console');

function highlightTextCb (evt) {
  if (evt.target.classList.contains('table__col1')) {
    const textEl = document.querySelector(evt.target.dataset.highlightContainer);
    const highlightVal = evt.target.dataset.highlightKey;
    const sampleText = textEl.innerText;
    const highlightedText = sampleText
        .replaceAll(/<mark>/g, "")
        .replaceAll(/<mark>/g, "")
        .replaceAll(new RegExp(highlightVal, "g"), `<mark>${highlightVal}</mark>`);
    textEl.innerHTML = highlightedText;
  }
};

function collapseTablesCb(evt) {
  if (evt.target.classList.contains('tableSet__title')) {
    const tableSet = evt.target.parentNode.parentNode;
    tableSet.classList.toggle('tableSet--collapsed');
  }
}


function updateTables(setContainer, ngrammer, language, size) {
    const tableSetContainer = setContainer.querySelector('.tableSet__tables');
    tableSetContainer.parentNode.removeChild(tableSetContainer);
    const newTables = makeTables(ngrammer, language, size);
    setContainer.appendChild(newTables);
}

/**
 * Creates a two-column table
 *
 * @param {Map<string, number>} map a map of ngrams to their counts
 * @param {string} language the language of the ngrams
 * @param {string} [caption=''] a caption for the table
 * @returns {HTMLTableElement} a table with the ngrams and their counts
 */
function makeTable(map, language = "en", caption = "") {
  const table = document.createElement("table");
  const thead = table.createTHead();
  const tbody = table.createTBody();
  const headerRow = thead.insertRow();
  const colHeader1 = document.createElement("th");
  const colHeader2 = document.createElement("th");
  table.createCaption();

  table.classList.add("tableSet__table");
  table.caption.innerText = `${language} ${caption}`;
  table.summary = `${language} ${caption}`;

  colHeader1.id = `${language}-col1`;
  colHeader1.textContent = "Ngram";

  colHeader2.id = `${language}-col2`;
  colHeader2.textContent = "Frequency";

  headerRow.appendChild(colHeader1);
  headerRow.appendChild(colHeader2);

  map.forEach((value, key) => {
    const tr = tbody.insertRow();
    const keyCell = document.createElement("th");
    keyCell.classList.add('table__col1')
    keyCell.title = `double-click to highlight '${key}' in the text`;
    keyCell.dataset.highlightContainer = `.js-${language}-text`;
    keyCell.dataset.highlightKey = key;
    keyCell.textContent = key;
    keyCell.scope = "row";
    keyCell.headers = `${language}-col1`;
    tr.appendChild(keyCell);
    const valueCell = tr.insertCell();
    valueCell.textContent = value;
    valueCell.headers = `${language}-col2`;
  });
  return table;
}

/**
 * Creates an array of <HTMLTableElement>s for each language
 * @param {NGrammer } ngrammer
 * @param {string} language language
 * @param {number} size the size of the table
 * @returns {HTMLElement} HTMLElement containing four tables
 */
function makeTables(ngrammer, language, size) {
  const tablesContainer = document.createElement("div");
  tablesContainer.classList.add('tablesContainer');
  tablesContainer.classList.add('tableSet__tables');
  const topLettersTable = makeTable(
    ngrammer.getTopLetters(size),
    language,
    "Top Letters"
  );
  const topBigramsTable = makeTable(
    ngrammer.getTopBigrams(size),
    language,
    "Top Bigrams"
  );
  const topTrigramsTable = makeTable(
    ngrammer.getTopTrigrams(size),
    language,
    "Top Trigrams"
  );
  const topWordsTable = makeTable(
    ngrammer.getTopWords(size),
    language,
    "Top Words"
  );

  const tablesArray = [topLettersTable, topBigramsTable, topTrigramsTable, topWordsTable];

  tablesArray.forEach(table => {
    tablesContainer.appendChild(table);
  });

  return tablesContainer;
}

/**
 * Creates a set of two-column for each language
 *
 * @param {NGrammer} ngrammer the ngrammer to use
 * @param {string} language the language of the ngrams
 * @param {number} size the number of rows in the tables
 * @returns {HTMLTableElement} an <article> with the tables
 */
function makeTableSet(ngrammer, language, size = 12) {
  const setContainer = document.createElement("article");
  setContainer.id = `${language}-tableSet`;

  setContainer.innerHTML = `
  <header class="tableSet__header">
    <h2 class="tableSet__title js-collapse-tables">${language}</h2>
      <details class="tableSet__sample">
        <summary class="tableSet__sampleHeading">Sample</summary>
      <blockquote contenteditable class="js-${language}-text tableSet__sampleText">${ngrammer.text}</blockquote>
    </details>
  </header>
  `;

  setContainer.id = `${language}-tableSet`;
  setContainer.classList.add("tableSet");

  const tables = makeTables(ngrammer, language, size);

  // add an event for when the text changes
  // this is stupid. I don't care
  // I want the text to be editable And I don't care to make a whole reactive app for a friggin' demo
  setContainer
    .querySelector(`.js-${language}-text`)
    .addEventListener("input", () => {
      // eslint-disable-next-line no-param-reassign
      ngrammer.text = setContainer.querySelector(
        `.js-${language}-text`
      ).innerText;
      updateTables(setContainer, ngrammer, language, size);
    });

    setContainer.appendChild(tables);

  setContainer.addEventListener('dblclick', highlightTextCb);
  setContainer.addEventListener('click', collapseTablesCb);
  return setContainer;
}

/**
 * creates all of the ngram tables for all the languages
 *
 * @param {Array<NGrammer>} ngrams the ngrammers to use
 * @param {HTMLElement} container the container to append the tablessets to
 * @returns {void}
 */
function makeTableSets(ngrams, container) {
  ngrams.forEach((ngrammer, language) => {
    console.log(`${language}:`);
    console.log(ngrammer);

    const setContainer = makeTableSet(ngrammer, language);
    container.appendChild(setContainer);
  });
}

function makeNav(ngrams, container) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createElement('ul'));
    frag.querySelector('ul').classList.add('navList');
    ngrams.forEach((ngram, language) => {
        const { innerHTML} = frag.firstElementChild;
        frag.firstElementChild.innerHTML += `
            <li class="navList__item">
                <a href="#${language}-tableSet" class="navList__link">${language}</a>
            </li>`;
    });
    container.appendChild(frag);
}

module.exports = {
  makeTableSets,
  makeTableSet,
  makeNav
};
