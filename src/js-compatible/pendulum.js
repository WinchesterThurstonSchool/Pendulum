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
  console.log(canvas);
  var graphics = {
    g2d: new Graphics2D(canvas),
    g3d: new Graphics3D(canvas)
  };
  graphics.g2d.attach();
  graphics.g2d.addGrid(function (intervals, holder) {
    /*[x:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],minor:[...]],
     *                                     y:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],...],...]
     */
    for (var i = 0; i < intervals.length; i++) {
      var i_1 = (i + 1) % intervals.length;
      var vMin = intervals[i_1][0],
          vMax = intervals[i_1][1];
      var majorLines = holder[i][0];
      var minorLines = holder[i][1];
      var index = 0;

      for (var j = Math.round(vMin / 5) * 5; j <= vMax; j += 5) {
        var coord = [0, 0, 0];
        coord[i_1] = j;
        majorLines[index] = coord;
        index++;
      }

      index = 0;

      for (var _j = Math.round(vMin); _j <= vMax; _j += 0.5) {
        var _coord = [0, 0, 0];
        _coord[i_1] = _j;
        minorLines[index] = _coord;
        index++;
      }
    }

    return holder;
  });
});
//# sourceMappingURL=pendulum.js.map
