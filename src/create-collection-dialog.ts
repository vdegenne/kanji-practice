import {html, LitElement, PropertyValues} from "lit";
import {customElement, query} from "lit/decorators.js";
import {TextField} from "@material/mwc-textfield";
import {Dialog} from "@material/mwc-dialog";
import {CollectionsManager} from "./collections-manager";
import {Collection} from "./types";


@customElement('create-collection-dialog')
export class CreateCollectionDialog extends LitElement {
  public manager!: CollectionsManager;

  private _createResolve;
  private _createReject;

  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textfield') textfield!: TextField;

  constructor (collectionsManagerInstance: CollectionsManager) {
    super()
    this.manager = collectionsManagerInstance;
    this.manager.createCollectionDialog = this;
  }

  render() {
    return html`
        <mwc-dialog id="create-dialog" heading="Create new Collection">
            <mwc-textfield style="width:100%" dialogInitialFocus></mwc-textfield>
            <mwc-button outlined slot="secondaryAction" dialogAction="close">cancel</mwc-button>
            <mwc-button unelevated slot="primaryAction"
                        @click=${()=>{this.onCreateButtonClick()}}
            dialogAction="submit">create</mwc-button>
        </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    this.dialog.addEventListener('closing', e=>{
      if ((e as CustomEvent).detail.action == 'close') {
        this._createReject()
      }
    })
    super.firstUpdated(_changedProperties);
  }

  private onCreateButtonClick () {
    const value = this.textfield.value
    if (!value) {
      window.toast('Cannot be empty');
      return
    }
    if (this.manager.getCollection(this.manager.collectionsSelector.domain, value)) {
      window.toast('This collection already exists')
      return;
    }
    // yay!

    const collection = this.manager.addCollection(this.manager.collectionsSelector.domain, value)
    // this.manager.saveCollections()
    this._createResolve(collection)
    this.dialog.close()
    return;
  }

  show () {
    const promise = new Promise<Collection>((resolve, reject)=>{
      this._createResolve = resolve
      this._createReject = reject
    })

    this.dialog.show()

    return promise
  }
}