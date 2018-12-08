//   global.THREE = require('three');
//   require('three/OrbitControls');
//   import * as PIXI from 'pixi.js';

import {
    Vec,
    getMatrix,
    DiffEqn,
    RK4
} from './operations.js';

var globalScene;
var canvas;
var width = 0,
    height = 0;
var camera;
var tr = new Transformer;
var graphers = [];
var renderAll;

const colors = {
    orange: 0xfb6500,
    green: 0x378b59,
    blue: 0x0065fb,
    red: 0xd82c5d,
    lightgray: 0xf3f3f3,
    air: 0xf0f8ff,
};

const materials = {
    standard: new THREE.MeshPhongMaterial({
        opacity: 0.8,
        transparent: true,
        side: THREE.DoubleSide,
        color: 0x7890ab
    }),
    opaque: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0x7890ab
    }),
    flat: new THREE.MeshBasicMaterial({
        color: 0x7890ab,
        opacity: 0.8,
        transparent: true,
    }),
    line: new THREE.LineBasicMaterial({
        color: 0x7890ab,
        opacity: 0.8
    })
}

const fieldStyles = {
    vector: function (color = 0xfed400) {
        return {
            tipHeight: (length) => length * 0.2,
            tipRadius: (length) => (length < 10) ? length * 0.05 : 0.5,
            bodyRadius: (length) => (length < 10) ? length * 0.01 : 0.01,
            material: materials.opaque,
            color: color
        }
    },
    vectorBold: {
        tipHeight: (length) => length * 0.2,
        tipRadius: (length) => (length < 10) ? length * 0.1 : 1,
        bodyRadius: (length) => (length < 10) ? length * 0.025 : 0.25,
        material: materials.opaque,
        color: 0xfed400
    },
    vectorHeavy: {
        tipHeight: (length) => length * 0.2,
        tipRadius: (length) => (length > 1) ? (length < 10) ? length * 0.02 : 0.2 : 0.01,
        bodyRadius: (length) => (length > 1) ? (length < 10) ? length * 0.01 : 0.1 : 0.01,
        material: materials.opaque,
        color: 0xfed400
    },
    vectorConstant: {
        tipHeight: (length) => length * 0.2,
        tipRadius: () => 0.005,
        bodyRadius: () => 0.001,
        material: materials.opaque,
        color: 0xfed400
    },
    slope: function(color = colors.green){
        return {
            tipHeight: () => 0,
            tipRadius: () => 0.001,
            bodyRadius: () => 0.001,
            material: materials.opaque,
            color: color
        };
    }
}

function initialize2D(range = 20, scale = 500) {
    //Define resize listener
    window.addEventListener("resize", onResize);
    tr = new Transformer(range, scale);
    var panel = document.getElementById("graphpanel");
    if (canvas)
        panel.removeChild(canvas);
    graphers.length = 0;
    renderAll = () => requestAnimationFrame(() => {
        for (var i in graphers)
            graphers[i]();
        app.render();
    });

    function onResize() {
        height = panel.offsetHeight;
        width = panel.offsetWidth;
        app.renderer.resize(width, height);
        app.renderer.view.style.width = width + 'px';
        app.renderer.view.style.height = height + 'px';
        renderAll();
    }
    var app = new PIXI.Application({
        width: panel.offsetWidth, // default: 800
        height: panel.offsetHeight, // default: 600
        antialias: true, // default: false
        transparent: true, // default: false
        resolution: 1 // default: 1
    });
    height = panel.offsetHeight;
    width = panel.offsetWidth;
    var ratio = width / height;
    //Set renderer size
    app.renderer.autoResize = true;
    // app.renderer.resolution = window.devicePixelRatio;
    app.renderer.resize(width, height);
    app.view.id = "graph";
    // add render view to DOM
    panel.appendChild(app.view);
    canvas = app.view;
    new DragControl(tr, canvas, app);
    globalScene = app.stage;
    return app.stage;
}

