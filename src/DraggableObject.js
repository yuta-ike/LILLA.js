import LILLA from "./LILLA.js"
import {Subject, ReactiveProperty} from "./Rx.js"

class Draggable extends LILLA.OBJECT.RigidObject{
    constructor(...args){
        super(...args)

        const offset = {}
        let isGrabbing = false
        this.InputAsObservable = new Subject()
        this.HitAsObservable = new Subject()

        this.InputAsObservable
            .filter(_ => isGrabbing)
            .filter(input => input.getMouse(0) && !input.getMouseDown(0))
            .map(input => input.getMousePos())
            .subscribe(pos => {
                this.g.x = pos.x - offset.x
                this.g.y = pos.y - offset.y
                console.log(this.g.x, this.sprite.x)
            })
        this.InputAsObservable
            .filter(input => input.getMouseDown(0))
            .filter(input => this.hitArea.includes(input.getMousePos().x, input.getMousePos().y))
            .subscribe(input => {
                isGrabbing = true
                offset.x = input.getMousePos().x - this.g.x
                offset.y = input.getMousePos().y - this.g.y
            })
        this.InputAsObservable
            .filter(_ => isGrabbing)
            .filter(input => input.getMouseUp(0))
            .subscribe(_ => isGrabbing = false)

        // this.InputAsObservable
            // .subscribe(_ => console.log(this.hitArea))
    }

    update(input,hit){
        this.InputAsObservable.next(input)
        this.HitAsObservable.next(hit)
    }
}

export default Draggable

;
