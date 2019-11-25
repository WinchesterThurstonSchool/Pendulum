"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var utility = _interopRequireWildcard(require("./utility"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//The class that converts virtual coordinate system to its graphics presentation
var Locator =
/*#__PURE__*/
function () {
  //Graphics x : standard x (intrinsic)
  //Graphics y : standard y (intrinsic)
  //Moves virtual coordinate deltax virtual units in the x direction
  //Moves virtual coordinate deltay virtual units in the y direction
  //Transformation matrix used as: C = Ap+B
  //T is the actual matrix that user manipulate to change the transformation
  //Inverse transformation through: c = A^{-1}(C-B)
  function Locator() {
    var _this = this;

    _classCallCheck(this, Locator);

    this.lc = this;
    this.scalex = 1;
    this.scaley = 1;
    this.scalez = 1;
    this.deltax = 1;
    this.deltay = 1;
    this.deltaz = 0;
    this.A = [[1.5, 0, 0], [0, 1.5, 0], [0, 0, 1.5]];

    this.validateT = function (target, property, value) {
      var Ainverse = utility.inv(value);
      if (Ainverse != undefined) _this.Ainverse = Ainverse;else throw new Error('Cannot calculate inverse, determinant is zero');
      target[property] = value;
      return true;
    };

    this.T = new Proxy(this.A, {
      set: this.validateT
    });
    this.B = [0, 0, 0];
    this.Ainverse = void 0;
    this._standardMatrix = [0, 0, 0];
    this._graphicalMatrix = [0, 0, 0];
    this._subtractionMatrix = [0, 0, 0];
    this.Ainverse = utility.inv(this.A);
  }

  _createClass(Locator, [{
    key: "virtualToStandard",

    /**
     * Returns a matrix representing the standard coordinate of coord
     * @param virCoord: a representation of a point in the virtual coordinate
     */
    value: function virtualToStandard(virCoord) {
      this.checkCoord(virCoord);
      this._standardMatrix[0] = (virCoord[0] + this.deltax) * this.scalex;
      this._standardMatrix[1] = (virCoord[1] + this.deltay) * this.scaley;
      this._standardMatrix[2] = (virCoord[2] + this.deltaz) * this.scalez;
      return this._standardMatrix;
    } //To graphics X

  }, {
    key: "X",
    value: function X() {
      for (var _len = arguments.length, coord = new Array(_len), _key = 0; _key < _len; _key++) {
        coord[_key] = arguments[_key];
      }

      return utility.dot(this.T[0], this.virtualToStandard(coord)) + this.B[0];
    } //To graphics Y

  }, {
    key: "Y",
    value: function Y() {
      for (var _len2 = arguments.length, coord = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        coord[_key2] = arguments[_key2];
      }

      return utility.dot(this.T[1], this.virtualToStandard(coord)) + this.B[1];
    }
  }, {
    key: "Z",
    value: function Z() {
      for (var _len3 = arguments.length, coord = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        coord[_key3] = arguments[_key3];
      }

      return utility.dot(this.T[2], this.virtualToStandard(coord)) + this.B[2];
    }
  }, {
    key: "virtualToGraphical",
    value: function virtualToGraphical(virCoord) {
      this._graphicalMatrix[0] = this.X.apply(this, _toConsumableArray(virCoord));
      this._graphicalMatrix[1] = this.Y.apply(this, _toConsumableArray(virCoord));
      this._graphicalMatrix[2] = this.Z.apply(this, _toConsumableArray(virCoord));
      return this._graphicalMatrix;
    }
    /**
     * The Width, expressed either in a vector or a single number computed from width
     * @param width the width in virtual coordinates for conversion
     * @param getElement the method returns a single component if the value is set to true
     * or else it returns an array that corresponds to the spatial distance in graphics coordinate
     */

  }, {
    key: "Width",
    value: function Width(width, getElement) {
      if (getElement) {
        return this.X(width, 0, 0) - this.X(0, 0, 0);
      } else {
        return utility.subtract(this.virtualToGraphical([width, 0, 0]).slice(), this.virtualToGraphical([width, 0, 0]));
      }
    }
    /**
     * The Height, expressed either in a vector or a single number computed from height
     * @param height the height in virtual coordinates for conversion
     * @param getElement the method returns a single component if the value is set to true
     * or else it returns an array that corresponds to the spatial distance in graphics coordinate
     */

  }, {
    key: "Height",
    value: function Height(height, getElement) {
      if (getElement) {
        return this.Y(0, height, 0) - this.Y(0, 0, 0);
      } else {
        return utility.subtract(this.virtualToGraphical([0, height, 0]).slice(), this.virtualToGraphical([0, height, 0]));
      }
    }
    /**
     * The Length, expressed either in a vector or a single number computed from length
     * @param height the length in virtual coordinates for conversion
     * @param getElement the method returns a single component if the value is set to true
     * or else it returns an array that corresponds to the spatial distance in graphics coordinate
     */

  }, {
    key: "Length",
    value: function Length(length, getElement) {
      if (getElement) {
        return this.Z(0, 0, length) - this.Z(0, 0, 0);
      } else {
        return utility.subtract(this.virtualToGraphical([0, 0, length]).slice(), this.virtualToGraphical([0, 0, length]));
      }
    }
  }, {
    key: "xyz",

    /**
     * Returns a vector representing the virtual coordinate of graph coord.
     * The Locator class only exposes this method because the reverse transform 
     * involves matrix transformation and cloning arrays. It's the fastest to not 
     * repeat the process for each component.
     * @param graCoord: a representation of a point in the virtual coordinate
     */
    value: function xyz() {
      for (var _len4 = arguments.length, graCoord = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        graCoord[_key4] = arguments[_key4];
      }

      this.checkCoord(graCoord);
      this._subtractionMatrix = utility.subtract([].concat(graCoord), this.B);
      this._standardMatrix[0] = utility.dot(this.T[0], this._subtractionMatrix);
      this._standardMatrix[1] = utility.dot(this.T[1], this._subtractionMatrix);
      this._standardMatrix[2] = utility.dot(this.T[2], this._subtractionMatrix);
      /* _subtractionMatrix is reused here as a holder for the _virtualMatrix for the sake of 
       * optimization.
       */

      this._subtractionMatrix[0] = this._standardMatrix[0] / this.scalex - this.deltax;
      this._subtractionMatrix[1] = this._standardMatrix[1] / this.scaley - this.deltay;
      this._subtractionMatrix[2] = this._standardMatrix[2] / this.scalez - this.deltaz;
      return this._subtractionMatrix;
    } // Unimplemented until they are needed
    // public float width(int Width) {
    //     return x(Width, 0) - x(0, 0);
    // }
    // public float height(int Height) {
    //     return y(0, Height) - y(0, 0);
    // }
    // public float length(int Length) {
    //     return z(0,0,Length) - this.Z(0,0,0);
    // }

    /**
     * Pinned zooming
     * @param pinX In graphical units
     * @param factorx Scale scalex by this amount
     * @param pinY In graphical units
     * @param factory Scale scaley by this amount
     * @param pinZ In graphical units
     * @param factorz Scale scalez by this amount
     */

  }, {
    key: "zoom",
    value: function zoom(pinX, factorx, pinY, factory) {
      var pinZ = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var factorz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var pinxyz = this.xyz(pinX, pinY, pinZ);
      this.scalex *= factorx;
      this.scaley *= factory;
      this.scalez *= factorz;
      this.deltax = (pinxyz[0] + this.deltax) / factorx - pinxyz[0];
      this.deltay = (pinxyz[1] + this.deltay) / factory - pinxyz[1];
      this.deltaz = (pinxyz[2] + this.deltaz) / factory - pinxyz[2];
    }
    /**
     * Validate that the coordinate has the coorect dimension
     * @param coord the coordinate
     */

  }, {
    key: "checkCoord",
    value: function checkCoord(coord) {
      if (coord.length == 2) coord[2] = 0;
      return coord;
    }
  }]);

  return Locator;
}();

exports = {
  Locator: Locator
};
//# sourceMappingURL=locator.js.map
