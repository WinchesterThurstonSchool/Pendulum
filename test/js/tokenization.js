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
const pow = (a, b) => Math.pow(a, b);
const log = (a, b) => Math.log(a, b);
const sin = (a, b) => Math.sin(a, b);
const cos = (a, b) => Math.cos(a, b);
const assign = (a, b) => a.setValue(b);

//Parsing constants
const zerocode = '0'.charCodeAt(0);
const ninecode = '9'.charCodeAt(0);
const slashcode = '\\'.charCodeAt(0);
const dotcode = '.'.charCodeAt(0);
const isSymbol = (code = 0) => {
    return (code <= 63 && code >= 58) || (code <= 47 && code >= 33);
};
const acode = 'a'.charCodeAt(0);
const zcode = 'z'.charCodeAt(0);
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
                    'c': div
                }
            }
        },
        'd': {
            'i': {
                'v': div
            }
        }
    }
};

/**
 * Check and returns the type of the given character
 * @param {String} c The character
 * @returns {String} type can be one of digit, symbol, letter or '.'
 */
function getCharType(c = 'added char') {
    var code = c.charCodeAt(0);
    if (code <= ninecode && code >= zerocode) {
        return "digit";
    } else if (c === '.')
        return ".";
    else if (isSymbol(code))
        return "symbol";
}

/**
 * Checks whether the given type is a compelete type
 * @param {String} type 
 */
function isCompleteType(type = "initial") {
    return ["variable", "text", "number", "function"].indexOf(type) != -1;
}

/**
 * 
 * @param {Boolean} isFirst indicates if the cursor is at the begining of a LaTeX clause
 */
function Token(isFirst = false) {
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
     */
    this.type = "init";
    this.LaTeX = "";
    this.value = "";
    this.precedence = 0;
    this.numberdotcount = 0;
    this.scheme = undefined;
    this.parseAndAdd = function (c = 'added char') {
        var code = c.charCodeAt(0);
        switch (commands['\\']) {
            case commands['\\']:
                break;

        }
        switch (this.type) {
            case "init":
                switch (getCharType(c)) {
                    case "digit":
                        this.type = "number";
                        this.value += c;
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
                            case '\\':
                                this.type = "command";
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
            default:
                return false;
        }
    };
    this.read = function (c = 'added char') {
        if (this.parseAndAdd(c)) {
            this.LaTeX += c;
            return 0;
        } else {
            if (isCompleteType(this.type)) {
                return 1;
            } else return 2;
        }
    };
}

function tokenize(LaTeX = "22+.4+2.3-76+23-23+.5") {
    var tokens = [];
    var token;
    for (let i in LaTeX) {
        if (token == null) {
            token = new Token(true);
        }
        switch (token.read(LaTeX.charAt(i))) {
            case 1:
                console.log("initializing new token at: " + LaTeX.charAt(i));
                tokens.push(token);
                lasttoken = token;
                token = new Token(lasttoken.value === "(" || lasttoken.value === "=" || lasttoken.value === ",");
                if (token.read(LaTeX.charAt(i)) != 0)
                    throw "Unrecognized symbol at " + i + ": \"" + LaTeX.charAt(i) + "\"";
                break;
            case 2:
                throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
            default:
                break;
        }


    }

    tokens.push(token);
    return tokens;
}

function tokensToString(tokens) {
    var string = "[";
    for (let i in tokens)
        string += tokens[i].value + ((i != tokens.length - 1) ? ", " : "]");
    return string;
}

console.log(tokenize("-.5+7-6.23-25"));