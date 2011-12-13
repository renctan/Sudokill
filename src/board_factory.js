/**
 * Contains the implementation for creating partially filled Sudokill boards.
 */

goog.provide('drecco.sudokill.BoardFactory');

goog.require('drecco.sudokill.Board');
goog.require('drecco.sudokill.Move');
goog.require('drecco.sudokill.RandomStrategy');
goog.require('goog.structs.PriorityQueue');

/**
 * Pre-solved Sudoku boards
 * 
 * @private
 * @constant
 */
var solvedBoard = [
  [
    [3, 5, 7, 8, 4, 1, 2, 6, 9],
    [1, 6, 8, 2, 9, 3, 5, 4, 7],
    [4, 2, 9, 5, 6, 7, 1, 3, 8],
    [8, 9, 2, 3, 5, 6, 4, 7, 1],
    [5, 7, 3, 1, 2, 4, 8, 9, 6],
    [6, 1, 4, 9, 7, 8, 3, 2, 5],
    [2, 8, 1, 7, 3, 9, 6, 5, 4],
    [9, 4, 5, 6, 1, 2, 7, 8, 3],
    [7, 3, 6, 4, 8, 5, 9, 1, 2]
  ],
  [
    [1, 2, 5, 3, 7, 8, 9, 4, 6],
    [3, 7, 8, 9, 6, 4, 2, 1, 5],
    [4, 9, 6, 1, 2, 5, 8, 3, 7],
    [2, 6, 9, 4, 5, 3, 1, 7, 8],
    [8, 4, 1, 7, 9, 2, 6, 5, 3],
    [5, 3, 7, 8, 1, 6, 4, 9, 2],
    [9, 1, 2, 5, 8, 7, 3, 6, 4],
    [6, 5, 3, 2, 4, 9, 7, 8, 1],
    [7, 8, 4, 6, 3, 1, 5, 2, 9]
  ],
  [
    [4, 1, 3, 6, 2, 7, 5, 8, 9],
    [7, 8, 5, 9, 4, 1, 3, 2, 6],
    [2, 9, 6, 5, 3, 8, 4, 1, 7],
    [5, 7, 2, 8, 9, 6, 1, 4, 3],
    [9, 4, 1, 7, 5, 3, 2, 6, 8],
    [6, 3, 8, 4, 1, 2, 7, 9, 5],
    [3, 2, 9, 1, 6, 5, 8, 7, 4],
    [8, 5, 4, 2, 7, 9, 6, 3, 1],
    [1, 6, 7, 3, 8, 4, 9, 5, 2]
  ]
];

/**
 * Creates a new Sudoku board with valid solution. 
 * 
 * @param {number} filledCells The number of cells to be filled.
 * 
 * @return {drecco.sudokill.Board} the generated board.
 * 
 * @throws IllegalArgumentException if filledCells is > 81 or is negative.
 */
drecco.sudokill.BoardFactory.create = function(filledCells) {
  var x, y;
  var moves = new goog.structs.PriorityQueue();
  var board;
  var newBoard;
  var move;

  if (filledCells > 81 || filledCells < 0) {
    throw {
      name: 'IllegalArgumentException',
      message: 'filledCell should be between 0 and 81.'
    };
  }
  
  board = solvedBoard[Math.floor(Math.random() * solvedBoard.length)];
    
  for (x = 0; x < 9; x++) {
    for (y = 0; y < 9; y++) {
      moves.enqueue(Math.random(), new drecco.sudokill.Move(x, y, board[x][y]));
    }
  }
  
  newBoard = new drecco.sudokill.Board();
  for (x = 0; x < filledCells; x++) {
    move = moves.dequeue();
    newBoard.set(move.getX(), move.getY(), move.getN());
  }

  newBoard.forgetLastMove();
  newBoard.clearSteps();

  return newBoard;
};

/**
 * Creates a random Sudoku board by randomly assigning random cells
 * with random numbers. The generated cells will still follow the
 * Sudoku rules, but since it is randomly filling the board, it may
 * never terminate if the given filledCells is too large because the
 * generated partial board may not have a valid solution.
 * 
 * @param {number} filledCells The number of cells to be filled.
 * 
 * @return {drecco.sudokill.Board} the generated board.
 * 
 * @throws IllegalArgumentException if filledCells is > 81 or is negative.
 */
drecco.sudokill.BoardFactory.randBoard = function(filledCells) {
  var x, y, n;
  var board;
  var newBoard = new drecco.sudokill.Board();
  var move;
  var count;

  if (filledCells > 81 || filledCells < 0) {
    throw {
      name: 'IllegalArgumentException',
      message: 'filledCell should be between 0 and 81.'
    };
  }

  for(count = 0; count < filledCells; count++) {
    move = drecco.sudokill.RandomStrategy.makeMove(newBoard);
    newBoard.set(move.getX(), move.getY(), move.getN());
  }

  newBoard.forgetLastMove();
  newBoard.clearSteps();

  return newBoard;
};

