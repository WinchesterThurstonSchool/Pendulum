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
    resetScene
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

window.resetScene = resetScene;

var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);

var latex = $('#basic-latex').bind('keydown keypress', function () {
    var prev = latex.val();
    setTimeout(function () {
        var now = latex.val();
        if (now !== prev) mq.latex(now);
    });
});
var mq = MQ.MathField($('#basic')[0], {
    autoSubscriptNumerals: true,
    handlers: {
        edit: function () {
            if (!latex.is(':focus')) latex.val(mq.latex());
        }
    }
});
latex.val(mq.latex());


$(function () {
    initialize2D(20);
    var holder = new Vec();
    // graphParametricSurface((u, v) => {
    //     var s = u * 2 * Math.PI,
    //         t = v * 2 * Math.PI - Math.PI - Math.PI / 2 - Math.PI / 4 + Math.PI / 8;
    //     return new Vec(Math.cos(s) * 3 + Math.cos(s) * Math.cos(t),
    //         3 * Math.sin(s) + Math.sin(s) * Math.cos(t),
    //         -Math.sin(t) - 3);
    // });
    // graphParametricSurface((u, v) => {
    //     var s = v * Math.PI,
    //         t = u * 2 * Math.PI,
    //         r = 0.5;
    //     return holder.set(r * Math.sin(s) * Math.cos(t),
    //         r * Math.sin(s) * Math.sin(t),
    //         r * Math.cos(s));
    // });

    // var func = (x, y) => x*x*x+y+y*y;
    // graphCartesian(func);
    // graphSlopeField((x, y) => Math.sin(x)+Math.cos(y));
    for(var i = -10; i<10; i++){
        var zp1 = new Vec(0, 0, 1);
        var initc = [new Vec(i, 0, 0), new Vec(0, 0.2, 0)];
        var dt = 0.01;
        var orbit = new DiffEqn((t, n) => n[0].normalize(holder).multiply(-1 / n[0].dot(n[0])), 2);
        var sol1 = new RK2(orbit, dt, 0, initc).getSolution(true, [-100, 100]);
        graphParametricCurve((t) => sol1(t * 100, holder), colors.blue);
        var sol2 = new RK4(orbit, dt, 0, initc).getSolution(true, [-100, 100]);
        graphParametricCurve((t) => sol2(-t *  100, holder).add(zp1), colors.red);
        var sol3 = new Euler(orbit, dt, 0, initc).getSolution(true, [-100, 100]);
        graphParametricCurve((t) => sol3(t *  100, holder).subtract(zp1), colors.orange);
    }
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

    var field = fields[1];
    // graphVectorField(field, getMatrix(2, [
    //     [-5, 5]
    // ], [11]), fieldStyles.vectorConstant);
})
// // graphVectorField(field, getMatrix(3, [
// //     [-5, 5]
// // // ], [11]), fieldStyles.vectorConstant);
// var diffEqn = new DiffEqn((t, ys) => field(ys[0]), 1);
// for (var i = -5; i <= 5; i++)
//     for (var j = -5; j <= 5; j++) {
//         var solver = new RK2(diffEqn, 0.01, 0, [new Vec(i, j, 0)]);
//         var rkSolution = solver.getSolution(true, [-25, 25]);
//         var holder = new Vec();
//         graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.green);
//     }

// for (var i = -5; i <= 5; i++)
//     for (var j = -5; j <= 5; j++) {
//         var solver = new RK2(diffEqn, 0.01, 0, [new Vec(0, i, j)]);
//         var rkSolution = solver.getSolution(true, [-25, 25]);
//         var holder = new Vec();
//         graphParametricCurve((t) => rkSolution(t * 50 - 25, holder), colors.red);
//     }

// var holder = new Vec();
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