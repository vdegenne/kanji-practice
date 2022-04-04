import { css } from 'lit';

export const searchManagerStyles = css`
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

search-item-element {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eeeeee;
}
`