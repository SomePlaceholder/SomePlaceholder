import React, { ReactElement, useState, useEffect } from 'react';
import type firebase from 'firebase';
import { db, useAuth } from '../../Firebase';

import styles from './SquareColors.module.css';

interface SquareColorData {
  amount: number;
  correct: number;
  wrong: number;
  timestamp: number;
}

const StatsElement: React.FC<{ user: firebase.User }> = (
  props,
): ReactElement => {
  const { user } = props;
  const [stats, setStats] = useState<SquareColorData[]>([]);
  useEffect(() => {
    const dataRef = db
      .ref(`users/${user.uid}/SquareColors/log`)
      .orderByChild('timestamp')
      .limitToLast(5);
    const listener = dataRef.on('value', (snapshot) => {
      const data: SquareColorData[] = [];
      snapshot.forEach((children) => {
        data.push({
          amount: children.child('amount').val(),
          correct: children.child('correct').val(),
          wrong: children.child('wrong').val(),
          timestamp: children.child('timestamp').val(),
        });
      });
      setStats(data);
    });
    return () => dataRef.off('value', listener);
  }, [user]);

  const dataItems = stats.map((element) => {
    const dateInt = new Date(+element.timestamp);
    return (
      <li className={styles.Statsentry} key={element.timestamp}>
        <span style={{ color: 'white' }}>
          {`${dateInt.getDate()}/${dateInt.getMonth()}/${dateInt.getFullYear()}`}
          :
        </span>
        <span style={{ color: '#7FFF00' }}>
          {Math.round((element.correct / element.amount) * 100)}%
        </span>
        <span style={{ color: 'wheat' }}> Correct</span>
      </li>
    );
  });

  return (
    <div>
      <span className={styles.StatsList}>Latest Entries:</span>
      <ul>{dataItems.reverse()}</ul>
    </div>
  );
};

export const Stats: React.FC = () => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <StatsElement user={currentUser} />;
  }
  return null;
};
