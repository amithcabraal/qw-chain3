export const normalizeWord = (word: string): string => {
  return word.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const isValidGuess = (guess: string, synonyms: string[]): boolean => {
  const normalizedGuess = normalizeWord(guess);
  return synonyms.some(synonym => normalizeWord(synonym) === normalizedGuess);
};

export const getAvailableSynonyms = (
  currentWord: WordChain,
  usedWords: Set<string>
): string[] => {
  return currentWord.synonyms.filter(
    synonym => !usedWords.has(normalizeWord(synonym))
  );
};

export const calculateScore = (chainLength: number, timeLeft: number): number => {
  const baseScore = chainLength * 100;
  const timeBonus = timeLeft * 10;
  return baseScore + timeBonus;
};