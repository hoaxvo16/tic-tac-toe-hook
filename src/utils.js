export function calculateWinner(matrix, row, col) {
   let winLen = 3;
   if (matrix[0].length >= 5 && matrix.length >= 5) {
      winLen = 5;
   }

   const res =
      checkCol(matrix, winLen, row, col) ||
      checkRow(matrix, winLen, row, col) ||
      checkMainDiagonal(matrix, winLen, row, col) ||
      checkAuxiliaryDiagonal(matrix, winLen, row, col) ||
      null;

   return res;
}

export function checkDraw(matrix) {
   for (let i = 0; i < matrix.length; i++) {
      for (let j = i; j < matrix[i].length; j++) {
         if (matrix[i][j] === null) {
            return false;
         }
      }
   }
   return true;
}

export function getNewState(state, row, col) {
   if (state.isAscending) {
      const history = state.history.slice(0, state.stepNumber + 1);
      const current = history[history.length - 1];
      const matrix = copyMatrix(current.matrix);

      if (matrix[row][col]) {
         return null;
      }

      matrix[row][col] = state.xIsNext ? 'X' : 'O';

      return {
         history: [
            ...history,
            {
               matrix: matrix,
               position: { col: col, row: row },
               move: current.move + 1,
            },
         ],
         stepNumber: history.length,
         xIsNext: !state.xIsNext,
      };
   } else {
      const history = state.history.slice(
         state.history.length - state.stepNumber - 1,
         state.history.length
      );
      const current = history[0];
      const matrix = copyMatrix(current.matrix);

      if (matrix[row][col]) {
         return null;
      }
      matrix[row][col] = state.xIsNext ? 'X' : 'O';
      return {
         history: [
            {
               matrix: matrix,
               position: { col: col, row: row },
               move: current.move + 1,
            },
            ...history,
         ],
         stepNumber: history.length,
         xIsNext: !state.xIsNext,
      };
   }
}

function checkRow(matrix, winLen, row, col) {
   if (row !== null && col !== null) {
      let value = matrix[row][col];
      if (value === null) {
         return null;
      }
      let result = [];

      for (let i = 0; i < matrix[0].length; i++) {
         if (matrix[row][i] === value) {
            result.push({
               row: row,
               col: i,
            });
         } else {
            if (
               result.length >= winLen &&
               !checkBlockRow(
                  matrix,
                  result[0].col,
                  result[result.length - 1].col,
                  row
               )
            ) {
               return { position: result, player: value };
            }
            result = [];
         }
      }
      if (result.length >= winLen) {
         return { position: result, player: value };
      }
   }

   return null;
}

function checkCol(matrix, winLen, row, col) {
   if (row !== null && col !== null) {
      let value = matrix[row][col];
      if (value === null) {
         return null;
      }

      let result = [];
      for (let i = 0; i < matrix.length; i++) {
         if (matrix[i][col] === value) {
            result.push({
               row: i,
               col: col,
            });
         } else {
            if (
               result.length >= winLen &&
               !checkBlockCol(
                  matrix,
                  result[0].row,
                  result[result.length - 1].row,
                  col
               )
            ) {
               return { position: result, player: value };
            }
            result = [];
         }
      }
      if (result.length >= winLen) {
         return { position: result, player: value };
      }
   }
   return null;
}

function checkMainDiagonal(matrix, winLen, row, col) {
   if (row !== null && col !== null) {
      let startRow = row;
      let startCol = col;
      while (startRow && startCol) {
         startRow--;
         startCol--;
      }

      let value = matrix[row][col];
      if (value === null) {
         return null;
      }

      let result = [];

      while (startRow < matrix.length) {
         if (matrix[startRow][startCol] === value) {
            result.push({
               row: startRow,
               col: startCol,
            });
         } else {
            let idx = result.length - 1;

            if (
               result.length >= winLen &&
               !checkBlockDiagonal(
                  matrix,
                  result[0].row,
                  result[idx].row,
                  result[0].col,
                  result[idx].col,
                  true
               )
            ) {
               return { position: result, player: value };
            }
            result = [];
         }
         startRow++;
         startCol++;
      }

      if (result.length >= winLen) {
         return { position: result, player: value };
      }
      return null;
   }
   return null;
}

function checkAuxiliaryDiagonal(matrix, winLen, row, col) {
   if (row !== null && col !== null) {
      let startRow = row;
      let startCol = col;
      while (startRow < matrix.length - 1 && startCol) {
         startRow++;
         startCol--;
      }
      let value = matrix[row][col];
      if (value === null) {
         return null;
      }
      let result = [];

      while (startRow >= 0) {
         if (matrix[startRow][startCol] === value) {
            result.push({
               row: startRow,
               col: startCol,
            });
         } else {
            const idx = result.length - 1;
            if (
               result.length >= winLen &&
               !checkBlockDiagonal(
                  matrix,
                  result[0].row,
                  result[idx].row,
                  result[0].col,
                  result[idx].col,
                  false
               )
            ) {
               return { position: result, player: value };
            }
            result = [];
         }
         startRow--;
         startCol++;
      }
      if (result.length >= winLen) {
         return { position: result, player: value };
      }
      return null;
   }
   return null;
}

function checkBlockRow(matrix, startCol, endCol, row) {
   return matrix[row][startCol - 1] && matrix[row][endCol + 1];
}

function checkBlockCol(matrix, startRow, endRow, col) {
   if (startRow) {
      return matrix[startRow - 1][col] && matrix[endRow + 1][col];
   }
   return false;
}

function checkBlockDiagonal(
   matrix,
   startRow,
   endRow,
   startCol,
   endCol,
   isMain
) {
   if (startCol && startRow) {
      if (isMain) {
         return (
            matrix[startRow - 1][startCol - 1] && matrix[endRow + 1][endCol + 1]
         );
      } else
         return (
            matrix[startRow + 1][startCol - 1] && matrix[endRow - 1][endCol + 1]
         );
   }
   return false;
}

function copyMatrix(oldMatrix) {
   let matrix = [];
   for (let i = 0; i < oldMatrix.length; i++) {
      matrix.push(oldMatrix[i].slice());
   }
   return matrix;
}
