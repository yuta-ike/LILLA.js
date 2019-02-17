const descPreset = {
    value:true,
    writable:false,
    configurable:false,
    enumerable:false,
}
const symbol = Symbol("__singleton__")

const instances = new WeakMap()
const Singleton = cls => {
    if(instances.has(cls)){
        return instances.get(cls)
    }
    const instance = new cls()
    Object.defineProperty(instance, symbol, descPreset)
    instances.set(cls, instance)
    return instance
}

export default Singleton
