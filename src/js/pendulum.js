/* jshint esversion: 6 */
window.$=window.jQuery=require("jquery");
require("../css/pendulum.css");
$(()=>{
    var utility = require('./utility.js');
    var UI = require('./ui.js');
    var canvas = require('./canvas.js');
    var element = document.body;
    UI.loadTags(); 
    UI.loadShelves(); 
    UI.loadReference();
});