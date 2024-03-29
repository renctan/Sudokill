/**
 * Contains the implementation for the class that models a Sudoku Board. This board contains
 * several helper methods that supports the rules described for 
 * <a href="http://cs.nyu.edu/courses/fall11/CSCI-GA.2965-001/sudokill.html">Sudokill</a>
 */

goog.provide('drecco.sudokill.Board');

goog.require('drecco.sudokill.Move');
goog.require('goog.structs.Set');

/**
 * Creates a new empty Sudoku board.
 * 
 * @constructor
 */
drecco.sudokill.Board = function() {
  var x = 0;
  var size = 81;

  this._map = [];
  for(x = size; x--;) {
    this._map[x] = 0;
  }

  this._lastMove = null;
  this._steps = 0;
};

/**
 * @type {number}
 * @constant
 */
drecco.sudokill.Board.BOARD_LENGTH = 9;

/**
 * @type {number}
 * @constant
 */
drecco.sudokill.Board.BOARD_WIDTH = 9;

/**
 * @type {number}
 * @constant
 */
drecco.sudokill.Board.MAX_VAL = 9;

/**
 * @param {number} x
 * @param {number} y
 * 
 * @return {number} the offset of the 2D coordinates in 1D.
 */
drecco.sudokill.Board.calcOffset = function(x, y) {
  return x + y * drecco.sudokill.Board.BOARD_WIDTH;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} n The number to input in cell(x, y)
 * 
 * @return {boolean} true if x, y is within the boundary of this board.
 */
drecco.sudokill.Board.prototype.set = function(x, y, n) {
  var success = true;

  if (x >= drecco.sudokill.Board.BOARD_LENGTH || x < 0 ||
      y >= drecco.sudokill.Board.BOARD_WIDTH || y < 0) {
    success = false;
  }
  else {
    this._lastMove = new drecco.sudokill.Move(x, y, n);
    this._map[drecco.sudokill.Board.calcOffset(x, y)] = n;
    this._steps++;
  }

  return success;
};

/**
 * Note: This function does not perform any bounds checking.
 * 
 * @param {number} x
 * @param {number} y
 * 
 * @return {number} the number in cell(x, y).
 */
drecco.sudokill.Board.prototype.get = function(x, y) {
  return this._map[drecco.sudokill.Board.calcOffset(x, y)];
};

/**
 * @return {?drecco.sudokill.Move} the last move performed in this board.
 */
drecco.sudokill.Board.prototype.getLastMove = function() {
  return this._lastMove;
};

/**
 * @return {goog.structs.Set.<number>} the set of all valid numbers for Sudoku.
 * @private
 */
drecco.sudokill.Board._validNumbers = function() {
  var numbers = new goog.structs.Set();
  var x = 1;

  for (x = 1; x <= drecco.sudokill.Board.MAX_VAL; x++) {
    numbers.add(x);
  }
  
  return numbers;
};

/**
 * @param {number} row
 * @return {goog.structs.Set.<number>} the set of valid numbers that can be used for a row
 *   without violating the Sudoku rule.
 * @private
 */
drecco.sudokill.Board.prototype._validNumbersForRow = function(row) {
  var numbers = drecco.sudokill.Board._validNumbers();
  var x = 0;

  for (; x < drecco.sudokill.Board.BOARD_WIDTH; x++) {
    numbers.remove(this.get(x, row));
  }
  
  return numbers;
};

/**
 * @param {number} column
 * @return {goog.structs.Set.<number>} the set of valid numbers that can be used for a
 *   column without violating the Sudoku rule.
 */
drecco.sudokill.Board.prototype._validNumbersForColumn = function(column) {
  var numbers = drecco.sudokill.Board._validNumbers();
  var y = 0;

  for (; y < drecco.sudokill.Board.BOARD_LENGTH; y++) {
    numbers.remove(this.get(column, y));
  }
  
  return numbers;
};

/**
 * @param {number} x
 * @param {number} y
 * 
 * @return {goog.structs.Set.<number>} the set of valid numbers within the 3x3 sector
 *   that contains x,y without violating the rules of Sudoku.
 * @private
 */
drecco.sudokill.Board.prototype._validNumbersForSector = function(x, y) {
  var numbers = drecco.sudokill.Board._validNumbers();
  
  var startX = Math.floor(x / 3) * 3;
  var endX = startX + 3;
  
  var startY = Math.floor(y / 3) * 3;
  var endY = startY + 3;
  
  var i = startX;
  var j = startY;

  for (; i < endX; i++) {
    for (j = startY; j < endY; j++) {
      numbers.remove(this.get(i, j));
    }
  }
  
  return numbers;
};

