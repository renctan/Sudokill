/**
 * Contains the implementation for a class that represents a player move in
 * a Sudoku game.
 */

goog.provide('drecco.sudokill.Move');

goog.require('goog.functions');
goog.require('goog.string');

/**
 * Creates an immutable Move object.
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} n The number in cell(x, y).
 * 
 * @constructor
 */
drecco.sudokill.Move = function(x, y, n) {
  this._x = x;
  this._y = y;
  this._n = n;
};

/**
 * @return {number}
 */
drecco.sudokill.Move.prototype.getX = function() {
  return this._x;
};

/**
 * @return {number}
 */
drecco.sudokill.Move.prototype.getY = function() {
  return this._y;
};

/**
 * @return {number}
 */
drecco.sudokill.Move.prototype.getN = function() {
  return this._n;
};

/**
 * @return {string}
 */
drecco.sudokill.Move.prototype.toString = function() {
  return goog.string.buildString(this._n, '@(', this._x, ', ', this._y, ')');
};

