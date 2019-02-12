import {cart} from "./ArrayGrouping.js"

const mix = (...clsList) => {
    clsList.reverse()
    return class VirtualMixedClass{
        constructor(args = {}){
            for(const cls of clsList){
                //Methodのコピー
                const desc = Object.getOwnPropertyDescriptors(cls.prototype)
                delete desc.constructor
                for(const [x,y] of cart(Object.keys(desc), Object.keys(Object.getOwnPropertyDescriptors(this.constructor.prototype)))){
                    // if(x === y) console.warn(`Same method name ${x} when mixing ${clsList.map(cls => cls.name).toString().replace(/(?:.+){0,0},(?=[^,]+)/g, " and ").replace(/(?:.+){0,0} and (?=[^,]+)/, ", ")}`)
                }
                Object.defineProperties(this.constructor.prototype, desc)

                //propertyのコピー
                //abstract class は直接インスタンス化できないので継承させてからインスタンス化させる
                const instance = new class temp extends cls{
                    constructor(){
                        super(...(args[cls.name] || []))
                    }
                }
                const props = Object.getOwnPropertyDescriptors(instance)
                for(const [x,y] of cart(Object.keys(props), Object.keys(Object.getOwnPropertyDescriptors(this)))){
                    // if(x === y) console.warn(`Same property name ${x} when mixing ${clsList.map(cls => cls.name).toString().replace(/(?:.+){0,0},(?=[^,]+)/g, " and ").replace(/(?:.+){0,0} and (?=[^,]+)/, ", ")}`)
                }
                Object.defineProperties(this, props)
            }
        }

        mixedwith(cls){
            return Boolean(this instanceof cls || clsList.reduce((acc, c) => c.mixedwith && c.mixedwith(cls)/*c.isMixed*/ ||
                           (new class temp extends c{
                              constructor(){ super() }
                           }) instanceof cls || acc, false))
        }
    }
}

export default mix

//うまくいかないので無し
// class ComponentManager{
//     constructor(){
//         // TODO: これMap?
//         this.constructor._attachedComponents = this.constructor._attachedComponents || new Set()
//     }
//
//     attach(component, ...arg){
//         //エラーチェック
//         if(this.isAttached(component)) return
//         if(!arg == null && component.lenght > 0) console.warn(`Component "${component.name}" need ${component.length} arguments, but defined 0 arguments`)
//         if(component.length !== arg.length) console.warn(`Component "${component.name}" need ${component.length} arguments, but defined ${Object.keys(arg).length} arguments`)
//
//         this._attach(component, ...arg)
//     }
//
//     _attach(component, ...arg){
//         if(this.isAttached(component)) return
//         this.constructor._attachedComponents.add(component)
//
//         //Property
//         const newProperties = Object.getOwnPropertyDescriptors(new component(...arg))
//         // attach文をコンストラクタの最初に置くなら不必要。最後に置くなら必要？
//         // newPropertiesとObject.getOwnPropertyDescriptors(this)から重複するkeyを取り出し、そのkeyに対応する要素をnewPropertiesから削除
//         ;[...(new Set(
//             [...Object.keys(newProperties), ...Object.keys(Object.getOwnPropertyDescriptors(this))].filter(
//                 (element, index, array) => { return array.indexOf(element) != array.lastIndexOf(element) }
//             )
//         ))]
//         .forEach(
//             element => { delete newProperties[element] }
//         )
//         Object.defineProperties(this, newProperties)
//
//
//         // Methods
//         const newMethodsNames = Object.getOwnPropertyNames(component.prototype).filter(element => element != "constructor")
//         newMethodsNames.forEach(
//             methodName => {
//                 if(this[methodName] == null){
//                 // if(this.constructor.protoMethod(methodName) == null){
//                     const method = Object.getOwnPropertyDescriptor(component.prototype, methodName)
//                     Object.defineProperty(this.constructor.prototype, methodName, method)
//                 }else{
//                     const tmp = this[methodName]
//                     // const tmp = this.protoMethod(methodName)
//                     this.constructor.prototype[methodName] = function(...arg){
//                         component.prototype[methodName].apply(this,arg)
//                         tmp.apply(this,arg)
//                     }
//                 }
//             }
//         )
//
//         ////重複分
//         // ;[...Object.keys(newMethods), ...Object.keys(Object.getOwnPropertyDescriptors(this.constructor.prototype))]
//         // .filter(
//         //     (element, index, array) => array.indexOf(element) == index && index != array.lastIndexOf(element)
//         // )
//         // .forEach(
//         //     element => {
//         //         const tmp = this.constructor.prototype[element]
//         //         this.constructor.prototype[element] = function(...arg){
//         //             component.prototype[element].apply(this,arg)
//         //             tmp.apply(this,arg)
//         //         }
//         //     }
//         // )
//         //
//         // // 非重複分
//         // ;[...Object.keys(newMethods)]
//         // .filter(
//         //     (element, index, array) => !Object.keys(Object.getOwnPropertyDescriptors(this.constructor.prototype)).includes(element)
//         // )
//         // .forEach(
//         //     element => Object.defineProperty(this.constructor.prototype, element, newMethods[element])
//         // )
//     }
//
//     static protoMethod(prop){
//         if(this.constructor.prototype[prop] != null) return this.constructor.prototype[prop]
//         for(const cls of this.attachedComponents || []){
//             const tmp = cls.prototype.protoMethod(prop)
//             if(tmp != null) return tmp
//         }
//         return null
//     }
//
//     static protoMethodsArray(prop){
//         if(this[prop] != null) return this[prop]
//         const result = []
//         for(const cls of this.attachedComponents || []){
//             const tmp = cls.prototype.protoMethod[prop]
//             if(tmp != null) result.push(tmp)
//         }
//         return result
//     }
//
//     static get attachedComponents(){
//         return this.constructor._attachedComponents
//     }
//
//     static set attachedComponents(x){
//         throw new Error("illegal operation")
//     }
//
//     // TODO: 要テスト
//     static get attachedComponentsNames(){
//         return this.attachedComponents.map(element => element.name)
//     }
//
//     isAttached(component){
//         return this.constructor._attachedComponents.has(component)
//     }
// }
//
// const mix = function(...cls){
//     return class extends ComponentManager{
//         constructor(arg = []){
//             super()
//             for(const c of cls){
//                 if(c.length == 0){
//                     this._attach(c)
//                 }else if(!(c.name in arg)){
//                     console.warn(`Arguments of mixed class "${c.name}" is not defined`)
//                     this._attach(c)
//                 }else if(c.length !== Object.keys(arg[c.name]).length){
//                     console.warn(`Mixed class "${c.name}" need ${c.length} arguments, but defined ${Object.keys(arg[c.name]).length} arguments`)
//                     this._attach(c, ...arg[c.name])
//                 }else{
//                     this._attach(c, ...arg[c.name])
//                 }
//             }
//         }
//
//         mixedwith(otherClass){
//             if(this instanceof otherClass) return true
//             for(const c of cls){
//                 const cInstance = new c()
//                 if(cInstance.mixedwith && cInstance.mixedwith(otherClass) || cInstance instanceof otherClass) return true
//             }
//             return false
//         }
//     }
// }
//
// export {ComponentManager, mix}