function initialize3D(range = 20, scale = 4) {
    //Define resize listener
    window.addEventListener("resize", onResize);
    tr = new Transformer(range, scale);
    var panel = document.getElementById("graphpanel");
    if (canvas)
        panel.removeChild(canvas);
    graphers.length = 0;
    function onResize() {
        height = panel.offsetHeight;
        width = panel.offsetWidth;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
    height = panel.offsetHeight;
    width = panel.offsetWidth;
    //Define scene and camera
    var scene = new THREE.Scene();
    globalScene = scene;
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    var aspect = width / height;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 1000);
    camera.position.y = -5;
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, 1);
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    //Setup renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.domElement.id = "graph";
    //add dom element
    panel.appendChild(renderer.domElement);
    canvas = renderer.domElement;
    new THREE.OrbitControls(camera, renderer.domElement);
    new OrbitalControlUpdater(tr, canvas);
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 0, 5);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 0, -5);
    scene.add(light);
    light = new THREE.AmbientLight(0xffffff, 0.5);
    light.position.set(0, -5, 0);
    scene.add(light);
    //Render
    var needUpdate = false;
    var render = function () {
        requestAnimationFrame(render);
        if(needUpdate){
            for (var i in graphers)
                graphers[i]();
            needUpdate = false;
        } 
        renderer.render(scene, camera);
        // arrow.applyQuaternion(new THREE.Quaternion(0, Math.sin(0.1),0, Math.cos(0.1)));
    };

    renderAll = () => needUpdate = true;

    render();
    return scene;
}

function resetScene() {
    if (globalScene instanceof THREE.Scene) {
        camera.position.x = 0;
        camera.position.y = -5;
        camera.position.z = 0;
        camera.lookAt(0, 0, 0);
    }
    if (globalScene instanceof PIXI.Container) {
        tr.range = 20;
        tr.scale = 500;
        tr.offsetX = 0;
        tr.offsetY = 0;
        renderAll();
    }
}

function graph2D(func = (x => 0), {
    stage,
    color = 0x569078
}) {
    //Geometry definition
    var size = 200;
    var graphics = new PIXI.Graphics();
    var grapher = () => {
        graphics.clear();
        graphics.lineStyle(2, color, 0.8);
        var cod = tr.map(0 / size);
        var pos = tr.toP(cod[0], func(cod[0]));
        graphics.moveTo(pos[0], pos[1]);
        for (var i = 1; i <= size; i++) {
            cod = tr.map(i / size);
            var val = func(cod[0]);
            pos = tr.toP(cod[0], val);
            graphics.lineTo(pos[0], pos[1]);
        }
    };
    grapher();
    stage.addChild(graphics);
    graphers.push(grapher);
}

function graph3D(func = ((x = 0, y = 0) => 0), {
    scene,
    color = 0xffffff
}) {
    //Geometry definition
    var size = 200;
    var geometry = new THREE.Geometry();
    for (var i = 0; i < 1; i += 1.0 / size) {
        for (var j = 0; j < 1; j += 1 / size) {
            var pos = tr.rescale(i, j);
            var cod = tr.map(i, j);
            var Z = func(cod[0], cod[1]) / tr.range * tr.scale;
            geometry.vertices.push(new THREE.Vector3(pos[0], pos[1], Z));
        }
    };

    for (var i = 0; i < size - 1; i += 1) {
        for (var j = 0; j < size - 1; j += 1) {
            //var face1 = new THREE.Face3(i * size + j, i * size + j + 1, (i + 1) * size + j + 1);
            var face2 = new THREE.Face3(i * size + j, (i + 1) * size + j + 1, i * size + j + 1);
            var face3 = new THREE.Face3(i * size + j, (i + 1) * size + j, (i + 1) * size + j + 1);
            //var face4 = new THREE.Face3(i * size + j, (i + 1) * size + j + 1, (i + 1) * size + j);
            geometry.faces.push(face2);
            /* geometry.faces.push(face2);*/
            // geometry.faces.push(face3);
            geometry.faces.push(face3);
        }
    };
    geometry.mergeVertices();
    geometry.computeVertexNormals();
    //Add surface
    var materialFront = new THREE.MeshPhongMaterial({
        opacity: 0.8,
        color: color,
        transparent: true,
        side: THREE.DoubleSide,
    });
    //  materialFront.depthTest=false;
    var surface = new THREE.Mesh(geometry, materialFront);
    var updateSurface = ()=>{
        var k = 0;
        for (var i = 0; i < 1; i += 1.0 / size) {
            for (var j = 0; j < 1; j += 1 / size) {
                var XY = tr.rescale(i, j);
                var xy = tr.map(i, j);
                var Z = func(xy[0], xy[1]) / tr.range * tr.scale;
                geometry.vertices[k].set(XY[0], XY[1], Z);
                k++;
            }
        };
        geometry.computeVertexNormals();
        geometry.verticesNeedUpdate = true;
    };
    scene.add(surface);
    graphers.push(updateSurface);
}

