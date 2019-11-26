//Module import
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import {Locator} from './locator';
import 'jquery';
/**
 * A wrapper around THREE and PIXI rendering engines to give them the same syntax 
 * to handle with.
 */
abstract class Graphics {
    abstract id: string;
    abstract domObject: HTMLCanvasElement;
    abstract rootScene: any;
    width:number;
    height: number;
    abstract lc: Locator;
    /**
     * Initializes a common interface for graphics manipulations
     * @param canvas The div in which the graphics renderer sits in
     */
    constructor(public canvas:HTMLDivElement){
        this.width = canvas.offsetWidth;
        this.height = canvas.offsetHeight;
    }
    /**
     * Updates all the datasets (graphed functions) in this canvas
     */
    abstract updateData():void;
    /**
     * Called to render the root scene
     */
    abstract render(): void;
    abstract onResize(): void;
    /**
     * Attaches this.domObject to the specified panel
     */
    public attach(): void {
        this.canvas.appendChild(this.domObject);
    }
    /**
     * Detaches this.domObject from the specified panel
     */
    public detach(): void {
        this.canvas.removeChild(this.domObject);
    }
}

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
        return camera
    }
    updateData(){

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

class Graphics2D extends Graphics {
    domObject: HTMLCanvasElement;
    rootScene: PIXI.Container;
    app: PIXI.Application;
    private renderer:PIXI.Renderer;
    lc: Locator;
    constructor(public canvas:HTMLDivElement, public id = "g2d"){
        super(canvas);
        this.app = new PIXI.Application({
            width: this.width,
            height: this.height,
            antialias: true, // default: false
            transparent: true, // default: false
            resolution: 1 // default: 1
        });
        this.domObject = this.app.view;
        this.domObject.id=id;
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
        this.lc.B=[this.width/2, this.height/2,0];
    }
    updateData(){

    }
    render(){
        this.app.render();
    }
    onResize(){
        this.width=this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.lc.B = [this.width / 2, this.height / 2, 0]
        this.renderer.resize(this.width, this.height);
        $(this.canvas).outerWidth(this.width);
        $(this.canvas).outerHeight(this.height);
        this.updateData();
        this.render();
    }
}
