import { css, html, LitElement, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { Dialog } from '@material/mwc-dialog';
import { Collection } from './types';
import { getRowFromId } from './data';
import { CollectionsManager } from './collections-manager';
import { sharedStyles } from './styles/sharedStyles';

@customElement('collection-viewer')
export class CollectionViewer extends LitElement {
  // private manager!: CollectionsManager;

  @state() collection?: Collection;

  @query('mwc-dialog') dialog!: Dialog;

  static styles = [sharedStyles, css`
  .word {
    font-size: 2em;
    margin: 25px 0;
  }
  `]

  render() {
    return html`
    <mwc-dialog heading="${this.collection?.name || ''}">

      ${this.collection ? this.collection?.elements.map(id=> {
        const row = getRowFromId(window.app.domain, id)
        return this.wordTemplate(row[1])
      }) : nothing}

      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>
    `
  }

  show (collection: Collection) {
    this.collection = collection;
    this.dialog.show()
  }


  wordTemplate (word: string) {
    return html`
    <div class=word>
      <span class="jp-font" @click=${()=>{window.searchManager.show(word, 'words')}}>${word}</span>
    </div>
    `
  }
}