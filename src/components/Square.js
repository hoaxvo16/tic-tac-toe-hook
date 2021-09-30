export default function Square({ value, onClick, winPosition, col, row }) {
   const isWinSquare = winPosition.find(
      item => item.col === col && item.row === row
   );
   return (
      <button
         className={isWinSquare ? 'square-win' : 'square'}
         onClick={onClick}
      >
         {value}
      </button>
   );
}
