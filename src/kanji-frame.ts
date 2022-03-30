import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Kanji } from './types';
import { jisho, mdbg, tatoeba } from './util';


@customElement('kanji-frame')
export class KanjiFrame extends LitElement {
  @property({type:Boolean, reflect:true})
  public open = false

  @property({type:Boolean, reflect:true}) happy = false


  @property({ type: Array }) kanji!: Kanji;

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border: 1px solid #eeeeee;
    border-radius: 6px;
    padding: 24px;
    padding-top: 0px;
    min-width: 300px;
    position: relative;
    background-color: white;
    box-shadow: 0 3px 2px -2px #00000063;
  }
  #kanji {
    font-size: 12em;
    opacity: 0;
    font-family: 'Sawarabi Mincho', serif;
    width: 100%;
    text-align: center;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :host([open]) #kanji {
    opacity: 1
  }
  .tag {
    font-size: 0.7em;
    color: white;
    padding: 3px 8px;
    border-radius: 5px;
  }
  #jlpt-tag {
    position: absolute;
    top: 2px;
    left: 2px;
    background-color: #455a64;
    color: white;
  }
  #kanji > img {
    position: absolute;
    z-index: 1;
    /* display: none; */
    /* border: 1px solid black; */
    width: 300px;
    /* height: 65%; */
  }
  /* :host([happy]) img { display: initial } */

  #details-strip {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0; right: 0;
  }
  `
  render () {
    return html`
    <div class="tag" id="jlpt-tag">jlpt${this.kanji[2]}</div>
    <div id=kanji>
      ${this.happy ? html`
      <img src="./img/yeh.gif"/>
      ` : nothing}
      <span style="z-index:2">${this.kanji[1]}</span>
    </div>

    ${this.open ? html`
    <div id=details-strip>
      <mwc-icon-button icon=info
        @click=${_=>jisho(this.kanji[1])}></mwc-icon-button>
      <mwc-icon-button icon="playlist_add"
        @click=${_=>{new Audio('./audio/bip1.mp3').play(); window.toast('feature coming soon')}}></mwc-icon-button>
      <mwc-icon-button><img src="./img/tatoeba.svg" width=24 height=24
        @click=${()=>tatoeba(this.kanji[1])}></mwc-icon-button>
    </div>
    ` : nothing}

    <div style="margin-bottom:3px"><span class=tag style="background-color:#870000;padding:3px 11px;margin-right:5px">On</span>${this.kanji[3]}</div>
    <div><span class=tag style="background-color:crimson;margin-right:5px;">Kun</span>${this.kanji[4]}</div>
    `
  }


  show() {
    this.open = true
  }
  close () {
    this.open =false
    this.happy = false
  }
}