import * as utility from './utility';
//The class that converts virtual coordinate system to its graphics presentation
class Locator {
    lc = this;
    //Graphics x : standard x (intrinsic)
    scalex = 1;
    //Graphics y : standard y (intrinsic)
    scaley = 1;
    scalez = 1;
    //Moves virtual coordinate deltax virtual units in the x direction
    deltax = 1;
    //Moves virtual coordinate deltay virtual units in the y direction
    deltay = 1;
    deltaz = 0;
    //Transformation matrix used as: C = Ap+B
    private A = [[1.5,0,0],
                [0,1.5,0],
                [0,0,1.5]];
    validateT = (target, property, value)=>{
        let Ainverse = (utility.inv(value) as number[][]);
        if(Ainverse!=undefined)
            this.Ainverse = Ainverse;
        else throw new Error('Cannot calculate inverse, determinant is zero');
        target[property] = value;
        return true;
    }
    //T is the actual matrix that user manipulate to change the transformation
    T = new Proxy(this.A, {
        set: this.validateT
    });
    B = [0,0,0];
    //Inverse transformation through: c = A^{-1}(C-B)
    Ainverse:number[][];
    constructor(){
        console.log(this.B);
        this.Ainverse = (utility.inv(this.A) as number[][]);
    }
    private _standardMatrix=[0,0,0];
    /**
     * Returns a matrix representing the standard coordinate of coord
     * @param virCoord: a representation of a point in the virtual coordinate
     */
    private virtualToStandard(virCoord: number[]):number[]{
        this.checkCoord(virCoord);
        this._standardMatrix[0] = (virCoord[0]+this.deltax)*this.scalex;
        this._standardMatrix[1] = (virCoord[1]+this.deltay)*this.scaley; 
        this._standardMatrix[2] = (virCoord[2]+this.deltaz)*this.scalez;
        return this._standardMatrix
    }
    //To graphics X
    public X(...coord: number[]):number{
        return utility.dotArray(this.T[0], this.virtualToStandard(coord))+this.B[0];
    }
    //To graphics Y
    public Y(...coord: number[]): number {
        return utility.dotArray(this.T[1], this.virtualToStandard(coord)) + this.B[1];
    }
    public Z(...coord: number[]): number {
        return utility.dotArray(this.T[2], this.virtualToStandard(coord)) + this.B[2];
    }
    private _graphicalMatrix = [0,0,0];
    private virtualToGraphical(virCoord: number[]):number[]{
            this._graphicalMatrix[0] = this.X(...virCoord);
            this._graphicalMatrix[1] = this.Y(...virCoord);
            this._graphicalMatrix[2] = this.Z(...virCoord);
        return this._graphicalMatrix;
    }
    /**
     * The Width, expressed either in a vector or a single number computed from width
     * @param width the width in virtual coordinates for conversion
     * @param getElement the method returns a single component if the value is set to true
     * or else it returns an array that corresponds to the spatial distance in graphics coordinate
     */
    public Width(width: number, getElement:true): number | number[] {
        if(getElement){
            return this.X(width,0,0)-this.X(0,0,0);
        }else{
            return (utility.subtract(this.virtualToGraphical([width, 0, 0]).slice(), this.virtualToGraphical([width, 0, 0])) as number[]);
        }
    }
    /**
     * The Height, expressed either in a vector or a single number computed from height
     * @param height the height in virtual coordinates for conversion
     * @param getElement the method returns a single component if the value is set to true
     * or else it returns an array that corresponds to the spatial distance in graphics coordinate
     */
    public Height(height: number, getElement: true): number | number[] {
        if (getElement) {
            return this.Y(0, height, 0) - this.Y(0, 0, 0);
        } else {
            return (utility.subtract(this.virtualToGraphical([0, height, 0]).slice(), this.virtualToGraphical([0, height, 0])) as number[]);
        }
    }
    /**
     * The Length, expressed either in a vector or a single number computed from length
     * @param height the length in virtual coordinates for conversion
     * @param getElement the method returns a single component if the value is set to true
     * or else it returns an array that corresponds to the spatial distance in graphics coordinate
     */
    public Length(length: number, getElement: true): number | number[] {
        if (getElement) {
            return this.Z(0, 0, length) - this.Z(0, 0, 0);
        } else {
            return (utility.subtract(this.virtualToGraphical([0, 0, length]).slice(), this.virtualToGraphical([0, 0, length])) as number[]);
        }
    }
    private _subtractionMatrix = [0, 0, 0];
    /**
     * Returns a vector representing the virtual coordinate of graph coord.
     * The Locator class only exposes this method because the reverse transform 
     * involves matrix transformation and cloning arrays. It's the fastest to not 
     * repeat the process for each component.
     * @param graCoord: a representation of a point in the virtual coordinate
     */
    public xyz(...graCoord: number[]): number[] {
        this.checkCoord(graCoord);
        this._subtractionMatrix = (utility.subtract([...graCoord], this.B) as number[]);
        this._standardMatrix[0] = utility.dotArray(this.T[0], this._subtractionMatrix);
        this._standardMatrix[1] = utility.dotArray(this.T[1], this._subtractionMatrix);
        this._standardMatrix[2] = utility.dotArray(this.T[2], this._subtractionMatrix);
        /* _subtractionMatrix is reused here as a holder for the _virtualMatrix for the sake of 
         * optimization.
         */
        this._subtractionMatrix[0] = this._standardMatrix[0] / this.scalex - this.deltax;
        this._subtractionMatrix[1] = this._standardMatrix[1] / this.scaley - this.deltay;
        this._subtractionMatrix[2] = this._standardMatrix[2] / this.scalez - this.deltaz;
        return this._subtractionMatrix;
    }
    // Unimplemented until they are needed
    // public float width(int Width) {
    //     return x(Width, 0) - x(0, 0);
    // }
    // public float height(int Height) {
    //     return y(0, Height) - y(0, 0);
    // }
    // public float length(int Length) {
    //     return z(0,0,Length) - this.Z(0,0,0);
    // }

    /**
     * Pinned zooming
     * @param pinX In graphical units
     * @param factorx Scale scalex by this amount
     * @param pinY In graphical units
     * @param factory Scale scaley by this amount
     * @param pinZ In graphical units
     * @param factorz Scale scalez by this amount
     */
    public zoom(pinX: number, factorx: number, pinY: number, factory: number, pinZ = 0, factorz = 1):void{
        let pinxyz = this.xyz(pinX, pinY, pinZ);
        this.scalex *= factorx;
        this.scaley *= factory;
        this.scalez *= factorz;
        this.deltax = (pinxyz[0] + this.deltax) / factorx - pinxyz[0];
        this.deltay = (pinxyz[1] + this.deltay) / factory - pinxyz[1];
        this.deltaz = (pinxyz[2] + this.deltaz) / factory - pinxyz[2];
    }
    /**
     * Validate that the coordinate has the coorect dimension
     * @param coord the coordinate
     */
    private checkCoord(coord:number[]):number[]{
        if (coord.length == 2) coord[2] = 0;
        return coord;
    }
}
exports={
    Locator
}