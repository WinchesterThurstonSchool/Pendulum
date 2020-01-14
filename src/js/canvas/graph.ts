//Module import
import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { Dataset, Curve, Surface, Solid } from './types';
import { Graphics, Graphics3D } from './graphics';
import { Locator } from './locator';
import { timingSafeEqual } from 'crypto';
import { Group, Vector3, Line } from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { runInThisContext } from 'vm';
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
    initialized = false;
    constructor(public id: string, public graphics: Graphics) {
    }
    /**
     * Initializes the graphable object in Graph based on the intervals specified,
     * instantiates reusable objects if needed for the first time
     * @param intervals [[xbegin, xend], [ybegin, yend]...] in virtual coordinates
     */
    abstract initialize(intervals: number[][]): void;
    /**
     * Renders the graphable object in Graph based on the intervals specified, responding
     * to calls from the graphics animation loop
     * @param intervals [[xbegin, xend], [ybegin, yend]...] in virtual coordinates
     */
    abstract update(intervals: number[][]): void;
}

/**
 * dataset representations through PIXI
 */
class PIXIGraph extends Graph {
    PIXIObject: PIXI.Graphics;
    vertices: THREE.Vector3[];
    constructor(public dataset: Dataset, graphics: Graphics, public color: number) {
        super(dataset.id, graphics);
        this.PIXIObject = new PIXI.Graphics();
        this.vertices = [];
    }
    initialize(intervals: number[][]): void {
        if (this.initialized) return;
        this.dataset.initialize(this.graphics.lc, this.vertices);
    }
    update(intervals: number[][]): void {
        this.dataset.update(this.graphics.lc, this.vertices);
    }
}

class PIXIGrid extends Graph {
    PIXIObject: PIXI.Graphics = new PIXI.Graphics();
    constructor(id: string, graphics: Graphics, public marksFunction: (intervals: number[][]) => number[][][][], public gridStyle = {
        axisColors: [0xff0000, 0x00ff00, 0x0000ff],
        origin: [0, 0, 0],
        pointer: "arrow",
        pointerSize: 2,
        markColors: [[0x999999, 0xeeeeee], [0x999999, 0xeeeeee], [0x999999, 0xeeeeee]],
    }) {
        super(id, graphics);
    }
    initialize(intervals: number[][]) {
    }
    update(intervals: number[][]) {
        //Geometry definition
        var size = 2000;
        this.PIXIObject.clear();
        let lc: Locator = this.graphics.lc;
        let marks = this.marksFunction(intervals);
        for (let i = 0; i < marks.length; i++) {
            let vMarks = marks[i];
            for (let j = 0; j < vMarks.length; j++) {
                let color = this.gridStyle.markColors[i][j];
                this.PIXIObject.lineStyle(1 / (j + 2), color);
                for (let v of vMarks[j]) {
                    v[i] = intervals[i][0];
                    // console.log(v);
                    this.PIXIObject.moveTo(lc.X(...v), lc.Y(...v));
                    v[i] = intervals[i][1];
                    // console.log(v);
                    this.PIXIObject.lineTo(lc.X(...v), lc.Y(...v));
                }
            }
            let axisColor = this.gridStyle.axisColors[i];
            this.PIXIObject.lineStyle(2, axisColor);
            let begin = this.gridStyle.origin.slice();
            let end = this.gridStyle.origin.slice();
            begin[i] = intervals[i][0]
            end[i] = intervals[i][1];
            this.PIXIObject.moveTo(lc.X(...begin), lc.Y(...begin));
            this.PIXIObject.lineTo(lc.X(...end), lc.Y(...end));
        }
    }
}

