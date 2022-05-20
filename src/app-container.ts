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
import { playJapaneseAudio } from './util.js';
import { CollectionsManager } from './collections-manager.js';
import { NotesDialog } from './notes-dialog.js';
import { RowHistory } from './row-history.js';

@customElement('app-container')
export class AppContainer extends LitElement {

  @state() domain: Domain = 'kanji'

  /** mode */
  @property({reflect:true}) public mode: Mode = 'discovery';
  /** data */
  private data: Row[] = []
  /** selected kanji */
  @state() row!: Row|null;
  /** collections */
  // public collections: Collection[];

  @state() candidatesListSize = 0;

  // enableAudioHint = true;
  playIncomeAudio = true;
  private hintSearch: SearchItem[] = []

  private validatedKanjis: string[] = []

  public collectionsManager: CollectionsManager = new CollectionsManager(this);
  public optionsManager: OptionsManager = new OptionsManager(this);
  public kanjiFrame: KanjiFrame = new KanjiFrame(this)
  public rowHistory: RowHistory = new RowHistory(this)

  /**
   * Queries
   */
  // @query('kanji-frame') kanjiFrame!: KanjiFrame;
  @query('mwc-textfield') textfield!: TextField;
  @query('#submit-button') submitButton!: Button;
  @query('notes-dialog') notesDialog!: NotesDialog;
  // @query('options-manager') optionsManager!: OptionsManager;


  constructor () {
    super()

    // Mode of the interface (based on the url)
    if (this.collectionsManager.URLCollectionName) {
      this.mode = 'practice'
    }

    if (this.mode == 'practice') {
      // @TODO: Load the correct domain (the domain should also be in the URL)

    }
    else {
      const domain = localStorage.getItem('kanji-practice:domain')
      if (domain) {
        this.domain = domain as Domain
      }
      else {
        this.domain = 'kanji' // default
      }
    }

    // Load the validated kanjis
    // this.validatedKanjis = (localStorage.getItem('kanji-practice:validated'))
    //   ? JSON.parse(localStorage.getItem('kanji-practice:validated')!.toString())
    //   : []
    this.loadValidated()

    // Initialize the data
    // this.initializeData()

    // Pick a Kanji
    // this.row = this.pickNewRow()
  }

  static styles = [mainStyles, sharedStyles];


