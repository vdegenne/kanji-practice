import { html, LitElement } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { Dialog } from '@material/mwc-dialog';

@customElement('collections-manager')
export class CollectionsManager extends LitElement {

  @query('mwc-dialog') dialog!: Dialog;

  render () {
    return html`
    <mwc-dialog>
     ${window.app.collections.map(c => {
       return html`<a href="./?collection=${encodeURIComponent(c.name)}">${c.name}</a>`
     })}
    </mwc-dialog>
    `
  }

  show() {
    this.dialog.show()
  }
}