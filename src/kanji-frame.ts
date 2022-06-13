import { Menu } from '@material/mwc-menu';
import { css, html, LitElement, nothing, PropertyValueMap } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { AppContainer } from './app-container';
import { BackImage } from './back-image';
import { getRowFromId } from './data';
import { kanjiFrameStyles } from './styles/kanjiFrameStyles';
import { sharedStyles } from './styles/sharedStyles';
import { Row } from './types';
import { googleImageSearch, jisho, mdbg, naver, tatoeba } from './util';


@customElement('kanji-frame')
export class KanjiFrame extends LitElement {
  app: AppContainer;

  @property({type:Boolean, reflect:true})
  public revealed = false
  @property({type:Boolean, reflect:true})
  public success = false
  // @property({type:Boolean, reflect:true}) happy = false
  @property({ type: Array })
  row: Row|null = null;
  @state() showText;

  public imageFeature: boolean = true;
  // private _image?: HTMLImageElement;
  private backImage = new BackImage()
  private ero = false
  private eroImage?: HTMLImageElement;



  @query('mwc-menu') menu!: Menu;

  static styles = [kanjiFrameStyles, sharedStyles]

  constructor (appInstance: AppContainer) {
    super()
    this.app = appInstance
    this.showText = this.app.optionsManager.options.showTextualHint
  }

  render () {
    if (!this.row) {
      // @TODO: return an image with empty
      return nothing
    }

    const frameWidth = `${parseInt(getComputedStyle(this).width) - 48}px`
    let padding = 150 - (54 * this.row[1].length)
    if (padding < 0) { padding = 0 }

    return html`
    <div class="tag jlpt${this.row[2]}-color" id="jlpt-tag">jlpt${this.row[2]}</div>
    <div id=kanji>
      ${false && this.success ? html`
      <img src="./img/yeh.gif"/>
      ` : nothing}
      ${this.revealed ?
        html`
        ${this.backImage}
        <div style="z-index:2;font-size:Min(200px, calc(${frameWidth} / ${this.row[1].length} - ${padding}px));pointer-events: none;">${this.row[1]}</div>
        ` :
        html`?`
      }
    </div>

    <div id=meanings ?hide=${!this.showText}
      @click=${()=>{this.showText=!this.showText}}>
      <div style="margin-bottom:3px"><span class=tag style="background-color:#870000;margin-right:5px">On</span><span>${this.row[3]}</span></div>
      <div>
        <span class=tag style="background-color:crimson;margin-right:5px;">Kun</span>
        <span
          @click=${(e)=>{
            if (this.app.domain == 'words' && this.row![4]) {
              e.stopPropagation();
              this.app.searchManager.show(this.row![4], 'words')
            }
          }}>${this.row[4]}</span></div>
    </div>

    <div id=details-strip ?hide=${!this.revealed}>
      <mwc-icon-button icon="playlist_add"
        ?highlight=${this.app.collectionsManager.IsElementInACollection(this.app.domain, this.row![0])}
        @click=${()=>{this.app.collectionsManager.collectionsSelector.show(this.app.domain, getRowFromId(this.app.domain, this.row![0]))}}></mwc-icon-button>
      <mwc-icon-button icon=search
        @click=${()=>{window.searchManager.show(this.row![1], 'words')}}></mwc-icon-button>
      <mwc-icon-button icon=image
        @click=${()=>{googleImageSearch(this.row![1])}}></mwc-icon-button>
      <mwc-icon-button icon=more_horiz
        @click=${()=>{this.menu.show()}}></mwc-icon-button>
      <!-- <mwc-icon-button><img src="./img/tatoeba.svg" width=24 height=24
        @click=${()=>tatoeba(this.row![1])}></mwc-icon-button> -->

      <!-- <div style="position:relative"> -->
      <!-- <mwc-menu corner="BOTTOM_LEFT"> -->
      <mwc-menu corner="TOP_LEFT">
        <mwc-list-item graphic=icon
            @click=${()=>{googleImageSearch(this.row![1])}}>
          <span>Google Images</span>
          <mwc-icon slot=graphic style="color:#03a9f4">image</mwc-icon>
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{jisho(this.row![1])}}>
          <span>jisho</span>
          <img src="./img/jisho.ico" slot=graphic>
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{mdbg(this.row![1])}}>
          <span>mdbg</span>
          <img src="./img/mdbg.ico" slot=graphic>
        </mwc-list-item>
        <mwc-list-item graphic=icon @click=${()=>{naver(this.row![1])}}>
          <span>naver</span>
          <img src="./img/naver.ico" slot=graphic>
        </mwc-list-item>
        <li divider role="separator" padded></li>
        <mwc-list-item graphic=icon @click=${()=>{this.app.tatoebaDialog.show(this.row![1])}}>
          <span>Examples</span>
          <mwc-icon slot="graphic">format_quote</mwc-icon>
        </mwc-list-item>
        <!-- <mwc-list-item graphic=icon
            @click=${()=>{window.searchManager.show(this.row![1], 'words')}}>
          <span>words search</span>
          <mwc-icon slot=graphic>search</mwc-icon>
        </mwc-list-item> -->
      </mwc-menu>
    </div>
    <!-- </div> -->

    `
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (this.menu)
      this.menu.anchor = this.menu.parentElement!
    if (_changedProperties.has('revealed')) {
      if (this.revealed) {
        // always show the text when revealed
        this.showText = true
        if (this.ero && this.success) {
          this.backImage.loadImages(this.eroImage!)
        }
      }
      else {
        this.showText = this.app.optionsManager.options.showTextualHint
        // if (this.imageFeature) {
        //   this.preloadImage()
        // }
      }
    }
    if (_changedProperties.has('row')) {
      if (this.row) {
        this.preloadImage()
      }
    }
    // console.log(_changedProperties)
  }

  toggleEro () {
    this.ero = !this.ero
    if (this.ero) {
      this.preloadEro()
    }
  }

  async preloadEro() {
    // if (this.ero) {
      // preloading ero
      this.eroImage = new Image
      this.eroImage.src = `https://xxx.vdegenne.com/?${Date.now()}`
    // }
  }

  async preloadImage() {
    if (this.ero) this.preloadEro()
    if (!this.row || this.imageFeature == false) { return }
    this.backImage.clear()
    this.backImage.loadFromGoogleImages(this.row![1])
    return
    // this._image = document.createElement('img')
    // // this._image.src =
    // this._image.src = googleImages[0].data
  }


  reveal() {
    this.revealed = true
  }
  conceal () {
    this.revealed =false
    this.success = false
  }
}