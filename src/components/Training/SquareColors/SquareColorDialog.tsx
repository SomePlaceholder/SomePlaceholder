import React, { ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import type { Square } from '../../../Chess';
import { convertToAlgebra, whiteColorSquare } from '../../../Chess';

import styles from './SquareColors.module.css';

interface DialogProps {
  amount: number;
  square: Square;
  // eslint-disable-next-line no-unused-vars
  answerCallback: (arg0: boolean, arg1: number) => void;
}

export class SquareColorDialog extends React.Component<DialogProps> {
  private time: number;

  private currTimer: number;

  private currIntervalId: any;

  constructor(props: DialogProps) {
    super(props);

    this.buttonColor = this.buttonColor.bind(this);

    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.timerStart = this.timerStart.bind(this);
    this.timerStop = this.timerStop.bind(this);

    this.currTimer = 0;
    this.time = 0;
    this.timerStart();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
    clearInterval(this.currIntervalId);
  }

  handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      this.buttonColor(true);
    } else if (event.key === 'ArrowRight') {
      this.buttonColor(false);
    }
  };

  timerStart = () => {
    this.currIntervalId = setInterval(() => {
      this.currTimer += 100;
    }, 100);
  };

  timerStop = () => {
    clearInterval(this.currIntervalId);
    this.time = this.currTimer / 1000;
  };

  buttonColor = (colorWhite: boolean) => {
    const { square, answerCallback } = this.props;
    this.timerStop();
    const whiteSquare = whiteColorSquare(square);
    if (whiteSquare === colorWhite || !whiteSquare === !colorWhite) {
      answerCallback(true, this.time);
    } else {
      answerCallback(false, this.time);
    }
  };

  render() {
    const { square } = this.props;
    const AnswerButtons: React.FC = (): ReactElement => {
      return (
        <div className={styles.FooterColorButtons}>
          <Button
            className={styles.colorButton}
            onClick={() => this.buttonColor(true)}
          >
            White
          </Button>
          <Button
            className={styles.colorButton}
            onClick={() => this.buttonColor(false)}
          >
            Black
          </Button>
        </div>
      );
    };

    return (
      <div>
        <div className={styles.CurrentSquare}>{convertToAlgebra(square)}</div>
        <AnswerButtons />
      </div>
    );
  }
}
