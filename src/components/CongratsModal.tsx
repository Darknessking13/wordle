import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';

interface CongratsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  stats: {
    currentStreak: number;
    maxStreak: number;
  };
  word: string;
  guessCount: number;
}

export const CongratsModal: React.FC<CongratsModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  stats,
  word,
  guessCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-6 max-w-md w-full relative"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", duration: 1.5 }}
          >
            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            Congratulations!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg mb-4"
          >
            You solved it in {guessCount} {guessCount === 1 ? 'guess' : 'guesses'}!
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white bg-opacity-10 rounded-lg p-4 mb-6 w-full"
          >
            <p className="text-xl font-bold mb-2">The word was: {word}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Current Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Best Streak</p>
                <p className="text-2xl font-bold">{stats.maxStreak}</p>
              </div>
            </div>
          </motion.div>
          
          <div className="flex gap-4 w-full">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Continue
            </motion.button>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onRestart}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Play Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};