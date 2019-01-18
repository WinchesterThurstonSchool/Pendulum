
class Operation {
    constructor(operator = () => 0, a=0, b=0) {
        this.operator = operator;
        this.a = a;
        this.b = b;
    }
    compute() {
        return this.operator((this.a instanceof Operation) ? this.a.compute() : this.a,
            (this.b instanceof Operation) ? this.b.compute() : this.b);
    }
}

// 2+3*5-1=16
console.log(new Operation((a, b) => a + b, new Operation((a, b) => a + b, 2, -1), new Operation((a, b) => a * b, 3, 5)).compute());

// [[y,subtract,z,subtract,x,add],add,[[x,square, y, square, z, square],sqrt],divide]