import { css } from 'lit';

export const wordsManagerStyles = css`
mwc-textfield {
  width: 100%;
}

.item .word {
  font-family: 'Sawarabi Mincho', serif;
  font-size: 1.3em;
  color: black;
}
.item .hiragana {
  font-family: 'Sawarabi Mincho', serif;
  flex: 1;
  padding: 0 0 0 4px;
}
.item .dictionary {
  background: rgb(255, 235, 59);
  color: black;
  padding: 0px 14px;
  border-radius: 12px;
}
`