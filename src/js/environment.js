/*jshint esversion: 6 */
import * as O from './operators.js';
import {
    constants
} from './operators.js';

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
            this.association = {};
            this.dependentVar = "";
            this.variables = {};
            this.graphType = "none";
            this.definitionType = "soft";
            this.stack = [];
            this.sumClauseCount=0;
        }
        clearDependencies() {
            for (let name in this.variables) {
                delete this.variables[name].proprietors[this.name];
                delete this.variables[name];
            }
            if (this.definitionType === "strict") {
                E.variables[this.name].definitionType = "soft";
                E.variables[this.name].value = undefined;
                this.requestComputation();
            }
        }
        setEquation(equation) {
            this.clearDependencies();
            this.equation = equation;
            this.definitionType = "soft";
            for (let i in equation) {
                let expression = equation[i];
                this.findVariables(expression);
            }
            this.graphType = this.getGraphicsType();
            this.getAssociation();
            this.findDependent();
            if (this.definitionType === "strict")
                if (this. getIndefiniteCount() == 0)
                    E.variables[this.name].evaluation = "numeric";
                else
                    E.variables[this.name].evaluation = "algebraic";
        }
        findVariables(expression) {
            for (let j in expression) {
                let token = expression[j];
                if (token.type === "variable") {
                    if (E.variables[token.value] == undefined)
                        E.variables[token.value] = new Variable(token.value);
                    if (token.value === this.name) {
                        this.definitionType = "strict";
                        E.variables[token.value].definitionType = "strict";
                        E.variables[token.value].definition = this;
                    } else {
                        this.variables[token.value] = E.variables[token.value];
                        E.variables[token.value].proprietors[this.name] = this;
                    }
                }
                if (token.rpnClauses != undefined && token.rpnClauses.length != 0) {
                    for (let i in token.rpnClauses)
                        this.findVariables(token.rpnClauses[i]);
                }
            }
        }
        requestComputation() {
            if (E.variables[this.dependentVar].evaluation === "algebraic" || !E.variables[this.dependentVar].computed) return;
            E.variables[this.dependentVar].computed = false;
            for (let name in E.variables[this.dependentVar].proprietors)
                E.definitions[name].requestComputation();
        }
        getGraphicsType() {
            return "cartesian";
        }
        graph() {
            let graphFunc = this.getGraphFunc();
            graphFunc.definition = this;
            core.graph(this.name, this.graphType, graphFunc);
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
            this.indefiniteCount = variableCount + 1 - expressionCount + (this.definitionType == "strict") ? 1 : 0;
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
            if (this.definitionType === "strict")
                this.dependentVar = this.name;
            else this.dependentVar = (core.canvasMode === "2D") ? 'y' : 'z';
        }
        /**
         * Uses the graph type of this to generate a graphics function for visualization
         */
        getGraphFunc() {
            switch (this.graphType) {
                case "cartesian":
                    return (x, y) => {
                        if (x != undefined)
                            E.variables[this.association.x].value = x;
                        if (y != undefined)
                            E.variables[this.association.y].value = y;
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
                E.variables[this.dependentVar].value = this.evaluateRPN(this.equation[this.equation.length - 1]);
            // console.log(E.variables[this.dependentVar].value);
            return E.variables[this.dependentVar].value;
        }

        evaluateRPN(expression = [], i = 0) {
            for (; i < expression.length; i++) {
                var token = expression[i];
                if (i == 1 && token.value === "=")
                    if (expression[0].type === "variable") {
                        this.variables[expression[0].value] = this.evaluateRPN(expression, i + 1);
                        break;
                    }
                if (token.type === "number")
                    this.stack.push(+token.value);

                if (token.type === "constant")
                    this.stack.push(constants[token.value]);

                if (token.type === "variable" && this.variables[token.value] != undefined) {
                    if (this.variables[token.value].evaluation === "algebraic")
                        this.stack.push(this.variables[token.value].getAlgebraicValue());
                    else this.stack.push(this.variables[token.value].getValue());
                }

                if (token.type === "operator" || (token.type === "function" && token.length == 2)) {
                    let b = this.stack.pop(),
                        a = this.stack.pop();
                    if (a != undefined && b != undefined)
                        this.stack.push(token.value(a, b));
                }

                if (token.type === "function") {
                    if (token.rpnClauses != undefined) {
                        let a, b;
                        switch (token.rpnClauses.length) {
                            case 1:
                                a = this.evaluateRPN(token.rpnClauses[0]);
                                if (a != undefined)
                                    this.stack.push(token.value(a));
                            case 2:
                                // console.log("in fraction evaluation");
                                a = this.evaluateRPN(token.rpnClauses[0]);
                                // console.log("numerator: " + a);
                                b = this.evaluateRPN(token.rpnClauses[1]);
                                // console.log("denominator: " + b);
                                if (a != undefined && b != undefined)
                                    this.stack.push(token.value(a, b));
                        }

                    } else this.stack.push(token.value(this.stack.pop()));
                }

                if (token.type === "largeOperator") {
                    let indexVariable = token.indexVariable;
                    if (this.variables[indexVariable.value] == undefined )
                        this.variables[indexVariable.value] = E.variables[indexVariable.value] = new Variable(indexVariable.value);
                    let condition = this.evaluateRPN(token.rpnClauses[0]);
                    let upperBound = this.evaluateRPN(token.rpnClauses[1]);
                    let result;
                    if(upperBound!=undefined && condition!=undefined){
                        for (let i = 0;; i++) {
                            this.variables[indexVariable.value].value = token.computeIndexVariable(i, condition);
                            this.variables[indexVariable.value].computed = true;
                            if (result == undefined) {
                                result = this.evaluateRPN(token.rpnClauses[2]);
                            } else {
                                result = token.value(result, this.evaluateRPN(token.rpnClauses[2]));
                            }
                            if (this.variables[indexVariable.value].value >= upperBound) break;
                        }
                        this.sumClauseCount=token.rpnClauses[2][0].computationCount;
                    }
                    this.stack.push(result);
                }
            }
            var re = this.stack.pop();
            // this.stack.length=0;
            return re;
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
            this.definitionType = "soft";
            this.computed = false;
            this.definition = Definition.prototype;
            this.value = undefined;
            this.proprietors = {};
            Variable.toString = () => this.name + ": " + this.val;
        }
        getValue() {
            if (this.computed)
                return this.value;
            else {
                this.value = this.definition.solveDependent();
                this.computed = true;
                return this.value;
            }
        }
        getAlgebraicValue() {
            if (this.definitionType === "soft")
                return this.value;
            else
                return this.definition.solveDependent();
        }
    }
    this.createDefintion = function (name) {
        this.definitions[name] = new Definition(name);
    };
    this.removeDefinition = function (name) {
        this.definitions[name].clearDependencies();
        delete this.definitions[name];
    };
    this.loadEquation = function (name, equation) {
        this.definitions[name].setEquation(equation);
    };
    this.graphAll = function () {
        for (var name in this.definitions) {
            if (this.definitions[name].equation.length != 0) {
                this.definitions[name].graph();
            }
        }
    };
}


export {
    types,
    Environment
};