class Parent{

}
class Child extends Parent{

}
class A{
    a:Parent = new Parent();
    func(){
        console.log(this.a);
    }
}

class B extends A{
    a:Child = new Child();
    func(){
        super.func();
    }
}

new B().func();