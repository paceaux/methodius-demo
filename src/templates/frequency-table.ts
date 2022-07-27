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
    ` ];

    @property({ type: String})
    caption = '';

    @property({ attribute: false })
    frequencies = new Map<string, number>();

    render() {
        return html`
            <table class="table">
                <caption class="table__caption">${this.caption}</caption>
                <thead class="table__head">
                    <tr>
                        <th id="col1">N-gram</th>
                        <th id="col2">Frequency</th>
                    </tr>
                </thead>
                <tbody class="table__body">
                    ${repeat(this.frequencies, (ngram) => ngram.id, ([ngram, frequency]) => html`
                        <tr>
                        <th headers="col1" id=${ngram} class="table__col1">${ngram}</th>
                        <td headers="${ngram} col2" class="table__col2">${frequency}</td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }
}

