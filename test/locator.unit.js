const Locator = require('../src/js-compatible/canvas/locator').Locator;
const assert = require('assert');
describe("Locator", function(){
    let lc = new Locator();
    this.beforeEach(function(){
        lc = new Locator();
        console.log("new Locator created");
    });
    it("obtains the original coordinate after forward and backward transformations", function(){
        for(let i = 0; i<100000; i++)
            assert.deepEqual(lc.xyz(lc.X(1, -2, 1), lc.Y(1, -2, 1), lc.Z(1, -2, 1)), [1, -2, 1]);
    });
    it("checkCoord", function(){
        //completes the coordinate with 0 for input vectors that have less than 3 dimensions
        assert.deepEqual(lc.xyz(lc.X(1), lc.Y(1,2), lc.Z(1,2,3)), [1, 2, 3]);
    });
    it("updates the inverse matrix after reassignment to A", function(){
       lc.A = [
           [1, 0, 0],
           [0, 1, 0],
           [0, 0, 1]
       ];
       assert.deepEqual(lc.xyz(lc.X(1, -2, 1), lc.Y(1, -2, 1), lc.Z(1, -2, 1)), [1, -2, 1]);
    });
    it("updates the inverse matrix after index-assignment to A", function () {
        lc.A[0] = [1, 0, 0];
        lc.A[1] = [0, 1, 0];
        lc.A[2] = [0, 0, 1];
        assert.deepEqual(lc.xyz(lc.X(1, -2, 1), lc.Y(1, -2, 1), lc.Z(1, -2, 1)), [1, -2, 1]);
    });
    it("computes forward transformations correctly", function(){
        for (let i = 0; i < 2000; i++) {
            assert.equal(lc.X(i, -i * 2, 199 - i), i * 1.5);
            assert.equal(lc.Y(i, -i * 2, 199 - i), (-i * 2) * 1.5);
            assert.equal(lc.Z(i, -i * 2, 199 - i), (199 - i) * 1.5);
        }
        for(let i = 0; i<2000; i++){
            lc.deltax = 2*i;
            lc.deltay = -3*i;
            lc.deltaz = 5*i;
            lc.scalex = -2*i;
            lc.B[1]=-4.6*i;
            assert.equal(lc.X(12, 2, 3), (12+2*i)*(-2*i)*1.5);
            assert.equal(lc.Y(12, 2, 3), (2-3*i)*1.5-4.6*i);
            assert.equal(lc.Z(12, 2, 3), (3+5*i)*1.5);
        }
        lc.reset();
        lc.B[1]=0;
        for(let i = 0; i<2000; i++){
            lc.deltax = 23;
            lc.deltay = 5;
            lc.deltaz = 2;
            lc.scalex = -19;
            lc.scaley = -37;
            lc.scalez = 43;
            assert.equal(lc.X(i, -i * 2, 199 - i), (i + 23) * -19 * 1.5);
            assert.equal(lc.Y(i, -i * 2, 199 - i), (-i*2+5) * -37 * 1.5);
            assert.equal(lc.Z(i, -i * 2, 199 - i), (199-i+2) * 43 * 1.5);
        }
    });
    it("correctly resets affine transformation to the given values", function(){
        lc.resetATransformation([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
        for(let i = -200; i<200; i++)
            assert.equal(lc.X(i), i);
    });
});