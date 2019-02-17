const descPreset = {
    value:true,
    writable:false,
    configurable:false,
    enumerable:false,
}
const symbol = Symbol("__abstract__")

const Abstract = cls => {
    if(cls[symbol]) return cls //すでに抽象クラスである場合、clsをそのまま返す
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
    Object.defineProperty(res, symbol, descPreset)
    return res
}

export default Abstract
