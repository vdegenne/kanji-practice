import { css, html, LitElement, nothing } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import {live} from 'lit/directives/live.js'
import { Dialog } from '@material/mwc-dialog';
import { Collection } from './types';

@customElement('collections-selector')
export class CollectionsSelector extends LitElement {
  @state() kanji!: string;

  @query('mwc-dialog') dialog!: Dialog;

  static styles = css`
  header {
    text-align:right;
    display: flex;
    justify-content:space-between;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    align-items: center;
    padding: 2px 2px 0 22px;
  }

  mwc-checkbox {
    --mdc-theme-secondary: #065fd4;
  }
  `

  render() {
    const collections = window.app.collections;

    return html`
    <mwc-dialog>
      <header>
        <div>Save ${this.kanji} to...</div>
        <mwc-icon-button icon=close
          dialogAction=close></mwc-icon-button>
      </header>

      <div style="margin-top:30px">
      ${this.kanji ? collections.map(c => {
        return html`
        <mwc-formfield label=${c.name}>
          <mwc-checkbox ?checked=${live(c.kanjis.includes(this.kanji))}
            @change=${e=>{this.onCheckboxClick(c, e)}}></mwc-checkbox>
        </mwc-formfield>
        `
      }) : nothing}
      </div>

      <mwc-button outlined slot="secondaryAction" icon=add style="--mdc-theme-primary:grey">new collection</mwc-button>
    </mwc-dialog>
    `
  }

  onCheckboxClick (collection: Collection, e) {
    const checked = e.target.checked;
    if (checked) {
      // add the kanji to the collection
      collection.kanjis.push(this.kanji)
    }
    else {
      collection.kanjis.splice(collection.kanjis.indexOf(this.kanji), 1)
    }

    window.app.saveCollections()
    window.toast(`Saved`, 2000)
  }

  open (kanji: string) {
    this.kanji = kanji
    this.dialog.show()
  }
}