import LILLA from "./LILLA.js"
import Draggable from "./DraggableObject.js"

class TextLabel extends LILLA.OBJECT.RigidObject{
    constructor(name, tag, pos, figure, content, textColor, bgColor){
        super(name, tag, pos, LILLA.SPRITE.Figure(figure, bgColor), figure.copy())
        this.content = content
        this.textColor = textColor
    }
    render(ctx){
        super.render(ctx)
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.fillStyle = this.textColor
        ctx.fillText(this.content, this.g.x, this.g.y)
    }
}

class Panel extends Draggable{
    constructor(...args){
        super(...args)
        this.posMode = "absolute"
    }
    init(){
        const titleLabel = new TextLabel("title", [], [0, 0], LILLA.FIGURE.Rectangle(this.hitArea.width*0.1,this.hitArea.height*0.1,this.hitArea.width*0.8,this.hitArea.height*0.8), "TITLE", "blue", "rgba(0,0,0,00)")
        this.add(titleLabel)
    }
}

class Obj extends LILLA.OBJECT.RigidObject{
    constructor(...args){
        super(...args)
        this.velocity = {x:1,y:1}
    }
    update(){
        this.x += this.velocity.x
        this.y += this.velocity.y
        if(this.x > 200){
            this.velocity.x *= -1
            this.velocity.y *= -1
        }
    }
}
class Obj2 extends LILLA.OBJECT.RigidObject{
    constructor(...args){
        super(...args)
    }
}

LILLA.OBJECT.Define(Panel)
LILLA.OBJECT.Define(TextLabel)
LILLA.OBJECT.Define(Obj)
LILLA.OBJECT.Define(Obj2)

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
                args: ["panel", [], [100, 100], LILLA.SPRITE.Figure(LILLA.FIGURE.Rectangle(0,0,80,50), "rgba(0,0,0,0.1)"), LILLA.FIGURE.Rectangle(0,0,80,50)],
                parent: "main_scene",
                layer: "main_layer",
            })
            .Spawn({
                clsName: "Obj",
                args: ["testObject1", [], [0,0], LILLA.SPRITE.Figure(LILLA.FIGURE.Rectangle(0,0,50,50), "red"), LILLA.FIGURE.Rectangle(0,0,50,50)],
                parent: "main_scene",
                layer: "main_layer",
            })
            .Spawn({
                clsName: "Obj2",
                args: ["testObject2", [], [100,100], LILLA.SPRITE.Figure(LILLA.FIGURE.Rectangle(0,0,50,50), "rgba(0,255,0,0.9)"), LILLA.FIGURE.Rectangle(0,0,50,50)],
                parent: "testObject1",
                layer: "main_layer",
            })
        GAME.Begin()
    })
}
