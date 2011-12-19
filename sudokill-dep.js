// This file was autogenerated by /usr/lib/closure-library/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../../src/board.js', ['drecco.sudokill.Board'], ['drecco.sudokill.Move', 'goog.structs.Set']);
goog.addDependency('../../src/board_factory.js', ['drecco.sudokill.BoardFactory'], ['drecco.sudokill.Board', 'drecco.sudokill.Move', 'drecco.sudokill.RandomStrategy', 'goog.structs.PriorityQueue']);
goog.addDependency('../../src/board_ui.js', ['drecco.sudokill.BoardUI'], ['drecco.sudokill.BoardFactory', 'drecco.sudokill.EliminatedEvent', 'drecco.sudokill.GameOverEvent', 'drecco.sudokill.NextTurnEvent', 'goog.dom.classes', 'goog.events.EventTarget', 'goog.structs', 'goog.ui.Dialog', 'goog.ui.Palette', 'goog.ui.PaletteRenderer']);
goog.addDependency('../../src/drecco_bootstrap.js', ['drecco.sudokill.Bootstrap'], ['drecco.sudokill.MainUI', 'goog.dom']);
goog.addDependency('../../src/elim_event.js', ['drecco.sudokill.EliminatedEvent'], ['drecco.sudokill.EventType', 'goog.events.Event']);
goog.addDependency('../../src/event_type.js', ['drecco.sudokill.EventType'], ['goog.events']);
goog.addDependency('../../src/gameover_event.js', ['drecco.sudokill.GameOverEvent'], ['drecco.sudokill.EventType', 'goog.events.Event']);
goog.addDependency('../../src/main_ui.js', ['drecco.sudokill.MainUI'], ['drecco.sudokill.BoardUI', 'drecco.sudokill.EventType', 'drecco.sudokill.PlayerListUI', 'goog.Uri', 'goog.dom', 'goog.events', 'goog.events.EventType', 'goog.string', 'goog.string.StringBuffer', 'goog.ui.Button', 'goog.ui.Dialog', 'goog.ui.FlatButtonRenderer', 'goog.ui.MenuItem', 'goog.ui.Select']);
goog.addDependency('../../src/move.js', ['drecco.sudokill.Move'], ['goog.functions', 'goog.string']);
goog.addDependency('../../src/nextturn_event.js', ['drecco.sudokill.NextTurnEvent'], ['drecco.sudokill.EventType', 'goog.events.Event']);
goog.addDependency('../../src/player.js', ['drecco.sudokill.Player'], []);
goog.addDependency('../../src/player_list.js', ['drecco.sudokill.PlayerList'], ['goog.structs']);
goog.addDependency('../../src/player_list_ui.js', ['drecco.sudokill.PlayerListUI'], ['drecco.sudokill.Player', 'drecco.sudokill.PlayerList', 'goog.dom', 'goog.events', 'goog.events.EventType', 'goog.string', 'goog.structs.CircularBuffer', 'goog.structs.StringSet', 'goog.ui.Button', 'goog.ui.CustomButton', 'goog.ui.FlatButtonRenderer', 'goog.ui.LabelInput']);
goog.addDependency('../../src/random_strategy.js', ['drecco.sudokill.RandomStrategy'], ['drecco.sudokill.Move', 'drecco.sudokill.Util']);
goog.addDependency('../../src/util.js', ['drecco.sudokill.Util'], []);
