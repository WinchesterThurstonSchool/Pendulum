//Module import
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { Dataset,Curve,Surface,Solid} from './types';
import { Graphics } from './graphics';

/**
 * Each Graph provides an interface for specific
 * datasets to interact with the graphics library
 */
class Graph {
    id: string;
    dataset: Dataset;
    /**
     * Indicates whether the visualization (geometry, vertices, etc.) of this has been initialized
     */
    initialized: boolean;
    constructor(dataset: Dataset, graphics: Graphics, color: number, material?: THREE.Material) {
        this.id = dataset.id;
        this.dataset = dataset;
        this.initialized = false;
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