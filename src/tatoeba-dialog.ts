import { css, html, LitElement, nothing, PropertyValueMap } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { Dialog } from '@material/mwc-dialog';
import { parseSentence, SentenceMeta } from './data';
import { cancelSpeech, speakJapanese } from './speech';

@customElement('tatoeba-dialog')
export class TatoebaDialog extends LitElement {
  @state() fetching = false;
  private search: string = '';

  private result: {e: string, j: SentenceMeta}[] = []

  @query('mwc-dialog') dialog!: Dialog;

  static styles = css`
  .example {
    display: flex;
    flex-direction: column;
    margin: 40px 0;
    font-size: 1.5em;
    line-height: 39px;
  }
  .example .sentence {
    font-family: 'Noto Serif JP';
    margin-bottom: 6px;
  }
  .example .sentence > div {
    display: inline-block;
    position: relative;
  }
  .example .sentence .searchable {
    /* color: #3f51b5; */
    /* border-bottom: 2px solid #0000ff40; */
    cursor: pointer;
    /* margin: 0 3px; */
  }
  .bottomBorder {
    position: absolute;
    bottom: 0;
    left: 0; right: 0;
    border-bottom: 2px solid #00000040;
    margin: 0 5px;
  }
  `

  render() {
    return html`
    <mwc-dialog heading=Examples>
      ${this.fetching ? html`fetching...` : nothing}

      ${this.result.map(r=>{
        return html`
        <div class="example">
          <div class=sentence>
            ${r.j.map(word => {
              if (word.meta) {
                return html`<div class=searchable
                      @click=${()=>{window.searchManager.show(word.word, 'words')}}
                      title=${word.meta[4]}>
                        <span>${word.word}</span>
                        <div class="bottomBorder"></div>
                </div>`
              }
              return html`<div>${word.word}</div>`
            })}<mwc-icon-button icon=volume_up
              @click=${()=>{this.togglePlayExample(r.j.map(w=>w.word).join(''))}}></mwc-icon-button>
          </div>
          <concealable-span concealed>${r.e}</concealable-span>
        </div>
        `
      })}

      <mwc-button icon="search" slot=secondaryAction
        @click=${()=>{this.searchSelection()}}>search</mwc-button>
      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>
    `
  }

  private _playingPromise: Promise<void>|null = null;
  async togglePlayExample (sentence: string) {
    if (this._playingPromise) {
      cancelSpeech()
      // this._playingPromise = null
      return
    }
    else {
      this._playingPromise = speakJapanese(sentence)
      await this._playingPromise
      this._playingPromise = null
    }
  }

  searchSelection() {
    let selection: Selection|null|string = window.getSelection()
    if (selection) {
      selection = selection.toString()
      if (selection) {
        window.searchManager.show(selection)
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    // window.addEventListener('selectionchange', e=>{
    //   console.log(e)
    // })
  }

  async performSearch (search = this.search) {
    this.result = [];
    this.search = search;
    this.fetching = true;
    try {
      const res = await fetch(`https://assiets.vdegenne.com/japanese/tatoeba/${encodeURIComponent(search)}`)
      const data = await res.json()
      // const meta = parseSentence(data[0].j)
      this.result = data.map(item => ({
        j: parseSentence(item.j),
        e: item.e
      }))
    }
    catch (e) {
      window.toast('Something went wrong while fetching the search')
    }
    finally {
      this.fetching = false;
    }
  }

  async show (search: string) {
    if (search != this.search) {
      this.performSearch(search)
    }
    this.dialog.show()
  }
}


