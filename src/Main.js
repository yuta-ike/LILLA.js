import LILLA from "./LILLA.js"
import Draggable from "./DraggableObject.js"

class TextLabel extends LILLA.OBJECT.RigidObject{
    constructor(name, tag, origin, figure, content, textColor, bgColor){
        super(name, tag, origin, LILLA.SPRITE.Figure(figure, bgColor), figure.copy())
        this.content = content
        this.textColor = textColor
    }
    render(ctx){
        super.render(ctx)
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.fillStyle = this.textColor
        ctx.fillText(this.content, this.hitArea.x, this.hitArea.y)
    }
}

class Panel extends Draggable{
    constructor(...args){
        super(...args)
        this.posMode = "absolute"
        const titleLabel = new TextLabel("title", [], [this.x, this.y], LILLA.FIGURE.Rectangle(this.hitArea.width*0.1,this.hitArea.height*0.1,this.hitArea.width*0.8,this.hitArea.height*0.8), "TITLE", "blue", "rgba(0,0,0,00)")
        this.add(titleLabel)
    }
}


LILLA.OBJECT.Define(Panel)
LILLA.OBJECT.Define(TextLabel)

window.onload = ()=>{
    LILLA.ASSETS.addImages({
        plain: "plain_45.jpg"
    })
    LILLA.ASSETS.loadAll().then(()=>{
        const GAME = LILLA.GAME_CREATER.Create({
            name:"test_game",
            screenRect: LILLA.FIGURE.Rectangle(0,0,500,300),
            pos:[20,20]
        })

        GAME.Scene({
                name: "main_scene"
            })
            .Layer({
                name: "main_layer",
                screenRect: GAME.screenRect,
                priority: 1
            })
            .Spawn({
                clsName: "Panel",
                args: ["panel", [], [20, 20], LILLA.SPRITE.Figure(LILLA.FIGURE.Rectangle(0,0,80,50), "rgba(0,0,0,0.1)"), LILLA.FIGURE.Rectangle(0,0,80,50)],
                parent: "main_scene",
                layer: "main_layer",
            })


        GAME.Begin()
    })
}
