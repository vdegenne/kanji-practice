import { Button } from '@material/mwc-button';
import { css, CSSResult, PropertyValueMap } from 'lit';
// import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('app-button')
export class AppButton extends Button {
  @property({type:Number})
  height

  static styles = Button.styles.concat(css`
    :host {
      --mdc-typography-button-font-size:1.5em;
      --mdc-typography-button-font-family: 'Sawarabi Mincho';
      --mdc-button-horizontal-padding:18px;
    }
  `)
  protected async updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
    await this.updateComplete
    ;(this.shadowRoot!.querySelector('button') as HTMLButtonElement).style.height  = `${this.height}px`
    // changeButtonHeight(this, this.height)
  }
}