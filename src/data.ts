import _kanjis from '../docs/data/kanjis.json'
import { jlpts, Words } from './search-manager.js';
import { Domain, Row } from './types.js';


// Kanjis
export const Kanjis = _kanjis as Row[]
// Words (from the search manager)
export { Words }

// export let data: Row[];
// function resetData () { data = Kanjis.slice(0) }
// resetData()

export function getRowFromId (domain: Domain, id: number) {
  switch (domain) {
    case 'kanji':
      return Kanjis.find(r=>r[0]==id)!
    case 'words':
      return Words.find(r=>r[0]==id)!
  }
}

// export function elementsDomain (element): Domain {

// }