/**
 * The preparse step is now called tokenization,
 * it parses LaTeX into tokens
 */

/*jshint esversion: 6 */

import {
    add,
    sub,
    negate,
    mul,
    div,
    sin,
    cos,
    pow,
    ln,
    sqrt,
    assign
} from './operators.js';

const largeOperatorCollector = (parser, token) => {
    let init;
    let state = "init";
    let clauseReader = function (c, t) {
        if (t.indexOf(c) != -1) return true;
        switch (state) {
            case "init":
                if (c === "{")
                    state = "{";
                else if (c !== " ")
                    state = "letter";
                break;
            case "letter":
                state = "init";
                return true;
            case "{":
                if (c === "}") {
                    state = "{}";
                }
                break;
            case "{}":
                state = "init";
                return true;
        }
        return false;
    };
    console.log("searching for _ or ^");
    while ((init = parser.readNext()) !== "_" && init !== "^")
        if (parser.i >= parser.LaTeX.length) return false;
    console.log("entering " + init + " clause");
    token.subClauses[(init === "_") ? 0 : 1] = parser.readFrom([], ";", false, clauseReader);
    console.log("searching for _ or ^");
    while ((init = parser.readNext()) !== "_" && init !== "^")
        if (parser.i >= parser.LaTeX.length) return false;
    console.log("entering " + init + " clause");
    token.subClauses[(init === "_") ? 0 : 1] = parser.readFrom([], ";", false, clauseReader);
    console.log("entering summation clause");
    token.subClauses[2] = parser.readFrom([], "+;");
    console.log("exiting summation clause");
    parser.i--;
    return true;
};
//Parsing constants
const zerocode = '0'.charCodeAt(0);
const ninecode = '9'.charCodeAt(0);
const slashcode = '\\'.charCodeAt(0);
const dotcode = '.'.charCodeAt(0);
const isSymbol = (code = 0) => {
    return (code <= 63 && code >= 58) || (code <= 47 && code >= 33) || (code <= 126 && code >= 123) || (code <= 96 && code >= 91) || code === ' '.charCodeAt(0);
};
const acode = 'a'.charCodeAt(0);
const zcode = 'z'.charCodeAt(0);
const Acode = 'A'.charCodeAt(0);
const Zcode = 'Z'.charCodeAt(0);
/**Command dictionary:
 *  Command specifier: [{string} type, 
 *  {function} value, 
 *  (type==="operator")?{number} precedence:{number} argument count, 
 *  (type==="operator")?{boolean} is right associative: {function} extra actions]
 */
