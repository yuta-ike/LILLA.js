import Singleton from "./Modules/Singleton.js"
import Abstract from "./Modules/Abstract.js"
import Struct from "./Modules/Struct.js"
import Tuple from "./Modules/Tuple.js"
import Chainnable from "./Modules/Chainnable.js"

/*
Struct: 値の追加、削除、属性変更を禁止 copyメソッド
Tuple: 値の変更まで禁止 copyメソッド
*/

const Module = cls => new ModuleData(cls)

Object.assign(Module, {Singleton, Abstract, Struct, Tuple, Chainnable})

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
    Chainnable(){
        this.cls = Module.Chainnable(this.cls)
        return this
    }

    Build(){
        const res = new Proxy(this.cls, this.handlers)
        return res
    }
}
export default Module
