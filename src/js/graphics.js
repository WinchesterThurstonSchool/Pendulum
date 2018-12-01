//   global.THREE = require('three');
//   require('three/OrbitControls');
//   import * as PIXI from 'pixi.js';

import {
    Vec,
    getMatrix
} from './operations.js';

var globalScene;
var canvas;
var width = 0,
    height = 0;
var camera;
var tr = new Transformer;
var graphers = [];

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
    slope: {
        tipHeight: () => 0,
        tipRadius: () => 0.001,
        bodyRadius: () => 0.001,
        material: materials.opaque,
        color: colors.green
    }
}

function initialize2D(range = 20, scale = 500) {
    //Define resize listener
    window.addEventListener("resize", onResize);
    tr = new Transformer(range, scale);
    var panel = document.getElementById("graphpanel");
    if (canvas)
        panel.removeChild(canvas);

    function onResize() {
        height = panel.offsetHeight;
        width = panel.offsetWidth;
        app.renderer.resize(width, height);
        app.renderer.view.style.width = width + 'px';
        app.renderer.view.style.height = height + 'px';
        for (var i in graphers)
            graphers[i]();
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
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
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
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    //add dom element
    panel.appendChild(renderer.domElement);
    canvas = renderer.domElement;
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
    var render = function () {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
        // arrow.applyQuaternion(new THREE.Quaternion(0, Math.sin(0.1),0, Math.cos(0.1)));
    };
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
        var cod = tr.map(i / size);
        var pos = tr.toP(cod[0], func(cod[0]));
        graphics.moveTo(pos[0], pos[1]);
        for (var i = 1; i <= size; i++) {
            cod = tr.map(i / size);
            pos = tr.toP(cod[0], func(cod[0]));
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
    var columns = new Array(size);
    var geometry = new THREE.Geometry();
    for (var i = 0; i < 1; i += 1.0 / size) {
        var column = new Array(size);
        for (var j = 0; j < 1; j += 1 / size) {
            var pos = tr.rescale(i, j);
            var cod = tr.map(i, j);
            column[j] = func(cod[0], cod[1]) / tr.range * tr.scale;
            geometry.vertices.push(new THREE.Vector3(pos[0], pos[1], column[j]));
        }
        columns[i] = column;
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
    // geometry.computeFaceNormals();
    //Add surface
    var materialFront = new THREE.MeshPhongMaterial({
        opacity: 0.8,
        color: color,
        transparent: true,
        side: THREE.DoubleSide,
    });
    //  materialFront.depthTest=false;
    var surface = new THREE.Mesh(geometry, materialFront);
    scene.add(surface);
}

function parametricCurve2D(func = (t => new Vec(0, 0, 0)), {
    stage,
    color = 0x569078
}) {
    var graphics = new PIXI.Graphics();
    var graphCurve = () => {
        //Geometry definition
        var size = 200;
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
    var size = 1000;
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
    if (globalScene instanceof PIXI.Container){
        var field = new PIXI.Graphics();
        var grapher = ()=>{
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
        globalScene.addChild(field);
        graphers.push(grapher);
    }
}

function graphSlopeField(func = (x, y) => 0, count = 21, style = fieldStyles.slope) {
    var vecFunc = (vec = new Vec()) => {
        var slope = func(vec.x, vec.y);
        return (Number.isFinite(slope)) ? new Vec(1, slope).normalize().multiply((tr.range) / (count - 1)) :
            (slope > 0) ? new Vec(0, (tr.range) / (count - 1)) : new Vec(0, -(tr.range) / (count - 1));
    }
    var matrix = getMatrix(2, [
        [-tr.range / 2, tr.range / 2]
    ], [count]);
    graphVectorField(vecFunc, matrix, style);
}

function graphNormalSurface(normal = new Vec(0, 0, 1), offset = normal, color = colors.orange) {
    graphCartesian((x, y) => offset.z - (normal.x * (x - offset.x) + normal.y * (y - offset.y)) / normal.z, color);
}

function Transformer(range = 10, scale = 4) {
    this.range = range;
    this.scale = scale;
    this.rescale = function (a, b = 0) {
        return new Array(this.scale * a - this.scale / 2, this.scale * b - this.scale / 2);
    }

    this.map = function (a, b = 0) {
        return new Array(this.range * a - this.range / 2, this.range * b - this.range / 2);
    }
    this.toP = function (a, b = 0) {
        return [a / this.range * this.scale + width / 2,
            -b / this.range * this.scale + height / 2
        ];
    }
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