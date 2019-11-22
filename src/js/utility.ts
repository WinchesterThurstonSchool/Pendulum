import { det, inv, subtract } from 'mathjs'

let _d = true;
/* This is a module that provides all kinds of
 * mathematical tools, data structures, and classes
 */
const dotArray=function(a:number[],b:number[]):number{
    let sum = 0;
    for(let i = 0; i<Math.min(a.length,b.length); i++)
        sum+=a[i]*b[i];
    return sum;
}
console.log(subtract([5,5,5], [2,2,2]));
export {
    inv,
    det,
    dotArray,
    subtract
};