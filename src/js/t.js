var add = (a, b) => a + b;
var sub = (a, b) => a - b;
var mul = (a, b) => a * b;
var div = (a, b) => a / b;
var pow = (a, b) => Math.pow(a, b);

//Sample expression for testing: 7*8-90/(5*20-3)
var expr = [7, mul, 8, sub, [90, div, [5, mul, 20, sub, 3]]];
var expr0 = [
    [2, pow, 4, add, 19]
]

function evaluate(expression = []) {
    var val;
    var i = -1;
    var length = expression.length;
    while (i < length) {
        var b = expression[i + 1];
        if (isNaN(b)) {
            if (b instanceof Variable) {
                b = b.val;
            } else if (Array.isArray(b)) {
                b = evaluate(b);
            } else throw "Invalid expression";
        }
        val = (i > 0) ? expression[i](val, b) : b;
        i += 2;
    }
    return val;
}
console.log(evaluate(expr0));

function Variable() {
    this.isVisualized = false;
    this.tex = ""
    //Each function has a expression and a corresponding temporary value
    this.expression = {};
    this.type = types["{"];
    this.parent = this;
    //The variables that this depends on
    this.dependencies = [];
    //Other variables whose values dependent on this
    this.proprietors = [];
    this.states = {
        value: {},
        computed: true,
        obDependencies:[]
    }
    this.update = function () {

    }
    this.pulse = function () {
        update();
        for (i in this.dependencies) {

        }
    }
    this.applyToAll = function (action = (self) => self.update()) {
        if (this.type == "Object") {
            for (name in this.val) this.val[name].applyToAll(action);
        }
        action(this);
    }
    this.parse = function (tex = "") {
        var val = [];
        if (tex.includes('+')) {

        }
    }
    this.addDependency = function (a = Variable.prototype) {
        console.log("adding dependency: " + a);
        this.dependencies.push(a);
        a.proprietors.push(this);
        console.log("dependencies: " + this.dependencies);
        console.log("dependent proprietors: " + a.proprietors);
    }
}
