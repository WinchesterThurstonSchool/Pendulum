/*jshint esversion: 6 */
import * as O from './operators.js';

var types = {
    ":": "Variable",
    "": "Function",
    "{": "Object"
};

function evaluateRPN(expression = []) {
    for (var i in expression) {
        var token = expression[i];
        if (!isNaN(token)) {
            stack.push(token);
        } else {
            var b = stack.pop(),
                a = stack.pop();
            stack.push(token(a, b));
        }
    }
    return stack.pop();
}
function Environment(core) {
    var variables = {};
    var sinks = [];
    class Variable {
        constructor(name, rpns, type="inital") {
            this.name = name;
            //The variables that this depends on
            this.dependencies = {};
            //Other variables whose values dependent on this
            this.proprietors = {};
            //Reverse polish notations inputted from the UI module
            this.expression = rpns;
            //Value of this expression
            //Can be a command or a primitive data type
            this.val = 0;
            this.states = {
                computed: true,
                outdatedDependencies: []
            };
            //Calculates the number of indepedent variables in the expression of this
            this.varcount = 0;
            Variable.toString = () => this.name + ": " + this.val;
        }
        /**
         * Recomputes all the variables whose values directly or independently depends on this
         * responding to value change of this
         */
        update() {
            this.pulse();
            for (var i in sinks) {
                var dependency = sinks[i];
                console.log("Checking: " + dependency);
                if (!dependency.states.computed)
                    dependency.computeDependencies();
            }
        }
        /**
         * 
         * @param {Variable} dependency the dependency that invoked pulse
         */
        pulse(dependency) {
            if (dependency != null)
                this.states.outdatedDependencies.push(dependency);
            this.states.computed = false;
            console.log("Pulsing: " + this + " from: " + dependency);
            for (var i in this.proprietors)
                this.proprietors[i].pulse(this);
            if (this.proprietors.length == 0)
                sinks.push(this);
        }
        compute() {
            evaluateRPN(this.expression);
        }
        loadRPNs(rpns){
            for(let i in rpns){
                let rpn = rpns[i];
                for(let j in rpn){
                    let token = rpn[j];
                    if (token.type == "variable"){
                        let defn;
                        if (!definitions[token.value]) 
                            defn = definitions[token.value] = new Variable(token.value, [], "independent");
                        else 
                            defn = definitions[token.value];
                        this.addDependency(defn);
                    } 
                }
            }
            this.expression = rpns;
            for(let i in this.dependencies){
                let dependent = dependencies[i];
                if(dependent.type=="independent")this.varcount++;
            }
        }
        computeDependencies() {
            console.log("Computing: " + this);
            for (var i in this.states.outdatedDependencies) {
                var dependency = this.states.outdatedDependencies[i];
                console.log("Checking: " + dependency);
                if (!dependency.states.computed)
                    dependency.computeDependencies();

            }
            this.val = this.compute();
            this.states.computed = true;
        }
        applyToAll(action = (self) => self.update()) {
            if (this.type == "Object") 
                for (let name in this.val) this.val[name].applyToAll(action);
            action(this);
        }
        addDependency(dependency) {
            this.dependencies[dependency.name]=dependency;
            dependency.proprietors[this.name]=this;
        }
        setValue(newvalue) {
            this.val = newvalue;
            this.update();
        }
    }

    var pi = new Variable("pi");
    this.createVar = function(name, RPN){
        variables[name]=new Variable(name, RPN, "initial");
    };
}


export {
    types,
    Environment
};