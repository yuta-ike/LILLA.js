import {sgn} from "./utilities/Utilities.js"
import Game from "./Game.js"

let hasCreated = false
const GAME_CREATER = {
    Create({name, tag=[], screenRect, pos=[0,0]}){
        if(hasCreated) throw new Error(`It is forbidden to create game more than once.`)
        if(name == null) throw new Error(`Invalid argument of GAME.Create. (name: ${name})`)
        if(screenRect == null) throw new Error(`Invalid argument of GAME.Create. (screenRect: ${screenRect})`)
        if(!sgn(screenRect).is("Rectangle")) throw new Error(`Invalid argument of GAME.Create. screenRect parameter must be Rectangle class. (screenRect: ${screenRect})`)
        hasCreated = false

        return new Game(name, tag, screenRect, pos)
    }
}

// let hasConstructed = false
// let instance
// Game.Create = function(){console.log("create!!")}
// const GAME = new Proxy(Game, {
//     get: (target, property) => {
//         if(!hasConstructed){
//             if(property === "Create"){
//                 hasConstructed = true
//                 return (args) => instance = new target(args.name, [], args.screenRect, args.pos)
//             }
//             throw new Error(`Call create method before call another method.`)
//         }else{
//             if(property === "Create"){
//                 throw new Error("Invalid function call of constructor-like method. Constructor-like method (Create) can be called only at once.")
//             }
//             return Reflect.get(instance, property)
//         }
//     },
// })
/*
  GAME.Create()
  GAME.generateScene()
  ...
  みたいに書きたい
*/
export default GAME_CREATER
