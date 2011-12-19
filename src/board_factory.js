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
 * @type {Array.<Array.<number>>}
 */
drecco.sudokill.BoardFactory.solvedBoard = [
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
  ],
  [
    [5, 4, 2, 3, 7, 6, 1, 8, 9],
    [8, 1, 9, 5, 4, 2, 6, 7, 3],
    [6, 7, 3, 8, 1, 9, 4, 2, 5],
    [3, 8, 1, 9, 2, 7, 5, 6, 4],
    [9, 2, 7, 4, 6, 5, 3, 1, 8],
    [4, 5, 6, 1, 3, 8, 7, 9, 2],
    [2, 6, 5, 7, 9, 4, 8, 3, 1],
    [1, 9, 4, 6, 8, 3, 2, 5, 7],
    [7, 3, 8, 2, 5, 1, 9, 4, 6]
  ],
  [
    [8, 2, 9, 1, 4, 6, 7, 5, 3],
    [6, 5, 1, 7, 3, 2, 4, 8, 9],
    [4, 7, 3, 9, 5, 8, 1, 2, 6],
    [2, 1, 4, 6, 7, 5, 3, 9, 8],
    [7, 3, 8, 2, 9, 4, 6, 1, 5],
    [9, 6, 5, 8, 1, 3, 2, 4, 7],
    [1, 8, 2, 3, 6, 9, 5, 7, 4],
    [3, 4, 7, 5, 8, 1, 9, 6, 2],
    [5, 9, 6, 4, 2, 7, 8, 3, 1]
  ],
  [
    [1, 3, 7, 9, 5, 4, 8, 2, 6],
    [5, 9, 4, 6, 8, 2, 3, 7, 1],
    [6, 2, 8, 3, 7, 1, 9, 5, 4],
    [2, 7, 1, 8, 9, 6, 4, 3, 5],
    [9, 4, 5, 2, 1, 3, 7, 6, 8],
    [3, 8, 6, 5, 4, 7, 2, 1, 9],
    [7, 6, 9, 4, 2, 5, 1, 8, 3],
    [8, 5, 2, 1, 3, 9, 6, 4, 7],
    [4, 1, 3, 7, 6, 8, 5, 9, 2]
  ]
];

/**
 * Randomly shuffles the sectors of a Sudoko board while retaining the rule contraints.
 * 
 * @param {drecco.sudokill.Board} board The board to use as a basis for shuffling.
 * 
 * @return {drecco.sudokill.Board} a newly shuffled board.
 */
drecco.sudokill.BoardFactory.shuffleSector = function(board) {
  var shuffledNumbers = function(count) {
    var numbers = new goog.structs.PriorityQueue();
    var x = 0;
    var shuffled = [];

    for (; x < count; x++) {
      numbers.enqueue(Math.random(), x);
    }

    while (!numbers.isEmpty()) {
      shuffled.push(numbers.dequeue());
    }

    return shuffled;
  };

  var newBoard = new drecco.sudokill.Board();
  var horizontalMap = shuffledNumbers(3);
  var verticalMap = shuffledNumbers(3);
  var sector = 0;
  var sectorX, sectorY, sectorStartX, sectorStartY, mappedStartX, mappedStartY;
  var xOffset, yOffset;
  var doMirrorX = Math.random() > 0.5;
  var doMirrorY = Math.random() > 0.5;
  var doFlipXY = Math.random() > 0.5;
  var targetX, targetY;
  
  for (sectorX = 0; sectorX < 3; sectorX++) {
    for (sectorY = 0; sectorY < 3; sectorY++) {
      sectorStartX = sectorX * 3;
      sectorStartY = sectorY * 3;
      mappedStartX = horizontalMap[sectorX] * 3;
      mappedStartY = verticalMap[sectorY] * 3;

      for (xOffset = 0; xOffset < 3; xOffset++) {
        for (yOffset = 0; yOffset < 3; yOffset++) {
          targetX = mappedStartX + xOffset;
          targetY = mappedStartY + yOffset;

          if (doMirrorX) {
            targetX = 8 - targetX;
          }

          if (doMirrorY) {
            targetY = 8 - targetY;
          }

          if (doFlipXY) {
            newBoard.set(targetY, targetX,
                         board.get(sectorStartX + xOffset, sectorStartY + yOffset));
          }
          else {
            newBoard.set(targetX, targetY,
                         board.get(sectorStartX + xOffset, sectorStartY + yOffset));
          }
        }
      }
    }
  }

  return newBoard;
};

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
  
  board = drecco.sudokill.BoardFactory.solvedBoard[Math.floor(Math.random() *
            drecco.sudokill.BoardFactory.solvedBoard.length)];
    
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

  newBoard = drecco.sudokill.BoardFactory.shuffleSector(newBoard);
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
  var validCells = 81 - filledCells;

  if (filledCells > 81 || filledCells < 0) {
    throw {
      name: 'IllegalArgumentException',
      message: 'filledCell should be between 0 and 81.'
    };
  }

  while(drecco.sudokill.BoardFactory._validCellCount(newBoard) > validCells) {
    move = drecco.sudokill.RandomStrategy.makeMove(newBoard);
    newBoard.set(move.getX(), move.getY(), move.getN());
  }

  newBoard.forgetLastMove();
  newBoard.clearSteps();

  return newBoard;
};

/**
 * Checks how many cells in the board where the player could make
 * a valid move.
 * 
 * @param {drecco.sudokill.Board} board The board to check.
 * @private
 */
drecco.sudokill.BoardFactory._validCellCount = function(board) {
  var x, y;
  var count = 0;

  for (x = 0; x < 9; x++) {
    for (y = 0; y < 9; y++) {
      if (!board.isOccupied(x, y) && !board.getValidNumbers(x, y).isEmpty()) {
        count++;
      }
    }
  }
  
  return count;
};

