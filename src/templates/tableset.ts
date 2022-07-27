import {LitElement, html, css} from 'lit';
import {customElement, property } from 'lit/decorators.js';
import {ref, createRef} from 'lit/directives/ref.js';

import Methodius from 'methodius';
import { sampleMap } from '../data';

@customElement('table-set')
class TableSet extends LitElement {
    static samples = sampleMap;
    static styles = css`
    .tableSet {
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
    }
    .tableSet__header {
        font-size: var(--smallerTextSize);
        width: 100%;
    }
    .tableSet__title {
        border-bottom: 2px solid transparent;
    }

    :host:target {
        outline: 1px solid var(--colorCoolDarker);
    }
    :host:target .tableSet__title {
        border-bottom-color: var(--colorCoolDarker);
    }
    .tableSet__sample {
        font-size: var(--smallTextSize);
        max-height: 2em;
        margin: .618rem .618rem;
        overflow: hidden;
        transition: .3s ease-in-out;
    }

    .tableSet__sampleEditor {
        width: 98%;
        min-height: 15em;
    }
.tableSet__sample[open] {
    max-height: 50vh;
}

.tableSet__sampleText {
    background: rgba(165, 165, 165, .15);
    border-left: 10px solid var(--colorNeutralLighter);
    margin: 1.618em .618rem; 
    padding: 0.618em .618rem;
    quotes: "\\201C""\\201D""\\2018""\\2019";
    width: 98%;
    min-height: 15em;
}

.tableSet__sampleText::before {
    color: var(--colorNeutralLight);
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
}
.tableSet__tables {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 5vw;
    justify-content: space-between;
    width: 100%;
    max-height: 100vh;
    overflow-y: scroll;
    transition: all .3s ease-in-out;
}

.tableSet--collapsed .tableSet__tables {
    max-height: 0em;
    overflow: hidden;
}

.tableSet__controls {
    width: 100%;
    flex-grow:1;
}
mark {
    background-color: rgba(165, 220, 165, .9);
}

::selection {
    background-color: rgba(165, 220, 220, .9);
}

/* Because mark and selection have same saturation, brightenss, mark won't easily stand out if it's selected */
mark::selection {
    background-color: rgba(165, 220, 110, .9);
}

    `;

    constructor() {
        super();
        this.ngram = new Methodius();
    }

    @property({type: String})
    direction: 'ltr' | 'rtl' = 'ltr';

    @property({ type: String, reflect: true })
    langId = '';

    @property({type: String, reflect: true})
    languageName = '';

    @property({type: String})
    languageSample = '';

    @property({type: String})
    highlightString: '';

    @property({type: Boolean})
    shouldHighlightWord = false;

    @property({type: String})
    highlightedSample = '';

    @property({type: Number})
    tableSize = 10;

    sampleTextareaRef: Ref<HTMLInputElement> = createRef();

    sampleHighlightRef: Ref<HTMLInputElement> = createRef();

    getCleanedSample(languageSample = this.languageSample) {
        const sample = languageSample;
        const cleanSample = sample
            .replaceAll(/<mark>/g, "")
            .replaceAll(/<\/mark>/g, "");

        return cleanSample;
    }
    getHighlightedSample(highlight: string, shouldHighlightWord: boolean = false) {
        const sample = this.languageSample;

        if (!highlight) return sample;
    
        const cleanSample = this.getCleanedSample(sample);

        const highlightRegex = shouldHighlightWord
            ? new RegExp(`\\b${highlight}\\b`, 'gi')
            : new RegExp(`${highlight}`, 'g');
        
        const highlightedSample = cleanSample.replaceAll(highlightRegex, `<mark>${highlight}</mark>`);

        return highlightedSample;
    }

    
    willUpdate(changedProperties) {
        if (changedProperties.has('languageName') && !this.languageSample) {
            const langSample = TableSet.samples.get(this.languageName);
            this.languageSample = langSample;
            this.ngram = new Methodius(this.getCleanedSample(this.languageSample));
            this.highlightedSample = this.languageSample;
        } else if (this.languageSample && changedProperties.has('languageSample')) {
            this.ngram = new Methodius(this.getCleanedSample(this.languageSample));
            this.highlightedSample = this.getHighlightedSample(this.highlightString, this.shouldHighlightWord);
        }
    }

