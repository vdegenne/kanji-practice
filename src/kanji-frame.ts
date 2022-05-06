import { Menu } from '@material/mwc-menu';
import { css, html, LitElement, nothing, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { kanjiFrameStyles } from './styles/kanjiFrameStyles';
import { sharedStyles } from './styles/sharedStyles';
import { Row } from './types';
import { googleImageSearch, jisho, mdbg, naver, tatoeba } from './util';


@customElement('kanji-frame')
export class KanjiFrame extends LitElement {
  @property({type:Boolean, reflect:true})
  public revealed = false

  @property({type:Boolean, reflect:true})
  public success = false

  // @property({type:Boolean, reflect:true}) happy = false

  @property({ type: Array }) kanji: Row|null = null;

  @query('mwc-menu') menu!: Menu;

  static styles = [kanjiFrameStyles, sharedStyles]

  render () {
    if (this.kanji === null) {
      // @TODO: return an image with empty
      return nothing
    }

    const frameWidth = `${parseInt(getComputedStyle(this).width) - 48}px`
    let padding = 150 - (54 * this.kanji[1].length)
    if (padding < 0) { padding = 0 }

    return html`
    <div class="tag jlpt${this.kanji[2]}-color" id="jlpt-tag">jlpt${this.kanji[2]}</div>
    <div id=kanji>
      ${false && this.success ? html`
      <img src="./img/yeh.gif"/>
      ` : nothing}
      ${this.revealed ?
        html`
        <span style="z-index:2;font-size:calc(${frameWidth} / ${this.kanji[1].length} - ${padding}px)">${this.kanji[1]}</span>
        ` :
        html`?`
      }
    </div>

    <div id=meanings>
      <div style="margin-bottom:3px"><span class=tag style="background-color:#870000;margin-right:5px">On</span>${this.kanji[3]}</div>
      <div><span class=tag style="background-color:crimson;margin-right:5px;">Kun</span>${this.kanji[4]}</div>
    </div>

    <div id=details-strip ?hide=${!this.revealed}>
      <mwc-icon-button icon="playlist_add"
        ?highlight=${window.collectionsManager.IsCharacterInACollection(this.kanji[1])}
        @click=${_=>{window.collectionsSelector.open(this.kanji![1])}}></mwc-icon-button>
      <mwc-icon-button icon=search
        @click=${()=>{window.searchManager.show(this.kanji![1], 'words')}}></mwc-icon-button>
      <mwc-icon-button icon=more_horiz
        @click=${()=>{this.menu.show()}}></mwc-icon-button>
      <!-- <mwc-icon-button><img src="./img/tatoeba.svg" width=24 height=24
        @click=${()=>tatoeba(this.kanji![1])}></mwc-icon-button> -->

      <!-- <div style="position:relative"> -->
      <!-- <mwc-menu corner="BOTTOM_LEFT"> -->
      <mwc-menu corner="TOP_LEFT">
        <mwc-list-item graphic=icon @click=${()=>{mdbg(this.kanji![1])}}>
          <span>mdbg</span>
          <img src="./img/mdbg.ico" slot=graphic>
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{jisho(this.kanji![1])}}>
          <span>jisho</span>
          <img src="./img/jisho.ico" slot=graphic>
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{naver(this.kanji![1])}}>
          <span>naver</span>
          <img src="./img/naver.ico" slot=graphic>
        </mwc-list-item>
        <mwc-list-item graphic=icon
            @click=${()=>{googleImageSearch(this.kanji![1])}}>
          <span>Google Images</span>
          <mwc-icon slot=graphic style="color:#03a9f4">image</mwc-icon>
        </mwc-list-item>
        <li divider role="separator" padded></li>
        <mwc-list-item graphic=icon
            @click=${()=>{window.searchManager.show(this.kanji![1], 'words')}}>
          <span>words search</span>
          <mwc-icon slot=graphic>search</mwc-icon>
        </mwc-list-item>
      </mwc-menu>
    </div>
    <!-- </div> -->

    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.menu.anchor = this.menu.parentElement!
  }

  reveal() {
    this.revealed = true
  }
  conceal () {
    this.revealed =false
    this.success = false
  }
}