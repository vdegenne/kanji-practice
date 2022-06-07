import { css, html, LitElement, nothing } from 'lit';
import {customElement, query, queryAll, state} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js'
import { Dialog } from '@material/mwc-dialog';
import { Collection, Domain, Row } from './types';
import {CollectionsManager} from "./collections-manager";
import {Checkbox} from "@material/mwc-checkbox";
import {Formfield} from "@material/mwc-formfield";

@customElement('collections-selector')
export class CollectionsSelector extends LitElement {
  public manager!: CollectionsManager;

  @state() row!: Row;
  @state() domain!: Domain;

  @query('mwc-dialog') dialog!: Dialog;
  @queryAll('mwc-checkbox') checkboxes!: Checkbox[]

  constructor (managerInstance: CollectionsManager) {
    super()
    this.manager = managerInstance;
    this.manager.collectionsSelector = this;
  }

  static styles = css`
  :host {
    display: block;
  }
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
    --mdc-theme-secondary:yellow;
    --mdc-checkbox-ink-color: black;
  }
  `

  render() {
    let collections
    try {
      collections = this.manager.collections[this.domain].slice(0).sort((a, b) => {
        // sorted alphabetically
        return a.name.localeCompare(b.name);
      })
    } catch (e) {}

    return html`
    <mwc-dialog>
      <header>
        <div>Save ${this.row ? this.row[1] : ''} to...</div>
        <mwc-icon-button icon=close
          dialogAction=close></mwc-icon-button>
      </header>

      <div style="margin-top:38px;display: flex;flex-direction: column;">
      ${this.row ? collections.map(c => {
        return html`
        <mwc-formfield label=${c.name}>
          <mwc-checkbox ?checked=${live(c.elements.includes(this.row[0]))}
            @change=${e=>{this.onCheckboxClick(c, e)}}></mwc-checkbox>
        </mwc-formfield>
        `
      }) : nothing}
      </div>

      <mwc-button outlined slot="secondaryAction" icon=add style="--mdc-theme-primary:grey"
        @click=${()=>{this.onCreateNewCollectionButtonClick()}}>new collection</mwc-button>
    </mwc-dialog>
    `
  }

  private async onCreateNewCollectionButtonClick() {
    try {
      const collection = await this.manager.createCollectionDialog.show()
      this.requestUpdate()
      await this.updateComplete
      // get the checkbox
      ;([...this.checkboxes].find(el=>(el.parentElement as Formfield).label==collection.name) as Checkbox).click()
    }
    catch (e) {
      // cancelled
    }
  }

  onCheckboxClick (collection: Collection, e) {
    const checked = e.target.checked;
    if (checked) {
      // add the kanji to the collection
      collection.elements.push(this.row[0])
    }
    else {
      collection.elements.splice(collection.elements.indexOf(this.row[0]), 1)
    }

    this.manager.saveCollections()
    window.toast(`Saved`, 2000)
  }

  show (domain: Domain, rowToAdd: Row) {
    // console.log(rowToAdd)
    this.domain =domain
    this.row = rowToAdd
    this.dialog.show()
  }
}