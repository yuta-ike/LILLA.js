"use strict"
import "./TupleMap.js"
import "./Mixin.js"
import "./Interface.js"
// TODO: privateへの対応
// TODO: Rectangle Circleのmask

// TODO: キャンバスの前後関係

// TODO: inputは座標をlocalizeして使わないといけない

// TODO: Scene間の当たり判定は行わない
// TODO: 当たり判定精度上げる

// TODO: frozen sealed(overloadの禁止)


/*こういう拡張あり？*/
Set.prototype.filter = function(...args){ return Array.from(this).filter(...args) }
Set.prototype.reduce = function(...args){ return Array.from(this).reduce(...args) }

const cart = (itr1, itr2) => {
    const res = []
    for(const value1 of itr1){
        for(const value2 of itr2){
            res.push([value1, value2])
        }
    }
    return res
}

const comb = (itr, {allowSamePair=false, allowDoubling=false}={}) => {
    const res = []
    const counted = new TupleMap()
    for(const value1 of itr){
        for(const value2 of itr){
            if(!allowSamePair && value1 === value2 || !allowDoubling && counted.get([value1, value2])) continue
            counted.set([value1, value2], true)
            res.push([value1, value2])
        }
    }
    return res
}

//EventDispatcherクラス
class EventDispatcher{
    constructor(){
        this._events = new Map()
    }

    addEventListener(type, callback, {once = false} = {}){
        if(!this._events.has(type)){
            this._events.set(type,[])
        }
        this._events.get(type).push({callback, once})
    }

    dispatchEvent(type, args){
        const events = this._events.get(type) || []
        events.forEach(info => {
            info.callback(args)
            if(info.once){
                this._events.delete(info)
            }
        })
    }

    getAllEvents(type = null){
        return type != null ? this._events: this._events.get(type)
    }
}

// class CoroutineDispatcher{
//     constructor(){
//         this._coroutines = new Map()
//     }
//
//     addCoroutine(generator, type){
//         if(!this._coroutines.has(type)){
//             this._coroutines.set(type,[])
//         }
//         this._coroutines.get(type).push(generator)
//     }
//
//     dispatchCoroutine(type){
//         const generators = this._coroutines.get(type) || []
//         generators.forEach(generator => generator.next())
//     }
// }


class RootClass extends mix(ComponentManager, InterfaceAcceptable, EventDispatcher/*, CoroutineDispatcher*/){
    log(...strs){
        const str = strs.reduce((acc,c) => `${acc}, ${c}`)
        console.log(`${name(this)} : ${this.name} : ${str}`)
    }

    constructor(){
        super()
        this._coroutines = new Map()
    }

    addCoroutine(generator, type){
        if(!this._coroutines.has(type)){
            this._coroutines.set(type,[])
        }
        this._coroutines.get(type).push(generator)
    }

    dispatchCoroutine(type){
        const generators = this._coroutines.get(type) || []
        generators.forEach(generator => generator.next())
    }
}
new RootClass()

const name = instanceOrClass => (typeof instanceOrClass) === "object" ? instanceOrClass.constructor.name : instanceOrClass.name

//Mathクラス
class IFigure extends Interface{
    render(){}
}


class Figure extends Abstract{
    constructor(){
        super()
        // this.sealed = ["hitTest"]
    }
    hitTest(other){
        switch ([name(this),name(other)].join("-")) {
            case "Rectangle-Rectangle":
                const x = this.x <= other.x && other.x <= this.x + this.width ||
                          this.x <= other.x + other.width && other.x + other.width <= this.x + this.width
                const y = this.y <= other.y && other.y <= this.y + this.height ||
                          this.y <= other.y + other.height && other.y + other.height <= this.y + this.height
                return x && y
            case "Circle-Circle":
                //...
                return

            case "Rectangle-Circle":
            case "Circle-Rectangle":

                //...
                return
        }
    }
}

class Rectangle extends Figure/*mix(Figure, RootClass)*/{
    constructor(x,y,w,h){
        super()
        // this.implements(IFigure)

        this.x = x
        this.y = y
        this.width = w
        this.height = h
    }

    render(ctx, color = "black", {fill = true} = {}){
        if(fill){
            ctx.fillStyle = color
            ctx.fillRect(...this.spread)
        }else{
            ctx.strokeStyle = color
            ctx.strokeRect(...this.spread)
        }
    }

    duplicate(){
        return new Rectangle(...this.spread)
    }

    get spread(){ return [this.x, this.y, this.width, this.height] }
    get w(){ return this.width }
    get h(){ return this.height }
}

class Circle extends Figure/*mix(Figure, RootClass)*/{
    constructor(x,y,r,{fill = true, startAngle = 0, endAngle = 2*Math.PI, anticlockwise = false} = {}){
        super()
        // this.implements(IFigure)

        this.x = x
        this.y = y
        this.radius = r
        this.startAngle = startAngle
        this.endAngle = endAngle
        this.anticlockwise = anticlockwise
    }

