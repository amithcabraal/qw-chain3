import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}

export function Timer({ timeLeft, onTimeUp }: TimerProps) {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="flex items-center gap-2">
      <TimerIcon className="w-5 h-5 text-emerald-400" />
      <motion.div
        className="w-full bg-emerald-900/20 rounded-full h-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 30) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </motion.div>
      <span className="text-emerald-100 min-w-[3ch]">{timeLeft}s</span>
    </div>
  );
}