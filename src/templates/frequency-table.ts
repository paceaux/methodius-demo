import {LitElement, html, css} from 'lit';
import {customElement, property } from 'lit/decorators.js';

import {repeat} from 'lit-html/directives/repeat.js';

import { tableStyles} from '../styles/table-styles';

@customElement('frequency-table')
class FrequencyTable extends LitElement {

    static styles = [tableStyles, css`
    :host {
        flex-basis: 20vw;
        flex-grow: 1;
    }

    table {
        width: 100%;
    }
   
    th {
        --tableHeaderSize: var(--smallTextSize);
      }
    td {
        --tableCellSize: var(--smallerTextSize);
    }
    dl {
        display: inline-flex;
        flex-wrap: wrap;
        margin: 0;

    }
    dt {
        flex-basis: 50%;
    }

    ` ];

    @property({ type: String})
    caption = '';

    @property({ attribute: false })
    frequencies = new Map<string, number>();

    @property({ type: String})
    col1Header = 'N-gram';

    @property({ type: String})
    col2Header = 'Frequency';

    @property({ type: String})
    langId = '';

    @property({ type: String})
    direction: 'ltr' | 'rtl' = 'ltr';

    getFrequency(frequency) {
        if (typeof frequency === 'number' || typeof frequency === 'string') {
            return html`${frequency}`
        }

        if (frequency instanceof Map) {
            const entries = [...frequency.entries()];
            return html`
                <dl>
                    ${repeat(entries, ([key, value]) => key, ([key, value]) => html`
                        <dt>${key}: </dt>
                        <dd>${value}</dd>
                    `)}
                </dl>
            `
        }
    }
    render() {
        return html`
            <table class="table">
                <caption class="table__caption">${this.caption}</caption>
                <thead class="table__head">
                    <tr>
                        <th id="col1">${this.col1Header}</th>
                        <th id="col2">${this.col2Header}</th>
                    </tr>
                </thead>
                <tbody class="table__body">
                    ${repeat(this.frequencies, (ngram) => ngram.id, ([ngram, frequency]) => html`
                        <tr>
                        <th headers="col1" id=${ngram} class="table__col1" title="click to highlight '${ngram}' in the text" lang="${this.langId}" direction="${this.direction}">${ngram}</th>
                        <td headers="${ngram} col2" class="table__col2">${this.getFrequency(frequency)}</td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }
}

export default FrequencyTable;