"use strict";

/* jshint esversion: 6 */
window.$ = window.jQuery = require("jquery");

require("../css/pendulum.css");

var math = require('./math.js');

var UI = require('./ui.js');

$(function () {
  UI.loadTags();
  UI.loadShelves();
  UI.loadReference();
});
//# sourceMappingURL=pendulum.js.map
