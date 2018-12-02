# Pendulum
## What is Pendulum?
A pendulum, is the first object that I found the exact motion of which cannot be obtained through calculus, and was later simulated through a computer program. The ultimate goal for Pendulum is that it will evolve into a space for researchers to conduct any kind of experiments and research, including topics of classical mechanics, electricity, waves, chemistry, and even quantum mechanics, in an collaborative online environment. Its baseline infrastructure will entail a graphing system that allows visualization of different math concepts --- parametric functions, multivariable functions, contours, vector fields, etc., and a system of matrix solvers that produce reliable and fast solutions through numerical methods. Beyond that, the works of users will be saved in a cloud source, and can be shared with the greater community at their will.  The interface will be designed to be accessible and direct. Using language and symbols that are common in math and science, one can easily define geometry, state of motion, internal structures, and any other conceivable properties of an object. 

## Why Pendulum?
This project can help students, educators, researchers and even scientists. Its accessible interface will allow students or researchers who have little programming basis to conduct experiments or illustrate concepts, without the constraints of real world budgets. It will also be designed to be expandable, giving users enough freedom to reproduce any theoretical scenarios beyond real world physical laws while keeping a set of conventions that governs the integrity of the virtual space. 
But one may still ask why Pendulum is more advantageous over other products. Some major competing products include online/offline graphing calculators like Desmos, research softwares like Matlab, and graphical tools like Unity. It may appear that Pendulum would be a union of these softwares, but major differences persist. Unlike Desmos, Pendulum strives to build upon a much more complete and flexible system of mathematics, delivers better graphics in both 2D and 3D, and supports collaboration. Compared to Matlab, Pendulum is much more accessible, using common math languages rendered through LaTeX, and more fun, with interactive and high-quality graphics display. The most obvious difference between Pendulum and Unity is accessibility and collaboration. The product will be similar to Google Docs with the addition of allowing contributions to the libraries from the community. On the technical side, Pendulum is not limited to real world physics. It focuses on the design of algorithms that efficiently computes matrices of equations including but not limited to classical mechanics, waves, and even user-defined systems. 

