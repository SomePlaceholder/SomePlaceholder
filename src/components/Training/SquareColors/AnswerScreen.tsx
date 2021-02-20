import React from 'react';
import { Button } from 'react-bootstrap';
import ChessboardJs from 'react-chessboardjs-wrapper';
import styles from './SquareColors.module.css';
import type { Square } from '../../../Chess';
import { convertToAlgebra, whiteColorSquare } from '../../../Chess';

import type { AddSquareInfo } from './randomSquare';

const wK = 'wK';
const bK = 'bK';
const pieceTheme = './chesspieces/{piece}.png';

const getConfig = (square: Square) => {
  const algebraic = convertToAlgebra(square);
  const position: { [key: string]: string } = {};
  position[algebraic] = whiteColorSquare(square) ? wK : bK;
  const config = { position, pieceTheme };

  return config;
};

interface AnswerScreenProps {
  answer: boolean;
  square: Square;
  nextCallback: () => void;
  addInfo: {
    info: AddSquareInfo;
    general: AddSquareInfo;
    weights?: { time: number; mistake: number };
  };
}

export class AnswerScreen extends React.Component<AnswerScreenProps> {
  constructor(props: AnswerScreenProps) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = (event: KeyboardEvent) => {
    const { nextCallback } = this.props;
    if (event.key === ' ') {
      nextCallback();
    }
  };

  render() {
    const { answer, square, nextCallback, addInfo } = this.props;
    const config = getConfig(square);
    return (
      <div className={styles.ChessboardShow}>
        {answer ? (
          <div className={styles.show}>
            {convertToAlgebra(square)}:
            <span style={{ color: '#7FFF00' }}>Correct</span>
          </div>
        ) : (
          <div className={styles.show}>
            {convertToAlgebra(square)}:
            <span style={{ color: '#DC143C' }}>Wrong</span>
          </div>
        )}
        <div className={styles.chessboard}>
          <ChessboardJs config={config} />
        </div>

        <Button
          className={styles.ShowButton}
          variant="primary"
          onClick={nextCallback}
        >
          Next
        </Button>
        {addInfo ? (
          <>
            <div className={styles.AddInfo}>
              <div>Chance: {Math.floor(addInfo.info.chance * 1000) / 10}%</div>{' '}
              From OverTime: {addInfo.info.timeSquares} Wrong:{' '}
              {addInfo.info.wrongSquares}
              <div>
                Total OverTime: {addInfo.general.timeSquares} Total wrong:{' '}
                {addInfo.general.wrongSquares}
              </div>
              <div>
                Chance of Other:{' '}
                {Math.floor(addInfo.general.chance * 1000) / 10}%
                {addInfo.weights ? (
                  <>
                    <div>
                      Chance of OverTime:{' '}
                      {addInfo.general.timeSquares === 0
                        ? 0
                        : Math.floor(
                            ((addInfo.general.timeSquares *
                              addInfo.weights.time) /
                              (addInfo.general.timeSquares *
                                addInfo.weights.time +
                                addInfo.general.wrongSquares *
                                  addInfo.weights.mistake)) *
                              1000,
                          ) / 10}{' '}
                      %
                    </div>
                    <div>
                      Chance of Mistake:{' '}
                      {addInfo.general.wrongSquares === 0
                        ? 0
                        : Math.floor(
                            ((addInfo.general.wrongSquares *
                              addInfo.weights.mistake) /
                              (addInfo.general.timeSquares *
                                addInfo.weights.time +
                                addInfo.general.wrongSquares *
                                  addInfo.weights.mistake)) *
                              1000,
                          ) / 10}{' '}
                      %
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}