  /**
   * RENDER
   */
  render () {
    this.kanjiFrame.row = this.row

    return html`
    <mwc-tab-bar style="width:100%"
        @MDCTabBar:activated=${e=>{this.onMDCTabBarActivated(e)}}
        activeIndex=${domains.indexOf(this.domain)}>
      <mwc-tab label=kanji></mwc-tab>
      <mwc-tab label=words></mwc-tab>
    </mwc-tab-bar>

    <header>
      <div style="display:flex;align-items:center">
        <mwc-icon style="margin-right:8px">${this.mode === 'discovery' ? 'remove_red_eye' : 'repeat'}</mwc-icon>
        <span>${this.mode === 'discovery' ? 'discovery' : window.collectionsManager.URLCollectionName}</span>
      </div>
      <div style="font-size: 0.8em;color: #bdbdbd;">kanji left: ${this.elementsLeft.length}</div>
      <mwc-icon-button icon=inventory
        @click=${()=>{this.collectionsManager.show()}}></mwc-icon-button>
      <mwc-icon-button icon=search
        @click=${()=>{window.searchManager.show()}}></mwc-icon-button>
      <mwc-icon-button icon=text_snippet
        @click=${()=>{this.notesDialog.show()}}></mwc-icon-button>
      <mwc-icon-button icon=history
        @click=${()=>this.rowHistory.show()}></mwc-icon-button>
      <mwc-icon-button icon=settings
        @click=${()=>this.optionsManager.show()}></mwc-icon-button>
    </header>

    ${this.kanjiFrame}
    <!-- <kanji-frame .app=${this} .row=${this.row} style="width:-webkit-fill-available"></kanji-frame> -->

    <!-- <mwc-button unelevated icon="casino"
      style="margin:12px 0"
      @click=${() => this.onCasinoButtonClick()}>pick new Kanji</mwc-button> -->

    <div style="width:100%;display:flex;align-items: center;justify-content:space-between">
      <!-- TEXTFIELD -->
      <div style="display:inline-block;position:relative;margin-top:18px;max-width:158px">
        <mwc-textfield label="answer"
          @keypress=${(e) => {this.onTextFieldPress(e)}  }
          helper="input and press enter"
          helperPersistent
          iconTrailing="remove_red_eye">
        </mwc-textfield>
        <mwc-icon-button icon=${this.kanjiFrame?.revealed ? 'skip_next' : 'remove_red_eye'}
          id=submit-button
          style="position:absolute;bottom:23px;right:4px"
          @click=${()=>this.validateAnswer()}></mwc-icon-button>

        <!-- wrong answer search button -->
        ${this.kanjiFrame && this.kanjiFrame.revealed && this.textfield.value.trim() !== '' && this.textfield.value.trim() !== this.row![1] ? html`
        <mwc-icon-button
          style="position:absolute;right:-55px;top:7px;background-color:#0000000a;border-radius:50%"
          @click=${() => { window.searchManager.show(this.textfield.value, 'kanji')} }>${this.textfield.value}</mwc-icon-button>
        ` :nothing}

      </div>

      ${this.domain=='kanji' && this.hintSearch[0] ? html`
        <app-button
          outlined
          height=46
          @click=${()=>{
            if (!this.revealed) {
              this.playAudioHint()
              this.textfield.focus()
              return
            }
            else {
              window.searchManager.show(this.hintSearch[0].word, 'words')
            }
          }}
        >${this.revealed ? this.hintSearch[0].word : '?'}</app-button>
      ` : nothing}

      ${this.domain=='words' ? html`
      <mwc-icon-button icon=volume_up
        @click=${()=>{this.playAudioHint();this.textfield.focus();}}></mwc-icon-button>
      ` : nothing}
    </div>

    ${this.row ? html`
    <candidates-row size=${this.candidatesListSize} answer=${this.row[1]}
        @candidate-click=${e=>{
          if (!this.kanjiFrame.revealed) {
            this.textfield.value = e.detail.candidate;
            this.submitButton.click()
          }
          else {
            window.searchManager.show(e.detail.candidate, 'kanji')
          }
        }}
    ></candidates-row>
    ` : nothing}

    <!-- <div style="height:100px;margin:50px 0;padding:50px 0;"></div> -->

    <div style="width:100%;text-align: center" ?hide=${!this.kanjiFrame?.revealed}>
      <mwc-button raised icon="arrow_forward"
          @click=${()=>{this.validateAnswer()}}>next</mwc-button>
    </div>

    ${this.collectionsManager}
    ${this.optionsManager}
    ${this.rowHistory}


    <notes-dialog></notes-dialog>
    `
  }

  onMDCTabBarActivated(e: CustomEvent) {
    const domain = domains[e.detail.index]
    this.domain = domain

    // initialize the new data
    this.initializeData()

    this.reset()

    // save the domain
    this.saveDomain()
  }

  initializeData () {
    switch (this.mode) {
      case 'discovery':
        // get full data
        this.data = this.domain=='kanji' ? Kanjis.slice(0) : Words.slice(0);
        // prepare the already validated elements
        const validated = this.validatedKanjis.filter(i=>i[0]==this.domain[0]).map(i=>parseInt(i.slice(1)))
        // get only the elements that are not in the validated list
        this.data = this.data.filter(e=>{
          return !validated.includes(e[0])
        })
        break
      case 'practice':
        // console.log(this.collection?.kanjis.map(k1 => (_data as Kanji[]).find(k2 => k2[1] === k1)))
        this.data = window.collectionsManager.collection!.kanjis.map(k1 => (_kanjis as Row[]).find(k2 => k2[1] === k1)!)
        break
    }
  }

  /**
   * Just return a new element (Row)
   */
  pickNewRow (): Row|null {
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

    // in "words" domain context we have to wait that the element is returned to the callee
    // so we can play its content
    setTimeout(() => {
      if (this.optionsManager.enableAudioHint) { this.playAudioHint() }
    }, 200)

    return element
  }

  changeDomain(domain: Domain) {
    this.domain = domain
    this.reset()
  }

  async playAudioHint() {
    // if (this.optionsManager.enableAudioHint) {
      if (this.domain=='kanji' && !this.hintSearch[0]) {
        return
      }

      const word = (this.domain == 'kanji')
        ? this.hintSearch[0].hiragana || this.hintSearch[0].word
        : this.row![4] || this.row![1];

      try {
        await playJapaneseAudio(word)
      }
      catch (e) {
        // rollback to the synthetic voice
        await speakJapanese(word)
      }
    // }
  }

