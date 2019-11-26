"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "inv", {
  enumerable: true,
  get: function get() {
    return _mathjs.inv;
  }
});
Object.defineProperty(exports, "det", {
  enumerable: true,
  get: function get() {
    return _mathjs.det;
  }
});
Object.defineProperty(exports, "add", {
  enumerable: true,
  get: function get() {
    return _mathjs.add;
  }
});
Object.defineProperty(exports, "subtract", {
  enumerable: true,
  get: function get() {
    return _mathjs.subtract;
  }
});
Object.defineProperty(exports, "multiply", {
  enumerable: true,
  get: function get() {
    return _mathjs.multiply;
  }
});
Object.defineProperty(exports, "cross", {
  enumerable: true,
  get: function get() {
    return _mathjs.cross;
  }
});
exports.dot = void 0;

var _mathjs = require("mathjs");

var _d = true;
/* This is a module that provides all kinds of
 * mathematical tools, data structures, and classes
 */

var dot = function dot(a, b) {
  var sum = 0;

  for (var i = 0; i < Math.min(a.length, b.length); i++) {
    sum += a[i] * b[i];
  }

  return sum;
};

exports.dot = dot;
//# sourceMappingURL=utility.js.map
