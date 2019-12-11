"use strict";

/* jshint esversion: 6 */
window.$ = window.jQuery = require("jquery");

require("../css/pendulum.css");

$(function () {
  var utility = require('./utility.js');

  var UI = require('./ui.js');

  UI.loadTags();
  UI.loadShelves();
  UI.loadReference();

  var _require = require('./canvas/graphics.js'),
      Graphics = _require.Graphics,
      Graphics2D = _require.Graphics2D,
      Graphics3D = _require.Graphics3D;

  var canvas = document.getElementById("graphpanel");
  var graphics = {
    g2d: new Graphics2D(canvas),
    g3d: new Graphics3D(canvas)
  };
});
//# sourceMappingURL=pendulum.js.map
