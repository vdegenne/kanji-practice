import { html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'


@customElement('event-icon-button')
export class EventIconButton extends LitElement {
  @property() icon;

  private clickDebouncerTimeoutMs = 700
  private longPressDebouncerTimeoutMs = 1300
  private clickCount = 0

  private _clickDebouncer: NodeJS.Timeout|null = null;
  private _longPressDebouncer: NodeJS.Timeout|null = null;
  private longPressDispatched = false

  render () {
    return html`<mwc-icon-button icon=${this.icon}></mwc-icon-button>`
  }

  constructor () {
    super()

    this.addEventListener('pointerdown', () => {
      this.clearClickDebouncer()
      this._longPressDebouncer = setTimeout(() => {
        this.dispatchLongPressEvent()
      }, this.longPressDebouncerTimeoutMs)
    })

    this.addEventListener('pointerup', () => {
      this.clearLongPressDebouncer()
      if (this.longPressDispatched) {
        this.longPressDispatched = false
        return
      }
      this.clickCount++;
      this._clickDebouncer = setTimeout(() => {
        this.dispatchClickEvent()
      }, this.clickDebouncerTimeoutMs)
    })
  }

  clearClickDebouncer () {
    if (this._clickDebouncer) {
      clearTimeout(this._clickDebouncer)
      this._clickDebouncer = null
    }
  }
  clearLongPressDebouncer () {
    if (this._longPressDebouncer) {
      clearTimeout(this._longPressDebouncer)
      this._longPressDebouncer = null
    }
  }


  dispatchClickEvent () {
    this.dispatchEvent(new CustomEvent('nclick', { detail: { clickCount: this.clickCount }}))
    this.resetState()
  }
  dispatchLongPressEvent () {
    this.dispatchEvent(new CustomEvent('longpress', { detail: { clickCount: this.clickCount }}))
    this.longPressDispatched = true
    this.resetState()
  }

  resetState () {
    this.clickCount = 0
    this.clearClickDebouncer()
    this.clearLongPressDebouncer()
  }
}