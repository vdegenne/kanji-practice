import { html, LitElement, nothing, PropertyValueMap } from 'lit';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { searchItemStyles } from './styles/searchItemElementStyles';
import { googleImageSearch, jisho, mdbg, naver, playJapaneseAudio, tatoeba } from './util';
import {SearchItem} from './search-manager'

import '@material/mwc-menu'

import './concealable-span'
import { Menu } from '@material/mwc-menu';
import { ConcealableSpan } from './concealable-span';


@customElement('search-item-element')
export class SearchItemElement extends LitElement {
  @property({type: Object }) item!: SearchItem;

  @property({type: Boolean, reflect:true}) revealed = false;

  @query('#anchor') anchor!: HTMLDivElement;
  @query('mwc-menu') menu!: Menu;
  @queryAll('concealable-span[concealed]') concealedSpans!: ConcealableSpan[];

  static styles = searchItemStyles;

  render () {
    return html`
    <!-- ANCHOR
      The anchor is used when a right click is registered.
      It serves as an unvisible anchor for the contextual menu
    -->
    <div id=anchor>
      <!-- MENU -->
      <mwc-menu>
        <mwc-list-item noninteractive>
          <span>${this.item.word}</span>
        </mwc-list-item>
        <li divider role="separator"></li>
        <mwc-list-item graphic=icon @click=${()=>{playJapaneseAudio(this.item.hiragana || this.item.word)}}>
          <span>Listen</span>
          <mwc-icon slot=graphic>volume_up</mwc-icon>
        </mwc-list-item>
        <!-- google images -->
        <mwc-list-item graphic=icon @click=${()=>{googleImageSearch(this.item.word)}}>
          <span>Google Images</span>
          <mwc-icon slot=graphic>images</mwc-icon>
        </mwc-list-item>
        <!-- jisho -->
        <mwc-list-item graphic=icon @click=${()=>{jisho(this.item.word)}}>
          <span>Jisho</span>
          <img src="./img/jisho.ico" slot="graphic">
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{tatoeba(this.item.word)}}>
          <span>Tatoeba</span>
          <img src="./img/tatoeba.ico" slot="graphic">
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{naver(this.item.word)}}>
          <span>Naver</span>
          <img src="./img/naver.ico" slot="graphic">
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{mdbg(this.item.word)}}>
          <span>MDBG</span>
          <img src="./img/mdbg.ico" slot="graphic">
        </mwc-list-item>
      </mwc-menu>
    </div>

    <div class=header>
      <!-- <mwc-icon-button icon=volume_up style="margin-right:5px;"
        @click=${e=>this.onSpeakerClick(e)}></mwc-icon-button> -->
      <div class="word">
        ${this.item.word.split('').map(c=>{
          return html`<span class=character
            @click=${e=>{window.searchManager.search(e.target.innerText.trim());window.searchManager.view='kanji'}}>${c}</span>`
        })}
      </div>
      ${this.item.hiragana ? html`
      <concealable-span class=hiragana ?concealed=${!this.revealed}>${this.item.hiragana}</concealable-span>` : nothing}
      <div style="flex:1"></div>
      ${this.item.frequency ? html`
      <span class=lemma>${this.item.frequency}</span>
      ` : nothing}
      <span class="dictionary ${this.item.dictionary.replace(' n', '')}-color"
        @click=${()=>naver(this.item.word)}>${this.item.dictionary}</span>
      <!-- three dots menu -->
      <mwc-icon-button icon=more_vert
        @click=${(e)=>{/* simulate right click to open the menu */this.onRightClick(e)}}></mwc-icon-button>
    </div>


    <!-- ENGLISH -->
    <concealable-span class=english ?concealed=${!this.revealed}>${this.item.english}</concealable-span>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.addEventListener('contextmenu', e=>e.preventDefault())

    this.menu.anchor = this.anchor

    this.addEventListener('pointerdown', (e)=>{
      if (e.button === 2) {
        document.body.click() // close all others menu
        this.onRightClick(e)
      }
    })
  }

  async onRightClick (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.

    // Move the anchor to the pointer position
    this.moveAnchorTo(x, y)
    this.menu.show()

    // Open the menu
  }

  moveAnchorTo (x: number, y: number) {
    this.anchor.style.left = `${x}px`
    this.anchor.style.top = `${y}px`
  }

  onSpeakerClick(e) {
    const target = e.target as HTMLElement;
    let el: HTMLSpanElement|null = target.parentElement!.querySelector('.hiragana')
    if (el === null) {
      el = target.parentElement!.querySelector('.word')!
    }
    playJapaneseAudio(el.innerText.trim())
  }

  hasConcealedSpans () {
    return this.concealedSpans.length > 0
  }
}