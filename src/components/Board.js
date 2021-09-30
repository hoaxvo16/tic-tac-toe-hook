import React from 'react';
import Square from './Square';

export default function Board({ winPosition, onClick, matrix }) {
   return (
      <div>
         {matrix.map((array, row) => {
            return (
               <div key={row} className="board-row">
                  {array.map((value, col) => {
                     return (
                        <Square
                           key={col}
                           row={row}
                           col={col}
                           value={value}
                           winPosition={winPosition}
                           onClick={() => onClick(row, col)}
                        />
                     );
                  })}
               </div>
            );
         })}
      </div>
   );
}
