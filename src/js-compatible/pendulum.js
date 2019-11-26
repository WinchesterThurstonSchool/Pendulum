"use strict";

/* jshint esversion: 6 */
window.$ = window.jQuery = require("jquery");

require("../css/pendulum.css");

$(function () {
  var utility = require('./utility.js');

  var UI = require('./ui.js');

  var canvas = require('./canvas/graphics.js');

  var element = document.body;
  UI.loadTags();
  UI.loadShelves();
  UI.loadReference();
});
//# sourceMappingURL=pendulum.js.map
