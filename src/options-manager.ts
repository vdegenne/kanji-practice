import { Dialog } from '@material/mwc-dialog';
import {css, html, LitElement, PropertyValueMap, PropertyValues} from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import {Slider} from '@material/mwc-slider'
import { AppContainer } from './app-container';
import { Jlpts, Options } from './types';
import { Checkbox } from '@material/mwc-checkbox';


@customElement('options-manager')
export class OptionsManager extends LitElement {
  private app!: AppContainer;

  @query('mwc-dialog') dialog!: Dialog;

  options!: Options;

  @state() darkMode = false
  // public jlpts!: Jlpts;
  @state() carouselFeature = false;

  constructor (appInstance: AppContainer) {
    super()
    this.app = appInstance
    // this.jlpts = localStorage.getItem('kanji-practice:options')
    //   ? JSON.parse(localStorage.getItem('kanji-practice:options')!)
    //   : { /* default */
    //       jlpt1: false,
    //       jlpt2: false,
    //       jlpt3: false,
    //       jlpt4: true,
    //       jlpt5: false
    //     }
    this.loadOptions()
  }

  static styles = css`
  .jlpt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

    .jlpt-row > span {
      color: grey;
      min-width: 160px;
      text-align: center;
      //margin: 0 48px;
    }
  `

  render () {
    return html`
    <mwc-dialog heading=Options
      @change=${()=>this.onOptionsChanged()}>

        <mwc-formfield label="black background" style="margin:24px 0">
          <mwc-switch
            ?selected=${this.darkMode}
            @click=${(e)=>{this.darkMode = e.target.selected}}></mwc-switch>
        </mwc-formfield>

        <p>Dictionaries</p>
        ${[5, 4, 3, 2, 1].map(n=>{
          return html`
          <div class="jlpt-row">
              <mwc-formfield label="JLPT${n}">
                  <mwc-checkbox ?checked=${this.options.jlpts[`jlpt${n}`]}
                                @change=${e=>this.options.jlpts[`jlpt${n}`] = e.target.checked}></mwc-checkbox>
              </mwc-formfield>
              <span>${this.app.getRemainingOverTotal(n)}</span>
              <mwc-icon-button icon="local_drink" title="refill"
                               @click=${()=>{
                                 this.app.refillJlpt(n)
                                 this.app.saveValidated()
                                   if (this.app.mode=='discovery') {
                                     this.app.initializeData()
                                     this.app.requestUpdate()
                                   }
                                 this.requestUpdate()
                               }}></mwc-icon-button>
          </div>
          `
        })}


        <!-- AUDIO OPTIONS -->
        <p>Hint</p>
        <mwc-formfield label="Play audio word hint">
            <mwc-checkbox ?checked=${this.options.enableAudioHint}></mwc-checkbox>
        </mwc-formfield>
        <br>
        <mwc-formfield label="Randomized word hint (kanji only)" style="margin-left:48px;">
            <mwc-checkbox ?checked=${this.options.enableAudioHint}></mwc-checkbox>
        </mwc-formfield>
        <br>
        <mwc-formfield label="Show textual hint" style="margin-left:48px;">
            <mwc-checkbox
              ?checked=${this.options.showTextualHint}
              @change=${()=>{this.forwardShowTextualHint()}}></mwc-checkbox>
        </mwc-formfield>

        <!-- Candidates List -->
        <p>Candidates List Size</p>
        <mwc-slider
                discrete
                withTickMarks
                min="0"
                max="20"
                step="1"
                value=${this.options.candidatesListSize}
                @change=${()=>{this.app.requestUpdate()}}
        ></mwc-slider>

        <p>On answer revealed</p>
        <mwc-formfield label="play income audio (failure/success)">
            <mwc-checkbox ?checked=${true}></mwc-checkbox>
        </mwc-formfield>
        <mwc-formfield label="show income background color (red/green)">
            <mwc-checkbox ?checked=${true}></mwc-checkbox>
        </mwc-formfield>


      <mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  get showTextualHint () {
    return (this.shadowRoot!.querySelector('mwc-formfield[label="Show textual hint"]')!.firstElementChild as Checkbox).checked
  }
  get enableAudioHint () {
    return (this.shadowRoot!.querySelector('mwc-formfield[label="Play audio word hint"]')!.firstElementChild as Checkbox).checked
  }
  get candidatesListSize () {
    return this.shadowRoot!.querySelector('mwc-slider')!.value
  }
  get blackBackground () {
    return this.shadowRoot!.querySelector('mwc-switch')!.selected
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('darkMode')) {
      this.updateBodyBackgroundColor()
    }
    if (_changedProperties.has('carouselFeature')) {
      if (this.carouselFeature) {
      }
    }
    // save the options
    this.saveOptions()
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    this.dialog.addEventListener('opened', ()=>{
      // ;(this.shadowRoot!.querySelector('mwc-slider') as Slider).value = this.app.candidatesListSize
      ;(this.shadowRoot!.querySelector('mwc-slider') as Slider).layout()

      // update the interface every time it opens
      this.requestUpdate()
    })
    super.firstUpdated(_changedProperties);
  }

  onOptionsChanged () {
    this.saveOptions()
    // window.app.kanji = window.app.pickNewKanji()
    // window.app.requestUpdate()
  }

  show() {
    this.dialog.show()
  }

  onRefillClick () {
    // jlpt?

    // if app.mode = 'discovery' -> init the data
    // else -> just remove the jlpt kanjis from the validated list and save

    // should pick a new kanji if ran out of kanjis
  }

  forwardShowTextualHint () {
    // this.app.kanjiFrame.showTextualHint = value
    this.options.showTextualHint = this.showTextualHint
    this.app.kanjiFrame.showText = this.showTextualHint
  }

  updateBodyBackgroundColor () {
    if (this.darkMode) {
      document.body.setAttribute('darkmode', '')
    }
    else {
      document.body.removeAttribute('darkmode')
    }
  }

  loadOptions () {
    let options: Options;
    if (localStorage.getItem('kanji-practice:options') !== null) {
      options = JSON.parse(localStorage.getItem('kanji-practice:options')!) as Options
      // ensure that the old version data structure is converted
      if ('jlpt1' in options) {
        options = {
          jlpts: <unknown>options as Jlpts,
          showTextualHint: true,
          enableAudioHint: true,
          candidatesListSize: 0,
          blackBackground: false,
          carouselFeature: false,
        }
      }
      if (!('candidatesListSize' in options)) {
        options.candidatesListSize = 3
      }
      if (!('blackBackground' in options)) {
        options.blackBackground = false
      }
      if (!('carouselFeature' in options)) {
        options.carouselFeature = false
      }
    }
    else {
      // default
      options = {
        jlpts: {
          jlpt5: true,
          jlpt4: false,
          jlpt3: false,
          jlpt2: false,
          jlpt1: false,
        },
        showTextualHint: true,
        enableAudioHint: true,
        candidatesListSize: 0,
        blackBackground: false,
        carouselFeature: false,
      }
    }

    this.options = options
    this.darkMode = this.options.blackBackground;
    this.carouselFeature = this.options.carouselFeature;
  }

  saveOptions () {
    const options: Options = {
      jlpts: this.options.jlpts,
      showTextualHint: this.showTextualHint,
      enableAudioHint: this.enableAudioHint,
      candidatesListSize: this.candidatesListSize,
      blackBackground: this.darkMode,
      carouselFeature: this.carouselFeature
    }
    localStorage.setItem('kanji-practice:options', JSON.stringify(options))
  }
}