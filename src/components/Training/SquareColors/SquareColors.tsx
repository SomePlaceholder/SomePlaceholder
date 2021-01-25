import React, { ReactElement } from 'react';
import ChessboardJs from 'react-chessboardjs-wrapper';
import { Button } from 'react-bootstrap';
import {
  convertToAlgebra,
  whiteColorSquare,
  randomSquare,
} from '../../../Chess';
import type { Square } from '../../../Chess';
import styles from './SquareColors.module.css';
import { NavbarMod } from '../../layout';
import { TimeChart } from '../Charts';

const wK = 'wK';
const bK = 'bK';
const pieceTheme = './chesspieces/{piece}.png';

interface SquareProps {
  amount: number;
}

interface SquareState {
  show: boolean;
  finish: boolean;
  count: number;
  correct: number;
  currCorrect: boolean;
}

export class SquareColors extends React.Component<SquareProps, SquareState> {
  private amount: number;

  private squares: Square[];

  private times: number[];

  private answers: boolean[];

  private currTimer: number;

  private currIntervalId: any;

  constructor(props: SquareProps) {
    super(props);

    this.amount = props.amount;
    this.squares = Array<Square>(this.amount);
    this.answers = Array<boolean>(this.amount);
    this.times = Array<number>(this.amount);
    for (let i = 0; i < this.amount; i += 1) {
      this.squares[i] = randomSquare();
      this.times[i] = -1;
    }

    this.state = {
      show: false,
      finish: false,
      count: 1,
      correct: 0,
      currCorrect: false,
    };

    this.increase = this.increase.bind(this);
    this.buttonColor = this.buttonColor.bind(this);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.resetState = this.resetState.bind(this);

    this.render = this.render.bind(this);

    this.timerStart = this.timerStart.bind(this);
    this.timerStop = this.timerStop.bind(this);

    this.currTimer = 0;
    this.timerStart();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
    clearInterval(this.currIntervalId);
  }

  timerStart = () => {
    this.currTimer = 0;
    this.currIntervalId = setInterval(() => {
      this.currTimer += 100;
    }, 100);
  };

  timerStop = () => {
    const { count } = this.state;
    clearInterval(this.currIntervalId);
    this.times[count - 1] = this.currTimer / 1000;
  };

  increase = () => {
    const { count, show } = this.state;
    if (count < this.amount) {
      this.setState({ show: !show, count: count + 1 });
      this.timerStart();
    } else {
      this.setState({ finish: true });
    }
  };

  getConfig = (square: Square) => {
    const algebraic = convertToAlgebra(square);
    const position: { [key: string]: string } = {};
    position[algebraic] = whiteColorSquare(square) ? wK : bK;
    const config = { position, pieceTheme };

    return config;
  };

  buttonColor = (colorWhite: boolean) => {
    const { count, correct } = this.state;
    const whiteSquare = whiteColorSquare(this.squares[count - 1]);
    if (whiteSquare === colorWhite || !whiteSquare === !colorWhite) {
      this.setState({ correct: correct + 1, show: true, currCorrect: true });
      this.answers[count - 1] = true;
    } else {
      this.setState({ show: true, currCorrect: false });
      this.answers[count - 1] = false;
    }

    this.timerStop();
  };

  handleKeyPress = (event: KeyboardEvent) => {
    const { show } = this.state;

    if (show === false) {
      if (event.key === 'ArrowLeft') {
        this.buttonColor(true);
      } else if (event.key === 'ArrowRight') {
        this.buttonColor(false);
      }
    } else {
      this.increase();
    }
  };

  resetState = () => {
    for (let i = 0; i < this.amount; i += 1) {
      this.squares[i] = randomSquare();
    }

    this.setState({
      show: false,
      finish: false,
      count: 1,
      correct: 0,
      currCorrect: false,
    });

    this.timerStart();
  };

  render() {
    const { correct, count, show, currCorrect, finish } = this.state;

    const HeaderStats: React.FC = (): ReactElement => {
      return (
        <div className={styles.HeadText}>
          <span>
            Question: {count}/{this.amount}{' '}
            <span style={{ color: '#7FFF00' }}>Correct: </span>
            {correct}/{show ? count : count - 1}
          </span>
        </div>
      );
    };

    const CurrSquare: React.FC = (): ReactElement => {
      return (
        <div className={styles.CurrentSquare}>
          {convertToAlgebra(this.squares[count - 1])}
        </div>
      );
    };

    const ChessboardShow: React.FC = (): ReactElement => {
      const config = this.getConfig(this.squares[count - 1]);

      return (
        <div className={styles.ChessboardShow}>
          {currCorrect ? (
            <div className={styles.show}>
              {convertToAlgebra(this.squares[count - 1])}:
              <span style={{ color: '#7FFF00' }}>Correct</span>
            </div>
          ) : (
            <div className={styles.show}>
              {convertToAlgebra(this.squares[count - 1])}:
              <span style={{ color: '#DC143C' }}>Wrong</span>
            </div>
          )}
          <div className={styles.chessboard}>
            <ChessboardJs config={config} />
          </div>

          <Button
            className={styles.ShowButton}
            variant="primary"
            onClick={() => {
              this.increase();
            }}
          >
            Next
          </Button>
        </div>
      );
    };

    const FooterColorChoose: React.FC = (): ReactElement => {
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

    const FinishScreen: React.FC = (): ReactElement => {
      const data = [];
      for (let i = 0; i < this.amount; i += 1) {
        data[i] = { x: convertToAlgebra(this.squares[i]), time: this.times[i] };
      }

      const dataRightAnswers = [];
      const dataWrongAnswers = [];

      let dataRightIndex = 0;
      let dataWrongIndex = 0;
      for (let i = 0; i < this.amount; i += 1) {
        if (this.answers[i] === true) {
          dataRightAnswers[dataRightIndex] = {
            x: convertToAlgebra(this.squares[i]),
            time: this.times[i],
          };
          dataRightIndex += 1;
        } else {
          dataWrongAnswers[dataWrongIndex] = {
            x: convertToAlgebra(this.squares[i]),
            time: this.times[i],
          };
          dataWrongIndex += 1;
        }
      }

      return (
        <div className={styles.FinishScreen}>
          <div className={styles.FinishText}>
            <div>
              You got <span style={{ color: 'white' }}>{correct}</span> correct
              Answers from a total of{' '}
              <span style={{ color: 'white' }}>{this.amount}</span> Questions.
            </div>
            <div>
              You got{' '}
              <span style={{ color: '#7FFF00' }}>
                {' '}
                {Math.round((correct / this.amount) * 100)}%
              </span>{' '}
              correct.
            </div>
          </div>
          <div className={styles.ButtonContainer}>
            <Button
              variant="primary"
              onClick={this.resetState}
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

    if (finish) {
      return (
        <div className={styles.Container}>
          <NavbarMod />
          <FinishScreen />
        </div>
      );
    }

    return (
      <div className={styles.Container}>
        <NavbarMod />
        <HeaderStats />
        {show ? null : <CurrSquare />}
        {show ? <ChessboardShow /> : <FooterColorChoose />}
      </div>
    );
  }
}
