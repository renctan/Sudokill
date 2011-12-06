/**
 * Bootstrap js file for loading the entire Sudokill UI to the html page.
 * Requires the page to have a div with "board" as id.
 */

goog.provide('drecco.sudokill.Bootstrap');

goog.require('goog.dom');
goog.require('drecco.sudokill.MainUI');

(function() {
  var ui = new drecco.sudokill.MainUI(goog.dom.getElement('board'));
})();

