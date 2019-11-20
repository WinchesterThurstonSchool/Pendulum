/* jshint node: true */

/*  jshint esversion: 6 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Animal =
/*#__PURE__*/
function () {
  function Animal() {
    _classCallCheck(this, Animal);
  }

  _createClass(Animal, [{
    key: "showQuality",
    value: function showQuality() {
      console.log(this.dynamicProperty);
      return this;
    }
  }, {
    key: "showSpecies",
    value: function showSpecies() {
      console.log(this.staticProperty);
    }
  }], [{
    key: "showSpecies",
    value: function showSpecies() {
      console.log(this.staticProperty);
      return this;
    }
  }]);

  return Animal;
}();

Animal.staticProperty = "moves";
Animal.prototype.dynamicProperty = "mammal";
var obj = new Animal();
obj.showQuality();
obj.dynamicProperty = "doesn't move";
obj.showQuality();
obj.showSpecies();
Animal.showSpecies();
obj.staticProperty = "can I change static property?";
obj.showSpecies();
Animal.showSpecies();
//# sourceMappingURL=test.js.map
