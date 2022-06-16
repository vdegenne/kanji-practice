import {customElement, property, query, queryAll, state} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues} from "lit";
import _kanjis from '../docs/data/kanjis.json'
import {Row} from "./types";
import { AppButton } from './app-button';

@customElement('candidates-row')
export class CandidatesRow extends LitElement {
  @property({type: Number}) size!: number;
  @property() answer!: string;

  @state() selectionIndex = -1

  private _candidates: string[] = [];

  @queryAll('app-button') candidateElements!: AppButton[];
  @query('app-button[selected]') selectedCandidateElement?: AppButton;

  static styles = css`
  :host {
    display: block;
    margin: 24px  0;
    width: 100%;
    font-family: 'Sawarabi Mincho', serif;
    text-align: center;
  }
  /* mwc-icon-button {
    --mdc-icon-font: 'Sawarabi Mincho' !important;
  } */
  app-button[selected] {
    --mdc-theme-primary: yellow;
    --mdc-theme-on-primary: black;
  }
  `

  render() {
    return html`
    ${this._candidates.map((k, i)=>{
      return html`
      <app-button raised ?selected=${i == this.selectionIndex}
        height=50
        @click=${(e)=>{this.onButtonClick(e)}}>${k}</app-button>`
    })}
    `
  }

  protected async updated(_changedProperties: PropertyValues) {
    await this.updateComplete
    this.shadowRoot!.querySelectorAll('mwc-icon-button').forEach(el=>{
      // reach the button and change font-family
      ;(el.shadowRoot!.querySelector('button') as HTMLButtonElement).style.fontFamily = '"Sawarabi Mincho", serif';
    })
    if (_changedProperties.has('answer') || _changedProperties.has('size')) {
      this._candidates = this.generateCandidatesList(this.size)
      this.requestUpdate()
    }
    // super.updated(_changedProperties);
  }

  generateCandidatesList (size: number) {
    if (size==0) return []

    // Generate the list
    const list = Array(size).fill(0).map(()=>{
      return (_kanjis[~~(Math.random()*_kanjis.length)] as Row)[1]
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


  selectPreviousCandidate() {
    if (this.selectionIndex - 1 >= 0) {
      this.selectionIndex--;
      return true
    }
    return false
  }
  selectNextCandidate() {
    if (this.selectionIndex + 1 < this.candidateElements.length) {
      this.selectionIndex++;
      return true
    }
    return false
  }
  clickSelectedCandidate () {
    const candidate = this.selectedCandidateElement;
    if (candidate) {
      candidate.click();
    }
  }
}