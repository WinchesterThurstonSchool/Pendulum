/**
 * The preparse step is now called tokenization,
 * it parses LaTeX into tokens
 */

/*jshint esversion: 6 */

//Set Functions
const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const negate = (a) => -a;
const mul = (a, b) => a * b;
const div = (a, b) => a / b;
const pow = (a) => Math.pow(a);
const log = (a) => Math.log(a);
const sin = (a) => Math.sin(a);
const cos = (a) => Math.cos(a);
const assign = (a, b) => a.setValue(b);

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
/**Command dictionary:
 *  Command specifier: [{function} token, {number} precedence, {boolean} is right associative, ({number} argument count if not 2)]
 */
const commands = {
    '+': [add, 1, false],
    '-': [sub, 1, false],
    '*': [mul, 2, false],
    '/': [div, 2, false],
    '^': [pow, 3, true],
    '\\': {
        's': {
            'i': {
                'n': [sin, 2.5, true, 1]
            },
            'u': {
                'm': "sum"
            }
        },
        'c': {
            'd': {
                'o': {
                    't': [mul, 2, false]
                }
            },
            'o': {
                's': [cos, 2.5, true, 1]
            }
        },
        'f': {
            'r': {
                'a': {
                    'c': [div, 2, false]
                }
            }
        },
        'd': {
            'i': {
                'v': [div, 2, false]
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
    else if (code <= zcode && code >= acode)
        return "letter";
}

/**
 * Checks whether the given type is a compelete type
 * @param {String} type 
 */
function isCompleteType(type = "initial") {
    return ["variable", "text", "number", "function", "operand"].indexOf(type) != -1;
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
     * operand
     */
    this.type = "init";
    var isFirst = lastvalue === "(" || lastvalue === "=" || lastvalue === "," || lastvalue === ":";
    this.LaTeX = "";
    this.value = "";
    this.numberdotcount = 0;
    //length conveys the number of parameters for a function
    //Default is 0 for none functions and two for functions
    this.length = 2;
    this.parseAndAdd = function (c = 'added char') {
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
                                this.type = "function";
                                this.precedence = 1;
                                this.value = isFirst ? (x) => x : add;
                                return true;
                            case '-':
                                this.type = "function";
                                this.precedence = 1;
                                this.value = isFirst ? negate : sub;
                                return true;
                            case '*':
                                this.type = "function";
                                this.precedence = 2;
                                this.value = mul;
                                return true;
                            case '/':
                                this.type = "function";
                                this.precedence = 2;
                                this.value = div;
                                return true;
                            case '{':
                                this.type = "operand";
                                this.value = "(";
                                return true;
                            case '}':
                                this.type = "operand";
                                this.value = ")";
                                return true;
                            case '(':
                                this.type = "operand";
                                this.value = "(";
                                return true;
                            case ')':
                                this.type = "operand";
                                this.value = ")";
                                return true;
                            case '=':
                                this.type = "function";
                                this.value = assign;
                                this.precedence=0;
                                return true;
                            case '\\':
                                this.type = "command";
                                this.scheme = commands["\\"];
                                return true;
                            case ' ':
                                return true;
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
                this.type = "operand";
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
                        if (getCharType(c) === "letter") {
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
                        this.value = newscheme[0];
                        this.precedence = newscheme[1];
                        if(newscheme.length>2)this.isRightAssociative = newscheme[2];
                        if(newscheme.length>3)this.length = newscheme[3];
                        this.type = "}";
                        this.wrapup = ()=>this.type="function";
                    } else this.scheme = newscheme;
                    return true;
                }
                break;
            case "}":
                this.wrapup();
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
                if (this.type != "function") this.length = 0;
                if (lasttoken != undefined && this.type === "variable" && (lasttoken.type === "variable" || lasttoken.type === "number")) {
                    let multiply = new Token(lasttoken);
                    multiply.value = mul;
                    multiply.type = "function";
                    multiply.LaTeX = "";
                    multiply.precedence = 2;
                    tokens.push(multiply);
                }
                return 1;
            } else return 2;
        }
    };
}

function tokenize(LaTeX = "22+.4+2.3-76+23-23+.5") {
    var tokens = [];
    var token;
    for (let i in LaTeX) {
        if (token == null) 
            token = new Token(tokens);
        switch (token.read(LaTeX.charAt(i))) {
            case 1:
                console.log("initializing new token at: " + LaTeX.charAt(i));
                tokens.push(token);
                var lasttoken = token;
                token = new Token(tokens, lasttoken);
                var state = token.read(LaTeX.charAt(i));
                if (state == 3)
                    state = token.read(LaTeX.charAt(i));
                if (state != 0)
                    throw "Unrecognized symbol at " + i + ": \"" + LaTeX.charAt(i) + "\"";
                break;
            case 2:
                throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
            default:
                break;
        }
    }
    token.read(";");
    tokens.push(token);
    return tokens;
}

function tokensToString(tokens) {
    var string = "[";
    for (let i in tokens)
        string += tokens[i].value + ((i != tokens.length - 1) ? ", " : "]");
    return string;
}

var expression = "z=\\sin x+\\cos y";
console.log(expression);
// console.log(tokensToString(tokenize(expression)));
