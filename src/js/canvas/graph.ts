//Module import
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { Dataset,Curve,Surface,Solid} from './types';

/**
 * Each Graph provides an interface for specific
 * datasets to interact with the graphics library
 */
class Graph {
    dataset: Dataset;
    constructor(dataset: Dataset) {
        this.dataset = dataset;
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
    Graph,
    PIXIGraph,
    THREEGraph
}