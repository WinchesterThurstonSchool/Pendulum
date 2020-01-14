//Module import
import * as THREE from 'three';
import './controls';
import * as PIXI from 'pixi.js';
import { Locator } from './locator';
import 'jquery';
import { Dataset } from './types';
import { Graph, PIXIGrid, THREEGrid, PIXIGraph, THREEGraph } from './graph';
/**
 * A wrapper around THREE and PIXI rendering engines to give them the same syntax 
 * to handle with.
 */
abstract class Graphics {
    abstract id: string;
    syncTargets: Map<string, Graphics> = new Map();
    abstract domObject: HTMLCanvasElement;
    abstract rootScene: any;
    protected gridPainter: Graph | undefined;
    protected graphs: Map<string, Graph> = new Map();
    /**
     * Corresponds to the width of the canvas expressed in pixels
     */
    Width: number;
    /**
     * Corresponds to the height of the canvas expressed in pixels
     */
    Height: number;
    /**
     * The rendering interval of the Graphics
     */
    I: number[] = [];
    abstract lc: Locator;
    clock: THREE.Clock;
    // /**
    //  * Indicator for performed synchronization
    //  */
    // protected synchronized: boolean = true;
    /**
     * Pauses the asynchronous animation if set to true
     */
    pause: boolean = false;
    gridStyle: {
        axisColors: number[],
        origin: number[],
        pointer: string,
        pointerSize: number,
        markColors: number[][],
    };
    /**
     * Initializes a common interface for graphics manipulations
     * @param canvas The div in which the graphics renderer sits in
     */
    constructor(public canvas: HTMLDivElement) {
        this.Width = canvas.offsetWidth;
        this.Height = canvas.offsetHeight;
        this.clock = new THREE.Clock(false);
        this.gridStyle = {
            axisColors: [0xff0000, 0x00ff00, 0x0000ff],
            origin: [0, 0, 0],
            pointer: "arrow",
            pointerSize: 0.1,
            markColors: [[0xbbbbbb, 0xdddddd],
            [0xbbbbbb, 0xdddddd],
            [0xbbbbbb, 0xdddddd]],
        }
        this.gridPainter = undefined;
    }
    /**
     * Adds a dataset to the current list of datasets to this and all the synchronized targets
     * @param dataset the dataset to be added, it has to have an id
     * @param color 
     * @param material
     * @param synchronize Whether the operation should be synchronized with the sync targets
     * @returns the Graph object created that contains the dataset
     */
    abstract addDataset(dataset: Dataset, color: number, material?: THREE.Material, synchronize?: boolean): Graph;
    /**
     * Removes the specified dataset from this and all the synchronized targets
     * @param id The id of the dataset to be removed
     * @param synchronize Whether the operation should be synchronized with the sync targets
     */
    removeDataset(id: string, synchronize: boolean): void;
    /**
     * Removes the specified dataset from this and all the synchronized targets
     * @param dataset The dataset to be removed
     * @param synchronize Whether the operation should be synchronized with the sync targets
     */
    removeDataset(dataset: Dataset, synchronize: boolean): void;
    removeDataset(id: string | Dataset, synchronize: boolean = true): void {
        if (id instanceof Dataset) {
            this.removeDataset(id.id, synchronize);
        } else {
            if (synchronize)
                for (let graphics of this.syncTargets)
                    graphics[1].removeDataset(id, false);
            this.removeGraph(id, false);
        }
    }
    /**
     * Adds the graph to the Graphs list directly without initialization
     * and that of all the synchronized targets
     * @param graph the graph to be added
     * @param synchronize Whether the operation should be synchronized with the sync targets
     */
    abstract addGraph(graph: Graph, synchronize: boolean)
    /**
     * Removes the specified graph from this and all the synchronized targets
     * @param id The id of the graph to be removed
     * @param synchronize Whether the operation should be synchronized with the sync targets
     * @return whether the graph existed and has been successfully removed
     */
    removeGraph(id: string, synchronize?: boolean): boolean;
    /**
     * Removes the specified graph from this and all the synchronized targets
     * @param dataset The graph to be removed
     * @param synchronize Whether the operation should be synchronized with the sync targets
     * @returns whether the graph existed and has been successfully removed
     */
    removeGraph(graph: Graph, synchronize?: boolean): boolean;
    removeGraph(id: string | Graph, synchronize: boolean = true): boolean {
        if (id instanceof Dataset) {
            return this.removeGraph(id.id, synchronize);
        } else {
            if (synchronize)
                for (let graphics of this.syncTargets)
                    graphics[1].removeGraph(id as string, false);
            return this.graphs.delete((id as string));
        }
    }
    /**
     * Adds a dynamic grid system to the graph, overrides the existing one
     * @param origin the origin of the grid, where axes are extended from
     * @param marks (intervals, holder)=> [x:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],minor:[...]],
     *                                     y:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],...],...]
     * @param gridStyle the colors of each axis, the style of trailing pointers, allowed values include "arrow", "sphere",
     * "none", the size of the pointer, and the set of colors corresponding to major and minor marks in each direction
     */
    abstract addGrid(marks: (intervals: number[][], holder: number[][][][]) => number[][][][], gridStyle: {
        axisColors: number[],
        origin: number[],
        pointer: string,
        pointerSize: number,
        markColors: number[][],
    }): void;
    /**
     * removes the grid from the graph
     */
    removeGrid(): void {
        this.gridPainter = undefined;
    };
    abstract computeIntervals(): number[][];
    /**
     * Initializes all the graphs that haven't been initialized
     */
    intializeGraphs() {
        let intervals = this.computeIntervals();
        for (let item of this.graphs) {
            item[1].initialize(intervals);
        }
    }
    /**
     * Updates all the graphs in this canvas
     */
    updateGraphs() {
        let intervals = this.computeIntervals();
        if (this.gridPainter != undefined) this.gridPainter.update(intervals);
        for (let item of this.graphs) {
            if(!item[1].initialized){
                item[1].initialize(intervals);
                item[1].initialized=true;
            }
            item[1].update(intervals);
        }
        this.lc.deltax -= 0.01;
        this.lc.deltaz -= 0.05;

    }
    /**
     * Attaches this.domObject to the specified panel
     */
    public attach(): void {
        this.canvas.appendChild(this.domObject);
        window.addEventListener("resize", this.onResize.bind(this));
        this.clock.start();
        this.startAnimation();
    }
    /**
     * Detaches this.domObject from the specified panel
     */
    public detach(): void {
        this.clock.stop();
        this.canvas.onresize = () => { };
        window.removeEventListener("resize", this.onResize.bind(this));
        this.pause = true;
    }
    public animate() {
        if (!this.pause)
            requestAnimationFrame(this.animate.bind(this));
        this.updateGraphs();
        this.render();
    }
    public startAnimation() {
        this.pause = false;
        this.animate();
    }
    public pauseAnimation() {
        this.pause = true;
    }
    /**
     * Called to render the root scene
     */
    abstract render(): void;
    abstract onResize(): void;
    public addSyncTarget(graphics: Graphics) {
        if (graphics === this)
            throw new Error("Cannot add self to the sync target list");
        this.syncTargets.set(graphics.id, graphics);
    }
    public removeSyncTarget(graphics: Graphics): boolean {
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
    protected graphs: Map<string, Graph> = new Map();
    constructor(public canvas: HTMLDivElement, public id = "g2d") {
        super(canvas);
        this.app = new PIXI.Application({
            width: this.Width,
            height: this.Height,
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
        this.renderer.resize(this.Width, this.Height);
        this.lc = new Locator();
        this.lc.A = [[30, 0, 0], [0, -30, 0], [0, 0, 30]];
        this.lc.B = [this.Width / 2, this.Height / 2, 0];
        this.I[0] = this.Width;
        this.I[1] = this.Height;
    }
    computeIntervals(): number[][] {
        let Intervals = [[0, this.Width], [this.Height, 0]];
        let intervals: number[][] = [[], []];
        for (let i = 0; i < 2; i++) {
            let holder = [0, 0, 0];
            holder[i] = Intervals[i][0];
            intervals[i][0] = this.lc.xyz(...holder)[i];
            holder[i] = Intervals[i][1];
            intervals[i][1] = this.lc.xyz(...holder)[i];
        }
        return intervals;
    }
    addDataset(dataset: Dataset, color: number, material?: THREE.Material, synchronize = true): Graph {
        if (synchronize)
            for (let item of this.syncTargets) {
                item[1].addDataset(dataset, color, undefined, synchronize);
            }
        if (dataset.id != undefined) {
            let graph = new PIXIGraph(dataset, this, color);
            this.addGraph(graph, false);
            return graph;
        }
        else throw new Error("Failed to add dataset, the id of " + dataset + " is not defined");
    }
    addGraph(graph: PIXIGraph, synchronize: boolean = true) {
        if (synchronize)
            for (let item of this.syncTargets)
                item[1].addGraph(graph, false);
        this.graphs.set(graph.id, graph);
        this.rootScene.addChild(graph.PIXIObject);
    }
    addGrid(marks: (intervals: number[][], holder: number[][][][]) => number[][][][], gridStyle = {
        axisColors: [0x777777, 0x777777, 0x777777],
        origin: [0, 0, 0],
        pointer: "arrow",
        pointerSize: 2,
        markColors: [[0x999999, 0xbbbbbb], [0x999999, 0xbbbbbb], [0x999999, 0xbbbbbb]],
    }): void {
        /*[x:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],minor:[...]],
     *                                     y:[major:[mark 0:[x1, y1, z1], 1:[x2,y2,z2], ...],...],...]
     */
        let holder = [[[[0, 0, 0]], [[0, 0, 0]]], [[[0, 0, 0]], [[0, 0, 0]]]];
        let grid = new PIXIGrid("*PIXIGrid",this, (intervals: number[][]) => marks(intervals, holder), gridStyle);
        this.rootScene.addChild(grid.PIXIObject);
        this.gridPainter = grid;
    };
    render() {
        this.app.render();
    }
    onResize() {
        this.Width = this.canvas.offsetWidth;
        this.Height = this.canvas.offsetHeight;
        this.lc.B = [this.Width / 2, this.Height / 2, 0]
        this.renderer.resize(this.Width, this.Height);
        // $(this.canvas).outerWidth(this.width);
        // $(this.canvas).outerHeight(this.height);
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
    private renderer: THREE.Renderer;
    lights: { name?: THREE.Light } = {};
    camera: THREE.Camera;
    control: any;
    lc: Locator;
    protected graphs: Map<string, THREEGraph> = new Map();
    constructor(public canvas: HTMLDivElement, public id = "g3d") {
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
        this.camera = this.createPerspectiveCamera();
        //Setup locator for cooridnate transformation
        this.lc = new Locator();
        // @ts-ignore
        this.control = new THREE.OrbitControls(this.camera, this.domObject);
        this.I[0] = this.I[1] = this.I[2] = this.getInterval();
    }
    public addLight(name: string, light: THREE.Light) {
        this.lights[name] = light;
        this.rootScene.add(light);
    }
    public removeLight(name: string) {
        this.rootScene.remove(this.lights[name]);
        delete this.lights[name];
    }
    private createWebGLRenderer(): THREE.WebGLRenderer {
        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.Width, this.Height);
        return renderer;
    }
    private createPerspectiveCamera(): THREE.PerspectiveCamera {
        let aspect = this.Width / this.Height;
        let camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 500);
        camera.position.y = -10;
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 0, 1);
        return camera;
    }
    computeIntervals(): number[][] {
        let Intervals = [[-5, 5], [-5, 5], [-5, 5]]
        let intervals: number[][] = [[], [], []];
        for (let i = 0; i < 3; i++) {
            let holder = [0, 0, 0];
            holder[i] = Intervals[i][0];
            intervals[i][0] = this.lc.xyz(...holder)[i];
            holder[i] = Intervals[i][1];
            intervals[i][1] = this.lc.xyz(...holder)[i];
        }
        return intervals;
    }
    private getInterval(): number {
        return Math.min(this.Width, this.Height) * 4 / 5;
    }
    /**
     * Adds a dataset to the current list of datasets to this and all the synchronized targets
     * @param dataset the dataset to be added, it has to have an id
     * @param synchronize Whether the operation should be synchronized with the sync targets
     * @returns the Graph object created that contains the dataset
     */
    addDataset(dataset: Dataset, color: number, material?: THREE.Material, synchronize = true): Graph {
        if (synchronize)
            for (let graphics of this.syncTargets) {
                graphics[1].addDataset(dataset, color, material, false);
            }
        if (dataset.id != undefined) {
            let graph = new THREEGraph(dataset, this, color, material);
            this.addGraph(graph, false);
            return graph;
        }
        else throw new Error("Failed to add dataset, the id of " + dataset + " is not defined");
    }
    addGraph(graph: THREEGraph, synchronize: boolean = true) {
        if (synchronize)
            for (let item of this.syncTargets)
                item[1].addGraph(graph, false);
        this.graphs.set(graph.id, graph);
        this.rootScene.add(graph.THREEObject);
    }
    addGrid(marks: (intervals: number[][], holder: number[][][][]) => number[][][][], gridStyle = {
        axisColors: [0x777777, 0x777777, 0x777777],
        origin: [0, 0, 0],
        pointer: "arrow",
        pointerSize: 2,
        markColors: [[0x999999, 0xbbbbbb], [0x999999, 0xbbbbbb], [0x999999, 0xbbbbbb]],
    }): void {
        let holder = [[[[0, 0, 0]], [[0, 0, 0]]], [[[0, 0, 0]], [[0, 0, 0]]], [[[0, 0, 0]], [[0, 0, 0]]]];
        let grid = new THREEGrid("*THREEGrid", this, (intervals: number[][]) => marks(intervals, holder), gridStyle);
        this.rootScene.add(grid.THREEObject);
        this.gridPainter = grid;
    };
    removeGrid(){
        super.removeGrid();
        this.rootScene.remove((this.gridPainter as THREEGrid).THREEObject);
    }
    render() {
        this.renderer.render(this.rootScene, this.camera);
    }
    onResize() {
        this.Width = this.canvas.offsetWidth;
        this.Height = this.canvas.offsetHeight;
        // $(this.canvas).outerWidth(this.width);
        // $(this.canvas).outerHeight(this.height);
        this.renderer.setSize(this.Width, this.Height);
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = this.Width / this.Height;
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