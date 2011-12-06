goog.provide('drecco.sudokill.PlayerListUI');

goog.require('goog.structs.CircularBuffer');
goog.require('goog.string');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Button');
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
  var self = this;
  this._namesAdded = new goog.structs.StringSet();

  var playerListDom = goog.dom.createDom('td');

  var addPlayerInDom = goog.dom.createDom('div', { 'class': 'add-player-input' });
  var addPlayerInput = new goog.ui.LabelInput();

  var addPlayerDom = goog.dom.createDom('div', { 'class': 'add-player-btn' });
  this._addPlayerBtn = new goog.ui.Button('Add Player',
    goog.ui.FlatButtonRenderer.getInstance());

  this._playerTableBodyDom = goog.dom.createDom('tbody', {});
  var playerTableDom = goog.dom.createDom('table', { 'class': 'player-table' },
    playerListDom, this._playerTableBodyDom);

  var fullGUIDom = goog.dom.createDom('div', { 'id': 'player-list' }, addPlayerInDom,
    addPlayerDom, playerTableDom);

  goog.dom.appendChild(node, fullGUIDom);

  var addPlayerHandler = function(e) {
    var input = addPlayerInput;
    var name = input.getValue();
    var newPlayerColDom;
    var newPlayerRowDom;

    if (!goog.string.isEmptySafe(name) && !self._namesAdded.contains(name)) {
      self._namesAdded.add(name);

      newPlayerColDom = goog.dom.createDom('td', { 'class': 'player-list-table-col' });
      newPlayerRowDom = goog.dom.createDom('tr', { 'class': 'player-list-table-row' },
        newPlayerColDom);

      goog.dom.setTextContent(newPlayerColDom, name);
      goog.dom.appendChild(self._playerTableBodyDom, newPlayerRowDom);

      input.clear();
    }
  };

  addPlayerInput.render(addPlayerInDom);

  this._addPlayerBtn.render(addPlayerDom);
  goog.events.listen(this._addPlayerBtn, goog.ui.Component.EventType.ACTION, addPlayerHandler);
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

