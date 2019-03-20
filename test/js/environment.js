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
    this.definitions = {};
    this.variables = {};
    var sinks = [];
    var E = this;
    class Definition {
        constructor(name) {
            this.name = name;
            //The variables that this depends on
            this.dependencies = {};
            //Reverse polish notations inputted from the UI module
            this.equations = [];
            //See research document
            this.indefiniteCount = undefined;
            this.unknowns = [];
            //Whether this has a strict definition
            this.hasStrict = false;
            //Whether all the equations of this have been analyzed
            this.state = "unanalyzed";
            Variable.toString = () => this.name + ": " + this.val;
        }
        /**
         * Loads an equation for the definition and computes all its dependencies
         * @param {[Token]} equation 
         */
        addEquation(equation) {
            this.equations.push(equation);
            this.analyzed = false;
            loadDependencies(equation);
        }
        loadDependencies(equation) {
            for (let i in equation) {
                let expression = equation[i];
                for (let j in expression) {
                    let token = expression[j];
                    if (token.type === "variable" && token.value !== this.name) {
                        if (E.variables[token.value] == undefined) {
                            E.variables[token.value] = this.dependencies[token.value] = new Variable(token.value);
                        } else
                            this.dependencies[token.value] = E.variables[token.value];
                    }
                }
            }

        }
        assignDefinition() {
            for (let vName in this.dependencies) {
                this.dependencies[vName].attachDefinition(this);
            }
        }
        analyze() {
            this.state = "analyzing";
            this.computeIndefiniteCount();
            this.getCoordinateAssociation();
            if (this.indefiniteCount >= 0)
                this.dependentVName = findDependent();
            this.state = "analyzed";
        }
        computeIndefiniteCount() {
            this.indefiniteCount = 0;
            for (let i in this.equations)
                this.indefiniteCount -= (this.equations[i].length - 1);
            for (let vName in this.dependencies)
                if (this.dependencies[vName].isAlgebraic()) {
                    this.indefiniteCount++;
                    this.unknowns.push(this.dependencies[vName]);
                }
            if (this.hasStrict) this.indefiniteCount += 1;
        }
    }
    class Variable {
        /**
         * Constructs an instance of variable
         * @param {string} name
         */
        constructor(name) {
            this.name = name;
            //Definitions that define this variable
            this.definitions = {};
            /* Determines whether this is instantiated by a strict/soft definition,
             * see research document for variable definition
             */
            this.defType = "soft";
            //The variables that this depends on
            this.dependencies = {};
            //Other variables whose values dependent on this
            this.proprietors = {};
            //Whether this is going to be evaluated algebraically or numerically
            this.evaluationType = "unknown";
            //Value of this, can be a numeric value or an algebraic function
            this.val = 0;
            this.states = {
                computed: true,
                outdatedDependencies: []
            };
            Variable.toString = () => this.name + ": " + this.val;
        }
        /**
         * Attaches a definition to the variable, there by loading in all
         * its dependencies and determining its definition type
         * @param {Definition} definition 
         */
        attachDefinition(definition) {
            this.definitions[definition.name] = definition;
            if (definition.name == this.name)
                if (this.defType == "soft")
                    this.defType = "strict";
                else core.handleError("Overloaded definition");

            for (var dName in definition.dependencies) {
                if (this.dependencies[dName] == undefined)
                    addDependency(definition.dependencies[dName]);
            }

        }
        /**
         * Mutually links this and another variable into a 
         * dependency-prorietor relation
         * @param {Variable} dependency the dependency to be added
         */
        addDependency(dependency) {
            this.dependencies[dependency.name] = dependency;
            dependency.proprietors[this.name] = this;
        }
        /**
         * Mutually deletes reference between the dependency of this and 
         * this as the propriotor of the dependency, and removes the dependent
         * variable from the variable pool if it becomes a disconnected vertex
         * @param {Variable} dependency the dependency to be removed
         */
        removeDependency(dependency) {
            delete dependency.proprietors[this.name];
            delete this.dependencies[dependency.name];
            if (Object.keys(dependency.proprietors).length == 0)
                delete E.variables[dependency.name];
        }
        /**
         * Removes all the variables from the dependency list
         */
        clearDependency() {
            for (let name in this.dependencies) {
                this.removeDependency(this.dependencies[name]);
            }
        }
        /**
         * Recomputes the value of this and all those that depends on this by first pulsing and
         * finding the sinks and recursively recomputing variables from the bottom of the depedency tree
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
         * Pulse sends a pulse upward in the dependency tree to notify all its proprietors 
         * that their value need to be recomputed
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
        /**
         * Sends down a recursive call from this to all its dependencies for recomputation
         * until a source vertex or a computed variable has been reached
         */
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
    }

    this.variables.pi = new Variable("pi");
    this.initializeDefinition = function (name) {
        this.definitions[name] = new Definition(name);
        this.variables[name] = new Variable(name);
    };
    this.loadEquation = function (name, equation) {
        this.definitions[name].addEquation(equation);
    };
}


export {
    types,
    Environment
};