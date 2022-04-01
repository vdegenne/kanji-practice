import { html, LitElement, nothing } from 'lit'
import { customElement, query, queryAll, state } from 'lit/decorators.js'
import { Dialog } from '@material/mwc-dialog';
import { JlptWordEntry } from './types';

import lemmas from '../docs/data/lemmas.json'
import { TextField } from '@material/mwc-textfield';
import { wordsManagerStyles } from './styles/wordsManagerStyles';
import { naver, playJapaneseAudio } from './util';

import '@material/mwc-tab-bar'
import './concealable-span'
import { ConcealableSpan } from './concealable-span';

import jlpt5 from'../docs/data/jlpt5-words.json'
import jlpt4 from '../docs/data/jlpt4-words.json'
import jlpt3 from '../docs/data/jlpt3-words.json'
import jlpt2 from '../docs/data/jlpt2-words.json'
import jlpt1 from '../docs/data/jlpt1-words.json'
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

declare type SearchItem = {
  type: ViewType;
  dictionary: string;
  word: string;
  hiragana?: string;
  english?: string;
  frequency?: number;
}
declare type ViewType = 'words'|'kanji';

@customElement('words-manager')
export class WordsManager extends LitElement {
  @state() view: ViewType = 'words';
  @state() query: string = '';
  @state() result: SearchItem[] = []

  private _hideInformationsOnSearchOption = true
  @state() showShowAllInfoButton = this._hideInformationsOnSearchOption

  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textfield') textfield!: TextField;
  @queryAll('concealable-span') concealableSpans!: ConcealableSpan[];
  @queryAll('concealable-span[concealed]') concealedSpans!: ConcealableSpan[];

  static styles = wordsManagerStyles;

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

  render () {
    // const hi = this._hideInformationsOnSearch;

    return html`
    <mwc-dialog>
      <mwc-tab-bar>
        <mwc-tab label=words></mwc-tab>
        <mwc-tab label=kanji></mwc-tab>
      </mwc-tab-bar>
      <mwc-textfield value="${this.query}"
        @keypress=${e=>{console.log(e); if (e.key === 'Enter') {this.search(this.textfield.value)}}}></mwc-textfield>
      <div id=results>
        ${this.result.map(i=>{
          return html`
          <div class=item>
            <div style="display:flex;justify-content:space-between;margin:12px 0 5px 0;">
              <mwc-icon-button icon=volume_up style="--mdc-icon-button-size: 24px;margin-right:5px;"
                @click=${e=>this.onSpeakerClick(e)}></mwc-icon-button>
              <span class="word"
                @click=${()=>naver(i.word)}>${i.word}</span>
              ${i.hiragana ? html`
              <concealable-span class=hiragana>${i.hiragana}</concealable-span>` : nothing}
              <div style="flex:1"></div>
              ${i.frequency ? html`
              <span class=lemma>${i.frequency}</span>` : nothing}
              <span class=dictionary>${i.dictionary}</span>
            </div>
            <concealable-span class=english>${i.english}</concealable-span>
          </div>
          `
        })}
      </div>
      ${this.showShowAllInfoButton ? html`
      <mwc-button unelevated slot="secondaryAction" style="--mdc-theme-primary:grey"
        @click=${()=>{[...this.concealedSpans].forEach(e=>e.concealed = false);this.requestUpdate()}}>
        <mwc-icon>remove_red_eye</mwc-icon>
      </mwc-button>
      ` : nothing}
      <mwc-button outlined slot="secondaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  async updated () {
    await Promise.all([...this.concealableSpans].map(e=>e.updateComplete))
    this.showShowAllInfoButton = this.concealedSpans.length > 0
  }

  onSpeakerClick(e) {
    playJapaneseAudio(e.target.nextElementSibling.innerText.trim())
  }

  search (query: string) {
    if (query === this.query) {
      return
    }
    this.query = query
    let searchResult: SearchItem[] = []
    jlpts.forEach((entries, n) => {
      const result: SearchItem[] = jlpts[n]
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
    })
    console.log(searchResult)
    this.concealableSpans.forEach(e=>e.concealed=true)
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

  open(query?: string) {
    if (query) {
      this.search(query)
    }
    this.dialog.show()
  }
}