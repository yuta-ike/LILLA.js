import {mix, CC, Interface} from "./utilities/Utilities.js"

import "./SetExtension.js"
import FIGURE from "./Figure.js"
import assets from "./AssetLoader.js"
import SPRITE from "./Sprite.js"
import OBJECT from "./ObjectBuilder.js"

import LayerManager from "./Layer.js"
import InputReceiver from "./Input.js"

class Scene extends OBJECT.GameObject{
    constructor(name, tag, rect, priority=0,{origin}){
        super(name, tag, [0, 0], {origin})
        this.rect = rect
        this.priority = priority
    }
}

class SceneManager{
    constructor(){
        this._scenes = new Map()
    }

    generate(name, tag, rect, priority, {origin}){
        if(this._scenes.has(name)) throw new Error(`Scene name ${name} has already used`)

        const newScene = new Scene(name, tag, rect, priority, {origin})
        newScene.addEventListener("transferscene", sceneName => {
            newScene.deactivate();
            this._scenes.get(sceneName).activate()
        })
        newScene.addEventListener("activatescene", sceneName => {
            this._scenes.get(sceneName).activate()
            return this._scenes.get(sceneName)
        })
        newScene.addEventListener("deactivatescene", sceneName => {
            this._scenes.get(sceneName).activate()
            return this._scenes.get(sceneName)
        })

        this._scenes.set(name,newScene)
        this.currentSceneName = this.currentSceneName || name
        return newScene
    }

    get scenes(){ return this._scenes }
    get entries(){ return Array.from(this._scenes.entries()) }
    get keys()   { return Array.from(this._scenes.keys())}
    get values() { return Array.from(this._scenes.values())}
    get scenesOrderd(){
        return Array.from(this._scenes).sort(([k1,v1], [k2,v2]) => v2.priority - v1.priority)
    }
}

/*Gameクラスはchildrenを持たない（代わりにSceneManager、LayerManager）*/
class Game extends OBJECT.GameObject{
    constructor(name, tag, screenRect, [x=0, y=0]=[]){
        super(name, tag, [0, 0], {origin:[x,y]})
        this.name = name
        this.screenRect = screenRect

        this.sm = new SceneManager()
        // this.ir = new InputReceiver()
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
        const result =  this.sm.values.reduce((acc,child) => acc || child.findObjectWithName(targetName), null)
                      ||LayerManager.values.reduce((acc,child) => acc || child.findObjectWithName(targetName), null)
        if(rest(result)) return result
        console.warn(`Cannot find object named "${targetName}"`)
        return null
    }

    generateScene(name, tag, rect = this.screenRect, priority){
        return this.sm.generate(name, tag, rect, priority, {origin:[this.g.x,this.g.y]})
    }

    generateLayer(name, tag, rect = this.screenRect, priority = 0, layerType = "normal"){
        return LayerManager.generate(name, tag, rect, priority, layerType)
    }

    begin(){
        this._initAll()
        requestAnimationFrame(this._loop.bind(this))
    }

    _initAll(){
        this.sm.scenes.forEach(scene => scene.initAll())
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
        this.sm.scenes.forEach(scene => {if(scene.isActive) scene.updateAll(input)})

        //hitTest
        this._hitTest()

        //lateUpdate


        //layerclear
        LayerManager.values.filter(layer => layer.type === "normal").forEach(layer => layer.clear())
        //render
        LayerManager.valuesOrderd.forEach(([name,layer]) => {if(layer.type === "normal" && layer.isActive)layer.renderAll()})
    }

    _hitTest(){
        this.sm.scenes.forEach(scene => scene.hitTest())
    }
}

//=============================================================================

class Obj1 extends OBJECT.RigidObject{
    constructor(...args){
        super(...args)

        // TODO: jumpとかができるように（一度jump関数を実行したらそれ以降自動でupdate時に処理を行い終了すれば処理を終わる仕組み）
        this.addCoroutine((function*(){
            while(true){
                this.x += 1
                this.y += 1
                yield
            }
        }).apply(this), "normal")
    }

    update(...args){
        super.update(...args)
        this.dispatchCoroutine("normal")
    }
}

class Obj2 extends OBJECT.RigidObject{
    constructor(...args){
        super(...args)
        this.posMode = "absolute"
    }
    update(...args){
        super.update(...args)
        // console.log(args[1])
    }
}

OBJECT.Define(Obj1)
OBJECT.Define(Obj2)

window.onload = ()=>{
    assets.addImage("plain","plain_45.jpg")
    assets.loadAll().then(()=>{
        const game = new Game("test_game", [], FIGURE.Rectangle(0,0,500,300),[50,50])
        const scene = game.generateScene("main_scene",[])
        const layer = game.generateLayer("main_layer",[],game.screenRect,1)
        const layer2 = game.generateLayer("sub_layer",[],game.screenRect,0)
        // const obj1 = new Obj1("obj1", [], [0, 0], SPRITE.Figure(FIGURE.Circle(0,0,15),"green"), FIGURE.Circle(0,0,15))
        // const obj2 = new Obj2("obj2", [], [100, 100], SPRITE.Image(assets.get("plain"), FIGURE.Rectangle(0,0,30,30), FIGURE.Rectangle(0,0,200,200)), FIGURE.Rectangle(0,0,30,30))
        // game.set(obj1, "main_scene", "main_layer")
        // game.set(obj2, "main_scene", "sub_layer")

        game.set({
            clsName: "Obj1",
            args: ["obj1", [], [0, 0], SPRITE.Figure(FIGURE.Circle(0,0,15),"green"), FIGURE.Circle(0,0,15)],
            parent: "main_scene",
            layer: "main_layer",
        })
        game.set({
            clsName: "Obj2",
            args: ["obj2", [], [100, 100], SPRITE.Image(assets.get("plain"), FIGURE.Rectangle(0,0,30,30), FIGURE.Rectangle(0,0,200,200)), FIGURE.Rectangle(0,0,30,30)],
            parent: "main_scene",
            layer: "sub_layer",
        })
        game.begin()
    })
}


;
