import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { WordDisplay } from './components/WordDisplay';
import { GuessInput } from './components/GuessInput';
import { Timer } from './components/Timer';
import { GameOver } from './components/GameOver';
import { Navigation } from './components/Navigation';
import { StaticPage } from './components/StaticPage';
import { GameHistory } from './components/GameHistory';
import { fetchWordData } from './utils/api';
import { STARTER_WORDS } from './utils/constants';
import type { WordChain, GameState, Page } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [currentPage, setCurrentPage] = useState<Page>('game');
  
  const [gameState, setGameState] = useState<GameState>({
    currentChain: [],
    nextWordHint: '',
    score: 0,
    gameOver: false,
    timeLeft: 30,
    startWord: STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)]
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missedWordDefinition, setMissedWordDefinition] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const selectNextWord = (synonyms: string[], usedWords: Set<string>): string => {
    const availableSynonyms = synonyms.filter(
      word => !usedWords.has(word.toLowerCase())
    );
    if (availableSynonyms.length === 0) return '';
    return availableSynonyms[Math.floor(Math.random() * availableSynonyms.length)];
  };

  const initializeGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMissedWordDefinition('');
    try {
      const wordData = await fetchWordData(gameState.startWord);
      const usedWords = new Set([gameState.startWord.toLowerCase()]);
      const nextWord = selectNextWord(wordData.synonyms, usedWords);
      
      setGameState(prev => ({
        ...prev,
        currentChain: [wordData],
        nextWordHint: nextWord,
        gameOver: false,
        timeLeft: 30,
        score: 0
      }));
    } catch (err) {
      setError('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [gameState.startWord]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameState.timeLeft === 0) {
      setGameState(prev => ({ ...prev, gameOver: true }));
    }

    const timer = setInterval(() => {
      if (!gameState.gameOver && gameState.timeLeft > 0) {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.timeLeft, gameState.gameOver]);

  useEffect(() => {
    if (gameState.gameOver && gameState.nextWordHint) {
      fetchWordData(gameState.nextWordHint).then(wordData => {
        setMissedWordDefinition(wordData.definition);
      });
    }
  }, [gameState.gameOver, gameState.nextWordHint]);

  const handleGuess = async (guess: string) => {
    const normalizedGuess = guess.toLowerCase().trim();
    
    if (normalizedGuess !== gameState.nextWordHint.toLowerCase()) {
      setError('Not the word I\'m thinking of. Try again!');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const wordData = await fetchWordData(normalizedGuess);
      
      const usedWords = new Set(
        gameState.currentChain.map(word => word.word.toLowerCase())
      );
      usedWords.add(normalizedGuess);
      
      const nextWord = selectNextWord(wordData.synonyms, usedWords);
      
      if (!nextWord) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        currentChain: [...prev.currentChain, wordData],
        nextWordHint: nextWord,
        score: prev.score + (prev.timeLeft * 10),
        timeLeft: 30
      }));
    } catch (err) {
      setError('Failed to validate word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetGame = useCallback(() => {
    const newStartWord = STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)];
    setGameState(prev => ({
      ...prev,
      startWord: newStartWord,
      currentChain: [],
      nextWordHint: '',
      score: 0,
      gameOver: false,
      timeLeft: 30
    }));
    initializeGame();
  }, [initializeGame]);

  const getCurrentWord = () => {
    if (gameState.currentChain.length === 0) return null;
    return gameState.currentChain[gameState.currentChain.length - 1];
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-emerald-50 dark:bg-emerald-950 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-100">
              QuizWordz Chain
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-emerald-800 dark:text-emerald-100 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </header>

          <main className="flex flex-col items-center gap-6">
            {currentPage === 'game' ? (
              loading && !gameState.gameOver ? (
                <div className="text-emerald-800 dark:text-emerald-100">Loading...</div>
              ) : !gameState.gameOver ? (
                <>
                  {getCurrentWord() && (
                    <WordDisplay 
                      currentWord={getCurrentWord()!}
                      nextWordHint={gameState.nextWordHint}
                      error={error}
                    />
                  )}
                  
                  <div className="w-full max-w-lg">
                    <Timer 
                      timeLeft={gameState.timeLeft} 
                      onTimeUp={() => setGameState(prev => ({ ...prev, gameOver: true }))}
                    />
                  </div>
                  
                  <GuessInput 
                    onGuess={handleGuess}
                    disabled={loading || gameState.timeLeft === 0}
                  />
                  
                  <div className="text-xl font-bold text-emerald-800 dark:text-emerald-100">
                    Score: {gameState.score}
                  </div>
                </>
              ) : (
                <GameOver 
                  score={gameState.score}
                  chain={gameState.currentChain}
                  onRestart={resetGame}
                  startWord={gameState.startWord}
                  missedWord={gameState.nextWordHint}
                  missedWordDefinition={missedWordDefinition}
                />
              )
            ) : currentPage === 'history' ? (
              <GameHistory />
            ) : currentPage === 'how-to-play' ? (
              <StaticPage title="How to Play">
                <p className="text-emerald-800 dark:text-emerald-100">QuizWordz Chain is a word association game where you build a chain of related words:</p>
                <ol className="list-decimal pl-6 space-y-2 text-emerald-800 dark:text-emerald-100">
                  <li>Start with a given word</li>
                  <li>Find a synonym for that word using the hint (word with vowels removed)</li>
                  <li>Continue building the chain with new synonyms</li>
                  <li>Score points based on your speed and chain length</li>
                </ol>
                <p className="mt-4 text-emerald-800 dark:text-emerald-100">The game ends when you either:</p>
                <ul className="list-disc pl-6 space-y-2 text-emerald-800 dark:text-emerald-100">
                  <li>Run out of time (30 seconds per word)</li>
                  <li>Make an incorrect guess</li>
                  <li>No more valid synonyms are available</li>
                </ul>
              </StaticPage>
            ) : currentPage === 'contact' ? (
              <StaticPage title="Contact Us">
                <p className="text-emerald-800 dark:text-emerald-100">Have questions or feedback about QuizWordz Chain? We'd love to hear from you!</p>
                <p className="text-emerald-800 dark:text-emerald-100">Email us at: support@quizwordz.com</p>
              </StaticPage>
            ) : (
              <StaticPage title="Privacy Policy">
                <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-100">Data Collection</h3>
                <p className="mb-4 text-emerald-800 dark:text-emerald-100">We only store your game history locally on your device. No personal information is collected or transmitted.</p>
                <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-100">Cookies</h3>
                <p className="text-emerald-800 dark:text-emerald-100">We use local storage to save your game history and preferences. No tracking cookies are used.</p>
              </StaticPage>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;