function parametricCurve2D(func = (t => new Vec(0, 0, 0)), {
    stage,
    color = 0x569078
}) {
    var graphics = new PIXI.Graphics();
    var graphCurve = () => {
        //Geometry definition
        var size = 500;
        graphics.clear();
        graphics.lineStyle(2, color, 0.8);
        var vec = func(0);
        var pixel = tr.toP(vec.x, vec.y);
        // draw a shape
        graphics.moveTo(pixel[0], pixel[1]);
        for (var i = 1; i <= size; i++) {
            vec = func(i / size);
            pixel = tr.toP(vec.x, vec.y);
            graphics.lineTo(pixel[0], pixel[1]);
        }
    };
    graphCurve();
    graphers.push(graphCurve);
    stage.addChild(graphics);
}

function parametricCurve3D(func = (t => new Vec(0, 0, 0)), {
    scene,
    color = 0x569078
}) {

    //Geometry definition
    var size = 2000;
    var geometry = new THREE.Geometry();
    var vertices = geometry.vertices;
    for (var i = 0; i < 1 + 1.0 / size; i += 1.0 / size) {
        var vec = func(i);
        vertices.push(vec.THREE().multiplyScalar(tr.scale / tr.range));
    };
    var lineMaterial = materials.line.clone();
    lineMaterial.color = new THREE.Color(color);
    var curve = new THREE.Line(geometry, lineMaterial);
    scene.add(curve);
}

function parametricSurface(func = ((u = 0, v = 0) => holder), {
    scene,
    color = 0xffffff
}) {
    //Geometry definition
    var size = 200;
    var vecFunc = (u = 0, v = 0, target = new THREE.Vector3()) => {
        var vec = func(u, v).multiply(tr.scale / tr.range);
        target.set(vec.x, vec.y, vec.z);
    }
    var geometry = new THREE.ParametricGeometry(vecFunc, size, size);
    geometry.mergeVertices();
    geometry.computeVertexNormals();
    // geometry.computeFaceNormals();
    //Add surface
    var material = new THREE.MeshPhongMaterial({
        opacity: 0.8,
        color: color,
        transparent: true,
        side: THREE.DoubleSide,
    });
    //  materialFront.depthTest=false;
    var surface = new THREE.Mesh(geometry, material);
    scene.add(surface);
}

function graphCartesian(func = ((x = 0, y = 0) => 0), color = 0xfb6500) {
    if (globalScene instanceof THREE.Scene) {
        graph3D(func, {
            scene: globalScene,
            color: color
        });
    }
    if (globalScene instanceof PIXI.Container) {
        graph2D(x => func(x, 0), {
            stage: globalScene,
            color: color
        });
    }
}

