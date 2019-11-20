"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var THREE = require('three'); //The class that converts virtual coordinate system to its graphics presentation


var Locator =
/*#__PURE__*/
function () {
  function Locator() {
    _classCallCheck(this, Locator);

    this.unitRatio = 1.5;
    this.scalex = 1;
    this.scaley = 1;
    this.deltax = 1;
    this.deltay = 1;
    this.deltaX = 0;
    this.deltaY = 0;
  }

  _createClass(Locator, [{
    key: "X",
    value: function X(vertex) {
      return width / 2 + int((x + deltax) * dpi * scalex) + deltaX;
    } // public int X(float x, float y) {
    //     return width / 2 + (int)((x + deltax) * dpi * scalex) + deltaX;
    // }
    // public int Y(float[] vertex) {
    //     return Y(vertex[0], vertex[1]);
    // }
    // public int Y(float x, float y) {
    //     return height / 2 - (int)((y + deltay) * scaley * dpi) - deltaY;
    // }
    // public int Width(float width) {
    //     return X(width, 0) - X(0, 0);
    // }
    // public int Height(float height) {
    //     return Y(0, height) - Y(0, 0);
    // }
    // public float x(int X, int Y) {
    //     return (float)(X - deltaX - width / 2) / dpi / scalex - deltax;
    // }
    // public float y(int X, int Y) {
    //     return (float)(-Y - deltaY + height / 2) / dpi / scaley - deltay;
    // }
    // public float width(int Width) {
    //     return X(Width, 0) - X(0, 0);
    // }
    // public float height(int Height) {
    //     return y(0, Height) - Y(0, 0);
    // }
    // //Pinned zooming
    // public void zoom(int pinX, int pinY, float factorx, float factory) {
    //     float pinx = x(pinX, pinY);
    //     float piny = y(pinX, pinY);
    //     scalex *= factorx;
    //     scaley *= factory;
    //     deltax = (pinx + deltax) / factorx - pinx;
    //     deltay = (piny + deltay) / factory - piny;
    // }

  }]);

  return Locator;
}();

var lc = new Locator();
lc.X(12, 12, 11);
module.exports = Locator;
//# sourceMappingURL=canvas.js.map
