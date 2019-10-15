/*jshint esversion: 6 */

import {
    colors,
    materials,
    fieldStyles,
    initialize2D,
    initialize3D,
    graphCartesian,
    graphParametricCurve,
    graphParametricSurface,
    graphVector,
    graphVectorField,
    graphSlopeField,
    graphNormalSurface,
    resetScene,
    zoomIn,
    zoomOut,
    onResize,
    renderAll
} from './js/graphics.js';

import {
    Vec,
    DiffEqn,
    Euler,
    RK2,
    RK4,
    getMatrix,
    apply,
    sin,
} from './js/operators.js';

import './js/environment.js';

import * as U from './js/ui.js';
import {
    Environment
} from './js/environment.js';

window.resetScene = resetScene;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
var E;
var core = new(function () {
    this.initializing = true;
    this.canvasMode = "3D";
    E = new Environment(this);
    U.setCore(this);
    this.initialize2D = () => {
        initialize2D();
        this.canvasMode = "2D";
    };
    this.initialize3D = () => {
        initialize3D();
        this.canvasMode = "3D";
        console.log(this.canvasMode);
    };
    var colorIndex = 0;
    this.graphicsCaches = {};
    this.graph = function (name,type, func = () => 0) {
        var colorNames = [
            "orange",
            "blue",
            "green",
            "red"
        ];
        switch (type) {
            case "cartesian":
                graphCartesian(func, colors[colorNames[colorIndex++%colorNames.length]]);
                this.graphicsCaches[name] = true;
                break;
            case "parametricSurface":
                var holder = new Vec();
                graphParametricSurface((u, v, holder) => func(u, v, holder));
                break;
            default:
                break;
        }
    };
    this.initialize3D();
    this.resizeGraphics = () => onResize();
    this.createDefinition = (name) => {
        E.createDefintion(name);
    };
    this.updateDefinition = (name, equation) => {
        if (E.definitions[name] != undefined) {
            E.loadEquation(name, equation);
            if (!this.initializing){
                renderAll();
                if (!this.graphicsCaches[name])
                    E.definitions[name].graph();
            }
        }
        console.log(E);
    };
    this.removeDefinition = (name) => {
        E.removeDefinition(name);
        delete this.graphicsCaches[name];
    };
    U.loadTags();
    U.loadShelves();
    U.loadReference();
    E.graphAll();
    this.handleError = function (error) {
        throw new Error(error);
    };
    this.initializing = false;
    var solver = new RK4(new DiffEqn((t,n)=>new Vec(-1+1/Math.pow(n[0].x,3),0,0),2),0.01,0,[new Vec(2,0,0)]);
    let rkSolution = solver.getSolution(true, [0,30]);
    let holder = new Vec(0,0,0);
    let holderb = new Vec(0,0,0);
    graphParametricCurve((t) => holderb.set(t*10,rkSolution(t*10, holder).x), colors.green);
    console.log("completed");
})();
window.onresize = core.resizeGraphics;

window.switchCanvas = function(){
    switch(core.canvasMode){
        case '2D':
            core.initialize3D();
            E.graphAll();
            break;
        case '3D':
            core.initialize2D();
            E.graphAll();
            break;
        default:
            break;
    }
};
// $(function(){
//     initialize2D();
//     var holder = new Vec();
//     graphSlopeField((x,y)=>x+y);
// });
// $(function () {
//     initialize2D();
//     var fields = [(vec) => new Vec(-vec.y * vec.z, -vec.z * vec.x, -vec.x * vec.y).normalize(),
//         (vec) => new Vec(-vec.y, -vec.z, vec.x).normalize(), (vec) => new Vec(1),
//         (vec) => new Vec(vec.y - vec.x, vec.z - vec.y, vec.x - vec.z).normalize(),
//         (vec) => new Vec(-vec.y * vec.z, vec.z * vec.x, -vec.x * vec.y).normalize(),
//         (vec) => new Vec(vec.x * (vec.y + vec.z), vec.y * (vec.x + vec.z), vec.z * (vec.y + vec.x)).normalize(),
//         (vec) => holder.set(vec.y - vec.z, vec.x - vec.z, vec.x - vec.y).normalize(),
//         (vec) => holder.set(1, 1 / (1 + vec.z * vec.z + vec.x * vec.x), 1 / (1 + vec.x * vec.x)).normalize()
//     ];
//     var holder = new Vec();
//     var field = (vec) => new Vec(-vec.y * vec.z, vec.z * vec.x, vec.z * vec.y).normalize();
//     // graphVectorField(field, getMatrix(3, [[-10,10]],[11]), fieldStyles.vectorBold)
//     // var diffEqn = new DiffEqn((t, ys) => field(ys[0]));
//     // for (var i = -5; i <= 5; i++)
//     //     for (var j = -5; j <= 5; j++) {
//     //         let solver = new RK4(diffEqn, 0.1, 0, [new Vec(i, j, 0)]);
//     //         let rkSolution = solver.getSolution(true, [-25, 25]);
//     //         graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.green);
//     //     }

