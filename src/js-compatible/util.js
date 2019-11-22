"use strict";

var _mathjs = require("mathjs");

/* This is a module that provides all kinds of
 * mathematical tools, data structures, and classes
 */
// create a mathjs instance with configuration
var config = {
  epsilon: 1e-12,
  matrix: 'Array',
  number: 'number',
  precision: 64,
  predictable: false,
  randomSeed: undefined
};
var math = (0, _mathjs.create)(_mathjs.all, config);
var multiply = math.multiply;
var identity = math.identity;
exports = {
  multiply: multiply,
  identity: identity
};
//# sourceMappingURL=util.js.map
