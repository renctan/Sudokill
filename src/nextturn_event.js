/**
 * Contains the definition for the next player's turn event.
 */

goog.provide('drecco.sudokill.NextTurnEvent');

goog.require('drecco.sudokill.EventType');
goog.require('goog.events.Event');

/**
 * Creates a new event with type @link{drecco.sudokill.EventType.NEXT_TURN}.
 * 
 * @param {drecco.sudokill.Player} player The player whose turn is next.
 * @param {Object|null|undefined} target The target of this event.
 * 
 * @constructor
 * @extends {goog.events.Event}
 */
drecco.sudokill.NextTurnEvent = function(player, target) {
  goog.base(this, drecco.sudokill.EventType.NEXT_TURN, target);

  this._player = player;
};

goog.inherits(drecco.sudokill.NextTurnEvent, goog.events.Event);

/**
 * @return {drecco.sudokill.Player} the player stored in this event.
 */
drecco.sudokill.NextTurnEvent.prototype.getPlayer = function() {
  return this._player;
};

