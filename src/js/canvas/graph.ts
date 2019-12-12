//Module import
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { Dataset,Curve,Surface,Solid} from './types';
import { Graphics } from './graphics';
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
};
/**
 * Each Graph provides an interface for specific
 * datasets to interact with the graphics library
 */
abstract class Graph {
    id: string;
    initialized = false;
    constructor(public dataset: Dataset, public graphics: Graphics, public color: number, public material?: THREE.Material) {
        this.id = dataset.id;
    }
    abstract initialize(): void;
    abstract update(): void;
}

/**
 * dataset representations through PIXI
 */
class PIXIGraph extends Graph{
    PIXIObject: PIXI.Graphics;
    vertices: THREE.Vector3[];
    constructor(dataset: Dataset, graphics: Graphics, color: number){
        super(dataset, graphics, color);
        this.PIXIObject= new PIXI.Graphics();
        this.vertices = [];
    }
    initialize(): void {
        if (this.initialized) return;
        this.dataset.initialize(this.graphics.lc, this.vertices);
        this.initialized = true;
    }
    update():void{
        this.dataset.update(this.graphics.lc, this.vertices);
    }
}

/**
 * dataset representations through THREE
 */
class THREEGraph extends Graph {
    THREEObject: THREE.Mesh;
    geometry: THREE.Geometry;
    vertices: THREE.Vector3[];
    faces: THREE.Face3[];
    static getMaterial(color: number, material: new ({ }) => THREE.Material, opacity: number): THREE.Material {
        return new material({
            opacity: 0.8,
            transparent: (opacity === 1) ? false : true,
            side: THREE.DoubleSide,
            color: 0x7890ab
        });
    }
    constructor(dataset: Dataset, graphics: Graphics, color: number, material: THREE.Material = materials.standard) {
        super(dataset, graphics, color, material);
        //Inject color into the material 
        //@ts-ignore
        material.color = color;
        this.geometry = new THREE.Geometry();
        this.faces=this.geometry.faces;
        this.vertices = this.geometry.vertices;
        this.THREEObject = new THREE.Mesh(this.geometry, material);
    }
    initialize(): void {
        if(this.initialized) return;
        this.dataset.initialize(this.graphics.lc, this.vertices, this.faces);
        this.initialized = true;
    }
    update(): void {
        this.dataset.update(this.graphics.lc, this.vertices, this.faces)
    }
}

export {
    Graph,
    PIXIGraph,
    THREEGraph
}