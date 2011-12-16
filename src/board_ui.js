/**
 * Contains the implementation for the GUI for the Sudoku board. This is also responsible
 * for displaying and handling the number input selection dialog.
 */

goog.provide('drecco.sudokill.BoardUI');

goog.require('drecco.sudokill.GameOverEvent');
goog.require('drecco.sudokill.NextTurnEvent');
goog.require('drecco.sudokill.BoardFactory');
goog.require('drecco.sudokill.EliminatedEvent');
goog.require('goog.ui.Palette');
goog.require('goog.ui.PaletteRenderer');
goog.require('goog.ui.Dialog');
goog.require('goog.dom.classes');
goog.require('goog.events.EventTarget');
goog.require('goog.structs');

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
 * @private
 * @constant
 */
var DIALOG_SELECTION_COL = 5;

/**
 * @enum {string}
 * @private
 */
var CLASS = {
  BAD_CELL: 'board-bad-cell',
  GOOD_CELL: 'board-good-cell',
  OCCUPIED_CELL: 'board-occupied'
};

/**
 * Creates a UI container for Sudokill.
 * 
 * @param {number} filledCell The number of cells to fill on the initial board.
 * @param {drecco.sudokill.PlayerList} playerList The list of players.
 * @param {Element} node The div node to attach this UI to.
 * 
 * @constructor
 * @extends {goog.events.EventTarget}
 */
drecco.sudokill.BoardUI = function(filledCell, playerList, node) {
  goog.base(this);

  this._board = drecco.sudokill.BoardFactory.create(filledCell);
  this._isGameOver = false;
  this._players = playerList;

  var items = [];
  var x, y;
  var cell;
  var boardPalette;
  var self = this;

  for (y = 0; y < LENGTH_SIZE; y++) {
    for (x = 0; x < WIDTH_SIZE; x++) {
      cell = this._board.get(x, y);
      items.push(goog.dom.createTextNode((cell == 0)? '' : cell.toString()));
    }
  }

  this._boardPalette = new goog.ui.Palette(items);
  this._boardPalette.setSize(WIDTH_SIZE);

  this._boardPalette.render(node);
  goog.dom.classes.add(this._boardPalette.getElement(), 'simple-palette');

  goog.events.listen(this._boardPalette, goog.ui.Component.EventType.ACTION,
    function(e) { self._selectCell(e.target); }, false, this);

  this._refreshDisplay();
};

goog.inherits(drecco.sudokill.BoardUI, goog.events.EventTarget);

/**
 * Handles the event when a cell is selected by the user.
 * 
 * @param {goog.ui.Palette} palette The palette UI that represents the board
 * @private
 */
