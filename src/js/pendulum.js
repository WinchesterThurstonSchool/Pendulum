/* jshint esversion: 6 */
window.$=window.jQuery=require("jquery");
require("../css/pendulum.css");
$(()=>{
    var utility = require('./utility.js');
    let UI = require('./ui.js');
    UI.loadTags(); 
    UI.loadShelves(); 
    UI.loadReference();
    let {
        Graphics,
        Graphics2D,
        Graphics3D
    } = require('./canvas/graphics.js');
    let canvas = document.getElementById("graphpanel");
    let graphics = {
        g2d: new Graphics2D(canvas),
        g3d: new Graphics3D(canvas)
    };
});