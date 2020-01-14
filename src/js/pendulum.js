/* jshint esversion: 6 */
window.$ = window.jQuery = require("jquery");
require("../css/pendulum.css");
$(() => {
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
    graphics.g2d.attach();
    graphics.g2d.addGrid((intervals, holder) => {
        /*[x:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],minor:[...]],
         *                                     y:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],...],...]
         */
        for (let i = 0; i < intervals.length; i++) {
            let i_1 = (i + 1) % intervals.length;
            let vMin = intervals[i_1][0],
                vMax = intervals[i_1][1];
            let majorLines = holder[i][0];
            let minorLines = holder[i][1];
            let index = 0;
            for (let j = Math.round(vMin / 5) * 5; j <= vMax; j += 5) {
                let coord = [0, 0, 0];
                coord[i_1] = j;
                majorLines[index] = coord;
                index++;
            }
            index = 0;
            for (let j = Math.round(vMin); j <= vMax; j += 0.5) {
                let coord = [0, 0, 0];
                coord[i_1] = j;
                minorLines[index] = coord;
                index++;
            }
        }
        return holder;
    });
    graphics.g3d.addGrid((intervals, holder) => {
        /*[x:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],minor:[...]],
         *                                     y:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],...],...]
         */
        for (let i = 0; i < intervals.length; i++) {
            let i_1 = (i + 1) % intervals.length;
            let v1Min = intervals[i_1][0],
                v1Max = intervals[i_1][1];
            let i_2 = (i + 2) % intervals.length;
            let v2Min = intervals[i_2][0],
                v2Max = intervals[i_2][1];
            let i_3 = (i + 1) % 2;
            let vMin = intervals[i_3][0],
                vMax = intervals[i_3][1];
            let majorLines = holder[i][0];
            let minorLines = holder[i][1];
            let index = 0;
            let gap = 5;
            // for(let j = 0; j<majorLines.length; j++)
            //     majorLines[j]=[0,0,0];
            // for(let j = 0; j<minorLines.length; j++)
            //     minorLines[j]=[0,0,0];
            
            for (let j = Math.round(v1Min / gap) * gap + gap; j <= v1Max - gap; j += gap) {
                for (let k = Math.round(v2Min / gap) * gap + gap; k <= v2Max - gap; k += gap) {
                    let coord = [0, 0, 0];
                    coord[i_1] = j;
                    coord[i_2] = k;
                    majorLines[index] = coord;
                    index++;
                }
            }
            index = 0;
            if (i != 2) {
                for (let j = Math.round(vMin); j <= vMax; j += 0.5) {
                    let coord = [0, 0, 0];
                    coord[i_3] = j;
                    minorLines[index] = coord;
                    index++;
                }
            }
        }
        return holder;
    });
    let main = require('./main').main;
    main(graphics.g2d);
});