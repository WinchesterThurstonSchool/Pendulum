"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THREEGraph = exports.PIXIGraph = exports.Graph = void 0;

var THREE = _interopRequireWildcard(require("three"));

var PIXI = _interopRequireWildcard(require("pixi.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var materials = {
  standard: new THREE.MeshPhongMaterial({
    opacity: 0.8,
    transparent: true,
    side: THREE.DoubleSide,
    color: 0x7890ab
  }),
  opaque: new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    color: 0x7890ab
  }),
  flat: new THREE.MeshBasicMaterial({
    color: 0x7890ab,
    opacity: 0.8,
    transparent: true
  }),
  line: new THREE.LineBasicMaterial({
    color: 0x7890ab,
    opacity: 0.8
  })
};
/**
 * Each Graph provides an interface for specific
 * datasets to interact with the graphics library
 */

var Graph = function Graph(dataset, graphics, color, material) {
  _classCallCheck(this, Graph);

  this.dataset = dataset;
  this.graphics = graphics;
  this.color = color;
  this.material = material;
  this.id = void 0;
  this.initialized = false;
  this.id = dataset.id;
};
/**
 * dataset representations through PIXI
 */


exports.Graph = Graph;

var PIXIGraph =
/*#__PURE__*/
function (_Graph) {
  _inherits(PIXIGraph, _Graph);

  function PIXIGraph(dataset, graphics, color) {
    var _this;

    _classCallCheck(this, PIXIGraph);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PIXIGraph).call(this, dataset, graphics, color));
    _this.PIXIObject = void 0;
    _this.vertices = void 0;
    _this.PIXIObject = new PIXI.Graphics();
    _this.vertices = [];
    return _this;
  }

  _createClass(PIXIGraph, [{
    key: "initialize",
    value: function initialize() {
      if (this.initialized) return;
      this.dataset.initialize(this.graphics.lc, this.vertices);
      this.initialized = true;
    }
  }, {
    key: "update",
    value: function update() {
      this.dataset.update(this.graphics.lc, this.vertices);
    }
  }]);

  return PIXIGraph;
}(Graph);
/**
 * dataset representations through THREE
 */


exports.PIXIGraph = PIXIGraph;

var THREEGraph =
/*#__PURE__*/
function (_Graph2) {
  _inherits(THREEGraph, _Graph2);

  _createClass(THREEGraph, null, [{
    key: "getMaterial",
    value: function getMaterial(color, material, opacity) {
      return new material({
        opacity: 0.8,
        transparent: opacity === 1 ? false : true,
        side: THREE.DoubleSide,
        color: 0x7890ab
      });
    }
  }]);

  function THREEGraph(dataset, graphics, color) {
    var _this2;

    var material = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : materials.standard;

    _classCallCheck(this, THREEGraph);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(THREEGraph).call(this, dataset, graphics, color, material)); //Inject color into the material 
    //@ts-ignore

    _this2.THREEObject = void 0;
    _this2.geometry = void 0;
    _this2.vertices = void 0;
    _this2.faces = void 0;
    material.color = color;
    _this2.geometry = new THREE.Geometry();
    _this2.faces = _this2.geometry.faces;
    _this2.vertices = _this2.geometry.vertices;
    _this2.THREEObject = new THREE.Mesh(_this2.geometry, material);
    return _this2;
  }

  _createClass(THREEGraph, [{
    key: "initialize",
    value: function initialize() {
      if (this.initialized) return;
      this.dataset.initialize(this.graphics.lc, this.vertices, this.faces);
      this.initialized = true;
    }
  }, {
    key: "update",
    value: function update() {
      this.dataset.update(this.graphics.lc, this.vertices, this.faces);
    }
  }]);

  return THREEGraph;
}(Graph);

exports.THREEGraph = THREEGraph;
//# sourceMappingURL=graph.js.map
