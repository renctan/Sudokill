/**
 * Contains the UI implementation for displaying the list of players.
 */

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

  var addPlayerInDom = goog.dom.createDom('div', { id: 'add-player-input' });
  this._addPlayerInput = new goog.ui.LabelInput();

  var addPlayerDom = goog.dom.createDom('div', { id: 'add-player-btn' });
  this._addPlayerBtn = new goog.ui.Button('Add Player',
    goog.ui.FlatButtonRenderer.getInstance());

  this._playerTableDom = goog.dom.createDom('div', 'player-table');

  var fullGUIDom = goog.dom.createDom('div', { id: 'player-list' }, addPlayerInDom,
    addPlayerDom, this._playerTableDom);

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
  var nameDom, btnDom;
  var rmBtn, upBtn, downBtn;
  var newPlayerDom;
  var insertionPtDom;

  if (!goog.string.isEmptySafe(name) && !this._namesAdded.contains(name)) {
    this._namesAdded.add(name);

    nameDom = goog.dom.createDom('div', 'player-list-entry-name');
    goog.dom.setTextContent(nameDom, name);
    btnDom = goog.dom.createDom('div', 'player-list-entry-btngrp');
    newPlayerDom = goog.dom.createDom('div', 'player-list-entry', nameDom, btnDom);

    rmBtn = new goog.ui.CustomButton(null);
    rmBtn.addClassName('player-list-icon');
    rmBtn.addClassName('player-list-rm');
    rmBtn.render(btnDom);
    goog.events.listen(rmBtn, goog.ui.Component.EventType.ACTION, function(e) {
      goog.dom.removeNode(newPlayerDom);
    });

    upBtn = new goog.ui.CustomButton(null);
    upBtn.addClassName('player-list-icon');
    upBtn.addClassName('player-list-up');
    upBtn.render(btnDom);
    goog.events.listen(upBtn, goog.ui.Component.EventType.ACTION, function(e) {
      insertionPtDom = goog.dom.getPreviousElementSibling(newPlayerDom);

      if (insertionPtDom != null) {
        goog.dom.removeNode(newPlayerDom);
        goog.dom.insertSiblingBefore(newPlayerDom, insertionPtDom);
      }
    });

    downBtn = new goog.ui.CustomButton(null);
    downBtn.addClassName('player-list-icon');
    downBtn.addClassName('player-list-down');
    downBtn.render(btnDom);
    goog.events.listen(downBtn, goog.ui.Component.EventType.ACTION, function(e) {
      insertionPtDom = goog.dom.getNextElementSibling(newPlayerDom);

      if (insertionPtDom != null) {
        goog.dom.removeNode(newPlayerDom);
        goog.dom.insertSiblingAfter(newPlayerDom, insertionPtDom);
      }
    });

    goog.dom.appendChild(this._playerTableDom, newPlayerDom);

    input.clear();
  }
};

/**
 * @return {number} the number of players.
 */
drecco.sudokill.PlayerListUI.prototype.playerCount = function() {
  return goog.dom.getChildren(this._playerTableDom).length;
};

/**
 * @return {drecco.sudokill.PlayerList} the list of players.
 */
drecco.sudokill.PlayerListUI.prototype.getPlayers = function() {
  var rowDom = goog.dom.getFirstElementChild(this._playerTableDom);
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

