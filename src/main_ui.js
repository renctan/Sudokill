/**
 * Contains the implementation for the entire GUI components for Sudokill. Also contains
 * the logic for handling the start game and save score button. This is also responsible for
 * updating the status message.
 */

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
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.Select');
goog.require('goog.ui.MenuItem');

/**
 * Creates the main UI component. This is intended to be used only on a single html
 * document.
 * 
 * @param {Node} node The <b>div<\b> element to attach this UI to.
 * @param {Document=} optDocRef The reference to the html document. This is used for
 *   sending the request to the server.
 * @constructor
 */
drecco.sudokill.MainUI = function(node, optDocRef) {
  var self = this;

  optDocRef = optDocRef || goog.dom.getOwnerDocument(node);

  this._statusBarDom = goog.dom.createDom('div', { id: 'status-bar' });
  goog.dom.setTextContent(this._statusBarDom, drecco.sudokill.MainUI.ADD_PLAYER_MSG);
  goog.dom.appendChild(node, this._statusBarDom);

  this._gameState = null;
  this._boardDom = goog.dom.createDom('div', { id: 'sudokill-board' });
  this._isPlaying = false;

  drecco.sudokill.BoardUI.renderEmptyBoard(this._boardDom);

  var filledCellText = goog.dom.createTextNode('Initial filled cells: ');
  var filledCellSelectDom = goog.dom.createDom('span');
  var filledCellGroupDom = goog.dom.createDom('div', { id: 'filled-cell-group' },
    filledCellText, filledCellSelectDom);
  var filledCellSelect = drecco.sudokill.MainUI._filledCellSelect(75, 50);
  filledCellSelect.render(filledCellSelectDom);

  var gameSideBarDom = goog.dom.createDom('div', { 'id': 'sudokill-sidebar' });
  this._playerListUI = new drecco.sudokill.PlayerListUI(gameSideBarDom);

  var startGameDom = goog.dom.createDom('div', { 'id': 'start-game-btn' });
  this._startGameBtn = new goog.ui.Button('Start Game',
    goog.ui.FlatButtonRenderer.getInstance());
  this._startGameBtn.render(startGameDom);
  goog.dom.appendChild(gameSideBarDom, filledCellGroupDom);
  goog.dom.appendChild(gameSideBarDom, startGameDom);

  var boardAndSideDom = goog.dom.createDom('div', { id: 'board-and-sidebar' },
    this._boardDom, gameSideBarDom);

  goog.dom.appendChild(node, boardAndSideDom);

  var saveScoreBtnDom = goog.dom.createDom('div', { 'id': 'save-score-btn' });
  this._saveScoreBtn = new goog.ui.Button('Save my score',
    goog.ui.FlatButtonRenderer.getInstance());
  this._saveScoreBtn.render(saveScoreBtnDom);
  goog.dom.appendChild(node, saveScoreBtnDom);

  /**
   * Handler for the start button.
   */
  var handleStartBtn = function(e) {
    var thisRef = self;

    if (thisRef._playerListUI.playerCount() > 1) {
      if (thisRef._isPlaying) {
        goog.dom.setTextContent(thisRef._startGameBtn.getElement(), 'Start Game');
        thisRef._playerListUI.enable();
        thisRef._disposeBoard();
        goog.dom.setTextContent(thisRef._statusBarDom, drecco.sudokill.MainUI.ADD_PLAYER_MSG);
        thisRef._saveScoreBtn.setEnabled(false);
      }
      else {
        goog.dom.setTextContent(thisRef._startGameBtn.getElement(), 'New Game');
        thisRef._playerListUI.disable();
        thisRef._createBoard(filledCellSelect.getSelectedIndex() *
          drecco.sudokill.MainUI.FILL_CELL_INTERVAL);
        thisRef._startGameBtn.setEnabled(false);
      }

      thisRef._isPlaying = !thisRef._isPlaying;
    }
  };

  /**
   * Handler for the save score button.
   */
  var handleSaveScore = function(e) {
    var thisRef = self;
    var query = new goog.Uri.QueryData();
    query.add('task', drecco.sudokill.MainUI.GAME_NAME);
    query.add('winner', thisRef.getWinner());
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
 * @constant
 * @type {string}
 */
drecco.sudokill.MainUI.ADD_PLAYER_MSG = 'Add at least 2 players then press start to begin.';

/**
 * @constant
 * @type {string}
 */
drecco.sudokill.MainUI.GAME_NAME = 'sudokilljs';

/**
 * @constant
 * @type {number}
 */
drecco.sudokill.MainUI.FILL_CELL_INTERVAL = 10;

/**
 * @param {drecco.sudokill.GameOverEvent} e
 * @private
 */
drecco.sudokill.MainUI.prototype._handleGameOver = function(e) {
  var message = goog.string.buildString(e.getName(), ' won!');

  goog.dom.setTextContent(this._statusBarDom, message);
  this._startGameBtn.setEnabled(true);
  this._saveScoreBtn.setEnabled(true);
};

/**
 * @param {drecco.sudokill.NextTurnEvent} e
 * @private
 */
drecco.sudokill.MainUI.prototype._handleNextTurn = function(e) {
  var name = e.getPlayer().name();
  this._dispNextPlayer(name);
};

/**
 * Displays the next player to move on the status bar.
 * 
 * @param {string} playerName The name of the player.
 * @private
 */
drecco.sudokill.MainUI.prototype._dispNextPlayer = function(playerName) {
  var message = goog.string.buildString('Player to move: ', playerName);

  goog.dom.setTextContent(this._statusBarDom, message);
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

  this._activePlayerList = this._playerListUI.getPlayers();
  this._gameState = new drecco.sudokill.BoardUI(filledCell,
    this._activePlayerList, this._boardDom);

  goog.events.listen(this._gameState, drecco.sudokill.EventType.GAME_OVER,
    this._handleGameOver, false, this);
  goog.events.listen(this._gameState, drecco.sudokill.EventType.NEXT_TURN,
    this._handleNextTurn, false, this);
  goog.events.listen(this._gameState, drecco.sudokill.EventType.ELIM_PLAYER,
    function(e) {
      var player = e.getName();
      var dialog = new goog.ui.Dialog();
      dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
      dialog.setContent('<div>' + player + ' got eliminated.</div>');
      dialog.setVisible(true);
  });

  this._dispNextPlayer(this._activePlayerList.getCurrentPlayer().name());
};

/**
 * @return {string} the string containing the name of the winner.
 */
drecco.sudokill.MainUI.prototype.getWinner = function() {
  return this._activePlayerList.getCurrentPlayer().name();
};

/**
 * @return {string} the score.
 */
drecco.sudokill.MainUI.prototype.getWinnerScore = function() {
  return this._gameState.getSteps() + 'steps';
};

/**
 * Creates a drop down select control that contains numbers from 0 to
 * the specified maximum number.
 * 
 * @param {number} max The maximum number.
 * @param {number} defVal The default value for the select control.
 * @private
 */
drecco.sudokill.MainUI._filledCellSelect = function(max, defVal) {
  var select = new goog.ui.Select(null);
  var x;

  for (x = 0; x <= max; x += drecco.sudokill.MainUI.FILL_CELL_INTERVAL) {
    select.addItem(new goog.ui.MenuItem(x.toString()));
  }

  select.setSelectedIndex(defVal / drecco.sudokill.MainUI.FILL_CELL_INTERVAL);
  select.setScrollOnOverflow(true);

  return select;
};

