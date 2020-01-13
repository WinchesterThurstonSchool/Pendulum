import * as utility from '../utility';
//The class that converts virtual coordinate system to its graphics presentation
class Locator {
    lc = this;
    //Graphics x : standard x (intrinsic)
    scalex = 1;
    //Graphics y : standard y (intrinsic)
    scaley = 1;
    scalez = 1;
    //Moves virtual coordinate deltax virtual units in the x direction
    deltax = 0;
    //Moves virtual coordinate deltay virtual units in the y direction
    deltay = 0;
    deltaz = 0;
    //Transformation matrix used as: C = Ap+B
    /**
     * Transformation coefficient. Has to be a 3 by 3 matrix with none zero determinant
     */
    A = [[0.25, 0, 0],
    [0, 0.25, 0],
    [0, 0, 0.25]];
    /**
     * Transformation constant. Has to be a 3 vector
     */
    B = [0, 0, 0];
    constructor() {
    }
    private _standardMatrix = [0, 0, 0];
    /**
     * Returns a matrix representing the standard coordinate of coord
     * @param virCoord: a representation of a point in the virtual coordinate
     */
    private virtualToStandard(virCoord: number[]): number[] {
        this.checkCoord(virCoord);
        this._standardMatrix[0] = (virCoord[0] + this.deltax) * this.scalex;
        this._standardMatrix[1] = (virCoord[1] + this.deltay) * this.scaley;
        this._standardMatrix[2] = (virCoord[2] + this.deltaz) * this.scalez;
        return this._standardMatrix
    }
    //To graphics X
    public X(...coord: number[]): number {
        return utility.dot(this.A[0], this.virtualToStandard(coord)) + this.B[0];
    }
    //To graphics Y
    public Y(...coord: number[]): number {
        return utility.dot(this.A[1], this.virtualToStandard(coord)) + this.B[1];
    }
    public Z(...coord: number[]): number {
        return utility.dot(this.A[2], this.virtualToStandard(coord)) + this.B[2];
    }
    private _graphicalMatrix = [0, 0, 0];
    private virtualToGraphical(virCoord: number[]): number[] {
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
    public Width(width: number, getElement: true): number | number[] {
        if (getElement) {
            return this.X(width, 0, 0) - this.X(0, 0, 0);
        } else {
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
        let Ainverse;
        try {
            Ainverse = utility.inv(this.A);
        } catch (error) {
            throw new Error("Cannot compute the virtual coordinate, the determinant of the multiplication matrix A is 0");
        }
        this.checkCoord(graCoord);
        this._subtractionMatrix = (utility.subtract(graCoord, this.B) as number[]);
        this._standardMatrix[0] = utility.dot(Ainverse[0], this._subtractionMatrix);
        this._standardMatrix[1] = utility.dot(Ainverse[1], this._subtractionMatrix);
        this._standardMatrix[2] = utility.dot(Ainverse[2], this._subtractionMatrix);
        /* _subtractionMatrix is reused here as a holder for the _virtualMatrix for the sake of 
         * optimization.
         */
        this._subtractionMatrix[0] = this._standardMatrix[0] / this.scalex - this.deltax;
        this._subtractionMatrix[1] = this._standardMatrix[1] / this.scaley - this.deltay;
        this._subtractionMatrix[2] = this._standardMatrix[2] / this.scalez - this.deltaz;
        return this._subtractionMatrix;
    }

    /**
     * The method assumes non-rotational transformations and uses the diagonals 
     * of A for the sake of efficiency, returns a width based on the Width (x-direction)
     */
    public width(Width: number): number {
        return Width / this.A[0][0] / this.scalex;
    }
    /**
     * The method assumes non-rotational transformations and uses the diagonals 
     * of A for the sake of efficiency, returns a height based on the Height (y-direction)
     */
    public height(Height: number): number {
        return Height / this.A[1][1] / this.scaley;
    }
    /**
     * The method assumes non-rotational transformations and uses the diagonals 
     * of A for the sake of efficiency, returns a length based on the Length (z-direction)
     */
    public length(Length: number): number {
        return Length / this.A[2][2] / this.scalez;
    }

    /**
     * Pinned zooming
     * @param pinX In graphical units
     * @param factorx Scale scalex by this amount
     * @param pinY In graphical units
     * @param factory Scale scaley by this amount
     * @param pinZ In graphical units
     * @param factorz Scale scalez by this amount
     */
    public zoom(pinX: number, factorx: number, pinY: number, factory: number, pinZ = 0, factorz = 1): void {
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
    private checkCoord(coord: number[]): number[] {
        if (coord.length >= 3) return coord;
        if (coord.length == 0) coord[0] = 0;
        if (coord.length <= 1) coord[1] = 0;
        if (coord.length <= 2) coord[2] = 0;
        return coord;
    }
    /**
     * Resets all the virtual transformers in the instance,
     * excludes the graphcis transformers A and B
     */
    public reset(): void {
        this.deltax = 0;
        this.deltay = 0;
        this.deltaz = 0
        this.scalex = 0;
        this.scaley = 0;
        this.scalez = 0;
    }
    /**
     * Resets all the graphics matrices for affine transformaiton to the given values
     * @param A Transform coefficient A, default is [[1.5,0,0],[0,1.5,0],[0,0,1.5]]
     * @param B Transform offset B, default is [0,0,0]
     */
    public resetATransformation(A = [[0.25, 0, 0], [0, 0.25, 0], [0, 0, 0.25]], B = [0, 0, 0]): void {
        this.A = A;
        this.B = B;
    }
}
export {
    Locator
}