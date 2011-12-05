goog.provide('drecco.sudokill.MainUI');

goog.require('drecco.sudokill.BoardUI');
goog.require('drecco.sudokill.PlayerListUI');
goog.require('drecco.sudokill.EventType');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');

/**
 * @constant
 * @private
 */
var ADD_PLAYER_MSG = 'Add players then press start to begin playing.';

/**
 * @constant
 * @private
 */
var GAME_NAME = 'sudokilljs';

/**
 * @param {Node} node The <b>div<\b> element to attach this UI to.
 * @param {?Document} optDocRef The reference to the html document. This is used for
 *   sending the request to the server.
 * @constructor
 */
drecco.sudokill.MainUI = function(node, optDocRef) {
  var self = this;

  optDocRef = optDocRef || top.document;

  this._statusBarDom = goog.dom.createDom('div', { id: 'status-bar' });
  goog.dom.setTextContent(this._statusBarDom, ADD_PLAYER_MSG);
  goog.dom.appendChild(node, this._statusBarDom);

  this._gameState = null;
  this._boardDom = goog.dom.createDom('div', { id: 'sudokill-board' });
  this._isPlaying = false;

  drecco.sudokill.BoardUI.renderEmptyBoard(this._boardDom);

  var gameSideBarDom = goog.dom.createDom('div', { 'id': 'sudokill-sidebar' });
  this._playerList = new drecco.sudokill.PlayerListUI(gameSideBarDom);

  var startGameDom = goog.dom.createDom('div', { 'id': 'start-game-btn' });
  this._startGameBtn = new goog.ui.Button('Start Game',
    goog.ui.FlatButtonRenderer.getInstance());
  this._startGameBtn.render(startGameDom);
  goog.dom.appendChild(gameSideBarDom, startGameDom);

  var boardAndSideDom = goog.dom.createDom('div', { id: 'board-and-sidebar' },
    this._boardDom, gameSideBarDom);

  goog.dom.appendChild(node, boardAndSideDom);

  var saveScoreBtnDom = goog.dom.createDom('div', { 'id': 'save-score-btn' });
  this._saveScoreBtn = new goog.ui.Button('Save my score',
    goog.ui.FlatButtonRenderer.getInstance());
  this._saveScoreBtn.render(saveScoreBtnDom);
  goog.dom.appendChild(node, saveScoreBtnDom);

  var handleStartBtn = function(e) {
    var thisRef = self;

    if (thisRef._isPlaying) {
      goog.dom.setTextContent(thisRef._startGameBtn.getElement(), 'Start Game');
      thisRef._playerList.enable();
      thisRef._disposeBoard();
      goog.dom.setTextContent(thisRef._statusBar, '');
      thisRef._saveScoreBtn.setEnabled(false);
    }
    else {
      goog.dom.setTextContent(thisRef._startGameBtn.getElement(), 'New Game');
      thisRef._playerList.disable();
      thisRef._createBoard(15);
      thisRef._startGameBtn.setEnabled(false);
    }

    thisRef._isPlaying = !thisRef._isPlaying;
  };

  var handleSaveScore = function(e) {
    var thisRef = self;
    var query = new goog.Uri.QueryData();
    query.add('task', GAME_NAME);
    query.add('winner', thisRef.getWinners());
    query.add('ws', thisRef.getWinnerScore());

    optDocRef.location = 'index.php?' + query.toString();
  };

  goog.events.listen(this._startGameBtn, goog.ui.Component.EventType.ACTION,
    handleStartBtn);
  goog.events.listen(this._saveScoreBtn, goog.ui.Component.EventType.ACTION,
    handleSaveScore);

  this._saveScoreBtn.setEnabled(false);
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
  this._saveScoreBtn.setEnabled(true);
};

/**
 * Disposes the Sudokill board.
 * @private
 */
drecco.sudokill.MainUI.prototype._disposeBoard = function() {
  goog.dom.removeChildren(this._boardDom);
  drecco.sudokill.BoardUI.renderEmptyBoard(this._boardDom);
  this._gameState = null;
};

/**
 * Creates the Sudokill board.
 * 
 * @param {number} filledCell The number of cells to fill on the initial board.
 * @private
 */
drecco.sudokill.MainUI.prototype._createBoard = function(filledCell) {
  goog.dom.removeChildren(this._boardDom);
  this._gameState = new drecco.sudokill.BoardUI(filledCell,
    this._playerList, this._boardDom);
  goog.events.listen(this._gameState, drecco.sudokill.EventType.GAME_OVER,
    this._handleGameOver, false, this);
};

/**
 * @return {string} the string containing the list of winners.
 */
drecco.sudokill.MainUI.prototype.getWinners = function() {
  var winners = this._playerList.getAllExceptCurrent();
  var str = new goog.string.StringBuffer();
  var size = winners.length;
  var lastElem = size - 1;
  var x = 0;

  str.append('[');
  for (; x < size; x++) {
    str.append(winners[x]);

    if (x != lastElem) {
      str.append(', ');
    }
  }
  str.append(']');

  return str.toString();
};

/**
 * @return {string} the score.
 */
drecco.sudokill.MainUI.prototype.getWinnerScore = function() {
  return this._gameState.getSteps() + 'steps';
};

