import { css, html, LitElement } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { Dialog } from '@material/mwc-dialog';
import { AppContainer } from './app-container';
import { getRowFromId } from './data';

@customElement('row-history')
export class RowHistory extends LitElement {
  private app: AppContainer;

  private _history: ['k'|'w', number, 0|1][] = [];

  @query('mwc-dialog') dialog!: Dialog;

  constructor(app: AppContainer) {
    super()
    this.app = app;
  }

  /**
   * Styles
   */
  static styles = css`
  .item {
    display: flex;
    align-items: center;
    padding: 6px;
  }
  .item > span {
    font-size: 1.3em;
  }
  `

  /**
   * Render
   */
  render() {
    return html`
    <mwc-dialog heading=History>

      <div id="history-list">
        ${this._history.map(i=>{
          const row = getRowFromId(i[0]=='k'?'kanji':'words', i[1])
          return html`
          <div class=item style="color:${i[2] == 0 ? 'red' : 'green'}">
            <mwc-icon style="margin: 0 6px 0;">${i[2] == 0 ? 'close' : 'done'}</mwc-icon>
            <span
              @click=${()=>{window.searchManager.show(row[1], i[0]=='k' ? 'kanji' : 'words')}}>${row[1]}</span>
          </div>
          `;
        })}
      </div>

      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>
    `
  }

  addToHistory (domain: 'k'|'w', rowId: number, success: boolean) {
    this._history.push([domain, rowId, success ? 1 : 0])
    this.requestUpdate()
  }

  async show () {
    this.requestUpdate()
    await this.updateComplete
    this.dialog.show()
  }
}