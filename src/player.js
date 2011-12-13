/**
 * Contains the implementation for the class that models a player in Sudokill.
 */

goog.provide('drecco.sudokill.Player');

/**
 * Creates a new player instance.
 * 
 * @param {String} name The name for this player.
 * @param {boolean} isHuman Whether this is a human or AI player.
 * @constructor
 */
drecco.sudokill.Player = function(name, isHuman) {
  this._name = name;
  this._isHuman = isHuman;
};

/**
 * @return {boolean} true if this player is human.
 */
drecco.sudokill.Player.prototype.isHuman = function() {
  return this._isHuman;
};

/**
 * @return {String} the name of this player.
 */
drecco.sudokill.Player.prototype.name = function() {
  return this._name;
};