    render(ctx, {color = "black",fill = true} = {}){
        ctx.beginPath()
        if(fill){
            ctx.fillStyle = color
            ctx.arc(...this.spread, this.startAngle, this.endAngle, this.anticlockwise)
            ctx.fill()
        }else{
            ctx.strokeStyle = color
            ctx.arc(...this.spread, this.startAngle, this.endAngle, this.anticlockwise)
            ctx.strokeRect(...this.spread)
        }
    }
    get spread(){ return [this.x, this.y, this.r] }
    get w(){ return this.width }
    get h(){ return this.height }
}

// TODO: シングルトン化
class AssetLoader{
    constructor(){
        this._promises = []
        this._assets = new Map()
    }

    addImage(name, url){
        const image = new Image()
        image.src = url

        const promise = new Promise((resolve, reject) =>
            image.addEventListener('load', (e) => {
                this._assets.set(name, new ImageAsset(image))
                resolve(image)
            })
        )

        this._promises.push(promise)
    }

    loadAll(){
        return Promise.all(this._promises).then(() => this._assets)
    }

    get(name){
        return this._assets.get(name)
    }
}
const assets = new AssetLoader()


//アセット関係
//Imageクラス
class ImageAsset extends RootClass{
    constructor(image, url){
        super()
        this.image = image
        this.url = image.url
    }
    render(ctx, ...args){
        ctx.drawImage(this.image, ...args)
    }
}

//Soundクラス
//class SoundAsset extends RootClass{
//}


//スプライトクラス
class ISprite extends Interface{
    render() {}
}

class ImageSprite extends RootClass{
    constructor(image){
        this.implements(ISprite)
        super()

        this.image = image
    }

    get x(){ return this._x }
    get y(){ return this._y }
    set x(x){ this._x = x }
    set y(y){ this._y = y }

    get width(){ return this.image.width }
    get height(){ return this.image.height }
    get spread(){ return [this.x,this.y,width,height] }

    render(ctx){
        console.log("render")
        this.image.render(ctx, ...this.spread)
    }
}

class FigureSprite extends RootClass{
    constructor(figure, color){
        super()
        // this.implements(ISprite)

        this.figure = figure
        this.color = color
    }

    get x(){ return this.figure.x }
    get y(){ return this.figure.y }
    set x(x){ this.figure.x = x }
    set y(y){ this.figure.y = y }

    get width(){ return this.figure.width }
    get height(){ return this.figure.height }
    get spread(){ return this.figure.spread }

