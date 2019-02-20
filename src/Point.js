class Point{
    constructor(x,y,comment){
        this.x = x
        this.y = y
        if(comment) this.comment = comment
    }

    static distSqrd(x1,y1,x2,y2){
        return (x1-x2)**2 + (y1-y2)**2
    }

    static dist(x1,y1,x2,y2){
        return Math.sqrt(Point.distSqrd(x1,y1,x2,y2))
    }
}

const P = (x,y) => Object.freeze(new Point(x,y))
export default P
export const isPoint = obj => obj instanceof Point
