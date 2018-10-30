// import * as THREE from 'three';
//import * as PIXI from 'pixi.js';
//import * from './operations.js';

var globalScene;
var canvas;

function initialize2D() {
    //Define resize listener
    window.addEventListener("resize", onResize);
    var panel = document.getElementById("graphpanel");
    if (canvas)
        panel.removeChild(canvas);
    function onResize() {
        var height = window.innerHeight,
            width = (window.innerWidth * 0.2 > 300) ? window.innerWidth * 0.8 : window.innerWidth - 300;
        app.renderer.resize(width, height)
    }

    var app = new PIXI.Application({
        width: (window.innerWidth * 0.2 > 300) ? window.innerWidth * 0.8 : window.innerWidth - 300, // default: 800
        height: window.innerHeight, // default: 600
        antialias: true, // default: false
        transparent: true, // default: false
        resolution: 1 // default: 1
    });
    var height = window.innerHeight,
        width = (window.innerWidth * 0.2 > 300) ? window.innerWidth * 0.8 : window.innerWidth - 300;
    //Set renderer size
    app.renderer.autoResize = true;
    app.renderer.resize(width, height);
    app.view.id = "graph";
    // add render view to DOM
    panel.appendChild(app.view);
    canvas = app.view;
    globalScene = app.stage;
    return app.stage;
}

function initialize3D() {
    //Define resize listener
    window.addEventListener("resize", onResize);
    var panel = document.getElementById("graphpanel");
    if(canvas)
        panel.removeChild(canvas);
    
    function onResize() {
        var height = window.innerHeight,
            width = (window.innerWidth * 0.2 > 300) ? window.innerWidth * 0.8 : window.innerWidth - 300;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
    var height = window.innerHeight,
        width = (window.innerWidth * 0.2 > 300) ? window.innerWidth * 0.8 : window.innerWidth - 300;
    //Define scene and camera
    var scene = new THREE.Scene();
    globalScene = scene;
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    var aspect = width / height;
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.y = -5;
    camera.up.set(0, 0, 1);
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    //Setup renderer
    renderer.setSize(width, height);
    renderer.domElement.id = "graph";
    //add dom element
    panel.appendChild(renderer.domElement);
    canvas = renderer.domElement;
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 5, 0);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, -5, 0);
    scene.add(light);
    light = new THREE.AmbientLight(0xffffff, 0.5);
    light.position.set(0, -5, 0);
    scene.add(light);

    //Render
    var render = function () {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    };

    render();
    return scene;
}

function graph2D(func = (x=>0), {
    stage,
    color = 0x569078
}) {
    //Geometry definition
    var size = 200;
    var tr = new Transformer(range = 20, scale = 500);
    var vertices = new Array();
    for (var i = 0; i < 1 + 1.0 / size; i += 1.0 / size) {
        var cod = tr.map(i);
        vertices.push(tr.toP(cod[0], func(cod[0])));
    };

    var graphics = new PIXI.Graphics();

    graphics.lineStyle(2, color, 1);
    // draw a shape
    graphics.moveTo(vertices[0][0], vertices[0][1]);
    for (var i = 1; i <= size; i++) {
        graphics.lineTo(vertices[i][0], vertices[i][1]);
    }
    stage.addChild(graphics);
}

function graph3D(func = ((x = 0, y = 0) => 0), {
    scene,
    color = 0xffffff
}) {
    //Geometry definition
    var size = 200;
    var columns = new Array(size);
    var tr = new Transformer();
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

function parametricCurve(func = (t => new Vec(0,0,0)), {
    stage,
    color = 0x569078
}) {

    //Geometry definition
    var size = 200;
    var tr = new Transformer(range = 20, scale = 500);
    var vertices = new Array();
    for (var i = 0; i < 1+1.0/size; i += 1.0 / size) {
        var vec = func(i);
        vertices.push(tr.toP(vec.x, vec.y));
    };

    var graphics = new PIXI.Graphics();

    graphics.lineStyle(2, color, 1);
    // draw a shape
    graphics.moveTo(vertices[0][0], vertices[0][1]);
    for (var i = 1; i <= size; i++) {
        graphics.lineTo(vertices[i][0], vertices[i][1]);
    }
    stage.addChild(graphics);
}

function parametricSurface(func = ((u = 0, v = 0) => new Vec(0,0,0)), {
    scene,
    color = 0xffffff
}) {
    //Geometry definition
    var size = 200;
    var tr = new Transformer();
    var vecFunc = (u=0,v=0,target) =>{
        var vec = func(u,v).multiply(tr.scale/tr.range);
        return target.set(vec.x, vec.y, vec.z);
    }
    var geometry = new THREE.ParametricGeometry(vecFunc, size, size);
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
        return new Array(a / this.range * this.scale + window.innerWidth * 0.8 / 2, -b / this.range * this.scale + window.innerHeight / 2);
    }
}

function graphCartesian(func = ((x = 0, y = 0) => 0), color = 0xfb6500) {
    if(globalScene instanceof THREE.Scene){
         graph3D(func, {
             scene:globalScene,
             color: color
         });
    }
    if(globalScene instanceof PIXI.Container){
        graph2D(x=>func(x,0), {
            stage:globalScene,
            color: color
        });
    }
}

function graphParametric(func = ((u = 0, v = 0) => new Vec(0, 0, 0)), color = 0x0065fb) {
     if (globalScene instanceof THREE.Scene) {
         parametricSurface(func, {
             scene: globalScene,
             color: color
         });
     }
     if (globalScene instanceof PIXI.Container) {
         parametricCurve(t => func(t, 0), {
             stage: globalScene,
             color: color
         });
     }
}