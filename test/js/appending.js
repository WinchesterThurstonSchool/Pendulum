//jshint esversion: 6
var a = {'a':true, 'b':true};
var b = {'a':true, 'c': true};
var c = new Map([['a', true],['b',true]]);
var d = new Map([['a', true],['c',true]]);
console.log(c);

for(var i = 0; i<10000000000; i++)
    d['a'] = c['a'];