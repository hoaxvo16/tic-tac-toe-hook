import { useRef, useEffect } from 'react';

export default function Moves({ onJump, currentStep, history, isAscending }) {
   const bottomRef = useRef();
   const topRef = useRef();
   useEffect(() => {
      if (isAscending) {
         bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
         topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [history, isAscending]);

   const moves = history.map(step => {
      const desc = step.move ? 'Go to move #' + step.move : 'Go to game start';
      return (
         <div
            className={step.move === currentStep ? 'current-move' : 'move-item'}
            key={step.move}
            onClick={() => onJump(step.move)}
         >
            {step.position.col !== null && (
               <div>
                  <span>{step.move % 2 === 0 ? 'Player: O' : 'Player: X'}</span>
                  <p>
                     col:{step.position.col + 1} row:{step.position.row + 1}
                  </p>
               </div>
            )}
            <button>
               <span>{desc}</span>
            </button>
         </div>
      );
   });
   return (
      <>
         <div ref={topRef}></div>
         {moves}
         <div ref={bottomRef}></div>
      </>
   );
}
