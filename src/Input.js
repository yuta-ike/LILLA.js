import * as Module from "./utilities/ModuleBuilder.js"

class InputReceiver{
    constructor(target, receiverObject){
        const mouse = ["mousedown", "mouseup"]
        const cursor = ["mouseenter","mousemove","mouseleave"]
        const click = ["dblclick"]
        const touch = ["touchstart","touchmove","touchend"]
        const key = ["keydown", "keyup"]

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

        const uiEvents = [...mouse, ...cursor, ...click, ...touch, ...key]
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

export default Module.Singleton(InputReceiver)
