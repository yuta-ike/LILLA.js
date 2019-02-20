import LILLA from "../src/LILLA.js"





class Draggable extends LILLA.OBJECT.RigidObject{
    constructor(...args){
        super(...args)

        this.inputSubject
          .Filter(

          )
          .Subscribe(
              something =>
          )
    }
    update(input,hit){
        if(input.getMouseDown(0) && this.hitArea.includes(input.getMousePos())){

        }
    }
}

export default Draggable

;
