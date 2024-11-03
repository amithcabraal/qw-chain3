import { motion } from 'framer-motion';
import { Share2, Trophy, XCircle } from 'lucide-react';
import type { WordChain } from '../types';

interface GameOverProps {
  score: number;
  chain: WordChain[];
  onRestart: () => void;
  startWord: string;
  missedWord?: string;
  missedWordDefinition?: string;
}

export function GameOver({ 
  score, 
  chain, 
  onRestart, 
  startWord, 
  missedWord,
  missedWordDefinition 
}: GameOverProps) {
  const handleShare = () => {
    const text = `🎮 QuidzWordz Chain\n🎯 Score: ${score}\n🎲 Start word: "${startWord}"\nCan you beat my score? Play at [URL]`;
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg p-6 rounded-xl bg-emerald-800/20 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-emerald-100">Game Over!</h2>
        <Trophy className="w-8 h-8 text-emerald-400" />
      </div>
      
      <div className="mb-6">
        <p className="text-xl text-emerald-100">Final Score: {score}</p>
        <p className="text-emerald-100/80">Words in chain: {chain.length}</p>
      </div>

      {missedWord && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">You missed:</p>
          </div>
          <p className="text-xl font-semibold text-red-100 mb-2">{missedWord}</p>
          {missedWordDefinition && missedWordDefinition !== 'Unable to fetch definition' && (
            <p className="text-sm text-red-200/80">{missedWordDefinition}</p>
          )}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-emerald-100">Your Word Chain:</h3>
        {chain.map((item, index) => (
          <div key={index} className="p-3 rounded bg-emerald-900/20">
            <p className="font-medium text-emerald-100">{item.word}</p>
            <p className="text-sm text-emerald-100/70">{item.definition}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
        >
          Play Again
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-emerald-700/50 hover:bg-emerald-700/70 rounded-lg text-white flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </motion.div>
  );
}