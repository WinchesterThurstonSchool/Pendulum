/* jshint node: true */
/*  jshint esversion: 6 */
"use strict";

class Animal {
    showQuality() {
        console.log(this.dynamicProperty);
        return this;
    }
    showSpecies(){
        console.log(this.staticProperty);
    }
    static showSpecies() {
        console.log(this.staticProperty);
        return this;
    }
}

Animal.staticProperty="moves";
Animal.prototype.dynamicProperty="mammal";

let obj = new Animal();
obj.showQuality();
obj.dynamicProperty="doesn't move";
obj.showQuality();
obj.showSpecies();

Animal.showSpecies();
obj.staticProperty = "can I change static property?";
obj.showSpecies();
Animal.showSpecies();