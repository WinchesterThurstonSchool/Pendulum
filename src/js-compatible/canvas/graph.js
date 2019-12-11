"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THREEGraph = exports.PIXIGraph = exports.Graph = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Each Graph provides an interface for specific
 * datasets to interact with the graphics library
 */
var Graph =
/**
 * Indicates whether the visualization (geometry, vertices, etc.) of this has been initialized
 */
function Graph(dataset, graphics, color, material) {
  _classCallCheck(this, Graph);

  this.id = void 0;
  this.dataset = void 0;
  this.initialized = void 0;
  this.id = dataset.id;
  this.dataset = dataset;
  this.initialized = false;
};
/**
 * dataset representations through PIXI
 */


exports.Graph = Graph;

var PIXIGraph =
/*#__PURE__*/
function () {
  function PIXIGraph() {
    _classCallCheck(this, PIXIGraph);
  }

  _createClass(PIXIGraph, null, [{
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

  return PIXIGraph;
}();
/**
 * dataset representations through THREE
 */


exports.PIXIGraph = PIXIGraph;

var THREEGraph = function THREEGraph() {
  _classCallCheck(this, THREEGraph);
};

exports.THREEGraph = THREEGraph;
//# sourceMappingURL=graph.js.map
