import React from 'react';
import { Letter } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters: Letter[];
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, usedLetters }) => {
  const getKeyStatus = (key: string): string => {
    const letter = usedLetters.find(l => l.char === key);
    return letter?.status || 'unused';
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 px-1 sm:px-0">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`
                keyboard-key
                ${key.length > 1 ? 'text-xs sm:text-sm' : ''}
                ${getKeyStatus(key) === 'correct' ? 'bg-green-600 text-white' : ''}
                ${getKeyStatus(key) === 'present' ? 'bg-yellow-600 text-white' : ''}
                ${getKeyStatus(key) === 'absent' ? 'bg-gray-600 text-white' : ''}
                ${getKeyStatus(key) === 'unused' ? 'bg-gray-800 text-white hover:bg-gray-700' : ''}
              `}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};