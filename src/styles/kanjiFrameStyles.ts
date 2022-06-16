import { css } from 'lit';

export const kanjiFrameStyles = css`
:host {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* border: 1px solid #eeeeee; */
  border-radius: 10px;
  /* padding: 24px; */
  padding-top: 0px;
  min-width: 300px;
  /* max-width: 500px; */
  min-height: 240px;
  position: relative;
  background-color: black;
  box-shadow: 0 3px 2px -2px #00000063;
  color: white;
  margin: 0 auto;
}
:host([revealed]) {
  background-color: #f44336;
}
:host([revealed][success]) {
  background-color: #4caf50;
}
#kanji {
  display: flex;
  justify-content: center;
  align-items: center;
  width : 100%;
  min-height: 425px;
  font-size: 12em;
  /* font-family: 'Sawarabi Mincho', serif; */
  font-family: 'Noto Serif JP', serif;
  text-shadow: 1px 1px 2px black;
  /* font-weight: 300;
  width: 100%;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center; */
  -webkit-text-stroke: 0.5px black;
}
#kanji > back-image {
  /* height: 500px; */
  height: 425px;
}
#kanji > div {
  position: absolute;
  transition: opacity 0.4s ease-out;
  opacity: 1;
  user-select: none;
}
:host([revealed]) #kanji  div {
  pointer-events: none;
}
#kanji > div[unobtrusive] {
  opacity: 0;
}
#kanji .letter[unrevealed] > span:first-of-type { display: inline }
#kanji .letter[unrevealed] > span:last-of-type { display: none }
#kanji .letter > span:first-of-type { display: none }
#kanji .letter > span:last-of-type { display: inline }
.tag {
  font-size: 0.7em;
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
}
#jlpt-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: #455a64;
  color: white;
}
/* :host([happy]) img { display: initial } */

#meanings {
  padding: 14px 48px 24px 24px;
  cursor: pointer;
}
#meanings[hide] {
  display: initial !important;
}
#meanings[hide] span:not(.tag) {
  background-color: white;
  color: white;
  opacity: .6;
  border-radius: 3px;
}
#details-strip {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0; right: 0;
  /* float:right; */
}
#details-strip {
  -webkit-text-stroke: 0.5px black;
}

mwc-icon-button[highlight] {
  color: yellow;
}
`