class THREEGrid extends Graph {
    lines: THREE.Line[] = [];
    THREEObject: THREE.Group;
    lineCount: number;
    constructor(id: string, graphics: Graphics, public marksFunction: (intervals: number[][]) => number[][][][], public gridStyle = {
        axisColors: [0xff0000, 0x00ff00, 0x0000ff],
        origin: [0, 0, 0],
        pointer: "arrow",
        pointerSize: 2,
        markColors: [[0x999999, 0xeeeeee], [0x999999, 0xeeeeee], [0x999999, 0xeeeeee]],
    }) {
        super(id, graphics);
        this.THREEObject = new Group();
    }
    initialize(intervals: number[][]) {
    }
    clear() {
        this.lineCount = 0;
        for (let line of this.lines) {
            (line.geometry as THREE.Geometry).vertices[0].set(0, 0, 0);
            (line.geometry as THREE.Geometry).vertices[1].set(0, 0, 0);
        }
    }
    draw(a: number[], b: number[], color: number, width: number) {
        if (this.lines[this.lineCount] == undefined) {
            // let geometry = new THREE.Geometry();
            // geometry.vertices.push(new Vector3(...a));
            // geometry.vertices.push(new Vector3(...b));
            // let material = new MeshLineMaterial({
            //     useMap: false,
            //     color: new THREE.Color(color),
            //     opacity: 1,
            //     sizeAttenuation: !false,
            //     lineWidth: .01,
            //     near: (this.graphics as Graphics3D).camera.near,
            //     far: (this.graphics as Graphics3D).camera.far
            // });
            // let line = new MeshLine();
            // this.lines[this.lineCount]=line;
            // line.setGeometry(geometry);
            // var mesh = new THREE.Mesh(line.geometry, material); // this syntax could definitely be improved!
            // this.THREEObject.add(mesh);
            let geometry = new THREE.Geometry();
            geometry.vertices.push(new Vector3(...a));
            geometry.vertices.push(new Vector3(...b));
            let material = new THREE.LineBasicMaterial({ color: color, linewidth: width });
            this.lines[this.lineCount] = new THREE.Line(geometry, material);
            this.THREEObject.add(this.lines[this.lineCount]);
        } else {
            let line = this.lines[this.lineCount];
            (line.geometry as THREE.Geometry).vertices[0].set(a[0], a[1], a[2]);
            (line.geometry as THREE.Geometry).vertices[1].set(b[0], b[1], b[2]);
            (line.material as THREE.LineBasicMaterial).color.setHex(color);
            (line.material as THREE.LineBasicMaterial).linewidth = width;
            (line.geometry as THREE.Geometry).verticesNeedUpdate = true;
        }
        this.lineCount++;
    }
    update(intervals: number[][]) {
        let lc: Locator = this.graphics.lc;
        this.clear();
        let marks = this.marksFunction(intervals);
        for (let i = 0; i < marks.length; i++) {
            let vMarks = marks[i];
            for (let j = vMarks.length - 1; j >= 0; j--) {
                let color = this.gridStyle.markColors[i][j];
                let lineWidth = 0.1;
                let next1CoordSameLevel = marks[(i + 1) % marks.length][j],
                    next2CoordSameLevel = marks[(i + 2) % marks.length][j];
                // if(next1CoordSameLevel==undefined||next1CoordSameLevel.length==0)
                //     next1CoordSameLevel = next2CoordSameLevel;
                // if(next2CoordSameLevel == undefined||next2CoordSameLevel.length==0){
                //     next2CoordSameLevel = next1CoordSameLevel;
                //     if(next2CoordSameLevel == undefined||next2CoordSameLevel.length==0){
                //         next1CoordSameLevel=next2CoordSameLevel = [[0,0,0]]
                //     }
                // }
                
                let min =Math.min(next1CoordSameLevel[0][i], next2CoordSameLevel[0][i]);
                let max =Math.max(next1CoordSameLevel[next1CoordSameLevel.length - 1][i], next2CoordSameLevel[next2CoordSameLevel.length - 1][i]);
                for (let v of vMarks[j]) {
                    v[i] = min;
                    let vertexA = lc.XYZ(...v);
                    v[i] = max;
                    let vertexB = lc.XYZ(...v);
                    this.draw(vertexA, vertexB, color, lineWidth);
                }
            }
            let axisColor = this.gridStyle.axisColors[i];
            let lineWidth = 0.5;
            let begin = this.gridStyle.origin.slice();
            let end = this.gridStyle.origin.slice();
            begin[i] = -25;
            let vertexA = lc.XYZ(...begin);
            end[i] = 25;
            let vertexB = lc.XYZ(...end);
            this.draw(vertexA, vertexB, axisColor, lineWidth);
        }
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
    constructor(public dataset: Dataset, graphics: Graphics, public color: number, public material: THREE.Material = materials.standard) {
        super(dataset.id, graphics);
        //Inject color into the material 
        //@ts-ignore
        material.color = color;
        this.geometry = new THREE.Geometry();
        this.faces = this.geometry.faces;
        this.vertices = this.geometry.vertices;
        this.THREEObject = new THREE.Mesh(this.geometry, material);
    }
    initialize(intervals: number[][]): void {
        if (this.initialized) return;
        this.dataset.initialize(this.graphics.lc, this.vertices, this.faces);
    }
    update(intervals: number[][]): void {
        this.dataset.update(this.graphics.lc, this.vertices, this.faces)
    }
}

export {
    Graph,
    PIXIGrid,
    THREEGrid,
    PIXIGraph,
    THREEGraph
}