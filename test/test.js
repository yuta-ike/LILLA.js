"use strict"
class B{
    constructor(){
        this.b = "BBB"
    }
}
class A extends B{
    constructor(){
        console.log("constructor")
    }

    create(){
        console.log("create")
        this.x = 1
    }

    show(){
        console.log(this.x, this.b)
    }
}


const a = new A()
a.show()

;
