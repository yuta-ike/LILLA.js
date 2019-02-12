//static
const instances = new WeakMap()
const Singleton = cls => {
    if(instances.has(cls)){
        return instances.get(cls)
    }
    const instance = new cls()
    instances.set(cls, instance)
    return instance
}

const isAbstract = Symbol("__isAbstract__")
const Abstract = cls =>{
    if(cls[isAbstract]) return cls //すでに抽象クラスである場合、clsをそのまま返す

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
    res[isAbstract] = true
    return res
}

export {Singleton, Abstract}
