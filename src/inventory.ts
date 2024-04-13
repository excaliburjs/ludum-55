import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js';

import monsterSheetPng from './images/monsters.png';
import { Level } from './levels/intro-level';
import { Unit, UnitType } from './unit';

export type InventoryConfig = Record<UnitType, number>;

@customElement('app-inventory')
export class Inventory extends LitElement {
    public counts: Record<UnitType, number> = {
        dragon: 0,
        orc: 0,
        goblin: 0,
        kobold: 0,
        rat: 0,
        knight: 0,
        archer: 0
    };
    static styles = [
        css`
            :root {
                --monster-image-path: '';
                --sprite-width: 32px;
            }
            :host {
                font-family: sans-serif;
            }

            .container {
                display: block;
                background-color: black;
                color: white;
                position: absolute;
                right: 0;
                top: 0;
                padding: 1rem;
                font-size: 24px
            }

            ul {
                padding: 0;
            }

            button {
                all: unset;
                cursor: pointer;
            }
            button:hover,button:focus-visible {
                outline: white solid 2px;
            }

            span {
                margin-right: auto;
            }

            li,button {
                display: flex;
                flex-grow: 1;
            }

            .unit-image {
                background-image: var(--monster-image-path);
                width: 32px;
                height: 32px;
            }

            .unit-image:not(:last-child) {
                /* margin-right: -20px; */
            }

            .dragon {
                background-position: calc(32px * -3) 0;
            }
            .kobold {
                background-position: calc(32px * -4) 0;
            }
            .orc {
                background-position: calc(32px * -2) 0;
            }
            .goblin {
                background-position: calc(32px * -1) 0;
            }
            .rat {
                background-position: calc(32px * 0) 0;
            }
        `
    ];
    level!: Level;

    constructor() {
        super();
    }

    setInventoryConfig(config: InventoryConfig) {
        this.counts = config;
        this.requestUpdate();
    }

    getInventoryConfig() {
        return this.counts;
    }

    setLevel(level: Level) {
        this.level = level;
    }
    
    override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        const container = this.renderRoot.querySelector('.container') as HTMLElement;
        container.style.setProperty('--monster-image-path', `url(${monsterSheetPng})`);
    }

    onSelection = (type: UnitType) => {
        return () => {
            if (this.counts[type] > 0) {
                const unit = new Unit({type});
                if (this.level.currentSelection) {
                    this.level.cancelSelection();
                }
                this.level.selectUnit(unit);
                this.counts[type]--;
                this.requestUpdate();
            }
        }
    }

    render() {
        return html`
        <div class="container">
            <h2>Inventory</h2>
            <ul>
                ${repeat(Object.entries(this.counts), ([type, _]) => type, ([type, count]) => count > 0 ? html`
                    <li>
                        <button @click=${this.onSelection(type as UnitType)}>
                            <span>${type}</span>
                            ${new Array(count).fill(null).map(() => 
                                html`<div class="unit-image ${type}"></div>`
                            )}
                        </button>
                    </li>
                ` : ``)}
            </ul>
        </div>`;
    }
}