/**
 * Gets the set of numbers that can be set to a specific location in the board
 * without violating the rules in Sudoku. Note: the assumption here is that the
 * board is currently in a valid state. 
 * 
 * @param {number} x
 * @param {number} y
 * 
 * @return {goog.structs.Set.<number>} the set of numbers.
 */
drecco.sudokill.Board.prototype.getValidNumbers = function(x, y) {
  var numbers = this._validNumbersForRow(y);
  numbers = numbers.intersection(this._validNumbersForColumn(x));
  numbers = numbers.intersection(this._validNumbersForSector(x, y));
  
  return numbers;
};

/**
 * Checks if the move that is about to be made is valid. This method assumes that
 * the current board state is valid. 
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} n
 * @param {boolean?} checkAlignment Checks to see if the move aligns with the
 *   last move horizontally or vertically (except for cases when the horizontal
 *   and vertical cells are completely filled. Defaults to false.
 * 
 * @return {boolean} true if valid.
 */
drecco.sudokill.Board.prototype.isValid = function(x, y, n, checkAlignment) {
  var doCheckAlign = checkAlignment || false;
  var isValid = false;
  var lastMove;

  if (n != 0 && this.get(x, y) == 0) {
    if (doCheckAlign && !this.isAligned(x, y)) {
      return false;
    }
    
    isValid = this.getValidNumbers(x, y).contains(n);
  }

  return isValid;
};

/**
 * Checks if (x, y) is aligned with the last move.
 * 
 * @param {number} x
 * @param {number} y
 * 
 * @return {boolean} true if aligned.
 */
drecco.sudokill.Board.prototype.isAligned = function(x, y) {
  var lastMove = this.getLastMove();
  
  if (lastMove != null && !this.rowColFilled(lastMove.getX(), lastMove.getY()) &&
      x != lastMove.getX() && y != lastMove.getY()) {
    return false;
  }

  return true;
};

/**
 * @param {number} x
 * @param {number} y
 * 
 * @return {boolean} true if the row and column of the given cell is already filled with
 *   numbers.
 */
drecco.sudokill.Board.prototype.rowColFilled = function(x, y) {
  var i = drecco.sudokill.Board.BOARD_LENGTH;
  var j = drecco.sudokill.Board.BOARD_WIDTH;

  for (; i--; ) {
    if (this.get(i, y) == 0) {
      return false;
    }
  }
  
  for (; j--; ) {
    if (this.get(x, j) == 0) {
      return false;
    }
  }
  
  return true;
};

/**
 * Clears the last move.
 */
drecco.sudokill.Board.prototype.forgetLastMove = function() {
  this._lastMove = null;
};

/**
 * Clears the internal counter for the number of steps.
 */
drecco.sudokill.Board.prototype.clearSteps = function() {
  this._steps = 0;
};

/**
 * @return {number} the number of steps done so far in this game.
 */
drecco.sudokill.Board.prototype.getSteps = function() {
  return this._steps;
};

/**
 * @param {number} x
 * @param {number} y
 * 
 * @return {boolean} true if the cell is already occupied.
 */
drecco.sudokill.Board.prototype.isOccupied = function(x, y) {
  return this._map[drecco.sudokill.Board.calcOffset(x, y)] != 0;
};

/**
 * @param {number} x
 * @param {number} y
 * 
 * @return {boolean} true if a valid move can be made on this cell.
 */
drecco.sudokill.Board.prototype.canMakeMove = function(x, y) {
  return !this.isOccupied(x, y) && this.isAligned(x, y) &&
    !this.getValidNumbers(x, y).isEmpty();
};

/**
 * @return {boolean} true if there are still valid moves that can be
 *   made for the current player.
 */
drecco.sudokill.Board.prototype.hasValidMoveAvailable = function() {
  var x, y;
  var lastX, lastY;
  var lastMove = this._lastMove;

  if (this._lastMove != null && !this.rowColFilled(lastMove.getX(),
      lastMove.getY())) {
    lastX = lastMove.getX();
    lastY = lastMove.getY();

    for (x = 0; x < drecco.sudokill.Board.BOARD_WIDTH; x++) {
      if (this.canMakeMove(x, lastY)) {
        return true;
      }
    }

    for (y = 0; y < drecco.sudokill.Board.BOARD_LENGTH; y++) {
      if (this.canMakeMove(lastX, y)) {
        return true;
      }
    }
  }
  else {
    for (x = 0; x < drecco.sudokill.Board.BOARD_WIDTH; x++) {
      for (y = 0; y < drecco.sudokill.Board.BOARD_LENGTH; y++) {
        if (this.canMakeMove(x, y)) {
          return true;
        }
      }
    }
  }

  return false;
};

