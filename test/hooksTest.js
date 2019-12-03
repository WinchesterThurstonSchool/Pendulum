describe("Hooks", function(){
    this.beforeEach(function(){
        console.log("before each performed");
    });
    this.afterEach(function(){
        console.log("after each performed");
    });
    this.beforeAll(function(){
        console.log("before all");
    });
    this.afterAll(function(){
        console.log("after all");
    });
    it("run test", function(){
        console.log("in test");
    });
});