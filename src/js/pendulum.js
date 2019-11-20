/* jshint esversion: 6 */
window.$=window.jQuery=require("jquery");
require("../css/pendulum.css");
var math = require('./math.js');
var UI = require('./ui.js');
$(()=>{
    UI.loadTags(); 
    UI.loadShelves(); 
    UI.loadReference();
});