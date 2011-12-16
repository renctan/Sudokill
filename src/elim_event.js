/**
 * Contains the definition of the player eliminated event.
 */

goog.provide('drecco.sudokill.EliminatedEvent');

goog.require('drecco.sudokill.EventType');
goog.require('goog.events.Event');

/**
 * Creates a new event with type @link{drecco.sudokill.EventType.ELIM_PLAYER}.
 * 
 * @param {string} playerName The name of the winning player.
 * @param {Object=} target The target of this event.
 * 
 * @constructor
 * @extends {goog.events.Event}
 */
drecco.sudokill.EliminatedEvent = function(playerName, target) {
  goog.base(this, drecco.sudokill.EventType.ELIM_PLAYER, target);
  this._playerName = playerName;
};

goog.inherits(drecco.sudokill.EliminatedEvent, goog.events.Event);

/**
 * @return {string} the name of the player stored in this event.
 */
drecco.sudokill.EliminatedEvent.prototype.getName = function() {
  return this._playerName;
};

