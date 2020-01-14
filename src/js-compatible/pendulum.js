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
  graphics.g3d.addGrid(function (intervals, holder) {
    /*[x:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],minor:[...]],
     *                                     y:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],...],...]
     */
    for (var i = 0; i < intervals.length; i++) {
      var i_1 = (i + 1) % intervals.length;
      var v1Min = intervals[i_1][0],
          v1Max = intervals[i_1][1];
      var i_2 = (i + 2) % intervals.length;
      var v2Min = intervals[i_2][0],
          v2Max = intervals[i_2][1];
      var i_3 = (i + 1) % 2;
      var vMin = intervals[i_3][0],
          vMax = intervals[i_3][1];
      var majorLines = holder[i][0];
      var minorLines = holder[i][1];
      var index = 0;
      var gap = 5; // for(let j = 0; j<majorLines.length; j++)
      //     majorLines[j]=[0,0,0];
      // for(let j = 0; j<minorLines.length; j++)
      //     minorLines[j]=[0,0,0];

      for (var j = Math.round(v1Min / gap) * gap + gap; j <= v1Max - gap; j += gap) {
        for (var k = Math.round(v2Min / gap) * gap + gap; k <= v2Max - gap; k += gap) {
          var coord = [0, 0, 0];
          coord[i_1] = j;
          coord[i_2] = k;
          majorLines[index] = coord;
          index++;
        }
      }

      index = 0;

      if (i != 2) {
        for (var _j2 = Math.round(vMin); _j2 <= vMax; _j2 += 0.5) {
          var _coord2 = [0, 0, 0];
          _coord2[i_3] = _j2;
          minorLines[index] = _coord2;
          index++;
        }
      }
    }

    return holder;
  });

  var main = require('./main').main;

  main(graphics.g2d);
});
//# sourceMappingURL=pendulum.js.map
