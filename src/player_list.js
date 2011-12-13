/**
 * Contains the model representing a list of players.
 */

goog.provide('drecco.sudokill.PlayerList');

goog.require('goog.structs');

/**
 * Creates a container to store a list of players that can be cycled through in
 * a round robin fashion.
 * 
 * @param {Array.<drecco.sudokill.Player>} players The list of players.
 * @constructor
 */
drecco.sudokill.PlayerList = function(players) {
  this._players = players;
  this._currIdx = 0;
};

/**
 * @return {drecco.sudokill.Player} the next player.
 */
drecco.sudokill.PlayerList.prototype.next = function() {
  var size = this._players.length;
  var next = null;

  if (size > 0) {
    next = this._players[this._currIdx++];

    if (this._currIdx >= size) {
      this._currIdx = this._currIdx % size;  
    }
  }

  return next;
};

/**
 * @return {drecco.sudokill.Player} the current player.
 */
drecco.sudokill.PlayerList.prototype.getCurrentPlayer = function() {
  var player = null;

  if (this._players.length > 0) {
    player = this._players[this._currIdx];
  }

  return player;
};

/**
 * @return {number} the number of players.
 */
drecco.sudokill.PlayerList.prototype.playerCount = function() {
  return this._players.length;
};

/**
 * @return {Array.<string>} an array of all players names except the current player.
 */
drecco.sudokill.PlayerList.prototype.getAllExceptCurrent = function() {
  var players = [];
  var size = this._players.length;
  var currIdx = this._currIdx + 1;

  if (currIdx >= size) {
    currIdx = currIdx % size;
  }

  if (size > 1) {
    while (currIdx != this._currIdx) {
      players.push(this._players[currIdx++].name());

      if (currIdx >= size) {
        currIdx = currIdx % size;
      }
    }
  }
  
  return players;
};

drecco.sudokill.PlayerList.prototype.eliminateCurrent = function() {
  var name = this._players[this._currIdx].name();
  var newSize;

  this._players = goog.structs.filter(this._players, function (player) {
    return player.name() != name;
  });

  newSize = this._players.length;
  if (this._currIdx >= newSize) {
    this._currIdx = 0;
  }
};

