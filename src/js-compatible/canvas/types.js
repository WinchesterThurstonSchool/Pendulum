"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parametric3V = exports.Parametric2V = exports.Parametric1v = exports.Function2V = exports.Function1V = exports.Solid = exports.Surface = exports.Curve = exports.Dataset = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dataset = function Dataset() {
  _classCallCheck(this, Dataset);

  this.id = void 0;
};

exports.Dataset = Dataset;

var Curve =
/*#__PURE__*/
function (_Dataset) {
  _inherits(Curve, _Dataset);

  function Curve(id) {
    var _this;

    _classCallCheck(this, Curve);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Curve).call(this));
    _this.id = id;
    _this.vertices = [];
    return _this;
  }

  _createClass(Curve, [{
    key: "initialize",
    value: function initialize(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "update",
    value: function update(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Curve;
}(Dataset);

exports.Curve = Curve;

var Surface =
/*#__PURE__*/
function (_Dataset2) {
  _inherits(Surface, _Dataset2);

  function Surface(id) {
    var _this2;

    _classCallCheck(this, Surface);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Surface).call(this));
    _this2.id = id;
    _this2.vertices = [];
    _this2.faces = [];
    return _this2;
  }

  _createClass(Surface, [{
    key: "initialize",
    value: function initialize(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "update",
    value: function update(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Surface;
}(Dataset);

exports.Surface = Surface;

var Solid =
/*#__PURE__*/
function (_Dataset3) {
  _inherits(Solid, _Dataset3);

  function Solid(id) {
    var _this3;

    _classCallCheck(this, Solid);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Solid).call(this));
    _this3.id = id;
    return _this3;
  }

  _createClass(Solid, [{
    key: "initialize",
    value: function initialize(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "update",
    value: function update(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Solid;
}(Dataset);

exports.Solid = Solid;

var Function1V =
/*#__PURE__*/
function (_Curve) {
  _inherits(Function1V, _Curve);

  function Function1V() {
    _classCallCheck(this, Function1V);

    return _possibleConstructorReturn(this, _getPrototypeOf(Function1V).apply(this, arguments));
  }

  _createClass(Function1V, [{
    key: "update",
    value: function update(locator, vertices) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "f",
    value: function f(x) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Function1V;
}(Curve);

exports.Function1V = Function1V;

var Function2V =
/*#__PURE__*/
function (_Surface) {
  _inherits(Function2V, _Surface);

  function Function2V() {
    _classCallCheck(this, Function2V);

    return _possibleConstructorReturn(this, _getPrototypeOf(Function2V).apply(this, arguments));
  }

  _createClass(Function2V, [{
    key: "update",
    value: function update(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "f",
    value: function f(x, y) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Function2V;
}(Surface);

exports.Function2V = Function2V;

var Parametric1v =
/*#__PURE__*/
function (_Curve2) {
  _inherits(Parametric1v, _Curve2);

  function Parametric1v() {
    _classCallCheck(this, Parametric1v);

    return _possibleConstructorReturn(this, _getPrototypeOf(Parametric1v).apply(this, arguments));
  }

  _createClass(Parametric1v, [{
    key: "update",
    value: function update(locator, vertices) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "f",
    value: function f(u) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Parametric1v;
}(Curve);

exports.Parametric1v = Parametric1v;

var Parametric2V =
/*#__PURE__*/
function (_Surface2) {
  _inherits(Parametric2V, _Surface2);

  function Parametric2V() {
    _classCallCheck(this, Parametric2V);

    return _possibleConstructorReturn(this, _getPrototypeOf(Parametric2V).apply(this, arguments));
  }

  _createClass(Parametric2V, [{
    key: "update",
    value: function update(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "f",
    value: function f(u, v) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Parametric2V;
}(Surface);

exports.Parametric2V = Parametric2V;

var Parametric3V =
/*#__PURE__*/
function (_Solid) {
  _inherits(Parametric3V, _Solid);

  function Parametric3V() {
    _classCallCheck(this, Parametric3V);

    return _possibleConstructorReturn(this, _getPrototypeOf(Parametric3V).apply(this, arguments));
  }

  _createClass(Parametric3V, [{
    key: "update",
    value: function update(locator, vertices, faces) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "f",
    value: function f(u, v, w) {
      throw new Error("Method not implemented.");
    }
  }]);

  return Parametric3V;
}(Solid);

exports.Parametric3V = Parametric3V;
//# sourceMappingURL=types.js.map
