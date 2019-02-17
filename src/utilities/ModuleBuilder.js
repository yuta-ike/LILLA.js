import Singleton from "./Modules/Singleton.js"
import Abstract from "./Modules/Abstract.js"
import Struct from "./Modules/Struct.js"
import Tuple from "./Modules/Tuple.js"

/*
Struct: 値の追加、削除、属性変更を禁止 copyメソッド
Tuple: 値の変更まで禁止 copyメソッド
*/

const Module = cls => {
    return new ModuleData(cls, {
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
}

Object.assign(Module, {Singleton, Abstract, Struct, Tuple})

const ModuleData = class {
    constructor(cls, handlers = {}){
        this.cls = cls
        this.handlers = handlers
        this.properties = []
    }
    _addHandler(newHandler){
        Object.assign(this.handlers, newHandler)
    }

    Abstract(){
        this.cls = Module.Abstract(this.cls)
        return this
    }
    Struct(){
        this.cls = Module.Struct(this.cls)
        return this
    }

    Build(){
        const res = new Proxy(this.cls, this.handlers)
        return res
    }
}

export default Module
