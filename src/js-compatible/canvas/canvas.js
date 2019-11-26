"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var THREE = _interopRequireWildcard(require("three"));

var PIXI = _interopRequireWildcard(require("pixi.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graphics3D = function Graphics3D() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  _classCallCheck(this, Graphics3D);

  this.id = id;
  this.domObject = void 0;
  this.domObject = new THREE.WebGLRenderer().domElement;
};

var Graphics2D = function Graphics2D() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  _classCallCheck(this, Graphics2D);

  this.id = id;
  this.domObject = void 0;
  this.domObject = new PIXI.Application().view;
};

var graphics3 = new Graphics3D(0);
var graphics2 = new Graphics2D(1);
console.log(graphics2.domObject);
console.log(graphics3.domObject);
//# sourceMappingURL=canvas.js.map
