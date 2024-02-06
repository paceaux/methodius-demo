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
            width: 100%;
            height: var(--navHeight);
        } 

        .navContainer {
            height: var(--navHeight);
            width: 100%;
        }
        .navList {
            list-style-type: none;
            font-size: var(--smallTextSize);
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            height: var(--navHeight);
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
        <nav class="g-header__nav-container navContainer">
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

export default LanguageNav;