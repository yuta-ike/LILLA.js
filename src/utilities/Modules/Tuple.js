const descPreset = {
    value:true,
    writable:false,
    configurable:false,
    enumerable:false,
}
const symbol = Symbol("__tuple__")

const Tuple = cls => {
    const res = new Proxy(cls, {
        construct: (...args) => {
            return Object.freeze(Reflect.construct(...args))
        }
    })
    cls.prototype.copy = function(){return Object.assign({}, this)}
    Object.defineProperty(res, symbol, descPreset)
    return res
}

export default Tuple
