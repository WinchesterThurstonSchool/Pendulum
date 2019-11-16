// Use a Node.js core library
var url = require('url');

// What our module will return when require'd
module.exports = function (href) {
    var parsed = url.parse(href);
    console.log(parsed);
    return parsed.hash;
};