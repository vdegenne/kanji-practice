import { css } from 'lit';

export const wordsManagerStyles = css`
mwc-textfield {
  width: 100%;
}

mwc-tab-bar {
  position: absolute;
  bottom: 57px;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: white;
  border: 1px solid #bdbdbd;
}

#words-results, #kanji-results {
  padding-bottom: 52px;
}

.item .word {
  font-family: 'Sawarabi Mincho', serif;
  font-size: 1.3em;
  color: black;
}
.item .word .character {
  cursor: pointer;
}
.item .word .character:hover {
  color: grey;
}
.item .hiragana {
  font-family: 'Sawarabi Mincho', serif;
  /* flex: 1; */
  margin: 0 0 0 12px;
}
.item .dictionary {
  background: rgb(255, 235, 59);
  color: black;
  padding: 0px 14px;
  border-radius: 12px;
}
.item .lemma {
  border: 1px solid rgb(117, 117, 117);
  background-color: transparent;
  color: black;
  padding: 0px 7px;
  border-radius: 12px;
  margin-right: 5px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 12px 0 5px 0;
}
.result-header mwc-icon-button {
  --mdc-icon-button-size: 24px;
}
`