function graphParametricSurface(func = ((u = 0, v = 0, holder = new Vec()) => holder), color = 0x0065fb) {
    if (globalScene instanceof THREE.Scene) {
        parametricSurface(func, {
            scene: globalScene,
            color: color
        });
    }
    if (globalScene instanceof PIXI.Container) {
        parametricCurve2D(t => func(t, 0), {
            stage: globalScene,
            color: color
        });
    }
}

function graphParametricCurve(func = ((u = 0) => new Vec(0, 0, 0)), color = 0x0065fb) {
    if (globalScene instanceof THREE.Scene) {
        parametricCurve3D(func, {
            scene: globalScene,
            color: color
        });
    }
    if (globalScene instanceof PIXI.Container) {
        parametricCurve2D(func, {
            stage: globalScene,
            color: color
        });
    }
}

function graphVector(vec = new Vec(), origin = new Vec(), style = fieldStyles.vector()) {
    if (globalScene instanceof THREE.Scene) {
        var arrow = new Arrow3D(vec, origin, style);
        arrow.renderOrder = 0;
        globalScene.add(arrow);
        return arrow;
    }
    if (globalScene instanceof PIXI.Container) {
        var body = new PIXI.Graphics();
        var vlength = vec.magnitude() / tr.range,
            tH = style.tipHeight(vlength) * tr.scale,
            tR = style.tipRadius(vlength) * tr.scale,
            bR = style.bodyRadius(vlength) * tr.scale;
        var reducedVec = vec.multiply((vlength - tH / tr.scale) / vlength, new Vec());
        var p0 = tr.toP(origin.x, origin.y),
            p1 = tr.toP(origin.x + reducedVec.x, origin.y + reducedVec.y);
        var norm = new Vec(p1[0] - p0[0], p1[1] - p0[1]).cross(new Vec(0, 0, 1)).normalize().multiply(tR),
            p2 = [p1[0] + norm.x, p1[1] + norm.y],
            p3 = [p1[0] - norm.x, p1[1] - norm.y],
            p4 = tr.toP(origin.x + vec.x, origin.y + vec.y);
        body.lineStyle(bR * 2, style.color, 1);
        body.moveTo(p0[0], p0[1]);
        body.lineTo(p1[0], p1[1]);
        globalScene.addChild(body);

        var head = new PIXI.Graphics();
        head.beginFill(style.color);
        head.drawPolygon([
            p2[0], p2[1],
            p3[0], p3[1],
            p4[0], p4[1],
        ]);
        head.endFill();
        globalScene.addChild(head);
    }
}

function graphVectorField(func = (vec) => new Vec(), origins = [new Vec()], style = fieldStyles.vector()) {
    if (globalScene instanceof THREE.Scene)
        for (var i = 0; i < origins.length; i++)
            graphVector(func(origins[i]), origins[i], style);
    if (globalScene instanceof PIXI.Container) {
        var field = new PIXI.Graphics();
        var grapher = () => {
            field.clear();
            for (var i = 0; i < origins.length; i++) {
                var vec = func(origins[i]);
                var origin = origins[i];
                var vlength = vec.magnitude() / tr.range,
                    tH = style.tipHeight(vlength) * tr.scale,
                    tR = style.tipRadius(vlength) * tr.scale,
                    bR = style.bodyRadius(vlength) * tr.scale;
                var reducedVec = vec.multiply((vlength - tH / tr.scale) / vlength, new Vec());
                var p0 = tr.toP(origin.x, origin.y),
                    p1 = tr.toP(origin.x + reducedVec.x, origin.y + reducedVec.y);
                var norm = new Vec(p1[0] - p0[0], p1[1] - p0[1]).cross(new Vec(0, 0, 1)).normalize().multiply(tR),
                    p2 = [p1[0] + norm.x, p1[1] + norm.y],
                    p3 = [p1[0] - norm.x, p1[1] - norm.y],
                    p4 = tr.toP(origin.x + vec.x, origin.y + vec.y);
                field.lineStyle(bR * 2, style.color, 1);
                field.moveTo(p0[0], p0[1]);
                field.lineTo(p1[0], p1[1]);

                field.beginFill(style.color);
                field.drawPolygon([
                    p2[0], p2[1],
                    p3[0], p3[1],
                    p4[0], p4[1],
                ]);
                field.endFill();
            }
        }
        grapher();
        globalScene.addChild(field);
        graphers.push(grapher);
    }
}

