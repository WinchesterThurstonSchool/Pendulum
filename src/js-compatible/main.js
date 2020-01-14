"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

var _types = require("./canvas/types");

function main(graphics) {
  var data = new _types.Function1V("sin", function (x) {
    return Math.sin(x);
  });
  graphics.addDataset(data, 0x56789f);
}
//# sourceMappingURL=main.js.map