//     // for (var i = -5; i <= 5; i++)
//     //     for (var j = -5; j <= 5; j++) {
//     //         let solver = new RK4(diffEqn, 0.1, 0, [new Vec(0, i, j)]);
//     //         let rkSolution = solver.getSolution(true, [-25, 25]);
//     //         graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.red);
//     //     }
//     // graphSlopeField((x,y)=>x+y);
//     graphCartesian((x,y)=>x-y*Math.cos(x-y));
//     graphCartesian((x,y)=>-Math.sin(x)-Math.sin(y),colors.steelBlue);
// });

/**A Comprehensive list of all the graphics commands:**/
// $(function () {
//     initialize3D();
//     graphParametricSurface((u, v) => {
//         var s = u * 2 * Math.PI,
//             t = v * 2 * Math.PI - Math.PI - Math.PI / 2 - Math.PI / 4 + Math.PI / 8;
//         return new Vec(Math.cos(s) * 3 + Math.cos(s) * Math.cos(t),
//             3 * Math.sin(s) + Math.sin(s) * Math.cos(t),
//             -Math.sin(t) - 3);
//     });

//     graphParametricSurface((u, v, holder) => {
//         var s = -u*10+5,
//             t = -v*10+5;
//         return new Vec(10-s*s+t,Math.sin(t)*s, Math.cos(s)*t);
//     }, 0x5baeb6);
//     graphCartesian((x, y) => Math.cos(x)+Math.sin(y));
//     var fields = [(vec) => new Vec(-vec.y * vec.z, -vec.z * vec.x, -vec.x * vec.y).normalize(),
//         (vec) => new Vec(-vec.y, -vec.z, vec.x).normalize(), (vec) => new Vec(1),
//         (vec) => new Vec(vec.y - vec.x, vec.z - vec.y, vec.x - vec.z).normalize(),
//         (vec) => new Vec(-vec.y * vec.z, vec.z * vec.x, -vec.x * vec.y).normalize(),
//         (vec) => new Vec(vec.x * (vec.y + vec.z), vec.y * (vec.x + vec.z), vec.z * (vec.y + vec.x)).normalize(),
//         (vec) => holder.set(vec.y-vec.z, vec.x-vec.z, vec.x-vec.y).normalize(),
//         (vec) => holder.set(1, 1 / (1 + vec.z * vec.z+vec.x*vec.x), 1 / (1 + vec.x * vec.x)).normalize()
//     ];
//     var holder = new Vec();
//     var field = fields[4];
//     var diffEqn = new DiffEqn((t, ys) => field(ys[0]));
//     graphVectorField((vec) => holder.set(-vec.y, -vec.z, vec.x).normalize(), getMatrix(3, [[-5, 5]], [11]));
//     for (var i = -5; i <= 5; i++)
//         for (var j = -5; j <= 5; j++) {
//             let solver = new RK4(diffEqn, 0.1, 0, [new Vec(i, j, 0)]);
//             let rkSolution = solver.getSolution(true, [-25, 25]);
//             graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.green);
//         }

//     for (var i = -5; i <= 5; i++)
//         for (var j = -5; j <= 5; j++) {
//             let solver = new RK4(diffEqn, 0.1, 0, [new Vec(0, i, j)]);
//             let rkSolution = solver.getSolution(true, [-25, 25]);
//             graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.red);
//         }
// });

// Lorenz Attractor
// (function(){
//     // initialize3D();
//     var s=10
//     var r=30
//     var b=8/3
//     var dX = (x,y,z)=>s*(y-x);
//     var dY = (x,y,z)=>-x*z+r*x-y;
//     var dZ = (x,y,z)=>x*y-b*z;
//     var holder = new Vec();
//     var diffEqn = new DiffEqn((t,ys)=>{
//         let x = ys[0].x;
//         let y = ys[0].y;
//         let z = ys[0].z;
//         return holder.set(dX(x, y, z), dY(x, y, z), dZ(x, y, z))
//     });
//     let solver = new RK4(diffEqn, 0.0001/5*2, 0, [new Vec(10, 10, 10)]);
//     let rkSolution = solver.getSolution(true, [-25, 25]);
//     graphParametricCurve((t) => rkSolution(t * 20, holder), colors.green)
// })();