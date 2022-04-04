import { css } from 'lit';


export const searchItemStyles = css`
:host {
  display: block;
  position: relative;
  /* border: 1px solid black; */
}
:host:hover {
  /* background-color: grey; */
}
:host #anchor {
  position: absolute;
  width: 0px;
  height: 0px;
  /* background-color: black; */
}
:host .header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 12px 0 5px 0;
  position: relative;
}
:host .header mwc-icon-button {
  --mdc-icon-button-size: 24px;
}
:host .word {
  font-family: 'Sawarabi Mincho', serif;
  font-size: 1.3em;
  color: black;
}
:host .word .character {
  /* cursor: pointer; */
}
:host .word .character:hover {
  color: grey;
}
:host .hiragana {
  font-family: 'Sawarabi Mincho', serif;
  /* flex: 1; */
  margin: 0 0 0 12px;
}
:host .dictionary {
  background: rgb(255, 235, 59);
  color: black;
  padding: 0px 14px;
  border-radius: 12px;
}
:host .lemma {
  border: 1px solid rgb(117, 117, 117);
  background-color: transparent;
  color: black;
  padding: 0px 7px;
  border-radius: 12px;
  margin-right: 5px;
}
`