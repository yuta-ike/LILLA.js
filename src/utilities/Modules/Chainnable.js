const descPreset = {
    value:true,
    writable:false,
    configurable:false,
    enumerable:false,
}
const symbol = Symbol("__chainnable__")

const Chainnable = cls => {
    const res = new Proxy(cls, {
        construct: (...args) =>
            new Proxy(Reflect.construct(...args), {
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
    })
    Object.defineProperty(res, symbol, descPreset)
    return res
}

export default Chainnable
