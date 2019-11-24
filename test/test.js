const utility = require('../src/js-compatible/utility');
const assert = require('assert');

describe("utility.",()=>{
    describe("subtration", ()=>{
        it("should compute subtraction between scalars correctly",()=>{
            for(let i = 0; i<10; i++)
                assert.equal(utility.subtract(i, -1), i + 1);
        });
        it("should compute subtraction between vectors correctly", ()=>{
            for (let i = -10; i <= 10; i++)
                assert.deepEqual(utility.subtract([i, i * 2, i * i], [i, 2 * i, 3 * i]), [0, 0, i * i - 3 * i]);
        });
        it("should not modify the first parameter",()=>{
            for(let i = -25; i<25; i++){
                let a = [25+i, 35-i];
                let b = [45, 12];
                utility.subtract(a, b);
                assert.deepEqual(a, [25+i, 35-i]);
            }
        });
        it("should not modify the second parameter", () => {
            for (let i = -25; i < 25; i++) {
                let a = [25, 35];
                let b = [45 + i, 12 - i];
                utility.subtract(a, b);
                assert.deepEqual(b, [45 + i, 12 - i]);
            }
        });
    });
});