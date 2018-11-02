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
        return this;
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
    this.clone = ()=>new Vec(this.x, this.y, this.z);
}

const DiffEqn = class{
    constructor(eqn = (t=0,...n)=>new Vec(), order){
        this.order = order;
        this.ydirs = [new Vec()];
        this.hdir = new Vec();
        this.eqn = eqn;
    }
    get y(){
        if(this.order == 0){
            return this.eqn(t);
        }else{
            return this.ydirs[0];
        }
    }
}
class Euler{
    constructor(diffEqn = new DiffEqn(), dt = 0.01, startTime = 0, inits = [new Vec()]) {
        this.t = startTime;
        this.dt = dt;
        this.diffEqn = diffEqn;
        while(inits.length<diffEqn.order) inits.push(new Vec());
        this.diffEqn.ydirs = inits;
        this.que = 0;
    }
    step(dt=this.dt){
        // console.log(this.diffEqn.hdir);
        for (var i = 0; i < this.diffEqn.order-1; i++) {
            // console.log(this.diffEqn.ydirs);
            this.diffEqn.ydirs[i].add(this.diffEqn.ydirs[i+1].multiply(dt, new Vec()));
        }
        this.t+=dt;
        this.diffEqn.hdir = this.diffEqn.eqn(this.t, this.diffEqn.ydirs);
        // console.log(this.diffEqn.hdir);
        this.diffEqn.ydirs[this.diffEqn.ydirs.length - 1].add(this.diffEqn.hdir.multiply(dt));
    }
    y(t, target = new Vec()){
        let lY, rY;
        if(t>this.t){
            while (this.t < t) {
                lY = this.diffEqn.y;
                this.step(this.dt);
            }
            var domain = [this.t - this.dt, this.t];
            rY = this.diffEqn.y;
        }else{
            while (t<this.t) {
                rY = this.diffEqn.y;
                this.step(-this.dt);
            }
            var domain = [this.t, this.t+this.dt];
            lY = this.diffEqn.y;
        }
        return target.set(
            this.linearApprox(t, domain, [lY.x, rY.x]),
            this.linearApprox(t, domain, [lY.y, rY.y]),
            this.linearApprox(t, domain, [lY.z, rY.z])
        );
    }
    getSolution (bounded = true,domain = [-10,10]){
        if(bounded){
            var posD = Math.ceil((domain[1]-this.t)/this.dt);
            var negD = Math.floor((this.t-domain[0])/this.dt);
            var cacheP = new Array();
            var stampP = Array();
            var cacheN = new Array();
            var stampN = new Array();
            var solutions = new Array();
            var timeStamps = new Array();
            var ogState = this.states;
            for(var i = 0; i<posD; i++){
                cacheP.push(this.diffEqn.y.clone());
                stampP.push(this.t);
                this.step(this.dt);
            }
            this.t = ogState.t;
            this.diffEqn.ydirs = ogState.dirs;
            for(var i = 0; i<negD; i++){
                cacheN.push(this.diffEqn.y.clone());
                stampN.push(this.t);
                this.step(-this.dt);
            }
            
            for(var i = cacheN.length-1; i > 0; i--){
                solutions.push(cacheN[i]);
                timeStamps.push(stampN[i]);
            }
            for(var i = 0; i < cacheP.length; i++){
                solutions.push(cacheP[i]);
                timeStamps.push(stampP[i]);
            }
            return (t, target=new Vec())=>{
                var t0 = timeStamps[0];
                var i0 = Math.floor((t-t0)/this.dt);
                if(i0<0)i0=0;
                if(i0+1>=timeStamps.length)i0 = timeStamps.length-2;
                var domain = [timeStamps[i0],timeStamps[i0+1]];
                var lY = solutions[i0],
                    rY = solutions[i0+1];
                return target.set(
                    this.linearApprox(t, domain, [lY.x, rY.x]),
                    this.linearApprox(t, domain, [lY.y, rY.y]),
                    this.linearApprox(t, domain, [lY.z, rY.z])
                );
            }
        }else return (t, target = new Vec())=>this.y(t,target);

    }
   linearApprox(t, domain = [0,timestep], range = [0,0]){
        return range[0]+(range[1]-range[0])/(domain[1]-domain[0])*(t-domain[0]);
    }

    get states(){
        var states = {
            t: this.t,
            dirs: []
        };
        for (var i = 0; i < this.diffEqn.ydirs.length; i++) {
            states.dirs.push(this.diffEqn.ydirs[i].clone());
        }
        return states;
    }
    set states(v){
        this.t = v.t;
        this.diffEqn.ydirs = v.dirs;
    }
}

class RK2 extends Euler{
    constructor(diffEqn = new DiffEqn(), dt = 0.1, startTime = 0, inits = [new Vec()]) {
        super(diffEqn, dt, startTime, inits);
    }
    step(dt = this.dt){
        var k0 = this.states;
        super.step(dt);
        var k1 = this.states;
        var lastDerivative = this.diffEqn.eqn(k0.t,k0.dirs).add(this.diffEqn.eqn(k1.t, k1.dirs)).multiply(0.5);
        this.states = k0;
        var dirs = this.diffEqn.ydirs;
        var holder = new Vec();
        var lev = this.diffEqn.order;
        for(var i = 0; i<lev-2; i++){
             dirs[i].add(dirs[i + 1].multiply(dt, holder)).
             add(dirs[i + 2].multiply(dt*dt/2, holder));
        }
        if(lev-2>=0)dirs[lev - 2].add(dirs[lev - 1].multiply(dt, holder)).add(lastDerivative.multiply(dt * dt / 2, holder));
        if(lev-1>=0)dirs[lev-1].add(lastDerivative.multiply(dt,holder));
        this.diffEqn.hdir = lastDerivative;
        this.t+=dt;
    }
}

// module.exports = {
//     add,
//     subtract,
//     multiply,
//     divide,
//     sin,
//     cos,
//     validateNumbers,
//     Vec,
//     Euler,
//     RK2
// }