const commands = {
    '+': [add, 1, false],
    '-': [sub, 1, false],
    '*': [mul, 2, false],
    '/': [div, 2, false],
    '^': [pow, 3, true],
    '\\': {
        ' ': ["structure", " "],
        'c': {
            'd': {
                'o': {
                    't': ["operator", mul, 2, false]
                }
            },
            'o': {
                's': ["function", cos, 1],
                't': ["function", (x) => 1 / Math.tan(x), 1]
            },
        },
        'd': {
            'i': {
                'v': ["operator", div, 2, false]
            }
        },
        'f': {
            'r': {
                'a': {
                    'c': ["function", div, 0, (parser, token) => {
                        console.log("searching for {");
                        while (parser.readNext() !== "{");
                        console.log("entering numerator");
                        token.subClauses[0] = parser.readFrom([], "}");
                        console.log("searching for {");
                        while (parser.readNext() !== "{");
                        token.subClauses[1] = parser.readFrom([], "}");
                        return true;
                    }]
                }
            }
        },
        'i':{
            'n':{
                't': ["largeOperator", "integrate", 0, largeOperatorCollector]
            }
        },
        'l': {
            'n': ["function", ln, 1],
            'e': {
                'f': {
                    't': {
                        '(': ["structure", "("]
                    }
                }
            }
        },
        'p': {
            'i': ["constant", "pi"],
            'r': {
                'o': {
                    'd': ["largeOperator", (previous, current) => previous * current, 0, (parser, token) => {
                            if (!largeOperatorCollector(parser, token))
                                return false;
                            console.log("slicing _ clause");
                            let lowerClause = token.subClauses[0];
                            console.log("_ clause sliced");
                            if (!(lowerClause[1].type !== "variable" && lowerClause[2].value !== "=")) {
                                token.indexVariable = lowerClause[1];
                                token.subClauses[0] = lowerClause.slice(3, -1);
                                token.computeIndexVariable = function (index, condition) {
                                    return index + condition;
                                };
                                return true;
                            }
                            return false;
                    }]
                }
            }
        },
        'r': {
            'i': {
                'g': {
                    'h': {
                        't': {
                            ')': ["structure", ")"]
                        }
                    }
                }
            }
        },
        's': {
            'i': {
                'n': ["function", sin, 1]
            },
            'u': {
                'm': ["largeOperator", (previous, current) => previous + current, 0, (parser, token)=>{
                    if (!largeOperatorCollector(parser, token))
                        return false;
                    console.log("slicing _ clause");
                    let lowerClause = token.subClauses[0];
                    console.log("_ clause sliced");
                    if (!(lowerClause[1].type !== "variable" && lowerClause[2].value !== "=")){                                            
                        token.indexVariable = lowerClause[1];
                        token.subClauses[0] = lowerClause.slice(3, -1);
                        token.computeIndexVariable = function (index, condition) {
                            return index + condition;
                        };
                        return true;
                    }
                    return false;
                }]
            },
            'q': {
                'r': {
                    't': ["function", sqrt, 0, (parser, token) => {
                        while (parser.i < parser.LaTeX.length && parser.readNext() !== "{");
                        token.subClauses[0] = parser.readFrom([], "}");
                        return true;
                    }]
                }
            }
        },
        't': {
            'a': {
                'n': ["function", Math.tan, 1]
            }
        },
    }
};

/**
 * Check and returns the type of the given character
 * @param {String} c The character
 * @returns {String} type can be one of digit, symbol, letter or '.'
 */
function getCharType(c = 'added char') {
    var code = c.charCodeAt(0);
    if (code <= ninecode && code >= zerocode)
        return "digit";
    else if (c === '.')
        return ".";
    else if ((code <= zcode && code >= acode) || (code <= Zcode && code >= Acode))
        return "letter";
    else
        return "symbol";
}

/**
 * Checks whether the given type is a compelete type
 * @param {String} type 
 */
function isCompleteType(type = "initial") {
    return ["variable", "text", "number", "function", "constant", "operator", "structure", "largeOperator"].indexOf(type) != -1;
}

