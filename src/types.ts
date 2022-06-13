export const domains = ['kanji', 'words'] as const;
export type Domain = typeof domains[number];
export type Mode = 'discovery'|'practice';

export type Row = [id:number, character:string, jlpt:number, meaning1:string, meaning2OrHiragana:string];

export type Collection = {
  name: string;
  elements: number[]; // save ids
}


export type JlptWordEntry = [word:string, hiragana: ''|string, english:string]
export type LemmaEntry = {r:string, f:string, l:string}


export type Jlpts = {
  jlpt1: boolean;
  jlpt2: boolean;
  jlpt3: boolean;
  jlpt4: boolean;
  jlpt5: boolean;
}

export type Options = {
  jlpts: Jlpts,
  showTextualHint: boolean,
  enableAudioHint: boolean,
  candidatesListSize: number
}