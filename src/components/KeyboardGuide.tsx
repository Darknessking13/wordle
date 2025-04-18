import React from 'react';
import { Keyboard } from 'lucide-react';

interface KeyboardGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardGuide: React.FC<KeyboardGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-panel p-6 max-w-md w-full relative">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-6 h-6" />
          <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
        </div>

        <div className="shortcuts-grid">
          <span className="shortcut-key">A-Z</span>
          <span>Type letters</span>

          <span className="shortcut-key">Enter</span>
          <span>Submit guess</span>

          <span className="shortcut-key">Backspace</span>
          <span>Delete letter</span>

          <span className="shortcut-key">H</span>
          <span>Show hint (when available)</span>

          <span className="shortcut-key">R</span>
          <span>Reset game</span>

          <span className="shortcut-key">S</span>
          <span>Share result</span>

          <span className="shortcut-key">Tab</span>
          <span>Show statistics</span>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};