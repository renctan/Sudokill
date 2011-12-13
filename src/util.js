/**
 * Contains a collection of miscellaneous utility methods.
 */

goog.provide('drecco.sudokill.Util');

/**
 * @param {number} maxVal
 * 
 * @return {number} an integer ranging from 0 to maxVal - 1.
 */
drecco.sudokill.Util.rand = function(maxVal){
  return Math.floor(Math.random() * maxVal);
};

