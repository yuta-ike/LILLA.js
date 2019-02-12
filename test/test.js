"use strict"
const symbols = {
    singleton: Symbol("__singleton__"),
    abstract: Symbol("__abstract__"),
    struct:Symbol("__stract__"),
}

class A{
    constructor(){
        this.x = 1
    }
}

const _A = new Proxy(A, {
    construct: (...args) => {
        return Object.seal(Reflect.construct(...args))
    }
})

console.log(_A[symbols.struct]())
const a = new _A()
console.log(a)

;
