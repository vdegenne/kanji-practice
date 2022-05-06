export const domains = ['Kanji', 'Words'] as const;
export type Domain = typeof domains[number];
export type Mode = 'discovery'|'practice';

export type Row = [id:number, character:string, jlpt:number, meaning1:string, meaning2OrHiragana:string];

export type Collection = {
  name: string;
  kanjis: string[]; // save the kanji (1 character) rather than all the data. To save space.
}


export type JlptWordEntry = [word:string, hiragana: ''|string, english:string]
export type LemmaEntry = {r:string, f:string, l:string}