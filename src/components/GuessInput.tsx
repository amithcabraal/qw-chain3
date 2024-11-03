import { useState } from 'react';
import { Send } from 'lucide-react';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onGuess, disabled = false }: GuessInputProps) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim().toLowerCase());
      setGuess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mt-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={disabled}
          placeholder="Enter your guess..."
          className="flex-1 px-4 py-2 text-emerald-800 dark:text-emerald-100 bg-white dark:bg-emerald-900/20 rounded-lg border border-emerald-300 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-emerald-400 dark:placeholder-emerald-600"
        />
        <button
          type="submit"
          disabled={disabled || !guess.trim()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Guess</span>
        </button>
      </div>
    </form>
  );
}