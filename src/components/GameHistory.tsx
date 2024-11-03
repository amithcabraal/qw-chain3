import { motion } from 'framer-motion';
import { History, Trophy, Play, Calendar, ChevronRight } from 'lucide-react';
import { getGameHistory } from '../utils/storage';

interface GameHistoryProps {
  onReplay: (startWord: string) => void;
}

export function GameHistory({ onReplay }: GameHistoryProps) {
  const history = getGameHistory();

  if (history.length === 0) {
    return (
      <div className="text-center text-emerald-100/80 p-8">
        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No games played yet. Start playing to see your history!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold text-emerald-100 mb-6 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-emerald-400" />
        Recent Games
      </h2>

      {history.map((game) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-lg bg-emerald-800/20 backdrop-blur-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <p className="text-lg font-semibold text-emerald-100">
                  Score: {game.score}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-100/70">
                <Calendar className="w-4 h-4" />
                {new Date(game.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <button
              onClick={() => onReplay(game.startWord)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              Replay
            </button>
          </div>

          <div className="mb-4 p-3 rounded-lg bg-emerald-900/30">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-emerald-100/80">
                Started with: <span className="font-semibold text-emerald-100">{game.startWord}</span>
              </p>
              <span className="text-emerald-100/40">•</span>
              <p className="text-sm text-emerald-100/80">
                Chain length: <span className="font-semibold text-emerald-100">{game.chain.length} words</span>
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {game.chain.map((word, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-emerald-400/50 mx-1" />}
                  <div className="group relative">
                    <div className="px-2 py-1 rounded bg-emerald-800/40 text-sm text-emerald-100 hover:bg-emerald-800/60 transition-colors">
                      {word.word}
                    </div>
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-2 rounded bg-emerald-800 text-xs text-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                      {word.definition}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}