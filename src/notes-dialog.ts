import { html, LitElement, PropertyValueMap } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import '@material/mwc-textarea'
import { Dialog } from '@material/mwc-dialog';
import { TextArea } from '@material/mwc-textarea'

@customElement('notes-dialog')
export class NotesDialog extends LitElement {
  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textarea') textarea!: TextArea;

  render() {
    return html`
    <mwc-dialog heading=Notes style="--mdc-dialog-min-width:calc(100vw - 32px);">

      <mwc-textarea style="width:100%" rows=12
        @keyup=${this.onKeyUp}></mwc-textarea>

      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.loadContent()
  }

  onKeyUp () {
    this.saveContent()
  }

  loadContent () {
    let content: string|null = localStorage.getItem('translation-practice:notes')
    if (content) {
      this.textarea.value = content
    }
  }

  saveContent () {
    localStorage.setItem('translation-practice:notes', this.textarea.value)
  }

  show () {
    this.dialog.show()
  }
}