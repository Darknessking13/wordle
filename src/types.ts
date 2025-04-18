export interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string;
  hints: string[];
  gameStatus: 'playing' | 'won' | 'lost';
  hintsUsed: number;
  streak: number;
  stats: GameStats;
  timer: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}

export interface Letter {
  char: string;
  status: 'correct' | 'present' | 'absent' | 'unused';
}