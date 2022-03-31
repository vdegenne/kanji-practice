
export function jisho (word) {
  window.open(`https://jisho.org/search/${encodeURIComponent(word)}%20%23kanji`, '_blank')
}
export function mdbg (word) {
  window.open(`https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${encodeURIComponent(word)}`, '_blank')
}

export function tatoeba (word) {
  window.open(`https://tatoeba.org/en/sentences/search?from=jpn&query=${encodeURIComponent(word)}&to=`, '_blank')
}

export function naver (word) {
  window.open(`https://ja.dict.naver.com/#/search?range=example&query=${encodeURIComponent(word)}`, '_blank')
}