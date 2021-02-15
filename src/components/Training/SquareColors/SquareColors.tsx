import React, { useState } from 'react';
import { randomSquare } from '../../../Chess';
import type { Square } from '../../../Chess';
import { Header } from './Header';
import { FinishScreen } from './FinishScreen';
import { AnswerScreen } from './AnswerScreen';
import { SquareColorDialog } from './SquareColorDialog';

export interface SquareColorData {
  amount: number;
  correct: number;
  wrong: number;
}

interface SquareProps {
  amount: number;
}

export const SquareColors: React.FC<SquareProps> = (props: SquareProps) => {
  const { amount } = props;
  const [times, setTimes] = useState<number[]>([]);
  const [count, setCount] = useState(1);
  const [show, setShow] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finish, setFinish] = useState(false);
  const [correct, setCorrect] = useState(0);

  const getRandomSquares = () => {
    const ranSquares = [];
    for (let i = 0; i < amount; i += 1) {
      ranSquares[i] = randomSquare();
    }
    return ranSquares;
  };

  const [squares, setSquares] = useState<Square[]>(getRandomSquares());

  const restart = () => {
    setSquares(getRandomSquares());
    setTimes([]);
    setAnswers([]);
    setCount(1);
    setCorrect(0);
    setShow(false);
    setFinish(false);
  };

  const increase = () => {
    setShow(false);
    if (count < amount) {
      setCount(count + 1);
    } else {
      setFinish(true);
    }
  };

  if (!finish) {
    return (
      <div>
        <Header amount={amount} count={count} show={show} correct={correct} />
        {!show ? (
          <SquareColorDialog
            amount={amount}
            square={squares[count - 1]}
            answerCallback={(answer, time) => {
              setTimes((timeArray) => [...timeArray, time]);
              setAnswers((answerArray) => [...answerArray, answer]);
              if (answer) {
                setCorrect(correct + 1);
              }
              setShow(true);
            }}
          />
        ) : (
          <AnswerScreen
            square={squares[count - 1]}
            answer={answers[count - 1]}
            nextCallback={() => {
              increase();
              setShow(false);
            }}
          />
        )}
      </div>
    );
  }
  return (
    <FinishScreen
      amount={amount}
      squares={squares}
      times={times}
      answers={answers}
      restartCallback={restart}
    />
  );
};