function Parser() {
    let parser = this;
    this.i = 0;
    this.LaTeX = "";
    //Parentheses level indicates the current depth of nested parentheses
    var pl = 0;
    //Closing parentheses count indicates the number of consecutive clauses expected to be found in the current level
    /**
     * ex:5+(2 + 2)
     *      ^
     *      |
     *  The prentheses here generates a closing count of 1, because only one clause is demanded
     * ex:\frac{a}{b}
     *         ^
     *         |
     *  The prentheses here generates a closing count of 2, because two consecutive clauses is demanded to complete the fraction
     */
    var clCounts = [];

    function ClauseCollector(read = () => 0) {
        this.clauses = [];
        /**
         * Serves as an extension to token.read() by taking in i, c, the current token, and 
         * the current clause and parses it with a more flexible state machine, taking corresponding
         * actions defined by creator of the class
         * @returns Number i if the current clause collection level is terminated, readFrom should return
         * the last clause level and start reading from position i. [] returnClause if the current clause collection
         * is continued, tokenize should set the active clause to the returned clause.
         */
        this.read = read;
    }
    /**
     * @param {[token]} tokens an array of all the tokens that have been so far collected
     * @param {token} lasttoken last token before the current one, undefined if the current token is first
     */
    function Token(tokens, lasttoken) {
        var lastvalue = (lasttoken == undefined) ? ":" : lasttoken.value;
        /**Incomplete token types:
         * initial
         * digit
         * letter
         * command
         * symbol
         * .
         */
        /**Complete token types:
         * variable
         * text
         * number
         * function
         * operator
         * constant
         */
        this.type = "init";
        var isFirst = lastvalue === "(" || lastvalue === "=" || lastvalue === "," || lastvalue === ":";
        this.LaTeX = "";
        let valueHolder = "";
        Object.defineProperty(this, 'value', {
            set: function (x) {
                valueHolder = x;
            },
            get: function () {
                this.computationCount++;
                return valueHolder;
            }
        });
        this.computationCount = 0;
        this.clause = tokens;
        this.subClauses = undefined;
        this.numberdotcount = 0;
        //length conveys the number of parameters for a function
        //Default is 0 for none functions and two otherwise
        this.length = 0;
        //is right associative determines whether the function is right associative
        this.isRightAssociative = false;
        this.startingIndex = parser.i;
        this.parseAndAdd = function (c = 'added char') {
            switch (this.type) {
                case "init":
                    // console.log("in read, char type is:" + getCharType(c));
                    // console.log("in read, char is "+ c);
                    switch (getCharType(c)) {
                        case "digit":
                            this.type = "number";
                            this.value += c;
                            return true;
                        case "letter":
                            this.type = "variable";
                            this.value = c;
                            return true;
                        case "symbol":
                            switch (c) {
                                case '+':
                                    this.type = "operator";
                                    this.precedence = 1;
                                    this.value = isFirst ? (x) => x : add;
                                    return true;
                                case '-':
                                    this.type = isFirst ? "function" : "operator";
                                    this.precedence = 1;
                                    this.value = isFirst ? negate : sub;
                                    this.length = isFirst ? 1 : 2;
                                    return true;
                                case '*':
                                    this.type = "operator";
                                    this.precedence = 2;
                                    this.value = mul;
                                    return true;
                                case '/':
                                    this.type = "function";
                                    this.precedence = 2;
                                    this.value = div;
                                    return true;
                                case '{':
                                    this.type = "structure";
                                    this.value = "(";
                                    return true;
                                case '}':
                                    this.type = "structure";
                                    this.value = ")";
                                    return true;
                                case '(':
                                    this.type = "structure";
                                    this.value = "(";
                                    return true;
                                case ')':
                                    this.type = "structure";
                                    this.value = ")";
                                    return true;
                                case '=':
                                    this.type = "structure";
                                    this.value = "=";
                                    this.precedence = 0;
                                    return true;
                                case '^':
                                    this.type = "operator";
                                    this.value = pow;
                                    this.precedence = 3;
                                    this.isRightAssociative = true;
                                    return true;
                                case '!':
                                    this.type = "function";
                                    this.value = (x)=> {
                                        let fac = 1;
                                        for(let i = 1; i<=x; i++)
                                            fac*=i;
                                        return fac;
                                    };
                                    this.length = 1;
                                    this.precedence = 4;
                                    return true;
                                case '\\':
                                    this.type = "command";
                                    this.scheme = commands["\\"];
                                    return true;
                                case ' ':
                                    return true;
                                case ';':
                                    console.log("; found");
                                    this.type = "terminator";
                                    this.value = ";";
                                    return false;
                                default:
                                    break;
                            }
                            return false;
                        case '.':
                            this.type = ".";
                            this.value = ".";
                            this.numberdotcount += 1;
                            return true;
                        default:
                            break;
                    }
                    return false;
                case ",":
                    this.type = "structure";
                    return true;
                case ".":
                    switch (getCharType(c)) {
                        case ".":
                            return false;
                        case "digit":
                            this.value += c;
                            this.type = "number";
                            return true;
                        default:
                            break;
                    }
                    return false;
                case "number":
                    switch (getCharType(c)) {
                        case ".":
                            if (this.numberdotcount > 0) return false;
                            else {
                                this.value += c;
                                this.numberdotcount += 1;
                            }
                            return true;
                        case "digit":
                            this.value += c;
                            return true;
                        default:
                            break;
                    }
                    return false;
                case "function":
                    if (c === "+" || c === "-" || c === "*" || c === "/")
                        this.type = "init";
                    return false;
                case "variable":
                    switch (c) {
                        case " ":
                            return true;
                        case "_":
                            this.type = "var_";
                            return true;
                        default:
                            if (this.value === "e")
                                this.type = "constant";
                            break;
                    }
                    break;
                case "var_":
                    switch (c) {
                        case "{":
                            this.type = "var_{";
                            return true;
                        case "\\":
                            break;
                        default:
                            if (getCharType(c) === "letter" || getCharType(c) === "digit") {
                                this.type = "}";
                                this.wrapup = () => this.type = "variable";
                                this.value += c;
                                return true;
                            }
                            break;
                    }
                    break;
                case "var_{":
                    if (c === "}") {
                        this.type = "}";
                        this.wrapup = () => this.type = "variable";
                    } else
                        this.value += c;
                    return true;
                case "command":
                    var newscheme = this.scheme[c];
                    if (newscheme != undefined) {
                        if (Array.isArray(newscheme)) {
                            this.value = newscheme[1];
                            if (newscheme[0] === "operator") {
                                this.precedence = newscheme[2];
                                if (newscheme.length > 3) this.isRightAssociative = newscheme[3];
                                this.length = 2;
                            } else if (newscheme[0] === "function" || newscheme[0] === "largeOperator") {
                                this.length = newscheme[2];
                                this.precedence = 1.5;
                                if (newscheme[3] != undefined) {
                                    this.subClauses = [];
                                    this.rpnClauses = [];
                                    if (!newscheme[3](parser, this)) return false;
                                }
                            }
                            this.type = "}";
                            this.wrapup = (nextc) => {
                                this.type = newscheme[0];
                            };
                        } else this.scheme = newscheme;
                        return true;
                    }
                    break;
                case "}":
                    if (c === " ") return true;
                    this.wrapup(c);
                    console.log("performing wrap up for: "+this.LaTeX);
                    break;
                default:
                    break;
            }
            return false;
        };
        this.read = function (c = 'added char') {
            if (this.parseAndAdd(c)) { // Continue collection
                this.LaTeX += c;
                return 0;
            } else {
                if (isCompleteType(this.type)) { // Token completed
                    if (lasttoken != undefined && (lasttoken.type === "variable" || lasttoken.type === "constant" || lasttoken.type === "number" || 
                        lasttoken.value === ")"||(lasttoken.type === "function" && lasttoken.length == 0)) &&
                        (this.type === "variable" || this.type === "constant" || (this.type === "function"&&this.LaTeX!=="!") || this.value === "(" || this.type === "largeOperator")) {
                        let multiply = new Token(lasttoken);
                        multiply.value = mul;
                        multiply.type = "operator";
                        multiply.LaTeX = "";
                        multiply.precedence = 2;
                        tokens.push(multiply);
                    }
                    if (lasttoken != undefined && ((lasttoken.type === "function" && lasttoken.length == 0) && this.type === "number"))
                        return 2;
                    if (this.value === "(") {
                        if (lasttoken != undefined && lasttoken.type === "function") {
                            lasttoken.precedence = 4;
                        }
                    }
                    if (this.value === " ") return 4;
                    return 1;
                } else return 2;
            }
        };
    }

    this.readNext = () => {
        console.log(this.LaTeX.charAt(this.i));
        if(this.i<this.LaTeX.length)
        return this.LaTeX.charAt(this.i++);
        else return undefined;
    };

    this.tokenize = function (LaTeX = "22+.4+2.3-76+23-23+.5") {
        LaTeX += ';';
        this.LaTeX = LaTeX;
        var clause;
        try {  
            clause = this.readFrom([], ";");
        }
        catch(error){
            console.log(error);
        }
        console.log(clause);
        parser.i = 0;
        return clause;
    };

    this.readFrom = function (clause, terminator, inclusive = false, shouldTerminate = ( c, terminator) => terminator.indexOf(c)!=-1) {
        let token;
        let lasttoken;
        let LaTeX = parser.LaTeX;
        let terminationQueued = false;
        //In a clause, "(" adds to the prentheses level, while ")" subtracts 1 from the prenthese level
        //In a clause, the prentheses level cannot be negative, so if an extra ")" is found
        //the current clause will be terminated, and when a clause ends, the
        //prentheses level should be 0. 
        let prenthesesLevel = 0;
        function readnext(i) {
            token = new Token(clause, lasttoken);
            var state = token.read(LaTeX.charAt(i));
            if (state == 3)
                state = token.read(LaTeX.charAt(i));
            if (state != 0)
                throw "Unrecognized symbol at " + i + ": \"" + LaTeX.charAt(i) + "\"";
        }
        for (; parser.i < LaTeX.length; parser.i++) {
            let i = parser.i;
            console.log(LaTeX.charAt(i));
            if (token == null)
                token = new Token(clause, undefined);
            if (shouldTerminate(LaTeX.charAt(i), terminator)) {
                console.log("terminator found with token ="+ token.value);
                switch (token.read(LaTeX.charAt(i))) {
                    case 1:
                        if (token.value === ")") {
                            prenthesesLevel--;
                            if (prenthesesLevel < 0) {
                                parser.i = token.startingIndex;
                                return clause;
                            }
                        }
                        if (token.value === "(")
                            prenthesesLevel++;
                        clause.push(token);
                        if(inclusive){
                            readnext(i);
                            terminationQueued = true;
                            parser.i++;
                            i = parser.i;
                        }
                        break;
                    case 2:
                        console.log(token.type);
                        throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
                    case 3:
                        throw "Incomplete parameter at" + i + ": \"" + LaTeX.charAt(i) + "\"";
                    default:
                        break;
                }
                if(!inclusive)return clause;
            }
            switch (token.read(LaTeX.charAt(i))) {
                case 1:
                    if(token.value===")"){
                        prenthesesLevel--;
                        if(prenthesesLevel<0) return clause;
                    }
                    if(token.value==="(")
                        prenthesesLevel++;
                    clause.push(token);
                    if (!terminationQueued) {
                        lasttoken = token;
                        readnext(i);
                    }
                    break;
                case 2:
                    throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
                case 3:
                    throw "Incomplete parameter at" + i + ": \"" + LaTeX.charAt(i) + "\"";
                case 4: //Ignore the current character and continue
                    readnext(i);
                    break;
                default:
                    break;
            }
            if(terminationQueued) return clause;
        }
        return clause;
    };

    var exp = [72, sub, 5, add, -3];

    this.tokensToRPN = function (expr = []) {
        var parseStack = [];
        var output = [];
        var rpn = [];
        for (let i in expr) {
            let token = expr[i];
            if (token.type === "number" || token.type === "variable" || token.type === "constant")
                rpn.push(token);
            if (token.type === "function"||token.type === "largeOperator") {
                if (token.subClauses != undefined) {
                    for (let i in token.subClauses) {
                        token.rpnClauses[i] = this.tokensToRPN(token.subClauses[i])[0];
                    }
                }
                if (token.length != 0)
                    parseStack.push(token);
                else rpn.push(token);
            }
            if (token.type === "operator") {
                let lastoperator;
                while ((lastoperator = parseStack[parseStack.length - 1]) != undefined &&
                    (lastoperator.precedence > token.precedence || ((lastoperator.precedence == token.precedence) && !lastoperator.isRightAssociative) &&
                        lastoperator.value != "(")) {
                    rpn.push(parseStack.pop());
                }
                parseStack.push(token);
            }
            if (token.value === "(")
                parseStack.push(token);
            if (token.value === ")") {
                let temp;
                while ((temp = parseStack.pop())!=undefined&&temp.value !== "("){
                    console.log(temp);
                    rpn.push(temp);}
            }
            if (token.value === "=") {
                while (parseStack.length > 0)
                    rpn.push(parseStack.pop());
                output.push(rpn);
                rpn = [];
            }
        }
        while (parseStack.length > 0)
            rpn.push(parseStack.pop());
        output.push(rpn);
        return output;
    };

    this.getRPN = function (LaTeX) {
        return this.tokensToRPN(this.tokenize(LaTeX));
    };

    // console.log(evaluateRPN(parseToRPN(exp)));
}

