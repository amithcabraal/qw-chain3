import type { GameHistory } from '../types';

const HISTORY_KEY = 'quidz-wordz-history';

export const saveGameToHistory = (game: Omit<GameHistory, 'id' | 'date'>) => {
  const history = getGameHistory();
  const newGame: GameHistory = {
    ...game,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  
  history.unshift(newGame);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
};

export const getGameHistory = (): GameHistory[] => {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};