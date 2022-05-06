/* material components */
import '@material/mwc-snackbar'
import '@material/mwc-button'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import '@material/mwc-slider'

/* app components */
import './kanji-frame'
import './candidates-row'
import './search-manager'
import './collections-manager'
import './collections-selector'
import './options-manager'
import './app-container'

/* global */
import { CollectionsSelector } from './collections-selector'
import { CollectionsManager } from './collections-manager'
import {SearchManager} from './search-manager'
import { AppContainer } from './app-container'

declare global {
  interface Window {
    app: AppContainer;
    // optionsManager: OptionsManager;
    collectionsSelector: CollectionsSelector;
    collectionsManager: CollectionsManager;
    searchManager: SearchManager;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}