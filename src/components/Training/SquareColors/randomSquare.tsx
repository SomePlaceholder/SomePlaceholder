import type { Square } from '../../../Chess';

import {
  SquareColorDataOrdered,
  transformSquareColorData,
} from '../../Firebase';

export interface randomSquareSettings {
  userId: string;
  settings: fromDataSettings;
}

export interface fromDataSettings {
  amount?: number;
  targetTime?: number;
  numGames?: number;
  mistakesWeight?: number;
  timeWeight?: number;
}

export const defaultFromDataSettings = {
  amount: 50,
  numGames: 10,
  targetTime: 3,
  mistakesWeight: 1,
  timeWeight: 0.5,
};

export function randomSquare(
  amount: number,
  // eslint-disable-next-line no-unused-vars
  callback: (arg0: Square[]) => void,
  settings?: randomSquareSettings,
) {
  if (settings) {
    getFromData(settings.userId, amount, settings.settings).then((resolved) => {
      callback(resolved);
    });
  } else {
    callback(randomArray(amount));
  }
}

function randomArray(amount: number) {
  const randomSquares: Square[] = [];
  randomSquares[0] = random();
  for (let i = 1; i < amount; i += 1) {
    let randomSq = random();
    while (randomSq === randomSquares[i - 1]) {
      randomSq = random();
    }
    randomSquares[i] = randomSq;
  }

  return randomSquares;
}

function random(): Square {
  return {
    x: Math.floor(Math.random() * 8) + 1,
    y: Math.floor(Math.random() * 8) + 1,
  };
}

/* 
    Normal Squares: 48 Indexes  - Weighted Squares: min(48, mistakes+timeMistakes) Indexes
*/

async function getFromData(
  userId: string,
  amount: number,
  settings: fromDataSettings,
) {
  const numGames = settings.numGames
    ? settings.numGames
    : defaultFromDataSettings.numGames;
  const targetTime = settings.targetTime
    ? settings.targetTime
    : defaultFromDataSettings.targetTime;

  const dataRef = SquareColorDataOrdered(userId).limitToLast(numGames);
  const dataSnapshot = await dataRef.once('value');
  const data = transformSquareColorData(dataSnapshot)[0].map(
    (dataAll) => dataAll.answers,
  );

  const squaresOverTime: Square[] = [];
  const squaresWrong: Square[] = [];

  data.forEach((walkthrough) =>
    walkthrough.forEach((entry) => {
      if (!entry.answer) {
        squaresWrong.push(entry.square);
      } else if (entry.time > targetTime) {
        squaresOverTime.push(entry.square);
      }
    }),
  );

  const randomSquares: Square[] = [];
  randomSquares[0] = getFromDataSingle(squaresOverTime, squaresWrong);
  for (let i = 1; i < amount; i += 1) {
    let randomSq = getFromDataSingle(squaresOverTime, squaresWrong);
    while (randomSq === randomSquares[i - 1]) {
      randomSq = getFromDataSingle(squaresOverTime, squaresWrong);
    }
    randomSquares[i] = randomSq;
  }
  return randomSquares;
}

function getFromDataSingle(squaresOverTime: Square[], squaresWrong: Square[]) {
  const card = Math.min(48, squaresOverTime.length + squaresWrong.length);
  const randomNum = Math.floor(Math.random() * card);
  if (randomNum < 48) {
    return random();
  }

  const randomOtherNum = Math.floor(
    Math.random() * squaresOverTime.length + squaresWrong.length,
  );
  if (randomOtherNum < squaresOverTime.length) {
    return squaresOverTime[randomOtherNum];
  }
  return squaresWrong[randomOtherNum - squaresOverTime.length];
}