    cellClickHandler(evt: Event, shouldHighlightWord: boolean = false) {
        const target = evt.composedPath()[0];
        if (target.classList.contains('table__col1')) {
            const highlightVal = target.innerText;
            this.highlightString = highlightVal;
            this.shouldHighlightWord = shouldHighlightWord;
            const highlightedSample = this.getHighlightedSample(highlightVal, shouldHighlightWord);
            this.highlightedSample = highlightedSample;
            this.sampleTextareaRef.value.removeAttribute('open');
            this.sampleHighlightRef.value.setAttribute('open', true);
        }
    }

    getTopPlacements(topNGrams: Map<String, number>, placements: Map<String, Map<String, Number>>) {
        const topPlacements = new Map<String, Map<String, Number>>();
        [...topNGrams.entries()].forEach(([bigram]) => {
            topPlacements.set(bigram, placements.get(bigram));
        });

        return topPlacements;
    }

    private _sampleUpdate(event: Event) {
        // when someone edits the text, remove highlighting
        this.languageSample = this.getCleanedSample(event.currentTarget.value);
    }

    render() {
        return html`
            <article id="${this.languageName}--tableSet" class="tableSet">
                <header class="tableSet__header">
                    <h2 class="tableSet__title">${this.languageName}</h2>
                    <details class="tableSet__sample" ${ref(this.sampleTextareaRef)}>
                        <summary>Edit sample</summary>
                        <textarea 
                            id="sample-update" 
                            class="tableSet__sampleEditor" 
                            @input="${this._sampleUpdate}" 
                            .value=${this.languageSample}
                        >
                            ${this.languageSample}>
                        </textarea>
                    </details>
                    <details class="tableSet__sample" open ${ref(this.sampleHighlightRef)}>
                        <summary class="tableSet__sampleHeading">Sample</summary>
                        <blockquote 
                            lang="${this.langId}"
                            class="js-${this.languageName} tableSet__sampleText" 
                            dir="${this.direction}" 
                            .innerHTML=${this.highlightedSample}
                        >
                        </blockquote>
                    </details>
                </header>
                    <div class="tablesContainer tableSet__tables">
                    <div class="tableSet__controls">
                    <label for="tableSize">Size of results</label>
                    <input id="tableSize" type="number" min="5" max="50" .value=${this.tableSize} @change=${(evt) => this.tableSize = evt.currentTarget.value}>
                    </div>
                    <frequency-table
                        caption="Top letter  frequencies" 
                        .frequencies=${this.ngram.getTopLetters(this.tableSize)}
                        @click=${(evt) => {this.cellClickHandler(evt)}}>
                    </frequency-table>
                    <frequency-table
                        caption="Top bigram frequencies" 
                        .frequencies=${this.ngram.getTopBigrams(this.tableSize)}
                        @click=${(evt) => {this.cellClickHandler(evt)}}>
                    </frequency-table>
                    <frequency-table 
                        caption="Top trigram frequencies" 
                        .frequencies=${this.ngram.getTopTrigrams(this.tableSize)}
                        @click=${(evt) => {this.cellClickHandler(evt)}}>
                    </frequency-table>
                    <frequency-table 
                        caption="Top word frequencies" 
                        .frequencies=${this.ngram.getTopWords(this.tableSize)}
                        @click=${(evt) => {this.cellClickHandler(evt, true)}}>
                    </frequency-table>
                    <frequency-table 
                        caption="Bigram Positions"
                        col2Header="Positions"
                        .frequencies=${this.getTopPlacements(this.ngram.getTopBigrams(this.tableSize), this.ngram.bigramPositions)}
                        @click=${(evt) => {this.cellClickHandler(evt)}}>
                    </frequency-table>
                    <frequency-table 
                        caption="Trigram Positions" 
                        col2Header="Positions"
                        .frequencies=${this.getTopPlacements(this.ngram.getTopTrigrams(this.tableSize), this.ngram.trigramPositions)}
                        @click=${(evt) => {this.cellClickHandler(evt)}}>
                    </frequency-table>
                </div>
            </article>
        `;
    }
}
