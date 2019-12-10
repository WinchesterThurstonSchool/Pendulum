import * as THREE from "three";
import {Locator} from "./locator";
import {Graph} from "./graphics";

abstract class Dataset{
    abstract id:string;
    abstract initialize(vertices: THREE.Vector3[], faces?: THREE.Face3[]):void;
    abstract update(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[]):void;
}

class Curve extends Dataset{
    initialize(vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    vertices: THREE.Vector3[] = [];
    constructor(public id:string){
        super();
    }
}

class Surface extends Dataset {
    initialize(vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    vertices: THREE.Vector3[] = [];
    faces: THREE.Face3[] =  [];
    constructor(public id:string){
        super();
    }
}

class Solid extends Dataset{
    initialize(vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    constructor(public id: string){
        super();
    }
}

interface ScalFunc {
    f(x?: number, y?: number): number;
}

interface VecFunc {
    f(u?:number, v?:number, w?:number): number[];
}

class Function1V extends Curve implements ScalFunc{
    initialize(vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[]): void {
        throw new Error("Method not implemented.");
    }
    f(x: number | undefined): number {
        throw new Error("Method not implemented.");
    }

}

class Function2V extends Surface implements ScalFunc{
    initialize(vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    f(x: number, y: number): number {
        throw new Error("Method not implemented.");
    }

}

class Parametric1v extends Curve implements VecFunc{
    initialize(vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[]): void {
        throw new Error("Method not implemented.");
    }
    f(u: number): number[] {
        throw new Error("Method not implemented.");
    }
    
}

class Parametric2V extends Surface implements VecFunc{
    initialize(vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
    update(locator: Locator, vertices: THREE.Vector3[], faces: THREE.Face3[]): void {
        throw new Error("Method not implemented.");
    }
    f(u: number, v: number): number[] {
        throw new Error("Method not implemented.");
    }

}

class Parametric3V extends Solid implements VecFunc{
    initialize(vertices: THREE.Vector3[], faces?: THREE.Face3[] | undefined): void {
        throw new Error("Method not implemented.");
    }
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