    render(ctx){
        this.figure.render(ctx, this.color)
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
        comb(rigidChildren).forEach(([child1, child12]) => {
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



// class SpriteObject extends GameObject{
//     constructor(name, tag, x, y, width, height, sprite){
//         super(name, tag)
//         this.sprite = sprite
//     }
//     render(ctx){
//         this.sprite.render(ctx)
//     }
// }

class RigidObject extends GameObject{
    constructor(name, tag, [x=0,y=0]=[], sprite, hitArea, {isStatic = false} = {}){
        super(name, tag, [x, y])

        this.sprite = sprite
        this.hitArea = hitArea
        this.isStatic = isStatic

        this.addEventListener("setx", () => this.sprite.x = this.hitArea.x = this.g.x)
        this.addEventListener("sety", () => this.sprite.y = this.hitArea.y = this.g.y)
        this.addEventListener("originchange",
            () => [this.sprite.x, this.sprite.y] = [this.hitArea.x, this.hitArea.y] = [this.g.x, this.g.y])
    }

    init(){
        this.sprite.x = this.hitArea.x = this.g.x
        this.sprite.y = this.hitArea.y = this.g.y
    }

    render(ctx){
        this.sprite.render(ctx)
    }
}

class Scene extends GameObject{
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

class Canvas extends RootClass{
    constructor(canvasElement, figure){
        super()
        this.canvasElement = canvasElement
        this.ctx = canvasElement.getContext("2d")
        this.figure = figure
    }

    resize(x,y,width,height){
        this.canvasElement.style.left = x
        this.canvasElement.style.top = y
        this.canvasElement.width = width
        this.canvasElement.height = height
    }

    get width (){ return this.canvasElement.width  }
    get height(){ return this.canvasElement.height }
    set width (v){ this.canvasElement.width  = v }
    set height(v){ this.canvasElement.height = v }

}

class Counter{
    constructor(init = 0){this.value = init}
    inc(){this.value += 1}
    dec(){this.value -= 1}
    iszero(){return this.value === 0}
    get v(){return this.value}
}

class CanvasManager extends RootClass{
    constructor(){
        super()
        this._usedCanvases = new Set()
        this._sparedCanvases = new Set()
        this._garbageCollection = new Map()
    }

    _generate(x,y,width,height){
        const canvas = document.createElement("canvas")
        canvas.style.position = "absolute"
        const body = document.getElementsByTagName("body")[0]
        body.appendChild(canvas)
        return canvas
    }

    getCanvas(layerType,rect){
        if(!this._garbageCollection.has(layerType)) this._garbageCollection.set(layerType, new Counter(0))
        this._garbageCollection.get(layerType).inc()

        if(this._sparedCanvases.size > 0){
            const canvasElement = this._sparedCanvases.values().next()
            const canvas = new Canvas(canvasElement, rect.duplicate())
            this._sparedCanvases.delete(canvas)
            this._usedCanvases.add(canvas)
            return canvas
        }else{
            const canvasElement = this._generate(...rect.spread)
            const canvas = new Canvas(canvasElement, rect.duplicate())
            canvas.resize(...rect.spread)
            this._usedCanvases.add(canvas)
            return canvas
        }
    }

    release(layerType, canvas){
        this._garbageCollection.get(layerType).dec()
        if(this._garbageCollection.get(layerType).iszero()){
            this._usedCanvases.remove(canvas)
            this._sparedCanvases.add(canvas)
        }
    }
}

class InputReceiver{
    constructor(target, receiverObject){
        const mouse = ["mousedown", "mouseup"]
        const cursor = ["mouseenter","mousemove","mouseleave"]
        const click = ["dblclick"]
        const touch = ["touchstart","touchmove","touchend"]
        const key = ["keydown", "keyup"]
        const uiEvents = [...mouse, ...cursor, ...click, ...touch, ...key]

        this._mouseMap = new Map()
        this._prevMouseMap = new Map()
        this._cursorMap = new Map()
        this._prevCursorMap = new Map()
        this._clickMap = new Map()
        this._prevClickMap = new Map()
        this._touchMap = new Map()
        this._prevTouchMap = new Map()
        this._keyMap = new Map()
        this._prevKeyMap = new Map()

        const dispatch = (uiEvent, e) => {
            switch (true) {
              case mouse.includes(uiEvent):{
                  if(uiEvent === "mousedown"){
                      this._mouseMap.set(e.button, true)
                  }else if(uiEvent === "mouseup"){
                      this._mouseMap.set(e.button, false)
                  }
              }
              break
              case cursor.includes(uiEvent):
                  if(uiEvent === "mouseenter"){
                      this._cursorMap.set("over", true)
                  }else if(uiEvent === "mouseleave"){
                      this._cursorMap.set("over", false)
                  }else if(uiEvent === "mousemove"){
                      this._cursorMap.set("pos", {x:e.pageX, y:e.pageY})
                  }
                  break
              case click.includes(uiEvent):
                  if(uiEvent === "dblclick"){
                      this._clickMap.set("dblclick",true)
                  }
                  break
              case touch.includes(uiEvent):
                  if(uiEvent === "touchstart"){
                      this._touchMap.set("touch", true)
                  }else if(uiEvent === "touchend"){
                      this._touchMap.set("touch", false)
                  }else if(uiEvent === "touchmove"){
                      this._touchMap.set("pos", {x:e.pageX, y:e.pageY})
                  }
                  break
              case key.includes(uiEvent):
                  if(uiEvent === "keydown"){
                      this._keyMap.set(e.key, true)
                  }else if(uiEvent === "keyup"){
                      this._keyMap.set(e.key, false)
                  }
                  break;
              default:
            }
        }

        for(const uiEvent of uiEvents){
            window.addEventListener(uiEvent, e => dispatch(uiEvent, e))
        }
    }

    getInfo(){
        const res = new InputInfo(this._mouseMap, this._prevMouseMap,
                                  this._cursorMap, this._prevCursorMap,
                                  this._clickMap, this._prevClickMap,
                                  this._touchMap, this._prevTouchMap,
                                  this._keyMap, this._prevKeyMap)

        this._prevMouseMap = new Map(this._mouseMap)
        this._prevCursorMap = new Map(this._cursorMap)
        this._prevClickMap = new Map(this._clickMap)
        this._prevTouchMap = new Map(this._touchMap)
        this._prevKeyMap = new Map(this._keyMap)

        this._clickMap = new Map()
        return res
    }
}


//InputReceiverの返り値として
class InputInfo{
    constructor(mouseMap, prevMouseMap, cursorMap, prevCursorMap, clickMap, prevClickMap,touchMap, prevTouchMap, keyMap, prevKeyMap){
        this.mouseMap = mouseMap
        this.prevMouseMap = prevMouseMap
        this.cursorMap = cursorMap
        this.prevCursorMap = prevCursorMap
        this.clickMap = clickMap
        this.prevClickMap = prevClickMap
        this.touchMap = touchMap
        this.prevTouchMap = prevTouchMap
        this.keyMap = keyMap
        this.prevKeyMap = prevKeyMap
    }

    getKey(key){
        return this.keyMap.get(key)
    }
    getKeyDown(key){
        return !this.prevKeyMap.get(key) && this.keyMap.get(key)
    }
    getKeyUp(key){
        return this.prevKeyMap.get(key) && !this.keyMap.get(key)
    }

    getMouse(mouseId){
        return this.mouseMap.get(mouseId)
    }
    getMouseDown(mouseId){
        return !this.prevMouseMap.get(mouseId) && this.mouseMap.get(mouseId)
    }
    getMouseUp(mouseId){
        return this.prevMouseMap.get(mouseId) && !this.mouseMap.get(mouseId)
    }
    getMousePos(){
        return this.cursorMap.get("pos")
    }
    getMouseOver(){
        return this.cursorMap.get("over")
    }
    getMouseEnter(){
        return !this.prevCursorMap.get("over") && this.cursorMap.get("over")
    }
    getMouseOut(){
        return this.prevCursorMap.get("over") && !this.cursorMap.get("over")
    }
    /* touchイベント */
}

class LayerManager extends RootClass{
    constructor(){
        super()
        this.cm = new CanvasManager()
        this._layers = new Map()
    }

    generate(name,tag,rect,layerType/*static UIなど。更新頻度に応じて*/,priority){
        const canvas = this.cm.getCanvas(layerType, rect)
        const newLayer = new Layer(name, rect, canvas, layerType, priority)
        newLayer.addEventListener("destroy", () => this.cm.release(layerType, canvas))
        this._layers.set(name, newLayer)
        return newLayer
    }

    get layers(){ return this._layers }
    get entries(){ return Array.from(this._layers.entries()) }
    get keys()   { return Array.from(this._layers.keys()) }
    get values() { return Array.from(this._layers.values()) }

    get valuesOrderd(){
        return Array.from(this._layers).sort(([k1,v1], [k2,v2]) => v2.priority - v1.priority)
    }
}

class Layer extends GameObject{
    constructor(name, rect, canvas, layerType, priority = 0){
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
}

/*Gameクラスはchildrenを持たない（代わりにSceneManager、LayerManager）*/
class Game extends GameObject{
    constructor(name, tag, screenRect, [x=0, y=0]=[]){
        super(name, tag, [0, 0], {origin:[x,y]})
        this.name = name
        this.screenRect = screenRect

        this.sm = new SceneManager()
        this.lm = new LayerManager()
        this.ir = new InputReceiver()
    }

    add(){
        throw new Error("Game Instance cannot be added any objects, except Scene Generating. Use generateScene method")
    }
    remove(){
        throw new Error("Game Instance cannot be added any objects, except Scene Generating. Use generateScene method")
    }

    set(obj, parentName, layerName){
        const parent = this.findObjectWithName(parentName)
        const layer = this.findObjectWithName(layerName, layer => layer instanceof Layer)
        if(parent == null) throw new Error(`Unknown parent object named "${parentName}"`)
        if(layer == null) throw new Error(`Unknown layer object named "${layerName}"`)
        parent.add(obj)
        layer.add(obj)
    }

    findObjectWithName(targetName, rest = x => x){
        const result =  this.sm.values.reduce((acc,child) => acc || child.findObjectWithName(targetName), null)
                      ||this.lm.values.reduce((acc,child) => acc || child.findObjectWithName(targetName), null)
        if(rest(result)) return result
        console.warn(`Cannot find object named "${targetName}"`)
        return null
    }

    generateScene(name, tag, rect = this.screenRect, priority){
        return this.sm.generate(name, tag, rect, priority, {origin:[this.g.x,this.g.y]})
    }

    generateLayer(name, tag, rect = this.screenRect, layerType = "normal", priority = 0){
        return this.lm.generate(name, tag, rect, layerType, priority)
    }

    begin(){
        this._initAll()
        requestAnimationFrame(this._loop.bind(this))
    }

    _initAll(){
        this.sm.scenes.forEach(scene => scene.initAll())
        this.lm.layers.forEach(layer => layer.initAll())
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
        const input = this.ir.getInfo()
        this.sm.scenes.forEach(scene => {if(scene.isActive) scene.updateAll(input)})

        //hitTest
        this._hitTest()

        //lateUpdate


        //canvasclear
        this.lm.values.filter(layer => layer.type === "normal").forEach(layer => layer.clear())
        //render
        this.lm.valuesOrderd.forEach(([name,layer]) => {if(layer.isActive) layer.renderAll()})
    }

    _hitTest(){
        this.sm.scenes.forEach(scene => scene.hitTest())
    }
}






;
