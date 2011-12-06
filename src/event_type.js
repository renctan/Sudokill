goog.provide('drecco.sudokill.EventType');

goog.require('goog.events');

/**
 * @enum {string}
 */
drecco.sudokill.EventType = {
  GAME_OVER: goog.events.getUniqueId('Game Over'),
  NEXT_TURN: goog.events.getUniqueId('Next Turn')
};

