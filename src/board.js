goog.provide('drecco.sudokill.Board');

goog.require('drecco.sudokill.Move');

/**
 * @constant
 */
var BOARD_LENGTH = 9;

/**
 * @constant
 */
var BOARD_WIDTH = 9;

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

