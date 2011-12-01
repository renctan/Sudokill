goog.provide('drecco.sudokill.MainUI');

goog.require('drecco.sudokill.BoardUI');
goog.require('drecco.sudokill.PlayerListUI');
goog.require('drecco.sudokill.EventType');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');

/**
 * @param {Node} node The <b>div<\b> element to attach this UI to.
 * @constructor
 */
drecco.sudokill.MainUI = function(node) {
  var self = this;
  this._statusBarDom = goog.dom.createDom('div', { id: 'status-bar' });
  this._gameState = null;
  this._boardDom = goog.dom.createDom('div', { id: 'sudokill-board' });
  this._isPlaying = false;

  goog.dom.appendChild(node, this._statusBarDom);
  goog.dom.appendChild(node, this._boardDom);

  this._playerList = new drecco.sudokill.PlayerListUI(node);

  var startGameDom = goog.dom.createDom('div', { 'class': 'start-game-btn' });
  this._startGameBtn = new goog.ui.Button('Start Game',
    goog.ui.FlatButtonRenderer.getInstance());
  this._startGameBtn.render(startGameDom);
  goog.dom.appendChild(node, startGameDom);

  var handleStartBtn = function(e) {
    var thisRef = self;

    if (thisRef._isPlaying) {
      goog.dom.setTextContent(startGameDom, 'Start Game');
      thisRef._playerList.enable();
      thisRef._disposeBoard();
      goog.dom.setTextContent(thisRef._statusBar, '');
    }
    else {
      goog.dom.setTextContent(startGameDom, 'New Game');
      thisRef._playerList.disable();
      thisRef._createBoard(15);
      thisRef._startGameBtn.setEnabled(false);
    }

    thisRef._isPlaying = !thisRef._isPlaying;
  };

  goog.events.listen(this._startGameBtn, goog.ui.Component.EventType.ACTION,
    handleStartBtn);
};

/**
 * @param {drecco.sudokill.GameOverEvent}
 */
drecco.sudokill.MainUI.prototype._handleGameOver = function(e) {
  var name = e.getName();
  var move = e.getMove();
  var message = goog.string.buildString('Game Over: Illegal move by ',
    name, ' with ', move.getN(), ' on (', move.getX(), ', ', move.getY(), ')');

  goog.dom.setTextContent(this._statusBarDom, message);
  this._startGameBtn.setEnabled(true);
};

/**
 * Disposes the Sudokill board.
 * @private
 */
drecco.sudokill.MainUI.prototype._disposeBoard = function() {
  goog.dom.removeChildren(this._boardDom);
  this._gameState = null;
};

/**
 * Creates the Sudokill board.
 * 
 * @param {number} filledCell The number of cells to fill on the initial board.
 * @private
 */
drecco.sudokill.MainUI.prototype._createBoard = function(filledCell) {
  this._gameState = new drecco.sudokill.BoardUI(filledCell,
    this._playerList, this._boardDom);
  goog.events.listen(this._gameState, drecco.sudokill.EventType.GAME_OVER,
    this._handleGameOver, false, this);
};

