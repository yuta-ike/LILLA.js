import OBJECT from "./ObjectBuilder.js"
import * as Module from "./utilities/ModuleBuilder.js"

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
            this._scenes.get(sceneName).deactivate()
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

export default Module.Singleton(SceneManager)