drecco.sudokill.BoardUI.prototype._selectCell = function(palette) {
  var idx = palette.getSelectedIndex();
  var x = drecco.sudokill.BoardUI._getX(idx);
  var y = drecco.sudokill.BoardUI._getY(idx);
  var validNumbers;
  var paletteItems = [];
  var paletteInDlg;
  var dialog;
  var buttonSet;

  if (!this._isGameOver && !this._board.isOccupied(x, y) && this._board.isAligned(x, y)) {
    dialog = new goog.ui.Dialog();
    dialog.setTitle('Please select a number to set.');

    validNumbers = this._board.getValidNumbers(x, y).getValues();
    paletteItems = goog.structs.map(validNumbers, function(number) {
      return goog.dom.createTextNode(String(number)); });
    /** @suppress {checkTypes} */ paletteInDlg = new goog.ui.Palette(paletteItems);
    paletteInDlg.setSize(DIALOG_SELECTION_COL);
    paletteInDlg.render(dialog.getContentElement());
    goog.dom.classes.add(paletteInDlg.getElement(), 'simple-palette');

    /**
     * Handler for getting the value selected by user.
     * 
     * @param {goog.events.Event} e
     */
    var handler = function(e) {
      var selectedIdx = e.target.getSelectedIndex();
      var playerEliminated;
      var n;

      if (selectedIdx >= 0) {
        n = validNumbers[selectedIdx];
        this._board.set(x, y, n);

        this._players.next();
        while (!this._board.hasValidMoveAvailable() && this._players.playerCount() > 1) {
          playerEliminated = this._players.getCurrentPlayer();
          this._players.eliminateCurrent();
          this.dispatchEvent(new drecco.sudokill.EliminatedEvent(playerEliminated.name()));
          this._board.forgetLastMove();
        }

        if (this._players.playerCount() <= 1) {
          this._gameOver();
        }
        else {
          this.dispatchEvent(new drecco.sudokill.NextTurnEvent(
                               this._players.getCurrentPlayer()));
        }

        goog.dom.setTextContent(palette.getSelectedItem(), n); // Update display
        this._refreshDisplay();
      }

      dialog.dispose();
    };

    goog.events.listen(paletteInDlg, goog.ui.Component.EventType.ACTION,
      handler, false, this);

    buttonSet = new goog.ui.Dialog.ButtonSet();
    buttonSet.addButton({ caption: 'Cancel', key: 'cancel' }, true, true);
    dialog.setButtonSet(buttonSet);

    dialog.setVisible(true);
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
drecco.sudokill.BoardUI.prototype._gameOver = function() {
  this._isGameOver = true;
  this.dispatchEvent(new drecco.sudokill.GameOverEvent(
    this._players.getCurrentPlayer().name()));
};

/**
 * @return {boolean} true if game over.
 */
drecco.sudokill.BoardUI.prototype.isGameOver = function() {
  return this._isGameOver;
};

/**
 * Creates an empty board.
 * 
 * @param {Element} node The node to attach the board.
 */
drecco.sudokill.BoardUI.renderEmptyBoard = function(node) {
  var x, y;
  var boardPalette;
  var items = [];
  
  for (y = 0; y < LENGTH_SIZE; y++) {
    for (x = 0; x < WIDTH_SIZE; x++) {
      items.push(goog.dom.createTextNode(''));
    }
  }

  boardPalette = new goog.ui.Palette(items);
  boardPalette.setSize(WIDTH_SIZE);

  boardPalette.render(node);
  goog.dom.classes.add(boardPalette.getElement(), 'simple-palette');
};

/**
 * @return {number} the number of steps done so far in this game.
 */
drecco.sudokill.BoardUI.prototype.getSteps = function() {
  return this._board.getSteps();
};

/**
 * @private
 */
drecco.sudokill.BoardUI.prototype._refreshDisplay = function() {
  var x = 0;
  var y;
  var cell;
  var origSelectedIdx;
  var selectedItem;

  this._boardPalette.setEnabled(false);
  origSelectedIdx = this._boardPalette.getSelectedIndex();

  for (; x < WIDTH_SIZE; x++) {
    for (y = 0; y < LENGTH_SIZE; y++) {
      this._boardPalette.setSelectedIndex(drecco.sudokill.Board.calcOffset(x, y));

      selectedItem = this._boardPalette.getSelectedItem();
      // getSelectedItem actually gives the text node so need to get the parent
      cell = selectedItem.parentNode;

      if (this._board.isOccupied(x, y)) {
        goog.dom.classes.addRemove(cell, CLASS.GOOD_CELL, CLASS.OCCUPIED_CELL);
      }
      // TODO: possible optimization? Check if cell is already X?
      else if (this._board.getValidNumbers(x, y).isEmpty()) {
        goog.dom.classes.addRemove(cell, CLASS.GOOD_CELL, CLASS.BAD_CELL);
        goog.dom.setTextContent(selectedItem, 'X');
      }
      else if(this._board.isAligned(x, y)) {
        goog.dom.classes.addRemove(cell, CLASS.BAD_CELL, CLASS.GOOD_CELL);
      }
      else {
        goog.dom.classes.addRemove(cell, CLASS.GOOD_CELL, CLASS.BAD_CELL);
      }
    }
  }

  this._boardPalette.setSelectedIndex(origSelectedIdx);
  this._boardPalette.setEnabled(true);
};

