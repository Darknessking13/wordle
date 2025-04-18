import React, { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, Share2, BarChart3 } from 'lucide-react';
import { GameState } from './types';
import { getRandomWord, generateHints, checkGuess, getAvailableHints } from './utils';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { StatsModal } from './components/StatsModal';
import { CongratsModal } from './components/CongratsModal';
import { triggerWinAnimation } from './utils/confetti';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedStats = localStorage.getItem('wordleStats');
    const stats = savedStats ? JSON.parse(savedStats) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: Array(6).fill(0),
    };

    const word = getRandomWord();
    return {
      word,
      guesses: [],
      currentGuess: '',
      hints: generateHints(word),
      gameStatus: 'playing',
      hintsUsed: 0,
      streak: 0,
      stats,
      timer: 300, 
    };
  });

  const [showStats, setShowStats] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timer: Math.max(0, prev.timer - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gameState.timer === 0 && gameState.gameStatus === 'playing') {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'lost',
        stats: {
          ...prev.stats,
          gamesPlayed: prev.stats.gamesPlayed + 1,
          currentStreak: 0,
        },
      }));
    }
  }, [gameState.timer]);

  const handleKeyPress = (key: string) => {
    if (gameState.gameStatus !== 'playing' || gameState.timer === 0) return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length === 5) {
        const newGuesses = [...gameState.guesses, gameState.currentGuess];
        const won = gameState.currentGuess === gameState.word;
        const lost = newGuesses.length === 6;

        if (won || lost) {
          const newStats = {
            ...gameState.stats,
            gamesPlayed: gameState.stats.gamesPlayed + 1,
            gamesWon: won ? gameState.stats.gamesWon + 1 : gameState.stats.gamesWon,
            currentStreak: won ? gameState.stats.currentStreak + 1 : 0,
            maxStreak: won ? Math.max(gameState.stats.maxStreak, gameState.stats.currentStreak + 1) : gameState.stats.maxStreak,
            guessDistribution: gameState.stats.guessDistribution.map((count, i) => 
              i === newGuesses.length - 1 && won ? count + 1 : count
            ),
          };

          localStorage.setItem('wordleStats', JSON.stringify(newStats));

          if (won) {
            triggerWinAnimation();
            setShowCongrats(true);
          }

          setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            currentGuess: '',
            gameStatus: won ? 'won' : 'lost',
            stats: newStats,
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            currentGuess: '',
          }));
        }
      }
    } else if (key === '⌫') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      }));
    } else if (gameState.currentGuess.length < 5) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key,
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shareResult = () => {
    if (gameState.gameStatus === 'playing') return;

    const emoji = gameState.gameStatus === 'won' ? '🎉' : '😢';
    const guessCount = gameState.guesses.length;
    const shareText = `Wordle ${emoji}\n${guessCount}/6 guesses\nTime: ${formatTime(300 - gameState.timer)}\nStreak: ${gameState.stats.currentStreak}`;

    navigator.clipboard.writeText(shareText);
    alert('Result copied to clipboard!');
  };

  const showHint = () => {
    const availableHints = getAvailableHints(gameState.word, gameState.guesses);
    if (gameState.hintsUsed < availableHints.length) {
      setGameState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
      }));
    }
  };

  const resetGame = () => {
    const word = getRandomWord(true); 
    setGameState(prev => ({
      ...prev,
      word,
      guesses: [],
      currentGuess: '',
      hints: generateHints(word),
      gameStatus: 'playing',
      hintsUsed: 0,
      timer: 300,
    }));
    setShowCongrats(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('⌫');
      } else {
        const key = e.key.toUpperCase();
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          handleKeyPress(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const usedLetters = gameState.guesses.flatMap(guess => 
    checkGuess(guess, gameState.word)
  );

  const availableHints = getAvailableHints(gameState.word, gameState.guesses);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-wider">WORDLE</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-white font-mono">{formatTime(gameState.timer)}</div>
            <button
              onClick={showHint}
              disabled={gameState.hintsUsed >= availableHints.length}
              className={`p-1.5 sm:p-2 rounded-full hover:bg-gray-700 text-white transition-colors duration-200 ${
                gameState.hintsUsed >= availableHints.length ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Show hint"
            >
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-700 text-white transition-colors duration-200"
              title="Show statistics"
            >
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={shareResult}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-700 text-white transition-colors duration-200"
              title="Share result"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={resetGame}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-700 text-white transition-colors duration-200"
              title="New game"
            >
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {gameState.hintsUsed > 0 && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-900 bg-opacity-50 rounded-lg text-white">
            <h2 className="font-bold mb-2">Hints:</h2>
            <ul className="list-disc list-inside">
              {availableHints.slice(0, gameState.hintsUsed).map((hint, i) => (
                <li key={i} className="text-sm sm:text-base">{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {gameState.gameStatus !== 'playing' && !showCongrats && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-center ${
            gameState.gameStatus === 'won' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            <p className="text-lg sm:text-xl font-bold text-white">
              {gameState.gameStatus === 'won' ? 'Congratulations!' : 'Game Over!'}
            </p>
            <p className="text-white">The word was: {gameState.word}</p>
          </div>
        )}

        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          word={gameState.word}
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          usedLetters={usedLetters}
        />

        <StatsModal
          stats={gameState.stats}
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />

        <CongratsModal
          isOpen={showCongrats}
          onClose={() => setShowCongrats(false)}
          onRestart={resetGame}
          stats={gameState.stats}
          word={gameState.word}
          guessCount={gameState.guesses.length}
        />
      </div>
    </div>
  );
}

export default App;