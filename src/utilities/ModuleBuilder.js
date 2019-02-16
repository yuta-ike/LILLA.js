const symbols = {
    singleton: Symbol("__singleton__"),
    abstract: Symbol("__abstract__"),
    struct:Symbol("__stract__"),
}

const instances = new WeakMap()
const Singleton = cls => {
    if(instances.has(cls)){
        return instances.get(cls)
    }
    const instance = new cls()
    instance[symbols.singleton] = true
    instances.set(cls, instance)
    return instance
}

const Abstract = cls =>{
    if(cls[symbols.abstract]) return cls //すでに抽象クラスである場合、clsをそのまま返す

    new cls() //一度インスタンス化する必要がある
    const res = new Proxy(cls, {
        construct: (...args) => {
            const instance = Reflect.construct(...args)
            if(instance.constructor.name === cls.name){
                throw new Error(`${cls.name} is abstract class. Instanciation of abstract class is forbidden`)
            }
            return instance
        }
    })
    res[symbols.abstract] = true
    return res
}

const Struct = cls => {
    const res = new Proxy(cls, {
        construct: (...args) => {
            return Object.seal(Reflect.construct(...args))
        }
    })
    res[symbols.struct] = true
    return res
}

export {Singleton, Abstract, Struct}
//exxport default {Singleton, Abstract, Struct}

// Module(Singleton, Abstract)
// Module(FIGURE).Singleton().Abstract()
