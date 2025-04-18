import React from 'react';
import { Letter } from '../types';
import { checkGuess } from '../utils';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  word: string;
}

export const Grid: React.FC<GridProps> = ({ guesses, currentGuess, word }) => {
  const empties = Array(6 - guesses.length - 1).fill('');
  
  return (
    <div className="grid grid-rows-6 gap-1 sm:gap-2 w-full max-w-sm mx-auto mb-4">
      {guesses.map((guess, i) => (
        <Row key={i} word={word} guess={guess} />
      ))}
      {guesses.length < 6 && <CurrentRow guess={currentGuess} />}
      {empties.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};

const Row: React.FC<{ word: string; guess: string }> = ({ word, guess }) => {
  const letters = checkGuess(guess, word);
  
  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-2">
      {letters.map((letter, i) => (
        <div
          key={i}
          className={`
            flex items-center justify-center w-full h-10 sm:h-14 text-xl sm:text-2xl font-bold rounded uppercase
            ${letter.status === 'correct' ? 'bg-green-600 text-white' : ''}
            ${letter.status === 'present' ? 'bg-yellow-600 text-white' : ''}
            ${letter.status === 'absent' ? 'bg-gray-600 text-white' : ''}
          `}
        >
          {letter.char}
        </div>
      ))}
    </div>
  );
};

const CurrentRow: React.FC<{ guess: string }> = ({ guess }) => {
  const letters = guess.split('').concat(Array(5 - guess.length).fill(''));
  
  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-2">
      {letters.map((letter, i) => (
        <div
          key={i}
          className="flex items-center justify-center w-full h-10 sm:h-14 text-xl sm:text-2xl font-bold border-2 border-gray-600 rounded uppercase text-white"
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

const EmptyRow: React.FC = () => (
  <div className="grid grid-cols-5 gap-1 sm:gap-2">
    {Array(5).fill('').map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-center w-full h-10 sm:h-14 border-2 border-gray-700 rounded"
      />
    ))}
  </div>
);