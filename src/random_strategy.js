/**
 * Contains the logic for making a random move in a Sudoku game.
 */

goog.provide('drecco.sudokill.RandomStrategy');

goog.require('drecco.sudokill.Util');
goog.require('drecco.sudokill.Move');

/**
 * @param {drecco.sudokill.Board} board The current state of the board.
 * @param {boolean=} followAlign Set to true if alignment to the last
 *   move is required. Not yet implemented.
 * 
 * @return {drecco.sudokill.Move}
 */
drecco.sudokill.RandomStrategy.makeMove = function(board, followAlign) {
  var doAlign = followAlign || false;
  var x = 0;
  var y = 0;
  var movesAvailable;

  while (true) {
    if (doAlign) {
      // TODO: implement
    }
    else {
      x = drecco.sudokill.Util.rand(9);
      y = drecco.sudokill.Util.rand(9);
      movesAvailable = board.getValidNumbers(x, y).getValues();

      if (!board.isOccupied(x, y) && movesAvailable.length != 0) {
        break;
      }
    }
  }

  return new drecco.sudokill.Move(x, y,
    movesAvailable[drecco.sudokill.Util.rand(movesAvailable.length)]);
};

