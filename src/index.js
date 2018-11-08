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
    graphSlopeField
} from './js/graphics.js';

import {
    Vec,
    DiffEqn,
    Euler,
    RK2,
    getMatrix,
    apply
} from './js/operations.js';

initialize3D(10);

// graphParametric((u, v) => {
//     var s = u * 2 * Math.PI,
//         t = v * 2 * Math.PI - Math.PI - Math.PI / 2 - Math.PI / 4 + Math.PI / 8;
//     return new Vec(Math.cos(s) * 3 + Math.cos(s) * Math.cos(t),
//         3 * Math.sin(s) + Math.sin(s) * Math.cos(t),
//         -Math.sin(t) - 3);
// });
// var func = (x, y) => Math.sin(x) + Math.cos(y);
// graphCartesian(func);
// var matrix = getMatrix(2, [[-5,5]], [11]);
// var near = apply((vec) => new Vec(vec.x, vec.y, func(vec.x, vec.y)),matrix);
// graphVectorField((vec)=>new Vec(-Math.cos(vec.x), Math.sin(vec.y), 1), near);
var fields = [(vec) => new Vec(-vec.y * vec.z, -vec.z * vec.x, -vec.x * vec.y).normalize(),
    (vec) => new Vec(vec.x, vec.y, vec.z).normalize(), (vec) => new Vec(1),
    (vec) => new Vec(vec.y - vec.x, vec.z - vec.y, vec.x - vec.z).normalize(),
    (vec) => new Vec(-vec.y * vec.z, vec.z * vec.x, -vec.x * vec.y).normalize(),
    (vec) => new Vec(vec.x * (vec.y + vec.z), vec.y * (vec.x + vec.z), vec.z * (vec.y + vec.x)).normalize(),

];
var field = fields[0];
graphVectorField(field, getMatrix(3, [
    [-5, 5]
], [11]), fieldStyles.vectorConstant);
// graphSlopeField((x, y) => x/y);
var diffEqn = new DiffEqn((t, ys) => field(ys[0]), 1);
for (var i = -5; i <= 5; i++)
    for (var j = -5; j <= 5; j++) {
        var solver = new RK2(diffEqn, 0.01, 0, [new Vec(i, j, 0)]);
        var rkSolution = solver.getSolution(true, [-25, 25]);
        var holder = new Vec();
        graphParametricCurve((t) => rkSolution(t * 50 - 25, holder));
    }

for (var i = -5; i <= 5; i++)
    for (var j = -5; j <= 5; j++) {
        var solver = new RK2(diffEqn, 0.01, 0, [new Vec(0, i, j)]);
        var rkSolution = solver.getSolution(true, [-25, 25]);
        var holder = new Vec();
        graphParametricCurve((t) => rkSolution(t * 50 - 25, holder));
    }
var holder = new Vec();
// graphCartesian((x)=>rkSolution(x,holder).x);
// var diffEqn = new DiffEqn((t, ys) => new Vec(3 * Math.exp(5 * t) + 12 * ys[0].x + 4 * ys[1].x), 2);
// for(var i = -5; i <= 5; i+=0.5){
//     var solver = new RK2(diffEqn, 0.01, 0, [new Vec(i)]);
//     var rkSolution = solver.getSolution(true, [-25, 25]);
//     //graphCartesian((x) => euSolution(x, holder).x);
//     graphCartesian((x) => rkSolution(x, holder).x);
// }
// var solver = new RK2(diffEqn, 0.01, 0, [new Vec(18 / 7), new Vec(-1 / 7)]);
// var rkSolution = solver.getSolution(true, [-25, 25]);
// graphCartesian((x) => rkSolution(x, holder).x);
// var analyticalSolution = (x) => Math.exp(0.5*x)*(-2*Math.cos(Math.sqrt(3)/2*x)+2*Math.sqrt(3)*Math.sin(Math.sqrt(3)/2*x));
// var analyticalSolution = (x) => Math.exp(x)-x-1;
// graphCartesian(analSolution, Color.blue);
// graphCartesian((x) => analyticalSolution(x-7), Color.blue);
// graphCartesian((x) => (euSolution(x, holder).x - analyticalSolution(x)), 0xfe0033);
// graphCartesian((x) => (rkSolution(x, holder).x - analyticalSolution(x)), 0x00fe33);