import mix from "./utilities/Mixin.js"
import Interface, {InterfaceAcceptable} from "./utilities/Interface.js"
import * as Module from "./utilities/ModuleBuilder.js"

class EventDispatcher{
    constructor(){
        this._events = new Map()
    }

    addEventListener(type, callback, {once = false} = {}){
        if(!this._events.has(type)){
            this._events.set(type,[])
        }
        this._events.get(type).push({callback, once})
    }

    dispatchEvent(type, args){
        const events = this._events.get(type) || []
        events.forEach(info => {
            info.callback(args)
            if(info.once){
                this._events.delete(info)
            }
        })
    }

    getAllEvents(type = null){
        return type != null ? this._events: this._events.get(type)
    }
}

class CoroutineDispatcher{
    constructor(){
        this._coroutines = new Map()
    }

    addCoroutine(generator, type){
        if(!this._coroutines.has(type)){
            this._coroutines.set(type,[])
        }
        this._coroutines.get(type).push(generator)
    }

    dispatchCoroutine(type){
        const generators = this._coroutines.get(type) || []
        generators.forEach(generator => generator.next())
    }
}


export default Module.Abstract(
    class RootClass extends mix(InterfaceAcceptable, EventDispatcher, CoroutineDispatcher){
        constructor(){
            super()
            this._coroutines = new Map()
        }
        log(...strs){
            const str = strs.reduce((acc,c) => `${acc}, ${c}`)
            console.log(`${this.getNameForLog(this)} : ${this.name} : ${str}`)
        }
        getNameForLog(instanceOrClass){
            return (typeof instanceOrClass) === "object" ? instanceOrClass.constructor.name : instanceOrClass.name
        }
    }
)
