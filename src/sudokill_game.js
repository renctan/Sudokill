goog.provide('drecco.sudokill.Game');

goog.require('drecco.sudokill.BoardFactory');

drecco.sudokill.Game = function(players, filledCells) {
  this._players = players;
  this._board = new drecco.sudokill.BoardFactory.create(filledCell);
  this._board.forgetLastMove();
};

drecco.sudokill.Game.prototype.step = function() {
  var nextPlayer = this._players.next();

  
};


