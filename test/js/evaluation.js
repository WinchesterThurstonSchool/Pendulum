//This js tests time complexity of evaluating different notations
var add = (a, b) => a + b;
var sub = (a, b) => a - b;
var mul = (a, b) => a * b;
var div = (a, b) => a / b;
var pow = (a, b) => Math.pow(a, b);
//Expression for testing: 7*8-90/(5*20-3)

//Pseudo infix notation
var expr = [7, mul, 8];

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

console.log(evaluateInfix(expr));
var start = new Date().getTime();
for (var i = 0; i < 10000000; ++i) {
    evaluateInfix(expr);
}
var end = new Date().getTime();
var time = end - start;
console.log('Execution time: ' + time);


//Reverse Polish notation
var expr = [7, 8, mul];
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

console.log(evaluateRPN(expr));
var start = new Date().getTime();
for (var i = 0; i < 403219; i++) {
    evaluateRPN(expr);
}
console.log(stack.length);
var end = new Date().getTime();
var time = end - start;
console.log('Execution time: ' + time);