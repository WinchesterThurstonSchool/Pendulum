//jshint esversion: 6
var a = {'a':true, 'b':true};
var b = {'a':true, 'c': true};
var c = {};
c[a] = "12";

console.log(c[b]);