import {sgn} from "./utilities/Utilities.js"
import OBJECT from "./ObjectBuilder.js"

import LayerManager from "./Layer.js"
import InputReceiver from "./Input.js"
import SceneManager from "./Scene.js"

/*Gameクラスはchildrenを持たない（代わりにSceneManager、LayerManager）*/
class Game extends OBJECT.GameObject{
    constructor(name, tag, screenRect, [x=0, y=0]=[]){
        super(name, tag, [0, 0], {origin:[x,y]})
        this.name = name
        this.screenRect = screenRect
    }
    add(){
        throw new Error("Game Instance cannot be added any objects, except Scene Generating. Use generateScene method")
    }
    remove(){
        throw new Error("Game Instance cannot be added any objects, except Scene Generating. Use generateScene method")
    }

    // set(obj, parentName, layerName){
    //     const parent = this.findObjectWithName(parentName)
    //     const layer = this.findObjectWithName(layerName, layer => layer.isLayer)
    //     if(parent == null) throw new Error(`Unknown parent object named "${parentName}"`)
    //     if(layer == null) throw new Error(`Unknown layer object named "${layerName}"`)
    //     parent.add(obj)
    //     layer.add(obj)
    // }
    set({clsName, args, parent, layer}){
        const _parent = this.findObjectWithName(parent)
        const _layer = this.findObjectWithName(layer, _layer => _layer.isLayer)
        if(_parent == null) throw new Error(`Unknown parent object named "${_parent}"`)
        if(_layer == null) throw new Error(`Unknown layer object named "${_parent}"`)
        const obj = OBJECT.Create({clsName, args})
        _parent.add(obj)
        _layer.add(obj)
    }

    findObjectWithName(targetName, rest = x => x){
        const result =  SceneManager.values.reduce((acc,child) => acc || child.findObjectWithName(targetName), null)
                      ||LayerManager.values.reduce((acc,child) => acc || child.findObjectWithName(targetName), null)
        if(rest(result)) return result
        console.warn(`Cannot find object named "${targetName}"`)
        return null
    }

    generateScene(name, tag, rect = this.screenRect, priority){
        return SceneManager.generate(name, tag, rect, priority, {origin:[this.g.x,this.g.y]})
    }

    generateLayer(name, tag, rect = this.screenRect, priority = 0, layerType = "normal"){
        return LayerManager.generate(name, tag, rect, priority, layerType)
    }

    begin(){
        this._initAll()
        requestAnimationFrame(this._loop.bind(this))
    }

    _initAll(){
        SceneManager.scenes.forEach(scene => scene.initAll())
        LayerManager.layers.forEach(layer => layer.initAll())
    }

    _loop(timestamp){
        const elapsedTime = timestamp - this.prev_timestamp
        const accuracy = 0.9
        const frameTime = 1 / this.maxFps * accuracy

        if(elapsedTime <= frameTime){
            requestAnimationFrame(this._loop.bind(this))
        }

        const currentFps = 1 / elapsedTime
        this._step()
        requestAnimationFrame(this._loop.bind(this))
    }

    _step(){
        //update
        const input = InputReceiver.getInfo()
        SceneManager.scenes.forEach(scene => {if(scene.isActive) scene.updateAll(input)})

        //hitTest
        this._hitTest()

        //lateUpdate


        //layerclear
        LayerManager.values.filter(layer => layer.type === "normal").forEach(layer => layer.clear())
        //render
        LayerManager.valuesOrderd.forEach(([name,layer]) => {if(layer.type === "normal" && layer.isActive)layer.renderAll()})
    }

    _hitTest(){
        SceneManager.scenes.forEach(scene => scene.hitTest())
    }
}

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
// let instance;
// Game.Create = function(){console.log("create!!")}
// const GAME = new Proxy(Game, {
//     get: (target, property, receiver) => {
//         if(!hasConstructed){
//             if(property === "Create"){
//                 hasConstructed = true
//                 return Reflect.get(target, property, receiver)
//             }
//             throw new Error(`Call create method before call another method.`)
//         }else{
//             if(property === "Create"){
//                 throw new Error("Invalid function call of constructor-like method. Constructor-like method (Create) can be called only at once.")
//             }
//             return Reflect.get(target, property, receiver)
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
