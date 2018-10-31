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
    constructor(eqn = (t=0,...n)=>new Vec(), ...inits){
        this.level = inits.length;
        this.ydirs = inits;
        this.hdir = new Vec();
        this.eqn = eqn;
    }
    get y(){
        if(this.level == 0){
            return this.eqn(t);
        }else{
            return this.ydirs[0];
        }
    }
}
const Euler = class{
    constructor(diffEqn = new DiffEqn(), startTime = 0, dt = 0.1){
        this.t = startTime;
        this.dt = dt;
        this.diffEqn = diffEqn;
        this.que = 0;
    }
    step(dt=this.dt){
        this.diffEqn.hdir = this.diffEqn.eqn(this.t,this.diffEqn.ydirs);
        // console.log(this.diffEqn.hdir);
        // console.log(this.diffEqn.ydirs[this.diffEqn.ydirs.length - 1])
        this.diffEqn.ydirs[this.diffEqn.ydirs.length-1].add(this.diffEqn.hdir.multiply(dt));
        // console.log(this.diffEqn.hdir);
        for(var i = this.diffEqn.level-1; i>0; i--){
            // console.log(this.diffEqn.ydirs);
            this.diffEqn.ydirs[i-1].add(this.diffEqn.ydirs[i].multiply(dt, new Vec()));
        }
        this.t+=dt;
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
            var ogState = {
                t:this.t,
                dirs: []
            }
            for(var i = 0; i<  this.diffEqn.ydirs.length; i++){
                ogState.dirs.push(this.diffEqn.ydirs[i].clone());
            }
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
//     vadd,
//     vsubtract,
//     vdot,
//     vcross
// }