import { css } from 'lit';

export const kanjiFrameStyles = css`
:host {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* border: 1px solid #eeeeee; */
  border-radius: 6px;
  padding: 24px;
  padding-top: 0px;
  min-width: 300px;
  position: relative;
  background-color: black;
  box-shadow: 0 3px 2px -2px #00000063;
  color: white;
}
#kanji {
  font-size: 12em;
  /* opacity: 0; */
  font-family: 'Sawarabi Mincho', serif;
  width: 100%;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* :host([revealed]) #kanji {
  opacity: 1
} */
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
#kanji > img {
  position: absolute;
  z-index: 1;
  /* display: none; */
  /* border: 1px solid black; */
  width: 300px;
  /* height: 65%; */
}
/* :host([happy]) img { display: initial } */

#details-strip {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0; right: 0;
}
`