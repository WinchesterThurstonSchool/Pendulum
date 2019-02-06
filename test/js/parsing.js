
//This js tests algorithms for input parsing, 
//which is separated into preparse and parse
var add = (a, b) => a + b;
var sub = (a, b) => a - b;
var mul = (a, b) => a * b;
var div = (a, b) => a / b;
var pow = (a, b) => Math.pow(a, b);
var log = (a, b) => Math.log(a, b);
var sin = (a, b) => Math.sin(a, b);
var cos = (a, b) => Math.cos(a, b);
var assign = (a,b)=>a.setValue(b);
/**
 * function: [precedence, associativity]
 * function: [[<=-1, max-] U [>=0, min+], is right associative]
 */
var functionProperties = {
    assign: [-1, false],
    add: [0,false],
    sub: [0,false],
    mul: [1,false],
    div: [1,false],
    pow: [2, false],
    log: [1.5, false],
    sin: [10, false],

};
//Preparse
const acode = 'a'.charCodeAt();
const zcode = 'z'.charCodeAt();
//Input for testing: \sum _{i=0}^{\infty }i^2
//Command dictionary:
const commands = {
    '+': add,
    '-': sub,
    '*': mul,
    '/': div,
    '^': pow,
    '\\': {
        's': {
            'i': {
                'n': ["\left(1\right)", sin]
            },
            'u': {
                'm': "sum"
            }
        },
        'c': {
            'd': {
                'o': {
                    't': mul
                }
            },
            'o': {
                's': ["\left(1\right)", cos]
            }
        },
        'f': {
            'r': {
                'a': {
                    'c': ["_{1}{2}", div]
                }
            }
        },
        'd': {
            'i': {
                'v': div
            }
        }
    }
}
/**
 * Number recognition rule:
 * Digits with at most one decimal point
 * Complete digit collection once see none number
 */
var s = "[a,s,d,f]";
//Parse
function preParse(str = ""){
    /**
     * 0 complete
     * 1 number
     * 2 name
     * 3 command
     */
    var state = 0;
    var seq = [];
    var cache = '';
    for (let i = 0; i < str.length; i++) {
        console.log(i)
        let c = str.charAt(i);
        let charcode = c.charCodeAt(0);
        let tempChache = cache+c;
        /**
         * 1 number
         * 2 letter
         * 3 special character
         */
        var type = 0;
        if (!isNaN(c)) type = 1;
        else 
            if (acode <= charcode && charcode <= zcode) type = 2;
            else type = 3
        switch(state){
            case 0: 
                cache += c;
                state = type;
                break;
            case 1: 
                if(isNaN(tempChache)){
                    seq.push(Number(cache));
                    i-=1;
                    cache='';
                    break;
                }
                else cache = tempChache
                break;
            default: break;
        }  
    }
    seq.push(cache);
    return seq;
}
// console.log(preParse('12.3a'))
//Input for testing: y=2+3
var exp = [72, sub, 5, add, -3];
var parseStack = [];
function parseToRPN(exp){
    var output = [];
    for(var i in exp){
        var ele = exp[i];
        if(!isNaN(ele)){
            output.push(ele);
        } else {
            if(parseStack.length!=0){
                while(parseStack.length>0)
                    output.push(parseStack.pop());   
            }
            parseStack.push(ele);
        }
    }
    while (parseStack.length > 0)
        output.push(parseStack.pop());
    return output;
}
var stack=[];
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
console.log(evaluateRPN(parseToRPN(exp)));
