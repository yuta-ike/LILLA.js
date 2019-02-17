import RootClass from "./RootClass.js"
import CanvasManager from "./Canvas.js"
import Module from "./utilities/ModuleBuilder.js"

class HitRecorder{
    constructor(){
        this._hitMap = new Map()
        this._prevHitMap = new Map()
    }
    record(counter, hitInfo){
        this._hitMap.set(counter, hitInfo)
    }
    getHit(){
        const res = new Hit(this._hitMap,this._prevHitMap)
        this._prevHitMap = new Map(this._hitMap)
        this._hitMap = new Map()
        return res
    }
}

class HitInfo{
    constructor(hitType){
        this.hitType = hitType
    }
}

class Hit{
    constructor(hitMap, prevHitMap){
        this.hitMap = hitMap
        this.prevHitMap = prevHitMap
    }
    getHit(obj){
        return this.hitMap(obj)
    }
    getHitEnter(obj){
        return this.hitMap(obj) && !this.prevHitMap(obj)
    }
    getHitExit(obj){
        return !this.hitMap(obj) && this.prevHitMap(obj)
    }
}

class GameObject extends RootClass{
    constructor(name, tag = [], [x=0,y=0]=[], {active=true, origin=[0,0]}={}){
        super()
        this.name = name
        this.tag = new Set(tag)
        this._active = active
        this.children = new Set()

        this.posMode = "relative" /* or "absolute" */

        this.origin = Object.seal({x:origin[0], y:origin[1]})
        //通常はlocal、gを使えばglobal
        this._x = x
        this._y = y
        this.g = new Proxy({x:this.x, y:this.y}, {
            get: (_, name) =>{
                if(!this.origin.hasOwnProperty(name)) throw new Error(`Unknown property "${name}" of origin`)
                return this["_"+name] + this.origin[name]
            },
            set: (_, name, value) => this["_"+name] = value - this.origin[name]
        })

        this.hr = new HitRecorder()
    }

    get x(){ return this._x }
    get y(){ return this._y }
    set x(v){
        this._x = v
        this.dispatchEvent("setx")
        this.children.filter(child => child.posMode === "relative").forEach(child => child.setOrigin([this.g.x,this.g.y]))
    }
    set y(v){
        this._y = v
        this.dispatchEvent("sety")
        this.children.filter(child => child.posMode === "relative").forEach(child => child.setOrigin([this.g.x,this.g.y]))
    }

    hasTag(tag){
        return this.tag.has(tag)
    }

    add(obj, parentObj){
        this.children.add(obj)
        if(!(this instanceof Layer)) obj.setOrigin([this.g.x, this.g.y])
        obj.addEventListener("spawn", newObj => this.children.add(newObj))
        obj.addEventListener("destroy", () => this.children.delete(obj))
    }

    setOrigin([x,y]){
        this.origin.x = x
        this.origin.y = y
        this.dispatchEvent("originchange")
        this.children.filter(child => child.posMode === "relative").forEach(child => child.setOrigin([x,y]))
    }

    remove(obj){
        if(!this.children.has(obj)) console.warn(`GameObject ${obj} is not children of GameObject ${this}`)
        delete this.children.delete(obj)
    }

    findObjectWithName(targetName){
        if(this.name === targetName) return this
        return this.children.reduce((acc, child) => acc || child.findObjectWithName(targetName), null)
    }

    destroy(childrenDestroy = true){
        this.dispatchEvent("destroy")
        if(!childrenDestroy){
            this.children.forEach(child => this.dispatchEvent("spawn", child))
        }
    }

    initAll(){
        this.init()
        this.children.forEach( childObj => childObj.initAll() )
    }

    init(){}

    updateAll(input){
        const hit = this.hr.getHit()

        this.update(input, hit)
        this.children.forEach( childObj => childObj.updateAll(input) )
    }

    update(input, hit){}

    renderAll(ctx){
        this.render(ctx)
        this.children.forEach( childObj => childObj.renderAll(ctx) )
    }

    render(ctx){}

    hitTest(){
        const rigidChildren = this.children.filter(child => child instanceof RigidObject)
        comb(rigidChildren).forEach(([child1, child2]) => {
            const hit = child1.hitArea.hitTest(child2.hitArea)
            if(hit){
                //内包しているかの確認
                child1.hit(child2, new HitInfo("sibling"))
                child2.hit(child1, new HitInfo("sibling"))
            }
        })

        /* childにヒットテストを行い、返り値として、child以下の（childを含まない）オブジェクト全体の配列を受け取る。
           reduceでその配列を結合する。 */
        const rigidProgeny = this.children.reduce((acc, child) => [...acc, ...child.hitTest()], [])
        /* 直下のchildと孫以下のprogeny間のヒットテストを行う */
        cart(rigidChildren, rigidProgeny).forEach(([prog1, prog2]) => {
            const hit = prog1.hitArea.hitTest(prog2.hitArea)
            if(hit){
                prog1.hit(prog2, new HitInfo("child"))
                prog2.hit(prog1, new HitInfo("parent"))
            }
        })

        /* 自分の子オブジェクトの全体の配列を返す（自分を含まない） */
        return [...rigidChildren, ...rigidProgeny]
    }

    hit(counter, hitInfo){
        this.hr.record(counter, hitInfo)
    }

    get isActive(){ return this._active }
    activate(){ this._active = true }
    deactivate(){ this._active = false }
}

class Layer extends GameObject{
    constructor(name, rect, canvas, priority = 0, layerType){
        super(name,[],[rect.x, rect.y])
        this.name = name
        this.rect = rect
        this.canvas = canvas
        this._type = layerType
        this.priority = priority
    }

    renderAll(){
        if(this.isActive){
            this.children.forEach( childObj => childObj.renderAll(this.canvas.ctx) )
        }
    }

    clear(){
        const ctx = this.canvas.ctx
        ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    get type(){ return this._type }
    get isLayer(){ return true }
}

class LayerManager extends RootClass{
    constructor(){
        super()
        this._layers = new Map()
    }

    generate(name,tag,rect,priority,layerType/*static UIなど。更新頻度に応じて*/){
        const canvas = CanvasManager.getCanvas(layerType, rect)
        const newLayer = new Layer(name, rect, canvas, priority, layerType)
        this._layers.set(name, newLayer)
        return newLayer
    }

    get layers(){ return this._layers }
    get entries(){ return Array.from(this._layers.entries()) }
    get keys()   { return Array.from(this._layers.keys()) }
    get values() { return Array.from(this._layers.values()) }

    get valuesOrderd(){
        return Array.from(this._layers).sort(([k1,v1], [k2,v2]) => v1.priority - v2.priority)
    }
}

export default Module.Singleton(LayerManager)
