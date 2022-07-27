import {LitElement, html, css} from 'lit';
import {customElement, state, property } from 'lit/decorators.js';
import {repeat} from 'lit-html/directives/repeat.js';

import { sampleMap } from '../data';

@customElement('language-nav')
class LanguageNav extends LitElement {
    @state({type: Map})
    private languages = sampleMap;

    static styles = css`

        :host {
            grid-area: nav;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        } 
        .navList {
            list-style-type: none;
            font-size: var(--smallTextSize);
        }
        .navList__link {
            color: var(--baseLinkColor);
            text-decoration: inherit;
            border-bottom: 1px solid transparent;
            transition: inherit;
        }

        .navList__link:hover,
        .navList__link:focus {
            color: var(--baseLinkColorHover);
            border-color: var(--baseLinkColorHover);
            outline: inherit;
        }
    `;
    render() {
        return html`
        <nav>
            <ul class="g-header__nav-list navList">
                ${repeat( this.languages, ([languageName ]) => html`
                    <li class="navList__item">
                        <a href="#${languageName}--tableSet" class="navList__link">${languageName}</a>
                    </li>
                `)}
            </ul>
        </nav>
        `;
    }
}
