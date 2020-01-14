import * as THREE from "three";
import {Locator} from "./locator";
import {Graph} from "./graph";
import { Vector3 } from "three";

abstract class Dataset{
    abstract id: string;
    abstract initialize(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces?: THREE.Face3[]): void;
    abstract update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces?: THREE.Face3[]):void;
}

class Curve extends Dataset {
    vertices: THREE.Vector3[] = [];
    constructor(public id: string) {
        super();
    }
    initialize(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
}

class Surface extends Dataset {
    vertices: THREE.Vector3[] = [];
    faces: THREE.Face3[] =  [];
    constructor(public id:string){
        super();
    }
    initialize(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
}

class Solid extends Dataset {
    constructor(public id: string){
        super();
    }
    initialize(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
}

interface ScalFunc {
    f(x?: number, y?: number): number;
}

interface VecFunc {
    f(u?:number, v?:number, w?:number): number[];
}

class Function1V extends Curve implements ScalFunc {
    f: (x: number) => number;
    constructor(id:string, f:(x:number)=>number){
        super(id);
        this.f=f;
    }
    initialize(lc: Locator, intervals: number[][], vertices: THREE.Vector3[]): void {
        for (let i = 0; i <=200; i += 1) {
            let x = i/200 * (intervals[0][1] - intervals[0][0]) + intervals[0][0];
            vertices.push(new Vector3(lc.X(x), lc.Y(x, this.f(x), 0), 0));
        }
    }
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[]): void {
        for(let i = 0; i<=200; i+=1){
            let x = i/200 * (intervals[0][1] - intervals[0][0]) + intervals[0][0];
            vertices[i].set(lc.X(x), lc.Y(x,this.f(x), 0), 0);
        }
    }
}

class Function2V extends Surface implements ScalFunc{
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    f(x: number, y: number): number {
        throw new Error("Method not implemented.");
    }

}

class Parametric1v extends Curve implements VecFunc{
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[]): void {
        throw new Error("Method not implemented.");
    }
    f(u: number): number[] {
        throw new Error("Method not implemented.");
    }
    
}

class Parametric2V extends Surface implements VecFunc{
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    f(u: number, v: number): number[] {
        throw new Error("Method not implemented.");
    }

}

class Parametric3V extends Solid implements VecFunc{
    update(lc: Locator, intervals: number[][], vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    f(u: number, v: number, w: number): number[] {
        throw new Error("Method not implemented.");
    }
}

export{
    Dataset,
    Curve,
    Surface,
    Solid,
    ScalFunc as Function, 
    VecFunc as Parametric,
    Function1V,
    Function2V,
    Parametric1v,
    Parametric2V,
    Parametric3V
}