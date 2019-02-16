import * as Module from "./utilities/ModuleBuilder.js"
import GameObject, {instanceofGameObject} from "./GameObject.js"
import RigidObject from "./RigidObject.js"
export * from "./GameObject.js"
export * from "./RigidObject.js"

const _OBJECT = new class GameObjectManager{
    constructor(){
        this.gameObjectClasses = new Map()
        this.init()
    }

    init(){
        //GameObjectとRigidObjectのDefine
        this.gameObjectClasses.set(GameObject.name, GameObject)
        this._addProperty(GameObject)
        this.gameObjectClasses.set(RigidObject.name, RigidObject)
        this._addProperty(RigidObject)
    }

    Define(cls, name = cls.name){
        if(!GameObject.isPrototypeOf(cls))
            throw new Error(`Only class extends GameObject can be registered. (class: ${cls})`)
        if(Object.values(this.gameObjectClasses).includes(cls))
            throw new Error(`Class has already existed. (className: ${name})`)
        if(this.gameObjectClasses.has(name))
            throw new Error(`Class name has already used. (class: ${cls})`)

        this.gameObjectClasses.set(name, cls)
        this._addProperty(cls)
    }

    _addProperty(cls){
        Object.defineProperty(this, cls.name, {
            value        : Module.Abstract(cls),
            writable     : false,
            enumerable   : true,
            configurable : false,
        })
    }

    Create({clsName, args}){
        if(this[clsName] == null) throw new Error(`Argument of Object.Create must have name property. (className: ${clsName})`)
        if(!this.gameObjectClasses.has(clsName)) throw new Error(`Such name of class do not exist. (className: ${clsName})`)
        const cls = this.gameObjectClasses.get(clsName)
        return new cls(...(args || []))
    }
}

const OBJECT = new Proxy(_OBJECT, {
    get: (target, prop) => {
        if(target[prop] == null) throw new Error(`Such property does not exist. (property: ${prop})`)
        return target[prop]
    }
})

export default OBJECT

/*
OBJECT.Create({
    of: CLASS.obj1,
    name:
    tag:
})
OBJECT.Define({
    inherits: CLASS.GameObject,
    main: class{}
})
*/
