import * as Module from "./utilities/ModuleBuilder.js"

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

export default Module.Struct(InputInfo)
