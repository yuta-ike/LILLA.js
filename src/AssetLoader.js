import RootClass from "./RootClass.js"

class ImageAsset extends RootClass{
    constructor(image){
        super()
        this.image = image
        this.url = image.url
    }
    get width(){ return this.image.width }
    get height(){ return this.image.height }

    render(ctx, ...args){
        ctx.drawImage(this.image, ...args)
    }
}

class SoundAsset extends RootClass{

}

export default new class AssetLoader{
    constructor(){
        this._promises = []
        this._assets = new Map()
    }

    addImage(name, url){
        const image = new Image()
        image.src = url
        const promise = new Promise((resolve, reject) =>
            image.addEventListener('load', () => {
                this._assets.set(name, new ImageAsset(image))
                resolve(image)
            })
        )
        this._promises.push(promise)
    }

    addImages(imgs){
        Object.entries(imgs).forEach(([name, url]) => this.addImage(name, url))
    }

    loadAll(){
        return Promise.all(this._promises).then(() => this._assets).catch((e) => console.log(e))
    }

    get(name){
        return this._assets.get(name)
    }


    // getImageOnce(){
        //
    // }
}

const instanceofImageAsset = instance => instance instanceof ImageAsset || instance.mixedwith && instance.mixedwith(ImageAsset)
const instanceofSoundAsset = instance => instance instanceof SoundAsset || instance.mixedwith && instance.mixedwith(SoundAsset)

export {instanceofImageAsset, instanceofSoundAsset}