  /**
   * Returns the Kanjis overall list jlpt-filtered
   */
  get elementsLeft () {
    const activeJlpts = Object.entries(this.optionsManager.options.jlpts)
      .filter(([j, b]) => b)
      .map(([j, b]) => j)

    return this.data.filter(kanji => activeJlpts.includes(`jlpt${kanji[2]}`))
  }

  getRemainingOverTotal (jlpt: number) {
    const set = (this.domain=='kanji') ? Kanjis : Words;
    const total = set.filter(e=>e[2]==jlpt).map(e=>e[0])
    // total - (how much of the validated are in the total ?)
    const validated = this.validatedKanjis.filter(e=>e[0]==this.domain[0] && total.includes(parseInt(e.slice(1))))
    return `${total.length - validated.length}/${total.length}`
  }

  get revealed () {
    return this.kanjiFrame?.revealed;
  }

  refillJlpt (jlpt: number) {
    const set = (this.domain=='kanji') ? Kanjis : Words;
    const total = set.filter(k=>k[2]==jlpt).map(k=>k[0])
    // remove jlpt kanjis from the validated list
    this.validatedKanjis = this.validatedKanjis.filter(e=>!(e[0]==this.domain[0] && total.includes(parseInt(e.slice(1)))))
  }

  protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    await this.textfield.updateComplete
    this.textfield.shadowRoot!.querySelector('i')!.style.color = 'transparent'

    // await this.optionsManager.updateComplete
  }

  /**
   * The user clicked the casino button.
   * Pick a new Row element and reset various interface parts.
   */
  onCasinoButtonClick() {
    this.kanjiFrame.conceal()
    // this.kanjiFrame.success = false
    this.textfield.value =''
    if (this.candidatesListSize == 0)
      this.textfield.focus()
    this.row = this.pickNewRow()
  }
  public reset = this.onCasinoButtonClick


  onTextFieldPress (e) {
    if (e.key === 'Enter') {
      // Compare the answer
      this.submitButton.click()
    }
  }


  /**
   * Validate the answer after the user submit the textfield
   */
  validateAnswer () {
    // @TODO : the user can submit some commands (e.g. image feature)
    if (!this.kanjiFrame.revealed) {
      this.kanjiFrame.reveal()
      /* -- SUCCESS -- */
      if (this.textfield.value === this.row![1]) {
        this.kanjiFrame.success = true
        if (this.playIncomeAudio) { this.playSuccessSound() }
        // window.toast('CORRECT ! :)')
        this.rowHistory.addToHistory(this.domain[0] as 'k'|'w', this.row![0], true)
        this.data.splice(this.data.indexOf(this.row!), 1)
        this.requestUpdate()
        this.addToValidatedList(this.domain, this.row![0])
        // this.validatedKanjis
        return
      }
      /* -- FAILURE -- */
      else {
        if (this.playIncomeAudio) { this.playFailureSound() }
        this.rowHistory.addToHistory(this.domain[0] as 'k'|'w', this.row![0], false)
        this.requestUpdate()
        // window.toast(':(')
      }
      if (this.optionsManager.enableAudioHint) { this.playAudioHint() }
    } else {
      this.onCasinoButtonClick()
    }
  }
  // alias
  submit () { this.validateAnswer() }

  private _successAudio = new Audio('./audio/success.mp3')
  private _failureAudio = new Audio('./audio/wrong.mp3')
  playSuccessSound() {
    // const _successAudio = new Audio('./audio/success.mp3')
    this._successAudio.play()
  }
  playFailureSound() {
    this._failureAudio.play()
  }

  addToValidatedList (domain: Domain, rowId: number) {
    this.validatedKanjis.push(`${domain[0]}${rowId}`)
    this.validatedKanjis = [...new Set(this.validatedKanjis)]
    this.saveValidated()
  }

  loadValidated () {
    const value = localStorage.getItem('kanji-practice:validated')
    if (value) {
      this.validatedKanjis = JSON.parse(value)
      // convert the characters to their string value on old versions
      if (this.validatedKanjis[0] && this.validatedKanjis[0][0] !== 'k' && this.validatedKanjis[0][0] !== 'w') {
        this.validatedKanjis = []
      }
    }
  }
  saveValidated () {
    localStorage.setItem('kanji-practice:validated', JSON.stringify(this.validatedKanjis))
  }
  saveDomain() {
    localStorage.setItem('kanji-practice:domain', this.domain)
  }
}