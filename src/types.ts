export interface WordChain {
  word: string;
  definition: string;
  synonyms: string[];
}

export interface GameState {
  currentChain: WordChain[];
  nextWordHint: string;
  score: number;
  gameOver: boolean;
  timeLeft: number;
  startWord: string;
}

export interface GameHistory {
  id: string;
  date: string;
  startWord: string;
  score: number;
  chain: WordChain[];
}

export type Page = 'game' | 'history' | 'how-to-play' | 'privacy' | 'contact';