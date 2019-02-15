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
    var sinks = [];
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
                outdatedDependencies: []
            };
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
            for (var i in this.proprietors) {
                this.proprietors[i].pulse(this);
            }
            if (this.proprietors.length == 0)
                sinks.push(this);
        }
        compute() {
            evaluateRPN(this.expression);
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
        applyToAll(action = (self) => self.update) {
            if (this.type == "Object") {
                for (let name in this.val) this.val[name].applyToAll(action);
            }
            action(this);
        }
        addDependency(dependency) {
            this.dependencies.push(dependency);
            dependency.proprietors.push(this);
        }
        setValue(newvalue) {
            this.val = newvalue;
            this.update();
        }
    }

    var pi = new Variable();
    pi.tex = "\pi";
}


export {
    types,
    Environment
};