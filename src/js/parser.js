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
 *  Command specifier: [{string} type, {function} value, (type==="operator")?{number} precedence:{number} argument count, {boolean} is right associative]
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
                    'c': ["function", div, 2]
                }
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
                'm': "sum"
            },
            'q': {
                'r': {
                    't': ["function", sqrt, 1]
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
    else if (isSymbol(code))
        return "symbol";
    else if ((code <= zcode && code >= acode) || (code <= Zcode && code >= Acode))
        return "letter";
}

/**
 * Checks whether the given type is a compelete type
 * @param {String} type 
 */
function isCompleteType(type = "initial") {
    return ["variable", "text", "number", "function", "operator", "structure"].indexOf(type) != -1;
}

function Parser() {
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
         */
        this.type = "init";
        var isFirst = lastvalue === "(" || lastvalue === "=" || lastvalue === "," || lastvalue === ":";
        this.LaTeX = "";
        this.value = "";
        this.numberdotcount = 0;
        //length conveys the number of parameters for a function
        //Default is 0 for none functions and two otherwise
        this.length = 0;
        //is right associative determines whether the function is right associative
        this.isRightAssociative = false;
        this.parseAndAdd = function (c = 'added char') {
            var code = c.charCodeAt(0);
            switch (this.type) {
                case "init":
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
                                case '\\':
                                    this.type = "command";
                                    this.scheme = commands["\\"];
                                    return true;
                                case ' ':
                                    return true;
                                case ';':
                                    this.type = "structure";
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
                            } else if (newscheme[0] === "function") {
                                this.length = newscheme[2];
                                this.precedence = 1.5;
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
                    if (lasttoken != undefined && (lasttoken.type === "variable" || lasttoken.type === "number" || lasttoken.value === ")") &&
                        (this.type === "variable" || this.type === "function" || (this.value === "(" && !(clCounts[pl] != 0)))) {
                        let multiply = new Token(lasttoken);
                        multiply.value = mul;
                        multiply.type = "operator";
                        multiply.LaTeX = "";
                        multiply.precedence = 2;
                        tokens.push(multiply);
                    }
                    if (this.value === "(") {
                        if (lasttoken != undefined && lasttoken.type === "function") {
                            lasttoken.precedence = 4;
                            clCounts[pl++] = lasttoken.length;
                        } else {
                            if (!(clCounts[pl++] > 0)) //If the next parentheses level doesn't exhibit an ongoing clause collection
                                clCounts[pl - 1] = 1;
                        }
                    }
                    if (this.value === ")") {
                        pl--; //Reduce the current parentheses level by 1
                        if ((--clCounts[pl] == 0) && (clCounts[pl + 1] > 0)) //If the current clause is closed with the deeper clause incomplete
                            clCounts[pl + 1] = 0;
                    }
                    if (this.value === " ") return 4;
                    return 1;
                } else return 2;
            }
        };
    }

    this.tokenize = function (LaTeX = "22+.4+2.3-76+23-23+.5") {
        var tokens = [];
        var token;
        var lasttoken;

        function readnext(i) {
            token = new Token(tokens, lasttoken);
            var state = token.read(LaTeX.charAt(i));
            if (state == 3)
                state = token.read(LaTeX.charAt(i));
            if (state != 0)
                throw "Unrecognized symbol at " + i + ": \"" + LaTeX.charAt(i) + "\"";
        }
        for (let i in LaTeX) {
            if (token == null)
                token = new Token(tokens);
            switch (token.read(LaTeX.charAt(i))) {
                case 1:
                    tokens.push(token);
                    lasttoken = token;
                    readnext(i);
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
        }
        if (token != undefined) {
            token.read(";");
            tokens.push(token);
        }
        return tokens;
    }


    var exp = [72, sub, 5, add, -3];
    var parseStack = [];

    this.tokensToRPN = function (expr = [new Token()]) {
        var output = [];
        var rpn = [];
        var functionlength = 0;
        for (let i in expr) {
            let token = expr[i];
            if (token.type === "number" || token.type === "variable")
                rpn.push(token);
            if (token.type === "function") {
                functionlength = token.length;
                parseStack.push(token);
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
                while ((temp = parseStack.pop()).value !== "(")
                    rpn.push(temp);
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
    var stack = [];

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
                    if(c === " ") {
                        this.type = this.originalType;
                        return true;
                    }
            }
            return false;
        };
        this.read = function (c) {
            if (this.type!=="\\"&&c === " ") return true;
            var state;
            if ((state = this.parseAndAdd(c)))
                this.LaTeX += c;
            return state;
        };
    }

    function isComplete(token = new Token()) {
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