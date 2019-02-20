import {CC} from "./utilities/Utilities.js"
import Interface, {InterfaceAcceptable} from "./utilities/Interface.js"
import Point from "./Point.js"

//Interface
class Figure extends InterfaceAcceptable{
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
        throw new Error(`Such figure do not support hitTest.`)
    }
}

class IFigure extends Interface{
    includes(){}
    copy(){}
}

class Rectangle extends Figure{
    constructor(x,y,width,height){
        super()
        // this.implements(IFigure)

        this.x = x
        this.y = y
        Object.defineProperty(this, "width" , {value:width })
        Object.defineProperty(this, "height", {value:height})
    }
    includes(x,y){
        return this.x <= x && x <= this.x + this.width &&
               this.y <= y && y <= this.y + this.height
    }

    get spread(){
        return [this.x, this.y, this.width, this.height]
    }

    copy(){
        return new Rectangle(this.x, this.y, this.width, this.height)
    }
}

class Circle extends Figure{
    constructor(x,y,radius, {fill = true, startAngle = 0, endAngle = 2*Math.PI, anticlockwise = false} = {}){
        super()
        // this.implements(IFigure)

        this.x = x
        this.y = y
        Object.defineProperty(this, "radius"       , {value:radius       })
        Object.defineProperty(this, "fill"         , {value:fill         })
        Object.defineProperty(this, "startAngle"   , {value:startAngle   })
        Object.defineProperty(this, "endAngle"     , {value:endAngle     })
        Object.defineProperty(this, "anticlockwise", {value:anticlockwise})
    }
    includes(x,y){
        return Point.distSqrd(x,y,this.x,this.y) <= this.radius ** 2
    }

    get spread(){
        return [this.x, this.y, this.radius]
    }

    copy(){
        return new Circle(this.x,this.y,this.r, {fill: this.fill, startAngle:this.startAngle, endAngle:this.endAngle, anticlockwise:this.anticlockwise})
    }
}

class Compound extends Figure{
    constructor(...figures){
        super()
        // this.implements(IFigure)

        this.figures = figures
    }
    includes(...args){
        return this.figures.reduce((acc, c) => acc || c.includes(...args), false)
    }
    copy(){
        const figures = this.figures.reduce((acc, c) => acc.push(c.copy()), [])
        return new Compound(...figures)
    }
}

// const FIGURE = {
//     Rectangle: (...args) => {
//         return new Rectangle(...args)
//     },
//     Circle: (...args) => {
//         return new Rectangle(...args)
//     },
//     Compound: (...args) => {
//         return new Rectangle(...args)
//     }
// }
export default {Rectangle, Circle, Compound}
