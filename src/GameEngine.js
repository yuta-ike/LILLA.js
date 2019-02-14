import "./SetExtension.js"
import FIGURE from "./Figure.js"
import assets from "./AssetLoader.js"
import SPRITE from "./Sprite.js"
import OBJECT from "./ObjectBuilder.js"
import GAME_CREATER from "./GameBuilder.js"

class Obj1 extends OBJECT.RigidObject{
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
        this.dispatchCoroutine("normal")
    }
}

class Obj2 extends OBJECT.RigidObject{
    constructor(...args){
        super(...args)
        this.posMode = "absolute"
    }
    update(...args){
        super.update(...args)
        // console.log(args[1])
    }
}

OBJECT.Define(Obj1)
OBJECT.Define(Obj2)

window.onload = ()=>{
    assets.addImage("plain","plain_45.jpg")
    assets.loadAll().then(()=>{

        //従来の書き方
        // const game = new Game("test_game", [], FIGURE.Rectangle(0,0,500,300),[50,50])
        // const obj1 = new Obj1("obj1", [], [0, 0], SPRITE.Figure(FIGURE.Circle(0,0,15),"green"), FIGURE.Circle(0,0,15))
        // const obj2 = new Obj2("obj2", [], [100, 100], SPRITE.Image(assets.get("plain"), FIGURE.Rectangle(0,0,30,30), FIGURE.Rectangle(0,0,200,200)), FIGURE.Rectangle(0,0,30,30))
        // game.set(obj1, "main_scene", "main_layer")
        // game.set(obj2, "main_scene", "sub_layer")

        const GAME = GAME_CREATER.Create({
            name:"test_game",
            screenRect: FIGURE.Rectangle(0,0,500,300),
            pos:[50,50]
        })

        GAME.generateScene("main_scene",[])
        GAME.generateLayer("main_layer",[], GAME.screenRect,1)
        GAME.generateLayer("sub_layer",[], GAME.screenRect,0)
        GAME.set({
            clsName: "Obj1",
            args: ["obj1", [], [0, 0], SPRITE.Figure(FIGURE.Circle(0,0,15),"green"), FIGURE.Circle(0,0,15)],
            parent: "main_scene",
            layer: "main_layer",
        })
        GAME.set({
            clsName: "Obj2",
            args: ["obj2", [], [100, 100], SPRITE.Image(assets.get("plain"), FIGURE.Rectangle(0,0,30,30), FIGURE.Rectangle(0,0,200,200)), FIGURE.Rectangle(0,0,30,30)],
            parent: "main_scene",
            layer: "sub_layer",
        })
        GAME.begin()
    })
}


;
