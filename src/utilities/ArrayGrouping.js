import TupleMap from "./TupleMap.js"

export const cart = (itr1, itr2) => {
    const res = []
    for(const value1 of itr1){
        for(const value2 of itr2){
            res.push([value1, value2])
        }
    }
    return res
}

export const comb = (itr, {allowSamePair=false, allowDoubling=false}={}) => {
    const res = []
    const counted = new TupleMap()
    for(const value1 of itr){
        for(const value2 of itr){
            if(!allowSamePair && value1 === value2 || !allowDoubling && counted.get([value1, value2])) continue
            counted.set([value1, value2], true)
            res.push([value1, value2])
        }
    }
    return res
}
