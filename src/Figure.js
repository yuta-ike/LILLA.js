import {Interface, mix} from "./utilities/Utilities.js"
import RootClass from "./RootClass.js"
import MathFigure from "./MathFigure.js"

class IFigure extends Interface{
    render(ctx, color = "black", {fill = true} = {}){}
}

class Figure{}

class Rectangle extends mix(MathFigure.Rectangle, Figure, RootClass){
    constructor(x,y,w,h){
        super({
            [MathFigure.Rectangle.name]:[x,y,w,h],
        })
        this.implements(IFigure)
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
}

class Circle extends mix(MathFigure.Circle, Figure, RootClass){
    constructor(x,y,r,{startAngle = 0, endAngle = 2*Math.PI, anticlockwise = false} = {}){
        super({
            [MathFigure.Circle.name]: [x,y,r,{startAngle, endAngle, anticlockwise}]
        })
        this.implements(IFigure)
    }

    render(ctx, color = "black", {fill = true} = {}){
        ctx.beginPath()
        if(fill){
            ctx.fillStyle = color
            ctx.arc(...this.spread, this.startAngle, this.endAngle, this.anticlockwise)
            ctx.fill()
        }else{
            ctx.strokeStyle = color
            ctx.arc(...this.spread, this.startAngle, this.endAngle, this.anticlockwise)
            ctx.stroke()
        }
    }
}

class Compound extends mix(MathFigure.Compound, Figure, RootClass){
    constructor(...figures){
        super(...figures)
        this.implements(IFigure)
    }

    render(...args){
        this.figures.forEach(figure => figure.render(...args))
    }
}

const FIGURE = {
    Define:(newfigure) => {

    },
    Rectangle: (x,y,w,h) => {
        if(w <= 0 || h <= 0) throw new Error(`Width and Height of Rectangle must be positive value. (width:${w}, height:${h})`)
        if(x == null || y == null || w == null || h == null) throw new Error(`Arguments of Figure.Rectangle is(are) nullable. (x:${x}, y:${y}, width:${w}, height:${h})`)
        return new Rectangle(x,y,w,h)
    },
    Circle: (x,y,r,property) => {
        if(r <= 0) throw new Error(`Radius of Circle must be positive value. (radius:${r})`)
        if(x == null || y == null || r == null) throw new Error(`Argument(s) of Figure.Circle is(are) nullable. (x:${x}, y:${y}, radius:${r})`)
        return new Circle(x,y,r,property)
    },
    Compound: (...rendFigures) => {
        if(figures.length == 0) throw new Error(`Argument array of FIGURE.Compound is empty.`)
        const isAllRenderingFigure = rendFigures.reduce((acc, rendFigure) => acc && (rendFigure instanceof Figure), true)
        if(!isAllRenderingFigure) throw new Error(`Each element of argument array of FIGURE.Compound must be RendFigure.`)
    }
}
export default FIGURE

const instanceofFigure = instance => instance instanceof Figure || instance.mixedwith && instance.mixedwith(Figure)
export {instanceofFigure}
