goog.provide('drecco.sudokill.PlayerListUI');

goog.require('goog.structs.CircularBuffer');
goog.require('goog.string');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.LabelInput');
goog.require('goog.dom');
goog.require('drecco.sudokill.Player');

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

  this._players = [];
  this._currIdx = 0;
  var playerListDom = goog.dom.createDom('td');

  var addPlayerInDom = goog.dom.createDom('div', { 'class': 'add-player-input' });
  var addPlayerInput = new goog.ui.LabelInput();

  var addPlayerDom = goog.dom.createDom('div', { 'class': 'add-player-btn' });
  this._addPlayerBtn = new goog.ui.Button('Add Player',
    goog.ui.FlatButtonRenderer.getInstance());

  var playerTableRowDom = goog.dom.createDom('tr', { 'class': 'player-table-row' });
  var playerTableDom = goog.dom.createDom('table', { 'class': 'player-table' },
    playerListDom, goog.dom.createDom('tbody', {}, playerTableRowDom ));

  var fullGUIDom = goog.dom.createDom('div', { 'class': 'player-list' }, addPlayerInDom,
    addPlayerDom, playerTableDom);

  goog.dom.appendChild(node, fullGUIDom);

  var addPlayerHandler = function(e) {
    var input = addPlayerInput;
    var name = input.getValue();
    var newPlayerDom = goog.dom.createDom('td', { 'class': 'player-list-entry' });
    goog.dom.setTextContent(newPlayerDom, name);

    if (!goog.string.isEmptySafe(name)) {
      self._players.push(new drecco.sudokill.Player(name, true));
      goog.dom.appendChild(playerTableRowDom, newPlayerDom);
      input.clear();
    }
  };

  addPlayerInput.render(addPlayerInDom);

  this._addPlayerBtn.render(addPlayerDom);
  goog.events.listen(this._addPlayerBtn, goog.ui.Component.EventType.ACTION, addPlayerHandler);
};

/**
 * @return {drecco.sudokill.Player} the next player.
 */
drecco.sudokill.PlayerListUI.prototype.next = function() {
  var size = this._players.length;
  var next = null;

  if (size > 0) {
    next = this._players[this._currIdx++];

    if (this._currIdx >= size) {
      this._currIdx = this._currIdx % size;  
    }
  }

  return next;
};

/**
 * @return {drecco.sudokill.Player} the current player.
 */
drecco.sudokill.PlayerListUI.prototype.getCurrentPlayer = function() {
  var player = null;

  if (this._players.length > 0) {
    player = this._players[this._currIdx];
  }

  return player;
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
drecco.sudokill.PlayerListUI.prototype.disable = function() {
  this._addPlayerBtn.setEnabled(true);
};


