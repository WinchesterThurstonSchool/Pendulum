expr = (x)=> Math.sin(x);

(function Environment(core) {
    sinks = [];
    class Variable {
        constructor(name, expression) {
            this.name = name;
            //The variables that this depends on
            this.dependencies = [];
            //Other variables whose values dependent on this
            this.proprietors = [];
            //Expression with variable names
            this.expression = expression;
            //Expression with variable values
            this.val = 0;
            this.states = {
                computed: true,
                outdatedDependencies:[]
            }
            this.tex="";
            Variable.toString = () => this.name + ": " + this.val;
        }
        update() {
            this.pulse();
            for(var i in sinks){
                var dependency = sinks[i];
                console.log("Checking: " + dependency);
                if(!dependency.states.computed)
                    dependency.computeDependencies();
            }
        }
        /**
         * 
         * @param {Variable} dependency the dependency that invoked pulse
         */
        pulse(dependency) {
            if(dependency!=null)
                this.states.outdatedDependencies.push(dependency)
            this.states.computed=false;
            console.log("Pulsing: "+this+" from: "+dependency)
            for (var i in this.proprietors) {
                this.proprietors[i].pulse(this);
            }
            if(this.proprietors.length==0)
                sinks.push(this);
        }
        compute(a,b){
            return 1;
        }
        computeDependencies() {
            console.log("Computing: " + this)
            for (var i in this.states.outdatedDependencies) {
                var dependency = this.states.outdatedDependencies[i];
                console.log("Checking: " + dependency);
                if (!dependency.states.computed) 
                    dependency.computeDependencies();
                
            }
            this.val = this.compute();
            this.states.computed = true;
        }
        applyToAll(action = (self) => self.update) {
            if (this.type == "Object") {
                for (name in this.val) this.val[name].applyToAll(action);
            }
            action(this);
        }
        parse(tex = "") {
            var val = [];
            if (tex.includes('+')) {

            }
        }
        addDependency(dependency){
            this.dependencies.push(dependency)
            dependency.proprietors.push(this)
        }
        
    }

    var pi = new Variable();
    pi.tex = "\pi";

    var a = new Variable("a",expr);
    var b = new Variable("b",expr);
    var c = new Variable("c",expr);
    var d = new Variable("d",expr);
    a.addDependency(b);
    a.addDependency(c);
    b.addDependency(c);
    c.addDependency(d);

    console.log("Updating c: ");
    c.update();
    console.log("Updating d: ");
    d.update();
})()