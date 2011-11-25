goog.require("nyu.drecco.sudokill.Board");
goog.require("goog.testing.jsunit");

var board = null;

var setUp = function() {
  board = new Board();
};

var testSimpleSet = function(){
  assert(board.set(1, 1, 3));
  assertEquals(3, board.get(1, 1));
};

var testBadSet = function(){
  assertFalse(board.set(9, 1, 3));
};

