/*jshint esversion: 6 */
import * as O from './operators.js';

var types = {
    ":": "Variable",
    "": "Function",
    "{": "Object"
};


function Environment(core) {
    this.definitions = {};
    this.variables = {};
    var E = this;
    class Definition {
        constructor(name) {
            this.name = name;
            this.variableValues = {};
            this.association = {};
            this.dependentVar = "";
            this.variables = {};
            this.graphType = "none";
            this.definitionType = "soft";
            this.stack = [];
        }
        setEquation(equation) {
            this.equation = equation;
            for (let i in equation) {
                let expression = equation[i];
                for (let j in expression) {
                    let token = expression[j];
                    if (token.type === "variable") {
                        if (E.variables[token.value] == undefined)
                            E.variables[token.value] = new Variable(token.value);
                        if (token.name === this.name) {
                            this.definitionType = "strict";
                            E.variables[token.name].definition=this;
                        }
                        else this.variables[token.value] = E.variables[token.value];
                        this.variableValues[token.value] = undefined;
                    }
                }
            }
            this.graphType = this.getGraphicsType();
            this.getAssociation();
            this.findDependent();
            if (this.getIndefiniteCount() == 0 && E.variables[this.name] != undefined) E.variables[this.name].evaluation = "numeric";
        }
        getGraphicsType() {
            return "cartesian";
        }
        graph() {
            core.graph(this.graphType, this.getGraphFunc());
        }
        getIndefiniteCount() {
            var expressionCount = 0;
            var variableCount = 0;
            for (let i in this.equation) {
                expressionCount++;
                let expression = this.equation[i];
                for (let j in expression) {
                    let token = expression[j];
                    if (token.type === "variable" && E.definitions[token.value] == undefined)
                        variableCount++;
                }
            }
            this.indefiniteCount = variableCount + 1 - expressionCount;
            return this.indefiniteCount;
        }
        getAssociation() {
            var association = {};
            var coordinates = (core.canvasMode === "2D") ? ['x', 'y'] : ['x', 'y', 'z'];
            for (let i in coordinates)
                association[coordinates[i]] = coordinates[i];

            this.association = association;
        }

        findDependent() {
            if (this.definitionType === "strict") return this.name;
            this.dependentVar = (core.canvasMode === "2D") ? 'y' : 'z';
        }
        /**
         * Uses the graph type of this to generate a graphics function for visualization
         */
        getGraphFunc() {
            switch (this.graphType) {
                case "cartesian":
                    return (x, y) => {
                        if (x != undefined)
                            this.variableValues[this.association.x] = x;
                        if (y != undefined)
                            this.variableValues[this.association.y] = y;
                        return this.solveDependent();
                    };
            }
        }
        /**
         * Given all other indepedent values, the function solves for the 
         * depedent var for a finite equation
         * @param {{String : Number}} iVar indepedent varaible
         */
        solveDependent() {
            if (this.equation.length == 2 && this.equation[0].length == 1 && this.equation[0][0].value === this.dependentVar || this.equation.length == 1)
                this.variableValues[this.dependentVar] = this.evaluateRPN(this.equation[this.equation.length - 1]);
            return this.variableValues[this.dependentVar];
        }

        evaluateRPN(expression = []) {
            for (var i in expression) {
                var token = expression[i];
                if (token.type === "number")
                    this.stack.push(+token.value);

                if (token.type === "variable")
                    this.stack.push(this.variableValues[token.value]);

                if (token.type === "operator" || (token.type === "function" && token.length == 2)) {
                    var b = this.stack.pop(),
                        a = this.stack.pop();
                    if (a != undefined && b != undefined)
                        this.stack.push(token.value(a, b));
                    // else console.log( "Incomplete expression");
                }

                if (token.type === "function" && token.length == 1)
                    this.stack.push(token.value(this.stack.pop()));
            }
            return this.stack.pop();
        }
    }
    class Variable {
        /**
         * Constructs an instance of variable
         * @param {string} name
         */
        constructor(name) {
            this.name = name;
            this.evaluation = "algebraic";
            this.computed = false;
            this.definition = Definition.prototype;
            this.value = undefined;
            Variable.toString = () => this.name + ": " + this.val;
        }
        getValue(){
            if (computed)
                 return this.value;
            else{
                this.value = this.definition.solveDependent();
                this.computed = true;
                return this.value;
            }
                 
        }
    }
    this.createDefintion = function (name) {
        this.definitions[name] = new Definition(name);
    };
    this.loadEquation = function (name, equation) {
        this.definitions[name].setEquation(equation);
    };
    this.graphAll = function () {
        for (var name in this.definitions) {
            this.definitions[name].graph();
        }
    };
}


export {
    types,
    Environment
};