import {css, html, LitElement} from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { Dialog } from '@material/mwc-dialog';
import { Collection, Domain } from './types';
// import {TextField} from "@material/mwc-textfield";
import {CreateCollectionDialog} from "./create-collection-dialog";
import { AppContainer } from './app-container';
import { CollectionsSelector } from './collections-selector';

declare type Collections = { kanji: Collection[], words: Collection[] };

@customElement('collections-manager')
export class CollectionsManager extends LitElement {

  // App instance it belongs to
  app!: AppContainer;

  collections: Collections;

  // get collection () { return this.collections.find(c => c.name === this.selectedCollection) }

  @query('mwc-dialog') dialog!: Dialog;

  // @query('collections-selector')
  collectionsSelector: CollectionsSelector;
  // @query('create-collection-dialog')
  createCollectionDialog: CreateCollectionDialog;


  constructor (appInstance: AppContainer) {
    super()
    if (localStorage.getItem('kanji-practice:collections')) {
      let collections: Collections = JSON.parse(localStorage.getItem('kanji-practice:collections')!)
      // for old versions make sure to convert
      if (collections instanceof Array) {
        collections = {
          kanji: (collections as any[]).map(c=>({name: c.name, elements: c.kanjis})),
          words: []
        }
      }
      this.collections = collections
    }
    else {
      this.collections = {
        kanji: [{ name: 'My Kanjis', elements: [] }],
        words: [{ name: 'My Words', elements: [] }]
      }
    }

    this.app = appInstance;
    this.collectionsSelector = new CollectionsSelector(this)
    this.createCollectionDialog = new CreateCollectionDialog(this)
    // this.coll
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
     ${this.collections[this.app.domain].map(c => {
       return html`
           <div class="collection-row">
               <span>${c.name} (${c.elements.length})</span>
               <mwc-icon-button icon=replay
                    @click=${()=>{window.open(`./?collection=${encodeURIComponent(c.name)}`)}}></mwc-icon-button>
           </div>
       `
     })}
        <mwc-button outlined icon="add" slot="primaryAction"
            @click=${()=>{this.showCreateDialog()}}>new</mwc-button>
    </mwc-dialog>

    <!-- COLLECTION SELECTOR -->
    ${this.collectionsSelector}

    <!-- CREATE COLLECTION DIALOG -->
    ${this.createCollectionDialog}
    `
  }

  // @TODO: should also get the name
  get URLCollectionName () {
    // const params = new URLSearchParams(window.location.search)
    // if (params.has('collection')) {}
    return new URLSearchParams(window.location.search).get('collection')
  }

  getCollection (domain: Domain, collectionName: string) {
    return (this.collections[domain] as Collection[]).find(c=>c.name==collectionName)
  }

  IsElementInACollection(domain: Domain, element: string) {
    // console.log(this.collections)
    // console.log(this.collections.some(c=>c.kanjis.includes(character)))
    return this.collections[domain].some(c => c.elements.includes(element));
  }

  addCollection(domain: Domain, name: string) {
    let collection: Collection
    this.collections[domain].push(collection = {
      name,
      elements: []
    })
    return collection
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
      // cancel
    }
  }

  saveCollections () {
    localStorage.setItem('kanji-practice:collections', JSON.stringify(this.collections))
  }
}