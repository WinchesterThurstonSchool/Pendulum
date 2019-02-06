//This js tests time complexity of evaluating different notations
var add = (a, b) => a + b;
var sub = (a, b) => a - b;
var mul = (a, b) => a * b;
var div = (a, b) => a / b;
var pow = (a, b) => Math.pow(a, b);
//Expression for testing: 7*8-90/(5*20-3)
//Reverse Polish notation
var expr = [7, 8, mul, 90, 5, 20, mul, 3, sub, div, sub]
var stack = [];
function evaluateRPN(expression = []){
    for(var i in  expression){
        var token = expression[i];
        if(!isNaN(token)){
            stack.push(token);
        }else{
            var b=stack.pop(),
                a=stack.pop();
            stack.push(token(a,b));
        }
    }
    return stack.pop();
}
var start = new Date().getTime();
for (var i = 0; i < 10000000; i++) {
    evaluateRPN(expr);
}
var end = new Date().getTime();
var time = end - start;
console.log('Execution time: ' + time);

//Pseudo infix notation
var expr = [7, mul, 8, sub, [90, div, [5, mul, 20, sub, 3]]];
function evaluateInfix(expression = []) {
    var val;
    var i = -1;
    var length = expression.length;
    while (i < length) {
        var b = expression[i + 1];
        if (isNaN(b)) {
           if (Array.isArray(b)) {
                b = evaluateInfix(b);
            } else throw "Invalid expression";
        }
        val = (i > 0) ? expression[i](val, b) : b;
        i += 2;
    }
    return val;
}

var start = new Date().getTime();
for (var i = 0; i < 10000000; ++i) {
    evaluateInfix(expr);
}
var end = new Date().getTime();
var time = end - start;
console.log('Execution time: ' + time);
