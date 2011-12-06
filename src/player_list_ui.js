goog.provide('drecco.sudokill.PlayerListUI');

goog.require('goog.structs.CircularBuffer');
goog.require('goog.string');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Button');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.LabelInput');
goog.require('goog.dom');
goog.require('goog.structs.StringSet');
goog.require('drecco.sudokill.Player');
goog.require('drecco.sudokill.PlayerList');

/**
 * Creates a UI for the player list. There should be only one instance per
 * html page.
 * 
 * @param node {Node} The node where the dom structure containing the UI
 *   will be housed.
 * @constructor
 */
drecco.sudokill.PlayerListUI = function(node) {
  this._namesAdded = new goog.structs.StringSet();

  var playerListDom = goog.dom.createDom('td');

  var addPlayerInDom = goog.dom.createDom('div', { 'class': 'add-player-input' });
  this._addPlayerInput = new goog.ui.LabelInput();

  var addPlayerDom = goog.dom.createDom('div', { 'class': 'add-player-btn' });
  this._addPlayerBtn = new goog.ui.Button('Add Player',
    goog.ui.FlatButtonRenderer.getInstance());

  this._playerTableBodyDom = goog.dom.createDom('tbody', {});
  var playerTableDom = goog.dom.createDom('table', { 'class': 'player-table' },
    playerListDom, this._playerTableBodyDom);

  var fullGUIDom = goog.dom.createDom('div', { 'id': 'player-list' }, addPlayerInDom,
    addPlayerDom, playerTableDom);

  goog.dom.appendChild(node, fullGUIDom);

  this._addPlayerInput.render(addPlayerInDom);
  this._addPlayerBtn.render(addPlayerDom);

  goog.events.listen(this._addPlayerBtn, goog.ui.Component.EventType.ACTION,
    this._addPlayerHandler, false, this);
};

/**
 * @private
 */
drecco.sudokill.PlayerListUI.prototype._addPlayerHandler = function(e) {
  var input = this._addPlayerInput;
  var name = input.getValue();
  var nameColDom, btnColDom;
  var rmBtn, upBtn, downBtn;
  var newPlayerRowDom;
  var insertionPtDom;

  if (!goog.string.isEmptySafe(name) && !this._namesAdded.contains(name)) {
    this._namesAdded.add(name);

    nameColDom = goog.dom.createDom('td', 'player-list-table-col');
    goog.dom.setTextContent(nameColDom, name);
    btnColDom = goog.dom.createDom('td', 'player-list-table-col');

    newPlayerRowDom = goog.dom.createDom('tr', 'player-list-table-row',
                                         nameColDom, btnColDom);

    rmBtn = new goog.ui.CustomButton();
    rmBtn.addClassName('player-list-icon');
    rmBtn.addClassName('player-list-rm');
    rmBtn.render(btnColDom);
    goog.events.listen(rmBtn, goog.ui.Component.EventType.ACTION, function(e) {
      goog.dom.removeNode(newPlayerRowDom);
    });

    upBtn = new goog.ui.CustomButton();
    upBtn.addClassName('player-list-icon');
    upBtn.addClassName('player-list-up');
    upBtn.render(btnColDom);
    goog.events.listen(upBtn, goog.ui.Component.EventType.ACTION, function(e) {
      insertionPtDom = goog.dom.getPreviousElementSibling(newPlayerRowDom);

      if (insertionPtDom != null) {
        goog.dom.removeNode(newPlayerRowDom);
        goog.dom.insertSiblingBefore(newPlayerRowDom, insertionPtDom);
      }
    });

    downBtn = new goog.ui.CustomButton();
    downBtn.addClassName('player-list-icon');
    downBtn.addClassName('player-list-down');
    downBtn.render(btnColDom);
    goog.events.listen(downBtn, goog.ui.Component.EventType.ACTION, function(e) {
      insertionPtDom = goog.dom.getNextElementSibling(newPlayerRowDom);

      if (insertionPtDom != null) {
        goog.dom.removeNode(newPlayerRowDom);
        goog.dom.insertSiblingAfter(newPlayerRowDom, insertionPtDom);
      }
    });

    goog.dom.appendChild(this._playerTableBodyDom, newPlayerRowDom);

    input.clear();
  }
};

/**
 * @return {number} the number of players.
 */
drecco.sudokill.PlayerListUI.prototype.playerCount = function() {
  return goog.dom.getChildren(this._playerTableBodyDom).length;
};

/**
 * @return {drecco.sudokill.PlayerList} the list of players.
 */
drecco.sudokill.PlayerListUI.prototype.getPlayers = function() {
  var rowDom = goog.dom.getFirstElementChild(this._playerTableBodyDom);
  var playerList = [];
  var playerName = '';
  var isAI = false;

  while (rowDom != null) {
    playerName = goog.dom.getTextContent(goog.dom.getFirstElementChild(rowDom));
    playerList.push(new drecco.sudokill.Player(playerName, isAI));

    rowDom = goog.dom.getNextElementSibling(rowDom);
  }

  return new drecco.sudokill.PlayerList(playerList);
};

/**
 * Freezes the UI, preventing the user from adding more new players.
 */
drecco.sudokill.PlayerListUI.prototype.disable = function() {
  this._addPlayerBtn.setEnabled(false);
};

/**
 * Unfreezes the UI, allowing the user to add more new players.
 */
drecco.sudokill.PlayerListUI.prototype.enable = function() {
  this._addPlayerBtn.setEnabled(true);
};

