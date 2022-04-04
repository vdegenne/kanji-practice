import { html, LitElement, nothing, PropertyValueMap } from 'lit'
import { customElement, query, queryAll, state } from 'lit/decorators.js'
import { Dialog } from '@material/mwc-dialog';
import { JlptWordEntry, Kanji } from './types';

import lemmas from '../docs/data/lemmas.json'
import { TextField } from '@material/mwc-textfield';
import { searchManagerStyles } from './styles/searchManagerStyles';
import { googleImageSearch, jisho, mdbg, naver, playJapaneseAudio } from './util';

import '@material/mwc-tab-bar'
import '@material/mwc-menu'

import './search-item-element'
import './concealable-span'
import { ConcealableSpan } from './concealable-span';

import _kanjis from '../docs/data/kanjis.json'
import jlpt5 from'../docs/data/jlpt5-words.json'
import jlpt4 from '../docs/data/jlpt4-words.json'
import jlpt3 from '../docs/data/jlpt3-words.json'
import jlpt2 from '../docs/data/jlpt2-words.json'
import jlpt1 from '../docs/data/jlpt1-words.json'
import { sharedStyles } from './styles/sharedStyles';
import { Menu } from '@material/mwc-menu';
import { SearchItemElement } from './search-item-element';
const jlpts: JlptWordEntry[][] = [
  jlpt5 as JlptWordEntry[],
  // [],

  jlpt4 as JlptWordEntry[],
  // [],

  jlpt3 as JlptWordEntry[],
  // [],

  jlpt2 as JlptWordEntry[],
  // [],

  jlpt1 as JlptWordEntry[],
  // [],
]
// const data: {[dictionary:string]: JlptWordEntry[]|LemmaEntry[]} = {
//   'jlpt4': jlpt4 as JlptWordEntry[]
// }
// const jlpts = [jlpt5, jlpt4, jlpt3]

export type SearchItem = {
  type: ViewType;
  dictionary: string;
  word: string;
  hiragana?: string;
  english?: string;
  frequency?: number;
}
const views = ['words', 'kanji'] as const
declare type ViewType = typeof views[number];
declare type SearchHistoryItem = { search: string, view: ViewType };

@customElement('search-manager')
export class SearchManager extends LitElement {
  @state() view: ViewType = 'words';
  @state() query: string = '';
  @state() result: SearchItem[] = []

  private _searchHistory: SearchHistoryItem[] = [{search: 'test', view: 'words'}]

  private _hideInformationsOnSearchOption = true
  @state() showShowAllInfoButton = this._hideInformationsOnSearchOption

  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textfield') textfield!: TextField;
  @queryAll('#words-results search-item-element') searchItemElements!: SearchItemElement[];
  // @queryAll('concealable-span') concealableSpans!: ConcealableSpan[];
  // @queryAll('concealable-span[concealed]') concealedSpans!: ConcealableSpan[];

  constructor () {
    super()
    this.addEventListener('click', (e) => {
      const target = e.composedPath()[0] as HTMLSpanElement;
      if (target.hasAttribute('hideInfo')) {
        target.removeAttribute('hideInfo')
      }
    })
    this.addEventListener('span-revealed', e=>{
      this.requestUpdate()
    })
  }

  /** STYLES **/
  static styles = [searchManagerStyles, sharedStyles];

