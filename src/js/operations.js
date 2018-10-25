const add = (x,y) => (+x) + (+y);
const subtract = (x,y) => (+x) - (+y);
const multiply = (x, y) => (+x) * (+y);
const divide = (x, y) => (+x) / (+y);
const sin = (x) => Math.sin(+x);
const cos = (x) => Math.cos(+x);
const validateNumbers = (x,y) => !(isNaN(x)||isNaN(y));

/**
 * Mathematical construct of vector
 * 
 * @param {*} x x component 
 * @param {*} y y component
 * @param {*} z z component
 */
const Vec = function(x = 0, y = 0, z = 0){
    this.x = x;
    this.y = y;
    this.z = z;
    this.set = function (x = 0,y = 0,z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    this.add = (b = new Vec(), holder = new Vec()) => {
        holder.set(this.x + b.x, this.y + b.y, this.z + b.z);
        return holder;
    }
    this.subtract = (b = new Vec(), holder = new Vec()) => {
        holder.set(this.x - b.x, this.y - b.y, this.z - b.z);
        return holder;
    }
    this.vdot = (b = new Vec()) => {
        return this.x * b.x + this.y * b.y + this.z * b.z;
    }
    this.vcross = (b = new Vec(), holder = new Vec()) => {
        holder.set(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
        return holder;
    }
}

module.exports = {
    add,
    subtract,
    multiply,
    divide,
    sin,
    cos,
    validateNumbers,
    Vec,
    vadd,
    vsubtract,
    vdot,
    vcross
}