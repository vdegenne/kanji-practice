import { html, LitElement, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { Dialog } from '@material/mwc-dialog';
import { JlptWordEntry } from './types';

import lemmas from '../docs/data/lemmas.json'
import { TextField } from '@material/mwc-textfield';
import { wordsManagerStyles } from './styles/wordsManagerStyles';

import '@material/mwc-tab-bar'

import jlpt5 from'../docs/data/jlpt5-words.json'
import jlpt4 from '../docs/data/jlpt4-words.json'
import jlpt3 from '../docs/data/jlpt3-words.json'
import _kanjis from '../docs/data/kanjis.json'
import { naver } from './util';
const jlpts: JlptWordEntry[][] = [
  jlpt5 as JlptWordEntry[],
  // [],

  jlpt4 as JlptWordEntry[],
  // [],

  jlpt3 as JlptWordEntry[],
  // [],

  // jlpt2 as JlptWordEntry[],
  [],

  // jlpt1 as JlptWordEntry[],
  [],
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

  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textfield') textfield!: TextField;

  static styles = wordsManagerStyles;

  render () {
    return html`
    <mwc-dialog>
      <mwc-tab-bar>
        <mwc-tab label=words></mwc-tab>
        <mwc-tab label=kanji></mwc-tab>
      </mwc-tab-bar>
      <mwc-textfield value="${this.query}"></mwc-textfield>
      <div id=results>
        ${this.result.map(i=>{
          return html`
          <div class=item title="lemma: ${i.frequency || 'not found'}">
            <div style="display:flex;justify-content:space-between;margin:12px 0 5px 0;">
              <span class=word
                @click=${()=>naver(i.word)}>${i.word}</span>
              ${i.hiragana ? html`<span class=hiragana>${i.hiragana}</span>` : nothing}
              <span class=dictionary>${i.dictionary}</span>
            </div>
            <span class=english>${i.english}</span>
          </div>
          `
        })}
      </div>
      <mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  search () {
    let searchResult: SearchItem[] = []
    jlpts.forEach((entries, n) => {
      const result: SearchItem[] = jlpts[n].filter(e=>e[0].includes(this.query!)).map(r=>{
        return this.attachFrequencyValue({
          type: 'words',
          dictionary: `jlpt n${n+1}`,
          word: r[0],
          english: r[2],
          hiragana: r[1] || undefined
        })
      })
      searchResult.push(...result)
    })
    console.log(searchResult)
    console.log(_kanjis[0])
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
    if (query && query !== this.query) {
      this.query = query;
      this.search()
    }
    this.dialog.show()
  }
}