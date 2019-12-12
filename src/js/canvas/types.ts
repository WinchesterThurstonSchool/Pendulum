import * as THREE from "three";
import {Locator} from "./locator";
import {Graph} from "./graph";

abstract class Dataset{
    abstract id: string;
    abstract initialize(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[]): void;
    abstract update(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[]):void;
}

class Curve extends Dataset {
    vertices: THREE.Vector3[] = [];
    constructor(public id: string) {
        super();
    }
    initialize(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
}

class Surface extends Dataset {
    vertices: THREE.Vector3[] = [];
    faces: THREE.Face3[] =  [];
    constructor(public id:string){
        super();
    }
    initialize(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
}

class Solid extends Dataset {
    constructor(public id: string){
        super();
    }
    initialize(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
}

interface ScalFunc {
    f(x?: number, y?: number): number;
}

interface VecFunc {
    f(u?:number, v?:number, w?:number): number[];
}

class Function1V extends Curve implements ScalFunc{
    update(locator: Locator, vertices: THREE.Vector3[]): void {
        throw new Error("Method not implemented.");
    }
    f(x: number | undefined): number {
        throw new Error("Method not implemented.");
    }

}

class Function2V extends Surface implements ScalFunc{
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    f(x: number, y: number): number {
        throw new Error("Method not implemented.");
    }

}

class Parametric1v extends Curve implements VecFunc{
    update(locator: Locator, vertices: THREE.Vector3[]): void {
        throw new Error("Method not implemented.");
    }
    f(u: number): number[] {
        throw new Error("Method not implemented.");
    }
    
}

class Parametric2V extends Surface implements VecFunc{
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    f(u: number, v: number): number[] {
        throw new Error("Method not implemented.");
    }

}

class Parametric3V extends Solid implements VecFunc{
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
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