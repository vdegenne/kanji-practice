import { Dialog } from '@material/mwc-dialog';
import {css, html, LitElement, PropertyValues} from 'lit';
import { customElement, query } from 'lit/decorators.js';
import {AppContainer} from "./main";
import '@material/mwc-slider'
import {Slider} from '@material/mwc-slider'

export type Jlpts = {
  jlpt1: boolean;
  jlpt2: boolean;
  jlpt3: boolean;
  jlpt4: boolean;
  jlpt5: boolean;
}

@customElement('options-manager')
export class OptionsManager extends LitElement {
  private app!: AppContainer;

  @query('mwc-dialog') dialog!: Dialog;

  public jlpts: Jlpts;

  constructor (app: AppContainer) {
    super()
    this.app = app
    this.jlpts = localStorage.getItem('kanji-practice:options')
      ? JSON.parse(localStorage.getItem('kanji-practice:options')!)
      : { /* default */
          jlpt1: false,
          jlpt2: false,
          jlpt3: false,
          jlpt4: true,
          jlpt5: false
        }
  }

  static styles = css`
  .jlpt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
    
    .jlpt-row > span {
      color: grey;
      margin: 0 48px;
    }
  `

  render () {
    return html`
    <mwc-dialog heading=Options
      @change=${()=>this.onOptionsChanged()}>

      <div class="jlpt-row">
        <mwc-formfield label="JLPT5">
          <mwc-checkbox ?checked=${this.jlpts.jlpt5}
            @change=${e=>this.jlpts.jlpt5 = e.target.checked}></mwc-checkbox>
        </mwc-formfield>
          <span>${this.app.getRemainingOverTotal(5)}</span>
        <mwc-icon-button icon="local_drink" title="refill"
          @click=${()=>{this.onRefillClick()}}></mwc-icon-button>
      </div>
      <div class="jlpt-row">
        <mwc-formfield label="JLPT4">
          <mwc-checkbox ?checked=${this.jlpts.jlpt4}
            @change=${e=>this.jlpts.jlpt4 = e.target.checked}></mwc-checkbox>
        </mwc-formfield>
          <span>${this.app.getRemainingOverTotal(4)}</span>
        <mwc-icon-button icon="local_drink" title="refill"
          @click=${()=>{}}></mwc-icon-button>
      </div>
      <div class="jlpt-row">
        <mwc-formfield label="JLPT3">
          <mwc-checkbox ?checked=${this.jlpts.jlpt3}
            @change=${e=>this.jlpts.jlpt3 = e.target.checked}></mwc-checkbox>
        </mwc-formfield>
          <span>${this.app.getRemainingOverTotal(3)}</span>
        <mwc-icon-button icon="local_drink"></mwc-icon-button>
      </div>
      <div class="jlpt-row">
        <mwc-formfield label="JLPT2">
          <mwc-checkbox ?checked=${this.jlpts.jlpt2}
            @change=${e=>this.jlpts.jlpt2 = e.target.checked}></mwc-checkbox>
        </mwc-formfield>
          <span>${this.app.getRemainingOverTotal(2)}</span>
        <mwc-icon-button icon="local_drink"></mwc-icon-button>
      </div>
      <div class="jlpt-row">
        <mwc-formfield label="JLPT1">
          <mwc-checkbox ?checked=${this.jlpts.jlpt1}
            @change=${e=>this.jlpts.jlpt1 = e.target.checked}></mwc-checkbox>
        </mwc-formfield>
          <span>${this.app.getRemainingOverTotal(1)}</span>
        <mwc-icon-button icon="local_drink"></mwc-icon-button>
      </div>
        
        <!-- Candidates List -->
        <p>Candidates List Size</p>
        <mwc-slider
                discrete
                withTickMarks
                min="0"
                max="20"
                step="1"
                @change=${e=>{this.app.candidatesListSize = e.detail.value}}
        ></mwc-slider>

      <mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    this.dialog.addEventListener('opened', ()=>{
      ;(this.shadowRoot!.querySelector('mwc-slider') as Slider).value = this.app.candidatesListSize
      ;(this.shadowRoot!.querySelector('mwc-slider') as Slider).layout()
    })
    super.firstUpdated(_changedProperties);
  }

  onOptionsChanged () {
    this.save()
    // window.app.kanji = window.app.pickNewKanji()
    // window.app.requestUpdate()
  }

  save () {
    localStorage.setItem('kanji-practice:options', JSON.stringify(this.jlpts))
  }

  open() {
    this.dialog.show()
  }

  onRefillClick () {
    // jlpt?

    // if app.mode = 'discovery' -> init the data
    // else -> just remove the jlpt kanjis from the validated list and save

    // should pick a new kanji if ran out of kanjis
  }
}