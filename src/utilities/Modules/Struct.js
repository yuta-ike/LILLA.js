const descPreset = {
    value:true,
    writable:false,
    configurable:false,
    enumerable:false,
}
const symbol = Symbol("__struct__")

const Struct = cls => {
    const res = new Proxy(cls, {
        construct: (...args) => {
            return Object.seal(Reflect.construct(...args))
        }
    })
    cls.prototype.copy = function(){return Object.assign({}, this)}
    Object.defineProperty(res, symbol, descPreset)
    return res
}

export default Struct
