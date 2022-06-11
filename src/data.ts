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

export function wordExists(word: string) {
  return Words.some(r=>r[1]==word||r[4]==word)
  // return getExactSearch(word) !== undefined
}


export function getExactSearch (word: string) {
  return Words.find(r=>r[1]==word||r[4]==word) || null
}


export type SentenceMeta = { word: string, meta: Row|null }[]
export function parseSentence (sentence: string) {
  const meta: SentenceMeta = [];
  let text = sentence.split('');
  let extract = '';
  let search: Row|null = null;

  while (text.length > 0) {
    let length = text.length;
    while (length > 0) {
      extract = text.slice(0, length).join('')
      search = Words.find(r=>r[1]==extract||r[4]==extract) || Kanjis.find(r=>r[1]==extract||r[4]==extract) || null  || null
      if (search) {
        meta.push({ word: extract, meta: search })
        text.splice(0, length)
        break;
      }
      else {
        length--;
      }

      if (length == 0) {
        meta.push({ word: extract, meta: null })
        text.splice(0, 1)
        break
      }
    }
  }
  return meta
}