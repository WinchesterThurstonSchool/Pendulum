import * as O from './operators.js';

var types = {
    ":": "Variable",
    "": "Function",
    "{": "Object"
};

function Environment(core){
    class Operation {
        constructor(operator= ()=>0, a, b){
            this.operator = operator;
            this.a = a;
            this.b = b;
        }
        compute(){
            return this.operator((this.a instanceof Operation)?this.a.compute:this.a,
                (this.b instanceof Operation) ? this.b.compute: this.b);
        }
    }
    class Variable {
        constructor() {
            this.isVisualized = false;
            this.tex = ""
            this.val = {};
            this.type = types["{"];
            this.parent = this;
            //The variables that this depends on
            this.dependencies = [];
            //Other variables whose values dependent on this
            this.proprietors = [];
        }
        update() {

        }
        pulse(){
            update();
            for(i in  this.dependencies){
                
            }
        }
        applyToAll(action=(self)=>self.update){
            if(this.type == "Object"){
                for(name in this.val)this.val[name].applyToAll(action);
            }
            action(this);
        }
        parse(tex = ""){
            var val = [];
            if(tex.includes('+')){
                
            }
        }
    }
    
    var pi = new Variable();
    pi.tex = "\pi";
}

export {
    types,
    Environment
}