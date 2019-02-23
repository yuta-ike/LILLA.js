import GameObject from "./GameObject.js"

class RigidObject extends GameObject{
    constructor(name, tag, [x=0,y=0]=[], sprite, hitArea, {isStatic = false} = {}){
        super(name, tag, [x, y])

        this.sprite = sprite
        this.hitArea = hitArea
        this.isStatic = isStatic

        this.addEventListener("setx", () => this.sprite.x = this.hitArea.x = this.g.x)
        this.addEventListener("sety", () => this.sprite.y = this.hitArea.y = this.g.y)

        this.isRigid = true//本来書きたくない
    }
    init(){
        this.sprite.x = this.hitArea.x = this.g.x
        this.sprite.y = this.hitArea.y = this.g.y
    }

    setOrigin([x,y]){
        super.setOrigin([x,y])
        if(this.constructor.name == "TextLabel"){
            console.log(this.origin.x,this.origin.y)
            console.trace()
        }

        this.sprite.x = this.hitArea.x = this.g.x
        this.sprite.y = this.hitArea.y = this.g.y
    }

    render(ctx){
        this.sprite.render(ctx)
    }
}

export default RigidObject
export const   instanceofRigidObject = instance => instance instanceof RigidObject || instance.mixedwith && instance.mixedwith(RigidObject)
