/*jshint esversion: 6 */

import "./jquery-3.3.1.js";
import {
    types
} from "./environment.js";
import {
    Parser,
    tokensToString,
    rpnsToString
} from "./parser.js";

var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
var objectBar = $('#object-bar')[0];

var core;

var setCore = (mainCore) => core = mainCore;

var names = [];
var nameControls = {};
var expControls = {};

var autoIndex = 1;

class NameControl {
    constructor() {
        this.varName = "";
        this.nameContainer = document.body;
        this.nameField = document.body;
        this.type = types[':'];
    }

    updateSize() {
        var expression = this.expControl.expField;
        var expContainer = this.expControl.expContainer;
        if (expression.offsetHeight > this.nameField.offsetHeight)
            this.nameContainer.style.height = expression.offsetHeight + 'px';
        else expContainer.style.height = this.nameField.offsetHeight + 'px';
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

    updateSize() {
        var name = this.nameControl.nameField;
        var nameContainer = this.nameControl.nameContainer;
        if (this.expField.offsetHeight > name.offsetHeight)
            nameContainer.style.height = this.expField.offsetHeight + 'px';
        else this.expContainer.style.height = name.offsetHeight + 'px';
    }

    loadNameControl(nc = new NameControl()) {
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
                console.log((rpnsToString(ec.parser.getRPN(ec.mathquill.latex()))));
            },
            enter: () => {
                ec.mathquill.blur();
                focusLast(ec.varName);
            }
        }
    });
    autoIndex++;
});

for (let varName in nameControls) {
    var nc = nameControls[varName];
    var ec = expControls[varName];
    nc.loadExpControl(ec);
    ec.loadNameControl(nc);
    nc.updateSize();
    ec.updateSize();
}

function addNameField(name = undefined) {
    if (name == undefined) name = autoIndex;
    var html = $.parseHTML(`<div class="name-container" varname="${name}"><div class="name">${name}</div><div class="type">:</div></div>`);
    $('#object-bar').append(html);
    var nc = new NameControl();
    nc.nameField = html[0].children[0];
    nc.nameContainer = html[0];
    nc.varName = nc.nameContainer.getAttribute("varname");
    names.push(nc.varName);
    nc.type = types[nc.nameContainer.lastElementChild.innerText];
    nameControls[nc.varName] = nc;
    MQ.MathField(nc.nameField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                nc.updateSize();
            }
        }
    });
}

function addExpField(name = undefined) {
    if (name == undefined) name = autoIndex;
    var html = $.parseHTML(`<div class=\"expression-container\" varname=\"${name} \"> <span class = \"expression\"></span> </div>`);
    $('#mathpanel').append(html);
    var ec = new ExpControl();
    ec.expField = html[0].children[0];
    ec.expContainer = html[0];
    ec.varName = ec.expContainer.getAttribute('varname');
    ec.parser = new Parser();
    expControls[ec.varName] = ec;
    ec.mathquill = MQ.MathField(ec.expField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                ec.updateSize();
                console.log((rpnsToString(ec.parser.getRPN(ec.mathquill.latex()))));
            },
            enter: () => {
                ec.mathquill.blur();
                focusNext(ec.varName);
            }
        }
    });
    autoIndex++;
}

function focusNext(name){
    expControls[names[(names.indexOf(name) + 1) % names.length]].mathquill.focus();
}

function focusLast(name){
    expControls[names[(names.indexOf(name) + names.length-1) % names.length]].mathquill.focus();
}

function removeNameField(name = "") {
    var nc = nameControls[name];
    var html = nc.nameContainer;
    html.parentNode.removeChild(html);
}

function removeExpField(name = ""){
    var ec = expControls[name];
    var html = ec.expContainer;
    html.parentNode.removeChild(html);
    autoIndex--;
}

function appendExpression(name = undefined) {
    addNameField(name);
    addExpField(name);
    nameControls[name].loadExpControl(expControls[name]);
    expControls[name].loadNameControl(nameControls[name]);
}

function removeExpression(name = ""){
    var index = -1;
    if((index=names.indexOf(name))!=-1){
        removeNameField(name);
        nameControls[name]=undefined;
        removeExpField(name);
        expControls[name]=undefined;
        names.splice(index, 1);
    }
    return index;
}

function insertNameField(previous="",name = undefined){
    var index = -1;
    if((index=names.indexOf(previous))==-1) return index;
    if (name == undefined) name = index+2;
    var html = $.parseHTML(`<div class="name-container" varname="${name}"><div class="name">${name}</div><div class="type">:</div></div>`);
    var previousContainer = nameControls[previous].nameContainer;
    previousContainer.parentNode.insertBefore(html[0], previousContainer.nextSibling);
    var nc = new NameControl();
    nc.nameField = html[0].children[0];
    nc.nameContainer = html[0];
    nc.varName = name;
    names.push(nc.varName);
    nc.type = types[nc.nameContainer.lastElementChild.innerText];
    nameControls[nc.varName] = nc;
    MQ.MathField(nc.nameField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                nc.updateSize();
            }
        }
    });
}

function insertExpField(previous = "", name = undefined) {
    var index = -1;
    if ((index = names.indexOf(previous)) == -1) return index;
    if (name == undefined) name = index + 2;
    var html = $.parseHTML(`<div class=\"expression-container\" varname=\"${name} \"> <span class = \"expression\"></span> </div>`);
    var previousContainer = expControls[previous].expContainer;
    previousContainer.parentNode.insertBefore(html[0], previousContainer.nextSibling);
    var ec = new ExpControl();
    ec.expField = html[0].children[0];
    ec.expContainer = html[0];
    ec.varName = name;
    ec.parser = new Parser();
    expControls[ec.varName] = ec;
    ec.mathquill = MQ.MathField(ec.expField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                ec.updateSize();
                console.log((rpnsToString(ec.parser.getRPN(ec.mathquill.latex()))));
            },
            enter: () => {
                ec.mathquill.blur();
                focusNext(ec.varName);
            }
        }
    });
    autoIndex++;
    return name;
}

function insertExpression(previous="",name = undefined){
    name = insertNameField(previous, name);
    name = insertExpField(previous, name);
    nameControls[name].loadExpControl(expControls[name]);
    expControls[name].loadNameControl(nameControls[name]);
}

export {
    nameControls,
    expControls,
    setCore
};