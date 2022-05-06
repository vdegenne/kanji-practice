import { TextField } from '@material/mwc-textfield';
import { Button } from '@material/mwc-button';
import { html, LitElement, nothing, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Domain, domains, Mode, Row } from './types.js';
import { speakJapanese } from './speech.js';
import { mainStyles } from './styles/mainStyles.js';
import { Kanjis, Words } from './data.js';
import { SearchItem } from './search-manager.js';
import { OptionsManager } from './options-manager.js';
import { KanjiFrame } from './kanji-frame.js';
import { sharedStyles } from './styles/sharedStyles.js';
import { changeButtonHeight, playJapaneseAudio } from './util.js';

@customElement('app-container')
export class AppContainer extends LitElement {

  @state() domain: Domain = 'Kanji'

  /** mode */
  @property({reflect:true}) public mode: Mode = 'discovery';
  /** data */
  private data: Row[] = []
  /** selected kanji */
  @state() element: Row|null;
  /** collections */
  // public collections: Collection[];

  @state() candidatesListSize = 0;

  enableAudioHint = true;
  playIncomeAudio = true;
  private hintSearch: SearchItem[] = []

  private validatedKanjis: string[] = []

  private optionsManager: OptionsManager = new OptionsManager(this);


  /**
   * Returns the Kanjis overall list jlpt-filtered
   */
  get elementsLeft () {
    const activeJlpts = Object.entries(this.optionsManager.jlpts)
      .filter(([j, b]) => b)
      .map(([j, b]) => j)

    return this.data.filter(kanji => activeJlpts.includes(`jlpt${kanji[2]}`))
  }

  getRemainingOverTotal (jlpt: number) {
    const set = (this.domain=='Kanji') ? Kanjis : Words;
    const total = set.filter(k=>k[2]==jlpt).map(k=>k[1])
    // total - (how much of the validated are in the total ?)
    const validated = this.validatedKanjis.filter(k=>total.includes(k))
    return `${total.length - validated.length}/${total.length}`
  }

  get revealed () {
    return this.kanjiFrame?.revealed;
  }


  @query('kanji-frame') kanjiFrame!: KanjiFrame;
  @query('mwc-textfield') textfield!: TextField;
  @query('#submit-button') submitButton!: Button;
  // @query('options-manager') optionsManager!: OptionsManager;


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


    // Load the validated kanjis
    this.validatedKanjis = (localStorage.getItem('kanji-practice:validated'))
      ? JSON.parse(localStorage.getItem('kanji-practice:validated')!.toString())
      : []

    // Initialize the data
    this.initializeData()

