import {inv, det, subtract, multiply} from 'mathjs'

let _d = true;
/* This is a module that provides all kinds of
 * mathematical tools, data structures, and classes
 */
const dot=function(a:number[],b:number[]):number{
    let sum = 0;
    for(let i = 0; i<Math.min(a.length,b.length); i++)
        sum+=a[i]*b[i];
    return sum;
}
export {
    inv,
    det,
    dot,
    subtract,
    multiply
};