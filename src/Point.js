class Point{
    constructor(x,y,comment){
        this.x = x
        this.y = y
        if(comment) this.comment = comment
    }
}

const P = (x,y) => Object.freeze(new Point(x,y))
export default P
export const isPoint = obj => obj instanceof Point
