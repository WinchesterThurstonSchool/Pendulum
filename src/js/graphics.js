// import * as THREE from 'three';
//import * as PIXI from 'pixi.js'

function graph3D(func=((x=0,y=0)=>0)){
    //Define resize listener
    window.addEventListener("resize", onResize);
    var panel = document.getElementById("graphpanel");
    console.log(panel.offsetHeight);
    function onResize() {
        var height = window.innerHeight,
            width = window.innerWidth*0.8;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }

    //Define scene and camera
    var scene = new THREE.Scene();
    var aspect = window.innerWidth*0.8 / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    //Setup renderer
    renderer.setSize(window.innerWidth*0.8, window.innerHeight);
    panel.appendChild(renderer.domElement);

    //Geometry definition
    var size = 200;
    var columns = new Array(size);
    var tr = new Transformer();
    var geometry = new THREE.Geometry();
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    for (var i = 0; i < 1; i += 1.0 / size) {
        var column = new Array(size);
        for (var j = 0; j < 1; j += 1 / size) {
            var pos = tr.rescale(i, j);
            var cod = tr.map(i, j);
            column[j] = func(cod[0], cod[1]) / tr.range * tr.scale;
            geometry.vertices.push(new THREE.Vector3(pos[0], column[j], -pos[1]));
        }
        columns[i] = column;
    };

    for (var i = 0; i < size - 1; i += 1) {
        for (var j = 0; j < size - 1; j += 1) {
            //var face1 = new THREE.Face3(i * size + j, i * size + j + 1, (i + 1) * size + j + 1);
            var face2 = new THREE.Face3(i*size+j,(i+1)*size+j+1, i*size+j+1);
            var face3 = new THREE.Face3(i*size+j, (i+1)*size+j,(i+1)*size+j+1);
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
     var materialFront = new THREE.MeshNormalMaterial();
    var materialBack = new THREE.MeshNormalMaterial({
        side: THREE.BackSide
    });
    var surfaceFront = new THREE.Mesh(geometry, materialFront);
    scene.add(surfaceFront);
    var surfaceBack = new THREE.Mesh(geometry, materialBack);
    scene.add(surfaceBack);
    //Add lighting
    var light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(50, 50, 50);
    scene.add(light);
    //Render
    var render = function () {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    };

    render();
}

function graph2D(func){
    //Define resize listener
    window.addEventListener("resize", onResize);
    function onResize() {
        var height = window.innerHeight,
            width = window.innerWidth;
        app.renderer.resize(width, height)
    }

   var app = new PIXI.Application({
       width: window.innerWidth, // default: 800
       height: window.innerHeight, // default: 600
       antialias: true, // default: false
       transparent: true, // default: false
       resolution: 1 // default: 1
   });

   //Set renderer size
   app.renderer.autoResize = true;
   app.renderer.resize(window.innerWidth, window.innerHeight);

    // add render view to DOM
    document.body.appendChild(app.view);


     //Geometry definition
     var size = 200;
     var tr = new Transformer(range = 20, scale = 500);
     var vertices = new Array();
     for (var i = 0; i < 1; i += 1.0 / size) {
         var cod = tr.map(i);
         vertices.push(tr.toP(cod[0], func(cod[0])));
     };

    var graphics = new PIXI.Graphics();

    graphics.lineStyle(2, 0xffd900, 1);
    // draw a shape
    graphics.moveTo(vertices[0][0],vertices[0][1]);
    for(var i = 1; i<size; i++){
        graphics.lineTo(vertices[i][0], vertices[i][1]);
    }
    app.stage.addChild(graphics);
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
    this.toP = function(a, b =0){
        return new Array(a/this.range*this.scale+window.innerWidth/2, -b/this.range*this.scale+window.innerHeight/2);
    }
}
//  window.addEventListener("resize", onResize);

// function onResize() {
//     var height = window.innerHeight,
//         width = window.innerWidth;
//     renderer.setSize(width, height);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
// }
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
// var controls = new THREE.OrbitControls(camera);
// var renderer = new THREE.WebGLRenderer({
//     antialias: true
// });
// renderer.setSize(window.innerWidth, window.innerHeight, false);
// document.body.appendChild(renderer.domElement);

// function f(x, y) {
//     return Math.sin(x) + Math.cos(y);
// }
// var size = 200;
// var range = 8;
// var scale = 4;
// var columns = new Array(size);

// function rescale(a, b) {
//     return new Array(scale * a - scale / 2, scale * b - scale / 2);
// }

// function map(a, b) {
//     return new Array(range * a - range / 2, range * b - range / 2);
// }
// var geometry = new THREE.Geometry();
// for (var i = 0; i < 1; i += 1.0 / size) {
//     var column = new Array(size);
//     for (var j = 0; j < 1; j += 1 / size) {
//         var pos = rescale(i, j);
//         var cod = map(i, j);
//         column[j] = f(cod[0], cod[1]) / range * scale;
//         geometry.vertices.push(new THREE.Vector3(pos[0], column[j], -pos[1]));
//     }
//     columns[i] = column;
// };

// for (var i = 0; i < size - 1; i += 1) {
//     for (var j = 0; j < size - 1; j += 1) {
//         var face1 = new THREE.Face3(i * size + j, i * size + j + 1, (i + 1) * size + j + 1);
//         // var face2 = new THREE.Face3(i*size+j,(i+1)*size+j+1, i*size+j+1);
//         // var face3 = new THREE.Face3(i*size+j, (i+1)*size+j,(i+1)*size+j+1);
//         var face4 = new THREE.Face3(i * size + j, (i + 1) * size + j + 1, (i + 1) * size + j);
//         geometry.faces.push(face1);
//         /* geometry.faces.push(face2);*/
//         // geometry.faces.push(face3);
//         geometry.faces.push(face4);
//     }
// };
// geometry.mergeVertices();
// geometry.computeVertexNormals();
// // geometry.computeFaceNormals();
// var material = new THREE.MeshStandardMaterial({
//     color: 0xffffff,
//     transparent: true,
//     opacity: .7,
//     shading: THREE.SmoothShading,
// });
// var materialBack = new THREE.MeshStandardMaterial({
//     color: 0xffffff,
//     transparent: true,
//     opacity: .7,
//     shading: THREE.SmoothShading,
//     side: THREE.BackSide
// });
// var metalness = 0.8;
// material.metalness = metalness;
// materialBack.metalness = metalness;
// var funciton = new THREE.Mesh(geometry, material);
// scene.add(funciton);
// var funcitonBack = new THREE.Mesh(geometry, materialBack);
// scene.add(funcitonBack);
// camera.position.z = 12;
// var sphere = new THREE.TorusGeometry(0.2, 0.05, 50, 50);
// var light1, light2, light3, light4;

// light1 = new THREE.PointLight(0xff0040, 2, 50);
// light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
//     color: 0xff0040
// })));
// scene.add(light1);
// light2 = new THREE.PointLight(0x0040ff, 2, 50);
// light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
//     color: 0x0040ff
// })));
// scene.add(light2);
// light3 = new THREE.PointLight(0x80ff80, 2, 50);
// light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
//     color: 0x80ff80
// })));
// // scene.add(light3);
// light4 = new THREE.PointLight(0xffaa00, 2, 50);
// light4.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
//     color: 0xffaa00
// })));
// // scene.add(light4);
// var time = 0;

// function animate() {

//     requestAnimationFrame(animate);
//     time += 0.01;
//     light1.position.x = Math.sin(time * 0.7) * 3;
//     light1.position.y = -Math.cos(time * 0.5) * 3;
//     light1.position.z = Math.cos(time * 0.3) * 3;
//     light2.position.x = Math.cos(time * 0.3) * 3;
//     light2.position.y = Math.sin(time * 0.5) * 3;
//     light2.position.z = -Math.sin(time * 0.7) * 3;
//     light3.position.x = -Math.sin(time * 0.7) * 3;
//     light3.position.y = -Math.cos(time * 0.3) * 3;
//     light3.position.z = -Math.sin(time * 0.5) * 3;
//     light4.position.x = Math.sin(time * 0.3) * 3;
//     light4.position.y = Math.cos(time * 0.7) * 3;
//     light4.position.z = -Math.sin(time * 0.5) * 3;
//     light4.rotation.x = time;
//     light4.rotation.y = time;
//     light2.rotation.x = time;
//     light2.rotation.z = time;
//     light3.rotation.z = time;
//     light3.rotation.y = time;
//     light1.rotation.x = time;
//     light1.rotation.y = time;

//     // required if controls.enableDamping or controls.autoRotate are set to true
//     controls.update();

//     renderer.render(scene, camera);

// }
// animate();