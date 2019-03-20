// jshint esversion: 6
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
        }
        return false;
    };
    this.read = function (c) {
        if(c===" ")return true;
        var state;
        if ((state = this.parseAndAdd(c)))
            this.LaTeX += c;
        return state;
    };
}
function isComplete(token = new Token()){
    return (token.type!=="init");
}
function checkLegal(lastToken, token){
    return !(lastToken.type==="variable" && token.type==="variable");
}
const tokenize = function (LaTeX = "12, b, c_{2c4}") {
    var lastToken;
    var token;
    var tokens = [];
    for(var i in LaTeX){
        if(token==undefined)
            token = new Token();
        console.log(token);
        if(!token.read(LaTeX.charAt(i))){
            if(isComplete(token)&&(lastToken==undefined||checkLegal(lastToken, token))){
                lastToken = token;
                tokens.push(token);
                token = new Token();
                if(!token.read(LaTeX.charAt(i)))
                    throw "Unrecognized symbol at " + i + ": \"" + LaTeX.charAt(i) + "\"";
            } else throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
        }
    }
    if(token != undefined){
        if (!token.read(LaTeX.charAt(i))) {
            if (isComplete(token) && (lastToken == undefined || checkLegal(lastToken, token))) {
                lastToken = token;
                tokens.push(token);
            } else throw "Illegal syntax at " + i + ": \"" + LaTeX.charAt(i) + "\"";
        }
    }
    return tokens;
};

function getIndentifier(tokens){
    var tokenSet = {};
    for(var i in tokens){
        var token = tokens[i];
        if(token.type==="variable")
            tokenSet[token.value]=true;
    }
    return tokenSet;
}

function tokensToString(tokens) {
    var string = "[";
    for (let i in tokens)
        string += tokens[i].value + ((i != tokens.length - 1) ? ", " : "]");
    return string;
}

console.log(getIndentifier(tokenize("")));