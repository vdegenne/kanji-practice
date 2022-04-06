import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { kanjiFrameStyles } from './styles/kanjiFrameStyles';
import { sharedStyles } from './styles/sharedStyles';
import { Kanji } from './types';
import { jisho, mdbg, tatoeba } from './util';


@customElement('kanji-frame')
export class KanjiFrame extends LitElement {
  @property({type:Boolean, reflect:true})
  public revealed = false

  @property({type:Boolean, reflect:true}) happy = false

  @property({ type: Array }) kanji: Kanji|null = null;

  static styles = [kanjiFrameStyles, sharedStyles]

  render () {
    if (this.kanji === null) {
      // @TODO: return an image with empty
      return nothing
    }



    return html`
    <div class="tag jlpt${this.kanji[2]}-color" id="jlpt-tag">jlpt${this.kanji[2]}</div>
    <div id=kanji>
      ${this.happy ? html`
      <img src="./img/yeh.gif"/>
      ` : nothing}
      ${this.revealed ?
        html`
        <span style="z-index:2">${this.kanji[1]}</span>
        ` :
        html`?`
      }
    </div>

    <div id=meanings>
      <div style="margin-bottom:3px"><span class=tag style="background-color:#870000;margin-right:5px">On</span>${this.kanji[3]}</div>
      <div><span class=tag style="background-color:crimson;margin-right:5px;">Kun</span>${this.kanji[4]}</div>
    </div>

    ${this.revealed ? html`
    <div id=details-strip>
      <mwc-icon-button icon="playlist_add"
        ?highlight=${window.collectionsManager.IsCharacterInACollection(this.kanji[1])}
        @click=${_=>{window.collectionsSelector.open(this.kanji![1])}}></mwc-icon-button>
      <!-- <mwc-icon-button icon=info
        @click=${_=>jisho(this.kanji![1])}></mwc-icon-button> -->
      <mwc-icon-button icon=more_horiz
        @click=${()=>{window.searchManager.open(this.kanji![1], 'words')}}></mwc-icon-button>
      <!-- <mwc-icon-button><img src="./img/tatoeba.svg" width=24 height=24
        @click=${()=>tatoeba(this.kanji![1])}></mwc-icon-button> -->
    </div>
    ` : nothing}
    `
  }


  reveal() {
    this.revealed = true
  }
  conceal () {
    this.revealed =false
    this.happy = false
  }
}