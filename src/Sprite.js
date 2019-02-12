import RootClass from "./RootClass.js"
import {Interface, sgn} from "./utilities/Utilities.js"
import FIGURE, {instanceofFigure} from "./Figure.js"
import assets from "./AssetLoader.js"
export * from "./AssetLoader.js"

//スプライトクラス
class ISprite extends Interface{
    render() {}
}

class ImageSprite extends RootClass{
    constructor(image, figure = null, trim = null){
        super()
        this.implements(ISprite)
        this.image = image
        this.figure = figure || FIGURE.Rectangle(0,0,image.width, image.height) //figureを指定しない場合は元の画像の大きさを採用
        this.trim = trim
    }

    get x(){ return this.figure.x }
    get y(){ return this.figure.y }
    set x(x){ this.figure.x = x }
    set y(y){ this.figure.y = y }

    get width(){ return this.figure.width }
    get height(){ return this.figure.height }
    get spread(){ return this.figure.spread }

    render(ctx){
        if(this.trim != null){
            this.image.render(ctx, ...this.trim.spread, ...this.spread)
        }else{
            this.image.render(ctx, ...this.spread)
        }
    }
}

class FigureSprite extends RootClass{
    constructor(figure, color = "black"){
        super()
        this.implements(ISprite)

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

/*
  Image({url: "plain.jpg"} [,FIGURE.Rectangle(0,0,10,10)])
  or
  assets.addImage("plain","plain.jpg")
  Image("plain" [,FIGURE.Rectangle(0,0,10,10)])
  or
  const img = assets.get("plain")
  Image(img [,FIGURE.Rectangle(0,0,10,10)])
*/

const SPRITE = {
    Image: (image) => {
        if(image == null) throw new Error(`Image is nuaable. (image:${image})`)
        if(!instanceofImageAsset(image)) throw new Error(`Image must be instance of ImageAsset class.`)
        return new ImageSprite(image)
    },
    Image: (...arg) => {
        switch (true) {
            case sgn(arg).is("String"):
            case sgn(arg).is("String","Rectangle"):
            case sgn(arg).is("String","Rectangle","Rectangle"):{
                const imageName = arg[0]
                const image = assets.get(imageName)
                return new ImageSprite(image,...arg.slice(1))
            }
            case sgn(...arg).is("ImageAsset"):
            case sgn(...arg).is("ImageAsset","Rectangle"):
            case sgn(...arg).is("ImageAsset","Rectangle","Rectangle"):{
                const image = arg[0]
                return new ImageSprite(image,...arg.slice(1))
            }
            // case sgn(...arg).is("Object"):{
            //     const url = arg[0].url
            //     if(url == null) break
            //     // const image = assets.getImageOnce(url)
            //     assets.addImage("default", url)
            //     const image = assets.get("default")
            //     return new ImageSprite(image)
            // }
        }
        throw new Error('Argument of SPRITE.Image is invalid.')//Unreachable
    },
    Figure: (figure, color) => {
        if(figure == null) throw new Error(`Figure is nullable. (figure:${figure})`)
        if(!instanceofFigure(figure)) throw new Error(`Figure must be instance of Figure class.`)
        return new FigureSprite(figure, color)
    }
}
export default SPRITE

const instanceofFigureSprite = instance => instance instanceof FigureSprite || instance.mixedwith && instance.mixedwith(FigureSprite)
const instanceofImageSprite = instance => instance instanceof ImageSprite || instance.mixedwith && instance.mixedwith(ImageSprite)
export {instanceofFigureSprite, instanceofImageSprite}
