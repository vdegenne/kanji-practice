import {css, html, LitElement} from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { Dialog } from '@material/mwc-dialog';
import { Collection } from './types';
import {TextField} from "@material/mwc-textfield";
import './create-collection-dialog'
import {CreateCollectionDialog} from "./create-collection-dialog";

@customElement('collections-manager')
export class CollectionsManager extends LitElement {
  public collections: Collection[];

  get selectedCollection () { return (new URLSearchParams(window.location.search).get('collection'))}
  get collection () { return this.collections.find(c => c.name === this.selectedCollection) }

  @query('mwc-dialog') dialog!: Dialog;
  @query('create-collection-dialog') createCollectionDialog!: CreateCollectionDialog;


  constructor () {
    super()
    this.collections = localStorage.getItem('kanji-practice:collections')
      ? JSON.parse(localStorage.getItem('kanji-practice:collections')!)
      : /* default */ [{name: 'collection 1', kanjis: []}];
  }

  static styles = css`
    .collection-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `

  render () {
    return html`
    <mwc-dialog heading="Collections">
     ${this.collections.map(c => {
       return html`
           <div class="collection-row">
               <span>${c.name} (${c.kanjis.length})</span>
               <mwc-icon-button icon=replay
                    @click=${()=>{window.open(`./?collection=${encodeURIComponent(c.name)}`)}}></mwc-icon-button>
           </div>
       `
     })}
        <mwc-button outlined icon="add" slot="primaryAction"
            @click=${()=>{this.showCreateDialog()}}>new</mwc-button>
    </mwc-dialog>
    
    
    <!-- CREATE COLLECTION DIALOG -->
    <create-collection-dialog .manager="${this}"></create-collection-dialog>
    `
  }


  show() {
    this.requestUpdate()
    this.dialog.show()
  }

  async showCreateDialog () {
    try {
      await this.createCollectionDialog.show()
      this.requestUpdate()
    } catch (e) {
      // window.toast('cancelled')
      // cancel
    }
  }

  IsCharacterInACollection (character: string) {
    // console.log(this.collections)
    // console.log(this.collections.some(c=>c.kanjis.includes(character)))
    return this.collections.some(c=>c.kanjis.includes(character))
  }

  saveCollections () {
    localStorage.setItem('kanji-practice:collections', JSON.stringify(this.collections))
  }

  addCollection(name: string) {
    let collection: Collection
    this.collections.push(collection = {
      name,
      kanjis: []
    })
    return collection
  }
}