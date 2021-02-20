import { convertToAlgebra } from '../../../Chess';

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
  callback: (arg0: Square[], arg1: AddInfo) => void,
  settings?: randomSquareSettings,
) {
  if (settings) {
    getFromData(settings.userId, amount, settings.settings).then((resolved) => {
      callback(resolved.squares, resolved.addData);
    });
  } else {
    const squares = randomArray(amount);
    const addData = AddFromRandom(squares);
    callback(squares, addData);
  }
}

function randomArray(amount: number) {
  const randomSquares: Square[] = [];
  randomSquares[0] = random();
  for (let i = 1; i < amount; i += 1) {
    let randomSq = random();
    while (
      randomSq.x === randomSquares[i - 1].x &&
      randomSq.y === randomSquares[i - 1].y
    ) {
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
  const timeWeight = settings.timeWeight
    ? settings.timeWeight
    : defaultFromDataSettings.timeWeight;
  const mistakesWeight = settings.mistakesWeight
    ? settings.mistakesWeight
    : defaultFromDataSettings.mistakesWeight;

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
  randomSquares[0] = getFromDataSingle(
    squaresOverTime,
    squaresWrong,
    timeWeight,
    mistakesWeight,
  );
  for (let i = 1; i < amount; i += 1) {
    let randomSq = getFromDataSingle(
      squaresOverTime,
      squaresWrong,
      timeWeight,
      mistakesWeight,
    );
    while (
      randomSq.x === randomSquares[i - 1].x &&
      randomSq.y === randomSquares[i - 1].y
    ) {
      randomSq = getFromDataSingle(
        squaresOverTime,
        squaresWrong,
        timeWeight,
        mistakesWeight,
      );
    }
    randomSquares[i] = randomSq;
  }

  const addData = AddFromData(
    randomSquares,
    squaresOverTime,
    squaresWrong,
    timeWeight,
    mistakesWeight,
  );
  return { squares: randomSquares, addData };
}

function getFromDataSingle(
  squaresOverTime: Square[],
  squaresWrong: Square[],
  timeWeight: number,
  mistakesWeight: number,
) {
  const card = 48 + Math.min(48, squaresOverTime.length + squaresWrong.length);
  const randomNum = Math.floor(Math.random() * card);
  if (randomNum < 48) {
    return random();
  }
  const randomOtherNum =
    Math.random() *
    (squaresOverTime.length * timeWeight +
      squaresWrong.length * mistakesWeight);
  if (randomOtherNum < squaresOverTime.length * timeWeight) {
    return squaresOverTime[Math.floor(randomOtherNum / timeWeight)];
  }
  return squaresWrong[
    Math.floor(
      (randomOtherNum - squaresOverTime.length * timeWeight) / mistakesWeight,
    )
  ];
}

export interface AddSquareInfo {
  chance: number;
  wrongSquares: number;
  timeSquares: number;
}

export interface AddInfo {
  [key: string]: AddSquareInfo;
}

function AddFromRandom(squares: Square[]) {
  const AddReturnInfo: AddInfo = {};
  squares.forEach((square) => {
    const algebraSquare = convertToAlgebra(square);
    if (!Object.prototype.hasOwnProperty.call(AddReturnInfo, algebraSquare)) {
      const infoData = { chance: 1 / 48, wrongSquares: 0, timeSquares: 0 };
      AddReturnInfo[algebraSquare] = infoData;
    }
  });

  return AddReturnInfo;
}

function AddFromData(
  squares: Square[],
  squaresOverTime: Square[],
  squaresWrong: Square[],
  timeWeight: number,
  mistakesWeight: number,
) {
  const AddReturnInfo: AddInfo = {};
  const otherCard = squaresOverTime.length + squaresWrong.length;
  const chanceOther = Math.min(48, otherCard) / (Math.min(48, otherCard) + 48);
  const otherCardWeighted =
    squaresOverTime.length * timeWeight + squaresWrong.length * mistakesWeight;

  squaresOverTime.forEach((square) => {
    const algebraSquare = convertToAlgebra(square);
    if (!Object.prototype.hasOwnProperty.call(AddReturnInfo, algebraSquare)) {
      const infoData = { chance: -1, wrongSquares: 0, timeSquares: 1 };
      AddReturnInfo[algebraSquare] = infoData;
    } else {
      AddReturnInfo[algebraSquare].timeSquares += 1;
    }
  });

  squaresWrong.forEach((square) => {
    const algebraSquare = convertToAlgebra(square);
    if (!Object.prototype.hasOwnProperty.call(AddReturnInfo, algebraSquare)) {
      const infoData = { chance: -1, wrongSquares: 1, timeSquares: 0 };
      AddReturnInfo[algebraSquare] = infoData;
    } else {
      AddReturnInfo[algebraSquare].wrongSquares += 1;
    }
  });

  Object.keys(AddReturnInfo).forEach((property) => {
    AddReturnInfo[property].chance =
      (1 - chanceOther) * (1 / 48) +
      chanceOther *
        ((AddReturnInfo[property].timeSquares * timeWeight +
          AddReturnInfo[property].wrongSquares * mistakesWeight) /
          otherCardWeighted);
  });

  squares.forEach((square) => {
    const algebraSquare = convertToAlgebra(square);
    if (!Object.prototype.hasOwnProperty.call(AddReturnInfo, algebraSquare)) {
      const infoData = {
        chance: (1 - chanceOther) * (1 / 48),
        wrongSquares: 0,
        timeSquares: 0,
      };
      AddReturnInfo[algebraSquare] = infoData;
    }
  });

  AddReturnInfo.general = {
    chance: chanceOther,
    wrongSquares: squaresWrong.length,
    timeSquares: squaresOverTime.length,
  };

  return AddReturnInfo;
}