## Simulation
### Euler Nth-order
![alt text](https://github.com/WinchesterThurstonSchool/Pendulum/blob/master/assets/Euler(y'%3Dy%2Bx).png)
### RK2 (Midpoint) Nth-order
![alt text](https://github.com/WinchesterThurstonSchool/Pendulum/blob/master/assets/RK2(y''%3Dy'-y).png)

There are three versions of RK2 that have been implemented.

``` javascript
class RK21 extends Euler {
    constructor(diffEqn = new DiffEqn(), dt = 0.1, startTime = 0, inits = [new Vec()]) {
        super(diffEqn, dt, startTime, inits);
    }
    step0(dt = this.dt) {
        var dir = this.diffEqn.eqn(this.t, this.diffEqn.ydirs);
        var dirs = this.diffEqn.ydirs;
        var holder = new Vec();
        var lev = this.diffEqn.order;
        for (var i = 0; i < lev - 2; i++) {
            dirs[i].add(dirs[i + 1].multiply(dt, holder)).
            add(dirs[i + 2].multiply(dt * dt * 0.5, holder));
        }
        if (lev - 2 >= 0) dirs[lev - 2].add(dirs[lev - 1].multiply(dt, holder))
            .add(dir.multiply(dt * dt * 0.5, holder));
        if (lev - 1 >= 0) dirs[lev - 1].add(dir.multiply(dt, holder));
        this.t += dt;
        return holder.set(dir.x, dir.y, dir.z);
    }
    step(dt = this.dt) {
        var dirs = this.diffEqn.ydirs;
        var lev = this.diffEqn.order;
        var dir1;
        if (lev - 1 >= 0) dir1 = dirs[lev - 1].clone();
        var dir2 = this.step0(dt);
        var rk2 = dir2.add(this.diffEqn.eqn(this.t, this.diffEqn.ydirs)).multiply(0.5);
        if (lev - 1 >= 0) dirs[lev - 1] = dir1.add(rk2.multiply(dt));
    }
}

class RK22 extends Euler {
    constructor(diffEqn = new DiffEqn(), dt = 0.1, startTime = 0, inits = [new Vec()]) {
        super(diffEqn, dt, startTime, inits);
    }
    step0(dt = this.dt) {
        var dir = this.diffEqn.eqn(this.t, this.diffEqn.ydirs).clone(this.holder);
        var dirs = this.diffEqn.ydirs;
        var holder = new Vec();
        var lev = this.diffEqn.order;
         for (var i = 0; i < lev - 2; i++) {
            dirs[i].add(dirs[i + 1].multiply(dt, holder)).
            add(dirs[i + 2].multiply(dt * dt * 0.5, holder));
        }
        if (lev - 2 >= 0) dirs[lev - 2].add(dirs[lev - 1].multiply(dt, holder))
            .add(dir.multiply(dt * dt * 0.5, holder));
        if (lev - 1 >= 0) dirs[lev - 1].add(dir.multiply(dt, holder));
        this.t += dt;
        return holder.set(dir.x, dir.y, dir.z);
    }
    step(dt = this.dt) {
        var s1 = this.states;
        this.step0(dt);
        var s2 = this.states;
        var lev = this.diffEqn.order;
        for(var i = 0; i < lev -1; i++){
            this.diffEqn.ydirs[i]=s1.dirs[i].add(s1.dirs[i+1].add(s2.dirs[i+1],this.holder).multiply(0.5*dt));
        }
        var rk2 = s1.hdir.add(this.diffEqn.eqn(s2.t, s2.dirs)).multiply(0.5);
        if (lev - 1 >= 0)this.diffEqn.ydirs[lev-1] = s1.dirs[lev-1].add(rk2.multiply(dt));
    }
}

class RK23 extends Euler {
    constructor(diffEqn = new DiffEqn(), dt = 0.1, startTime = 0, inits = [new Vec()]) {
        super(diffEqn, dt, startTime, inits);
    }
    step0(dt = this.dt) {
        var dir = this.diffEqn.eqn(this.t, this.diffEqn.ydirs).clone(this.holder);
        var dirs = this.diffEqn.ydirs;
        var holder = new Vec();
        var lev = this.diffEqn.order;
        for (var i = 0; i < lev - 1; i++) {
            dirs[i].add(dirs[i + 1].multiply(dt, holder));
        }
        if (lev - 1 >= 0) dirs[lev - 1].add(dir.multiply(dt, holder));
        this.t += dt;
        return holder.set(dir.x, dir.y, dir.z);
    }
    step(dt = this.dt) {
        var s1 = this.states;
        this.step0(dt);
        var s2 = this.states;
        var lev = this.diffEqn.order;
        var rk2 = s2.hdir.add(s1.hdir).multiply(0.5);
        if (lev - 1 >= 0) this.diffEqn.ydirs[lev - 1] = s1.dirs[lev - 1].add(rk2.multiply(dt), s2.dirs[lev-1]);
        for (var i = lev - 2; i >= 0; i--) 
            this.diffEqn.ydirs[i] = 
                s1.dirs[i].add(s1.dirs[i + 1].add(s2.dirs[i + 1], this.holder).multiply(0.5 * dt), s2.dirs[i]);      
    }
}
```

RK21 propagates the results down with second order taylor approximation, and applies runge-kutta 2 to compute the last derivative term. RK22 records the initial state as k1, propagates down with second order taylor approximation to obtain the k2 term, and computes each term with second order runge-kutta. RK23 propagates k1.5 with Euler's method, and propagates upward using Runge-Kutta, and defining a k2 for each term. Among them, RK22 has the most accurate result and consistent behavior and was thus put into use.