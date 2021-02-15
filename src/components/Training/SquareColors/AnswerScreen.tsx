import React from 'react';
import { Button } from 'react-bootstrap';
import ChessboardJs from 'react-chessboardjs-wrapper';
import styles from './SquareColors.module.css';
import type { Square } from '../../../Chess';
import { convertToAlgebra, whiteColorSquare } from '../../../Chess';

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
    const { answer, square, nextCallback } = this.props;
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
      </div>
    );
  }
}
