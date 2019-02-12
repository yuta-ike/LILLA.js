const Pair = class{
    constructor(){
        this.pairList = new Map()
    }
    getId(keys){
        const res = Array.from(this.pairList.keys()).find(pair => pair[0] === keys[0] && pair[1] === keys[1] || pair[0] === keys[1] && pair[1] === keys[0]) || null
        if(res){
            return this.pairList.get(res)
        }else{
            const sym = Symbol()
            this.pairList.set(keys, sym)
            return sym
        }
    }
}

export default class TupleMap extends Map{
    constructor(...args){
        super(...args)
        this.pair = new Pair()
    }
    delete(keys){ return super.delete(this.pair.getId(keys)) }
    entries(){ return new Map(Array.from(this.keys()).map(key => [key, this.get(key)])).entries() }
    forEach(callbackFn, thisArg){ return super.forEach((v, key, obj) => callbackFn.apply(thisArg, [v, this.pair(key), obj])) }
    get(keys){ return super.get(this.pair.getId(keys)) }
    has(keys){ return super.has(this.pair.getId(keys)) }
    keys(){ return this.pair.pairList.keys() }
    set(keys, value){ return super.set(this.pair.getId(keys), value) }
    values(){ return super.values() }
}
