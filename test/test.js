"use strict"

const m = new Map()
m.set("x",1)
m.set("greet", "hello")
const x = Array.from(m.entries()).reduce((acc, [k,v]) => {console.log(acc,v);acc.push(v);return acc}, [])
console.log(x)

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
