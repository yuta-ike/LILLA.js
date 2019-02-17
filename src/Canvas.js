import RootClass from "./RootClass.js"
import Module from "./utilities/ModuleBuilder.js"

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

class CanvasManager extends RootClass{
    constructor(){
        super()
        this._usedCanvases = new Map()
    }

    _generate(x,y,width,height){
        const canvas = document.createElement("canvas")
        canvas.style.position = "absolute"
        const body = document.getElementsByTagName("body")[0]
        body.appendChild(canvas)
        return canvas
    }

    getCanvas(layerType,rect){
        if(this._usedCanvases.has(layerType)){
            return this._usedCanvases.get(layerType)
        }else{
            const canvasElement = this._generate(...rect.spread)
            const canvas = new Canvas(canvasElement, rect.duplicate())
            canvas.resize(...rect.spread)
            this._usedCanvases.set(layerType, canvas)
            return canvas
        }
    }
}
export default Module.Singleton(CanvasManager)
