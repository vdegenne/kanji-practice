import { html, LitElement } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { Dialog } from '@material/mwc-dialog';
import { Collection } from './types';

@customElement('collections-manager')
export class CollectionsManager extends LitElement {
  public collections: Collection[];

  get selectedCollection () { return (new URLSearchParams(window.location.search).get('collection'))}
  get collection () { return this.collections.find(c => c.name === this.selectedCollection) }

  @query('mwc-dialog') dialog!: Dialog;

  constructor () {
    super()
    this.collections = localStorage.getItem('kanji-practice:collections')
      ? JSON.parse(localStorage.getItem('kanji-practice:collections')!)
      : /* default */ [{name: 'collection 1', kanjis: []}];
  }

  render () {
    return html`
    <mwc-dialog>
     ${this.collections.map(c => {
       return html`<a href="./?collection=${encodeURIComponent(c.name)}">${c.name} (${c.kanjis.length})</a>`
     })}
    </mwc-dialog>
    `
  }

  show() {
    this.dialog.show()
  }

  IsCharacterInACollection (character: string) {
    console.log(this.collections)
    console.log(this.collections.some(c=>c.kanjis.includes(character)))
    return this.collections.some(c => c.kanjis.includes(character))
  }

  saveCollections () {
    localStorage.setItem('kanji-practice:collections', JSON.stringify(this.collections))
  }
}