    // Pick a Kanji
    this.element = this.pickNewElement()
  }

  static styles = [mainStyles, sharedStyles];

  render () {
    return html`
    <mwc-tab-bar style="width:100%"
        @MDCTabBar:activated=${e=>{this.onMDCTabBarActivated(e)}}>
      <mwc-tab label=kanji></mwc-tab>
      <mwc-tab label=words></mwc-tab>
    </mwc-tab-bar>

    <header>
      <div style="display:flex;align-items:center">
        <mwc-icon style="margin-right:8px">${this.mode === 'discovery' ? 'remove_red_eye' : 'repeat'}</mwc-icon>
        <span>${this.mode === 'discovery' ? 'discovery' : window.collectionsManager.selectedCollection}</span>
      </div>
      <div style="font-size: 0.8em;color: #bdbdbd;">kanji left: ${this.elementsLeft.length}</div>
      <mwc-icon-button icon=inventory
        @click=${()=>{window.collectionsManager.show()}}></mwc-icon-button>
      <mwc-icon-button icon=search
        @click=${()=>{window.searchManager.show()}}></mwc-icon-button>
      <mwc-icon-button icon=settings
        @click=${()=>this.optionsManager.open()}></mwc-icon-button>
    </header>

    <kanji-frame .kanji=${this.element} style="width:-webkit-fill-available"></kanji-frame>

    <!-- <mwc-button unelevated icon="casino"
      style="margin:12px 0"
      @click=${() => this.onCasinoButtonClick()}>pick new Kanji</mwc-button> -->

    <div style="width:100%;display:flex;align-items: center;justify-content:space-between">
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
          @click=${()=>this.submit()}></mwc-icon-button>

        <!-- wrong answer search button -->
        ${this.kanjiFrame && this.kanjiFrame.revealed && this.textfield.value.trim() !== '' && this.textfield.value.trim() !== this.element![1] ? html`
        <mwc-icon-button
          style="position:absolute;right:-55px;top:7px;background-color:#0000000a;border-radius:50%"
          @click=${() => { window.searchManager.show(this.textfield.value, 'kanji')} }>${this.textfield.value}</mwc-icon-button>
        ` :nothing}

      </div>

      ${this.domain=='Kanji' && this.hintSearch[0] ? html`
        <mwc-button
          outlined
          style="--mdc-typography-button-font-size:1.5em;--mdc-typography-button-font-family: 'Sawarabi Mincho';--mdc-button-horizontal-padding:18px"
          height=46
          @click=${()=>{
            if (!this.revealed) {
              this.playAudioHint()
              return
            }
            else {
              window.searchManager.show(this.hintSearch[0].word, 'words')
            }
          }}
        >${this.revealed ? this.hintSearch[0].word : '?'}</mwc-button>
      ` : nothing}

      ${this.domain=='Words' ? html`
      <mwc-icon-button icon=volume_up
        @click=${()=>{this.playAudioHint()}}></mwc-icon-button>
      ` : nothing}
    </div>

    <candidates-row size=${this.candidatesListSize} answer=${this.element![1]}
        @candidate-click=${e=>{
          if (!this.kanjiFrame.revealed) {
            this.textfield.value = e.detail.candidate;
            this.submitButton.click()
          }
          else {
            window.searchManager.show(e.detail.candidate, 'kanji')
          }
        }}></candidates-row>

    <!-- <div style="height:100px;margin:50px 0;padding:50px 0;"></div> -->

    <div style="width:100%;text-align: center" ?hide=${!this.kanjiFrame?.revealed}>
      <mwc-button raised icon="arrow_forward"
          @click=${()=>{this.submit()}}>next</mwc-button>
    </div>

        ${this.optionsManager}
    `
  }

  onMDCTabBarActivated(e: CustomEvent) {
    const domain = domains[e.detail.index]
    this.domain = domain

    // initialize the new data
    this.initializeData()
  }


  initializeData () {
    switch (this.mode) {
      case 'discovery':
        // this.data = _kanjis as Kanji[];
        this.data = this.domain=='Kanji' ? Kanjis.slice(0) : Words.slice(0);
        // Remove the validated kanji from the list
        this.data = this.data.filter(k=>!this.validatedKanjis.includes(k[1]))
        break
      case 'practice':
        // console.log(this.collection?.kanjis.map(k1 => (_data as Kanji[]).find(k2 => k2[1] === k1)))
        this.data = window.collectionsManager.collection!.kanjis.map(k1 => (_kanjis as Row[]).find(k2 => k2[1] === k1)!)
        break
    }
  }

  pickNewElement (): Row|null {
    const elementsLeft = this.elementsLeft

    if (elementsLeft.length === 0) {
      window.toast('You\'ve run out of Kanji 😲 Try to refill from the options', -1)
      // @TODO what to do?
      return null
    }
    else {
      window.toast('', 0)
    }
    const element = elementsLeft[~~(Math.random() * elementsLeft.length)]

    // Hint
    this.hintSearch = window.searchManager.searchData(element[1], ['words'])
      .filter(i=>{
        return i.dictionary != 'not found'
      })
      .sort(function (i1, i2) {
        return (i2.frequency || -9999) - (i1.frequency || -9999)
      })

    this.playAudioHint()

    return element
  }

  async playAudioHint() {
    if (this.enableAudioHint) {
      if (this.domain=='Kanji' && !this.hintSearch[0]) {
        return
      }

      const word = (this.domain == 'Kanji')
        ? this.hintSearch[0].hiragana || this.hintSearch[0].word
        : this.element![4] || this.element![1];
console.log(`word : `, word)

      try {
        await playJapaneseAudio(word)
      }
      catch (e) {
        // rollback to the synthetic voice
        await speakJapanese(word)
      }
    }

  }

  refillJlpt (jlpt: number) {
    const kanjis = (_kanjis as Row[]).filter(k=>k[2]==jlpt).map(k=>k[1])
    // remove jlpt kanjis from the validated list
    this.validatedKanjis = this.validatedKanjis.filter(k=> !kanjis.includes(k))

  }


  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.shadowRoot!.querySelectorAll<Button>('mwc-button').forEach(button=>{
      if (button.getAttribute('height') !== null) {
        changeButtonHeight(button, parseInt(button.getAttribute('height')!))
      }
    })
  }

  protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    await this.textfield.updateComplete
    this.textfield.shadowRoot!.querySelector('i')!.style.color = 'transparent'

    // await this.optionsManager.updateComplete
  }

  onCasinoButtonClick() {
    this.kanjiFrame.conceal()
    // this.kanjiFrame.success = false
    this.textfield.value =''
    if (this.candidatesListSize == 0)
      this.textfield.focus()
    this.element = this.pickNewElement()
  }

  onTextFieldPress (e) {
    if (e.key === 'Enter') {
      // Compare the answer
      this.submitButton.click()
    }
  }


  submit () {
    if (!this.kanjiFrame.revealed) {
      this.kanjiFrame.reveal()
      /* -- SUCCESS -- */
      if (this.textfield.value === this.element![1]) {
        this.kanjiFrame.success = true
        this.playSuccessSound()
        // window.toast('CORRECT ! :)')
        this.data.splice(this.data.indexOf(this.element!), 1)
        this.requestUpdate()
        this.addToValidatedList(this.element![1])
        // this.validatedKanjis
        return
      }
      /* -- FAILURE -- */
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
    // _successAudio.play()
  }
  playFailureSound() {
    // this._failureAudio.play()
  }

  addToValidatedList (character) {
    this.validatedKanjis.push(character)
    this.validatedKanjis = [...new Set(this.validatedKanjis)]
    this.saveValidated()
  }

  saveValidated () {
    localStorage.setItem('kanji-practice:validated', JSON.stringify(this.validatedKanjis))
  }
}