goog.provide('drecco.sudokill.UI');

goog.require('goog.ui.Palette');
goog.require('drecco.sudokill.Board');

//TODO: rm DEBUG
    goog.require('goog.debug.DivConsole');
    goog.require('goog.debug.Logger');
    goog.require('goog.debug.LogManager');

//END DEBUG

var WIDTH_SIZE = 9;

/**
 * Creates a UI container for Sudokill.
 * 
 * @constructor
 */
drecco.sudokill.UI = function() {
  this._board = new drecco.sudokill.Board();

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
  var x = 81;
  var boardPalette;
  var self = this;

  for (; x--; ) {
    items.push(goog.dom.createTextNode(''));
  }

  boardPalette = new goog.ui.Palette(items);
  boardPalette.setSize();

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

