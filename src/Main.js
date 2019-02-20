import LILLA from "./LILLA.js"



class Subject{
    constructor(){
        this.next = data => this.nextSubject.next(data)
        this.err = err => this.nextSubject.err(err)
        this.complete = comp => this.nextSubject.complete(comp)
    }
    subscribe(nextProcess, errProcess = err => console.warn(err), compProcess = msg => console.log(msg)){
        this.next = data => {
            if(!this.hasCompleted) nextProcess(data)
            else console.warn("Next method is uneffectable.")
        }
        this.err = err => errProcess(err)
        this.complete = msg => {
            this.hasCompleted = true
            compProcess(msg)
        }
    }

    from(argArr){
        this.nextSubject = new Subject()
        argArr.forEach(element => this.nextSubject.next(element))
        this.nextSubject.complete()
        return this.nextSubject
    }

    filter(process){
        this.next = data => {
            if(process(data)) this.nextSubject.next(data)
        }
        return this.nextSubject = new Subject()
    }

    do(process){
        this.next = data => {
            process(data)
            this.nextSubject.next(data)
        }
        return this.nextSubject = new Subject()
    }

    // map関連
    map(mapFunc){
        this.next = data => this.nextSubject.next(data.map(mapFunc))
        return this.nextSubject = new Subject()
    }
    select(selFunc){ return this.map(selFunc) } //alias
    mapTo(value){
        this.map(() => value)
    }

    //scan
    scan(scanFunc, seed){
        let acc = seed
        let index = 0
        this.next = data => {
            const newValue = scanFunc(acc, data, index)
            this.nextSubject.next(newValue)
            acc = newValue
            index++
        }
        return this.nextSubject = new Subject()
    }

    skip(skipNum){
        let num = 0
        this.next = data => {
            if(num >= skipNum){
                this.nextSubject.next(data)
            }
            num++
        }
        return this.nextSubject = new Subject()
    }

    take(takeNum){
        let num = 0
        this.next = data => {
            if(num < takeNum){
                this.nextSubject.next(data)
            }else{
                this.nextSubject.complete()
            }
            num++
        }
        return this.nextSubject = new Subject()
    }

    distinctUntilChanged(init = Symbol()/*他のいかなる値とも違う値*/){
        let prevData = init
        this.next = data => {
            if(prevData !== data){
                this.nextSubject.next(data)
                prevData = data
            }
        }
        return this.nextSubject = new Subject()
    }

    //combination系
}


const subject = new Subject()
{
    subject
        .distinctUntilChanged()
        .subscribe(x => console.log(x))
}
{
    // subject.next(0)
    // subject.next(1)
    // subject.next(2)
    // subject.next(3)
    // subject.next(4)
    // subject.complete("")
    subject.from([0,1,2,3])
}







console.log("=======================================")

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
LILLA.OBJECT.Define(Obj1)
LILLA.OBJECT.Define(Obj2)

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

        GAME.Begin()
    })
}
