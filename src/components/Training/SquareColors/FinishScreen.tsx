import React, { useEffect, ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import {
  useAuth,
  SquareColorMetaRef,
  SquareColorDataRefFromKey,
  putSquareColorMetaData,
  putSquareColorData,
} from '../../Firebase';
import { convertToAlgebra } from '../../../Chess';
import { TimeChart } from '../Charts';

import { answerData } from './SquareColors';

import styles from './SquareColors.module.css';

export interface FinishScreenProps {
  amount: number;
  answers: answerData[];
  restartCallback: () => void;
}

export const FinishScreen: React.FC<FinishScreenProps> = (
  props,
): ReactElement => {
  const { amount, answers, restartCallback } = props;
  const { currentUser } = useAuth();
  const data = [];

  for (let i = 0; i < amount; i += 1) {
    data[i] = { x: convertToAlgebra(answers[i].square), time: answers[i].time };
  }

  const dataRightAnswers = [];
  const dataWrongAnswers = [];

  let dataRightIndex = 0;
  let dataWrongIndex = 0;

  let avgTimeCorrect = 0;
  let avgTimeWrong = 0;
  for (let i = 0; i < amount; i += 1) {
    if (answers[i].answer === true) {
      dataRightAnswers[dataRightIndex] = {
        x: convertToAlgebra(answers[i].square),
        time: answers[i].time,
      };
      dataRightIndex += 1;
      avgTimeCorrect += answers[i].time;
    } else {
      dataWrongAnswers[dataWrongIndex] = {
        x: convertToAlgebra(answers[i].square),
        time: answers[i].time,
      };
      dataWrongIndex += 1;
      avgTimeWrong += answers[i].time;
    }
  }
  avgTimeCorrect = dataRightIndex === 0 ? -1 : avgTimeCorrect / dataRightIndex;
  avgTimeWrong = dataWrongIndex === 0 ? -1 : avgTimeWrong / dataWrongIndex;

  useEffect(() => {
    if (currentUser) {
      const metaRef = SquareColorMetaRef(currentUser.uid);
      const key = putSquareColorMetaData(metaRef, {
        amount,
        correct: dataRightIndex,
        avgTimeCorrect,
        avgTimeWrong,
        timestamp: -1,
      });
      const dataRef = SquareColorDataRefFromKey(currentUser.uid, key);
      putSquareColorData(dataRef, { timestamp: -1, answers });
    }
  }, [
    amount,
    currentUser,
    dataRightIndex,
    dataWrongIndex,
    avgTimeCorrect,
    avgTimeWrong,
    answers,
  ]);

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
