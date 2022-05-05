import _kanjis from '../docs/data/kanjis.json'
import { Kanji } from './types'
import {isFullChinese} from 'asian-regexps'
import { Button } from '@material/mwc-button'

export function jisho (word) {
  // window.open(`https://jisho.org/search/${encodeURIComponent(word)}%20%23kanji`, '_blank')
  window.open(`https://jisho.org/search/${encodeURIComponent(word)}`, '_blank')
}
export function mdbg (word) {
  window.open(`https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${encodeURIComponent(word)}`, '_blank')
}

export function tatoeba (word) {
  window.open(`https://tatoeba.org/en/sentences/search?from=jpn&query=${encodeURIComponent(word)}&to=`, '_blank')
}

export async function naver (word) {
  if (word.length === 1 && isFullChinese(word)) {
    // fetch naver hanzi link
    const response = await fetch(`https://assiets.vdegenne.com/chinese/naver/${word}`)
    window.open(`https://hanja.dict.naver.com/${await response.text()}/learning`, '_blank')
    return
  }
  window.open(`https://ja.dict.naver.com/#/search?range=example&query=${encodeURIComponent(word)}`, '_blank')
}

export function googleImageSearch (word) {
  window.open(`http://www.google.com/search?q=${encodeURIComponent(word)}&tbm=isch`, '_blank')
}

// export function mdbg (word) {
//   window.open(`https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${encodeURIComponent(word)}`, '_blank")
// }

const audioMap: {[word: string]: HTMLAudioElement} = {}

export async function playJapaneseAudio (word) {
  let audio: HTMLAudioElement
  if (word in audioMap) {
    audio = audioMap[word]
  }
  else {
    audio = new Audio(`https://assiets.vdegenne.com/data/japanese/audio/${encodeURIComponent(word)}`)
  }

  return new Promise((resolve, reject) => {
    audio.onerror = () => reject()
    audio.onended = () => {
      resolve(audio)
      if (!(word in audioMap)) {
        audioMap[word] = audio
      }
    }
    audio.play()
  })
}


export function getKanjiData (character: string) {
  return (_kanjis as Kanji[]).find(k => k[1] === character)
}

export async function changeButtonHeight (button: Button, height: number) {
  await button.updateComplete
  ;(button.shadowRoot!.querySelector('button') as HTMLButtonElement).style.height  = `${height}px`
}