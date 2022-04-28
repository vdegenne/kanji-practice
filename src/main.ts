import { LitElement, html, css, PropertyValueMap, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import './kanji-frame'
import _kanjis from '../docs/data/kanjis.json'
import { Collection, Kanji, Mode } from './types'
import { TextField } from '@material/mwc-textfield'
import { KanjiFrame } from './kanji-frame'
import { Button } from '@material/mwc-button'
import { mdbg, playJapaneseAudio } from './util'
import './options-manager'
import { OptionsManager } from './options-manager'
import './collections-selector'
import { CollectionsSelector } from './collections-selector'
import { mainStyles } from './styles/mainStyles'
import './collections-manager'
import { CollectionsManager } from './collections-manager'
import './search-manager'
import { firstWordFoundFromCharacter, SearchManager } from './search-manager'

declare global {
  interface Window {
    app: AppContainer;
    optionsManager: OptionsManager;
    collectionsSelector: CollectionsSelector;
    collectionsManager: CollectionsManager;
    searchManager: SearchManager;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

export let data: Kanji[];
function resetData () { data = (_kanjis as Kanji[]).slice(0) }
resetData()


@customElement('app-container')
export class AppContainer extends LitElement {

  /** mode */
  @property({reflect:true}) private mode: Mode = 'discovery';
  /** data */
  private data: Kanji[] = []
  /** selected kanji */
  @state() kanji: Kanji|null;
  /** collections */
  // public collections: Collection[];

  /** Getters */
  get kanjisLeft () {
    return this.data.filter(row => Object.entries(window.optionsManager.jlpts).filter(([j,b])=>b).map(([j,b])=>j).includes(`jlpt${row[2]}`))
  }


  @query('kanji-frame') kanjiFrame!: KanjiFrame;
  @query('mwc-textfield') textfield!: TextField;
  @query('#submit-button') submitButton!: Button;

  static styles = mainStyles;

  constructor () {
    super()

    // Mode of the interface (based on the url)
    if (window.collectionsManager.selectedCollection) {
      this.mode = 'practice'
    }

    // Load the collections
    // this.collections = localStorage.getItem('kanji-practice:collections')
    //   ? JSON.parse(localStorage.getItem('kanji-practice:collections')!)
    //   : /* default */ [{name: 'collection 1', kanjis: []}];


    // Initialize the data
    this.initializeData()

    // Then pick a new kanji
    this.kanji = this.pickNewKanji()
  }

  render () {
    return html`
    <header>
      <div style="display:flex;align-items:center">
        <mwc-icon style="margin-right:8px">${this.mode === 'discovery' ? 'remove_red_eye' : 'repeat'}</mwc-icon>
        <span>${this.mode === 'discovery' ? 'discovery' : window.collectionsManager.selectedCollection}</span>
      </div>
      <div style="font-size: 0.8em;color: #bdbdbd;">kanji left: ${this.kanjisLeft.length}</div>
      <mwc-icon-button icon=inventory
        @click=${()=>{window.collectionsManager.show()}}></mwc-icon-button>
      <mwc-icon-button icon=search
        @click=${()=>{window.searchManager.open()}}></mwc-icon-button>
      <mwc-icon-button icon=settings
        @click=${()=>window.optionsManager.open()}></mwc-icon-button>
    </header>

    <kanji-frame .kanji=${this.kanji} style="width:-webkit-fill-available"></kanji-frame>

    <!-- <mwc-button unelevated icon="casino"
      style="margin:12px 0"
      @click=${() => this.onCasinoButtonClick()}>pick new Kanji</mwc-button> -->

    <!-- TEXTFIELD -->
    <div style="display:inline-block;position:relative;margin-top:18px;">
      <mwc-textfield label="answer"
        @keypress=${(e) => {this.onTextFieldPress(e)}  }
        helper="input and press enter"
        helperPersistent
        iconTrailing="remove_red_eye">
      </mwc-textfield>
      <mwc-icon-button icon=${this.kanjiFrame?.revealed ? 'skip_next' : 'remove_red_eye'}
        id=submit-button
        style="position:absolute;bottom:23px;right:4px"
        @click=${()=>this.submitAnswer()}></mwc-icon-button>

      <!-- wrong answer search button -->
      ${this.kanjiFrame && this.kanjiFrame.revealed && this.textfield.value.trim() !== '' && this.textfield.value.trim() !== this.kanji![1] ? html`
      <mwc-icon-button
        style="position:absolute;right:-55px;top:7px;background-color:#0000000a;border-radius:50%"
        @click=${() => { window.searchManager.open(this.textfield.value, 'kanji')} }>${this.textfield.value}</mwc-icon-button>
      ` :nothing}
    </div>

    <!-- <div style="height:100px;margin:50px 0;padding:50px 0;"></div> -->
    `
  }

  initializeData () {
    switch (this.mode) {
      case 'discovery':
        // this.data = _kanjis as Kanji[];
        this.data = data;
        break
      case 'practice':
        // console.log(this.collection?.kanjis.map(k1 => (_data as Kanji[]).find(k2 => k2[1] === k1)))
        this.data = window.collectionsManager.collection!.kanjis.map(k1 => (_kanjis as Kanji[]).find(k2 => k2[1] === k1)!)
        break
    }
  }

  pickNewKanji (): Kanji|null {
    const kanjisLeft = this.kanjisLeft
    if (kanjisLeft.length === 0) {
      window.toast('You\'ve run out of Kanji 😲 You should reload the app', -1)
      // @TODO what to do?
      return null
    }
    else {
      window.toast('', 0)
    }
    const kanji = kanjisLeft[~~(Math.random() * kanjisLeft.length)]
    const firstWordFound = firstWordFoundFromCharacter(kanji[1])
    if (firstWordFound) {
      playJapaneseAudio(firstWordFound[1] || firstWordFound[0])
    }
    return kanji
  }



  protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    await this.textfield.updateComplete
    this.textfield.shadowRoot!.querySelector('i')!.style.color = 'transparent'
  }

  onCasinoButtonClick() {
    this.kanjiFrame.conceal()
    // this.kanjiFrame.success = false
    this.textfield.value =''
    this.textfield.focus()
    this.kanji = this.pickNewKanji()
  }

  onTextFieldPress (e) {
    if (e.key === 'Enter') {
      // Compare the answer
      this.submitButton.click()
    }
  }


  submitAnswer () {
    if (!this.kanjiFrame.revealed) {
      this.kanjiFrame.reveal()
      if (this.textfield.value === this.kanji![1]) {
        this.kanjiFrame.success = true
        this.playSuccessSound()
        // window.toast('CORRECT ! :)')
        this.data.splice(this.data.indexOf(this.kanji!), 1)
        this.requestUpdate()
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