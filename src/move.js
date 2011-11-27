goog.provide('drecco.sudokill.Move');

goog.require('goog.functions');

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
  return {
    getX: goog.functions.constant(x),
    getY: goog.functions.constant(y),
    getN: goog.functions.constant(n)
  };
};

