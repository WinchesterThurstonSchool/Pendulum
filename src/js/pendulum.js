/* jshint esversion: 6 */
window.$=window.jQuery=require("jquery");
require("../css/canvas.css");
var UI = require('./ui.js');
$(()=>{
    UI.loadTags(); 
    UI.loadShelves(); 
    UI.loadReference();
});