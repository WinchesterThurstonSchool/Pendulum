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

    this.add = (b = new Vec(), holder = this) => {
        holder.set(this.x + b.x, this.y + b.y, this.z + b.z);
        return holder;
    }
    this.subtract = (b = new Vec(), holder = new Vec()) => {
        holder.set(this.x - b.x, this.y - b.y, this.z - b.z);
        return holder;
    }
    this.multiply = (c = 1, holder = this)=>{
        holder.set(this.x*c, this.y*c, this.z*c);
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

const DiffEqn = class{
    constructor(eqn = func=(t,...n)=>new Vec(), ...inits){
        this.level = inits.length;
        this.ydirs = inits;
        this.hdir = 0;
        this.eqn = eqn;
    }
    get y(){
        if(this.level == 0){
            return this.eqn(t);
        }else{
            return ydirs[0];
        }
    }
}
const Euler = function(de = new DiffEqn(), startTime = 0, timestep = 0.1){
    this.t = startTime;
    this.dt = timestep;
    this.diffEqn = de;
    this.step = function(){
        this.diffEqn.hdir = this.diffEqn.eqn(th is.t,diffEqn.ydirs);
        this.diffEqn.ydirs[this.diffEqn.ydirs.length-1].add(this.diffEqn.hdir.multiply(dt));
        for(var i = this.diffEqn.level-1; i>0; i--){
            this.diffEqn.ydirs[i-1].add(this.diffEqn.ydirs[i].multiply(dt));
        }
        t+=dt;
    }
    this.y = function(t){
        var lastY;
        while(this.t<t){
            lastY = this.diffEqn.y;
            step();
        }
        var domain = [this.t-this.dt, this.t];
        var newY = this.diffEqn.y;
        return new Vec(
            this.linearApprox(t, domain, [lastY.x, newY.x]),
            this.linearApprox(t, domain, [lastY.y, newY.y]),
            this.linearApprox(t, domain, [lastY.z, newY.z])
        );
    }
    this.getSolution = function(range = [0,10], bounded = true){
        if(bounded){
            
        }
    }
    this.linearApprox = function(t, domain = [0,timestep], range = [0,0]){
        return range[0]+(range[1]-range[0])/(domain[1]-domain[0])*(t-domain[0]);
    }
};

// module.exports = {
//     add,
//     subtract,
//     multiply,
//     divide,
//     sin,
//     cos,
//     validateNumbers,
//     Vec,
//     vadd,
//     vsubtract,
//     vdot,
//     vcross
// }