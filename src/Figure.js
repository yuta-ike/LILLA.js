import {Interface, mix, CC} from "./utilities/Utilities.js"
import RootClass from "./RootClass.js"

class Figure{
    hitTest(other){
        return CC.cart(this.figures || [this], other.figures || [other])
                 .reduce((acc, [thisFigure, otherFigure]) => acc || thisFigure._hitTestForUnits(otherFigure), false)
    }
    _hitTestForUnits(other){
        switch ([this.constructor.name, other.constructor.name].join("-")) {
            case "Rectangle-Rectangle":
                const x = this.x <= other.x && other.x <= this.x + this.width ||
                          this.x <= other.x + other.width && other.x + other.width <= this.x + this.width
                const y = this.y <= other.y && other.y <= this.y + this.height ||
                          this.y <= other.y + other.height && other.y + other.height <= this.y + this.height
                return x && y

            case "Circle-Circle":
                return (this.x - other.x)**2 + (this.y - other.y)**2 < (this.r - other.r)**2

            case "Rectangle-Circle":
            case "Circle-Rectangle":
                const [rect, circle] = this.constructor.name === "rect" ? [this, other] : [other, this]
                const vertRect =  rect.x            < circle.x && circle.x < rect.x + rect.w ||
                                  rect.y - circle.r < circle.y && circle.y < rect.y + rect.h + circle.r
                const horizRect = rect.x - circle.r < circle.x && circle.x < rect.x + rect.w + circle.r ||
                                  rect.y            < circle.y && circle.y < rect.y + rect.h
                const corner = (rect.x          - circle.x)**2 + (rect.y          - circle.y)**2 < circle.r**2 ||
                               (rect.x + rect.w - circle.x)**2 + (rect.y          - circle.y)**2 < circle.r**2 ||
                               (rect.x          - circle.x)**2 + (rect.y + rect.h - circle.y)**2 < circle.r**2 ||
                               (rect.x + rect.w - circle.x)**2 + (rect.y + rect.h - circle.y)**2 < circle.r**2
                return vertRect || horizRect || corner
        }
    }
}

class IFigure extends Interface{
    render(ctx, color = "black", {fill = true} = {}){}
}

class Rectangle extends mix(Figure, RootClass){
    constructor(x,y,w,h){
        super()
        this.implements(IFigure)

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

    duplicate(){ return new Rectangle(this.x, this.y, this.width, this.height) }

    get spread(){ return [this.x, this.y, this.width, this.height] }
    get w(){ return this.width }
    get h(){ return this.height }
}

class Circle extends mix(Figure, RootClass){
    constructor(x,y,r,{fill = true, startAngle = 0, endAngle = 2*Math.PI, anticlockwise = false} = {}){
        super()
        this.implements(IFigure)

        this.x = x
        this.y = y
        this.radius = r
        this.startAngle = startAngle
        this.endAngle = endAngle
        this.anticlockwise = anticlockwise
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
    get spread(){ return [this.x, this.y, this.r] }
    get r(){ return this.radius }
}

class Compound extends mix(Figure, RootClass){
    constructor(...figures){
        super()
        this.figures = figures
    }
    render(...args){
        this.figures.forEach(figure => figure.render(...args))
    }
}

const FIGURE = {
    // add:(newfigure) => {
    //
    // }
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
}
export default FIGURE

const instanceofFigure = instance => instance instanceof Figure || instance.mixedwith && instance.mixedwith(Figure)
export {instanceofFigure}
