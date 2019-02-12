"use strict"
//無名クラスの場合は "" が返る
const getType = function(target){
    if(arguments.length == 0) throw new Error("Argument is empty!!")
    const type = Object.prototype.toString.call(target)
    const result = type.slice(8,-1)
    return result == "Object" ? target.constructor.name : result;
}

class Signature extends Array{
    equal(...arg){
        const array = sgn(...arg)
        if(array.length != this.length) return false
        for(let i = 0; i < this.length; i++){
            if(this[i] != array[i]) return false
        }
        return true
    }

    is(...arg){
        if(arg.length != this.length) return false
        for(let i = 0; i < this.length; i++){
            if(this[i] != arg[i]) return false
        }
        return true
    }
}

const sgn = function(...args){
    const sgn = []
    for(const arg of args){
        sgn.push(getType(arg))
    }
    return new Signature(...sgn)
}
export default sgn
// console.log(sgn(0,"0",true).equal(1,"a",false)) //true
// console.log(sgn(0,"0",true).is("Number","String","Boolean")) //true
