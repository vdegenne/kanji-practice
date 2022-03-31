export type Mode = 'discovery'|'practice';

export type Kanji = [id:number, symbol:string, jlpt:number, meaning1:string, meaning2:string];

export type Collection = {
  name: string;
  kanjis: string[]; // save the kanji (1 character) rather than all the data. To save space.
}