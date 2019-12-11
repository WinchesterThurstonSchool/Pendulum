//Module import
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Locator} from './locator';
import 'jquery';
import { Dataset } from './types';
import { Graph } from './graph';
/**
 * A wrapper around THREE and PIXI rendering engines to give them the same syntax 
 * to handle with.
 */
abstract class Graphics {
    abstract id: string;
    syncTargets: Map<string,Graphics>=new Map();
    abstract domObject: HTMLCanvasElement;
    abstract rootScene: any;
    protected graphs: Map<string, Graph>=new Map();
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
     * Adds a dataset to the current list of datasets to this and all the synchronized targets
     * @param dataset the dataset to be added, it has to have an id
     * @returns the Graph object created that contains the dataset
     */
    addDataset(dataset: Dataset, color: number, material?:THREE.Material):Graph{
        for(let graphics of this.syncTargets){
            graphics[1].addDataset(dataset, color, material);
        }
        if(dataset.id != undefined){
            let graph = new Graph(dataset, this, color, material);
            this.addGraph(graph);
            return graph;
        }
        else throw new Error("Failed to add dataset, the id of "+dataset+" is not defined");
    }
    /**
     * Removes the specified dataset from this and all the synchronized targets
     * @param id The id of the dataset to be removed
     */
    removeDataset(id: string):void;
    /**
     * Removes the specified dataset from this and all the synchronized targets
     * @param dataset The dataset to be removed
     */
    removeDataset(dataset: Dataset): void;
    removeDataset(id: string|Dataset):void{
        if(id instanceof Dataset){
            this.removeGraph(id.id);
        }else{
            for (let graphics of this.syncTargets)
                graphics[1].removeDataset(id);
            this.removeGraph(id);
        }
    }
    /**
     * Adds the graph to the Graphs list directly without initialization
     * to this and all the synchronized targets
     * @param graph the graph to be added
     */
    addGraph(graph: Graph){
        for (let graphics of this.syncTargets)
            graphics[1].addGraph(graph);
        this.graphs.set(graph.id, graph);
    }
    
    /**
     * Removes the specified graph from this and all the synchronized targets
     * @param id The id of the graph to be removed
     * @return whether the graph existed and has been successfully removed
     */
    removeGraph(id: string): boolean;
    /**
     * Removes the specified graph from this and all the synchronized targets
     * @param dataset The graph to be removed
     * @returns whether the graph existed and has been successfully removed
     */
    removeGraph(graph: Graph): boolean;
    removeGraph(id: string | Graph): boolean {
        if (id instanceof Dataset) {
            return this.removeGraph(id.id);
        } else {
            for (let graphics of this.syncTargets)
                graphics[1].removeGraph(id as string);
            return this.graphs.delete((id as string));
        }
    }
    /**
     * Initializes all the renderer related fields in graphs that hasn't been intialized
     */
    abstract initializeGraphs(): void;
    /**
     * Updates all the graphs in this canvas
     */
    abstract updateGraphs():void;
    /**
     * Attaches this.domObject to the specified panel
     */
    public attach(): void {
        this.canvas.appendChild(this.domObject);
        this.initializeGraphs();
        this.clock.start();
        this.startAnimation();
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
    public startAnimation(){
        this.pause=false;
        this.animate();
    }
    public pauseAnimation(){
        this.pause = true;
    }
    /**
     * Called to render the root scene
     */
    abstract render(): void;
    abstract onResize(): void;
    public addSyncTarget(graphics: Graphics){
        if(graphics===this)
            throw new Error("Cannot add self to the sync target list");
        this.syncTargets.set(graphics.id, graphics);
    }
    public removeSyncTarget(graphics: Graphics): boolean{
        return this.syncTargets.delete(graphics.id);
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
    addDataset(dataset: Dataset, color: number): Graph {
        return super.addDataset(dataset, color);
    }
    initializeGraphs(){

    }
    updateGraphs() {

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
    initializeGraphs(){

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

export {
    Graphics,
    Graphics2D,
    Graphics3D,
}