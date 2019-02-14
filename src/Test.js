//従来の書き方
class Obj1 extends RigidObject{
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

class Obj2 extends RigidObject{
    constructor(...args){
        super(...args)
        this.posMode = "absolute"
    }
    update(...args){
        super.update(...args)
    }
}


window.onload = ()=>{
    assets.addImage("test","plain_45.jpg")
    assets.loadAll().then((a)=>{
    })

    const game = new Game("test_game", [], new Rectangle(0,0,500,300),[50,50])
    const scene = game.generateScene("main_scene",[])
    const layer = game.generateLayer("main_layer",[])
    const obj1 = new Obj1("obj1", [], [0, 0], new FigureSprite(new Rectangle(0,0,30,30),"green"), new Rectangle(0,0,30,30))
    const obj2 = new Obj2("obj2", [], [100, 100], new FigureSprite(new Rectangle(0,0,30,30),"orange"), new Rectangle(0,0,30,30))
    game.set(obj1, "main_scene", "main_layer")
    game.set(obj2, "obj1", "main_layer")
    game.begin()
}






//テストコード




// const uiEvents = ["mousedown", "mouseup",
//                   "mouseenter",/*"mousemove",*/"mouseleave",
//                   "click","dblclick",
//                   "touchstart","touchmove","touchend",
//                   "keydown", "keyup"]
// for(const uiEvent of uiEvents){
//     window.addEventListener(uiEvent, e => {e.preventDefault();console.log(uiEvent,e)})
// }






;
