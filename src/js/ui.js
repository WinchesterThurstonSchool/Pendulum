import "./jquery-3.3.1.js";

var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
var objectNames = [];
var objectList = {};
var propertyNameElements = {},
    expressionElements = {};

function initializeObjects(objects={}){
    objectList = objects;
    for (var key in objectList) {
        if (objectList.hasOwnProperty(key)) { //to be safe
            objectNames.push(key);
        }
    }
}

$('.name').each(function () {
    var property = this.parentElement;
    propertyNameElements[property.getAttribute('varname')]=property;
    MQ.MathField(this, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                var expression = expressionElements[property.getAttribute('varname')];
                expression.style.height = Math.max(property.offsetHeight, expression.offsetHeight)+"px";
            }
        }
    });
});
$('.expression').each(function () {
    var expressionContainer = this.parentElement;
    expressionElements[expressionContainer.getAttribute('varname')] = expressionContainer;
    MQ.MathField(this, {
        autoSubscriptNumerals: true,
        handlers: {
            edit:()=>{
                var propertyName = propertyNameElements[expressionContainer.getAttribute('varname')];
                propertyName.style.height = Math.max(expressionContainer.offsetHeight, propertyName.offsetHeight)+"px";
            }
        }
    });
});

function insertVariable(objectParent, varName, varVal){
    
}

function insertObject(parentElement = $('#object-bar')[0], names=[], values){
    
}


