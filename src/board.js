goog.provide('drecco.sudokill.Board');

goog.require('drecco.sudokill.Move');
goog.require('goog.structs.Set');

/**
 * @type {number}
 * @constant
 */
var BOARD_LENGTH = 9;

/**
 * @type {number}
 * @constant
 */
var BOARD_WIDTH = 9;

/**
 * @type {number}
 * @constant
 */
var MAX_VAL = 9;

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
};

/**
 * @param {number} x
 * @param {number} y
 * 
 * @return {number} the offset of the 2D coordinates in 1D.
 * @private
 */
drecco.sudokill.Board.prototype._calcOffset = function(x, y) {
  return x + y * BOARD_WIDTH;
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

  if (x >= BOARD_LENGTH || x < 0 || y >= BOARD_WIDTH || y < 0) {
    success = false;
  }
  else {
    this._lastMove = new drecco.sudokill.Move(x, y, n);
    this._map[this._calcOffset(x, y)] = n;
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
  return this._map[this._calcOffset(x, y)];
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

  for (x = 1; x <= MAX_VAL; x++) {
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

  for (; x < BOARD_WIDTH; x++) {
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

  for (; y < BOARD_LENGTH; y++) {
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
    if (doCheckAlign) {
      lastMove = this.getLastMove();
      
      if (lastMove != null && !this.rowColFilled(lastMove.getX(), lastMove.getY()) &&
          x != lastMove.getX() && y != lastMove.getY()) {
        return false;
      }
    }
    
    isValid = this.getValidNumbers(x, y).contains(n);
  }

  return isValid;
};

/**
 * @param {number} x
 * @param {number} y
 * 
 * @return {boolean} true if the row and column of the given cell is already filled with
 *   numbers.
 */
drecco.sudokill.Board.prototype.rowColFilled = function(x, y) {
  var i = BOARD_LENGTH;
  var j = BOARD_WIDTH;

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

