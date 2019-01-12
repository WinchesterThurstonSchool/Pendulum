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
    zoomOut
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
} from './js/operations.js';

import {} from './js/ui.js';

window.resetScene = resetScene;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;

$(function () {
    initialize3D(20);
    // graphSlopeField((x,y)=>Math.sqrt(4-y*y),51, true);
    // graphSlopeField((x,y)=>(x-y)/(2+Math.cos(y)), 51, true, fieldStyles.slope(colors.red));
    var holder = new Vec();
    // graphParametricSurface((u, v) => {
    //     var s = u * 2 * Math.PI,
    //         t = v * 2 * Math.PI - Math.PI - Math.PI / 2 - Math.PI / 4 + Math.PI / 8;
    //     return new Vec(Math.cos(s) * 3 + Math.cos(s) * Math.cos(t),
    //         3 * Math.sin(s) + Math.sin(s) * Math.cos(t),
    //         -Math.sin(t) - 3);
    // });
    graphParametricSurface((u, v) => {
        var s = v * Math.PI,
            t = u * 2 * Math.PI,
            r = 0.5;
        return holder.set(r * Math.sin(s) * Math.cos(t),
            r * Math.sin(s) * Math.sin(t),
            r * Math.cos(s));
    });
    // var orbit = new DiffEqn((t, n) => n[0].normalize(holder).multiply(-1 / Math.exp(n[0].dot(n[0]))), 2);
    // // var orbit = new DiffEqn((t, n) => n[0].normalize(holder).multiply(-1 /n[0].dot(n[0])), 2);
    // // var zp1 = new Vec(0, 0, 1);
    // for (var i = 1; i <= 1; i++) {
    //     var initc = [new Vec(Math.random(), Math.random(), Math.random()).normalize(), new Vec(Math.random())];
    //     console.log("y(0)="+initc[0].toString());
    //     console.log("y'(0)=" + initc[1].toString());
    //     var dt = 0.01;
    //     // var sol1 = new RK2(orbit, dt, 0, initc).getSolution(true, [-100, 100]);
    //     // graphParametricCurve((t) => sol1(t * 200 - 100, holder), colors.blue);
    //     var sol2 = new RK4(orbit, dt/4, 0, initc).getSolution(true, [-200, 200]);
    //     graphParametricCurve((t) => sol2(t * 400 - 200, holder), colors.red);
    //     // var sol3 = new Euler(orbit, dt/4, 0, initc).getSolution(true, [-100, 100]);
    //     // graphParametricCurve((t) => sol3(t * 200 - 100, holder).subtract(zp1), colors.orange);
    // }
    // var matrix = getMatrix(2, [[-5,5]], [11]);
    // var near = apply((vec) => new Vec(vec.x, vec.y, func(vec.x, vec.y)),matrix);
    // graphVectorField((vec)=>new Vec(-Math.cos(vec.x), Math.sin(vec.y), 1), near);
    var fields = [(vec) => new Vec(-vec.y * vec.z, -vec.z * vec.x, -vec.x * vec.y).normalize(),
        (vec) => new Vec(-vec.y, -vec.z, vec.x).normalize(), (vec) => new Vec(1),
        (vec) => new Vec(vec.y - vec.x, vec.z - vec.y, vec.x - vec.z).normalize(),
        (vec) => new Vec(-vec.y * vec.z, vec.z * vec.x, -vec.x * vec.y).normalize(),
        (vec) => new Vec(vec.x * (vec.y + vec.z), vec.y * (vec.x + vec.z), vec.z * (vec.y + vec.x)).normalize(),
        (vec) => holder.set(vec.y-vec.z, vec.x-vec.z, vec.x-vec.y).normalize(),
        (vec) => holder.set(1, 1 / (1 + vec.z * vec.z+vec.x*vec.x), 1 / (1 + vec.x * vec.x)).normalize()
    ];

    var field = fields[7];
    var diffEqn = new DiffEqn((t, ys) => field(ys[0]));
    // for (let i = -5; i <= 5; i++) {
    //     let solver = new RK4(diffEqn, 0.01, 0, [new Vec(i, 0, 0)]);
    //     let cache = solver.getSolution(true, [-25, 25]);
    //     // console.log(solution);
    //     graphCartesian((x) => cache(x, holder).x, colors.blue);
    // };
    // for (var i = -5; i <= 5; i++)
    //     for (var j = -5; j <= 5; j++) {
    //         let solver = new RK4(diffEqn, 0.1, 0, [new Vec(i, j, 0)]);
    //         let rkSolution = solver.getSolution(true, [-25, 25]);
    //         graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.green);
    //     }

    // for (var i = -5; i <= 5; i++)
    //     for (var j = -5; j <= 5; j++) {
    //         let solver = new RK4(diffEqn, 0.1, 0, [new Vec(0, i, j)]);
    //         let rkSolution = solver.getSolution(true, [-25, 25]);
    //         graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.red);
    //     }

    // for (var i = -5; i <= 5; i++)
    //     for (var j = -5; j <= 5; j++) {
    //         let solver = new RK4(diffEqn, 0.1, 0, [new Vec(i, 0, j)]);
    //         let rkSolution = solver.getSolution(true, [-25, 25]);
    //         graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.blue);
    //     }
    // graphVectorField(field, getMatrix(3, [
    //     [-5, 5]
    // ], [11]), fieldStyles.vectorConstant);
});
