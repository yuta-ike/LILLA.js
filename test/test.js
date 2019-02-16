"use strict"

class Parent{
    constructor(x){
        this.x = x
    }
}

class _Game extends Function{
    constructor(){
        super()
        let instance
        return new Proxy(this, {
            apply: (_,__,...args) => instance = new Game(...(args[0]))
        })
    }
}
class Game extends Parent{
    constructor(x,y){
        super(x)
        this.y = y
    }

    show(){
        console.log(this.x, this.y)
    }
}

const _g = new _Game()
const g = _g(1,2)
g.show()
