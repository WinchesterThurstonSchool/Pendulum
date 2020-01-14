"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THREEGraph = exports.PIXIGraph = exports.THREEGrid = exports.PIXIGrid = exports.Graph = void 0;

var THREE = _interopRequireWildcard(require("three"));

var PIXI = _interopRequireWildcard(require("pixi.js"));

var _types = require("./types");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var Graph = function Graph(id, graphics) {
  _classCallCheck(this, Graph);

  this.id = id;
  this.graphics = graphics;
  this.initialized = false;
}
/**
 * Initializes the graphable object in Graph based on the intervals specified,
 * instantiates reusable objects if needed for the first time
 * @param intervals [[xbegin, xend], [ybegin, yend]...] in virtual coordinates
 */
;
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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PIXIGraph).call(this, dataset.id, graphics));
    _this.dataset = dataset;
    _this.color = color;
    _this.PIXIObject = void 0;
    _this.vertices = void 0;
    _this.PIXIObject = new PIXI.Graphics();
    _this.vertices = [];
    return _this;
  }

  _createClass(PIXIGraph, [{
    key: "initialize",
    value: function initialize(intervals) {
      if (this.initialized) return;
      this.dataset.initialize(this.graphics.lc, intervals, this.vertices);
      this.initialized = true;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.PIXIObject.clear();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.vertices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var vertex = _step.value;
          vertex.set(0, 0, 0);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "update",
    value: function update(intervals) {
      this.clear();
      this.dataset.update(this.graphics.lc, intervals, this.vertices);

      if (this.dataset instanceof _types.Function1V) {
        this.PIXIObject.moveTo(this.vertices[0].x, this.vertices[0].y);
        this.PIXIObject.lineStyle(1.5, this.color);

        for (var i = 1; i < this.vertices.length; i++) {
          this.PIXIObject.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
      }
    }
  }]);

  return PIXIGraph;
}(Graph);

exports.PIXIGraph = PIXIGraph;

var PIXIGrid =
/*#__PURE__*/
function (_Graph2) {
  _inherits(PIXIGrid, _Graph2);

  function PIXIGrid(id, graphics, marksFunction) {
    var _this2;

    var gridStyle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      axisColors: [0xff0000, 0x00ff00, 0x0000ff],
      origin: [0, 0, 0],
      pointer: "arrow",
      pointerSize: 2,
      markColors: [[0x999999, 0xeeeeee], [0x999999, 0xeeeeee], [0x999999, 0xeeeeee]]
    };

    _classCallCheck(this, PIXIGrid);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(PIXIGrid).call(this, id, graphics));
    _this2.marksFunction = marksFunction;
    _this2.gridStyle = gridStyle;
    _this2.PIXIObject = new PIXI.Graphics();
    return _this2;
  }

  _createClass(PIXIGrid, [{
    key: "initialize",
    value: function initialize(intervals) {}
  }, {
    key: "update",
    value: function update(intervals) {
      //Geometry definition
      var size = 2000;
      this.PIXIObject.clear();
      var lc = this.graphics.lc;
      var marks = this.marksFunction(intervals);

      for (var i = 0; i < marks.length; i++) {
        var vMarks = marks[i];

        for (var j = 0; j < vMarks.length; j++) {
          var _color = this.gridStyle.markColors[i][j];
          this.PIXIObject.lineStyle(1 / (j + 2), _color);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = vMarks[j][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var v = _step2.value;
              v[i] = intervals[i][0]; // console.log(v);

              this.PIXIObject.moveTo(lc.X.apply(lc, _toConsumableArray(v)), lc.Y.apply(lc, _toConsumableArray(v)));
              v[i] = intervals[i][1]; // console.log(v);

              this.PIXIObject.lineTo(lc.X.apply(lc, _toConsumableArray(v)), lc.Y.apply(lc, _toConsumableArray(v)));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        var axisColor = this.gridStyle.axisColors[i];
        this.PIXIObject.lineStyle(2, axisColor);
        var begin = this.gridStyle.origin.slice();
        var end = this.gridStyle.origin.slice();
        begin[i] = intervals[i][0];
        end[i] = intervals[i][1];
        this.PIXIObject.moveTo(lc.X.apply(lc, _toConsumableArray(begin)), lc.Y.apply(lc, _toConsumableArray(begin)));
        this.PIXIObject.lineTo(lc.X.apply(lc, _toConsumableArray(end)), lc.Y.apply(lc, _toConsumableArray(end)));
      }
    }
  }]);

  return PIXIGrid;
}(Graph);

exports.PIXIGrid = PIXIGrid;

var THREEGrid =
/*#__PURE__*/
function (_Graph3) {
  _inherits(THREEGrid, _Graph3);

  function THREEGrid(id, graphics, marksFunction) {
    var _this3;

    var gridStyle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      axisColors: [0xff0000, 0x00ff00, 0x0000ff],
      origin: [0, 0, 0],
      pointer: "arrow",
      pointerSize: 2,
      markColors: [[0x999999, 0xeeeeee], [0x999999, 0xeeeeee], [0x999999, 0xeeeeee]]
    };

    _classCallCheck(this, THREEGrid);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(THREEGrid).call(this, id, graphics));
    _this3.marksFunction = marksFunction;
    _this3.gridStyle = gridStyle;
    _this3.lines = [];
    _this3.THREEObject = void 0;
    _this3.lineCount = void 0;
    _this3.THREEObject = new THREE.Group();
    return _this3;
  }

  _createClass(THREEGrid, [{
    key: "initialize",
    value: function initialize(intervals) {}
  }, {
    key: "clear",
    value: function clear() {
      this.lineCount = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.lines[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var line = _step3.value;
          line.geometry.vertices[0].set(0, 0, 0);
          line.geometry.vertices[1].set(0, 0, 0);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(a, b, color, width) {
      if (this.lines[this.lineCount] == undefined) {
        // let geometry = new THREE.Geometry();
        // geometry.vertices.push(new Vector3(...a));
        // geometry.vertices.push(new Vector3(...b));
        // let material = new MeshLineMaterial({
        //     useMap: false,
        //     color: new THREE.Color(color),
        //     opacity: 1,
        //     sizeAttenuation: !false,
        //     lineWidth: .01,
        //     near: (this.graphics as Graphics3D).camera.near,
        //     far: (this.graphics as Graphics3D).camera.far
        // });
        // let line = new MeshLine();
        // this.lines[this.lineCount]=line;
        // line.setGeometry(geometry);
        // var mesh = new THREE.Mesh(line.geometry, material); // this syntax could definitely be improved!
        // this.THREEObject.add(mesh);
        var geometry = new THREE.Geometry();
        geometry.vertices.push(_construct(THREE.Vector3, _toConsumableArray(a)));
        geometry.vertices.push(_construct(THREE.Vector3, _toConsumableArray(b)));

        var _material = new THREE.LineBasicMaterial({
          color: color,
          linewidth: width
        });

        this.lines[this.lineCount] = new THREE.Line(geometry, _material);
        this.THREEObject.add(this.lines[this.lineCount]);
      } else {
        var line = this.lines[this.lineCount];
        line.geometry.vertices[0].set(a[0], a[1], a[2]);
        line.geometry.vertices[1].set(b[0], b[1], b[2]);
        line.material.color.setHex(color);
        line.material.linewidth = width;
        line.geometry.verticesNeedUpdate = true;
      }

      this.lineCount++;
    }
  }, {
    key: "update",
    value: function update(intervals) {
      var lc = this.graphics.lc;
      this.clear();
      var marks = this.marksFunction(intervals);

      for (var i = 0; i < marks.length; i++) {
        var vMarks = marks[i];

        for (var j = vMarks.length - 1; j >= 0; j--) {
          var _color2 = this.gridStyle.markColors[i][j];
          var _lineWidth = 0.1;
          var next1CoordSameLevel = marks[(i + 1) % marks.length][j],
              next2CoordSameLevel = marks[(i + 2) % marks.length][j]; // if(next1CoordSameLevel==undefined||next1CoordSameLevel.length==0)
          //     next1CoordSameLevel = next2CoordSameLevel;
          // if(next2CoordSameLevel == undefined||next2CoordSameLevel.length==0){
          //     next2CoordSameLevel = next1CoordSameLevel;
          //     if(next2CoordSameLevel == undefined||next2CoordSameLevel.length==0){
          //         next1CoordSameLevel=next2CoordSameLevel = [[0,0,0]]
          //     }
          // }

          var min = Math.min(next1CoordSameLevel[0][i], next2CoordSameLevel[0][i]);
          var max = Math.max(next1CoordSameLevel[next1CoordSameLevel.length - 1][i], next2CoordSameLevel[next2CoordSameLevel.length - 1][i]);
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = vMarks[j][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var v = _step4.value;
              v[i] = min;

              var _vertexA = lc.XYZ.apply(lc, _toConsumableArray(v));

              v[i] = max;

              var _vertexB = lc.XYZ.apply(lc, _toConsumableArray(v));

              this.draw(_vertexA, _vertexB, _color2, _lineWidth);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }

        var axisColor = this.gridStyle.axisColors[i];
        var lineWidth = 0.5;
        var begin = this.gridStyle.origin.slice();
        var end = this.gridStyle.origin.slice();
        begin[i] = -25;
        var vertexA = lc.XYZ.apply(lc, _toConsumableArray(begin));
        end[i] = 25;
        var vertexB = lc.XYZ.apply(lc, _toConsumableArray(end));
        this.draw(vertexA, vertexB, axisColor, lineWidth);
      }
    }
  }]);

  return THREEGrid;
}(Graph);
/**
 * dataset representations through THREE
 */


exports.THREEGrid = THREEGrid;

var THREEGraph =
/*#__PURE__*/
function (_Graph4) {
  _inherits(THREEGraph, _Graph4);

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
    var _this4;

    var material = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : materials.standard;

    _classCallCheck(this, THREEGraph);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(THREEGraph).call(this, dataset.id, graphics)); //Inject color into the material 
    //@ts-ignore

    _this4.dataset = dataset;
    _this4.color = color;
    _this4.material = material;
    _this4.THREEObject = void 0;
    _this4.geometry = void 0;
    _this4.vertices = void 0;
    _this4.faces = void 0;
    material.color = color;
    _this4.geometry = new THREE.Geometry();
    _this4.faces = _this4.geometry.faces;
    _this4.vertices = _this4.geometry.vertices;
    _this4.THREEObject = new THREE.Mesh(_this4.geometry, material);
    return _this4;
  }

  _createClass(THREEGraph, [{
    key: "initialize",
    value: function initialize(intervals) {
      if (this.initialized) return;
      this.dataset.initialize(this.graphics.lc, intervals, this.vertices, this.faces);
    }
  }, {
    key: "update",
    value: function update(intervals) {
      this.dataset.update(this.graphics.lc, intervals, this.vertices, this.faces);
    }
  }]);

  return THREEGraph;
}(Graph);

exports.THREEGraph = THREEGraph;
//# sourceMappingURL=graph.js.map