function graphSlopeField(func = (x, y) => 0, count = 21, graphSolution = false, style = fieldStyles.slope()) {
    var vecFunc = (vec = new Vec()) => {
        var slope = func(vec.x, vec.y);
        return (Number.isNaN(slope))? new Vec():(Number.isFinite(slope)) ? new Vec(1, slope).normalize().multiply((tr.range) / (count - 1)) :
            (slope > 0) ? new Vec(0, (tr.range) / (count - 1)) : new Vec(0, -(tr.range) / (count - 1));
    }
    var matrix = getMatrix(2, [
        [-1, 1]
    ], [count]);

    if (globalScene instanceof THREE.Scene) {
        slopeField3D();
    }
    if (globalScene instanceof PIXI.Container) {
        slopeField2D(vecFunc, matrix, style);
        if (graphSolution) {
            var holder = new Vec();
            var diffEqn = new DiffEqn((t, ys) => vecFunc(holder.set(ys[0].x, ys[0].y)));
            for (let i = -tr.range / 4; i <= tr.range / 4; i += tr.range / 6)
                for (let j = -tr.range/4; j <= tr.range/4; j+=tr.range/6) {
                    let solver = new RK4(diffEqn, 0.01, 0, [new Vec(i, j, 0)]);
                    let cache = solver.getSolution(true, [-50, 50]);
                    graphParametricCurve((t) => cache(t*100-50, holder), 0xffffff-style.color);
                };
        }
    }
}

function slopeField2D(func = (x, y) => new Vec(), matrix = [new Vec(0)], style = fieldStyles.slope()) {
    var field = new PIXI.Graphics();
    var grapher = () => {
        field.clear();
        var origin = new Vec();
        for (var i = 0; i < matrix.length; i++) {
            matrix[i].multiply(-tr.range / 2, origin);
            var vec = func(origin);
            var vlength = vec.magnitude() / tr.range,
                tH = style.tipHeight(vlength) * tr.scale,
                tR = style.tipRadius(vlength) * 500,
                bR = style.bodyRadius(vlength) * 500;
            var reducedVec = vec.multiply((vlength - tH / tr.scale) / vlength, new Vec());
            var p0 = tr.toP(origin.x - reducedVec.x / 2, origin.y - reducedVec.y / 2),
                p1 = tr.toP(origin.x + reducedVec.x / 2, origin.y + reducedVec.y / 2);
            var norm = new Vec(p1[0] - p0[0], p1[1] - p0[1]).cross(new Vec(0, 0, 1)).normalize().multiply(tR),
                p2 = [p1[0] + norm.x, p1[1] + norm.y],
                p3 = [p1[0] - norm.x, p1[1] - norm.y],
                p4 = tr.toP(origin.x + vec.x / 2, origin.y + vec.y / 2);
            field.lineStyle(bR * 2, style.color, 1);
            field.moveTo(p0[0], p0[1]);
            field.lineTo(p1[0], p1[1]);

            field.beginFill(style.color);
            field.drawPolygon([
                p2[0], p2[1],
                p3[0], p3[1],
                p4[0], p4[1],
            ]);
            field.endFill();
        }
    }
    grapher();
    globalScene.addChild(field);
    graphers.push(grapher);
}

function slopeField3D(func = (x, y) => 0, style = fieldStyles.slope()) {

}

function graphNormalSurface(normal = new Vec(0, 0, 1), offset = normal, color = colors.orange) {
    graphCartesian((x, y) => offset.z - (normal.x * (x - offset.x) + normal.y * (y - offset.y)) / normal.z, color);
}

