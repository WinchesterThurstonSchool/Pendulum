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
var defControls = {};

var autoIndex = 1;

class NameControl {
    constructor() {
        this.varName = "";
        this.nameContainer = document.body;
        this.nameField = document.body;
        this.type = types[':'];
    }

    updateSize() {
        var definition = this.defControl.defField;
        var defContainer = this.defControl.defContainer;
        if (definition.offsetHeight > this.nameField.offsetHeight)
            this.nameContainer.style.height = definition.offsetHeight + 'px';
        else defContainer.style.height = this.nameField.offsetHeight + 'px';
    }

    loadExpControl(ec) {
        this.defControl = ec;
    }
}
class ExpControl {
    constructor() {
        this.varName = "";
        this.defContainer = document.body;
        this.defField = document.body;
        this.type = types[":"];
    }

    updateSize() {
        var name = this.nameControl.nameField;
        var nameContainer = this.nameControl.nameContainer;
        if (this.defField.offsetHeight > name.offsetHeight)
            nameContainer.style.height = this.defField.offsetHeight + 'px';
        else this.defContainer.style.height = name.offsetHeight + 'px';
    }

    loadNameControl(nc = new NameControl()) {
        this.type = nc.type;
        this.nameControl = nc;
    }
}

$('.name').each(function () {
    var container = this.parentElement;
    var name = container.getAttribute('varname');
    var nc = initiateNameControl(name, container, this);
    nameControls[name]=nc;
});

$('.expression').each(function () {
    var container = this.parentElement;
    var name = container.getAttribute('varname');
    var ec = initiateExpControl(name, container, this);
    defControls[name]=ec;
    autoIndex++;
});

for (let varName in nameControls) {
    var nc = nameControls[varName];
    var ec = defControls[varName];
    nc.loadExpControl(ec);
    ec.loadNameControl(nc);
    nc.updateSize();
    ec.updateSize();
}

function addNameField(name = undefined) {
    if (name == undefined) name = autoIndex;
    var html = $.parseHTML(`<div class="name-container" varname="${name}"><div class="name">${name}</div><div class="type">:</div></div>`);
    $('#object-bar').append(html);
    var nc = initiateNameControl(name, html[0], html[0].children[0]);
    nameControls[nc.varName] = nc;
}

function addExpField(name = undefined) {
    if (name == undefined) name = autoIndex;
    var html = $.parseHTML(`<div class=\"expression-container\" varname=\"${name} \"> <span class = \"expression\"></span> </div>`);
    $('#mathpanel').append(html);
    var ec = initiateExpControl(name, html[0], html[0].children[0]);
    defControls[name]=ec;
    autoIndex++;
}

function focusNext(name){
    defControls[names[(names.indexOf(name) + 1) % names.length]].mathquill.focus();
}

function focusLast(name){
    defControls[names[(names.indexOf(name) + names.length-1) % names.length]].mathquill.focus();
}

function removeNameField(name = "") {
    var nc = nameControls[name];
    var html = nc.nameContainer;
    html.parentNode.removeChild(html);
}

function removeExpField(name = ""){
    var ec = defControls[name];
    var html = ec.defContainer;
    html.parentNode.removeChild(html);
    autoIndex--;
}

function appendDefinition(name = undefined) {
    addNameField(name);
    addExpField(name);
    nameControls[name].loadExpControl(defControls[name]);
    defControls[name].loadNameControl(nameControls[name]);
}

function removeDefinition(name = ""){
    var index = -1;
    if((index=names.indexOf(name))!=-1){
        removeNameField(name);
        nameControls[name]=undefined;
        removeExpField(name);
        defControls[name]=undefined;
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
    var nc = initiateNameControl(name, html[0], html[0].children[0]);
    nameControls[nc.varName] = nc;
}

function insertExpField(previous = "", name = undefined) {
    var index = -1;
    if ((index = names.indexOf(previous)) == -1) return index;
    if (name == undefined) name = index + 2;
    var html = $.parseHTML(`<div class=\"expression-container\" varname=\"${name} \"> <span class = \"expression\"></span> </div>`);
    var previousContainer = defControls[previous].defContainer;
    previousContainer.parentNode.insertBefore(html[0], previousContainer.nextSibling);
    var ec = initiateExpControl(name, html[0],html[0].children[0]);
    defControls[ec.varName] = ec;
    autoIndex++;
    return name;
}

function initiateNameControl(name, container, field){
    var nc = new NameControl();
    nc.nameContainer = container;
    nc.nameField = field;
    nc.varName = name;
    names.push(nc.varName);
    nc.type = types[nc.nameContainer.lastElementChild.innerText];
    MQ.MathField(nc.nameField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                nc.updateSize();
                core.resizeGraphics();
            }
        }
    });
    return nc;
}

function initiateExpControl(name,container, field){
    var ec = new ExpControl();
    ec.defContainer = container;
    ec.defField = field;
    ec.varName = name;
    ec.parser = new Parser();
    ec.mathquill = MQ.MathField(ec.defField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                ec.updateSize();
                core.resizeGraphics();
                console.log((rpnsToString(ec.parser.getRPN(ec.mathquill.latex()))));
                var rpns=ec.parser.getRPN(ec.mathquill.latex());
                core.loadRPNFor(name, rpns);
            },
            enter: () => {
                ec.mathquill.blur();
                focusNext(ec.varName);
            }
        }
    });
    return ec;
}

function insertDefinition(previous="",name = undefined){
    name = insertNameField(previous, name);
    name = insertExpField(previous, name);
    nameControls[name].loadExpControl(defControls[name]);
    defControls[name].loadNameControl(nameControls[name]);
}

export {
    nameControls,
    defControls,
    setCore
};