import { html, LitElement, PropertyValueMap } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { Dialog } from '@material/mwc-dialog';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: Function;
  }
}

@customElement('lofi-player')
export class LofiPlayer extends LitElement {
  private script?: HTMLScriptElement;
  private player!: YT.Player;

  @query('mwc-dialog') dialog!: Dialog;
  @query('#playerContainer') playerContainer!: HTMLDivElement;

  constructor () {
    super()
    // bind class method to the API call
    window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this)
  }

  render() {
    return html`
    <mwc-dialog heading="Lofi Player">

      <div id="playerContainer"></div>
      <mwc-slider
        min="0"
        max="100"
        step="1"
        value="50"
        @input=${(e) => {
          this.player.setVolume(e.detail.value)
        }}
      ></mwc-slider>

      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.dialog.addEventListener('opened', async () => {
      // load the youtube player script
      this.loadYoutubePlayerScript()
      await this.playerReady()
      this.shadowRoot!.querySelector('mwc-slider')!.layout()
    })
  }

  loadYoutubePlayerScript () {
    if (!this.script) {
      this.script = document.createElement('script');
      this.script.src = "https://www.youtube.com/iframe_api";
      this.shadowRoot!.append(this.script)

    }
  }

  onYouTubeIframeAPIReady () {
    this.player = new window.YT.Player(this.playerContainer, {
      height: '195',
      width: '320',
      videoId: '5qap5aO4i9A',
      playerVars: {
        'playsinline': 1,
      },
      events: {
        'onReady': (e) => {
          e.target.setVolume(50)
        },
        // 'onStateChange': onPlayerStateChange
      }
    });
  }

  playerReady () {
    return new Promise(async resolve => {
      while (!this.player) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      resolve(this.player)
    })
  }

  show () {
    this.dialog.show()
  }
}