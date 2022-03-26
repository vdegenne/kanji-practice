import { LitElement, html, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
// import '@material/mwc-icon-button'
// import '@material/mwc-dialog'
import '@material/mwc-textfield'
// import '@material/mwc-checkbox'
import './kanji-frame'
import data from '../docs/data.json'
import { Kanji } from './types'
import { TextField } from '@material/mwc-textfield'
import { KanjiFrame } from './kanji-frame'

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

@customElement('app-container')
export class AppContainer extends LitElement {
  private _jlpt = 5;

  @state() kanji: Kanji = this.pickNewKanji()

  @query('kanji-frame') kanjiFrame!: KanjiFrame;
  @query('mwc-textfield') textfield!: TextField;

  static styles = css`
  :host {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  `

  render () {
    return html`
    <kanji-frame .kanji=${this.kanji}></kanji-frame>

    <mwc-button unelevated icon="casino"
      style="margin:12px 0"
      @click=${() => this.onCasinoButtonClick()}>pick new Kanji</mwc-button>

    <mwc-textfield label="answer"
      @keypress=${(e) => { this.onTextFieldPress(e)}  }
      helper="input and press enter to see the kanji"
      helperPersistent></mwc-textfield>
    `
  }

  onCasinoButtonClick() {
    this.kanjiFrame.close()
    this.textfield.value =''
    this.kanji = this.pickNewKanji()
  }

  onTextFieldPress (e) {
    if (e.key === 'Enter') {
      // Compare the answer
      this.kanjiFrame.show()
      if (this.textfield.value === this.kanji[1]) {
        window.toast('CORRECT ! :)')
        return
      }
      else {
        window.toast(':(')
      }
    }
  }

  pickNewKanji (): Kanji {
    const filter = data.filter(row => row[2] === this._jlpt) as Kanji[]
    return filter[Math.random() * filter.length|0] as Kanji
  }
}
