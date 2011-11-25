goog.provide('drecco.sudokill.Move');

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
    getX: function() { return x; },
    getY: function() { return y; },
    getN: function() { return n; }
  };
};

