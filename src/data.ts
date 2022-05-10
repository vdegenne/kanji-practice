import _kanjis from '../docs/data/kanjis.json'
import { jlpts } from './search-manager.js';
// import jlpt5 from '../docs/data/jlpt5-words.json'
// import jlpt4 from '../docs/data/jlpt4-words.json'
// import jlpt3 from '../docs/data/jlpt3-words.json'
// import jlpt2 from '../docs/data/jlpt2-words.json'
// import jlpt1 from '../docs/data/jlpt1-words.json'
import { Domain, Row } from './types.js';


export const Kanjis = _kanjis as Row[]
// building the words list from the searchManager data
export const Words = jlpts.flatMap((jlpt, i) => {
  return jlpt.map(word => {
    return [0, word[0], 5-i, word[2], word[1]]
  })
}) as Row[]

export let data: Row[];
function resetData () { data = Kanjis.slice(0) }
resetData()


// export function elementsDomain (element): Domain {

// }