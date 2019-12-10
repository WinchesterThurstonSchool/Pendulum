//Module import
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Locator} from './locator';
import 'jquery';
import { Dataset } from './types';
/**
 * A wrapper around THREE and PIXI rendering engines to give them the same syntax 
 * to handle with.
 */
abstract class Graphics {
    abstract id: string;
    abstract domObject: HTMLCanvasElement;
    abstract rootScene: any;
    protected graphs: {id?: Dataset}={};
    width:number;
    height: number;
    abstract lc: Locator;
    clock: THREE.Clock;
    /**
     * Pauses the asynchronous animation if set to true
     */
    pause: boolean = false;
    /**
     * Initializes a common interface for graphics manipulations
     * @param canvas The div in which the graphics renderer sits in
     */
    constructor(public canvas:HTMLDivElement){
        this.width = canvas.offsetWidth;
        this.height = canvas.offsetHeight;
        this.clock = new THREE.Clock(false);
    }
    /**
     * Adds a dataset to the current list of datasets
     * @param dataset the dataset to be added, it has to have an id
     */
    addDataset(dataset: Dataset, color: number, material?:THREE.Material) {
        if(dataset.id != undefined){
            this.graphs[dataset.id] = dataset;
        }
        else throw new Error("Failed to add dataset, the id of "+dataset+" is not defined");
    }
    /**
     * Removes the specified dataset
     * @param id The id of the dataset to be removed
     */
    removeDataset(id: number):Dataset;
    /**
     * Removes the specified dataset
     * @param dataset The dataset to be removed
     */
    removeDataset(dataset: Dataset): void;
    removeDataset(id: number|Dataset):Dataset|void{
        // @TODO: implement the method
        if(id instanceof Dataset){

        }else{

        }
    }
    /**
     * adds the graph to the Graphs list directly
     * @param graph the graph to be added
     */
    addGraph(graph: Graph){
        // @TODO: Implement the method
    }
    /**
     * Removes the specified graph
     * @param id The id of the graph to be removed
     */
    removeGraph(id: number): Dataset;
    /**
     * Removes the specified graph
     * @param dataset The graph to be removed
     */
    removeGraph(graph: Graph): void;
    removeGraph(id: number | Graph): Dataset | void {
        // @TODO: implement the method
        if (id instanceof Dataset) {

        } else {

        }
    }
    /**
     * Updates all the datasets (graphed functions) in this canvas
     */
    abstract updateGraphs():void;
    /**
     * Called to render the root scene
     */
    abstract render(): void;
    abstract onResize(): void;
    /**
     * Attaches this.domObject to the specified panel
     */
    public attach(): void {
        this.pause = false;
        this.canvas.appendChild(this.domObject);
        this.clock.start();
        this.animate();
    }
    /**
     * Detaches this.domObject from the specified panel
     */
    public detach(): void {
        this.clock.stop();
        this.canvas.removeChild(this.domObject);
        this.pause = true;
    }
    public animate(){
        if(!this.pause)
            requestAnimationFrame(this.animate);
        this.updateGraphs();
        this.render();
    }
}

/**
 * Standard 2D graphical representation
 */
class Graphics2D extends Graphics {
    domObject: HTMLCanvasElement;
    rootScene: PIXI.Container;
    app: PIXI.Application;
    private renderer: PIXI.Renderer;
    lc: Locator;
    vertices: THREE.Vector3[]=[];
    constructor(public canvas: HTMLDivElement, public id = "g2d") {
        super(canvas);
        this.app = new PIXI.Application({
            width: this.width,
            height: this.height,
            antialias: true, // default: false
            transparent: true, // default: false
            resolution: 1 // default: 1
        });
        this.domObject = this.app.view;
        this.domObject.id = id;
        //Setup root scene
        this.rootScene = this.app.stage;
        //Setup renderer
        this.renderer = this.app.renderer;
        this.app.renderer.autoDensity = true;
        //purpose served by autoDensity which takes into acount of the window.devicePixelRatio
        // this.renderer.resolution = window.devicePixelRatio; 
        this.renderer.resize(this.width, this.height);
        this.lc = new Locator();
        this.lc.A = [[30, 0, 0], [0, -30, 0], [0, 0, 0]];
        this.lc.B = [this.width / 2, this.height / 2, 0];
    }
    updateGraphs() {
        for(let id in this.graphs){
            (this.graphs[id] as Dataset).update(this.lc,this.vertices);
        }
        for(let id in this.graphs){

        }
    }
    render() {
        this.app.render();
    }
    onResize() {
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.lc.B = [this.width / 2, this.height / 2, 0]
        this.renderer.resize(this.width, this.height);
        $(this.canvas).outerWidth(this.width);
        $(this.canvas).outerHeight(this.height);
        this.updateGraphs();
        this.render();
    }
}

/**
 * Standard 3D graphical representation
 */
class Graphics3D extends Graphics {
    domObject: HTMLCanvasElement;
    rootScene: THREE.Scene;
    private renderer:THREE.Renderer;
    lights: {name?:THREE.Light}={};
    camera: THREE.Camera;
    lc: Locator;
    constructor(public canvas:HTMLDivElement, public id = "g3d"){
        super(canvas);
        this.renderer = this.createWebGLRenderer();
        this.domObject = this.renderer.domElement;
        //Attach dom object
        this.domObject.id = id;
        //Create scene
        this.rootScene = new THREE.Scene();
        //Setup lighting
        let topLight = new THREE.DirectionalLight(0xffffff, 0.5);
        topLight.position.set(0, 0, 5);
        this.addLight("top", topLight);
        let botLight = new THREE.DirectionalLight(0xffffff, 0.5);
        botLight.position.set(0, 0, -5);
        this.addLight("bot", botLight);
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.addLight("ambient", ambientLight);
        //Setup camera
        this.camera=this.createPerspectiveCamera();
        //Setup locator for cooridnate transformation
        this.lc=new Locator();
    }
    public addLight(name: string, light:THREE.Light){
        this.lights[name]=light;
        this.rootScene.add(light);
    }
    public removeLight(name: string){
        this.rootScene.remove(this.lights[name]);
        delete this.lights[name];
    }
    private createWebGLRenderer():THREE.WebGLRenderer{
        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.width, this.height);
        return renderer;
    }
    private createPerspectiveCamera():THREE.PerspectiveCamera{
        let aspect = this.width / this.height;
        let camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 500);
        camera.position.y = -5;
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 0, 1);
        return camera;
    }
    updateGraphs(){

    }
    render(){
        this.renderer.render(this.rootScene, this.camera);
    }
    onResize() {
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        if(this.camera instanceof THREE.PerspectiveCamera){
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        }
        if (this.camera instanceof THREE.OrthographicCamera)
            this.camera.updateProjectionMatrix();
        this.renderer.render(this.rootScene, this.camera);
    }
}


/**
 * Each Graph provides an interface for specific
 * datasets to interact with the graphics library
 */
class Graph {
    dataset: Dataset;
    lc: Locator;
    constructor(dataset: Dataset, lc: Locator) {
        this.dataset = dataset;
        this.lc = lc;
    }
}

/**
 * dataset representations through PIXI
 */
class PIXIGraph {
    static getMaterial(color: number, material: new ({ }) => THREE.Material, opacity: number): THREE.Material {
        return new material({
            opacity: 0.8,
            transparent: (opacity === 1) ? false : true,
            side: THREE.DoubleSide,
            color: 0x7890ab
        });
    }
}

/**
 * dataset representations through THREE
 */
class THREEGraph {

}

export {
    Graphics,
    Graphics2D,
    Graphics3D,
    Graph
}