  /** RENDER **/
  render () {
    const wordsResult = this.result.filter(i=>i.type=='words')
    const kanjiResult = this.result.filter(i=>i.type=='kanji')

    // @TODO here we change the view attribute in the currently used element in the search history list

    // console.log(this.query)
    return html`
    <mwc-dialog style="--mdc-dialog-min-width:calc(100vw - 32px);">
      <mwc-tab-bar
          @MDCTabBar:activated=${(e)=>this.view=views[e.detail.index]}
          activeIndex=${views.indexOf(this.view)}>
        <mwc-tab label=words></mwc-tab>
        <mwc-tab label=kanji></mwc-tab>
      </mwc-tab-bar>

      <!-- SEARCH BAR -->
      <div style="display:flex;align-items:center;position:relative">
        <mwc-textfield .value=${this.query} dialogInitialFocus
          @keypress=${e=>{if (e.key === 'Enter') {this.search(this.textfield.value)}}}
          iconTrailing=close></mwc-textfield>
        <mwc-icon-button icon=close style="position:absolute;top:4px;right:4px;"
          @click=${()=>{this.query='';this.textfield.value = '';this.textfield.focus()}}></mwc-icon-button>
      </div>

      <!-- WORDS RESULT -->
      <div id="words-results" ?hide=${this.view !== 'words'}>
        ${wordsResult.length === 0 ? html`no result` : nothing}
        ${wordsResult.map(i=>html`<search-item-element .item=${i}></search-item-element>`)}
      </div>

      <!-- KANJI RESULT -->
      <div id="kanji-results" ?hide=${this.view !== 'kanji'}>
        ${kanjiResult.length === 0 ? html`no result` : nothing}
        ${kanjiResult.map(i=>{
          return html`<search-item-element .item=${i} revealed></search-item-element>`
          return html`
          <div class=item>
            <div style="display:flex;justify-content:space-between;margin:12px 0 5px 0;">
              <span class="word">${i.word}</span>
              ${i.hiragana ? html`
              <concealable-span class=hiragana>${i.hiragana}</concealable-span>` : nothing}
              <div style="flex:1"></div>
              ${i.frequency ? html`
              <span class=lemma>${i.frequency}</span>` : nothing}
              <span class="dictionary ${i.dictionary.replace(' n', '')}-color"
                @click=${()=>mdbg(i.word)}>${i.dictionary}</span>
            </div>
            <!-- <concealable-span class=english>${i.english}</concealable-span> -->
            <span class=english>${i.english}</span>
          </div>
          `
        })}
      </div>

      ${this.showShowAllInfoButton ? html`
      <mwc-button unelevated slot="secondaryAction" style="--mdc-theme-primary:grey"
        @click=${()=>{[...this.searchItemElements].forEach(e=>e.revealed = true);this.requestUpdate()}}>
        <mwc-icon>remove_red_eye</mwc-icon>
      </mwc-button>
      ` : nothing}
      <mwc-button outlined slot="secondaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  async updated () {
    await Promise.all([...this.searchItemElements].map(e=>e.updateComplete))
    this.showShowAllInfoButton = [...this.searchItemElements].some(el => el.hasConcealedSpans())

    // ;[...this.shadowRoot!.querySelectorAll('mwc-menu')].forEach((el: Menu)=>{
    //   el.anchor = el.previousElementSibling
    // })
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    const dialogOpenedInitializingFct = () => {
      const surface = this.dialog.shadowRoot!.querySelector('.mdc-dialog__surface')!
      // @ts-ignore
      surface.style.minHeight = 'calc(100% - 32px)'
      this.dialog.removeEventListener('opened', dialogOpenedInitializingFct)
    }
    this.dialog.addEventListener('opened', dialogOpenedInitializingFct)
    this.textfield.updateComplete.then(()=>{
      this.textfield.shadowRoot!.querySelector('i')!.style.color = 'transparent'
    })
  }



  search (query: string) {
    if (query === this.query) {
      return
    }
    this.query = query
    let searchResult: SearchItem[] = []

    /** Words search */
    jlpts.forEach((entries, n) => {
      const result: SearchItem[] =
        jlpts[n]
          .filter(e=>{
            return e[0].includes(this.query!) || e[2].includes(this.query!)
          })
          .map(r=>{
            return this.attachFrequencyValue({
              type: 'words',
              dictionary: `jlpt n${5 - n}`,
              word: r[0],
              english: r[2],
              hiragana: r[1] || undefined
            })
          });
      searchResult.push(...result)
    });

    /** Kanji search */
    searchResult.push(...
      (_kanjis as Kanji[])
        .filter(e=>{
          return this.query.includes(e[1]) || e[3].includes(this.query) || e[4].includes(this.query)
        })
        .map<SearchItem>(i=>({
          type: 'kanji',
          dictionary: `jlpt n${i[2]}`,
          word: i[1],
          english: `${i[3]}//${i[4]}`
        }))
    )

    this.searchItemElements.forEach(e=>e.revealed=false)
    // should include Lemmas in the search ?
    this.result = searchResult
  }

  attachFrequencyValue (item: SearchItem) {
    const lemma = lemmas.find(e=>e.l===item.word)
    if (lemma) {
      item.frequency = lemma.f
    }
    return item
  }

  open(query?: string, view?: ViewType) {
    if (query) {
      this.search(query)
    }
    if (view) {
      this.view = view
    }
    this.dialog.show()
  }
}


export function firstWordFoundFromCharacter (character: string) {
  for (const jlpt of jlpts) {
    const result = jlpt.find(w=>w[0].includes(character))
    if (result) {
      return result
    }
  }
  return null
}