function Transformer(range = 10, scale = 4) {
    this.range = range;
    this.scale = scale;
    this.offsetX = 0;
    this.offsetY = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.rescale = function (a, b = 0) {
        return new Array(this.scale * a - this.scale / 2, this.scale * b - this.scale / 2);
    }

    this.map = function (a, b = 0) {
        return new Array(this.range * a - this.range / 2, this.range * b - this.range / 2);
    }
    this.toP = function (a, b = 0) {
        return [(a+this.translateX) / this.range * this.scale + width / 2 + this.offsetX,
            -(b+this.translateY) / this.range * this.scale + height / 2 + this.offsetY
        ];
    }
}

function DragControl(tr = new Transformer, canvas = document.body) {
    this.transformer = tr;
    this.canvas = canvas;
    canvas.addEventListener('wheel', (e) => {
        tr.range *= Math.max(1 + e.deltaY * 0.001, 0.001);
        renderAll();
    })
    var X, Y;
    canvas.addEventListener('mousemove', (e) => {
        if (mousedown) {
            var newX = e.clientX,
                newY = e.clientY;
            tr.offsetX += newX - X;
            tr.offsetY += newY - Y;
            X = newX;
            Y = newY;
            renderAll();
        }
    });
    var mousedown = false;
    canvas.addEventListener('mousedown', (e) => {
        X = e.clientX;
        Y = e.clientY;
        mousedown = true;
    });
    window.addEventListener('mouseup', (e) => {
        mousedown = false;
    })
}

function OrbitalControlUpdater(tr = new Transformer, canvas = document.body) {
    this.transformer = tr;
    this.canvas = canvas;
    var dist = camera.position.length();
    var ratio = tr.range/dist;
    var scale = tr.scale/dist;
    canvas.addEventListener('wheel', (e) => {
        var newDist = camera.position.length();
        tr.range = newDist*ratio;
        tr.scale = newDist*scale;
        renderAll();
    })
}

class Arrow3D extends THREE.Group {
    constructor(vec = new Vec(0, 1), origin = new Vec(1), style = fieldStyles.vector()) {
        super();
        style.material.color = new THREE.Color(style.color);
        var vlength = vec.magnitude() / tr.range,
            tH = style.tipHeight(vlength) * tr.scale,
            tR = style.tipRadius(vlength) * tr.scale,
            bR = style.bodyRadius(vlength) * tr.scale;
        this.magnitude = vec.magnitude();
        var glength = vlength * tr.scale;
        if (tH != 0) {
            var headGeometry = new THREE.ConeGeometry(tR, tH, 20, 3);
            headGeometry.translate(0, glength - tH / 2, 0);
            var headMesh = new THREE.Mesh(headGeometry, style.material.clone());
            this.add(headMesh);
        }
        var cylGeometry = new THREE.CylinderGeometry(bR, bR, glength - tH, 20, 3);
        cylGeometry.translate(0, glength / 2 - tH / 2, 0);
        var cylMesh = new THREE.Mesh(cylGeometry, style.material.clone());
        this.add(cylMesh);
        var dir = vec.THREE().normalize();
        var dirAvg = new THREE.Vector3(0, 1, 0).add(dir).normalize();
        if (dirAvg.x == 0 && dirAvg.y == 0 && dirAvg.z == 0) dirAvg = new THREE.Vector3(0, 0, 1);
        var axis = new THREE.Vector3(0, 1, 0).cross(dirAvg),
            cos = dirAvg.dot(dir);
        var q = new THREE.Quaternion(axis.x, axis.y, axis.z, cos);
        this.applyQuaternion(q);
        var nq = new THREE.Quaternion(-axis.x, -axis.y, -axis.z, cos);
        var transformedOrgin = origin.THREE().multiplyScalar(tr.scale / tr.range).applyQuaternion(nq);
        this.translateOnAxis(transformedOrgin, 1);
    }
}

export {
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
};