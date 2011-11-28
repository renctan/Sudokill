goog.provide('drecco.sudokill.UI');

goog.require('goog.ui.Palette');
goog.require('drecco.sudokill.BoardFactory');

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
 * @param {number} filledCell
 * @constructor
 */
drecco.sudokill.UI = function(filledCell) {
  this._board = new drecco.sudokill.BoardFactory.create(filledCell);

//TODO: rm DEBUG
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);
    this.logger = goog.debug.Logger.getLogger('demo');
    var logConsole = new goog.debug.DivConsole(goog.dom.getElement('log'));
    logConsole.setCapturing(true);
    this.logger.info("DEBUG");
};

/**
 * Append the DOM component of this GUI to a node.
 * 
 * @param {Node} node
 */
drecco.sudokill.UI.prototype.render = function(node) {
  var items = [];
  var x, y;
  var cell;
  var cellDisp = '';
  var boardPalette;
  var self = this;

  for (x = 0; x < WIDTH_SIZE; x++) {
    for (y = 0; y < LENGTH_SIZE; y++) {
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
};

/**
 * Handles the event when a cell is selected by the user.
 * 
 * @param {goog.ui.Palette} palette The palette UI that represents the board
 * @private
 */
drecco.sudokill.UI.prototype._selectCell = function(palette) {
  var idx = palette.getHighlightedIndex();
  var x = drecco.sudokill.UI._getX(idx);
  var y = drecco.sudokill.UI._getY(idx);

  // TODO: implement
  this.logger.info("Selected: " + x + ", " + y);
  goog.dom.setTextContent(palette.getSelectedItem(), "X");
};

/**
 * @return {number} the x component given the 1D index.
 * @private
 */
drecco.sudokill.UI._getX = function(num) {
  return num % WIDTH_SIZE;
};

/**
 * @return {number} the y component given the 1D index.
 * @private
 */
drecco.sudokill.UI._getY = function(num) {
  return Math.floor(num / WIDTH_SIZE);
};

