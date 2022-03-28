import { LitElement, html, css, PropertyValueMap, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import './kanji-frame'
import _data from '../docs/data.json'
import { Kanji } from './types'
import { TextField } from '@material/mwc-textfield'
import { KanjiFrame } from './kanji-frame'
import { Button } from '@material/mwc-button'
import { mdbg } from './util'
import './options-manager'
import { OptionsManager } from './options-manager'

declare global {
  interface Window {
    app: AppContainer;
    optionsManager: OptionsManager;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

export let data: Kanji[];
function resetData () { data = _data as Kanji[] }
resetData()


@customElement('app-container')
export class AppContainer extends LitElement {
  private _jlpt = 4;

  @state() kanji: Kanji = this.pickNewKanji()

  @query('kanji-frame') kanjiFrame!: KanjiFrame;
  @query('mwc-textfield') textfield!: TextField;
  @query('#submit-button') submitButton!: Button;

  static styles = css`
  :host {
    height: 100vh;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    padding: 0 12px;
  }
  `

  render () {
    return html`
    <header style="display:flex;justify-content:space-between;align-items:center;width:101.5%;margin: 0 -12px">
      <div style="font-size: 0.8em;color: #bdbdbd;">kanji left: ${this.kanjisLeft.length}</div>
      <mwc-icon-button icon=settings
        @click=${_=>window.optionsManager.open()}></mwc-icon-button>
    </header>

    <kanji-frame .kanji=${this.kanji}></kanji-frame>

    <!-- <mwc-button unelevated icon="casino"
      style="margin:12px 0"
      @click=${() => this.onCasinoButtonClick()}>pick new Kanji</mwc-button> -->

    <div style="position:relative;margin-top:18px;">
      <mwc-textfield label="answer"
        @keypress=${(e) => { this.onTextFieldPress(e)}  }
        helper="input and press enter"
        helperPersistent
        iconTrailing="remove_red_eye">
      </mwc-textfield>
      <mwc-icon-button icon="remove_red_eye"
        id=submit-button
        style="position:absolute;bottom:23px;right:4px"
        @click=${()=>this.submitAnswer()}></mwc-icon-button>

      ${this.kanjiFrame && this.kanjiFrame.open && this.textfield.value.trim() !== '' && this.textfield.value.trim() !== this.kanji[1] ? html`
      <mwc-icon-button
        style="position:absolute;right:-55px;top:7px;background-color:#0000000a;border-radius:50%"
        @click=${() => { mdbg(this.textfield.value)} }>${this.textfield.value}</mwc-icon-button>
      ` :nothing}
    </div>
    `
  }

  get kanjisLeft () {
    return data.filter(row => Object.entries(window.optionsManager._jlpts).filter(([j,b])=>b).map(([j,b])=>j).includes(`jlpt${row[2]}`))
  }

  protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    await this.textfield.updateComplete
    this.textfield.shadowRoot!.querySelector('i')!.style.color = 'transparent'
  }

  onCasinoButtonClick() {
    this.kanjiFrame.close()
    this.textfield.value =''
    this.kanji = this.pickNewKanji()
  }

  onTextFieldPress (e) {
    if (e.key === 'Enter') {
      // Compare the answer
      this.submitButton.click()
    }
  }

  pickNewKanji (): Kanji {
    const kanjisLeft = this.kanjisLeft
    return kanjisLeft[~~(Math.random() * kanjisLeft.length)]
  }

  submitAnswer () {
    if (!this.kanjiFrame.open) {
      this.kanjiFrame.show()
      if (this.textfield.value === this.kanji[1]) {
        this.kanjiFrame.happy = true
        this.playSuccessSound()
        // window.toast('CORRECT ! :)')
        data.splice(data.indexOf(this.kanji), 1)
        return
      }
      else {
        this.playFailureSound()
        this.requestUpdate()
        // window.toast(':(')
      }
    } else {
      this.onCasinoButtonClick()
    }
  }

  private _successAudio = new Audio('./audio/success.mp3')
  private _failureAudio = new Audio('./audio/wrong.mp3')
  playSuccessSound() {
    const _successAudio = new Audio('./audio/success.mp3')
    _successAudio.play()
  }
  playFailureSound() { this._failureAudio.play() }
}