function NameParser() {
    function Token() {
        /**
         * Token types:
         *  variable
         *  number
         *  seperator
         */
        this.type = "init";
        this.LaTeX = "";
        this.value = "";
        this.parseAndAdd = function (c = 'addedChar') {
            if (c === "\\") {
                this.originalType = this.type;
                this.type = "\\";
                return true;
            }
            switch (this.type) {
                case 'init':
                    switch (getCharType(c)) {
                        case 'letter':
                            this.type = "variable";
                            this.value = c;
                            return true;
                        case 'digit':
                            this.type = "number";
                            this.value = c;
                            return true;
                        case 'symbol':
                            if (c === ',') {
                                this.type = "seperator";
                                this.value = c;
                                return true;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case 'number':
                    switch (getCharType(c)) {
                        case 'digit':
                            this.type = "number";
                            this.value += c;
                            return true;
                        case 'symbol':
                            if (c === ',')
                                this.type = "variable";
                            break;
                        default:
                            break;
                    }
                    break;
                case "variable":
                    switch (c) {
                        case "_":
                            this.type = "var_";
                            return true;
                        default:
                            break;
                    }
                    break;
                case "var_":
                    switch (c) {
                        case "{":
                            this.type = "var_{";
                            return true;
                        case "\\":
                            break;
                        default:
                            if (getCharType(c) === "letter" || getCharType(c) === "digit") {
                                this.type = "}";
                                this.wrapup = () => this.type = "variable";
                                this.value += c;
                                return true;
                            }
                            break;
                    }
                    break;
                case "var_{":
                    if (c === "}") {
                        this.type = "}";
                        this.wrapup = () => this.type = "variable";
                    } else
                        this.value += c;
                    return true;
                case "}":
                    if (c === " ") return true;
                    this.wrapup(c);
                    break;
                case "\\":
                    if (c === " ") {
                        this.type = this.originalType;
                        return true;
                    }
            }
            return false;
        };
        this.read = function (c) {
            if (this.type !== "\\" && c === " ") return true;
            var state;
            if ((state = this.parseAndAdd(c)))
                this.LaTeX += c;
            return state;
        };
    }

    /**
     * 
     * @param {Token} token 
     */
    function isComplete(token) {
        return (token.type !== "init");
    }

    function checkLegal(lastToken, token) {
        return !(lastToken.type === "variable" && token.type === "variable");
    }
    this.tokenize = function (LaTeX = "12, b, c_{2c4}") {
        var lastToken;
        var token;
        var tokens = [];
        for (var i in LaTeX) {
            if (token == undefined)
                token = new Token();
            if (!token.read(LaTeX.charAt(i))) {
                if (isComplete(token) && (lastToken == undefined || checkLegal(lastToken, token))) {
                    lastToken = token;
                    tokens.push(token);
                    token = new Token();
                    if (!token.read(LaTeX.charAt(i)))
                        throw "Unrecognized symbol at " + i + ": \"" + LaTeX.charAt(i) + "\"";
                } else throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
            }
        }
        if (token != undefined) {
            if (!token.read(LaTeX.charAt(i))) {
                if (isComplete(token) && (lastToken == undefined || checkLegal(lastToken, token))) {
                    lastToken = token;
                    tokens.push(token);
                } else throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
            }
        }
        return tokens;
    };

}

function getIdentifier(tokens) {
    var tokenSet = {};
    for (var i in tokens) {
        var token = tokens[i];
        if (token.type === "variable")
            tokenSet[token.value] = true;
    }
    return tokenSet;
}

function tokensToString(tokens) {
    var string = "[";
    for (let i in tokens)
        string += tokens[i].value + ((i != tokens.length - 1) ? ", " : "]");
    return string;
}

function rpnsToString(rpns) {
    var string = "[";
    for (let i in rpns)
        string += tokensToString(rpns[i]) + ((i != rpns.length - 1) ? ", " : "]");
    return string;
}

export {
    Parser,
    NameParser,
    tokensToString,
    rpnsToString,
    getIdentifier
};