/**
 * Contains the definition for the game over event.
 */

goog.provide('drecco.sudokill.GameOverEvent');

goog.require('drecco.sudokill.EventType');
goog.require('goog.events.Event');

/**
 * Creates a new event with type @link{drecco.sudokill.EventType.GAME_OVER}.
 * 
 * @param {string} playerName The name of the winning player.
 * @param {Object|null|undefined} target The target of this event.
 * 
 * @constructor
 * @extends {goog.events.Event}
 */
drecco.sudokill.GameOverEvent = function(playerName, target) {
  goog.base(this, drecco.sudokill.EventType.GAME_OVER, target);
  this._playerName = playerName;
};

goog.inherits(drecco.sudokill.GameOverEvent, goog.events.Event);

/**
 * @return {string} the name of the player stored in this event.
 */
drecco.sudokill.GameOverEvent.prototype.getName = function() {
  return this._playerName;
};

