import React, { ReactElement, useState, useEffect } from 'react';
import type firebase from 'firebase';
import {
  useAuth,
  SquareColorMetaOrdered,
  SquareColorMetaData,
  transformSquareColorMetaData,
} from '../../Firebase';

import styles from './SquareColors.module.css';

const StatsElement: React.FC<{ user: firebase.User }> = (
  props,
): ReactElement => {
  const { user } = props;
  const [stats, setStats] = useState<SquareColorMetaData[]>([]);
  useEffect(() => {
    const dataRef = SquareColorMetaOrdered(user.uid).limitToLast(5);
    const listener = dataRef.on('value', (snapshot) => {
      setStats(transformSquareColorMetaData(snapshot)[0]);
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
