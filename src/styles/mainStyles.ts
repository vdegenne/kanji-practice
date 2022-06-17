import { css } from 'lit';

export const mainStyles = css`
:host {
  display: block;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  /* padding: 0 12px; */
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* margin: 0 -12px; */
  padding: 4px 0;
  /* box-sizing: border-box; */
}
header > div:first-child {
  padding: 3px 11px;
  border-radius: 4px;
}
:host([mode=discovery]) header > div:first-child {
  color: black;
  background-color: grey;
  background-color: #e0e0e0;
}
:host([mode=practice]) header > div:first-child {
  color: white;
  background-color: #f44336;
}
header > mwc-icon-button {
  --mdc-icon-button-size: 42px;
}
kanji-frame {
  width: 100%;
}
`