import { useEffect, useState } from 'react';
import { getNewState, checkDraw, calculateWinner } from '../utils';
import Board from './Board';
import Moves from './Moves';

export default function Game() {
   const [history, setHistory] = useState([
      {
         matrix: Array(3).fill(Array(3).fill(null)),
         position: { col: null, row: null },
         move: 0,
      },
   ]);
   const [isFinished, setIsFinished] = useState(false);
   const [winPosition, setWinPosition] = useState([]);
   const [xIsNext, setXIsNext] = useState(true);
   const [stepNumber, setStepNumber] = useState(0);
   const [isAscending, setIsAscending] = useState(true);
   const [winNumber, setWinNumber] = useState(3);

   useEffect(() => {
      const resCol = prompt('Insert matrix column (>=3)', '3');
      const resRow = prompt('Insert matrix row (>=3)', '3');

      let col = parseInt(resCol);
      let row = parseInt(resRow);
      let toWin = 3;
      if (isNaN(col) || col < 3) {
         col = 3;
      }
      if (isNaN(row) || row < 3) {
         row = 3;
      }
      if (row >= 5 && col >= 5) {
         toWin = 5;
      }

      setWinNumber(toWin);
      setHistory([
         {
            matrix: Array(row).fill(Array(col).fill(null)),
            position: { col: null, row: null },
            move: 0,
         },
      ]);
   }, []);

   useEffect(() => {
      let idx = isAscending ? stepNumber : history.length - stepNumber - 1;
      const current = history[idx];
      const winnerInfo = calculateWinner(
         current.matrix,
         current.position.row,
         current.position.col
      );
      if (winnerInfo && !isFinished) {
         setWinPosition(winnerInfo.position);
         setIsFinished(true);
      }
   }, [history, isAscending, isFinished, stepNumber]);

   const handleClick = (row, col) => {
      if (!isFinished) {
         const state = {
            history: history,
            xIsNext: xIsNext,
            isAscending: isAscending,
            stepNumber: stepNumber,
         };
         const newState = getNewState(state, row, col);
         if (newState) {
            setHistory(newState.history);
            setStepNumber(newState.stepNumber);
            setXIsNext(newState.xIsNext);
         }
      }
   };

   const jumpTo = step => {
      setStepNumber(step);
      setIsFinished(false);
      setWinPosition([]);
      setXIsNext(step % 2 === 0);
   };

   const sortAscending = () => {
      const temp = [...history];
      temp.reverse();
      setHistory(temp);
      setIsAscending(true);
   };

   const sortDescending = () => {
      const temp = [...history];
      temp.reverse();
      setHistory(temp);
      setIsAscending(false);
   };

   let idx = isAscending ? stepNumber : history.length - stepNumber - 1;
   const current = history[idx];
   const winnerInfo = calculateWinner(
      current.matrix,
      current.position.row,
      current.position.col
   );
   const draw = checkDraw(current.matrix);

   let status;
   if (winnerInfo) {
      status = 'Winner: ' + winnerInfo.player;
   } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
   }

   if (draw && winnerInfo === null) {
      status = 'Draw!!!';
   }

   return (
      <div className="game">
         <div className="game-board">
            <Board
               matrix={current.matrix}
               winPosition={winPosition}
               onClick={(row, col) => handleClick(row, col)}
            />
         </div>
         <div className="game-info">
            <div>{status}</div>
            <div>{winNumber} To Win</div>
            <div className="button-area">
               {!isAscending ? (
                  <button onClick={() => sortAscending()}>
                     Sort move ascending order
                  </button>
               ) : (
                  <button onClick={() => sortDescending()}>
                     Sort move descending order
                  </button>
               )}
            </div>
            <div className="move">
               <Moves
                  onJump={jumpTo}
                  currentStep={stepNumber}
                  history={history}
                  isAscending={isAscending}
               />
            </div>
         </div>
      </div>
   );
}
