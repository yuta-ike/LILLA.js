"use strict"

class A{
    constructor(x){
        this.x = x
    }
    test(){
    }
    getX(){
      return this.x
    }
}
const a = new Proxy(new A(1), {
    get: (target, property, receiver) => {
        const value = Reflect.get(target, property, receiver)
        if(value instanceof Function){
            return (...args) => {
                const res = value.call(target, ...args)
                return res !== undefined ? res : receiver
            }
        }else{
            return value
        }
    }
})
console.log(a.test())


console.log("=================")

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
