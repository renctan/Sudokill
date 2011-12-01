goog.provide('drecco.sudokill.BoardUI');

goog.require('drecco.sudokill.GameOverEvent');
goog.require('drecco.sudokill.BoardFactory');

goog.require('goog.ui.Palette');
goog.require('goog.ui.Prompt');
goog.require('goog.events.EventTarget');

//TODO: rm DEBUG
    goog.require('goog.debug.DivConsole');
    goog.require('goog.debug.Logger');
    goog.require('goog.debug.LogManager');

//END DEBUG

/**
 * @private
 * @constant
 */
var WIDTH_SIZE = 9;

/**
 * @private
 * @constant
 */
var LENGTH_SIZE = 9;

/**
 * Creates a UI container for Sudokill.
 * 
 * @param {number} filledCell The number of cells to fill on the initial board.
 * @param {drecco.sudokill.PlayerListUI} playerList The list of players.
 * @param {Node} node The div node to attach this UI to.
 * 
 * @constructor
 * @extends {goog.events.EventTarget}
 */
drecco.sudokill.BoardUI = function(filledCell, playerList, node) {
  goog.base(this);

  this._board = new drecco.sudokill.BoardFactory.create(filledCell);
  this._isGameOver = false;
  this._players = playerList;

  var items = [];
  var x, y;
  var cell;
  var cellDisp = '';
  var boardPalette;
  var self = this;

  for (y = 0; y < LENGTH_SIZE; y++) {
    for (x = 0; x < WIDTH_SIZE; x++) {
      cell = this._board.get(x, y);
      cellDisp = (cell == 0)? '' : cell;
      items.push(goog.dom.createTextNode(cellDisp));
    }
  }

  boardPalette = new goog.ui.Palette(items);
  boardPalette.setSize(WIDTH_SIZE);

  boardPalette.render(node);
  goog.dom.classes.add(boardPalette.getElement(), 'simple-palette');

  goog.events.listen(boardPalette, goog.ui.Component.EventType.ACTION,
    function(e) { self._selectCell(e.target); });

//TODO: rm DEBUG
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);
    this.logger = goog.debug.Logger.getLogger('demo');
    var logConsole = new goog.debug.DivConsole(goog.dom.getElement('log'));
    logConsole.setCapturing(true);
    this.logger.info("DEBUG");
};

goog.inherits(drecco.sudokill.BoardUI, goog.events.EventTarget);

/**
 * Handles the event when a cell is selected by the user.
 * 
 * @param {goog.ui.Palette} palette The palette UI that represents the board
 * @private
 */
drecco.sudokill.BoardUI.prototype._selectCell = function(palette) {
  var idx = palette.getHighlightedIndex();
  var x = drecco.sudokill.BoardUI._getX(idx);
  var y = drecco.sudokill.BoardUI._getY(idx);
  var self = this;
  var n;

  this.logger.info("Selected: " + x + ", " + y);
  if (!this._isGameOver && this._board.get(x, y) == 0) {
    var handler = function(response) {
      if (response != null) {
        n = parseInt(response);

        if (!self._board.isValid(x, y, n)) {
          self._gameOver(x, y, n);
        }
        else { 
          self._board.set(x, y, n);
          goog.dom.setTextContent(palette.getSelectedItem(), n); // Update display
          self._players.next();
        }
      }
    };

    var prompt = new goog.ui.Prompt('', 'Set the value.', handler);
    prompt.setValidationFunction(function(input) {
      var num = parseInt(input);
      return (num >= 1 && num <= 9);
    });

    prompt.setVisible(true);
  }
};

/**
 * @return {number} the x component given the 1D index.
 * @private
 */
drecco.sudokill.BoardUI._getX = function(num) {
  return num % WIDTH_SIZE;
};

/**
 * @return {number} the y component given the 1D index.
 * @private
 */
drecco.sudokill.BoardUI._getY = function(num) {
  return Math.floor(num / WIDTH_SIZE);
};

/**
 * Ends the game and dispatches @link{drecco.sudokill.EventType.GAME_OVER}.
 * @private
 */
drecco.sudokill.BoardUI.prototype._gameOver = function(x, y, n) {
  var move = new drecco.sudokill.Move(x, y, n);
  this._isGameOver = true;
  this.dispatchEvent(new drecco.sudokill.GameOverEvent(
    this._players.getCurrentPlayer().name(), move));
};

/**
 * @return {boolean} true if game over.
 */
drecco.sudokill.BoardUI.prototype.isGameOver = function() {
  return this._isGameOver;
};
