import "./jquery-3.3.1.js";

var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
var  objectBar = $('#object-bar')[0];
var types = {
    ":":"Variable",
    "":"Function",
    "{":"Object"
};
var nameControls={};
var expControls={};

class NameControl {
    constructor() {
        this.varName = "";
        this.nameContainer=document.body;
        this.nameField=document.body;
        this.type = types[':'];
        this.expControl;
    }

    updateSize(){
         var expression = this.expControl.expField;
         var expContainer = this.expControl.expContainer;
         var height = Math.max(50, Math.max(expression.offsetHeight, this.nameField.offsetHeight));
         this.nameContainer.style.height = height + 'px';
         expContainer.style.height = height + 'px';
    }

    loadExpControl(ec = new ExpControl) {
        this.expControl = ec;
    }
}
class ExpControl {
    constructor() {
        this.varName = "";
        this.expContainer = document.body;
        this.expField = document.body;
        this.type = types[":"];
        this.nameControl;
    }

    updateSize(){
        var name = this.nameControl.nameField;
        var nameContainer = this.nameControl.nameContainer;
        var height = Math.max(50, Math.max(this.expField.offsetHeight, name.offsetHeight));
        nameContainer.style.height = height + 'px';
        this.expContainer.style.height = height + 'px';
    }

    loadNameControl(nc = new NameControl){
        this.type = nc.type;
        this.nameControl = nc;
    }
}

function initializeObjects(objects = {}) {
    objectList = objects;
    for (var key in objectList) {
        if (objectList.hasOwnProperty(key)) { //to be safe
            objectNames.push(key);
        }
    }
}

$('.name').each(function () {
    var nc = new NameControl();
    nc.nameField = this;
    nc.nameContainer = this.parentElement;
    nc.varName = nc.nameContainer.getAttribute("varname");
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
    expControls[ec.varName] = ec;
    MQ.MathField(this, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                ec.updateSize();
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