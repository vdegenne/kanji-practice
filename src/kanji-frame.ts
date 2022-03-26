import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Kanji } from './types';


@customElement('kanji-frame')
export class KanjiFrame extends LitElement {
  @property({type:Boolean, reflect:true})
  private open = false

  @property({ type: Array }) kanji!: Kanji;

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    padding: 24px;
    padding-top: 0px;
    min-width: 300px;
    position: relative;
  }
  #kanji {
    font-size: 12em;
    opacity: 0;
    font-family: 'Sawarabi Mincho', serif;
    width: 100%;
    text-align: center;
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
    right: 2px;
    background-color: #78909c;
    color: white;
  }
  `
  render () {
    return html`
    <div class="tag" id="jlpt-tag">JLPT ${this.kanji[2]}</div>
    <div id=kanji>${this.kanji[1]}</div>
    <div style="margin-bottom:3px"><span class=tag style="background-color:#870000;padding:3px 11px;margin-right:5px">On</span>${this.kanji[3]}</div>
    <div><span class=tag style="background-color:crimson;margin-right:5px;">Kun</span>${this.kanji[4]}</div>
    `
  }


  show() {
    this.open = true
  }
  close () {
    this.open =false
  }
}