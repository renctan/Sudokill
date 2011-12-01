goog.provide('drecco.sudokill.GameOverEvent');

goog.require('drecco.sudokill.EventType');
goog.require('goog.events.Event');

/**
 * Creates a new event with type @link{drecco.sudokill.EventType.GAME_OVER}.
 * 
 * @param {string} playerName The name of the player that caused the game to be over.
 * @param {drecco.sudokill.Move} move The move done by the player.
 * @param {Object|null|undefined} target The target of this event.
 * 
 * @constructor
 * @extends {goog.events.Event}
 */
drecco.sudokill.GameOverEvent = function(playerName, move, target) {
  goog.base(this, drecco.sudokill.EventType.GAME_OVER, target);

  this._playerName = playerName;
  this._move = move;
};

goog.inherits(drecco.sudokill.GameOverEvent, goog.events.Event);

/**
 * @return {drecco.sudokill.Move} the move stored in this event.
 */
drecco.sudokill.GameOverEvent.prototype.getMove = function() {
  return this._move;
};

/**
 * @return {string} the name of the player stored in this event.
 */
drecco.sudokill.GameOverEvent.prototype.getName = function() {
  return this._playerName;
};

