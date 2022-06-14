import { css, html, LitElement, nothing, PropertyValueMap } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('back-image')
export class BackImage extends LitElement {
  @state() private images: HTMLImageElement[] = [];
  private abortController?: AbortController;

  static styles = css`
  :host {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    max-width: 100%;
    overflow: auto;
  }
  img {
    height: 400px;
  }
  `

  render() {
    return this.images
  }

  private _previouslyClicked = false;
  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.addEventListener('click', (e) => {
      if (e.button == 0) {
        if (this._previouslyClicked) {
          this.dispatchEvent(new CustomEvent('dblick'))
          this._previouslyClicked = false
          return
        }
        else {
          this._previouslyClicked = true
          setTimeout(() => this._previouslyClicked = false, 500)
        }
      }
    })
  }

  load (src: string|string[]) {
    let sources = !(src instanceof Array) ? [src] : src;
    let images: HTMLImageElement[] = [];
    for (const source of sources) {
      let img
      images.push(img = new Image())
      img.src = source
    }
    this.images = images;
  }

  clear () {
    if (this.abortController) {
      this.abortController.abort()
    }
    this.images.forEach(img => img.src = '')
    this.images = []
  }


  async loadFromGoogleImages (search: string) {
    try {
      this.abortController = new AbortController()
      const response = await fetch(`https://assiets.vdegenne.com/google/images/${encodeURIComponent(search)}?lang=ja`, {
        signal: this.abortController.signal
      })
      if (response.status !== 200) {
        this.loadFromGoogleImages(search) // trying again
      }
      const googleImages = await response.json()
      this.load(googleImages.map(img=>img.data))
    } catch (e) {
      // console.warn('aborted')
      return
    }
  }

  loadImages (...images: HTMLImageElement[]) {
    this.clear()
    this.images = images;
  }
}