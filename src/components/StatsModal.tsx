import React from 'react';
import { GameStats } from '../types';
import { X } from 'lucide-react';

interface StatsModalProps {
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, isOpen, onClose }) => {
  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxGuesses = Math.max(...stats.guessDistribution);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Statistics</h2>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
            <p className="text-sm text-gray-400">Played</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{winRate}%</p>
            <p className="text-sm text-gray-400">Win Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
            <p className="text-sm text-gray-400">Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.maxStreak}</p>
            <p className="text-sm text-gray-400">Max Streak</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-4">Guess Distribution</h3>
        <div className="space-y-2">
          {stats.guessDistribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 text-gray-400">{i + 1}</div>
              <div className="flex-grow bg-gray-800 rounded">
                <div
                  className="bg-green-600 rounded px-2 py-1 text-white text-sm"
                  style={{
                    width: maxGuesses > 0 ? `${(count / maxGuesses) * 100}%` : '0%',
                    minWidth: count > 0 ? '2rem' : '0',
                  }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};