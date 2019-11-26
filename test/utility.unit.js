const utility = require('../src/js-compatible/utility');
const assert = require('assert');
const helper = require('./helper');
describe("utility.", function(){
    describe("subtract", function(){
        it("should compute subtraction between scalars correctly", function(){
            for (let i = 0; i < 10; i++)
                assert.equal(utility.subtract(i, -1), i + 1);
        });
        it("should compute subtraction between vectors correctly", function(){
            for (let i = -10; i <= 10; i++)
                assert.deepEqual(utility.subtract([i, i * 2, i * i], [i, 2 * i, 3 * i]), [0, 0, i * i - 3 * i]);
        });
        it("should not modify the first parameter", function(){
            for (let i = -25; i < 25; i++) {
                let a = [25 + i, 35 - i];
                let b = [45, 12];
                utility.subtract(a, b);
                assert.deepEqual(a, [25 + i, 35 - i]);
            }
        });
        it("should not modify the second parameter", function(){
            for (let i = -25; i < 25; i++) {
                let a = [25, 35];
                let b = [45 + i, 12 - i];
                utility.subtract(a, b);
                assert.deepEqual(b, [45 + i, 12 - i]);
            }
        });
    });
    describe("inv", function(){
        it("should find the inverse of a matrix correctly", function(){
            let a = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 9, 8]
            ];
            let b = a.map((value, i) => {
                return value.map((element, j) => {
                    return element * (i + 1) / (j + 1);
                });
            });
            let invb = utility.inv(b);
            //    let inva = utility.inv(a);
            helper.arrayDeepEqual(utility.multiply(invb, b), [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ], 0.00001);
        });
        it("shoud not modify the parameter", function(){
            let a = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 9, 8]
            ];
            utility.inv(a);
            assert.deepEqual(a, [
                [0, 1, 2],
                [3, 4, 5],
                [6, 9, 8]
            ]);
        });
    });
    describe("dot", function(){
        it("returns 0 if two vectors are perpendicular", function(){
            let a = [1, 1, 0];
            let b = [1, -1, 0];
            assert.deepEqual(utility.dot(a, b), 0);
        });
        it("dot([1,1,1],[-1,3,4])=6", function(){
            let a = [1, 1, 1];
            let b = [1, -1, 0];
            assert.deepEqual(utility.dot(a, b), 0);
        });
    });
    describe("multiply", function(){
        it("correctly computes the product of numbers", function(){
            let a = 0;
            for (let b = 1; b < 100; b++)
                assert.deepEqual(utility.multiply(a, b), a * b);
        });
        it("correctly computes the product of matrices", function(){
            for (let i = 1; i < 100; i++) {
                let a = [
                    [0, 0, i * 2],
                    [i, 1, -i],
                    [0, i * 10, 0]
                ];
                let I = [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ];
                assert.deepEqual(utility.multiply(a, I), [
                    [0, 0, i * 2],
                    [i, 1, -i],
                    [0, i * 10, 0]
                ]);
            }

        });
        it("doesn't change the value of its parameters", function(){
            let a = [
                [1, 0, 2],
                [2, 1, 1],
                [-3, 4, 5]
            ];
            let b = [
                [2, 3, 4],
                [5, 4, 3],
                [-3, 4, 3]
            ];
            utility.multiply(a, b);
            assert.deepEqual(a, [
                [1, 0, 2],
                [2, 1, 1],
                [-3, 4, 5]
            ]);
            assert.deepEqual(b, [
                [2, 3, 4],
                [5, 4, 3],
                [-3, 4, 3]
            ]);
        });
    });
});