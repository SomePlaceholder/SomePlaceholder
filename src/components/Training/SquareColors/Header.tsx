import React, { ReactElement } from 'react';

import styles from './SquareColors.module.css';

interface HeaderProps {
  amount: number;
  count: number;
  correct: number;
  show: boolean;
}

export const Header: React.FC<HeaderProps> = (props): ReactElement => {
  const { amount, count, correct, show } = props;
  return (
    <div className={styles.HeadText}>
      <span>
        Question: {count}/{amount}{' '}
        <span style={{ color: '#7FFF00' }}>Correct: </span>
        {correct}/{show ? count : count - 1}
      </span>
    </div>
  );
};
