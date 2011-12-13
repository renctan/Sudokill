/**
 * Contains the enum for the custom events used in this project.
 */

goog.provide('drecco.sudokill.EventType');

goog.require('goog.events');

/**
 * @enum {string}
 */
drecco.sudokill.EventType = {
  GAME_OVER: goog.events.getUniqueId('Game Over'),
  NEXT_TURN: goog.events.getUniqueId('Next Turn'),
  ELIM_PLAYER: goog.events.getUniqueId('Elim Player')
};

