class Interface{
    error(){ throw new Error("Method must be overloaded") }
}

class InterfaceAcceptable{
    implements(itf){
        const itfMethodsNames = Object.getOwnPropertyNames(itf.prototype)
        const clsMethodsNames = Object.getOwnPropertyNames(this.constructor.prototype)
        for(const methodName of itfMethodsNames){
            if(!clsMethodsNames.includes(methodName)){
                throw new Error(`"${methodName}" method must be overloaded`)
            }
        }
    }
}

export default Interface
export {InterfaceAcceptable}
