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
  return {
    getX: goog.functions.constant(x),
    getY: goog.functions.constant(y),
    getN: goog.functions.constant(n),
    toString: function() {
      return goog.string.buildString(n, '@(', x, ', ', y, ')');
    }
  };
};

