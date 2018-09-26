import * as THREE from 'three';

function graph3D(func){
    window.addEventListener("resize", onResize);
    //Listener for window resizing
    function onResize() {
        let height = window.innerHeight,
            width = window.innerWidth;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    //Instantiate graphic classes needed
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    var controls = new THREE.OrbitControls(camera);
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    //Add renderer to the window
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    document.body.appendChild(renderer.domElement);
    //Define objects
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);
    light = new THREE.PointLight(0x999999, 2, 50);
    light.add(new THREE.Mesh(cube, new THREE.MeshBasicMaterial({
        color: 0x999999
    })));
    light.position.x = 3;
    light.position.y = 3;
    light.position.z = 3;
    //Add objects
    scene.add(cube);
    scene.add(light);
    //Render
    controls.addEventListener((e) => {
        controls.update();
        renderer.render(scene, camera);
    });
    renderer.render(scene, camera);

}

function graph2D(func){

}

function Transformer(scale = 1, resolution = 100, transit = 0, offset = 0) {
    
}