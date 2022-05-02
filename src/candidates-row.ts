import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues} from "lit";
import _kanjis from '../docs/data/kanjis.json'
import {Kanji} from "./types";

@customElement('candidates-row')
export class CandidatesRow extends LitElement {
  @property({type: Number}) size!: number;
  @property() answer!: string;

  static styles = css`
  :host {
    display: block;
    margin: 24px  0;
    width: 100%;
    font-family: 'Sawarabi Mincho', serif;
    text-align: center;
  }
  mwc-icon-button {
    --mdc-icon-font: 'Sawarabi Mincho' !important;
  }
  `

  render() {
    return html`
        ${this.generateCandidatesList(this.size).map(k=>{
            return html`<mwc-icon-button
                @click=${(e)=>{this.onButtonClick(e)}}>${k}</mwc-icon-button>`
        })}
    `
  }

  protected async updated(_changedProperties: PropertyValues) {
    await this.updateComplete
    this.shadowRoot!.querySelectorAll('mwc-icon-button').forEach(el=>{
      // reach the button and change font-family
      ;(el.shadowRoot!.querySelector('button') as HTMLButtonElement).style.fontFamily = '"Sawarabi Mincho", serif';
    })
    super.updated(_changedProperties);
  }

  generateCandidatesList (size: number) {
    if (size==0) return []

    // Generate the list
    const list = Array(size).fill(0).map(()=>{
      return (_kanjis[~~(Math.random()*_kanjis.length)] as Kanji)[1]
    })
    // Add the kanji in a random location
    list[~~(Math.random() * size)] = this.answer

    return list
  }

  private onButtonClick(e) {
    this.dispatchEvent(new CustomEvent('candidate-click', {
      bubbles: false,
      composed: true,
      detail: { candidate: e.target.textContent.trim() }
    }))
  }
}