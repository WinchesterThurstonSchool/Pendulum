/*jshint esversion: 6 */

import "./jquery-3.3.1.js";
import {types} from "./environment.js";
import {Parser, tokensToString} from "./parser.js";

var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
var  objectBar = $('#object-bar')[0];

var core;

var setCore = (mainCore)=>core=mainCore;

var names = [];
var nameControls={};
var expControls={};

class NameControl {
    constructor() {
        this.varName = "";
        this.nameContainer=document.body;
        this.nameField=document.body;
        this.type = types[':'];
    }

    updateSize(){
         var expression = this.expControl.expField;
         var expContainer = this.expControl.expContainer;
         var height = Math.max(50, Math.max(expression.offsetHeight, this.nameField.offsetHeight));
         this.nameContainer.style.height = height + 'px';
         expContainer.style.height = height + 'px';
    }

    loadExpControl(ec) {
        this.expControl = ec;
    }
}
class ExpControl {
    constructor() {
        this.varName = "";
        this.expContainer = document.body;
        this.expField = document.body;
        this.type = types[":"];
    }

    updateSize(){
        var name = this.nameControl.nameField;
        var nameContainer = this.nameControl.nameContainer;
        var height = Math.max(50, Math.max(this.expField.offsetHeight, name.offsetHeight));
        nameContainer.style.height = height + 'px';
        this.expContainer.style.height = height + 'px';
    }

    loadNameControl(nc = new NameControl()){
        this.type = nc.type;
        this.nameControl = nc;
    }
}

$('.name').each(function () {
    var nc = new NameControl();
    nc.nameField = this;
    nc.nameContainer = this.parentElement;
    nc.varName = nc.nameContainer.getAttribute("varname");
    names.push(nc.varName);
    nc.type = types[nc.nameContainer.lastElementChild.innerText];
    nameControls[nc.varName] = nc;
    MQ.MathField(this, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
               nc.updateSize();
            }
        }
    });
});

$('.expression').each(function () {
    var ec = new ExpControl();
    ec.expField = this;
    ec.expContainer = this.parentElement;
    ec.varName = ec.expContainer.getAttribute('varname');
    ec.parser = new Parser();
    expControls[ec.varName] = ec;
    ec.mathquill = MQ.MathField(this, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                ec.updateSize();
                console.log(tokensToString(ec.parser.getRPN(ec.mathquill.latex())));
            },
            enter: () =>{
                ec.mathquill.blur();
                expControls[names[(names.indexOf(ec.varName)+1)%names.length]].mathquill.focus();
            }
        }
    });
});

for (let varName in nameControls){
    var nc = nameControls[varName];
    var ec = expControls[varName];
    nc.loadExpControl(ec);
    ec.loadNameControl(nc);
    nc.updateSize();
    ec.updateSize();
}

export{nameControls, expControls, setCore};