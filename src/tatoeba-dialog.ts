import { css, html, LitElement, nothing, PropertyValueMap } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import { Dialog } from '@material/mwc-dialog';

@customElement('tatoeba-dialog')
export class TatoebaDialog extends LitElement {
  @state() fetching = false;
  private search: string = '';

  private result: {e: string, j: string}[] = []

  @query('mwc-dialog') dialog!: Dialog;

  static styles = css`
  .example {
    display: flex;
    flex-direction: column;
    margin: 18px 0;
  }
  .example > span:first-of-type {
    /* border-bottom: 1px solid black; */
  }
  `

  render() {
    return html`
    <mwc-dialog heading=Examples>
      ${this.fetching ? html`fetching...` : nothing}

      ${this.result.map(r=>{
        return html`
        <div class="example">
          <span>${r.j}</span>
          <span>${r.e}</span>
        </div>
        `
      })}

      <mwc-button icon="search" slot=secondaryAction
        @click=${()=>{this.searchSelection()}}>search</mwc-button>
      <mwc-button outlined slot=secondaryAction dialogAction=close>close</mwc-button>
    </mwc-dialog>
    `
  }

  searchSelection() {
    let selection: Selection|null|string = window.getSelection()
    if (selection) {
      selection = selection.toString()
      if (selection) {
        window.searchManager.show(selection)
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    // window.addEventListener('selectionchange', e=>{
    //   console.log(e)
    // })
  }

  async performSearch (search = this.search) {
    this.fetching = true;
    try {
      const res = await fetch(`https://assiets.vdegenne.com/japanese/tatoeba/${encodeURIComponent(search)}`)
      this.result = await res.json()
      console.log(this.result)
    }
    catch (e) {
      window.toast('Something went wrong while fetching the search')
    }
    finally {
      this.fetching = false;
    }
  }

  async show (search: string) {
    if (search != this.search) {
      this.search = search
      this.performSearch()
    }
    this.dialog.show()
  }
}