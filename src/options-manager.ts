import { Dialog } from '@material/mwc-dialog';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

export type Jlpts = {
  jlpt1: boolean;
  jlpt2: boolean;
  jlpt3: boolean;
  jlpt4: boolean;
  jlpt5: boolean;
}

@customElement('options-manager')
export class OptionsManager extends LitElement {
  @query('mwc-dialog') dialog!: Dialog;

  public _jlpts: Jlpts = { // default
    jlpt1: false,
    jlpt2: false,
    jlpt3: false,
    jlpt4: true,
    jlpt5: false
  }

  render () {
    return html`
    <mwc-dialog heading=Options
      @change=${_=>window.app.requestUpdate()}>

      <mwc-formfield label=JLPT5>
        <mwc-checkbox ?checked=${this._jlpts.jlpt5}
          @change=${e=>this._jlpts.jlpt5 = e.target.checked}></mwc-checkbox>
      </mwc-formfield>
      <mwc-formfield label=JLPT4>
        <mwc-checkbox ?checked=${this._jlpts.jlpt4}
          @change=${e=>this._jlpts.jlpt4 = e.target.checked}></mwc-checkbox>
      </mwc-formfield>
      <mwc-formfield label=JLPT3>
        <mwc-checkbox ?checked=${this._jlpts.jlpt3}
          @change=${e=>this._jlpts.jlpt3 = e.target.checked}></mwc-checkbox>
      </mwc-formfield>
      <mwc-formfield label=JLPT2>
        <mwc-checkbox ?checked=${this._jlpts.jlpt2}
          @change=${e=>this._jlpts.jlpt2 = e.target.checked}></mwc-checkbox>
      </mwc-formfield>
      <mwc-formfield label=JLPT1>
        <mwc-checkbox ?checked=${this._jlpts.jlpt1}
          @change=${e=>this._jlpts.jlpt1 = e.target.checked}></mwc-checkbox>
      </mwc-formfield>

      <mwc-button outlined slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }

  open() {
    this.dialog.show()
  }
}