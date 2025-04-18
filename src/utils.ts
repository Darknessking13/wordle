import { Letter } from './types';

const WORD_LIST = [
  'REACT', 'SWIFT', 'KOTLN', 'RUSTY', 'SCALA', 'PYTHN', 'JAVAS', 'RUBYS', 'GOLAN', 'HASKEL',
  'VUEJS', 'ANGUL', 'NEXTS', 'NUXTY', 'DENOS', 'EXPRS', 'DJANGL', 'RAILS', 'SPRNG', 'FLASK',
  'MYSQL', 'MONGO', 'REDIS', 'PSTGR', 'SQLIT', 'CASND', 'MARIA', 'COCKR', 'FAUNA', 'DYNGR',
  'DOCKR', 'GITLY', 'KUBNT', 'JENKS', 'TERRA', 'ANSBL', 'PULMI', 'GRAFN', 'PROMT', 'NGINX',
  'HTMLS', 'CSSTY', 'WEBGL', 'WASM', 'BABEL', 'WEBPK', 'ESLNT', 'SASSY', 'TYPES', 'AXIOS',
  'AWSVC', 'AZURE', 'GCLOUD', 'CICDP', 'HERKU', 'NETLF', 'VERCY', 'DIGITL', 'LINOD', 'DOCEN',
  'FLUTR', 'IONIC', 'XAMRN', 'ELECT', 'UNITY', 'ANDRD', 'XCODE', 'MACOS', 'WINDY', 'LINUX',
  'JESTS', 'CYPRS', 'SELUM', 'KARMA', 'MOCHS', 'TESTG', 'QUNIT', 'JASMIN', 'RSPEC', 'JUNIT'
];

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const getDateSeed = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  return now.getFullYear() * 10000 + 
         (now.getMonth() + 1) * 100 + 
         now.getDate() + 
         now.getHours() + 
         Math.floor(minutes / 15); 
};

const getTrueRandom = () => {
  return Math.random() * Date.now();
};

export const getRandomWord = (forceRandom: boolean = false) => {
  const seed = forceRandom ? getTrueRandom() : getDateSeed();
  const random = mulberry32(seed);
  
  const r1 = random();
  const r2 = random();
  const r3 = random();
  
  const finalIndex = Math.floor((r1 + r2 + r3) * WORD_LIST.length / 3) % WORD_LIST.length;
  
  return WORD_LIST[finalIndex];
};

export const generateHints = (word: string): string[] => {
  return [
    `First letter is '${word[0]}'`,
    `Contains ${new Set(word.split('')).size} unique letters`,
    `Last letter is '${word[word.length - 1]}'`,
    `It has ${word.length} letters`,
    `It's related to programming/technology`,
    `Contains the letter '${word[Math.floor(word.length / 2)]}'`
  ];
};

export const checkGuess = (guess: string, word: string): Letter[] => {
  const result: Letter[] = [];
  const wordArray = word.split('');
  
  guess.split('').forEach((char, i) => {
    if (char === wordArray[i]) {
      result.push({ char, status: 'correct' });
    } else if (wordArray.includes(char)) {
      result.push({ char, status: 'present' });
    } else {
      result.push({ char, status: 'absent' });
    }
  });
  
  return result;
};

export const getAvailableHints = (word: string, guesses: string[]): string[] => {
  const allHints = generateHints(word);
  const correctLetters = new Set<string>();
  
  guesses.forEach(guess => {
    guess.split('').forEach((char, i) => {
      if (char === word[i]) {
        correctLetters.add(char);
      }
    });
  });

  return allHints.filter(hint => {
    if (hint.includes("First letter") && correctLetters.has(word[0])) {
      return false;
    }
    if (hint.includes("Last letter") && correctLetters.has(word[word.length - 1])) {
      return false;
    }
    if (hint.includes("Contains the letter")) {
      const letterMatch = hint.match(/'(.)'$/);
      if (letterMatch && correctLetters.has(letterMatch[1])) {
        return false;
      }
    }
    return true;
  });
};