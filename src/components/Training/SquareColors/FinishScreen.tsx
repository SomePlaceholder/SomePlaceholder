import React, { useEffect, ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth, putSquareColorData } from '../../Firebase';
import type { Square } from '../../../Chess';
import { convertToAlgebra } from '../../../Chess';
import { TimeChart } from '../Charts';

import styles from './SquareColors.module.css';

export interface FinishScreenProps {
  amount: number;
  squares: Square[];
  times: number[];
  answers: boolean[];
  restartCallback: () => void;
}

export const FinishScreen: React.FC<FinishScreenProps> = (
  props,
): ReactElement => {
  const { amount, squares, times, answers, restartCallback } = props;
  const { currentUser } = useAuth();
  const data = [];
  for (let i = 0; i < amount; i += 1) {
    data[i] = { x: convertToAlgebra(squares[i]), time: times[i] };
  }

  const dataRightAnswers = [];
  const dataWrongAnswers = [];

  let dataRightIndex = 0;
  let dataWrongIndex = 0;
  for (let i = 0; i < amount; i += 1) {
    if (answers[i] === true) {
      dataRightAnswers[dataRightIndex] = {
        x: convertToAlgebra(squares[i]),
        time: times[i],
      };
      dataRightIndex += 1;
    } else {
      dataWrongAnswers[dataWrongIndex] = {
        x: convertToAlgebra(squares[i]),
        time: times[i],
      };
      dataWrongIndex += 1;
    }
  }
  useEffect(() => {
    if (currentUser) {
      putSquareColorData(currentUser.uid, {
        amount,
        correct: dataRightIndex,
        wrong: dataWrongIndex,
      });
    }
  }, [amount, currentUser, dataRightIndex, dataWrongIndex]);

  return (
    <div className={styles.FinishScreen}>
      <div className={styles.FinishText}>
        <div>
          You got <span style={{ color: 'white' }}>{dataRightIndex}</span>{' '}
          correct Answers from a total of{' '}
          <span style={{ color: 'white' }}>{amount}</span> Questions.
        </div>
        <div>
          You got{' '}
          <span style={{ color: '#7FFF00' }}>
            {' '}
            {Math.round((dataRightIndex / amount) * 100)}%
          </span>{' '}
          correct.
        </div>
      </div>
      <div className={styles.ButtonContainer}>
        <Button
          variant="primary"
          onClick={restartCallback}
          className={styles.FinishRestart}
        >
          Restart?
        </Button>
      </div>

      <div className={styles.GraphAll}>
        <div className={styles.GraphText} style={{ color: 'white' }}>
          All Stats:{' '}
        </div>
        <TimeChart data={data} color="#8884d8" fill="#8884d8" />
        <div className={styles.GraphText} style={{ color: '#7FFF00' }}>
          Right Answers:
        </div>
        <TimeChart data={dataRightAnswers} color="#7FFF00" fill="#7FFF00" />
        <div className={styles.GraphText} style={{ color: '#DC143C' }}>
          Wrong answers:
        </div>
        <TimeChart data={dataWrongAnswers} color="#DC143C" fill="#DC143C" />
      </div>
    </div>
  );
};
