import LILLA from "./LILLA.js"
import Draggable from "./DraggableObject.js"


class Obj1 extends LILLA.OBJECT.RigidObject{
    constructor(...args){
        super(...args)

        // TODO: jumpとかができるように（一度jump関数を実行したらそれ以降自動でupdate時に処理を行い終了すれば処理を終わる仕組み）
        this.addCoroutine((function*(){
            while(true){
                this.x += 1
                this.y += 1
                yield
            }
        }).apply(this), "normal")
    }

    update(...args){
        super.update(...args)
        // this.dispatchCoroutine("normal")
    }
}

class Obj2 extends LILLA.OBJECT.RigidObject{
    constructor(...args){
        super(...args)
        this.posMode = "absolute"
    }
    update(input,hit){
        super.update(input,hit)
    }
}

class Obj3 extends Draggable{
    constructor(...args){
        super(...args)
        this.posMode = "absolute"
    }
}

LILLA.OBJECT.Define(Obj1)
LILLA.OBJECT.Define(Obj2)
LILLA.OBJECT.Define(Obj3)

window.onload = ()=>{
    LILLA.ASSETS.addImages({
        plain: "plain_45.jpg"
    })
    LILLA.ASSETS.loadAll().then(()=>{
        const GAME = LILLA.GAME_CREATER.Create({
            name:"test_game",
            screenRect: LILLA.FIGURE.Rectangle(0,0,500,300),
            pos:[50,50]
        })

        GAME.Scene({
                name: "main_scene"
            })
            .Layer({
                name: "main_layer",
                screenRect: GAME.screenRect,
                priority: 1
            })
            .Layer({
                name: "sub_layer",
                screenRect: GAME.screenRect,
                priority: 0
            })
            .Spawn({
                clsName: "Obj1",
                args: ["obj1", [], [0, 0], LILLA.SPRITE.Figure(LILLA.FIGURE.Circle(0,0,15),"green"), LILLA.FIGURE.Circle(0,0,15)],
                parent: "main_scene",
                layer: "main_layer",
            })
            .Spawn({
                clsName: "Obj2",
                args: ["obj2", [], [100, 100], LILLA.SPRITE.Image(LILLA.ASSETS.get("plain"), LILLA.FIGURE.Rectangle(0,0,30,30), LILLA.FIGURE.Rectangle(0,0,200,200)), LILLA.FIGURE.Rectangle(0,0,30,30)],
                parent: "main_scene",
                layer: "sub_layer",
            })
            .Spawn({
                clsName: "Obj3",
                args: ["obj3", [], [200, 200], LILLA.SPRITE.Figure(LILLA.FIGURE.Rectangle(0,0,50,50),"rgba(0,0,0,0.5)"), LILLA.FIGURE.Rectangle(0,0,50,50)],
                parent: "main_scene",
                layer: "sub_layer",
            })

        GAME.Begin()
    })
}
