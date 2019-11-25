const assert = require('assert');

/**
 * Tests if two arrays or matrices are deeply equal
 * @param {number|number[]|Array[]} a 
 * @param {number|number[]|Array[]} b 
 * @param {number} tolerance tolerance of the equality, elements in a and b must not be 
 * different by more than the tolerance
 */
function arrayDeepEqual(a, b, tolerance=0){
    if(!(a instanceof Array || !isNaN(a))&&!(b instanceof Array || !isNaN(b)))
        assert.fail("a and b has to be either number of matrices");
    if(a instanceof Array)
        if(!(b instanceof Array))
            assert.fail("a and b are not of the same dimension");
        else if(a.length!==b.length)
            assert.fail("Array a and b are not of the same shape");
        else for(let i = 0; i<a.length; i++)
                arrayDeepEqual(a[i],b[i], tolerance);
    else if(isNaN(a))
            assert.fail("a and b are not of the same dimension");
        else if(Math.abs(a-b)>=tolerance)
                assert.fail(a+" and "+b+" are not equal");
}

module.exports={
    arrayDeepEqual
};